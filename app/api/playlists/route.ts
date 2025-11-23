import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch all playlists
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    const { data: playlists, error } = await supabase
      .from('playlists')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching playlists:', error)
      return NextResponse.json(
        { error: 'Failed to fetch playlists' },
        { status: 500 }
      )
    }

    return NextResponse.json(playlists)
  } catch (error: any) {
    console.error('Error in GET /api/playlists:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new playlist
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { date, title, curator, description, spotify_url, apple_playlist_url, cover_url, curator_photo_url, week_label } = body

    if (!date || !curator || !spotify_url) {
      return NextResponse.json(
        { error: 'Missing required fields: date, curator, and spotify_url are required' },
        { status: 400 }
      )
    }

    // Look up curator's avatar from profiles if not provided
    let finalCuratorPhotoUrl = curator_photo_url
    if (!finalCuratorPhotoUrl) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('avatar_url, full_name')
        .or(`full_name.ilike.%${curator}%,email.ilike.%${curator}%`)
        .limit(1)
        .single()
      
      if (profile?.avatar_url) {
        finalCuratorPhotoUrl = profile.avatar_url
      }
    }

    const { data: playlist, error } = await supabase
      .from('playlists')
      .insert({
        date,
        title: title || null,
        curator,
        description: description || null,
        spotify_url,
        apple_playlist_url: apple_playlist_url || null,
        cover_url: cover_url || null,
        curator_photo_url: finalCuratorPhotoUrl || null,
        week_label: week_label || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating playlist:', error)
      return NextResponse.json(
        { error: 'Failed to create playlist' },
        { status: 500 }
      )
    }

    return NextResponse.json(playlist, { status: 201 })
  } catch (error: any) {
    console.error('Error in POST /api/playlists:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

