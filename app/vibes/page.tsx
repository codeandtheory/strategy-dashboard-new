'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/auth-context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, ArrowLeft, Search, Plus } from 'lucide-react'
import Link from 'next/link'
import { AddSnapDialog } from '@/components/add-snap-dialog'

interface Snap {
  id: string
  date: string
  snap_content: string
  mentioned: string | null
  mentioned_user_id: string | null
  submitted_by: string | null
  created_at: string
  submitted_by_profile: {
    id: string
    email: string | null
    full_name: string | null
    avatar_url: string | null
  } | null
  mentioned_user_profile: {
    id: string
    email: string | null
    full_name: string | null
    avatar_url: string | null
  } | null
}

export default function VibesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [allSnaps, setAllSnaps] = useState<Snap[]>([])
  const [mySnaps, setMySnaps] = useState<Snap[]>([])
  const [filteredSnaps, setFilteredSnaps] = useState<Snap[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [userProfile, setUserProfile] = useState<{
    full_name: string | null
    avatar_url: string | null
  } | null>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Load user profile
  useEffect(() => {
    async function loadProfile() {
      if (!user) return
      
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .maybeSingle()
        
        if (profile) {
          setUserProfile(profile)
        }
      } catch (err) {
        console.error('Error loading profile:', err)
      }
    }
    
    if (user) {
      loadProfile()
    }
  }, [user, supabase])

  // Fetch all snaps and user's snaps
  useEffect(() => {
    async function fetchSnaps() {
      if (!user) return
      
      setLoading(true)
      setError(null)
      
      try {
        // Fetch all snaps
        const allResponse = await fetch('/api/snaps')
        // Fetch user's snaps
        const myResponse = await fetch(`/api/snaps?mentioned_user_id=${user.id}&limit=10`)
        
        if (allResponse.ok) {
          const allResult = await allResponse.json()
          if (allResult.data && Array.isArray(allResult.data)) {
            setAllSnaps(allResult.data)
            setFilteredSnaps(allResult.data)
          }
        } else {
          const errorData = await allResponse.json()
          setError(errorData.error || 'Failed to load snaps')
        }
        
        if (myResponse.ok) {
          const myResult = await myResponse.json()
          if (myResult.data && Array.isArray(myResult.data)) {
            setMySnaps(myResult.data)
          }
        }
      } catch (err: any) {
        console.error('Error fetching snaps:', err)
        setError(err.message || 'Failed to load snaps')
      } finally {
        setLoading(false)
      }
    }
    
    if (user) {
      fetchSnaps()
    }
  }, [user])

  const handleSnapAdded = async () => {
    // Refresh snaps list
    if (!user) return
    
    try {
      const allResponse = await fetch('/api/snaps')
      const myResponse = await fetch(`/api/snaps?mentioned_user_id=${user.id}&limit=10`)
      
      if (allResponse.ok) {
        const allResult = await allResponse.json()
        if (allResult.data && Array.isArray(allResult.data)) {
          setAllSnaps(allResult.data)
          setFilteredSnaps(allResult.data)
        }
      }
      
      if (myResponse.ok) {
        const myResult = await myResponse.json()
        if (myResult.data && Array.isArray(myResult.data)) {
          setMySnaps(myResult.data)
        }
      }
    } catch (err) {
      console.error('Error refreshing snaps:', err)
    }
  }

  // Filter snaps based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSnaps(allSnaps)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = allSnaps.filter((snap) => {
      const contentMatch = snap.snap_content.toLowerCase().includes(query)
      const mentionedMatch = snap.mentioned?.toLowerCase().includes(query)
      const submitterMatch = snap.submitted_by_profile?.full_name?.toLowerCase().includes(query) ||
                            snap.submitted_by_profile?.email?.toLowerCase().includes(query)
      const mentionedUserMatch = snap.mentioned_user_profile?.full_name?.toLowerCase().includes(query) ||
                                 snap.mentioned_user_profile?.email?.toLowerCase().includes(query)
      
      return contentMatch || mentionedMatch || submitterMatch || mentionedUserMatch
    })
    
    setFilteredSnaps(filtered)
  }, [searchQuery, allSnaps])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Generate initials for avatar fallback
  const getInitials = (name: string | null, email: string | null) => {
    if (name) {
      const parts = name.split(' ')
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    }
    return email ? email.substring(0, 2).toUpperCase() : 'A'
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const displayName = userProfile?.full_name || user.user_metadata?.full_name || user.email || 'User'
  const avatarUrl = userProfile?.avatar_url || user.user_metadata?.avatar_url || null
  const initials = getInitials(userProfile?.full_name || null, user.email || null)

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Snaps For You Section */}
        <Card className="p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      const fallback = parent.querySelector('.avatar-fallback') as HTMLElement
                      if (fallback) fallback.style.display = 'flex'
                    }
                  }}
                />
              ) : null}
              <div 
                className={`avatar-fallback w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold bg-primary text-primary-foreground border-2 border-border ${avatarUrl ? 'hidden' : ''}`}
              >
                {initials}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">Snaps For You</h2>
                <p className="text-muted-foreground">
                  Recognition and appreciation from your team
                </p>
              </div>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Snap
            </Button>
          </div>

          {mySnaps.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No snaps yet. Be the first to recognize someone!</p>
              <Button onClick={() => setShowAddDialog(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Snap
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {mySnaps.map((snap) => (
                <Card key={snap.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <p className="text-foreground whitespace-pre-wrap mb-3">
                        {snap.snap_content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatDate(snap.date)}</span>
                        {snap.submitted_by_profile ? (
                          <span>
                            From {snap.submitted_by_profile.full_name || snap.submitted_by_profile.email}
                          </span>
                        ) : (
                          <span>From Anonymous</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        {/* All Snaps Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">All Snaps</h1>
          <p className="text-muted-foreground mb-6">
            Browse all recognition and appreciation from the team
          </p>
          
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search snaps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Snaps grid */}
        {filteredSnaps.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              {searchQuery ? 'No snaps found matching your search.' : 'No snaps yet.'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSnaps.map((snap) => (
              <Card key={snap.id} className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  {snap.submitted_by_profile?.avatar_url ? (
                    <img
                      src={snap.submitted_by_profile.avatar_url}
                      alt={snap.submitted_by_profile.full_name || 'User'}
                      className="w-10 h-10 rounded-full object-cover border border-border"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-primary text-primary-foreground border border-border">
                      {getInitials(
                        snap.submitted_by_profile?.full_name || null,
                        snap.submitted_by_profile?.email || null
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {snap.submitted_by_profile 
                        ? (snap.submitted_by_profile.full_name || snap.submitted_by_profile.email || 'User')
                        : 'Anonymous'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(snap.date)}
                    </p>
                  </div>
                </div>
                
                <p className="text-foreground whitespace-pre-wrap mb-4">
                  {snap.snap_content}
                </p>
                
                {snap.mentioned && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      For: <span className="font-medium text-foreground">{snap.mentioned}</span>
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      <AddSnapDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={handleSnapAdded}
      />
    </div>
  )
}
