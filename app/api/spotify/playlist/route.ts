import { NextRequest, NextResponse } from 'next/server'

// Extract playlist ID from Spotify URL
function extractPlaylistId(url: string): string | null {
  const patterns = [
    /spotify\.com\/playlist\/([a-zA-Z0-9]+)/,
    /playlist\/([a-zA-Z0-9]+)/,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  return null
}

// Get Spotify access token using Client Credentials flow
async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  // Check if credentials are missing or empty strings
  if (!clientId || !clientSecret || clientId.trim() === '' || clientSecret.trim() === '') {
    const envKeys = Object.keys(process.env).filter(key => key.includes('SPOTIFY'))
    console.error('Spotify credentials check:', {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      clientIdLength: clientId?.length || 0,
      clientSecretLength: clientSecret?.length || 0,
      envKeysWithSpotify: envKeys,
      allEnvKeys: Object.keys(process.env).length
    })
    throw new Error('Spotify credentials not configured. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables in .env.local and restart your development server. If you\'re on Vercel, make sure these are set in your project settings.')
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get access token: ${error}`)
  }

  const data = await response.json()
  return data.access_token
}

// Fetch playlist data from Spotify API
async function fetchPlaylistData(playlistId: string, accessToken: string) {
  // Add market parameter to ensure tracks are available (US market as default)
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}?market=US`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage = `Failed to fetch playlist: ${errorText}`
    
    // Try to parse as JSON for better error messages
    try {
      const errorJson = JSON.parse(errorText)
      if (errorJson.error?.message) {
        errorMessage = errorJson.error.message
      }
    } catch {
      // Keep original error message if not JSON
    }
    
    throw new Error(errorMessage)
  }

  return response.json()
}

// Fetch all tracks from a playlist (handles pagination)
async function fetchAllTracks(playlistId: string, accessToken: string, initialTracks: any) {
  const allTracks = [...(initialTracks.items || [])]
  let nextUrl = initialTracks.next

  // Fetch remaining tracks if there are more pages
  while (nextUrl) {
    try {
      const response = await fetch(nextUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        console.warn('Failed to fetch additional tracks, using available tracks')
        break
      }

      const data = await response.json()
      allTracks.push(...(data.items || []))
      nextUrl = data.next
    } catch (error) {
      console.warn('Error fetching additional tracks, using available tracks:', error)
      break
    }
  }

  return allTracks
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'Spotify playlist URL is required' },
        { status: 400 }
      )
    }

    // Extract playlist ID from URL
    const playlistId = extractPlaylistId(url)
    if (!playlistId) {
      return NextResponse.json(
        { error: 'Invalid Spotify playlist URL' },
        { status: 400 }
      )
    }

    // Get access token
    const accessToken = await getAccessToken()

    // Fetch playlist data
    const playlistData = await fetchPlaylistData(playlistId, accessToken)

    // Get basic metadata first (always available)
    const basicMetadata = {
      title: playlistData.name || 'Untitled Playlist',
      coverUrl: playlistData.images?.[0]?.url || null,
      description: playlistData.description || null,
      spotifyUrl: playlistData.external_urls?.spotify || url,
      trackCount: playlistData.tracks?.total || 0,
      owner: playlistData.owner?.display_name || playlistData.owner?.id || null,
      ownerPhotoUrl: playlistData.owner?.images?.[0]?.url || null,
    }

    // Check if tracks data exists
    if (!playlistData.tracks || !playlistData.tracks.items) {
      // Return basic metadata even if tracks aren't available
      return NextResponse.json({
        ...basicMetadata,
        totalDuration: '0:00',
        artistsList: '',
        tracks: [],
      })
    }

    // Fetch all tracks (handles pagination for playlists with >100 tracks)
    let allTrackItems: any[] = []
    try {
      allTrackItems = await fetchAllTracks(playlistId, accessToken, playlistData.tracks)
    } catch (error) {
      console.warn('Error fetching tracks, returning basic metadata:', error)
      // If track fetching fails, still return basic metadata
      return NextResponse.json({
        ...basicMetadata,
        totalDuration: '0:00',
        artistsList: '',
        tracks: [],
      })
    }

    // Filter out null tracks and calculate total duration
    const validTracks = allTrackItems.filter((item: any) => item?.track)
    
    if (validTracks.length === 0) {
      // If no valid tracks but playlist exists, return basic metadata
      // This can happen with Spotify-owned playlists or playlists with unavailable tracks
      return NextResponse.json({
        ...basicMetadata,
        totalDuration: '0:00',
        artistsList: '',
        tracks: [],
      })
    }

    // Calculate total duration
    const totalMs = validTracks.reduce((sum: number, item: any) => {
      return sum + (item.track?.duration_ms || 0)
    }, 0)
    const totalMinutes = Math.floor(totalMs / 60000)
    const totalSeconds = Math.floor((totalMs % 60000) / 1000)
    const totalDuration = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`

    // Extract unique artists
    const artists = new Set<string>()
    validTracks.forEach((item: any) => {
      if (item.track?.artists) {
        item.track.artists.forEach((artist: any) => {
          if (artist?.name) {
            artists.add(artist.name)
          }
        })
      }
    })
    const artistsList = Array.from(artists).join(', ')

    // Get cover image (use the largest available)
    const coverImage = playlistData.images?.[0]?.url || null

    // Format tracks
    const tracks = validTracks.map((item: any) => {
      const track = item.track
      const durationMs = track.duration_ms || 0
      const minutes = Math.floor(durationMs / 60000)
      const seconds = Math.floor((durationMs % 60000) / 1000)
      const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`

      return {
        name: track.name || 'Unknown Track',
        artist: track.artists?.map((a: any) => a.name).filter(Boolean).join(', ') || 'Unknown',
        duration,
        album: track.album?.name || 'Unknown Album',
        spotifyUrl: track.external_urls?.spotify || null,
      }
    })

    // Return playlist metadata - curator is set by the user, not from playlist owner
    return NextResponse.json({
      title: playlistData.name,
      coverUrl: coverImage,
      description: playlistData.description || null,
      spotifyUrl: playlistData.external_urls?.spotify || url,
      trackCount: playlistData.tracks?.total || validTracks.length,
      totalDuration,
      artistsList,
      tracks,
      // Don't set curator - it's set by the user sharing the playlist
      // Only include owner info for reference if needed
      owner: playlistData.owner?.display_name || playlistData.owner?.id || null,
      ownerPhotoUrl: playlistData.owner?.images?.[0]?.url || null,
    })
  } catch (error: any) {
    console.error('Error fetching Spotify playlist:', error)
    
    // Provide more helpful error messages
    let errorMessage = error.message || 'Failed to fetch playlist data'
    
    // Check for specific error types
    if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
      errorMessage = 'Spotify authentication failed. Please check your API credentials.'
    } else if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
      errorMessage = 'This playlist may be private or unavailable. Try a public playlist.'
    } else if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
      errorMessage = 'Playlist not found. Please check the URL is correct.'
    } else if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
      errorMessage = 'Spotify API rate limit exceeded. Please try again in a moment.'
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

