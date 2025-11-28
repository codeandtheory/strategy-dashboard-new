'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMode } from '@/contexts/mode-context'
import { useAuth } from '@/contexts/auth-context'
import { SiteHeader } from '@/components/site-header'
import { Card } from '@/components/ui/card'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/client'
import { 
  Users, 
  Trophy, 
  MessageSquare, 
  Briefcase,
  Cake,
  PartyPopper,
  Crown,
  ArrowRight,
  Loader2,
  Mail,
  MapPin,
  Globe,
  Briefcase as BriefcaseIcon,
  Calendar as CalendarIcon
} from 'lucide-react'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function TeamPage() {
  const { user, loading: authLoading } = useAuth()
  const { mode } = useMode()
  const router = useRouter()
  const supabase = createClient()
  
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
  const [beastBabeData, setBeastBabeData] = useState<any>(null)
  const [allProfiles, setAllProfiles] = useState<any[]>([])
  const [selectedProfile, setSelectedProfile] = useState<any>(null)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchAllData()
    }
  }, [user])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        fetchTeamStats(),
        fetchBirthdays(),
        fetchAnniversaries(),
        fetchSnapLeaderboard(),
        fetchBeastBabe(),
        fetchAllProfiles()
      ])
    } catch (error) {
      console.error('Error fetching team data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleProfileClick = async (profileId: string) => {
    setLoadingProfile(true)
    setIsProfileDialogOpen(true)
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url, role, discipline, birthday, start_date, bio, location, website, pronouns')
        .eq('id', profileId)
        .maybeSingle()
      
      if (!error && profile) {
        setSelectedProfile(profile)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoadingProfile(false)
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

  // GREEN SYSTEM: Emerald (#00C896), Forest (#1A5D52), Lime (#C5F547), Orange (#FF8C42)
  const getGreenSystemColors = () => {
    if (mode === 'chaos') {
      return {
        primary: '#00C896',      // Emerald
        primaryPair: '#1A5D52',   // Forest Green
        complementary: '#C5F547',  // Lime Green
        contrast: '#FF8C42',      // Orange
        bg: '#1A1A1A',
        text: '#FFFFFF',
        cardBg: '#2A2A2A'
      }
    } else if (mode === 'chill') {
      return {
        primary: '#00C896',      // Emerald
        primaryPair: '#1A5D52',   // Forest Green
        complementary: '#C8D961', // Lime Green (adjusted for chill)
        contrast: '#FF8C42',      // Orange
        bg: '#F5E6D3',
        text: '#4A1818',
        cardBg: '#FFFFFF'
      }
    } else {
      return {
        primary: '#FFFFFF',
        primaryPair: '#808080',
        complementary: '#666666',
        contrast: '#FFFFFF',
        bg: '#000000',
        text: '#FFFFFF',
        cardBg: '#1a1a1a'
      }
    }
  }

  const greenColors = getGreenSystemColors()

  const getCardStyle = () => {
    if (mode === 'chaos') {
      return { 
        bg: 'bg-[#1A5D52]',  // Forest Green background
        border: 'border-2', 
        borderColor: greenColors.primary, // Emerald border
        text: 'text-white', 
        accent: greenColors.primary // Emerald accent
      }
    } else if (mode === 'chill') {
      return { 
        bg: 'bg-white', 
        border: 'border', 
        borderColor: greenColors.complementary + '30', // Lime border
        text: 'text-[#4A1818]', 
        accent: greenColors.complementary // Lime accent
      }
    } else {
      return { 
        bg: 'bg-[#1a1a1a]', 
        border: 'border', 
        borderColor: '#FFFFFF',
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
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
      </div>
    )
  }

  return (
    <div className={`flex flex-col ${getBgClass()} ${getTextClass()} ${mode === 'code' ? 'font-mono' : 'font-[family-name:var(--font-raleway)]'} min-h-screen`}>
      <SiteHeader />
      
      <main className="max-w-[1200px] mx-auto px-6 py-10 flex-1 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-black uppercase tracking-wider ${getTextClass()} mb-2`}>Team</h1>
          <p className={`${getTextClass()}/70 text-sm`}>Get to know your team</p>
        </div>

        {/* Team by Numbers Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className={`${mode === 'chaos' ? 'bg-[#1A5D52]' : mode === 'chill' ? 'bg-white' : 'bg-[#1a1a1a]'} ${getRoundedClass('rounded-[2.5rem]')} p-6`} style={{ 
            borderColor: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF',
            borderWidth: mode === 'chaos' ? '2px' : '0px'
          }}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs ${mode === 'chill' ? 'text-[#4A1818]/70' : 'text-white/70'} mb-1`}>Team Members</p>
                <p className={`text-2xl font-black ${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'}`}>{teamStats.totalTeamMembers}</p>
              </div>
              <Users className="w-6 h-6" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
            </div>
          </Card>
          
          <Card className={`${mode === 'chaos' ? 'bg-[#1A5D52]' : mode === 'chill' ? 'bg-white' : 'bg-[#1a1a1a]'} ${getRoundedClass('rounded-[2.5rem]')} p-6`} style={{ 
            borderColor: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF',
            borderWidth: mode === 'chaos' ? '2px' : '0px'
          }}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs ${mode === 'chill' ? 'text-[#4A1818]/70' : 'text-white/70'} mb-1`}>Total Snaps</p>
                <p className={`text-2xl font-black ${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'}`}>{teamStats.totalSnaps}</p>
              </div>
              <MessageSquare className="w-6 h-6" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
            </div>
          </Card>
          
          <Card className={`${mode === 'chaos' ? 'bg-[#1A5D52]' : mode === 'chill' ? 'bg-white' : 'bg-[#1a1a1a]'} ${getRoundedClass('rounded-[2.5rem]')} p-6`} style={{ 
            borderColor: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF',
            borderWidth: mode === 'chaos' ? '2px' : '0px'
          }}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs ${mode === 'chill' ? 'text-[#4A1818]/70' : 'text-white/70'} mb-1`}>Active Pitches</p>
                <p className={`text-2xl font-black ${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'}`}>{teamStats.activePitches}</p>
              </div>
              <Briefcase className="w-6 h-6" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
            </div>
          </Card>
          
          <Card className={`${mode === 'chaos' ? 'bg-[#1A5D52]' : mode === 'chill' ? 'bg-white' : 'bg-[#1a1a1a]'} ${getRoundedClass('rounded-[2.5rem]')} p-6`} style={{ 
            borderColor: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF',
            borderWidth: mode === 'chaos' ? '2px' : '0px'
          }}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs ${mode === 'chill' ? 'text-[#4A1818]/70' : 'text-white/70'} mb-1`}>Snap Leader</p>
                <p className={`text-lg font-black ${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'} truncate`}>
                  {teamStats.snapLeader?.full_name || teamStats.snapLeader?.email || 'N/A'}
                </p>
                {teamStats.snapLeader && (
                  <p className={`text-xs ${mode === 'chill' ? 'text-[#4A1818]/50' : 'text-white/50'}`}>{teamStats.snapLeader.count} snaps</p>
                )}
              </div>
              <Trophy className="w-6 h-6" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Anniversaries */}
            <Card className={`${mode === 'chaos' ? 'bg-[#1A5D52]' : mode === 'chill' ? 'bg-white' : 'bg-[#1a1a1a]'} ${getRoundedClass('rounded-[2.5rem]')} p-6`} style={{ 
              borderColor: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF',
              borderWidth: mode === 'chaos' ? '2px' : '0px'
            }}>
              <div className="flex items-center gap-2 mb-4">
                <PartyPopper className="w-5 h-5" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
                <h2 className={`text-xl font-black uppercase ${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'}`}>Anniversaries</h2>
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
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: (mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF') + '33' }}>
                          <Users className="w-5 h-5" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className={`font-semibold ${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'}`}>
                          {anniversary.full_name || 'Unknown'}
                        </p>
                        <p className={`text-sm ${mode === 'chill' ? 'text-[#4A1818]/70' : 'text-white/70'}`}>
                          {anniversary.years} year{anniversary.years !== 1 ? 's' : ''} at Strategy
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`${mode === 'chill' ? 'text-[#4A1818]/60' : 'text-white/60'}`}>No upcoming anniversaries</p>
              )}
            </Card>

            {/* Birthdays */}
            <Card className={`${mode === 'chaos' ? 'bg-[#1A5D52]' : mode === 'chill' ? 'bg-white' : 'bg-[#1a1a1a]'} ${getRoundedClass('rounded-[2.5rem]')} p-6`} style={{ 
              borderColor: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF',
              borderWidth: mode === 'chaos' ? '2px' : '0px'
            }}>
              <div className="flex items-center gap-2 mb-4">
                <Cake className="w-5 h-5" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
                <h2 className={`text-xl font-black uppercase ${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'}`}>Birthdays</h2>
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
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: (mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF') + '33' }}>
                          <Cake className="w-5 h-5" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className={`font-semibold ${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'}`}>
                          {birthday.full_name || 'Unknown'}
                        </p>
                        <p className={`text-sm ${mode === 'chill' ? 'text-[#4A1818]/70' : 'text-white/70'}`}>
                          Birthday: {birthday.birthday}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`${mode === 'chill' ? 'text-[#4A1818]/60' : 'text-white/60'}`}>No upcoming birthdays</p>
              )}
            </Card>

            {/* Snap Leaderboard */}
            <Card className={`${mode === 'chaos' ? 'bg-[#1A5D52]' : mode === 'chill' ? 'bg-white' : 'bg-[#1a1a1a]'} ${getRoundedClass('rounded-[2.5rem]')} p-6`} style={{ 
              borderColor: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF',
              borderWidth: mode === 'chaos' ? '2px' : '0px'
            }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
                  <h2 className={`text-xl font-black uppercase ${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'}`}>Snap Leaderboard</h2>
                </div>
                <Link href="/snaps" className={`text-sm ${mode === 'chill' ? 'text-[#4A1818]/70 hover:text-[#4A1818]' : 'text-white/70 hover:text-white'} flex items-center gap-1`}>
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              {snapLeaderboard.length > 0 ? (
                <div className="space-y-3">
                  {snapLeaderboard.map((person, index) => (
                    <div key={person.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'}`} style={{ 
                        backgroundColor: index === 0 
                          ? (mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF')
                          : (mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF') + '33',
                        color: index === 0 && mode === 'chaos' ? '#000' : (mode === 'chill' ? '#4A1818' : '#FFFFFF')
                      }}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'}`}>
                          {person.full_name || person.email || 'Unknown'}
                        </p>
                      </div>
                      <p className={`font-black ${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'}`} style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }}>
                        {person.count}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`${mode === 'chill' ? 'text-[#4A1818]/60' : 'text-white/60'}`}>No snaps yet</p>
              )}
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Beast Babe */}
            {beastBabeData?.currentBeastBabe && (
              <Card className={`${mode === 'chaos' ? 'bg-[#1A5D52]' : mode === 'chill' ? 'bg-white' : 'bg-[#1a1a1a]'} ${getRoundedClass('rounded-[2.5rem]')} p-6`} style={{ 
                borderColor: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF',
                borderWidth: mode === 'chaos' ? '2px' : '0px'
              }}>
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-5 h-5" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
                  <h2 className={`text-xl font-black uppercase ${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'}`}>Beast Babe</h2>
                </div>
                <div className="text-center mb-4">
                  {beastBabeData.currentBeastBabe.avatar_url ? (
                    <img
                      src={beastBabeData.currentBeastBabe.avatar_url}
                      alt={beastBabeData.currentBeastBabe.full_name || 'Beast Babe'}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: (mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF') + '33' }}>
                      <Crown className="w-12 h-12" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
                    </div>
                  )}
                  <p className={`font-black text-lg ${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'} mb-1`}>
                    {beastBabeData.currentBeastBabe.full_name || beastBabeData.currentBeastBabe.email || 'Unknown'}
                  </p>
                  {beastBabeData.currentBeastBabeHistory?.achievement && (
                    <p className={`text-sm ${mode === 'chill' ? 'text-[#4A1818]/70' : 'text-white/70'} italic mb-3`}>
                      "{beastBabeData.currentBeastBabeHistory.achievement}"
                    </p>
                  )}
                </div>
                
                {/* Infographic: Who gave it to whom */}
                {beastBabeData.history && beastBabeData.history.length > 0 && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: (mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF') + '40' }}>
                    <p className={`text-xs font-semibold ${mode === 'chill' ? 'text-[#4A1818]/70' : 'text-white/70'} mb-3 uppercase tracking-wider`}>
                      Recent History
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {beastBabeData.history.slice(0, 5).map((entry: any, index: number) => (
                        <div key={entry.id} className="flex items-center gap-2 text-xs">
                          {entry.passed_by ? (
                            <>
                              <div className="flex items-center gap-1 min-w-0 flex-1">
                                <span className={`truncate ${mode === 'chill' ? 'text-[#4A1818]/70' : 'text-white/70'}`}>
                                  {entry.passed_by.full_name || entry.passed_by.email || 'Unknown'}
                                </span>
                                <ArrowRight className="w-3 h-3 flex-shrink-0" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
                                <span className={`truncate font-semibold ${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'}`}>
                                  {entry.user.full_name || entry.user.email || 'Unknown'}
                                </span>
                              </div>
                            </>
                          ) : (
                            <span className={`${mode === 'chill' ? 'text-[#4A1818]/70' : 'text-white/70'}`}>
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
        <Card className={`${mode === 'chaos' ? 'bg-[#1A5D52]' : mode === 'chill' ? 'bg-white' : 'bg-[#1a1a1a]'} ${getRoundedClass('rounded-[2.5rem]')} p-6 mb-6`} style={{ 
          borderColor: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF',
          borderWidth: mode === 'chaos' ? '2px' : '0px'
        }}>
          <h2 className={`text-xl font-black uppercase ${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'} mb-4`}>Team Directory</h2>
          {allProfiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allProfiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => handleProfileClick(profile.id)}
                  className={`p-4 ${getRoundedClass('rounded-xl')} border hover:opacity-80 transition-opacity text-left w-full ${mode === 'chaos' ? 'bg-[#00C896]/10 border-[#00C896]/30' : mode === 'chill' ? 'bg-white/50 border-[#C8D961]/30' : 'bg-black/40 border-white/20'}`}
                >
                  <div className="flex items-center gap-3">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name || 'User'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: (mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF') + '33' }}>
                        <Users className="w-6 h-6" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold ${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'} truncate`}>
                        {profile.full_name || profile.email || 'Unknown'}
                      </p>
                      {profile.role && (
                        <p className={`text-sm ${mode === 'chill' ? 'text-[#4A1818]/70' : 'text-white/70'} truncate`}>{profile.role}</p>
                      )}
                      {profile.discipline && (
                        <p className={`text-xs ${mode === 'chill' ? 'text-[#4A1818]/50' : 'text-white/50'} truncate`}>{profile.discipline}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className={`${mode === 'chill' ? 'text-[#4A1818]/60' : 'text-white/60'}`}>No team members found</p>
          )}
        </Card>

        {/* Org Chart */}
        <Card className={`${mode === 'chaos' ? 'bg-[#1A5D52]' : mode === 'chill' ? 'bg-white' : 'bg-[#1a1a1a]'} ${getRoundedClass('rounded-[2.5rem]')} p-6 mb-6`} style={{ 
          borderColor: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF',
          borderWidth: mode === 'chaos' ? '2px' : '0px'
        }}>
          <h2 className={`text-xl font-black uppercase ${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'} mb-4`}>Org Chart</h2>
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
                    <h3 className={`font-black text-lg ${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'} mb-2`}>{discipline}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {profiles.map((profile) => (
                        <button
                          key={profile.id}
                          onClick={() => handleProfileClick(profile.id)}
                          className={`p-3 ${getRoundedClass('rounded-xl')} border hover:opacity-80 transition-opacity w-full ${mode === 'chaos' ? 'bg-[#00C896]/10 border-[#00C896]/30' : mode === 'chill' ? 'bg-white/50 border-[#C8D961]/30' : 'bg-black/40 border-white/20'}`}
                        >
                          <div className="flex flex-col items-center text-center">
                            {profile.avatar_url ? (
                              <img
                                src={profile.avatar_url}
                                alt={profile.full_name || 'User'}
                                className="w-16 h-16 rounded-full object-cover mb-2"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: (mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF') + '33' }}>
                                <Users className="w-8 h-8" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
                              </div>
                            )}
                            <p className={`font-semibold text-sm ${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'} truncate w-full`}>
                              {profile.full_name || profile.email || 'Unknown'}
                            </p>
                            {profile.role && (
                              <p className={`text-xs ${mode === 'chill' ? 'text-[#4A1818]/70' : 'text-white/70'} truncate w-full`}>{profile.role}</p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              })()}
            </div>
          ) : (
            <p className={`${mode === 'chill' ? 'text-[#4A1818]/60' : 'text-white/60'}`}>No team members found</p>
          )}
        </Card>
      </main>
      
      {/* Profile View Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className={`${mode === 'chaos' ? 'bg-[#1A5D52]' : mode === 'chill' ? 'bg-white' : 'bg-[#1a1a1a]'} ${getRoundedClass('rounded-[2.5rem]')} max-w-2xl max-h-[90vh] overflow-y-auto`} style={{ 
          borderColor: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF',
          borderWidth: mode === 'chaos' ? '2px' : '0px'
        }}>
          {loadingProfile ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
            </div>
          ) : selectedProfile ? (
            <>
              <DialogHeader>
                <DialogTitle className={`text-2xl font-black uppercase ${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'}`}>
                  {selectedProfile.full_name || selectedProfile.email || 'Profile'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 mt-6">
                {/* Avatar and Basic Info */}
                <div className="flex items-start gap-6">
                  {selectedProfile.avatar_url ? (
                    <img
                      src={selectedProfile.avatar_url}
                      alt={selectedProfile.full_name || 'User'}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: (mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF') + '33' }}>
                      <Users className="w-12 h-12" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className={`text-xl font-black ${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'} mb-2`}>
                      {selectedProfile.full_name || selectedProfile.email || 'Unknown'}
                    </h3>
                    {selectedProfile.pronouns && (
                      <p className={`text-sm ${mode === 'chill' ? 'text-[#4A1818]/70' : 'text-white/70'} mb-1`}>
                        {selectedProfile.pronouns}
                      </p>
                    )}
                    {selectedProfile.email && (
                      <div className="flex items-center gap-2 mt-2">
                        <Mail className="w-4 h-4" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
                        <p className={`text-sm ${mode === 'chill' ? 'text-[#4A1818]/70' : 'text-white/70'}`}>
                          {selectedProfile.email}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Bio */}
                {selectedProfile.bio && (
                  <div>
                    <h4 className={`text-sm font-black uppercase mb-2 ${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'}`}>Bio</h4>
                    <p className={`${mode === 'chill' ? 'text-[#4A1818]/80' : 'text-white/80'}`}>{selectedProfile.bio}</p>
                  </div>
                )}
                
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedProfile.role && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <BriefcaseIcon className="w-4 h-4" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
                        <h4 className={`text-xs font-black uppercase ${mode === 'chill' ? 'text-[#4A1818]/70' : 'text-white/70'}`}>Role</h4>
                      </div>
                      <p className={`${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'}`}>{selectedProfile.role}</p>
                    </div>
                  )}
                  
                  {selectedProfile.discipline && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
                        <h4 className={`text-xs font-black uppercase ${mode === 'chill' ? 'text-[#4A1818]/70' : 'text-white/70'}`}>Discipline</h4>
                      </div>
                      <p className={`${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'}`}>{selectedProfile.discipline}</p>
                    </div>
                  )}
                  
                  {selectedProfile.birthday && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Cake className="w-4 h-4" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
                        <h4 className={`text-xs font-black uppercase ${mode === 'chill' ? 'text-[#4A1818]/70' : 'text-white/70'}`}>Birthday</h4>
                      </div>
                      <p className={`${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'}`}>{selectedProfile.birthday}</p>
                    </div>
                  )}
                  
                  {selectedProfile.start_date && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CalendarIcon className="w-4 h-4" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
                        <h4 className={`text-xs font-black uppercase ${mode === 'chill' ? 'text-[#4A1818]/70' : 'text-white/70'}`}>Start Date</h4>
                      </div>
                      <p className={`${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'}`}>
                        {new Date(selectedProfile.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  )}
                  
                  {selectedProfile.location && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
                        <h4 className={`text-xs font-black uppercase ${mode === 'chill' ? 'text-[#4A1818]/70' : 'text-white/70'}`}>Location</h4>
                      </div>
                      <p className={`${mode === 'chill' ? 'text-[#4A1818]' : 'text-white'}`}>{selectedProfile.location}</p>
                    </div>
                  )}
                  
                  {selectedProfile.website && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Globe className="w-4 h-4" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
                        <h4 className={`text-xs font-black uppercase ${mode === 'chill' ? 'text-[#4A1818]/70' : 'text-white/70'}`}>Website</h4>
                      </div>
                      <a 
                        href={selectedProfile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`text-sm ${mode === 'chill' ? 'text-[#4A1818] hover:text-[#4A1818]/80' : 'text-white hover:text-white/80'} underline`}
                      >
                        {selectedProfile.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  )
}

