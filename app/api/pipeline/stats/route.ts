import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch pipeline stats for "This Week" section
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

    // Calculate date ranges
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const sevenDaysFromNow = new Date(today)
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

    // Format dates as ISO strings for timestamp comparison
    const sevenDaysAgoISO = sevenDaysAgo.toISOString()
    const todayStr = today.toISOString().split('T')[0]
    const sevenDaysFromNowStr = sevenDaysFromNow.toISOString().split('T')[0]

    // Get new business opportunities added in the past 7 days
    const { count: newBusinessCount, error: newBusinessError } = await supabase
      .from('pipeline_projects')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgoISO)

    if (newBusinessError) {
      console.error('Error counting new business:', newBusinessError)
    }

    // Get pitches with due date between today and 7 days from now
    const { count: pitchesDueCount, error: pitchesDueError } = await supabase
      .from('pipeline_projects')
      .select('*', { count: 'exact', head: true })
      .gte('due_date', todayStr)
      .lte('due_date', sevenDaysFromNowStr)
      .not('due_date', 'is', null)

    if (pitchesDueError) {
      console.error('Error counting pitches due:', pitchesDueError)
    }

    // Active projects - dummy value as requested
    const activeProjects = 0

    return NextResponse.json({
      activeProjects,
      newBusiness: newBusinessCount || 0,
      pitchesDue: pitchesDueCount || 0
    })
  } catch (error: any) {
    console.error('Error in pipeline stats API:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch pipeline stats', details: error.toString() },
      { status: 500 }
    )
  }
}

