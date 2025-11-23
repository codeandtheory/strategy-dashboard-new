'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
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
  const [selectedProject, setSelectedProject] = useState<PipelineProject | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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

  const getBorderColor = () => {
    switch (mode) {
      case 'chaos':
        return '#C4F500'
      case 'chill':
        return '#FFC043'
      case 'code':
        return '#FFFFFF'
      default:
        return '#00FF87' // Default bright green
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
        return 'text-white'
    }
  }

  const handleProjectClick = (project: PipelineProject) => {
    setSelectedProject(project)
    setIsDialogOpen(true)
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
    const borderColor = getBorderColor()

    return (
      <div key={project.id} className="relative flex items-start gap-3 py-2">
        {/* Left side with dot and connector line */}
        <div className="relative flex flex-col items-center shrink-0">
          {/* Dot */}
          <div 
            className="relative z-10 size-2 rounded-full mt-2" 
            style={{ backgroundColor: borderColor }}
          />
          {/* Dotted line connector - only show if not last item */}
          {index < total - 1 && (
            <div 
              className="absolute top-4 left-1/2 bottom-0 w-px border-l border-dashed -translate-x-1/2" 
              style={{ borderColor: `${borderColor}40` }}
            />
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {date && (
            <div className={`text-sm mb-1 ${getTextClass()} opacity-60`}>{date}</div>
          )}
          <div className={`font-semibold ${getTextClass()}`}>{project.name}</div>
          <div className={`text-sm ${getTextClass()} opacity-60`}>{displayText}</div>
        </div>
        
        {/* Add button */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0 rounded-full bg-white/10 hover:bg-white/20 border border-white/20"
          onClick={() => handleProjectClick(project)}
        >
          <Plus className="size-4 text-white" />
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

  const borderColor = getBorderColor()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="size-6" style={{ color: borderColor }} />
        <h1 className={`text-3xl font-bold ${getTextClass()}`}>
          NEW BUSINESS PIPELINE
        </h1>
      </div>

      {/* Single card split in half */}
      <Card 
        className="overflow-hidden"
        style={{
          backgroundColor: '#1a1a1a',
          borderColor: borderColor,
          borderWidth: '2px',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-x" style={{ borderColor: `${borderColor}40` }}>
          {/* Left Half - IN PROGRESS */}
          <div className="flex flex-col h-[calc(100vh-12rem)]">
            <div className="p-6 border-b" style={{ borderColor: `${borderColor}40` }}>
              <div className="flex items-center gap-3">
                <h2 className={`text-xl font-semibold ${getTextClass()}`}>
                  IN PROGRESS
                </h2>
                <Badge 
                  variant="secondary" 
                  className="text-xs"
                  style={{ 
                    backgroundColor: `${borderColor}20`,
                    color: borderColor,
                    borderColor: borderColor
                  }}
                >
                  {inProgressProjects.length} {inProgressProjects.length === 1 ? 'project' : 'projects'}
                </Badge>
              </div>
            </div>
            
            {/* Scrollable project list */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-1">
                {inProgressProjects.length > 0 ? (
                  inProgressProjects.map((project, index) => 
                    renderProjectItem(project, index, inProgressProjects.length)
                  )
                ) : (
                  <div className={`${getTextClass()} opacity-60 text-sm py-4`}>
                    No projects in progress
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Half - COMPLETED */}
          <div className="flex flex-col h-[calc(100vh-12rem)]">
            <div className="p-6 border-b" style={{ borderColor: `${borderColor}40` }}>
              <h2 className={`text-xl font-semibold mb-4 ${getTextClass()}`}>
                COMPLETED
              </h2>
              
              {/* Tabs */}
              <div className="flex flex-wrap gap-2">
                {(['Pending Decision', 'Long Lead', 'Won', 'Lost'] as const).map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    onClick={() => setCompletedFilter(status)}
                    className="text-xs"
                    style={{
                      backgroundColor: completedFilter === status ? borderColor : 'transparent',
                      color: completedFilter === status ? '#000' : borderColor,
                      borderColor: borderColor,
                      borderWidth: '1px',
                    }}
                  >
                    {status === 'Pending Decision' ? 'Pending' : status}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Scrollable project list */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-1">
                {completedProjects.length > 0 ? (
                  completedProjects.map((project, index) => 
                    renderProjectItem(project, index, completedProjects.length)
                  )
                ) : (
                  <div className={`${getTextClass()} opacity-60 text-sm py-4`}>
                    No projects with status: {completedFilter}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Project Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent 
          className="max-w-2xl"
          style={{
            backgroundColor: '#1a1a1a',
            borderColor: borderColor,
            borderWidth: '2px',
          }}
        >
          <DialogHeader>
            <DialogTitle className={getTextClass()}>
              {selectedProject?.name}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {selectedProject?.type || selectedProject?.description || 'No description'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProject && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm font-semibold ${getTextClass()} mb-1`}>Status</p>
                  <p className="text-white/80">{selectedProject.status}</p>
                </div>
                {selectedProject.due_date && (
                  <div>
                    <p className={`text-sm font-semibold ${getTextClass()} mb-1`}>Due Date</p>
                    <p className="text-white/80">{formatDate(selectedProject.due_date)}</p>
                  </div>
                )}
              </div>
              
              {selectedProject.lead && (
                <div>
                  <p className={`text-sm font-semibold ${getTextClass()} mb-1`}>Lead</p>
                  <p className="text-white/80">{selectedProject.lead}</p>
                </div>
              )}
              
              {selectedProject.team && (
                <div>
                  <p className={`text-sm font-semibold ${getTextClass()} mb-1`}>Team</p>
                  <p className="text-white/80">{selectedProject.team}</p>
                </div>
              )}
              
              {selectedProject.description && (
                <div>
                  <p className={`text-sm font-semibold ${getTextClass()} mb-1`}>Description</p>
                  <p className="text-white/80 whitespace-pre-wrap">{selectedProject.description}</p>
                </div>
              )}
              
              {selectedProject.notes && (
                <div>
                  <p className={`text-sm font-semibold ${getTextClass()} mb-1`}>Notes</p>
                  <p className="text-white/80 whitespace-pre-wrap">{selectedProject.notes}</p>
                </div>
              )}
              
              {selectedProject.tier !== null && (
                <div>
                  <p className={`text-sm font-semibold ${getTextClass()} mb-1`}>Tier</p>
                  <p className="text-white/80">{selectedProject.tier}</p>
                </div>
              )}
              
              {selectedProject.url && (
                <div>
                  <p className={`text-sm font-semibold ${getTextClass()} mb-1`}>URL</p>
                  <a 
                    href={selectedProject.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white underline"
                  >
                    {selectedProject.url}
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

