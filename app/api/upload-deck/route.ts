import { NextRequest, NextResponse } from 'next/server'
import { getDriveFileMetadata } from '@/lib/decks/services/googleDriveDownloadService'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes for processing large PDFs

export async function POST(request: NextRequest) {
  try {
    // Parse JSON body (expecting Google Drive file ID)
    const body = await request.json()
    const gdriveFileId = body.gdrive_file_id as string | null

    if (!gdriveFileId) {
      return NextResponse.json(
        { error: 'Google Drive file ID is required. Upload the file to Drive first using /api/decks/upload-to-drive, or provide gdrive_file_id in the request body.' },
        { status: 400 }
      )
    }

    // Get file metadata from Google Drive
    const fileMetadata = await getDriveFileMetadata(gdriveFileId)

    // Validate file type (PDF only)
    if (fileMetadata.mimeType !== 'application/pdf' && !fileMetadata.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 })
    }

    // Note: Deck processing is handled via n8n workflow
    // This endpoint currently just validates and returns file metadata
    return NextResponse.json({
      fileId: gdriveFileId,
      fileName: fileMetadata.name,
      fileUrl: fileMetadata.webViewLink,
      message: 'File uploaded successfully. Processing will be added later.',
    })
  } catch (error: any) {
    console.error('Error uploading deck:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload and process deck' },
      { status: 500 }
    )
  }
}

