'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Calendar, User, ArrowRight } from 'lucide-react'
import { useMode } from '@/contexts/mode-context'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Image from 'next/image'
import './news-card.css'

interface NewsItem {
  id: string
  title: string
  content?: string | null
  url?: string | null
  image_url?: string | null
  category?: string | null
  tags?: string[] | null
  pinned?: boolean
  headline_only?: boolean
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
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)

  useEffect(() => {
    async function fetchNews() {
      try {
        // Calculate date 7 days ago
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0]

        // Fetch up to 2 news items from past 7 days (prioritize pinned)
        const response = await fetch(`/api/news?limit=2&sortBy=published_date&sortOrder=desc&publishedAfter=${sevenDaysAgoStr}`, {
          cache: 'no-store'
        })
        const result = await response.json()
        
        if (response.ok && result.data && result.data.length > 0) {
          // Sort to show pinned first, then by date
          const sorted = result.data.sort((a: NewsItem, b: NewsItem) => {
            if (a.pinned && !b.pinned) return -1
            if (!a.pinned && b.pinned) return 1
            return 0
          })
          setNews(sorted.slice(0, 2)) // Take up to 2
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

  // Get the first news item with an image/GIF for the left side
  const newsWithImage = news.find(item => item.image_url) || news[0]
  const otherNews = news.filter(item => item.id !== newsWithImage.id).slice(0, 1) // Get up to 1 more

  const getRoundedClass = () => {
    if (mode === 'chaos') return 'rounded-[1.5rem]'
    if (mode === 'chill') return 'rounded-2xl'
    return 'rounded-none'
  }

  const getDialogStyle = () => {
    if (mode === 'chaos') {
      return {
        bg: 'bg-[#1A1A1A]',
        border: 'border-2 border-[#C4F500]',
        text: 'text-white',
        accent: '#C4F500'
      }
    } else if (mode === 'chill') {
      return {
        bg: 'bg-white',
        border: 'border-2 border-[#FFC043]',
        text: 'text-[#4A1818]',
        accent: '#FFC043'
      }
    } else {
      return {
        bg: 'bg-[#000000]',
        border: 'border-2 border-[#FFFFFF]',
        text: 'text-[#FFFFFF]',
        accent: '#FFFFFF'
      }
    }
  }

  const dialogStyle = getDialogStyle()
  
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const handleCardClick = (newsItem: NewsItem) => {
    setSelectedNews(newsItem)
    setDialogOpen(true)
  }

  // Light grey background - no borders, compact design
  const bgColor = mode === 'chaos' ? 'bg-[#2A2A2A]' : mode === 'chill' ? 'bg-[#E8DCC8]' : 'bg-[#1A1A1A]'
  const textColor = mode === 'chaos' ? 'text-white' : mode === 'chill' ? 'text-[#4A1818]' : 'text-white'

  return (
    <>
      <div className="mb-6">
        <div className={`${bgColor} p-4 ${getRoundedClass()} w-full`}>
          <div className="flex gap-4 h-32 md:h-36">
            {/* Left Side - GIF/Image */}
            {newsWithImage.image_url && (
              <div className="flex-shrink-0 w-32 md:w-40 h-full">
                <div className={`relative w-full h-full ${getRoundedClass()} overflow-hidden`}>
                  {newsWithImage.image_url.endsWith('.gif') ? (
                    <img
                      src={newsWithImage.image_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={newsWithImage.image_url}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Right Side - News Cards */}
            <div className="flex-1 flex gap-3 overflow-hidden">
              {/* First news card */}
              <div 
                className={`flex-1 ${bgColor} ${getRoundedClass()} p-3 cursor-pointer hover:opacity-80 transition-opacity`}
                onClick={() => handleCardClick(newsWithImage)}
              >
                <h3 className={`text-sm md:text-base font-bold ${textColor} line-clamp-2 mb-1`}>
                  {newsWithImage.title}
                </h3>
                {newsWithImage.published_date && (
                  <p className={`text-xs ${textColor}/60`}>
                    {formatDate(newsWithImage.published_date)}
                  </p>
                )}
              </div>

              {/* Second news card (if available) */}
              {otherNews.length > 0 && (
                <div 
                  className={`flex-1 ${bgColor} ${getRoundedClass()} p-3 cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={() => handleCardClick(otherNews[0])}
                >
                  <h3 className={`text-sm md:text-base font-bold ${textColor} line-clamp-2 mb-1`}>
                    {otherNews[0].title}
                  </h3>
                  {otherNews[0].published_date && (
                    <p className={`text-xs ${textColor}/60`}>
                      {formatDate(otherNews[0].published_date)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* News Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent 
          className={`${dialogStyle.bg} ${dialogStyle.border} ${getRoundedClass()} max-w-4xl max-h-[90vh] overflow-y-auto p-0`}
          style={{ borderWidth: '2px' }}
        >
          <DialogHeader className={`p-6 pb-4 border-b ${dialogStyle.border}`} style={{ borderWidth: '0 0 2px 0' }}>
            <div className="flex items-center gap-3 mb-2">
              {selectedNews?.pinned && (
                <Badge 
                  className="text-xs font-black uppercase"
                  style={{ 
                    backgroundColor: dialogStyle.accent,
                    color: mode === 'chaos' ? '#000000' : mode === 'chill' ? '#4A1818' : '#000000'
                  }}
                >
                  Pinned
                </Badge>
              )}
              {selectedNews?.category && (
                <Badge 
                  variant="outline"
                  className={`text-xs ${dialogStyle.text} border-current/50`}
                >
                  {selectedNews.category}
                </Badge>
              )}
            </div>
            <DialogTitle className={`text-3xl md:text-4xl font-black ${dialogStyle.text} leading-tight`}>
              {selectedNews?.title}
            </DialogTitle>
            <div className="flex items-center gap-4 text-sm mt-3">
              {selectedNews?.published_date && (
                <div className={`flex items-center gap-2 ${dialogStyle.text}/80`}>
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(selectedNews.published_date)}</span>
                </div>
              )}
              {selectedNews?.submitted_by_profile?.full_name && (
                <div className={`flex items-center gap-2 ${dialogStyle.text}/80`}>
                  <User className="w-4 h-4" />
                  <span>{selectedNews.submitted_by_profile.full_name}</span>
                </div>
              )}
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6">
            {selectedNews?.image_url && (
              <div className={`relative w-full aspect-video ${getRoundedClass()} overflow-hidden`}>
                {selectedNews.image_url.endsWith('.gif') ? (
                  <img
                    src={selectedNews.image_url}
                    alt={selectedNews.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={selectedNews.image_url}
                    alt={selectedNews.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            )}

            {selectedNews?.content && (
              <div className={`prose prose-invert max-w-none ${dialogStyle.text}`}>
                <p className={`text-base md:text-lg leading-relaxed whitespace-pre-wrap ${dialogStyle.text}`}>
                  {selectedNews.content}
                </p>
              </div>
            )}

            {selectedNews?.tags && selectedNews.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedNews.tags.map((tag, idx) => (
                  <Badge 
                    key={idx}
                    variant="outline"
                    className={`text-xs ${dialogStyle.text} border-current/50`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {selectedNews?.url && (
              <div className="pt-4 border-t" style={{ borderColor: `${dialogStyle.accent}30` }}>
                <a
                  href={selectedNews.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-6 py-3 ${getRoundedClass()} font-black text-sm uppercase transition-all hover:opacity-80`}
                  style={{
                    backgroundColor: dialogStyle.accent,
                    color: mode === 'chaos' ? '#000000' : mode === 'chill' ? '#4A1818' : '#000000'
                  }}
                >
                  Read Full Article
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

