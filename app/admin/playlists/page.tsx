'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlaylistData } from '@/lib/spotify-player-types'
import { Save, Music, Loader2, ExternalLink, CheckCircle2, ShieldOff } from 'lucide-react'
import { usePermissions } from '@/contexts/permissions-context'

export default function PlaylistsAdmin() {
  const { permissions } = usePermissions()

  if (!permissions?.canManagePlaylists) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Manage Playlists</h1>
        </div>
        <Card className="p-6">
          <div className="flex items-center gap-3 text-destructive">
            <ShieldOff className="w-5 h-5" />
            <p>You don't have permission to manage playlists. You need the "Leader", "Admin", or "Curator" role.</p>
          </div>
        </Card>
      </div>
    )
  }
  const [spotifyUrl, setSpotifyUrl] = useState('')
  const [curator, setCurator] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]) // Today's date as default
  const [playlist, setPlaylist] = useState<PlaylistData | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const fetchPlaylistData = async () => {
    if (!spotifyUrl.trim()) {
      setError('Please enter a Spotify playlist URL')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/spotify/playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: spotifyUrl }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch playlist data')
      }

      const data = await response.json()
      
      // Use curator from form if provided, otherwise use Spotify owner
      const finalCurator = curator.trim() || data.curator
      
      // TODO: Look up curator photo from profile system
      // For now, use Spotify owner photo or null
      const curatorPhotoUrl = data.curatorPhotoUrl || null

      setPlaylist({
        ...data,
        curator: finalCurator,
        curatorPhotoUrl,
        description: description.trim() || data.description || '',
      })
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch playlist data')
      setPlaylist(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!playlist) {
      setError('Please fetch playlist data first')
      return
    }

    if (!date) {
      setError('Please select a date')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      // Update curator and description from form
      const finalCurator = curator.trim() || playlist.curator
      const finalDescription = description.trim() || playlist.description || ''

      const response = await fetch('/api/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          title: playlist.title || null,
          curator: finalCurator,
          description: finalDescription || null,
          spotify_url: playlist.spotifyUrl || spotifyUrl,
          cover_url: playlist.coverUrl || null,
          curator_photo_url: playlist.curatorPhotoUrl || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save playlist')
      }

      const savedPlaylist = await response.json()
      setSuccess(true)
      setError(null)
      
      // Reset form
      setSpotifyUrl('')
      setCurator('')
      setDescription('')
      setDate(new Date().toISOString().split('T')[0])
      setPlaylist(null)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to save playlist')
      setSuccess(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Manage Playlists</h1>
        <p className="text-muted-foreground">
          Enter a Spotify playlist URL to automatically populate all playlist information
        </p>
      </div>

      <div className="space-y-6">
        {/* Input Form */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Playlist Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Spotify Playlist URL <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-2">
                <Input
                  value={spotifyUrl}
                  onChange={(e) => {
                    setSpotifyUrl(e.target.value)
                    setError(null)
                    setSuccess(false)
                  }}
                  placeholder="https://open.spotify.com/playlist/..."
                  className="flex-1"
                />
                <Button 
                  onClick={fetchPlaylistData} 
                  disabled={loading || !spotifyUrl.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Fetching...
                    </>
                  ) : (
                    <>
                      <Music className="w-4 h-4 mr-2" />
                      Fetch from Spotify
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Paste a Spotify playlist link to automatically populate all fields
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date <span className="text-destructive">*</span>
                </label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  When this playlist was published
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Curator <span className="text-destructive">*</span>
                </label>
                <Input
                  value={curator}
                  onChange={(e) => setCurator(e.target.value)}
                  placeholder="Rebecca Smith"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Will use playlist owner if left empty
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description (Optional)
                </label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Playlist description..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Will use Spotify description if left empty
                </p>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {success && playlist && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Playlist data fetched successfully!
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Fetched Playlist Preview */}
        {playlist && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Playlist Preview</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Title</label>
                  <p className="text-lg font-semibold text-foreground">{playlist.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Curator</label>
                  <p className="text-lg font-semibold text-foreground">{playlist.curator}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Track Count</label>
                  <p className="text-lg font-semibold text-foreground">{playlist.trackCount} tracks</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Total Duration</label>
                  <p className="text-lg font-semibold text-foreground">{playlist.totalDuration}</p>
                </div>
                {playlist.description && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
                    <p className="text-foreground">{playlist.description}</p>
                  </div>
                )}
                {playlist.coverUrl && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Cover Image</label>
                    <img 
                      src={playlist.coverUrl} 
                      alt={playlist.title}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                {playlist.artistsList && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Artists</label>
                    <p className="text-sm text-foreground line-clamp-3">{playlist.artistsList}</p>
                  </div>
                )}
              </div>

              {playlist.tracks && playlist.tracks.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Tracks ({playlist.tracks.length} shown)
                  </label>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {playlist.tracks.slice(0, 10).map((track, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                        <span className="text-foreground">
                          <span className="font-medium">{track.name}</span> - {track.artist}
                        </span>
                        <span className="text-muted-foreground">{track.duration}</span>
                      </div>
                    ))}
                    {playlist.tracks.length > 10 && (
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        ... and {playlist.tracks.length - 10} more tracks
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <a
                  href={playlist.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in Spotify
                </a>
                <Button onClick={handleSave} size="lg" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Playlist
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
