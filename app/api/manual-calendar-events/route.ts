import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/manual-calendar-events
 * Fetches manual calendar events within a date range
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

    const { searchParams } = new URL(request.url)
    const timeMin = searchParams.get('timeMin')
    const timeMax = searchParams.get('timeMax')

    let query = supabase
      .from('manual_calendar_events')
      .select('*')
      .order('start_date', { ascending: true })
      .order('start_time', { ascending: true, nullsFirst: false })

    // Filter by date range if provided
    if (timeMin) {
      const minDate = new Date(timeMin).toISOString().split('T')[0]
      query = query.gte('start_date', minDate)
    }

    if (timeMax) {
      const maxDate = new Date(timeMax).toISOString().split('T')[0]
      // Include events that start before or on maxDate
      // We'll filter out events that end before timeMin in the application logic
      query = query.lte('start_date', maxDate)
    }

    const { data: events, error } = await query

    if (error) {
      console.error('Error fetching manual calendar events:', error)
      return NextResponse.json(
        { error: 'Failed to fetch manual calendar events' },
        { status: 500 }
      )
    }

    return NextResponse.json({ events: events || [] })
  } catch (error: any) {
    console.error('Error in manual-calendar-events API:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/manual-calendar-events
 * Creates a new manual calendar event
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

    const body = await request.json()
    const { title, description, start_date, start_time, end_date, end_time, location, is_all_day, color } = body

    if (!title || !start_date) {
      return NextResponse.json(
        { error: 'Title and start date are required' },
        { status: 400 }
      )
    }

    // Validate date format
    const startDateObj = new Date(start_date)
    if (isNaN(startDateObj.getTime())) {
      return NextResponse.json(
        { error: 'Invalid start date format' },
        { status: 400 }
      )
    }

    // If end_date is not provided, default to start_date
    const finalEndDate = end_date || start_date

    const { data: event, error } = await supabase
      .from('manual_calendar_events')
      .insert({
        title,
        description: description || null,
        start_date: start_date,
        start_time: start_time || null,
        end_date: finalEndDate,
        end_time: end_time || null,
        location: location || null,
        is_all_day: is_all_day || false,
        color: color || null,
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating manual calendar event:', error)
      return NextResponse.json(
        { error: 'Failed to create manual calendar event', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ event })
  } catch (error: any) {
    console.error('Error in manual-calendar-events API:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/manual-calendar-events
 * Updates an existing manual calendar event
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, title, description, start_date, start_time, end_date, end_time, location, is_all_day, color } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    if (!title || !start_date) {
      return NextResponse.json(
        { error: 'Title and start date are required' },
        { status: 400 }
      )
    }

    // Check if user owns the event or is an admin
    const { data: existingEvent } = await supabase
      .from('manual_calendar_events')
      .select('created_by')
      .eq('id', id)
      .single()

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check permissions
    const { data: profile } = await supabase
      .from('profiles')
      .select('base_role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.base_role === 'admin'
    const isOwner = existingEvent.created_by === user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'You do not have permission to update this event' },
        { status: 403 }
      )
    }

    // If end_date is not provided, default to start_date
    const finalEndDate = end_date || start_date

    const { data: event, error } = await supabase
      .from('manual_calendar_events')
      .update({
        title,
        description: description || null,
        start_date: start_date,
        start_time: start_time || null,
        end_date: finalEndDate,
        end_time: end_time || null,
        location: location || null,
        is_all_day: is_all_day || false,
        color: color || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating manual calendar event:', error)
      return NextResponse.json(
        { error: 'Failed to update manual calendar event', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ event })
  } catch (error: any) {
    console.error('Error in manual-calendar-events API:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/manual-calendar-events
 * Deletes a manual calendar event
 */
export async function DELETE(request: NextRequest) {
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
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    // Check if user owns the event or is an admin
    const { data: existingEvent } = await supabase
      .from('manual_calendar_events')
      .select('created_by')
      .eq('id', id)
      .single()

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check permissions
    const { data: profile } = await supabase
      .from('profiles')
      .select('base_role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.base_role === 'admin'
    const isOwner = existingEvent.created_by === user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this event' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('manual_calendar_events')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting manual calendar event:', error)
      return NextResponse.json(
        { error: 'Failed to delete manual calendar event', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in manual-calendar-events API:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

