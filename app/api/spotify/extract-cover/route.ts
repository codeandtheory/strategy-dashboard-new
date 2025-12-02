import { NextRequest, NextResponse } from 'next/server'

/**
 * Extract cover image URL from Spotify playlist page
 * This fetches the HTML and looks for og:image meta tag or i.scdn.co image URLs
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body || {}

    if (!url || typeof url !== 'string' || !url.trim()) {
      return NextResponse.json(
        { error: 'Spotify playlist URL is required' },
        { status: 400 }
      )
    }

    // Clean the URL - remove query parameters and fragments
    const cleanUrl = url.split('?')[0].split('#')[0].trim()

    try {
      // Fetch the Spotify page
      const response = await fetch(cleanUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch page: ${response.statusText}`)
      }

      const html = await response.text()

      // Try to extract og:image meta tag first
      const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i)
      if (ogImageMatch && ogImageMatch[1]) {
        const coverUrl = ogImageMatch[1].trim()
        console.log('[Extract Cover] Found og:image:', coverUrl)
        return NextResponse.json({ coverUrl })
      }

      // Try alternative og:image format
      const ogImageMatch2 = html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i)
      if (ogImageMatch2 && ogImageMatch2[1]) {
        const coverUrl = ogImageMatch2[1].trim()
        console.log('[Extract Cover] Found og:image (alt format):', coverUrl)
        return NextResponse.json({ coverUrl })
      }

      // Try to find i.scdn.co image URLs (Spotify's CDN)
      // Look for the largest image URL (usually 640x640 or larger)
      const scdnMatches = html.match(/https?:\/\/i\.scdn\.co\/image\/[a-zA-Z0-9]+/g)
      if (scdnMatches && scdnMatches.length > 0) {
        // Prefer larger images - look for ones that might be 640x640 or larger
        // Spotify cover images are usually square and large
        const coverUrl = scdnMatches[0]
        console.log('[Extract Cover] Found i.scdn.co image:', coverUrl)
        return NextResponse.json({ coverUrl })
      }

      // Try to find any large image in the page that might be the cover
      // Look for img tags with src containing scdn.co
      const imgMatch = html.match(/<img[^>]+src=["'](https?:\/\/[^"']*scdn\.co[^"']+)["']/i)
      if (imgMatch && imgMatch[1]) {
        const coverUrl = imgMatch[1].trim()
        console.log('[Extract Cover] Found img tag with scdn.co:', coverUrl)
        return NextResponse.json({ coverUrl })
      }

      console.warn('[Extract Cover] Could not find cover image in page HTML')
      return NextResponse.json(
        { error: 'Could not find cover image in the Spotify page. The page may have changed or the playlist may be private.' },
        { status: 404 }
      )
    } catch (fetchError: any) {
      console.error('[Extract Cover] Error fetching page:', fetchError)
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timed out. Please try again.' },
          { status: 408 }
        )
      }
      if (fetchError.message?.includes('CORS') || fetchError.message?.includes('fetch')) {
        return NextResponse.json(
          { error: 'Could not access the Spotify page. This may be due to CORS restrictions or the page being unavailable.' },
          { status: 403 }
        )
      }
      throw fetchError
    }
  } catch (error: any) {
    console.error('[Extract Cover] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to extract cover image' },
      { status: 500 }
    )
  }
}

