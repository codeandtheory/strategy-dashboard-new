'use client'

import { useEffect, useState } from 'react'
import { useMode } from '@/contexts/mode-context'
import { Card } from '@/components/ui/card'
import { Loader2, Music } from 'lucide-react'

interface SpotifyOEmbedPlayerProps {
  spotifyUrl?: string // Spotify track, album, or playlist URL
  height?: number // Height of the embed (default: 352 for compact player)
}

export function SpotifyOEmbedPlayer({ spotifyUrl, height = 352 }: SpotifyOEmbedPlayerProps) {
  const { mode } = useMode()
  const [embedHtml, setEmbedHtml] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Default Spotify URL - you can change this to any Spotify track/album/playlist
  const defaultUrl = spotifyUrl || 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M' // Spotify's "Today's Top Hits"

  useEffect(() => {
    async function fetchOEmbed() {
      if (!defaultUrl) {
        setError('No Spotify URL provided')
        setLoading(false)
        return
      }

      try {
        // Spotify oEmbed endpoint
        const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(defaultUrl)}&height=${height}`
        
        const response = await fetch(oembedUrl)
        if (!response.ok) {
          throw new Error('Failed to fetch Spotify embed')
        }

        const data = await response.json()
        setEmbedHtml(data.html)
        setError(null)
      } catch (err: any) {
        console.error('Error fetching Spotify oEmbed:', err)
        setError(err.message || 'Failed to load Spotify player')
      } finally {
        setLoading(false)
      }
    }

    fetchOEmbed()
  }, [defaultUrl, height])

  const getCardStyle = () => {
    switch (mode) {
      case 'chaos':
        return {
          bg: 'bg-gradient-to-br from-[#1DB954] to-[#191414]',
          border: 'border-0',
          text: 'text-white',
          accent: '#1DB954'
        }
      case 'chill':
        return {
          bg: 'bg-gradient-to-br from-[#1DB954] to-[#191414]',
          border: 'border-0',
          text: 'text-white',
          accent: '#1DB954'
        }
      case 'code':
        return {
          bg: 'bg-gradient-to-br from-[#1DB954] to-[#191414]',
          border: 'border-0',
          text: 'text-white',
          accent: '#1DB954'
        }
      default:
        return {
          bg: 'bg-gradient-to-br from-[#1DB954] to-[#191414]',
          border: 'border-0',
          text: 'text-white',
          accent: '#1DB954'
        }
    }
  }

  const getRoundedClass = (defaultClass: string) => {
    if (mode === 'chaos') {
      return defaultClass.replace(/rounded(-\w+)?/g, 'rounded-[1.5rem]')
    }
    if (mode === 'chill') {
      return defaultClass.replace(/rounded(-\w+)?/g, 'rounded-2xl')
    }
    return defaultClass
  }

  const style = getCardStyle()

  return (
    <Card className={`${style.bg} ${style.border} p-6 ${getRoundedClass('rounded-[2.5rem]')} relative overflow-hidden`}>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className={`w-6 h-6 animate-spin ${style.text}`} />
        </div>
      ) : error ? (
        <div className="space-y-3">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className={`text-lg font-black uppercase ${style.text}`}>SPOTIFY</h2>
            </div>
            <Music className={`w-6 h-6 ${style.text}`} />
          </div>
          <p className={`text-sm ${style.text}/80`}>{error}</p>
        </div>
      ) : embedHtml ? (
        <div className="space-y-4">
          <div className="flex items-start justify-between relative z-10">
            <div>
              <h2 className={`text-lg font-black uppercase ${style.text}`}>SPOTIFY</h2>
            </div>
            <Music className={`w-6 h-6 ${style.text}`} />
          </div>
          <div 
            className="relative z-10"
            dangerouslySetInnerHTML={{ __html: embedHtml }}
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className={`text-lg font-black uppercase ${style.text}`}>SPOTIFY</h2>
            </div>
            <Music className={`w-6 h-6 ${style.text}`} />
          </div>
          <p className={`text-sm ${style.text}/80`}>No content available</p>
        </div>
      )}
    </Card>
  )
}

