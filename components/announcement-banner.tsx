'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { useMode } from '@/contexts/mode-context'
import './announcement-banner.css'

interface Announcement {
  id: string
  headline: string
  mode: 'text' | 'countdown'
  event_name: string | null
  target_date: string | null
  text_format: 'days_until' | 'happens_in' | null
  start_date: string
  end_date: string | null
  active: boolean
}

export function AnnouncementBanner() {
  const { mode } = useMode()
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [loading, setLoading] = useState(true)
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null)

  useEffect(() => {
    async function fetchAnnouncement() {
      try {
        const response = await fetch('/api/announcements', {
          cache: 'no-store'
        })
        const result = await response.json()
        
        if (response.ok && result.data && result.data.length > 0) {
          setAnnouncement(result.data[0])
        }
      } catch (error) {
        console.error('Error fetching announcement:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncement()
  }, [])

  // Calculate days remaining
  useEffect(() => {
    if (!announcement || announcement.mode !== 'countdown' || !announcement.target_date) {
      setDaysRemaining(null)
      return
    }

    const updateCountdown = () => {
      const now = new Date()
      const target = new Date(announcement.target_date!)
      const difference = target.getTime() - now.getTime()

      if (difference <= 0) {
        setDaysRemaining(null)
        return
      }

      // Calculate days (round up to include partial days, minimum 0)
      const days = Math.max(0, Math.ceil(difference / (1000 * 60 * 60 * 24)))
      setDaysRemaining(days)
    }

    updateCountdown()
    // Update once per day instead of every second
    const interval = setInterval(updateCountdown, 60 * 60 * 1000) // Every hour

    return () => clearInterval(interval)
  }, [announcement])

  if (loading || !announcement) {
    return null
  }

  const getRoundedClass = () => {
    if (mode === 'chaos') return 'rounded-[1.5rem]'
    if (mode === 'chill') return 'rounded-2xl'
    return 'rounded-none'
  }

  // Countdown mode
  if (announcement.mode === 'countdown' && announcement.event_name) {
    const isExpired = daysRemaining === null || daysRemaining <= 0
    const format = announcement.text_format || 'days_until'
    
    let displayText = ''
    if (isExpired) {
      displayText = `${announcement.event_name} has passed`
    } else if (format === 'happens_in') {
      displayText = `${announcement.event_name} happens in ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'}`
    } else {
      // Default: 'days_until'
      displayText = `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} until ${announcement.event_name}`
    }

    return (
      <div className="mb-6">
        <Card className={`bg-transparent border-0 p-0 ${getRoundedClass()} w-full overflow-hidden`}>
          <div className="relative h-20 md:h-24 overflow-hidden">
            <div className="absolute inset-0 flex items-center">
              <div className="animate-scroll-text whitespace-nowrap">
                <span className="text-white text-[clamp(2.5rem,8vw,5rem)] font-black uppercase leading-none tracking-tighter inline-block">
                  {displayText} • {displayText} • {displayText} • 
                </span>
              </div>
            </div>
            {/* Gradient overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-transparent to-transparent z-10 pointer-events-none"></div>
          </div>
        </Card>
      </div>
    )
  }

  // Text mode - scrolling headline
  return (
    <div className="mb-6">
      <Card className={`bg-transparent border-0 p-0 ${getRoundedClass()} w-full overflow-hidden`}>
        <div className="relative h-20 md:h-24 overflow-hidden">
          <div className="absolute inset-0 flex items-center">
            <div className="animate-scroll-text whitespace-nowrap">
              <span className="text-white text-[clamp(2.5rem,8vw,5rem)] font-black uppercase leading-none tracking-tighter inline-block">
                {announcement.headline} • {announcement.headline} • {announcement.headline} • 
              </span>
            </div>
          </div>
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-transparent to-transparent z-10 pointer-events-none"></div>
        </div>
      </Card>
    </div>
  )
}

