'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useMode } from '@/contexts/mode-context'
import { Plus, TrendingUp } from 'lucide-react'

interface PipelineProject {
  id: string
  name: string
  type: string | null
  description: string | null
  due_date: string | null
  lead: string | null
  notes: string | null
  status: string
  team: string | null
  url: string | null
  tier: number | null
  created_at: string
  updated_at: string
}

export default function PipelinePage() {
  const { mode } = useMode()
  const [projects, setProjects] = useState<PipelineProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completedFilter, setCompletedFilter] = useState<'Pending Decision' | 'Long Lead' | 'Won' | 'Lost'>('Pending Decision')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/pipeline')
      if (!response.ok) {
        throw new Error('Failed to fetch pipeline projects')
      }
      const result = await response.json()
      setProjects(result.data || [])
      setError(null)
    } catch (err: any) {
      console.error('Error fetching projects:', err)
      setError(err.message || 'Failed to load pipeline projects')
    } finally {
      setLoading(false)
    }
  }

  const getCardStyle = () => {
    switch (mode) {
      case 'chaos':
        return 'border-[#C4F500] bg-[#C4F500]/5'
      case 'chill':
        return 'border-[#FFC043] bg-[#FFC043]/5'
      case 'code':
        return 'border-[#FFFFFF] bg-[#FFFFFF]/5'
      default:
        return 'border-border bg-card'
    }
  }

  const getTextClass = () => {
    switch (mode) {
      case 'chaos':
        return 'text-[#C4F500]'
      case 'chill':
        return 'text-[#FFC043]'
      case 'code':
        return 'text-[#FFFFFF] font-mono'
      default:
        return 'text-foreground'
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  }

  const inProgressProjects = projects.filter(p => p.status === 'In Progress')
  const completedProjects = projects.filter(p => p.status === completedFilter)

  const renderProjectItem = (project: PipelineProject, index: number, total: number) => {
    const date = formatDate(project.due_date)
    const displayText = project.type || project.description || 'Unknown'

    return (
      <div key={project.id} className="relative flex items-start gap-3 py-2">
        {/* Left side with dot and connector line */}
        <div className="relative flex flex-col items-center shrink-0">
          {/* Dot */}
          <div className="relative z-10 size-2 rounded-full bg-foreground mt-2" />
          {/* Dotted line connector - only show if not last item */}
          {index < total - 1 && (
            <div className="absolute top-4 left-1/2 bottom-0 w-px border-l border-dashed border-muted-foreground/30 -translate-x-1/2" />
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {date && (
            <div className="text-sm text-muted-foreground mb-1">{date}</div>
          )}
          <div className={`font-semibold ${getTextClass()}`}>{project.name}</div>
          <div className="text-sm text-muted-foreground">{displayText}</div>
        </div>
        
        {/* Add button */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0 rounded-full bg-background hover:bg-accent"
          onClick={() => {
            // TODO: Handle add action
            console.log('Add clicked for:', project.name)
          }}
        >
          <Plus className="size-4" />
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className={`text-center ${getTextClass()}`}>Loading pipeline...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className={`text-center text-destructive ${getTextClass()}`}>
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="size-6" />
        <h1 className={`text-3xl font-bold ${getTextClass()}`}>
          NEW BUSINESS PIPELINE
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* IN PROGRESS Section */}
        <Card className={`p-6 ${getCardStyle()}`}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className={`text-xl font-semibold ${getTextClass()}`}>
                IN PROGRESS
              </h2>
              <Badge variant="secondary" className="text-xs">
                {inProgressProjects.length} {inProgressProjects.length === 1 ? 'project' : 'projects'}
              </Badge>
            </div>
            
            <div className="space-y-1">
              {inProgressProjects.length > 0 ? (
                inProgressProjects.map((project, index) => 
                  renderProjectItem(project, index, inProgressProjects.length)
                )
              ) : (
                <div className="text-muted-foreground text-sm py-4">
                  No projects in progress
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* COMPLETED Section */}
        <Card className={`p-6 ${getCardStyle()}`}>
          <div className="space-y-4">
            <h2 className={`text-xl font-semibold ${getTextClass()}`}>
              COMPLETED
            </h2>
            
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              {(['Pending Decision', 'Long Lead', 'Won', 'Lost'] as const).map((status) => (
                <Button
                  key={status}
                  variant={completedFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCompletedFilter(status)}
                  className="text-xs"
                >
                  {status}
                </Button>
              ))}
            </div>
            
            <div className="space-y-1">
              {completedProjects.length > 0 ? (
                completedProjects.map((project, index) => 
                  renderProjectItem(project, index, completedProjects.length)
                )
              ) : (
                <div className="text-muted-foreground text-sm py-4">
                  No projects with status: {completedFilter}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

