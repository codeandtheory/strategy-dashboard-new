'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/auth-context'
import { useMode } from '@/contexts/mode-context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, Music, MessageCircle, Play } from 'lucide-react'
import { PlaylistData } from '@/lib/spotify-player-types'
import { PlaylistCard } from '@/components/playlist-card'

interface BeastBabe {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  snaps_count: number
}

interface QuestionAnswer {
  id: string
  answer: string
  author: string
}

interface Playlist {
  id: string
  date: string
  title: string | null
  curator: string
  curator_photo_url?: string | null
  cover_url?: string | null
  description?: string | null
  spotify_url: string
  created_at: string
  week_label?: string | null
}

export default function VibesPage() {
  const { user, loading: authLoading } = useAuth()
  const { mode } = useMode()
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [beastBabe, setBeastBabe] = useState<BeastBabe | null>(null)
  const [questionOfWeek, setQuestionOfWeek] = useState<string>('')
  const [answers, setAnswers] = useState<QuestionAnswer[]>([])
  const [weeklyPlaylist, setWeeklyPlaylist] = useState<Playlist | null>(null)
  const [archivePlaylists, setArchivePlaylists] = useState<Playlist[]>([])

  // Get card style
  const getCardStyle = () => {
    if (mode === 'chaos') {
      return { bg: 'bg-[#000000]', border: 'border-0', text: 'text-white', accent: '#E8FF00' }
    } else if (mode === 'chill') {
      return { bg: 'bg-white', border: 'border border-[#C8D961]/30', text: 'text-[#4A1818]', accent: '#C8D961' }
    } else {
      return { bg: 'bg-[#000000]', border: 'border border-[#FFFFFF]', text: 'text-[#FFFFFF]', accent: '#FFFFFF' }
    }
  }

  const style = getCardStyle()

  const getRoundedClass = (base: string) => {
    if (mode === 'code') return 'rounded-none'
    return base
  }

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      if (!user) return
      
      setLoading(true)
      
      try {
        // TODO: Fetch Beast Babe from beast_babe table when it's created
        // For now, using placeholder data
        setBeastBabe({
          id: 'placeholder',
          full_name: 'Sarah J.',
          email: null,
          avatar_url: null,
          snaps_count: 42
        })

        // Fetch Question of the Week (placeholder - you'll need to create a questions table)
        setQuestionOfWeek("What's one thing you learned this week?")
        setAnswers([
          { id: '1', answer: "How to use CSS Grid effectively!", author: 'Alex' },
          { id: '2', answer: "Better time management techniques", author: 'Sarah' }
        ])

        // Fetch Weekly Playlist (placeholder - you'll need to create a playlists table)
        // For now, using mock data
        setWeeklyPlaylist({
          id: '1',
          title: 'Coding Vibes',
          curator: 'Alex',
          curator_photo_url: null,
          cover_url: null,
          description: null,
          spotify_url: 'https://open.spotify.com/playlist/example',
          created_at: new Date().toISOString()
        })

        // Fetch Archive Playlists (past playlists)
        setArchivePlaylists([
          { id: '1', title: 'Coding Vibes', curator: 'Alex', created_at: new Date().toISOString(), week_label: 'This Week' },
          { id: '2', title: 'Focus Flow', curator: 'Sarah', created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), week_label: 'Last Week' },
          { id: '3', title: 'Creative Energy', curator: 'Mike', created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), week_label: '2 Weeks Ago' },
          { id: '4', title: 'Chill Beats', curator: 'Jamie', created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), week_label: '3 Weeks Ago' }
        ])
      } catch (err: any) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }
    
    if (user) {
      fetchData()
    }
  }, [user, supabase])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: mode === 'chill' ? '#F5E6D3' : mode === 'code' ? '#000000' : '#1A1A1A' }}>
        <div className="text-center">
          <p style={{ color: style.text }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: mode === 'chill' ? '#F5E6D3' : mode === 'code' ? '#000000' : '#1A1A1A' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className={`text-5xl font-black mb-8 ${style.text}`}>Vibes</h1>

        {/* Top Row - Three Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Beast Babe Card */}
          <Card className={`${getRoundedClass('rounded-[2.5rem]')} p-6`} style={{ backgroundColor: '#FF6B6B' }}>
            <p className="text-xs uppercase tracking-wider font-black text-white mb-2">THIS WEEK'S</p>
            <h2 className="text-4xl font-black text-white mb-6 uppercase">BEAST<br/>BABE</h2>
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                <Trophy className="w-10 h-10 text-[#FF6B6B]" />
              </div>
            </div>
            {beastBabe ? (
              <>
                <p className="text-2xl font-black text-white text-center mb-1">
                  {beastBabe.full_name || 'Anonymous'}
                </p>
                <p className="text-sm font-medium text-white/90 text-center">
                  {beastBabe.snaps_count} Snaps Received
                </p>
              </>
            ) : (
              <p className="text-sm font-medium text-white/90 text-center">No data yet</p>
            )}
          </Card>

          {/* Question of the Week Card */}
          <Card className={`${getRoundedClass('rounded-[2.5rem]')} p-6`} style={{ backgroundColor: '#6B2C91' }}>
            <p className="text-xs uppercase tracking-wider font-black text-white mb-4">QUESTION OF THE WEEK</p>
            <h2 className="text-2xl font-black text-white mb-6 leading-tight">
              {questionOfWeek}
            </h2>
            <div className="space-y-3 mb-6">
              {answers.map((answer) => (
                <div
                  key={answer.id}
                  className={`${getRoundedClass('rounded-xl')} p-3`}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <p className="text-sm text-white font-medium">{answer.answer}</p>
                  <p className="text-xs text-white/70 mt-1">- {answer.author}</p>
                </div>
              ))}
            </div>
            <Button
              className={`w-full ${getRoundedClass('rounded-xl')} bg-white text-[#6B2C91] hover:bg-white/90 font-black h-12 uppercase`}
            >
              Share Your Answer
            </Button>
          </Card>

          {/* Weekly Playlist Card */}
          <Card className={`${getRoundedClass('rounded-[2.5rem]')} p-6`} style={{ backgroundColor: '#9D4EFF' }}>
            <p className="text-xs uppercase tracking-wider font-black text-white mb-2">WEEKLY</p>
            <h2 className="text-4xl font-black mb-6 uppercase" style={{ color: '#00D4FF' }}>PLAYLIST</h2>
            <div className="flex items-center justify-center mb-4">
              <div className={`w-16 h-16 ${getRoundedClass('rounded-xl')} flex items-center justify-center`} style={{ backgroundColor: '#00D4FF' }}>
                <Music className="w-8 h-8 text-[#9D4EFF]" />
              </div>
            </div>
            {weeklyPlaylist ? (
              <>
                <p className="text-lg font-black text-white text-center mb-1">{weeklyPlaylist.title}</p>
                <p className="text-sm font-medium text-white/90 text-center mb-6">Curated by {weeklyPlaylist.curator}</p>
                <Button
                  className={`w-full ${getRoundedClass('rounded-xl')} font-black h-12 uppercase flex items-center justify-center gap-2`}
                  style={{ backgroundColor: '#00D4FF', color: '#9D4EFF' }}
                  onClick={() => weeklyPlaylist.spotify_url && window.open(weeklyPlaylist.spotify_url, '_blank')}
                >
                  <Play className="w-4 h-4" />
                  Play on Spotify
                </Button>
              </>
            ) : (
              <p className="text-sm font-medium text-white/90 text-center">No playlist this week</p>
            )}
          </Card>
        </div>

        {/* Archive Section */}
        <div className="mb-8">
          <h2 className={`text-4xl font-black mb-6 ${style.text}`}>Archive</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {archivePlaylists.map((playlist) => (
              <Card
                key={playlist.id}
                className={`${getRoundedClass('rounded-[2.5rem]')} p-6 relative overflow-hidden`}
                style={{
                  background: 'linear-gradient(to bottom, #6B2C91, #FF6B6B)',
                  minHeight: '200px'
                }}
              >
                <div className="flex items-center justify-center mb-4">
                  <Music className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-lg font-black text-white mb-2">{playlist.title}</h3>
                <p className="text-sm text-white/90 mb-1">By {playlist.curator}</p>
                <p className="text-xs text-white/70 mb-4">{playlist.week_label}</p>
                <Button
                  className={`w-full ${getRoundedClass('rounded-xl')} bg-black text-white hover:bg-black/90 font-black h-10 uppercase flex items-center justify-center gap-2`}
                >
                  <Play className="w-3 h-3" />
                  Play
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
