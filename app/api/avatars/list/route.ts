import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - List all avatars for the authenticated user
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

    // List files from both buckets: profile avatars and horoscope avatars
    const [profileAvatarsResult, horoscopeAvatarsResult] = await Promise.all([
      // Profile avatars (user-uploaded profile photos)
      supabase.storage
        .from('avatars')
        .list(user.id, {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        }),
      // Horoscope avatars (AI-generated horoscope images)
      supabase.storage
        .from('horoscope-avatars')
        .list(user.id, {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        })
    ])

    const profileFiles = profileAvatarsResult.data || []
    const horoscopeFiles = horoscopeAvatarsResult.data || []

    if (profileAvatarsResult.error) {
      console.error('Error listing profile avatars:', profileAvatarsResult.error)
    }
    if (horoscopeAvatarsResult.error) {
      console.error('Error listing horoscope avatars:', horoscopeAvatarsResult.error)
    }

    // Combine avatars from both buckets
    const avatars = [
      // Profile avatars
      ...profileFiles
        .filter(file => file.name) // Filter out folders
        .map(file => {
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(`${user.id}/${file.name}`)
          
          return {
            name: file.name,
            url: publicUrl,
            source: 'profile' as const,
            created_at: file.created_at,
            updated_at: file.updated_at,
            size: file.metadata?.size || 0
          }
        }),
      // Horoscope avatars
      ...horoscopeFiles
        .filter(file => file.name) // Filter out folders
        .map(file => {
          const { data: { publicUrl } } = supabase.storage
            .from('horoscope-avatars')
            .getPublicUrl(`${user.id}/${file.name}`)
          
          return {
            name: file.name,
            url: publicUrl,
            source: 'horoscope' as const,
            created_at: file.created_at,
            updated_at: file.updated_at,
            size: file.metadata?.size || 0
          }
        })
    ]
      .sort((a, b) => {
        // Sort by created_at descending (newest first)
        const dateA = new Date(a.created_at || 0).getTime()
        const dateB = new Date(b.created_at || 0).getTime()
        return dateB - dateA
      })
      .slice(0, 100) // Limit total results

    return NextResponse.json({ data: avatars })
  } catch (error: any) {
    console.error('Error in avatars list API:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to list avatars', details: error.toString() },
      { status: 500 }
    )
  }
}

