import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current week start (Monday)
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    const weekStart = new Date(now.setDate(diff))
    weekStart.setHours(0, 0, 0, 0)
    const weekKey = weekStart.toISOString().split('T')[0]

    // Get previous week start (7 days ago)
    const prevWeekStart = new Date(weekStart)
    prevWeekStart.setDate(prevWeekStart.getDate() - 7)
    const prevWeekKey = prevWeekStart.toISOString().split('T')[0]

    // Get all responses for this week
    const { data: responses, error } = await supabase
      .from('team_pulse_responses')
      .select('question_key, score, comment')
      .eq('week_key', weekKey)

    // Get previous week responses for comparison
    const { data: prevWeekResponses } = await supabase
      .from('team_pulse_responses')
      .select('question_key, score')
      .eq('week_key', prevWeekKey)

    if (error) {
      console.error('Error fetching aggregated data:', error)
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
    }

    if (!responses || responses.length === 0) {
      return NextResponse.json({
        totalResponses: 0,
        aggregatedData: [],
      })
    }

    // Get unique user count
    const { count } = await supabase
      .from('team_pulse_responses')
      .select('user_id', { count: 'exact', head: true })
      .eq('week_key', weekKey)

    const totalResponses = count || 0

    // Aggregate by question
    const questionGroups: Record<string, { scores: number[]; comments: string[] }> = {}
    
    responses.forEach((r) => {
      if (!questionGroups[r.question_key]) {
        questionGroups[r.question_key] = { scores: [], comments: [] }
      }
      questionGroups[r.question_key].scores.push(r.score)
      if (r.comment) {
        questionGroups[r.question_key].comments.push(r.comment)
      }
    })

    // Get question texts (if questions table exists)
    const questionMap = new Map<string, string>()
    try {
      const { data: allQuestions } = await supabase
        .from('team_pulse_questions')
        .select('question_key, question_text')
      
      allQuestions?.forEach(q => {
        questionMap.set(q.question_key, q.question_text)
      })
    } catch (error) {
      // Questions table might not exist yet, that's okay
      console.log('Questions table not found, using question keys only')
    }

    // Aggregate previous week by question
    const prevWeekGroups: Record<string, number[]> = {}
    prevWeekResponses?.forEach((r) => {
      if (!prevWeekGroups[r.question_key]) {
        prevWeekGroups[r.question_key] = []
      }
      prevWeekGroups[r.question_key].push(r.score)
    })

    // Calculate previous week averages
    const prevWeekAverages: Record<string, number> = {}
    Object.entries(prevWeekGroups).forEach(([questionKey, scores]) => {
      prevWeekAverages[questionKey] = scores.reduce((sum, score) => sum + score, 0) / scores.length
    })

    // Calculate overall team mood (average of all question averages)
    let overallTeamMood = 0
    let questionCount = 0

    // Calculate averages and extract comment themes
    const aggregatedData = Object.entries(questionGroups).map(([questionKey, data]) => {
      const average = data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length
      const prevAverage = prevWeekAverages[questionKey]
      const change = prevAverage !== undefined ? average - prevAverage : null
      
      overallTeamMood += average
      questionCount++

      // Simple theme extraction (group similar words/phrases)
      const commentThemes: Record<string, number> = {}
      data.comments.forEach((comment) => {
        // Extract key phrases (simple approach - can be enhanced with NLP)
        const words = comment.toLowerCase()
          .replace(/[^\w\s]/g, '')
          .split(/\s+/)
          .filter(w => w.length > 3) // Filter out short words
        
        // Group by common words/phrases
        words.forEach((word) => {
          commentThemes[word] = (commentThemes[word] || 0) + 1
        })
      })

      // Get top themes (appearing in 2+ comments)
      const themes = Object.entries(commentThemes)
        .filter(([_, count]) => count >= 2)
        .sort(([_, a], [__, b]) => b - a)
        .slice(0, 5)
        .map(([theme, count]) => ({ theme, count }))

      return {
        questionKey,
        questionText: questionMap.get(questionKey),
        average,
        responseCount: data.scores.length,
        commentThemes: themes,
        change: change !== null ? Math.round(change) : null,
        prevAverage: prevAverage !== undefined ? Math.round(prevAverage) : null,
      }
    })

    // Calculate overall team mood
    overallTeamMood = questionCount > 0 ? overallTeamMood / questionCount : 0

    // Find highest and lowest scoring questions
    const sortedByScore = [...aggregatedData].sort((a, b) => b.average - a.average)
    const highestQuestion = sortedByScore[0] || null
    const lowestQuestion = sortedByScore[sortedByScore.length - 1] || null

    return NextResponse.json({
      totalResponses,
      aggregatedData,
      overallTeamMood: Math.round(overallTeamMood),
      highestQuestion: highestQuestion ? {
        questionKey: highestQuestion.questionKey,
        questionText: highestQuestion.questionText,
        average: Math.round(highestQuestion.average),
      } : null,
      lowestQuestion: lowestQuestion ? {
        questionKey: lowestQuestion.questionKey,
        questionText: lowestQuestion.questionText,
        average: Math.round(lowestQuestion.average),
      } : null,
    })
  } catch (error) {
    console.error('Error in aggregated:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

