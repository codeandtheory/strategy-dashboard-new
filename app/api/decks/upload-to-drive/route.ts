import { NextRequest, NextResponse } from 'next/server'
import { uploadFileToDrive } from '@/lib/decks/services/googleDriveService'

export const runtime = 'nodejs'
export const maxDuration = 60 // 1 minute for Drive upload

// This endpoint just uploads to Google Drive - no size limit from Vercel
// The file goes directly to Drive, bypassing Vercel's 4.5MB body limit
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

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Google Drive
    const driveResult = await uploadFileToDrive({
      fileName: file.name,
      mimeType: file.type || 'application/pdf',
      buffer,
    })

    return NextResponse.json({
      fileId: driveResult.fileId,
      fileUrl: driveResult.webViewLink,
      fileName: file.name,
    })
  } catch (error: any) {
    console.error('Error uploading to Google Drive:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload file to Google Drive' },
      { status: 500 }
    )
  }
}

