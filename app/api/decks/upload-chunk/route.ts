import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 300

/**
 * Step 2: Upload file chunk to Google Drive using resumable URL
 * This endpoint proxies the upload to Google Drive to avoid CORS issues
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const uploadUrl = formData.get('uploadUrl') as string
    const file = formData.get('file') as File
    const startByte = formData.get('startByte') as string
    const endByte = formData.get('endByte') as string

    if (!uploadUrl || !file) {
      return NextResponse.json(
        { error: 'uploadUrl and file are required' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Google Drive using resumable URL
    const headers: HeadersInit = {
      'Content-Type': file.type || 'application/pdf',
    }

    // If this is a chunked upload, add Content-Range header
    if (startByte && endByte) {
      const fileSize = formData.get('fileSize') as string
      headers['Content-Range'] = `bytes ${startByte}-${endByte}/${fileSize}`
    } else {
      // Full file upload
      headers['Content-Length'] = buffer.length.toString()
    }

    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers,
      body: buffer,
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      throw new Error(`Google Drive upload failed: ${uploadResponse.status} ${errorText}`)
    }

    // If upload is complete (status 200 or 201), return the file ID
    if (uploadResponse.status === 200 || uploadResponse.status === 201) {
      const result = await uploadResponse.json()
      return NextResponse.json({
        success: true,
        fileId: result.id,
        fileUrl: `https://drive.google.com/file/d/${result.id}/view`,
      })
    }

    // If upload is in progress (status 308), return the range that was uploaded
    if (uploadResponse.status === 308) {
      const range = uploadResponse.headers.get('Range')
      return NextResponse.json({
        success: true,
        inProgress: true,
        range,
      })
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error: any) {
    console.error('Error uploading chunk to Google Drive:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload file to Google Drive' },
      { status: 500 }
    )
  }
}

