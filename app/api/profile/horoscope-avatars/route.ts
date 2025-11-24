import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch all historical horoscope avatars for the authenticated user
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

    // Fetch all horoscopes for the user, ordered by date descending
    const { data: horoscopes, error: fetchError } = await supabase
      .from('horoscopes')
      .select('id, image_url, date, star_sign, generated_at')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (fetchError) {
      console.error('Error fetching horoscope avatars:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch horoscope avatars', details: fetchError.message },
        { status: 500 }
      )
    }

    // Filter out any entries without image_url
    const avatars = (horoscopes || [])
      .filter(h => h.image_url)
      .map(h => ({
        id: h.id,
        url: h.image_url,
        date: h.date,
        star_sign: h.star_sign,
        generated_at: h.generated_at
      }))

    return NextResponse.json({ data: avatars })
  } catch (error: any) {
    console.error('Error in horoscope avatars API:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch horoscope avatars', details: error.toString() },
      { status: 500 }
    )
  }
}

