import { NextRequest, NextResponse } from 'next/server'
import { getGoogleDriveClient } from '@/lib/decks/config/googleDriveClient'
import { google } from 'googleapis'

export const runtime = 'nodejs'

/**
 * Create a resumable upload session for Google Drive.
 * This allows large files to be uploaded directly from the client to Google Drive,
 * bypassing Vercel's 4.5MB body size limit.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const fileName = body.fileName as string
    const mimeType = body.mimeType || 'application/pdf'
    const fileSize = body.fileSize as number | null

    if (!fileName) {
      return NextResponse.json({ error: 'fileName is required' }, { status: 400 })
    }

    const { drive, folderId } = getGoogleDriveClient()

    // Get the auth instance to get access token
    const auth = (drive as any).context._options.auth
    
    // Get access token
    const tokenResponse = await auth.getAccessToken()
    const accessToken = tokenResponse.token

    // Create the file metadata
    const metadata = {
      name: fileName,
      parents: [folderId],
    }

    // Create resumable upload session using Google Drive API
    // POST to the resumable upload endpoint
    const resumableUrl = `https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable`
    
    const sessionResponse = await fetch(resumableUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Type': mimeType,
        ...(fileSize ? { 'X-Upload-Content-Length': fileSize.toString() } : {}),
      },
      body: JSON.stringify(metadata),
    })

    if (!sessionResponse.ok) {
      const errorText = await sessionResponse.text()
      throw new Error(`Failed to create upload session: ${sessionResponse.status} ${errorText}`)
    }

    // Get the resumable upload URL from the Location header
    const uploadUrl = sessionResponse.headers.get('Location')
    
    if (!uploadUrl) {
      throw new Error('No upload URL returned from Google Drive')
    }

    return NextResponse.json({
      uploadUrl,
      fileName,
      mimeType,
    })
  } catch (error: any) {
    console.error('Error creating upload session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create upload session' },
      { status: 500 }
    )
  }
}


