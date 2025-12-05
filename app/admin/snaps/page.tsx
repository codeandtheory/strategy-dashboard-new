'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useMode } from '@/contexts/mode-context'
import { useAuth } from '@/contexts/auth-context'
import { usePermissions } from '@/contexts/permissions-context'
import { AddSnapDialog } from '@/components/add-snap-dialog'
import { Sparkles, Plus } from 'lucide-react'

export default function SnapsAdmin() {
  const { mode } = useMode()
  const { user } = useAuth()
  const { permissions } = usePermissions()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

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

  // Check if user is admin
  const isAdmin = permissions?.canManageUsers || user?.baseRole === 'admin'

  if (!isAdmin) {
    return (
      <div className={`${getBgClass()} ${getTextClass()} min-h-screen p-6 flex items-center justify-center`}>
        <p>You do not have permission to access this page.</p>
      </div>
    )
  }

  const handleSnapAdded = () => {
    setRefreshKey(prev => prev + 1)
    // You could also refresh a list of snaps here if needed
  }

  return (
    <div className={`${getBgClass()} ${getTextClass()} ${mode === 'code' ? 'font-mono' : 'font-[family-name:var(--font-raleway)]'} min-h-screen p-6`}>
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-black uppercase tracking-wider ${getTextClass()} mb-1`}>Manage Snaps</h1>
            <p className={`${getTextClass()}/70 text-sm font-normal`}>Create snaps on behalf of other users</p>
          </div>
          <Button
            onClick={() => setShowAddDialog(true)}
            className={`${getRoundedClass('rounded-lg')} ${
              mode === 'chaos' ? 'bg-[#C4F500] text-black hover:bg-[#C4F500]/80' :
              mode === 'chill' ? 'bg-[#FFC043] text-[#4A1818] hover:bg-[#FFC043]/80' :
              'bg-[#FFFFFF] text-black hover:bg-[#FFFFFF]/80'
            } font-black uppercase tracking-wider ${mode === 'code' ? 'font-mono' : ''}`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Snap
          </Button>
        </div>

        <Card className={`${cardStyle.bg} ${cardStyle.border} border p-6 ${getRoundedClass('rounded-xl')}`}>
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5" style={{ color: cardStyle.accent }} />
            <h2 className={`text-lg font-bold ${cardStyle.text}`}>Admin Snap Creation</h2>
          </div>
          <p className={`${cardStyle.text}/70 text-sm`}>
            Use the "Add Snap" button above to create snaps on behalf of any user. You'll be able to select who is giving the snap and who it's for.
          </p>
        </Card>

        <AddSnapDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSuccess={handleSnapAdded}
          adminMode={true}
        />
      </div>
    </div>
  )
}

