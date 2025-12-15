'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Calendar, User } from 'lucide-react'
import { useMode } from '@/contexts/mode-context'
import Link from 'next/link'
import Image from 'next/image'

interface NewsItem {
  id: string
  title: string
  content?: string | null
  url?: string | null
  image_url?: string | null
  category?: string | null
  tags?: string[] | null
  pinned?: boolean
  published_date?: string | null
  submitted_by_profile?: {
    full_name?: string | null
    email?: string | null
  } | null
}

export function NewsCard() {
  const { mode } = useMode()
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNews() {
      try {
        // Fetch pinned news first, then most recent if no pinned
        const response = await fetch('/api/news?pinned=true&limit=1&sortBy=published_date&sortOrder=desc', {
          cache: 'no-store'
        })
        const result = await response.json()
        
        if (response.ok && result.data && result.data.length > 0) {
          setNews(result.data)
        } else {
          // If no pinned news, fetch most recent
          const recentResponse = await fetch('/api/news?limit=1&sortBy=published_date&sortOrder=desc', {
            cache: 'no-store'
          })
          const recentResult = await recentResponse.json()
          if (recentResponse.ok && recentResult.data && recentResult.data.length > 0) {
            setNews(recentResult.data)
          }
        }
      } catch (error) {
        console.error('Error fetching news:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  if (loading || news.length === 0) {
    return null
  }

  const latestNews = news[0]

  const getCardStyle = () => {
    if (mode === 'chaos') {
      return {
        bg: 'bg-[#1A1A1A]',
        border: 'border border-[#C4F500]',
        text: 'text-white',
        accent: '#C4F500'
      }
    } else if (mode === 'chill') {
      return {
        bg: 'bg-white',
        border: 'border border-[#FFC043]/30',
        text: 'text-[#4A1818]',
        accent: '#FFC043'
      }
    } else {
      return {
        bg: 'bg-[#000000]',
        border: 'border border-[#FFFFFF]',
        text: 'text-[#FFFFFF]',
        accent: '#FFFFFF'
      }
    }
  }

  const getRoundedClass = () => {
    if (mode === 'chaos') return 'rounded-[1.5rem]'
    if (mode === 'chill') return 'rounded-2xl'
    return 'rounded-none'
  }

  const style = getCardStyle()
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="mb-6">
      <Card className={`${style.bg} ${style.border} p-6 ${getRoundedClass()} w-full`}>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image Section */}
          {latestNews.image_url && (
            <div className="md:w-1/3 flex-shrink-0">
              <div className={`relative w-full aspect-video ${getRoundedClass()} overflow-hidden`}>
                <Image
                  src={latestNews.image_url}
                  alt={latestNews.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Content Section */}
          <div className={`flex-1 flex flex-col ${latestNews.image_url ? '' : 'md:flex-row md:items-center md:gap-6'}`}>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                {latestNews.pinned && (
                  <Badge 
                    className="text-xs font-black uppercase"
                    style={{ 
                      backgroundColor: style.accent,
                      color: mode === 'chaos' ? '#000000' : mode === 'chill' ? '#4A1818' : '#000000'
                    }}
                  >
                    Pinned
                  </Badge>
                )}
                {latestNews.category && (
                  <Badge 
                    variant="outline"
                    className={`text-xs ${style.text} border-current/30`}
                  >
                    {latestNews.category}
                  </Badge>
                )}
              </div>

              <h3 className={`text-2xl font-black mb-3 ${style.text}`}>
                {latestNews.title}
              </h3>

              {latestNews.content && (
                <p className={`text-sm mb-4 line-clamp-2 ${style.text}/80`}>
                  {latestNews.content}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs flex-wrap">
                {latestNews.published_date && (
                  <div className={`flex items-center gap-1.5 ${style.text}/70`}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(latestNews.published_date)}</span>
                  </div>
                )}
                {latestNews.submitted_by_profile?.full_name && (
                  <div className={`flex items-center gap-1.5 ${style.text}/70`}>
                    <User className="w-3.5 h-3.5" />
                    <span>{latestNews.submitted_by_profile.full_name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            {latestNews.url && (
              <div className="mt-4 md:mt-0">
                <Link
                  href={latestNews.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 py-2 ${getRoundedClass()} font-semibold text-sm transition-all hover:opacity-80`}
                  style={{
                    backgroundColor: style.accent,
                    color: mode === 'chaos' ? '#000000' : mode === 'chill' ? '#4A1818' : '#000000'
                  }}
                >
                  Read More
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

