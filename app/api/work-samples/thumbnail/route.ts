import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Proxy endpoint to serve work sample thumbnails
 * This bypasses authentication issues with Supabase storage
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const url = searchParams.get('url')
    
    if (!url) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    // Extract the file path from the Supabase storage URL
    // URL format: https://{project}.supabase.co/storage/v1/object/public/work-sample-thumbnails/{path}
    const urlObj = new URL(url)
    const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/work-sample-thumbnails\/(.+)/)
    
    if (!pathMatch) {
      // If it's not a Supabase storage URL, try to fetch it directly
      const response = await fetch(url, {
        headers: {
          'Referer': urlObj.origin,
        },
      })
      
      if (!response.ok) {
        return NextResponse.json(
          { error: `Failed to fetch image: ${response.statusText}` },
          { status: response.status }
        )
      }
      
      const blob = await response.blob()
      return new NextResponse(blob, {
        headers: {
          'Content-Type': blob.type || 'image/png',
          'Cache-Control': 'public, max-age=3600',
        },
      })
    }

    const filePath = pathMatch[1]
    
    // Get the file from Supabase storage using the authenticated client
    const { data, error } = await supabase.storage
      .from('work-sample-thumbnails')
      .download(filePath)
    
    if (error || !data) {
      console.error('Error fetching thumbnail from storage:', error)
      return NextResponse.json(
        { error: error?.message || 'Failed to fetch thumbnail' },
        { status: 500 }
      )
    }
    
    // Convert blob to buffer
    const arrayBuffer = await data.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Determine content type
    const contentType = data.type || 'image/png'
    
    // Return the image with appropriate headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error: any) {
    console.error('Error proxying thumbnail:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to serve thumbnail' },
      { status: 500 }
    )
  }
}

