'use client'

import { useState, useEffect } from 'react'
import { useMode } from '@/contexts/mode-context'
import { useAuth } from '@/contexts/auth-context'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, ExternalLink, User, Calendar } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface WorkSample {
  id: string
  project_name: string
  description: string
  type?: { name: string } | null
  author?: { full_name?: string; email?: string } | null
  client?: string | null
  date: string
  thumbnail_url?: string | null
  file_url?: string | null
  file_link?: string | null
}

export default function WorkSamplesPage() {
  const { mode } = useMode()
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [workSamples, setWorkSamples] = useState<WorkSample[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')

  const getRoundedClass = (base: string) => {
    if (mode === 'chaos') return base.replace('rounded', 'rounded-[1.5rem]')
    if (mode === 'chill') return base.replace('rounded', 'rounded-2xl')
    return base
  }

  const textStyle = mode === 'chaos' ? 'text-white' : mode === 'chill' ? 'text-[#4A1818]' : 'text-[#FFFFFF]'
  const bgStyle = mode === 'chaos' ? 'bg-[#1A1A1A]' : mode === 'chill' ? 'bg-[#F5E6D3]' : 'bg-black'

  // Fetch work samples
  useEffect(() => {
    async function fetchWorkSamples() {
      if (!user) return
      
      setLoading(true)
      try {
        const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''
        const response = await fetch(`/api/work-samples?sortBy=date&sortOrder=desc${searchParam}`)
        if (response.ok) {
          const result = await response.json()
          if (result.data && Array.isArray(result.data)) {
            setWorkSamples(result.data)
          }
        }
      } catch (error) {
        console.error('Error fetching work samples:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchWorkSamples()
  }, [user, searchQuery])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim())
    }
    router.push(`/work-samples${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <div className={`min-h-screen ${bgStyle} ${textStyle} ${mode === 'code' ? 'font-mono' : 'font-[family-name:var(--font-raleway)]'}`}>
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className={`text-4xl font-black uppercase ${textStyle}`}>WORK SAMPLES</h1>
            <Link 
              href="/"
              className={`text-sm uppercase tracking-wider font-black ${textStyle}/70 hover:${textStyle} transition-opacity`}
            >
              ← Back to Dashboard
            </Link>
          </div>
          
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="max-w-md">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textStyle}/50`} />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search work samples..."
                className={`pl-10 h-12 ${mode === 'chaos' ? 'bg-black/30 border-gray-600 text-white placeholder:text-gray-500' : mode === 'chill' ? 'bg-white border-gray-300 text-[#4A1818] placeholder:text-gray-400' : 'bg-black/30 border-gray-600 text-white placeholder:text-gray-500'}`}
              />
            </div>
          </form>
        </div>

        {/* Work Samples Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className={textStyle}>Loading...</p>
          </div>
        ) : workSamples.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workSamples.map((sample) => (
              <Card key={sample.id} className={`${bgStyle} border ${mode === 'chaos' ? 'border-gray-800' : mode === 'chill' ? 'border-gray-300' : 'border-gray-700'} ${getRoundedClass('rounded-xl')} overflow-hidden`}>
                <div className="flex flex-col">
                  {/* Thumbnail */}
                  {sample.thumbnail_url ? (
                    <img 
                      src={sample.thumbnail_url.startsWith('http') && sample.thumbnail_url.includes('supabase') 
                        ? `/api/work-samples/thumbnail?url=${encodeURIComponent(sample.thumbnail_url)}`
                        : sample.thumbnail_url} 
                      alt={sample.project_name}
                      className={`w-full aspect-video object-contain ${getRoundedClass('rounded-t-xl')} bg-gray-100`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const placeholder = target.nextElementSibling as HTMLElement
                        if (placeholder) {
                          placeholder.style.display = 'flex'
                        }
                      }}
                    />
                  ) : null}
                  <div className={`w-full aspect-video ${getRoundedClass('rounded-t-xl')} bg-gray-200 flex items-center justify-center ${sample.thumbnail_url ? 'hidden' : ''}`}>
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col gap-3">
                    {/* Date */}
                    <div className="flex items-center gap-2">
                      <Calendar className={`w-4 h-4 ${textStyle}/70`} />
                      <p className={`text-xs ${textStyle}/70`}>
                        {sample.date ? new Date(sample.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                      </p>
                    </div>
                    
                    {/* Title with external link */}
                    {(sample.file_link || sample.file_url) ? (
                      <a
                        href={sample.file_link || sample.file_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-xl font-black uppercase ${textStyle} hover:opacity-70 transition-opacity flex items-center gap-2`}
                      >
                        {sample.project_name}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <h3 className={`text-xl font-black uppercase ${textStyle}`}>{sample.project_name}</h3>
                    )}
                    
                    {/* Client as badge */}
                    {sample.client && (
                      <div className={`inline-flex items-center px-3 py-1 rounded ${getRoundedClass('rounded-md')} ${mode === 'chaos' ? 'bg-gray-800' : mode === 'chill' ? 'bg-gray-200' : 'bg-gray-800'} w-fit`}>
                        <span className={`text-xs font-medium ${textStyle}`}>{sample.client}</span>
                      </div>
                    )}
                    
                    {/* Type */}
                    {sample.type && (
                      <div className={`inline-flex items-center px-3 py-1 rounded ${getRoundedClass('rounded-md')} ${mode === 'chaos' ? 'bg-gray-800' : mode === 'chill' ? 'bg-gray-200' : 'bg-gray-800'} w-fit`}>
                        <span className={`text-xs font-medium ${textStyle}`}>{sample.type.name}</span>
                      </div>
                    )}
                    
                    {/* Author */}
                    {sample.author && (
                      <div className="flex items-center gap-2">
                        <User className={`w-4 h-4 ${textStyle}/70`} />
                        <p className={`text-sm ${textStyle}/70`}>
                          {sample.author.full_name || sample.author.email}
                        </p>
                      </div>
                    )}
                    
                    {/* Description */}
                    {sample.description && (
                      <p className={`text-sm ${textStyle}/80 line-clamp-3`}>{sample.description}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className={`text-lg ${textStyle}/70`}>
              {searchQuery ? 'No work samples found matching your search.' : 'No work samples available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

