'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMode } from '@/contexts/mode-context'
import { useAuth } from '@/contexts/auth-context'
import { SiteHeader } from '@/components/site-header'
import { Card } from '@/components/ui/card'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/client'
import { useGoogleCalendarToken } from '@/hooks/useGoogleCalendarToken'
import { 
  Users, 
  Calendar, 
  Trophy, 
  MessageSquare, 
  Briefcase,
  Cake,
  PartyPopper,
  TrendingUp,
  Crown,
  ArrowRight,
  Loader2
} from 'lucide-react'
import Link from 'next/link'

export default function TeamPage() {
  const { user, loading: authLoading } = useAuth()
  const { mode } = useMode()
  const router = useRouter()
  const supabase = createClient()
  const { accessToken } = useGoogleCalendarToken()
  
  const [loading, setLoading] = useState(true)
  const [teamStats, setTeamStats] = useState({
    totalTeamMembers: 0,
    totalSnaps: 0,
    activePitches: 0,
    snapLeader: null as { id: string; full_name: string | null; email: string | null; count: number } | null
  })
  const [birthdays, setBirthdays] = useState<Array<{ id: string; full_name: string | null; birthday: string; avatar_url: string | null }>>([])
  const [anniversaries, setAnniversaries] = useState<Array<{ id: string; full_name: string | null; start_date: string; avatar_url: string | null; years: number }>>([])
  const [snapLeaderboard, setSnapLeaderboard] = useState<Array<{ id: string; full_name: string | null; email: string | null; count: number }>>([])
  const [calendarEvents, setCalendarEvents] = useState<any[]>([])
  const [beastBabeData, setBeastBabeData] = useState<any>(null)
  const [allProfiles, setAllProfiles] = useState<any[]>([])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchAllData()
    }
  }, [user, accessToken])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        fetchTeamStats(),
        fetchBirthdays(),
        fetchAnniversaries(),
        fetchSnapLeaderboard(),
        fetchCalendarEvents(),
        fetchBeastBabe(),
        fetchAllProfiles()
      ])
    } catch (error) {
      console.error('Error fetching team data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTeamStats = async () => {
    try {
      // Total team members
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .eq('is_active', true)
      
      // Total snaps
      const { data: snaps, error: snapsError } = await supabase
        .from('snaps')
        .select('id')
      
      // Active pitches (work samples with type "Pitch" from last 6 months)
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      const { data: pitches, error: pitchesError } = await supabase
        .from('work_samples')
        .select(`
          id,
          work_sample_types!inner(name)
        `)
        .eq('work_sample_types.name', 'Pitch')
        .gte('date', sixMonthsAgo.toISOString().split('T')[0])
      
      // Snap leader
      const { data: allSnaps, error: allSnapsError } = await supabase
        .from('snaps')
        .select('submitted_by, submitted_by_profile:profiles!submitted_by(id, full_name, email)')
      
      if (!allSnapsError && allSnaps) {
        const snapCounts: Record<string, { count: number; profile: any }> = {}
        allSnaps.forEach((snap: any) => {
          if (snap.submitted_by) {
            if (!snapCounts[snap.submitted_by]) {
              snapCounts[snap.submitted_by] = {
                count: 0,
                profile: snap.submitted_by_profile
              }
            }
            snapCounts[snap.submitted_by].count++
          }
        })
        
        let leader: { id: string; full_name: string | null; email: string | null; count: number } | null = null
        Object.entries(snapCounts).forEach(([userId, data]) => {
          if (!leader || data.count > leader.count) {
            leader = {
              id: userId,
              full_name: data.profile?.full_name || null,
              email: data.profile?.email || null,
              count: data.count
            }
          }
        })
        
        setTeamStats({
          totalTeamMembers: profiles?.length || 0,
          totalSnaps: snaps?.length || 0,
          activePitches: pitches?.length || 0,
          snapLeader: leader
        })
      }
    } catch (error) {
      console.error('Error fetching team stats:', error)
    }
  }

  const fetchBirthdays = async () => {
    try {
      const now = new Date()
      const currentMonth = now.getMonth() + 1
      const currentDay = now.getDate()
      
      // Get birthdays for current month
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, birthday, avatar_url')
        .eq('is_active', true)
        .not('birthday', 'is', null)
      
      if (!error && profiles) {
        const upcomingBirthdays = profiles
          .map(profile => {
            if (!profile.birthday) return null
            const [month, day] = profile.birthday.split('/').map(Number)
            return { profile, month, day }
          })
          .filter((item): item is { profile: any; month: number; day: number } => item !== null)
          .filter(item => {
            // Show birthdays in current month or next month
            return item.month === currentMonth || item.month === (currentMonth % 12) + 1
          })
          .sort((a, b) => {
            if (a.month !== b.month) return a.month - b.month
            return a.day - b.day
          })
          .slice(0, 10)
          .map(item => item.profile)
        
        setBirthdays(upcomingBirthdays)
      }
    } catch (error) {
      console.error('Error fetching birthdays:', error)
    }
  }

  const fetchAnniversaries = async () => {
    try {
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() + 1
      
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, start_date, avatar_url')
        .eq('is_active', true)
        .not('start_date', 'is', null)
      
      if (!error && profiles) {
        const upcomingAnniversaries = profiles
          .map(profile => {
            if (!profile.start_date) return null
            const [year, month, day] = profile.start_date.split('-').map(Number)
            const years = currentYear - year
            return { profile, month, day, years }
          })
          .filter((item): item is { profile: any; month: number; day: number; years: number } => item !== null)
          .filter(item => {
            // Show anniversaries in current month or next month
            return item.month === currentMonth || item.month === (currentMonth % 12) + 1
          })
          .sort((a, b) => {
            if (a.month !== b.month) return a.month - b.month
            return a.day - b.day
          })
          .slice(0, 10)
          .map(item => ({
            ...item.profile,
            years: item.years
          }))
        
        setAnniversaries(upcomingAnniversaries)
      }
    } catch (error) {
      console.error('Error fetching anniversaries:', error)
    }
  }

  const fetchSnapLeaderboard = async () => {
    try {
      const { data: allSnaps, error } = await supabase
        .from('snaps')
        .select('submitted_by, submitted_by_profile:profiles!submitted_by(id, full_name, email)')
      
      if (!error && allSnaps) {
        const snapCounts: Record<string, { count: number; profile: any }> = {}
        allSnaps.forEach((snap: any) => {
          if (snap.submitted_by) {
            if (!snapCounts[snap.submitted_by]) {
              snapCounts[snap.submitted_by] = {
                count: 0,
                profile: snap.submitted_by_profile
              }
            }
            snapCounts[snap.submitted_by].count++
          }
        })
        
        const leaderboard = Object.entries(snapCounts)
          .map(([userId, data]) => ({
            id: userId,
            full_name: data.profile?.full_name || null,
            email: data.profile?.email || null,
            count: data.count
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)
        
        setSnapLeaderboard(leaderboard)
      }
    } catch (error) {
      console.error('Error fetching snap leaderboard:', error)
    }
  }

  const fetchCalendarEvents = async () => {
    if (!accessToken) return
    
    try {
      const now = new Date()
      const timeMin = now.toISOString()
      // Expanded: 60 days instead of 30, more results
      const timeMax = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString()
      
      const response = await fetch(
        `/api/calendar?timeMin=${timeMin}&timeMax=${timeMax}&maxResults=100&accessToken=${encodeURIComponent(accessToken)}`
      )
      
      if (response.ok) {
        const data = await response.json()
        setCalendarEvents(data.events || [])
      }
    } catch (error) {
      console.error('Error fetching calendar events:', error)
    }
  }

  const fetchBeastBabe = async () => {
    try {
      const response = await fetch('/api/beast-babe')
      if (response.ok) {
        const data = await response.json()
        setBeastBabeData(data)
      }
    } catch (error) {
      console.error('Error fetching beast babe:', error)
    }
  }

  const fetchAllProfiles = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url, role, discipline, birthday, start_date, location')
        .eq('is_active', true)
        .order('full_name', { ascending: true })
      
      if (!error && profiles) {
        setAllProfiles(profiles)
      }
    } catch (error) {
      console.error('Error fetching profiles:', error)
    }
  }

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

  const getCardStyle = () => {
    if (mode === 'chaos') {
      return { 
        bg: 'bg-[#000000]', 
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

  const getRoundedClass = (base: string) => {
    if (mode === 'chaos') return base.replace('rounded', 'rounded-[1.5rem]')
    if (mode === 'chill') return base.replace('rounded', 'rounded-2xl')
    return base
  }

  if (authLoading || loading) {
    return (
      <div className={`${getBgClass()} ${getTextClass()} min-h-screen flex items-center justify-center`}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: getCardStyle().accent }} />
      </div>
    )
  }

  const cardStyle = getCardStyle()

  return (
    <div className={`${getBgClass()} ${getTextClass()} ${mode === 'code' ? 'font-mono' : 'font-[family-name:var(--font-raleway)]'} min-h-screen`}>
      <SiteHeader />
      
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-black uppercase tracking-wider ${getTextClass()} mb-2`}>Team</h1>
          <p className={`${getTextClass()}/70 text-sm`}>Get to know your team</p>
        </div>

        {/* Team by Numbers Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className={`${cardStyle.bg} ${cardStyle.border} border p-4 ${getRoundedClass('rounded-xl')}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs ${cardStyle.text}/70 mb-1`}>Team Members</p>
                <p className={`text-2xl font-black ${cardStyle.text}`}>{teamStats.totalTeamMembers}</p>
              </div>
              <Users className="w-6 h-6" style={{ color: cardStyle.accent }} />
            </div>
          </Card>
          
          <Card className={`${cardStyle.bg} ${cardStyle.border} border p-4 ${getRoundedClass('rounded-xl')}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs ${cardStyle.text}/70 mb-1`}>Total Snaps</p>
                <p className={`text-2xl font-black ${cardStyle.text}`}>{teamStats.totalSnaps}</p>
              </div>
              <MessageSquare className="w-6 h-6" style={{ color: cardStyle.accent }} />
            </div>
          </Card>
          
          <Card className={`${cardStyle.bg} ${cardStyle.border} border p-4 ${getRoundedClass('rounded-xl')}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs ${cardStyle.text}/70 mb-1`}>Active Pitches</p>
                <p className={`text-2xl font-black ${cardStyle.text}`}>{teamStats.activePitches}</p>
              </div>
              <Briefcase className="w-6 h-6" style={{ color: cardStyle.accent }} />
            </div>
          </Card>
          
          <Card className={`${cardStyle.bg} ${cardStyle.border} border p-4 ${getRoundedClass('rounded-xl')}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs ${cardStyle.text}/70 mb-1`}>Snap Leader</p>
                <p className={`text-lg font-black ${cardStyle.text} truncate`}>
                  {teamStats.snapLeader?.full_name || teamStats.snapLeader?.email || 'N/A'}
                </p>
                {teamStats.snapLeader && (
                  <p className={`text-xs ${cardStyle.text}/50`}>{teamStats.snapLeader.count} snaps</p>
                )}
              </div>
              <Trophy className="w-6 h-6" style={{ color: cardStyle.accent }} />
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Anniversaries */}
            <Card className={`${cardStyle.bg} ${cardStyle.border} border p-6 ${getRoundedClass('rounded-xl')}`}>
              <div className="flex items-center gap-2 mb-4">
                <PartyPopper className="w-5 h-5" style={{ color: cardStyle.accent }} />
                <h2 className={`text-xl font-black uppercase ${cardStyle.text}`}>Anniversaries</h2>
              </div>
              {anniversaries.length > 0 ? (
                <div className="space-y-3">
                  {anniversaries.map((anniversary) => (
                    <div key={anniversary.id} className="flex items-center gap-3">
                      {anniversary.avatar_url ? (
                        <img
                          src={anniversary.avatar_url}
                          alt={anniversary.full_name || 'User'}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: cardStyle.accent + '33' }}>
                          <Users className="w-5 h-5" style={{ color: cardStyle.accent }} />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className={`font-semibold ${cardStyle.text}`}>
                          {anniversary.full_name || 'Unknown'}
                        </p>
                        <p className={`text-sm ${cardStyle.text}/70`}>
                          {anniversary.years} year{anniversary.years !== 1 ? 's' : ''} at Strategy
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`${cardStyle.text}/60`}>No upcoming anniversaries</p>
              )}
            </Card>

            {/* Birthdays */}
            <Card className={`${cardStyle.bg} ${cardStyle.border} border p-6 ${getRoundedClass('rounded-xl')}`}>
              <div className="flex items-center gap-2 mb-4">
                <Cake className="w-5 h-5" style={{ color: cardStyle.accent }} />
                <h2 className={`text-xl font-black uppercase ${cardStyle.text}`}>Birthdays</h2>
              </div>
              {birthdays.length > 0 ? (
                <div className="space-y-3">
                  {birthdays.map((birthday) => (
                    <div key={birthday.id} className="flex items-center gap-3">
                      {birthday.avatar_url ? (
                        <img
                          src={birthday.avatar_url}
                          alt={birthday.full_name || 'User'}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: cardStyle.accent + '33' }}>
                          <Cake className="w-5 h-5" style={{ color: cardStyle.accent }} />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className={`font-semibold ${cardStyle.text}`}>
                          {birthday.full_name || 'Unknown'}
                        </p>
                        <p className={`text-sm ${cardStyle.text}/70`}>
                          Birthday: {birthday.birthday}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`${cardStyle.text}/60`}>No upcoming birthdays</p>
              )}
            </Card>

            {/* Snap Leaderboard */}
            <Card className={`${cardStyle.bg} ${cardStyle.border} border p-6 ${getRoundedClass('rounded-xl')}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" style={{ color: cardStyle.accent }} />
                  <h2 className={`text-xl font-black uppercase ${cardStyle.text}`}>Snap Leaderboard</h2>
                </div>
                <Link href="/snaps" className={`text-sm ${cardStyle.text}/70 hover:${cardStyle.text} flex items-center gap-1`}>
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              {snapLeaderboard.length > 0 ? (
                <div className="space-y-3">
                  {snapLeaderboard.map((person, index) => (
                    <div key={person.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${cardStyle.text}`} style={{ 
                        backgroundColor: index === 0 ? cardStyle.accent : cardStyle.accent + '33',
                        color: index === 0 ? '#000' : cardStyle.text
                      }}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${cardStyle.text}`}>
                          {person.full_name || person.email || 'Unknown'}
                        </p>
                      </div>
                      <p className={`font-black ${cardStyle.text}`} style={{ color: cardStyle.accent }}>
                        {person.count}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`${cardStyle.text}/60`}>No snaps yet</p>
              )}
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Calendar */}
            <Card className={`${cardStyle.bg} ${cardStyle.border} border p-6 ${getRoundedClass('rounded-xl')}`}>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5" style={{ color: cardStyle.accent }} />
                <h2 className={`text-xl font-black uppercase ${cardStyle.text}`}>Upcoming Events</h2>
              </div>
              {calendarEvents.length > 0 ? (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {calendarEvents.map((event) => {
                    const eventDate = event.start.dateTime 
                      ? new Date(event.start.dateTime)
                      : event.start.date 
                        ? new Date(event.start.date)
                        : null
                    
                    return (
                      <div key={event.id} className="p-2 rounded" style={{ backgroundColor: cardStyle.accent + '10' }}>
                        <p className={`text-sm font-semibold ${cardStyle.text}`}>{event.summary}</p>
                        {eventDate && (
                          <p className={`text-xs ${cardStyle.text}/70`}>
                            {eventDate.toLocaleDateString()} {event.start.dateTime && eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className={`${cardStyle.text}/60`}>No upcoming events</p>
              )}
            </Card>

            {/* Beast Babe */}
            {beastBabeData?.currentBeastBabe && (
              <Card className={`${cardStyle.bg} ${cardStyle.border} border p-6 ${getRoundedClass('rounded-xl')}`}>
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-5 h-5" style={{ color: cardStyle.accent }} />
                  <h2 className={`text-xl font-black uppercase ${cardStyle.text}`}>Beast Babe</h2>
                </div>
                <div className="text-center mb-4">
                  {beastBabeData.currentBeastBabe.avatar_url ? (
                    <img
                      src={beastBabeData.currentBeastBabe.avatar_url}
                      alt={beastBabeData.currentBeastBabe.full_name || 'Beast Babe'}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: cardStyle.accent + '33' }}>
                      <Crown className="w-12 h-12" style={{ color: cardStyle.accent }} />
                    </div>
                  )}
                  <p className={`font-black text-lg ${cardStyle.text} mb-1`}>
                    {beastBabeData.currentBeastBabe.full_name || beastBabeData.currentBeastBabe.email || 'Unknown'}
                  </p>
                  {beastBabeData.currentBeastBabeHistory?.achievement && (
                    <p className={`text-sm ${cardStyle.text}/70 italic mb-3`}>
                      "{beastBabeData.currentBeastBabeHistory.achievement}"
                    </p>
                  )}
                </div>
                
                {/* Infographic: Who gave it to whom */}
                {beastBabeData.history && beastBabeData.history.length > 0 && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: cardStyle.accent + '40' }}>
                    <p className={`text-xs font-semibold ${cardStyle.text}/70 mb-3 uppercase tracking-wider`}>
                      Recent History
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {beastBabeData.history.slice(0, 5).map((entry: any, index: number) => (
                        <div key={entry.id} className="flex items-center gap-2 text-xs">
                          {entry.passed_by ? (
                            <>
                              <div className="flex items-center gap-1 min-w-0 flex-1">
                                <span className={`truncate ${cardStyle.text}/70`}>
                                  {entry.passed_by.full_name || entry.passed_by.email || 'Unknown'}
                                </span>
                                <ArrowRight className="w-3 h-3 flex-shrink-0" style={{ color: cardStyle.accent }} />
                                <span className={`truncate font-semibold ${cardStyle.text}`}>
                                  {entry.user.full_name || entry.user.email || 'Unknown'}
                                </span>
                              </div>
                            </>
                          ) : (
                            <span className={`${cardStyle.text}/70`}>
                              {entry.user.full_name || entry.user.email || 'Unknown'} (Started)
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>

        {/* Team Directory */}
        <Card className={`${cardStyle.bg} ${cardStyle.border} border p-6 ${getRoundedClass('rounded-xl')} mb-6`}>
          <h2 className={`text-xl font-black uppercase ${cardStyle.text} mb-4`}>Team Directory</h2>
          {allProfiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allProfiles.map((profile) => (
                <Link
                  key={profile.id}
                  href={`/profile?id=${profile.id}`}
                  className={`p-4 rounded-lg border ${cardStyle.border} ${cardStyle.bg} hover:opacity-80 transition-opacity`}
                >
                  <div className="flex items-center gap-3">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name || 'User'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: cardStyle.accent + '33' }}>
                        <Users className="w-6 h-6" style={{ color: cardStyle.accent }} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold ${cardStyle.text} truncate`}>
                        {profile.full_name || profile.email || 'Unknown'}
                      </p>
                      {profile.role && (
                        <p className={`text-sm ${cardStyle.text}/70 truncate`}>{profile.role}</p>
                      )}
                      {profile.discipline && (
                        <p className={`text-xs ${cardStyle.text}/50 truncate`}>{profile.discipline}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className={`${cardStyle.text}/60`}>No team members found</p>
          )}
        </Card>

        {/* Org Chart */}
        <Card className={`${cardStyle.bg} ${cardStyle.border} border p-6 ${getRoundedClass('rounded-xl')} mb-6`}>
          <h2 className={`text-xl font-black uppercase ${cardStyle.text} mb-4`}>Org Chart</h2>
          {allProfiles.length > 0 ? (
            <div className="space-y-4">
              {(() => {
                // Group by discipline
                const byDiscipline: Record<string, any[]> = {}
                allProfiles.forEach(profile => {
                  const discipline = profile.discipline || 'Other'
                  if (!byDiscipline[discipline]) {
                    byDiscipline[discipline] = []
                  }
                  byDiscipline[discipline].push(profile)
                })
                
                return Object.entries(byDiscipline).map(([discipline, profiles]) => (
                  <div key={discipline}>
                    <h3 className={`font-black text-lg ${cardStyle.text} mb-2`}>{discipline}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {profiles.map((profile) => (
                        <Link
                          key={profile.id}
                          href={`/profile?id=${profile.id}`}
                          className={`p-3 rounded-lg border ${cardStyle.border} ${cardStyle.bg} hover:opacity-80 transition-opacity`}
                        >
                          <div className="flex flex-col items-center text-center">
                            {profile.avatar_url ? (
                              <img
                                src={profile.avatar_url}
                                alt={profile.full_name || 'User'}
                                className="w-16 h-16 rounded-full object-cover mb-2"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: cardStyle.accent + '33' }}>
                                <Users className="w-8 h-8" style={{ color: cardStyle.accent }} />
                              </div>
                            )}
                            <p className={`font-semibold text-sm ${cardStyle.text} truncate w-full`}>
                              {profile.full_name || profile.email || 'Unknown'}
                            </p>
                            {profile.role && (
                              <p className={`text-xs ${cardStyle.text}/70 truncate w-full`}>{profile.role}</p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))
              })()}
            </div>
          ) : (
            <p className={`${cardStyle.text}/60`}>No team members found</p>
          )}
        </Card>
      </main>
      
      <Footer />
    </div>
  )
}

