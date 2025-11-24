'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMode } from '@/contexts/mode-context'
import { useAuth } from '@/contexts/auth-context'
import { BarChart3, Database, Type, Save, ArrowUp, ArrowDown, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface StatConfig {
  id?: string
  position: number
  stat_type: 'database' | 'custom'
  database_stat_key?: string | null
  custom_title?: string | null
  custom_value?: string | null
}

const DATABASE_STATS = [
  { key: 'active_projects', label: 'Active Projects', description: 'Pipeline projects with status "In Progress"' },
  { key: 'new_business', label: 'New Business', description: 'Pipeline projects created in last 7 days' },
  { key: 'pitches_due', label: 'Pitches Due', description: 'Pipeline projects with due date in next 7 days' },
  { key: 'active_clients', label: 'Active Clients', description: 'Unique clients from work samples (last 12 months)' },
]

export default function ThisWeekPage() {
  const { mode } = useMode()
  const { user } = useAuth()
  const [stats, setStats] = useState<StatConfig[]>([
    { position: 1, stat_type: 'database', database_stat_key: 'active_projects' },
    { position: 2, stat_type: 'database', database_stat_key: 'new_business' },
    { position: 3, stat_type: 'database', database_stat_key: 'pitches_due' },
    { position: 4, stat_type: 'database', database_stat_key: 'active_clients' },
  ])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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

  const cardStyle = getCardStyle()

  // Fetch current stats configuration
  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        const response = await fetch('/api/this-week-stats')
        if (response.ok) {
          const data = await response.json()
          if (data.stats && data.stats.length > 0) {
            // Convert API response to config format
            const configs: StatConfig[] = data.stats.map((stat: any) => ({
              id: stat.id,
              position: stat.position,
              stat_type: stat.stat_type,
              database_stat_key: stat.database_stat_key || null,
              custom_title: stat.title || null,
              custom_value: stat.value || null,
            }))
            // Sort by position and ensure we have 4
            const sorted = configs.sort((a, b) => a.position - b.position)
            while (sorted.length < 4) {
              sorted.push({
                position: sorted.length + 1,
                stat_type: 'database',
                database_stat_key: 'active_projects',
              })
            }
            setStats(sorted.slice(0, 4))
          }
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
        toast.error('Failed to load stats configuration')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const updateStat = (position: number, updates: Partial<StatConfig>) => {
    setStats(prev => prev.map(stat => 
      stat.position === position 
        ? { ...stat, ...updates }
        : stat
    ))
  }

  const moveStat = (position: number, direction: 'up' | 'down') => {
    const newPosition = direction === 'up' ? position - 1 : position + 1
    if (newPosition < 1 || newPosition > 4) return

    setStats(prev => {
      const newStats = [...prev]
      const stat1 = newStats.find(s => s.position === position)
      const stat2 = newStats.find(s => s.position === newPosition)
      
      if (stat1 && stat2) {
        stat1.position = newPosition
        stat2.position = position
      }
      
      return newStats.sort((a, b) => a.position - b.position)
    })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      // Validate all stats
      for (const stat of stats) {
        if (stat.stat_type === 'database' && !stat.database_stat_key) {
          toast.error(`Position ${stat.position}: Please select a database stat`)
          setSaving(false)
          return
        }
        if (stat.stat_type === 'custom') {
          if (!stat.custom_title || !stat.custom_title.trim()) {
            toast.error(`Position ${stat.position}: Please enter a title`)
            setSaving(false)
            return
          }
          if (!stat.custom_value || !stat.custom_value.trim()) {
            toast.error(`Position ${stat.position}: Please enter a value`)
            setSaving(false)
            return
          }
        }
      }

      const response = await fetch('/api/this-week-stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stats }),
      })

      if (response.ok) {
        toast.success('Stats configuration saved successfully!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save stats')
      }
    } catch (error) {
      console.error('Error saving stats:', error)
      toast.error('Failed to save stats configuration')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={`${getBgClass()} ${getTextClass()} ${mode === 'code' ? 'font-mono' : 'font-[family-name:var(--font-raleway)]'} min-h-screen p-6`}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className={`${getBgClass()} ${getTextClass()} ${mode === 'code' ? 'font-mono' : 'font-[family-name:var(--font-raleway)]'} min-h-screen p-6`}>
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-4">
          <h1 className={`text-2xl font-black uppercase tracking-wider ${getTextClass()} mb-1`}>This Week Stats</h1>
          <p className={`${getTextClass()}/70 text-sm font-normal`}>Configure the 4 statistics displayed in the "This Week" card on the dashboard.</p>
        </div>

      <Card className={`${cardStyle.bg} ${cardStyle.border} border p-6 ${getRoundedClass('rounded-xl')}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className={`w-6 h-6 ${getTextClass()}`} />
            <h2 className={`text-2xl font-black uppercase ${getTextClass()}`}>Stats Configuration</h2>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className={`${getRoundedClass('rounded-lg')} ${
              mode === 'chaos' ? 'bg-[#C4F500] text-black hover:bg-[#C4F500]/80' :
              mode === 'chill' ? 'bg-[#FFC043] text-[#4A1818] hover:bg-[#FFC043]/80' :
              'bg-[#FFFFFF] text-black hover:bg-[#FFFFFF]/80'
            } font-black uppercase tracking-wider ${mode === 'code' ? 'font-mono' : ''}`}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Configuration
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {stats.map((stat, index) => (
            <Card
              key={stat.position}
              className={`${cardStyle.bg} ${cardStyle.border} border p-6 ${getRoundedClass('rounded-xl')}`}
            >
              <div className="flex items-start gap-4">
                {/* Position indicator and move buttons */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${
                    mode === 'chaos' ? 'bg-[#C4F500] text-black' :
                    mode === 'chill' ? 'bg-[#FFC043] text-[#4A1818]' :
                    'bg-[#FFFFFF] text-black'
                  }`}>
                    {stat.position}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveStat(stat.position, 'up')}
                      disabled={stat.position === 1}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveStat(stat.position, 'down')}
                      disabled={stat.position === 4}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Stat configuration */}
                <div className="flex-1 space-y-4">
                  {/* Stat type selector */}
                  <div>
                    <Label className={cardStyle.text}>Stat Type</Label>
                    <Select
                      value={stat.stat_type}
                      onValueChange={(value: 'database' | 'custom') => {
                        updateStat(stat.position, {
                          stat_type: value,
                          database_stat_key: value === 'database' ? 'active_projects' : null,
                          custom_title: value === 'custom' ? '' : null,
                          custom_value: value === 'custom' ? '' : null,
                        })
                      }}
                    >
                      <SelectTrigger className={`${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="database">
                          <div className="flex items-center gap-2">
                            <Database className="w-4 h-4" />
                            <span>Database Stat</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="custom">
                          <div className="flex items-center gap-2">
                            <Type className="w-4 h-4" />
                            <span>Custom Stat</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Database stat selector */}
                  {stat.stat_type === 'database' && (
                    <div>
                      <Label className={cardStyle.text}>Database Stat</Label>
                      <Select
                        value={stat.database_stat_key || ''}
                        onValueChange={(value) => updateStat(stat.position, { database_stat_key: value })}
                      >
                        <SelectTrigger className={`${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}>
                          <SelectValue placeholder="Select a database stat" />
                        </SelectTrigger>
                        <SelectContent>
                          {DATABASE_STATS.map((dbStat) => (
                            <SelectItem key={dbStat.key} value={dbStat.key}>
                              <div>
                                <div className="font-medium">{dbStat.label}</div>
                                <div className="text-xs text-muted-foreground">{dbStat.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Custom stat inputs */}
                  {stat.stat_type === 'custom' && (
                    <>
                      <div>
                        <Label className={cardStyle.text}>Title</Label>
                        <Input
                          value={stat.custom_title || ''}
                          onChange={(e) => updateStat(stat.position, { custom_title: e.target.value })}
                          placeholder="e.g., team members"
                          className={`${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}
                        />
                      </div>
                      <div>
                        <Label className={cardStyle.text}>Value</Label>
                        <Input
                          value={stat.custom_value || ''}
                          onChange={(e) => updateStat(stat.position, { custom_value: e.target.value })}
                          placeholder="e.g., 25"
                          className={`${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
      </div>
    </div>
  )
}

