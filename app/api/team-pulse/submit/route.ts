import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { responses } = body

    if (!responses || !Array.isArray(responses)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Get current week start (Monday)
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) // Adjust to Monday
    const weekStart = new Date(now.setDate(diff))
    weekStart.setHours(0, 0, 0, 0)
    const weekKey = weekStart.toISOString().split('T')[0]

    // Check if user already submitted this week
    const { data: existing, error: checkError } = await supabase
      .from('team_pulse_responses')
      .select('id')
      .eq('user_id', user.id)
      .eq('week_key', weekKey)
      .limit(1)

    // If there's an error other than "not found", log it
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing submission:', checkError)
    }

    // If user already submitted, return error
    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'Already submitted this week' }, { status: 400 })
    }

    // Validate response data
    const responseData = responses.map((r: any) => {
      if (!r.questionKey || r.score === undefined || r.score === null) {
        throw new Error(`Invalid response data: ${JSON.stringify(r)}`)
      }
      return {
        user_id: user.id,
        week_key: weekKey,
        question_key: r.questionKey,
        score: Number(r.score),
        comment: r.comment && r.comment.trim() ? r.comment.trim() : null,
      }
    })

    const { error, data: insertedData } = await supabase
      .from('team_pulse_responses')
      .insert(responseData)
      .select()

    if (error) {
      console.error('Error inserting pulse responses:', error)
      console.error('Response data attempted:', responseData)
      return NextResponse.json({ 
        error: 'Failed to save responses', 
        details: error.message 
      }, { status: 500 })
    }

    console.log('Successfully inserted responses:', insertedData?.length)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in team-pulse submit:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: errorMessage 
    }, { status: 500 })
  }
}

