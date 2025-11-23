import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch all pipeline projects
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    // Build query
    let query = supabase
      .from('pipeline_projects')
      .select(`
        id,
        name,
        type,
        description,
        due_date,
        lead,
        notes,
        status,
        team,
        url,
        tier,
        created_by,
        created_at,
        updated_at,
        created_by_profile:profiles!created_by(id, email, full_name)
      `)

    // Apply status filter if provided
    if (status) {
      query = query.eq('status', status)
    }

    // Sort by due_date (nulls last), then by created_at
    query = query.order('due_date', { ascending: true, nullsFirst: false })
    query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching pipeline projects:', error)
      return NextResponse.json(
        { error: 'Failed to fetch pipeline projects', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: data || [] })
  } catch (error: any) {
    console.error('Error in pipeline API:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch pipeline projects', details: error.toString() },
      { status: 500 }
    )
  }
}

