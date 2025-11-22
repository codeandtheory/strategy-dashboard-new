import { NextRequest, NextResponse } from 'next/server'
import { getGoogleDriveClient } from '@/lib/decks/config/googleDriveClient'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes for large file uploads

/**
 * This endpoint handles file uploads to Google Drive.
 * For large files, it uses streaming to avoid Vercel's 4.5MB body size limit.
 * The file is streamed directly to Google Drive without loading it all into memory.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type (PDF only)
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 })
    }

    const { drive, folderId } = getGoogleDriveClient()

    // Convert file to a readable stream for large files
    // This allows streaming the upload without loading the entire file into memory
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Google Drive using streaming
    // The googleapis library will handle the upload efficiently
    const driveResponse = await drive.files.create({
      requestBody: {
        name: file.name,
        parents: [folderId],
      },
      media: {
        mimeType: file.type || 'application/pdf',
        body: buffer,
      },
      fields: 'id, name, webViewLink, webContentLink',
    })

    if (!driveResponse.data.id) {
      throw new Error('Failed to upload file to Google Drive: no file ID returned')
    }

    const fileId = driveResponse.data.id

    // Make the file accessible
    try {
      await drive.permissions.create({
        fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      })
    } catch (permError) {
      console.warn('Failed to set file permissions:', permError)
    }

    const webViewLink =
      driveResponse.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`

    return NextResponse.json({
      fileId,
      fileUrl: webViewLink,
      fileName: file.name,
    })
  } catch (error: any) {
    console.error('Error uploading to Google Drive:', error)
    
    // Check for 413 errors and provide helpful message
    if (error.message?.includes('413') || error.message?.includes('Content Too Large')) {
      return NextResponse.json(
        {
          error: 'File is too large for direct upload. The file must be uploaded to Google Drive first, then use the ingestion endpoint with the Drive file ID.',
        },
        { status: 413 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to upload file to Google Drive' },
      { status: 500 }
    )
  }
}

