import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST - Calculate a single stat value by database_stat_key
 * Used for displaying values in the admin panel's available stats bank
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
    const { database_stat_key } = body

    if (!database_stat_key) {
      return NextResponse.json(
        { error: 'database_stat_key is required' },
        { status: 400 }
      )
    }

    // Calculate date ranges for database stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const sevenDaysFromNow = new Date(today)
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

    const sevenDaysAgoISO = sevenDaysAgo.toISOString()
    const todayStr = today.toISOString().split('T')[0]
    const sevenDaysFromNowStr = sevenDaysFromNow.toISOString().split('T')[0]

    let value = '0'

    switch (database_stat_key) {
      case 'active_pitches':
        const { count: activeCount } = await supabase
          .from('pipeline_projects')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'In Progress')
        value = (activeCount || 0).toString()
        break

      case 'new_business':
        const { count: newBusinessCount } = await supabase
          .from('pipeline_projects')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', sevenDaysAgoISO)
        value = (newBusinessCount || 0).toString()
        break

      case 'pitches_due':
        const { count: pitchesDueCount } = await supabase
          .from('pipeline_projects')
          .select('*', { count: 'exact', head: true })
          .gte('due_date', todayStr)
          .lte('due_date', sevenDaysFromNowStr)
          .not('due_date', 'is', null)
        value = (pitchesDueCount || 0).toString()
        break

      case 'total_team_members':
        const { count: teamMembersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .or('is_active.eq.true,is_active.is.null')
        value = (teamMembersCount || 0).toString()
        break

      case 'total_birthdays':
        const { count: birthdaysCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .not('birthday', 'is', null)
          .neq('birthday', '')
        value = (birthdaysCount || 0).toString()
        break

      case 'total_anniversaries':
        const { count: anniversariesCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .not('start_date', 'is', null)
        value = (anniversariesCount || 0).toString()
        break

      case 'total_snaps':
        const { count: snapsCount } = await supabase
          .from('snaps')
          .select('*', { count: 'exact', head: true })
        value = (snapsCount || 0).toString()
        break

      case 'won_projects':
        const { count: wonCount } = await supabase
          .from('pipeline_projects')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'Won')
        value = (wonCount || 0).toString()
        break

      case 'total_work_samples':
        const { count: workSamplesCount } = await supabase
          .from('work_samples')
          .select('*', { count: 'exact', head: true })
        value = (workSamplesCount || 0).toString()
        break

      case 'total_decks':
        const { count: decksCount } = await supabase
          .from('decks')
          .select('*', { count: 'exact', head: true })
        value = (decksCount || 0).toString()
        break

      case 'total_resources':
        const { count: resourcesCount } = await supabase
          .from('resources')
          .select('*', { count: 'exact', head: true })
        value = (resourcesCount || 0).toString()
        break

      default:
        value = '0'
    }

    return NextResponse.json({ value })
  } catch (error: any) {
    console.error('Error calculating stat value:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to calculate stat value', details: error.toString() },
      { status: 500 }
    )
  }
}

