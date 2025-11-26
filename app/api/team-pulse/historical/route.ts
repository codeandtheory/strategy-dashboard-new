import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all unique week keys, ordered by date (newest first)
    const { data: allResponses, error } = await supabase
      .from('team_pulse_responses')
      .select('week_key, question_key, score, comment, created_at')
      .order('week_key', { ascending: false })

    if (error) {
      console.error('Error fetching historical data:', error)
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
    }

    if (!allResponses || allResponses.length === 0) {
      return NextResponse.json({ weeks: [] })
    }

    // Get unique week keys
    const weekKeys = Array.from(new Set(allResponses.map(r => r.week_key))).sort().reverse()

    // Get question texts
    const questionMap = new Map<string, string>()
    try {
      const { data: allQuestions } = await supabase
        .from('team_pulse_questions')
        .select('question_key, question_text')
      
      allQuestions?.forEach(q => {
        questionMap.set(q.question_key, q.question_text)
      })
    } catch (error) {
      console.log('Questions table not found, using question keys only')
    }

    // Aggregate data by week
    const weeksData = weekKeys.map(weekKey => {
      const weekResponses = allResponses.filter(r => r.week_key === weekKey)
      
      // Group by question
      const questionGroups: Record<string, { scores: number[]; comments: string[] }> = {}
      
      weekResponses.forEach(r => {
        if (!questionGroups[r.question_key]) {
          questionGroups[r.question_key] = { scores: [], comments: [] }
        }
        questionGroups[r.question_key].scores.push(r.score)
        if (r.comment) {
          questionGroups[r.question_key].comments.push(r.comment)
        }
      })

      // Calculate averages and stats for each question
      const questions = Object.entries(questionGroups).map(([questionKey, data]) => {
        const average = data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length
        const min = Math.min(...data.scores)
        const max = Math.max(...data.scores)
        const responseCount = data.scores.length

        return {
          question_key: questionKey,
          question_text: questionMap.get(questionKey) || questionKey,
          average: Math.round(average),
          min,
          max,
          response_count: responseCount,
          comments: data.comments
        }
      })

      // Calculate overall team mood (average of all question averages)
      const overallMood = questions.length > 0
        ? Math.round(questions.reduce((sum, q) => sum + q.average, 0) / questions.length)
        : 0

      // Get unique user count for this week
      const uniqueUsers = new Set(weekResponses.map(r => r.user_id)).size

      return {
        week_key: weekKey,
        week_start: weekKey, // ISO date string
        overall_mood: overallMood,
        total_responses: weekResponses.length,
        unique_users: uniqueUsers,
        questions
      }
    })

    return NextResponse.json({ weeks: weeksData })
  } catch (error) {
    console.error('Error in team-pulse historical:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

