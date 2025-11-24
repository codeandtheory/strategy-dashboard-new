import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch all user activity/contributions
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

    const activities: Array<{
      type: string
      id: string
      title: string
      description: string | null
      date: string
      created_at: string
    }> = []

    // Fetch snaps submitted by user
    const { data: snaps, error: snapsError } = await supabase
      .from('snaps')
      .select('id, snap_content, date, created_at')
      .eq('submitted_by', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (!snapsError && snaps) {
      snaps.forEach(snap => {
        activities.push({
          type: 'snap',
          id: snap.id,
          title: 'Snap',
          description: snap.snap_content,
          date: snap.date,
          created_at: snap.created_at
        })
      })
    }

    // Fetch work samples created by user
    const { data: workSamples, error: workError } = await supabase
      .from('work_samples')
      .select('id, project_name, description, date, created_at')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (!workError && workSamples) {
      workSamples.forEach(work => {
        activities.push({
          type: 'work_sample',
          id: work.id,
          title: work.project_name,
          description: work.description,
          date: work.date,
          created_at: work.created_at
        })
      })
    }

    // Fetch pipeline projects created by user
    const { data: pipelineProjects, error: pipelineError } = await supabase
      .from('pipeline_projects')
      .select('id, name, description, created_at')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (!pipelineError && pipelineProjects) {
      pipelineProjects.forEach(project => {
        activities.push({
          type: 'pipeline_project',
          id: project.id,
          title: project.name,
          description: project.description,
          date: new Date(project.created_at).toISOString().split('T')[0],
          created_at: project.created_at
        })
      })
    }

    // Sort all activities by created_at descending
    activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json({ data: activities.slice(0, 100) }) // Limit to 100 most recent
  } catch (error: any) {
    console.error('Error in activity API:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch activity', details: error.toString() },
      { status: 500 }
    )
  }
}

