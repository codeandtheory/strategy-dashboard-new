'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/auth-context'
import { useMode } from '@/contexts/mode-context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Calendar, Briefcase, Users, Upload, MapPin, Globe, FileText, Download, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { LocationAutocomplete } from '@/components/location-autocomplete'
import { AccountMenu } from '@/components/account-menu'

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const { mode } = useMode()
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Helper functions for styling
  const getBgClass = () => {
    switch (mode) {
      case 'chaos': return 'bg-black'
      case 'chill': return 'bg-[#F5E6D3]'
      case 'code': return 'bg-[#0F172A]'
      default: return 'bg-black'
    }
  }

  const getTextClass = () => {
    switch (mode) {
      case 'chaos': return 'text-white'
      case 'chill': return 'text-[#4A1818]'
      case 'code': return 'text-white'
      default: return 'text-white'
    }
  }

  const getBorderClass = () => {
    switch (mode) {
      case 'chaos': return 'border-[#333333]'
      case 'chill': return 'border-[#8B4444]/30'
      case 'code': return 'border-[#333333]'
      default: return 'border-[#333333]'
    }
  }

  const getRoundedClass = (defaultClass: string) => {
    return mode === 'code' ? 'rounded-none' : defaultClass
  }

  const getInputClass = () => {
    switch (mode) {
      case 'chaos': return 'bg-black/30 border-gray-600 text-white placeholder:text-gray-500'
      case 'chill': return 'bg-white border-gray-300 text-[#4A1818] placeholder:text-gray-400'
      case 'code': return 'bg-black/30 border-gray-600 text-white placeholder:text-gray-500'
      default: return 'bg-black/30 border-gray-600 text-white placeholder:text-gray-500'
    }
  }

  const getLabelClass = () => {
    return `${getTextClass()} text-sm font-semibold mb-2 block`
  }

  const getHintClass = () => {
    return `${getTextClass()}/60 text-xs mt-1`
  }

  const getLogoBg = () => {
    switch (mode) {
      case 'chaos': return 'bg-[#C4F500]'
      case 'chill': return 'bg-[#FFC043]'
      case 'code': return 'bg-[#FFFFFF]'
      default: return 'bg-[#C4F500]'
    }
  }

  const getLogoText = () => {
    switch (mode) {
      case 'chaos': return 'text-black'
      case 'chill': return 'text-[#4A1818]'
      case 'code': return 'text-black'
      default: return 'text-black'
    }
  }

  const getNavLinkClass = (isActive = false) => {
    const base = `transition-colors text-sm font-black uppercase ${mode === 'code' ? 'font-mono' : ''}`
    if (isActive) {
      switch (mode) {
        case 'chaos': return `${base} text-white hover:text-[#C4F500]`
        case 'chill': return `${base} text-[#4A1818] hover:text-[#FFC043]`
        case 'code': return `${base} text-[#FFFFFF] hover:text-[#FFFFFF]`
        default: return `${base} text-white hover:text-[#C4F500]`
      }
    } else {
      switch (mode) {
        case 'chaos': return `${base} text-[#666666] hover:text-white`
        case 'chill': return `${base} text-[#8B4444] hover:text-[#4A1818]`
        case 'code': return `${base} text-[#808080] hover:text-[#FFFFFF]`
        default: return `${base} text-[#666666] hover:text-white`
      }
    }
  }
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [fullName, setFullName] = useState('')
  const [pronouns, setPronouns] = useState('')
  const [birthday, setBirthday] = useState('') // MM/DD format
  const [startDate, setStartDate] = useState('') // YYYY-MM-DD format
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [website, setWebsite] = useState('')
  const [discipline, setDiscipline] = useState('')
  const [avatarGallery, setAvatarGallery] = useState<Array<{
    name: string
    url: string
    created_at: string
    updated_at: string
    size: number
  }>>([])
  const [loadingAvatars, setLoadingAvatars] = useState(false)
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Load profile data
  useEffect(() => {
    async function loadProfile() {
      if (!user) return
      
      setLoading(true)
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('birthday, discipline, role, avatar_url, full_name, pronouns, start_date, bio, location, website')
          .eq('id', user.id)
          .maybeSingle()
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error loading profile:', profileError)
        }
        
        if (profile) {
          setBirthday(profile.birthday || '')
          setDiscipline(profile.discipline || '')
          setAvatarUrl(profile.avatar_url || null)
          setFullName(profile.full_name || user.user_metadata?.full_name || '')
          setPronouns(profile.pronouns || '')
          setBio(profile.bio || '')
          setLocation(profile.location || '')
          setWebsite(profile.website || '')
          
          // Format start_date from YYYY-MM-DD to MM/DD/YYYY for display
          if (profile.start_date) {
            const date = new Date(profile.start_date)
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            const year = date.getFullYear()
            setStartDate(`${year}-${month}-${day}`) // Keep in YYYY-MM-DD for input type="date"
          } else {
            setStartDate('')
          }
        } else {
          // No profile yet, use defaults
          setFullName(user.user_metadata?.full_name || user.email || '')
          setAvatarUrl(user.user_metadata?.avatar_url || null)
        }
      } catch (err) {
        console.error('Error in loadProfile:', err)
      } finally {
        setLoading(false)
      }
    }
    
    if (!authLoading && user) {
      loadProfile()
    }
  }, [user, authLoading, supabase])

  // Load avatar gallery
  useEffect(() => {
    async function loadAvatarGallery() {
      if (!user) return
      
      setLoadingAvatars(true)
      try {
        const response = await fetch('/api/avatars/list')
        if (response.ok) {
          const result = await response.json()
          setAvatarGallery(result.data || [])
        }
      } catch (err) {
        console.error('Error loading avatar gallery:', err)
      } finally {
        setLoadingAvatars(false)
      }
    }
    
    if (!authLoading && user) {
      loadAvatarGallery()
    }
  }, [user, authLoading])

  const handleDownloadAvatar = async (avatarUrl: string, fileName: string) => {
    try {
      const response = await fetch(avatarUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Error downloading avatar:', err)
      setError('Failed to download avatar')
    }
  }
  
  // Handle profile photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    // Show preview immediately
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    setUploading(true)
    setError(null)

    try {
      // Create a unique filename
      // Store in user's folder: avatars/{user_id}/{filename}
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) {
        throw updateError
      }

      setAvatarUrl(publicUrl)
      setAvatarPreview(null) // Clear preview now that we have the real URL
      setSuccess('Profile photo updated successfully!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error('Error uploading photo:', err)
      setError(err.message || 'Failed to upload photo. Please try again.')
    } finally {
      setUploading(false)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSaving(true)
    
    try {
      // Validate birthday format if provided
      if (birthday) {
        const birthdayRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/
        if (!birthdayRegex.test(birthday)) {
          setError('Please enter your birthday in MM/DD format (e.g., 03/15)')
          setSaving(false)
          return
        }
      }

      // Validate website URL if provided
      if (website && website.trim() !== '') {
        try {
          // Add https:// if no protocol is specified
          const url = website.startsWith('http://') || website.startsWith('https://') 
            ? website 
            : `https://${website}`
          new URL(url) // Validate URL format
        } catch {
          setError('Please enter a valid website URL')
          setSaving(false)
          return
        }
      }

      // Format start_date from YYYY-MM-DD to DATE format for database
      let startDateFormatted: string | null = null
      if (startDate) {
        startDateFormatted = startDate // Already in YYYY-MM-DD format
      }
      
      // Update or insert profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          birthday: birthday || null,
          discipline: discipline || null,
          start_date: startDateFormatted,
          bio: bio || null,
          location: location || null,
          website: website || null,
          full_name: fullName || null,
          pronouns: pronouns || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id)
      
      // If update fails (profile doesn't exist), try insert
      if (updateError && updateError.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user?.id,
            birthday: birthday || null,
            discipline: discipline || null,
            start_date: startDateFormatted,
            bio: bio || null,
            location: location || null,
            website: website || null,
            full_name: fullName || null,
            pronouns: pronouns || null,
            email: user?.email || null,
            updated_at: new Date().toISOString(),
          })
        
        if (insertError) {
          throw insertError
        }
      } else if (updateError) {
        throw updateError
      }
      
      setSuccess('Profile updated successfully!')
      setSaving(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error('Error saving profile:', err)
      let errorMessage = err.message || 'Failed to save profile. Please try again.'
      
      // Provide helpful error message for schema issues
      if (errorMessage.includes('schema') || errorMessage.includes('column')) {
        errorMessage = 'Database schema needs to be updated. Please run the migration script: supabase/add-all-profile-fields.sql in your Supabase SQL Editor.'
      }
      
      setError(errorMessage)
      setSaving(false)
    }
  }
  
  if (authLoading || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${getBgClass()}`}>
        <div className="text-center">
          <Loader2 className={`w-8 h-8 animate-spin mx-auto mb-4 ${getTextClass()}`} />
          <p className={getTextClass()}>Loading...</p>
        </div>
      </div>
    )
  }
  
  if (!user) {
    return null
  }

  // Generate initials for avatar fallback
  const getInitials = (name: string, email: string) => {
    if (name) {
      const parts = name.split(' ')
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    }
    return email.substring(0, 2).toUpperCase()
  }

  const initials = getInitials(fullName, user.email || '')
  // Show preview if available, otherwise show saved avatar URL
  const displayAvatarUrl = avatarPreview || avatarUrl || user.user_metadata?.avatar_url || null
  
  return (
    <div className={`min-h-screen flex flex-col ${getBgClass()} ${getTextClass()} ${mode === 'code' ? 'font-mono' : 'font-[family-name:var(--font-raleway)]'}`}>
      <header className={`border-b ${getBorderClass()} px-6 py-4 fixed top-0 left-0 right-0 z-50 ${getBgClass()}`}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className={`w-10 h-10 ${getLogoBg()} ${getLogoText()} ${getRoundedClass('rounded-xl')} flex items-center justify-center font-black text-lg ${mode === 'code' ? 'font-mono' : ''}`}>
              {mode === 'code' ? 'C:\\>' : 'D'}
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className={getNavLinkClass()}>HOME</Link>
              <Link href="/snaps" className={getNavLinkClass()}>SNAPS</Link>
              <Link href="/resources" className={getNavLinkClass()}>RESOURCES</Link>
              <Link href="/work-samples" className={getNavLinkClass()}>WORK</Link>
              <a href="#" className={getNavLinkClass()}>TEAM</a>
              <Link href="/vibes" className={getNavLinkClass()}>VIBES</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <AccountMenu />
          </div>
        </div>
      </header>

      <main className="w-full px-6 py-10 flex-1 pt-28">
        <div className="max-w-[1400px] mx-auto space-y-6">
          <div className="mb-8">
            <h1 className={`text-4xl font-black uppercase ${getTextClass()} mb-2`}>PROFILE SETTINGS</h1>
            <p className={`${getTextClass()}/70`}>
              Manage your profile information and preferences
            </p>
          </div>

          <Card className={`p-8 ${getRoundedClass('rounded-[2.5rem]')} ${mode === 'chaos' ? 'bg-black border-[#C4F500]' : mode === 'chill' ? 'bg-white border-[#FFC043]/30' : 'bg-black border-white'}`}>
            <div className="mb-8">
              <h2 className={`text-2xl font-black uppercase ${getTextClass()} mb-2`}>PROFILE INFORMATION</h2>
            </div>

          {/* Avatar Section with Upload */}
          <div className="mb-8 pb-8 border-b">
            <Label className="text-sm font-medium mb-4 block">Profile Picture</Label>
            <div className="flex items-center gap-4">
              {displayAvatarUrl ? (
                <img
                  src={displayAvatarUrl}
                  alt={fullName || user.email || 'User'}
                  className="w-20 h-20 rounded-full object-cover border-2 border-border"
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
                className={`avatar-fallback w-20 h-20 rounded-full flex items-center justify-center text-2xl font-semibold bg-primary text-primary-foreground border-2 border-border ${displayAvatarUrl ? 'hidden' : ''}`}
              >
                {initials}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </>
                    )}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG or GIF. Max size 5MB
                </p>
              </div>
            </div>
          </div>
          
          {error && (
            <div className={`mb-4 p-4 ${getRoundedClass('rounded-lg')} border-2 ${
              mode === 'chaos' ? 'bg-red-500/10 border-red-500/40' : 
              mode === 'chill' ? 'bg-red-500/10 border-red-500/30' : 
              'bg-red-500/10 border-red-500/40'
            }`}>
              <p className={`text-sm ${mode === 'chaos' ? 'text-red-400' : mode === 'chill' ? 'text-red-600' : 'text-red-400'}`}>{error}</p>
            </div>
          )}

          {success && (
            <div className={`mb-4 p-4 ${getRoundedClass('rounded-lg')} border-2 ${
              mode === 'chaos' ? 'bg-green-500/10 border-green-500/40' : 
              mode === 'chill' ? 'bg-green-500/10 border-green-500/30' : 
              'bg-green-500/10 border-green-500/40'
            }`}>
              <p className={`text-sm ${mode === 'chaos' ? 'text-green-400' : mode === 'chill' ? 'text-green-600' : 'text-green-400'}`}>{success}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="full-name" className={getLabelClass()}>
                Full Name
              </Label>
              <Input
                id="full-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className={`w-full ${getInputClass()}`}
              />
            </div>

            <div>
              <Label htmlFor="pronouns" className={getLabelClass()}>
                Pronouns
              </Label>
              <Input
                id="pronouns"
                type="text"
                value={pronouns}
                onChange={(e) => setPronouns(e.target.value)}
                placeholder="e.g., she/her, he/him, they/them"
                className={`w-full ${getInputClass()}`}
              />
              <p className={getHintClass()}>
                Your pronouns (optional)
              </p>
            </div>

            <div>
              <Label htmlFor="bio" className={`${getLabelClass()} flex items-center gap-2`}>
                <FileText className="w-4 h-4" />
                Bio
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                className={`w-full min-h-[100px] ${getInputClass()}`}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="birthday" className={`${getLabelClass()} flex items-center gap-2`}>
                <Calendar className="w-4 h-4" />
                Birthday
              </Label>
              <Input
                id="birthday"
                type="text"
                value={birthday}
                onChange={(e) => {
                  let value = e.target.value
                  // Auto-format MM/DD
                  value = value.replace(/[^\d/]/g, '')
                  if (value.length === 2 && !value.includes('/')) {
                    value = value + '/'
                  }
                  if (value.length > 5) {
                    value = value.slice(0, 5)
                  }
                  setBirthday(value)
                }}
                placeholder="MM/DD (e.g., 03/15)"
                maxLength={5}
                className={`w-full ${getInputClass()}`}
              />
              <p className={getHintClass()}>
                Month and day only (required for horoscope generation)
              </p>
            </div>

            <div>
              <Label htmlFor="start-date" className={`${getLabelClass()} flex items-center gap-2`}>
                <Calendar className="w-4 h-4" />
                Start Date
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full ${getInputClass()}`}
              />
              <p className={getHintClass()}>
                Your start date (month, day, and year)
              </p>
            </div>

            <div>
              <Label htmlFor="location" className={`${getLabelClass()} flex items-center gap-2`}>
                <MapPin className="w-4 h-4" />
                Location
              </Label>
              <LocationAutocomplete
                value={location}
                onChange={setLocation}
                placeholder="Start typing a city or location..."
              />
              <p className={getHintClass()}>
                Start typing to see location suggestions
              </p>
            </div>

            <div>
              <Label htmlFor="website" className={`${getLabelClass()} flex items-center gap-2`}>
                <Globe className="w-4 h-4" />
                Website
              </Label>
              <Input
                id="website"
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="example.com or https://example.com"
                className={`w-full ${getInputClass()}`}
              />
              <p className={getHintClass()}>
                Your personal or professional website
              </p>
            </div>
            
            <div>
              <Label htmlFor="discipline" className={`${getLabelClass()} flex items-center gap-2`}>
                <Users className="w-4 h-4" />
                Discipline
              </Label>
              <Input
                id="discipline"
                type="text"
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                placeholder="e.g., Design, Engineering, Marketing"
                className={`w-full ${getInputClass()}`}
              />
              <p className={getHintClass()}>
                Your department or team. This helps personalize your horoscope.
              </p>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/')}
                className={`${mode === 'chaos' ? 'border-[#C4F500] text-[#C4F500] hover:bg-[#C4F500]/10' : mode === 'chill' ? 'border-[#FFC043] text-[#FFC043] hover:bg-[#FFC043]/10' : 'border-white text-white hover:bg-white/10'}`}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className={`${mode === 'chaos' ? 'bg-[#C4F500] text-black hover:bg-[#C4F500]/80' : mode === 'chill' ? 'bg-[#FFC043] text-[#4A1818] hover:bg-[#FFC043]/80' : 'bg-white text-black hover:bg-white/80'}`}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
          </Card>

          {/* Avatar Gallery */}
          <Card className={`p-8 ${getRoundedClass('rounded-[2.5rem]')} ${mode === 'chaos' ? 'bg-black border-[#C4F500]' : mode === 'chill' ? 'bg-white border-[#FFC043]/30' : 'bg-black border-white'}`}>
            <div className="mb-6">
              <h2 className={`text-2xl font-black uppercase ${getTextClass()} mb-2 flex items-center gap-2`}>
                <ImageIcon className="w-6 h-6" />
                AVATAR GALLERY
              </h2>
              <p className={`${getTextClass()}/70 text-sm`}>
                Previously generated avatars you can download
              </p>
            </div>

            {loadingAvatars ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className={`w-6 h-6 animate-spin ${getTextClass()}`} />
              </div>
            ) : avatarGallery.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {avatarGallery.map((avatar, index) => (
                  <div
                    key={index}
                    className={`relative group ${getRoundedClass('rounded-xl')} overflow-hidden border-2 ${
                      mode === 'chaos' ? 'border-[#C4F500]/40' : 
                      mode === 'chill' ? 'border-[#FFC043]/30' : 
                      'border-white/20'
                    }`}
                  >
                    <img
                      src={avatar.url}
                      alt={`Avatar ${index + 1}`}
                      className="w-full aspect-square object-cover"
                    />
                    <div className={`absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center ${getRoundedClass('rounded-xl')}`}>
                      <Button
                        size="sm"
                        onClick={() => handleDownloadAvatar(avatar.url, avatar.name)}
                        className={`${mode === 'chaos' ? 'bg-[#C4F500] text-black hover:bg-[#C4F500]/80' : mode === 'chill' ? 'bg-[#FFC043] text-[#4A1818] hover:bg-[#FFC043]/80' : 'bg-white text-black hover:bg-white/80'}`}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    {avatar.name.includes('horoscope') && (
                      <div className={`absolute top-2 right-2 px-2 py-1 ${getRoundedClass('rounded-md')} text-xs font-bold ${
                        mode === 'chaos' ? 'bg-[#C4F500] text-black' : 
                        mode === 'chill' ? 'bg-[#FFC043] text-[#4A1818]' : 
                        'bg-white text-black'
                      }`}>
                        Horoscope
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-12 ${getTextClass()}/60`}>
                <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No avatars found. Upload a photo or generate a horoscope avatar to see them here.</p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}
