'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/auth-context'
import { useMode } from '@/contexts/mode-context'
import { SiteHeader } from '@/components/site-header'
import { Footer } from '@/components/footer'
import { PlaylistCard } from '@/components/playlist-card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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

export default function PlaylistArchivePage() {
  const { user, loading: authLoading } = useAuth()
  const { mode } = useMode()
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [playlists, setPlaylists] = useState<Playlist[]>([])

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

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user || authLoading) return
    
    async function fetchPlaylists() {
      try {
        setLoading(true)
        const response = await fetch('/api/playlists')
        
        if (response.ok) {
          const data = await response.json()
          if (data && Array.isArray(data)) {
            setPlaylists(data)
          }
        } else {
          // Fallback to direct Supabase query
          const { data } = await supabase
            .from('playlists')
            .select('*')
            .order('date', { ascending: false })
          if (data) {
            setPlaylists(data.map(p => ({
              id: p.id,
              date: p.date,
              title: p.title,
              curator: p.curator,
              curator_photo_url: p.curator_photo_url,
              cover_url: p.cover_url,
              description: p.description,
              spotify_url: p.spotify_url,
              created_at: p.created_at,
              week_label: p.week_label
            })))
          }
        }
      } catch (error) {
        console.error('Error fetching playlists:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPlaylists()
  }, [user, authLoading, supabase])

  if (!user && !authLoading) {
    return null
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
          <h1 className={`text-6xl font-black uppercase mb-4 ${getTextClass()}`}>Playlist Archive</h1>
          <p className={`text-xl ${getTextClass()} opacity-70`}>
            All weekly playlists curated by the team
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className={`text-lg ${getTextClass()} opacity-60`}>Loading playlists...</p>
          </div>
        ) : playlists.length === 0 ? (
          <div className="text-center py-20">
            <p className={`text-lg ${getTextClass()} opacity-60`}>No playlists available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {playlists.map((playlist) => (
              <div key={playlist.id}>
                <PlaylistCard
                  id={playlist.id}
                  title={playlist.title}
                  curator={playlist.curator}
                  description={playlist.description}
                  spotify_url={playlist.spotify_url}
                  cover_url={playlist.cover_url}
                  curator_photo_url={playlist.curator_photo_url}
                  date={playlist.date}
                  week_label={playlist.week_label}
                  className="archive"
                />
              </div>
            ))}
          </div>
        )}
        
        <Footer />
      </main>
    </div>
  )
}

