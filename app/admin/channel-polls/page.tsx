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
import { createClient } from '@/lib/supabase/client'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MessageSquare,
  Loader2,
  ShieldOff,
  Save,
  Star,
  BarChart3
} from 'lucide-react'

interface PollOption {
  id?: string
  name: string
  rank?: number | null
  count?: number
  display_order?: number
}

interface Poll {
  id: string
  title: string
  question: string
  asked_by: string | null
  date: string
  total_responses: number
  is_ranking: boolean
  is_active: boolean
  is_featured: boolean
  image_url: string | null
  fun_fact_title: string | null
  fun_fact_content: any | null
  display_order: number
  created_at: string
  updated_at: string
  options?: PollOption[]
}

export default function ChannelPollsAdmin() {
  const { mode } = useMode()
  const { user } = useAuth()
  const { permissions } = usePermissions()
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [editingItem, setEditingItem] = useState<Poll | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isOptionsDialogOpen, setIsOptionsDialogOpen] = useState(false)
  const [currentPollForOptions, setCurrentPollForOptions] = useState<Poll | null>(null)
  
  // Form state
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const [formData, setFormData] = useState({
    title: '',
    question: '',
    asked_by: '',
    date: getTodayDate(),
    total_responses: 0,
    is_ranking: false,
    is_active: true,
    is_featured: false,
    image_url: '',
    fun_fact_title: '',
    fun_fact_content: '',
    display_order: 0,
  })

  const [pollOptions, setPollOptions] = useState<PollOption[]>([])
  const [newOptionName, setNewOptionName] = useState('')
  const [newOptionValue, setNewOptionValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Theme-aware styling helpers
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

  // Fetch polls
  const fetchPolls = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('channel_polls')
        .select(`
          *,
          poll_options (*)
        `)
        .order('display_order', { ascending: false })
        .order('date', { ascending: false })

      if (error) throw error
      
      setPolls(data || [])
    } catch (error) {
      console.error('Error fetching polls:', error)
      setPolls([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPolls()
  }, [])

  // Handle add
  const handleAdd = async () => {
    if (!formData.title.trim() || !formData.question.trim() || !formData.date) {
      setError('Please fill in all required fields (title, question, date)')
      return
    }

    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      const supabase = createClient()

      // Parse fun_fact_content if provided
      let funFactContent = null
      if (formData.fun_fact_content.trim()) {
        try {
          funFactContent = JSON.parse(formData.fun_fact_content)
        } catch {
          // If not valid JSON, treat as comma-separated list
          funFactContent = formData.fun_fact_content.split(',').map(item => item.trim()).filter(Boolean)
        }
      }

      const { data: poll, error: pollError } = await supabase
        .from('channel_polls')
        .insert({
          title: formData.title.trim(),
          question: formData.question.trim(),
          asked_by: formData.asked_by.trim() || null,
          date: formData.date,
          total_responses: formData.total_responses || 0,
          is_ranking: formData.is_ranking,
          is_active: formData.is_active,
          is_featured: formData.is_featured,
          image_url: formData.image_url.trim() || null,
          fun_fact_title: formData.fun_fact_title.trim() || null,
          fun_fact_content: funFactContent,
          display_order: formData.display_order || 0,
        })
        .select()
        .single()

      if (pollError) throw pollError

      // Insert poll options if provided
      if (pollOptions.length > 0 && poll) {
        const optionsToInsert = pollOptions.map((opt, idx) => ({
          poll_id: poll.id,
          name: opt.name,
          rank: formData.is_ranking ? (opt.rank || idx + 1) : null,
          count: formData.is_ranking ? null : (opt.count || 0),
          display_order: opt.display_order || idx + 1,
        }))

        const { error: optionsError } = await supabase
          .from('poll_options')
          .insert(optionsToInsert)

        if (optionsError) throw optionsError
      }

      setIsAddDialogOpen(false)
      resetForm()
      fetchPolls()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error: any) {
      console.error('Error adding poll:', error)
      setError(error.message || 'Failed to add poll')
    } finally {
      setSaving(false)
    }
  }

  // Handle edit
  const handleEdit = (item: Poll) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      question: item.question,
      asked_by: item.asked_by || '',
      date: item.date,
      total_responses: item.total_responses,
      is_ranking: item.is_ranking,
      is_active: item.is_active,
      is_featured: item.is_featured,
      image_url: item.image_url || '',
      fun_fact_title: item.fun_fact_title || '',
      fun_fact_content: item.fun_fact_content ? JSON.stringify(item.fun_fact_content) : '',
      display_order: item.display_order,
    })
    setPollOptions(item.options || [])
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingItem) return

    if (!formData.title.trim() || !formData.question.trim() || !formData.date) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      const supabase = createClient()

      // Parse fun_fact_content if provided
      let funFactContent = null
      if (formData.fun_fact_content.trim()) {
        try {
          funFactContent = JSON.parse(formData.fun_fact_content)
        } catch {
          funFactContent = formData.fun_fact_content.split(',').map(item => item.trim()).filter(Boolean)
        }
      }

      const { error: pollError } = await supabase
        .from('channel_polls')
        .update({
          title: formData.title.trim(),
          question: formData.question.trim(),
          asked_by: formData.asked_by.trim() || null,
          date: formData.date,
          total_responses: formData.total_responses,
          is_ranking: formData.is_ranking,
          is_active: formData.is_active,
          is_featured: formData.is_featured,
          image_url: formData.image_url.trim() || null,
          fun_fact_title: formData.fun_fact_title.trim() || null,
          fun_fact_content: funFactContent,
          display_order: formData.display_order,
        })
        .eq('id', editingItem.id)

      if (pollError) throw pollError

      setIsEditDialogOpen(false)
      setEditingItem(null)
      resetForm()
      fetchPolls()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error: any) {
      console.error('Error updating poll:', error)
      setError(error.message || 'Failed to update poll')
    } finally {
      setSaving(false)
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this poll? This will also delete all poll options.')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('channel_polls')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      fetchPolls()
      setSelectedIds(new Set())
    } catch (error: any) {
      console.error('Error deleting poll:', error)
      alert(`Failed to delete poll: ${error.message}`)
    }
  }

  // Handle manage options
  const handleManageOptions = (poll: Poll) => {
    setCurrentPollForOptions(poll)
    setPollOptions(poll.options || [])
    setIsOptionsDialogOpen(true)
  }

  const handleSaveOptions = async () => {
    if (!currentPollForOptions) return

    try {
      setSaving(true)
      setError(null)

      const supabase = createClient()

      // Delete existing options
      const { error: deleteError } = await supabase
        .from('poll_options')
        .delete()
        .eq('poll_id', currentPollForOptions.id)

      if (deleteError) throw deleteError

      // Insert new options
      if (pollOptions.length > 0) {
        const optionsToInsert = pollOptions.map((opt, idx) => ({
          poll_id: currentPollForOptions.id,
          name: opt.name,
          rank: currentPollForOptions.is_ranking ? (opt.rank || idx + 1) : null,
          count: currentPollForOptions.is_ranking ? null : (opt.count || 0),
          display_order: opt.display_order || idx + 1,
        }))

        const { error: insertError } = await supabase
          .from('poll_options')
          .insert(optionsToInsert)

        if (insertError) throw insertError
      }

      setIsOptionsDialogOpen(false)
      setCurrentPollForOptions(null)
      fetchPolls()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error: any) {
      console.error('Error saving options:', error)
      setError(error.message || 'Failed to save options')
    } finally {
      setSaving(false)
    }
  }

  const addOption = () => {
    if (!newOptionName.trim()) return

    const newOption: PollOption = {
      name: newOptionName.trim(),
      rank: currentPollForOptions?.is_ranking ? parseInt(newOptionValue) || pollOptions.length + 1 : null,
      count: currentPollForOptions?.is_ranking ? null : parseInt(newOptionValue) || 0,
      display_order: pollOptions.length + 1,
    }

    setPollOptions([...pollOptions, newOption])
    setNewOptionName('')
    setNewOptionValue('')
  }

  const removeOption = (index: number) => {
    setPollOptions(pollOptions.filter((_, i) => i !== index))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      question: '',
      asked_by: '',
      date: getTodayDate(),
      total_responses: 0,
      is_ranking: false,
      is_active: true,
      is_featured: false,
      image_url: '',
      fun_fact_title: '',
      fun_fact_content: '',
      display_order: 0,
    })
    setPollOptions([])
    setNewOptionName('')
    setNewOptionValue('')
    setError(null)
    setSuccess(false)
  }

  const filteredPolls = polls.filter(poll => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      poll.title.toLowerCase().includes(query) ||
      poll.question.toLowerCase().includes(query) ||
      poll.asked_by?.toLowerCase().includes(query) ||
      ''
    )
  })

  if (!permissions?.canManagePlaylists) {
    return (
      <div className={`${getBgClass()} ${getTextClass()} min-h-screen p-6`}>
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-8">
            <h1 className={`text-2xl font-black uppercase tracking-wider ${getTextClass()} mb-1`}>Channel Polls</h1>
          </div>
          <Card className={`${getCardStyle().bg} ${getCardStyle().border} border p-6 ${getRoundedClass('rounded-xl')}`}>
            <div className="flex items-center gap-3 text-destructive">
              <ShieldOff className="w-5 h-5" />
              <p>You don't have permission to manage channel polls. You need the "Leader", "Admin", or "Curator" role.</p>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  const cardStyle = getCardStyle()

  return (
    <div className={`${getBgClass()} ${getTextClass()} ${mode === 'code' ? 'font-mono' : 'font-[family-name:var(--font-raleway)]'} min-h-screen p-6`}>
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className={`text-2xl font-black uppercase tracking-wider ${getTextClass()} mb-1`}>Channel Polls</h1>
          <p className={`${getTextClass()}/70 text-sm font-normal`}>Manage polls for the vibes page</p>
        </div>

        {/* Actions Bar */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open)
            if (open) {
              resetForm()
            }
          }}>
            <DialogTrigger asChild>
              <Button 
                className={`${getRoundedClass('rounded-lg')} h-8 text-xs ${
                  mode === 'chaos' ? 'bg-[#C4F500] text-black hover:bg-[#C4F500]/80' :
                  mode === 'chill' ? 'bg-[#FFC043] text-[#4A1818] hover:bg-[#FFC043]/80' :
                  'bg-[#FFFFFF] text-black hover:bg-[#FFFFFF]/80'
                } font-black uppercase tracking-wider ${mode === 'code' ? 'font-mono' : ''}`}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add New
              </Button>
            </DialogTrigger>
            <DialogContent className={`${cardStyle.bg} ${cardStyle.border} border max-w-4xl max-h-[90vh] overflow-y-auto`}>
              <DialogHeader>
                <DialogTitle className={cardStyle.text}>Add New Poll</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className={cardStyle.text}>Title *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className={`mt-1 ${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}
                      placeholder="Thanksgiving Grub"
                    />
                  </div>
                  <div>
                    <Label className={cardStyle.text}>Date *</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className={`mt-1 ${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}
                    />
                  </div>
                </div>

                <div>
                  <Label className={cardStyle.text}>Question *</Label>
                  <Textarea
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className={`mt-1 ${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}
                    placeholder="What are your top Thanksgiving dishes?"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className={cardStyle.text}>Asked By</Label>
                    <Input
                      value={formData.asked_by}
                      onChange={(e) => setFormData({ ...formData, asked_by: e.target.value })}
                      className={`mt-1 ${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}
                      placeholder="Rebecca Smith"
                    />
                  </div>
                  <div>
                    <Label className={cardStyle.text}>Total Responses</Label>
                    <Input
                      type="number"
                      value={formData.total_responses}
                      onChange={(e) => setFormData({ ...formData, total_responses: parseInt(e.target.value) || 0 })}
                      className={`mt-1 ${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className={cardStyle.text}>Image URL</Label>
                    <Input
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className={`mt-1 ${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}
                      placeholder="/thxgiving.png"
                    />
                  </div>
                  <div>
                    <Label className={cardStyle.text}>Display Order</Label>
                    <Input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                      className={`mt-1 ${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}
                    />
                  </div>
                </div>

                <div>
                  <Label className={cardStyle.text}>Fun Fact Title</Label>
                  <Input
                    value={formData.fun_fact_title}
                    onChange={(e) => setFormData({ ...formData, fun_fact_title: e.target.value })}
                    className={`mt-1 ${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}
                    placeholder="Fun Fact: Statistically speaking..."
                  />
                </div>

                <div>
                  <Label className={cardStyle.text}>Fun Fact Content (JSON array or comma-separated)</Label>
                  <Textarea
                    value={formData.fun_fact_content}
                    onChange={(e) => setFormData({ ...formData, fun_fact_content: e.target.value })}
                    className={`mt-1 ${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}
                    placeholder='["turkey", "custard", "caramel"] or turkey, custard, caramel'
                    rows={2}
                  />
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_ranking}
                      onChange={(e) => setFormData({ ...formData, is_ranking: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className={cardStyle.text}>Ranking Poll</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className={cardStyle.text}>Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className={cardStyle.text}>Featured (Latest Poll)</span>
                  </label>
                </div>

                {error && (
                  <div className={`p-4 ${cardStyle.bg} ${cardStyle.border} border rounded-lg`} style={{ borderColor: '#ef444440' }}>
                    <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>
                  </div>
                )}

                {success && (
                  <div className={`p-4 ${cardStyle.bg} ${cardStyle.border} border rounded-lg`} style={{ borderColor: '#22c55e40' }}>
                    <p className="text-sm" style={{ color: '#22c55e' }}>Poll saved successfully!</p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => setIsAddDialogOpen(false)}
                    className={`${cardStyle.border} border ${cardStyle.text}`}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAdd}
                    disabled={saving}
                    className={`${cardStyle.accent} text-black font-black`}
                    style={{ backgroundColor: cardStyle.accent }}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${getTextClass()}/50`} />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search polls..."
                className={`pl-10 ${getCardStyle().bg} ${getCardStyle().border} border ${getTextClass()}`}
              />
            </div>
          </div>
        </div>

        {/* Polls List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: cardStyle.accent }} />
          </div>
        ) : filteredPolls.length === 0 ? (
          <Card className={`${cardStyle.bg} ${cardStyle.border} border p-6 ${getRoundedClass('rounded-xl')}`}>
            <p className={cardStyle.text}>No polls found</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredPolls.map((poll) => (
              <Card key={poll.id} className={`${cardStyle.bg} ${cardStyle.border} border p-4 ${getRoundedClass('rounded-xl')}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`text-lg font-black ${cardStyle.text}`}>{poll.title}</h3>
                      {poll.is_featured && (
                        <Star className="w-4 h-4" style={{ color: cardStyle.accent }} fill={cardStyle.accent} />
                      )}
                      {poll.is_ranking && (
                        <BarChart3 className="w-4 h-4" style={{ color: cardStyle.accent }} />
                      )}
                      {!poll.is_active && (
                        <span className={`text-xs px-2 py-1 rounded ${cardStyle.text}/20`}>Inactive</span>
                      )}
                    </div>
                    <p className={`text-sm ${cardStyle.text}/70 mb-2`}>{poll.question}</p>
                    <div className="flex items-center gap-4 text-xs ${cardStyle.text}/60">
                      <span>{poll.asked_by || 'Anonymous'}</span>
                      <span>•</span>
                      <span>{new Date(poll.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{poll.total_responses} responses</span>
                      <span>•</span>
                      <span>{poll.options?.length || 0} options</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleManageOptions(poll)}
                      className={`${cardStyle.border} border ${cardStyle.text} h-8 px-3 text-xs`}
                    >
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Options
                    </Button>
                    <Button
                      onClick={() => handleEdit(poll)}
                      className={`${cardStyle.border} border ${cardStyle.text} h-8 px-3 text-xs`}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(poll.id)}
                      className={`${cardStyle.border} border ${cardStyle.text}/20 h-8 px-3 text-xs hover:bg-destructive/20`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className={`${cardStyle.bg} ${cardStyle.border} border max-w-4xl max-h-[90vh] overflow-y-auto`}>
            <DialogHeader>
              <DialogTitle className={cardStyle.text}>Edit Poll</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Same form fields as add dialog */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={cardStyle.text}>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`mt-1 ${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}
                  />
                </div>
                <div>
                  <Label className={cardStyle.text}>Date *</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`mt-1 ${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}
                  />
                </div>
              </div>

              <div>
                <Label className={cardStyle.text}>Question *</Label>
                <Textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className={`mt-1 ${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={cardStyle.text}>Asked By</Label>
                  <Input
                    value={formData.asked_by}
                    onChange={(e) => setFormData({ ...formData, asked_by: e.target.value })}
                    className={`mt-1 ${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}
                  />
                </div>
                <div>
                  <Label className={cardStyle.text}>Total Responses</Label>
                  <Input
                    type="number"
                    value={formData.total_responses}
                    onChange={(e) => setFormData({ ...formData, total_responses: parseInt(e.target.value) || 0 })}
                    className={`mt-1 ${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={cardStyle.text}>Image URL</Label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className={`mt-1 ${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}
                  />
                </div>
                <div>
                  <Label className={cardStyle.text}>Display Order</Label>
                  <Input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className={`mt-1 ${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}
                  />
                </div>
              </div>

              <div>
                <Label className={cardStyle.text}>Fun Fact Title</Label>
                <Input
                  value={formData.fun_fact_title}
                  onChange={(e) => setFormData({ ...formData, fun_fact_title: e.target.value })}
                  className={`mt-1 ${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}
                />
              </div>

              <div>
                <Label className={cardStyle.text}>Fun Fact Content</Label>
                <Textarea
                  value={formData.fun_fact_content}
                  onChange={(e) => setFormData({ ...formData, fun_fact_content: e.target.value })}
                  className={`mt-1 ${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_ranking}
                    onChange={(e) => setFormData({ ...formData, is_ranking: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className={cardStyle.text}>Ranking Poll</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className={cardStyle.text}>Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className={cardStyle.text}>Featured</span>
                </label>
              </div>

              {error && (
                <div className={`p-4 ${cardStyle.bg} ${cardStyle.border} border rounded-lg`} style={{ borderColor: '#ef444440' }}>
                  <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => setIsEditDialogOpen(false)}
                  className={`${cardStyle.border} border ${cardStyle.text}`}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdate}
                  disabled={saving}
                  className={`${cardStyle.accent} text-black font-black`}
                  style={{ backgroundColor: cardStyle.accent }}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Options Dialog */}
        <Dialog open={isOptionsDialogOpen} onOpenChange={setIsOptionsDialogOpen}>
          <DialogContent className={`${cardStyle.bg} ${cardStyle.border} border max-w-4xl max-h-[90vh] overflow-y-auto`}>
            <DialogHeader>
              <DialogTitle className={cardStyle.text}>
                Manage Options: {currentPollForOptions?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newOptionName}
                  onChange={(e) => setNewOptionName(e.target.value)}
                  placeholder="Option name"
                  className={`flex-1 ${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addOption()
                    }
                  }}
                />
                <Input
                  type="number"
                  value={newOptionValue}
                  onChange={(e) => setNewOptionValue(e.target.value)}
                  placeholder={currentPollForOptions?.is_ranking ? "Rank" : "Count"}
                  className={`w-24 ${cardStyle.bg} ${cardStyle.border} border ${cardStyle.text}`}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addOption()
                    }
                  }}
                />
                <Button
                  onClick={addOption}
                  className={`${cardStyle.border} border ${cardStyle.text}`}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {pollOptions.map((option, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <span className={`flex-1 ${cardStyle.text}`}>{option.name}</span>
                    {currentPollForOptions?.is_ranking ? (
                      <span className={`text-sm ${cardStyle.text}/70`}>Rank: {option.rank || index + 1}</span>
                    ) : (
                      <span className={`text-sm ${cardStyle.text}/70`}>Count: {option.count || 0}</span>
                    )}
                    <Button
                      onClick={() => removeOption(index)}
                      className={`${cardStyle.border} border ${cardStyle.text}/20 h-8 px-2`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>

              {error && (
                <div className={`p-4 ${cardStyle.bg} ${cardStyle.border} border rounded-lg`} style={{ borderColor: '#ef444440' }}>
                  <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => setIsOptionsDialogOpen(false)}
                  className={`${cardStyle.border} border ${cardStyle.text}`}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveOptions}
                  disabled={saving}
                  className={`${cardStyle.accent} text-black font-black`}
                  style={{ backgroundColor: cardStyle.accent }}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Options
                    </>
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

