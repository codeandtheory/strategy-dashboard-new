'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useMode } from '@/contexts/mode-context'
import { useAuth } from '@/contexts/auth-context'
import { usePermissions } from '@/contexts/permissions-context'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Loader2
} from 'lucide-react'

interface ManualCalendarEvent {
  id: string
  title: string
  description: string | null
  start_date: string
  start_time: string | null
  end_date: string | null
  end_time: string | null
  location: string | null
  is_all_day: boolean
  color: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export default function CalendarEventsAdmin() {
  const { mode } = useMode()
  const { user } = useAuth()
  const { permissions } = usePermissions()
  const [events, setEvents] = useState<ManualCalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<ManualCalendarEvent | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: new Date().toISOString().split('T')[0],
    start_time: '',
    end_date: '',
    end_time: '',
    location: '',
    is_all_day: false,
    color: '#3B82F6', // Default blue
  })

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

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      // Fetch events for the next 90 days
      const timeMin = new Date().toISOString()
      const timeMax = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
      
      const response = await fetch(`/api/manual-calendar-events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`)
      const data = await response.json()
      
      if (response.ok) {
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      start_date: new Date().toISOString().split('T')[0],
      start_time: '',
      end_date: '',
      end_time: '',
      location: '',
      is_all_day: false,
      color: '#3B82F6',
    })
  }

  const handleAdd = async () => {
    if (!formData.title || !formData.start_date) {
      alert('Title and start date are required')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/manual-calendar-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          start_time: formData.is_all_day ? null : (formData.start_time || null),
          end_time: formData.is_all_day ? null : (formData.end_time || null),
          end_date: formData.end_date || formData.start_date,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setIsAddDialogOpen(false)
        resetForm()
        fetchEvents()
      } else {
        alert(data.error || 'Failed to create event')
      }
    } catch (error: any) {
      console.error('Error creating event:', error)
      alert(`Failed to create event: ${error.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (event: ManualCalendarEvent) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description || '',
      start_date: event.start_date,
      start_time: event.start_time || '',
      end_date: event.end_date || event.start_date,
      end_time: event.end_time || '',
      location: event.location || '',
      is_all_day: event.is_all_day,
      color: event.color || '#3B82F6',
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingEvent || !formData.title || !formData.start_date) {
      alert('Title and start date are required')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/manual-calendar-events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingEvent.id,
          ...formData,
          start_time: formData.is_all_day ? null : (formData.start_time || null),
          end_time: formData.is_all_day ? null : (formData.end_time || null),
          end_date: formData.end_date || formData.start_date,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setIsEditDialogOpen(false)
        setEditingEvent(null)
        resetForm()
        fetchEvents()
      } else {
        alert(data.error || 'Failed to update event')
      }
    } catch (error: any) {
      console.error('Error updating event:', error)
      alert(`Failed to update event: ${error.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return
    }

    try {
      const response = await fetch(`/api/manual-calendar-events?id=${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (response.ok) {
        fetchEvents()
      } else {
        alert(data.error || 'Failed to delete event')
      }
    } catch (error: any) {
      console.error('Error deleting event:', error)
      alert(`Failed to delete event: ${error.message || 'Unknown error'}`)
    }
  }

  const formatDateTime = (date: string, time: string | null, isAllDay: boolean) => {
    const dateObj = new Date(date)
    const dateStr = dateObj.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
    
    if (isAllDay) {
      return dateStr
    }
    
    if (time) {
      const [hours, minutes] = time.split(':')
      const hour12 = parseInt(hours) % 12 || 12
      const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM'
      return `${dateStr} at ${hour12}:${minutes} ${ampm}`
    }
    
    return dateStr
  }

  if (loading) {
    return (
      <div className={`${getBgClass()} ${getTextClass()} min-h-screen p-6 flex items-center justify-center`}>
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className={`${getBgClass()} ${getTextClass()} ${mode === 'code' ? 'font-mono' : 'font-[family-name:var(--font-raleway)]'} min-h-screen p-6`}>
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-black uppercase tracking-wider ${getTextClass()} mb-1`}>Manual Calendar Events</h1>
            <p className={`${getTextClass()}/70 text-sm font-normal`}>Add and manage calendar events that appear alongside Google Calendar events</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => resetForm()}
                className={`${getRoundedClass('rounded-lg')} ${
                  mode === 'chaos' ? 'bg-[#C4F500] text-black hover:bg-[#C4F500]/80' :
                  mode === 'chill' ? 'bg-[#FFC043] text-[#4A1818] hover:bg-[#FFC043]/80' :
                  'bg-[#FFFFFF] text-black hover:bg-[#FFFFFF]/80'
                } font-black uppercase tracking-wider ${mode === 'code' ? 'font-mono' : ''}`}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className={`${cardStyle.bg} ${cardStyle.border} border max-w-2xl`}>
              <DialogHeader>
                <DialogTitle className={cardStyle.text}>Add Calendar Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label className={cardStyle.text}>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text} mt-1`}
                    placeholder="Event title"
                  />
                </div>
                <div>
                  <Label className={cardStyle.text}>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text} mt-1`}
                    placeholder="Event description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className={cardStyle.text}>Start Date *</Label>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className={`${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text} mt-1`}
                    />
                  </div>
                  <div>
                    <Label className={cardStyle.text}>End Date</Label>
                    <Input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className={`${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text} mt-1`}
                      min={formData.start_date}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_all_day"
                    checked={formData.is_all_day}
                    onChange={(e) => setFormData({ ...formData, is_all_day: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="is_all_day" className={cardStyle.text}>All Day Event</Label>
                </div>
                {!formData.is_all_day && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className={cardStyle.text}>Start Time</Label>
                      <Input
                        type="time"
                        value={formData.start_time}
                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                        className={`${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text} mt-1`}
                      />
                    </div>
                    <div>
                      <Label className={cardStyle.text}>End Time</Label>
                      <Input
                        type="time"
                        value={formData.end_time}
                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                        className={`${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text} mt-1`}
                      />
                    </div>
                  </div>
                )}
                <div>
                  <Label className={cardStyle.text}>Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className={`${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text} mt-1`}
                    placeholder="Event location"
                  />
                </div>
                <div>
                  <Label className={cardStyle.text}>Color</Label>
                  <div className="flex items-center gap-3 mt-1">
                    <Input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className={`flex-1 ${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    onClick={() => setIsAddDialogOpen(false)}
                    variant="outline"
                    className={`${cardStyle.border} border ${cardStyle.text}`}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAdd}
                    disabled={saving || !formData.title || !formData.start_date}
                    className={`${getRoundedClass('rounded-lg')} ${
                      mode === 'chaos' ? 'bg-[#C4F500] text-black hover:bg-[#C4F500]/80' :
                      mode === 'chill' ? 'bg-[#FFC043] text-[#4A1818] hover:bg-[#FFC043]/80' :
                      'bg-[#FFFFFF] text-black hover:bg-[#FFFFFF]/80'
                    } font-black uppercase tracking-wider`}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Add Event'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Events List */}
        <Card className={`${cardStyle.bg} ${cardStyle.border} border p-6 ${getRoundedClass('rounded-xl')}`}>
          {events.length === 0 ? (
            <p className={`${cardStyle.text}/70 text-center py-8`}>No manual calendar events yet. Add one to get started!</p>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`${cardStyle.border} border ${getRoundedClass('rounded-xl')} p-4`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: event.color || '#3B82F6' }}
                        />
                        <h3 className={`font-bold ${cardStyle.text}`}>{event.title}</h3>
                      </div>
                      {event.description && (
                        <p className={`text-sm ${cardStyle.text}/70 mb-2`}>{event.description}</p>
                      )}
                      <div className={`flex flex-wrap gap-4 text-sm ${cardStyle.text}/60`}>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{formatDateTime(event.start_date, event.start_time, event.is_all_day)}</span>
                          {event.end_date && event.end_date !== event.start_date && (
                            <span> - {formatDateTime(event.end_date, event.end_time, event.is_all_day)}</span>
                          )}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleEdit(event)}
                        className={`${getRoundedClass('rounded-lg')} ${
                          mode === 'chaos' ? 'bg-[#C4F500]/20 text-[#C4F500] hover:bg-[#C4F500]/30 border border-[#C4F500]' :
                          mode === 'chill' ? 'bg-[#FFC043]/20 text-[#FFC043] hover:bg-[#FFC043]/30 border border-[#FFC043]' :
                          'bg-white/20 text-white hover:bg-white/30 border border-white'
                        } font-semibold text-xs px-3 py-1.5`}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(event.id)}
                        className={`${getRoundedClass('rounded-lg')} bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500 font-semibold text-xs px-3 py-1.5`}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className={`${cardStyle.bg} ${cardStyle.border} border max-w-2xl`}>
            <DialogHeader>
              <DialogTitle className={cardStyle.text}>Edit Calendar Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className={cardStyle.text}>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text} mt-1`}
                  placeholder="Event title"
                />
              </div>
              <div>
                <Label className={cardStyle.text}>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text} mt-1`}
                  placeholder="Event description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={cardStyle.text}>Start Date *</Label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className={`${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text} mt-1`}
                  />
                </div>
                <div>
                  <Label className={cardStyle.text}>End Date</Label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className={`${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text} mt-1`}
                    min={formData.start_date}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit_is_all_day"
                  checked={formData.is_all_day}
                  onChange={(e) => setFormData({ ...formData, is_all_day: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="edit_is_all_day" className={cardStyle.text}>All Day Event</Label>
              </div>
              {!formData.is_all_day && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className={cardStyle.text}>Start Time</Label>
                    <Input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      className={`${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text} mt-1`}
                    />
                  </div>
                  <div>
                    <Label className={cardStyle.text}>End Time</Label>
                    <Input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      className={`${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text} mt-1`}
                    />
                  </div>
                </div>
              )}
              <div>
                <Label className={cardStyle.text}>Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={`${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text} mt-1`}
                  placeholder="Event location"
                />
              </div>
              <div>
                <Label className={cardStyle.text}>Color</Label>
                <div className="flex items-center gap-3 mt-1">
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className={`flex-1 ${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}
                    placeholder="#3B82F6"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  onClick={() => {
                    setIsEditDialogOpen(false)
                    setEditingEvent(null)
                    resetForm()
                  }}
                  variant="outline"
                  className={`${cardStyle.border} border ${cardStyle.text}`}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdate}
                  disabled={saving || !formData.title || !formData.start_date}
                  className={`${getRoundedClass('rounded-lg')} ${
                    mode === 'chaos' ? 'bg-[#C4F500] text-black hover:bg-[#C4F500]/80' :
                    mode === 'chill' ? 'bg-[#FFC043] text-[#4A1818] hover:bg-[#FFC043]/80' :
                    'bg-[#FFFFFF] text-black hover:bg-[#FFFFFF]/80'
                  } font-black uppercase tracking-wider`}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Update Event'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

