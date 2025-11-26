'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useMode } from '@/contexts/mode-context'
import { SiteHeader } from '@/components/site-header'
import { Footer } from '@/components/footer'
import { ArrowLeft, TrendingUp, TrendingDown, Users, MessageCircle, Calendar } from 'lucide-react'
import Link from 'next/link'

interface HistoricalWeek {
  week_key: string
  week_start: string
  overall_mood: number
  total_responses: number
  unique_users: number
  questions: Array<{
    question_key: string
    question_text: string
    average: number
    min: number
    max: number
    response_count: number
    comments: string[]
  }>
}

export default function PollsArchivePage() {
  const { user, loading: authLoading } = useAuth()
  const { mode } = useMode()
  const router = useRouter()
  const [weeks, setWeeks] = useState<HistoricalWeek[]>([])
  const [loading, setLoading] = useState(true)

  const getBgClass = () => {
    switch (mode) {
      case 'chaos': return 'bg-[#1A1A1A]'
      case 'chill': return 'bg-[#F5E6D3]'
      case 'code': return 'bg-black'
      default: return 'bg-[#1A1A1A]'
    }
  }

  const getTextClass = () => {
    switch (mode) {
      case 'chaos': return 'text-white'
      case 'chill': return 'text-[#4A1818]'
      case 'code': return 'text-[#FFFFFF]'
      default: return 'text-white'
    }
  }

  const getRoundedClass = (base: string) => {
    return mode === 'code' ? 'rounded-none' : base
  }

  const getScoreColor = (score: number) => {
    if (score >= 75) return mode === 'chaos' ? '#C4F500' : mode === 'chill' ? '#FFC043' : '#FFFFFF'
    if (score >= 50) return mode === 'chaos' ? '#FFD700' : mode === 'chill' ? '#FFB5D8' : '#CCCCCC'
    return mode === 'chaos' ? '#FF4C4C' : mode === 'chill' ? '#8B4444' : '#999999'
  }

  const formatWeekDate = (weekKey: string) => {
    const date = new Date(weekKey)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  useEffect(() => {
    if (!user && !authLoading) {
      router.push('/login')
      return
    }

    async function fetchHistoricalData() {
      try {
        const response = await fetch('/api/team-pulse/historical')
        if (response.ok) {
          const data = await response.json()
          setWeeks(data.weeks || [])
        }
      } catch (error) {
        console.error('Error fetching historical polls:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchHistoricalData()
    }
  }, [user, authLoading, router])

  if (loading || !user) {
    return (
      <div className={`flex flex-col min-h-screen ${getBgClass()} ${getTextClass()}`}>
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg opacity-60">Loading...</p>
        </main>
      </div>
    )
  }

  return (
    <div className={`flex flex-col min-h-screen ${getBgClass()} ${getTextClass()} ${mode === 'code' ? 'font-mono' : 'font-[family-name:var(--font-raleway)]'}`}>
      <SiteHeader />

      <main className="max-w-[1400px] mx-auto px-6 py-10 flex-1 pt-24">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/vibes" 
            className={`inline-flex items-center gap-2 mb-6 text-sm uppercase tracking-wider hover:opacity-70 transition-opacity ${getTextClass()}`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Vibes
          </Link>
          <h1 className={`text-6xl font-black uppercase mb-4 ${getTextClass()}`}>Polls Archive</h1>
          <p className={`text-xl ${getTextClass()} opacity-70`}>
            A visual journey through team sentiment over time
          </p>
        </div>

        {weeks.length === 0 ? (
          <div className="text-center py-20">
            <p className={`text-lg ${getTextClass()} opacity-60`}>No poll data available yet</p>
          </div>
        ) : (
          <div className="space-y-24">
            {weeks.map((week, weekIndex) => {
              const prevWeek = weeks[weekIndex + 1]
              const moodChange = prevWeek ? week.overall_mood - prevWeek.overall_mood : 0
              
              return (
                <section 
                  key={week.week_key}
                  className="relative"
                  style={{ 
                    scrollMarginTop: '100px',
                    animation: `fadeInUp 0.8s ease-out ${weekIndex * 0.1}s both`
                  }}
                >
                  {/* Week Header - Large, Story-like */}
                  <div className="mb-12">
                    <div className="flex items-baseline gap-4 mb-4">
                      <h2 className={`text-5xl font-black uppercase ${getTextClass()}`}>
                        {formatWeekDate(week.week_start)}
                      </h2>
                      <div className="flex items-center gap-3">
                        <div 
                          className={`text-6xl font-black ${getTextClass()}`}
                          style={{ color: getScoreColor(week.overall_mood) }}
                        >
                          {week.overall_mood}
                        </div>
                        <span className={`text-2xl ${getTextClass()} opacity-50`}>/100</span>
                        {prevWeek && (
                          <div className="flex items-center gap-1 ml-4">
                            {moodChange > 0 ? (
                              <TrendingUp className="w-6 h-6" style={{ color: getScoreColor(week.overall_mood) }} />
                            ) : moodChange < 0 ? (
                              <TrendingDown className="w-6 h-6" style={{ color: getScoreColor(week.overall_mood) }} />
                            ) : null}
                            {moodChange !== 0 && (
                              <span 
                                className="text-xl font-bold"
                                style={{ color: getScoreColor(week.overall_mood) }}
                              >
                                {Math.abs(moodChange)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm uppercase tracking-wider opacity-60">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{week.unique_users} {week.unique_users === 1 ? 'person' : 'people'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        <span>{week.total_responses} {week.total_responses === 1 ? 'response' : 'responses'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{week.questions.length} {week.questions.length === 1 ? 'question' : 'questions'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Questions Grid - Infographic Style */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {week.questions.map((question, qIndex) => (
                      <div
                        key={question.question_key}
                        className={`${getRoundedClass('rounded-3xl')} p-8 relative overflow-hidden`}
                        style={{
                          backgroundColor: mode === 'chaos' 
                            ? 'rgba(255, 255, 255, 0.05)' 
                            : mode === 'chill'
                            ? 'rgba(74, 24, 24, 0.05)'
                            : 'rgba(255, 255, 255, 0.05)',
                          border: `2px solid ${getScoreColor(question.average)}40`,
                          animation: `fadeInUp 0.6s ease-out ${(weekIndex * 0.1) + (qIndex * 0.05)}s both`
                        }}
                      >
                        {/* Score Bar - Visual Indicator */}
                        <div className="mb-6">
                          <div className="flex items-baseline justify-between mb-2">
                            <h3 className={`text-lg font-black uppercase ${getTextClass()}`}>
                              {question.question_text}
                            </h3>
                            <div 
                              className="text-4xl font-black"
                              style={{ color: getScoreColor(question.average) }}
                            >
                              {question.average}
                            </div>
                          </div>
                          
                          {/* Progress Bar */}
                          <div 
                            className={`${getRoundedClass('rounded-full')} h-3 overflow-hidden`}
                            style={{
                              backgroundColor: mode === 'chaos' 
                                ? 'rgba(255, 255, 255, 0.1)' 
                                : mode === 'chill'
                                ? 'rgba(74, 24, 24, 0.1)'
                                : 'rgba(255, 255, 255, 0.1)'
                            }}
                          >
                            <div
                              className="h-full transition-all duration-1000"
                              style={{
                                width: `${question.average}%`,
                                backgroundColor: getScoreColor(question.average)
                              }}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between mt-2 text-xs opacity-60">
                            <span>Min: {question.min}</span>
                            <span>Max: {question.max}</span>
                            <span>{question.response_count} responses</span>
                          </div>
                        </div>

                        {/* Comments Preview */}
                        {question.comments.length > 0 && (
                          <div className="mt-6 pt-6 border-t" style={{ 
                            borderColor: mode === 'chaos' 
                              ? 'rgba(255, 255, 255, 0.1)' 
                              : mode === 'chill'
                              ? 'rgba(74, 24, 24, 0.1)'
                              : 'rgba(255, 255, 255, 0.1)'
                          }}>
                            <p className={`text-xs uppercase tracking-wider mb-3 opacity-60 ${getTextClass()}`}>
                              Sample Comments
                            </p>
                            <div className="space-y-2">
                              {question.comments.slice(0, 2).map((comment, cIndex) => (
                                <p 
                                  key={cIndex}
                                  className={`text-sm italic ${getTextClass()} opacity-80`}
                                  style={{ lineHeight: '1.6' }}
                                >
                                  "{comment.length > 100 ? comment.substring(0, 100) + '...' : comment}"
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  {weekIndex < weeks.length - 1 && (
                    <div 
                      className="h-px my-12 opacity-20"
                      style={{
                        backgroundColor: mode === 'chaos' 
                          ? '#FFFFFF' 
                          : mode === 'chill'
                          ? '#4A1818'
                          : '#FFFFFF'
                      }}
                    />
                  )}
                </section>
              )
            })}
          </div>
        )}

        <Footer />
      </main>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

