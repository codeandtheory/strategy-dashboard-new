import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch snaps with optional filters
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
    const mentionedUserId = searchParams.get('mentioned_user_id')
    const submittedBy = searchParams.get('submitted_by')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : null
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0

    // Build query - join with profiles to get submitter and mentioned user info
    let query = supabase
      .from('snaps')
      .select(`
        id,
        date,
        snap_content,
        mentioned,
        mentioned_user_id,
        submitted_by,
        created_at,
        updated_at,
        submitted_by_profile:profiles!submitted_by(id, email, full_name, avatar_url),
        mentioned_user_profile:profiles!mentioned_user_id(id, email, full_name, avatar_url)
      `)

    // Apply filters
    if (mentionedUserId) {
      query = query.eq('mentioned_user_id', mentionedUserId)
    }

    if (submittedBy) {
      query = query.eq('submitted_by', submittedBy)
    }

    // Apply sorting - most recent first
    query = query.order('date', { ascending: false })
    query = query.order('created_at', { ascending: false })

    // Apply limit and offset
    if (limit) {
      query = query.range(offset, offset + limit - 1)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching snaps:', error)
      return NextResponse.json(
        { error: 'Failed to fetch snaps', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: data || [] })
  } catch (error: any) {
    console.error('Error in snaps API:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch snaps', details: error.toString() },
      { status: 500 }
    )
  }
}

// POST - Create a new snap
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
    const { snap_content, mentioned, submit_anonymously, date } = body

    if (!snap_content || !snap_content.trim()) {
      return NextResponse.json(
        { error: 'Snap content is required' },
        { status: 400 }
      )
    }

    // Verify user exists in profiles table
    const { data: profileCheck, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (profileError || !profileCheck) {
      console.error('User profile not found:', profileError)
      return NextResponse.json(
        { error: 'User profile not found. Please complete your profile setup.' },
        { status: 400 }
      )
    }

    // Try to match mentioned name to a user profile
    let mentionedUserId: string | null = null
    if (mentioned && mentioned.trim()) {
      // Search for user by full_name (case-insensitive, partial match)
      const { data: mentionedUser } = await supabase
        .from('profiles')
        .select('id, full_name')
        .ilike('full_name', `%${mentioned.trim()}%`)
        .limit(1)
        .maybeSingle()

      if (mentionedUser) {
        mentionedUserId = mentionedUser.id
      }
    }

    // Prepare snap data
    const snapData: any = {
      snap_content: snap_content.trim(),
      mentioned: mentioned?.trim() || null,
      mentioned_user_id: mentionedUserId,
      submitted_by: submit_anonymously ? null : user.id,
      date: date || new Date().toISOString().split('T')[0], // Use provided date or today
    }

    const { data: newSnap, error: insertError } = await supabase
      .from('snaps')
      .insert(snapData)
      .select(`
        id,
        date,
        snap_content,
        mentioned,
        mentioned_user_id,
        submitted_by,
        created_at,
        updated_at,
        submitted_by_profile:profiles!submitted_by(id, email, full_name, avatar_url),
        mentioned_user_profile:profiles!mentioned_user_id(id, email, full_name, avatar_url)
      `)
      .single()

    if (insertError) {
      console.error('Error creating snap:', insertError)
      return NextResponse.json(
        { error: 'Failed to create snap', details: insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: newSnap }, { status: 201 })
  } catch (error: any) {
    console.error('Error in snaps POST API:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create snap', details: error.toString() },
      { status: 500 }
    )
  }
}

