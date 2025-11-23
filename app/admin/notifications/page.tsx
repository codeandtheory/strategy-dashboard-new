'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useMode } from '@/contexts/mode-context'
import { Bell, Plus } from 'lucide-react'

export default function NotificationsPage() {
  const { mode } = useMode()

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

  const getBorderClass = () => {
    switch (mode) {
      case 'chaos': return 'border-[#333333]'
      case 'chill': return 'border-[#8B4444]/30'
      case 'code': return 'border-[#FFFFFF]/30'
      default: return 'border-[#333333]'
    }
  }

  const getRoundedClass = (base: string) => {
    if (mode === 'chaos') return base.replace('rounded', 'rounded-[1.5rem]')
    if (mode === 'chill') return base.replace('rounded', 'rounded-2xl')
    return base
  }

  return (
    <div className={`${getBgClass()} ${mode === 'code' ? 'font-mono' : 'font-[family-name:var(--font-raleway)]'}`}>
      <div className="mb-8">
        <h1 className={`text-4xl font-black uppercase ${getTextClass()} mb-2`}>Push Notifications</h1>
        <p className={`${getTextClass()}/70 font-normal`}>Send important announcements and updates to the team.</p>
      </div>

      <Card className={`${getBgClass()} border ${getBorderClass()} p-6 ${getRoundedClass('rounded-xl')}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell className={`w-6 h-6 ${getTextClass()}`} />
            <h2 className={`text-2xl font-black uppercase ${getTextClass()}`}>Notification Center</h2>
          </div>
          <Button
            className={`${getRoundedClass('rounded-lg')} ${
              mode === 'chaos' ? 'bg-[#C4F500] text-black hover:bg-[#C4F500]/80' :
              mode === 'chill' ? 'bg-[#FFC043] text-[#4A1818] hover:bg-[#FFC043]/80' :
              'bg-[#FFFFFF] text-black hover:bg-[#FFFFFF]/80'
            } font-black uppercase tracking-wider ${mode === 'code' ? 'font-mono' : ''}`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Send Notification
          </Button>
        </div>

        <div className={`text-center py-12 ${getTextClass()}/70`}>
          <p className="text-lg">Push notification management coming soon.</p>
        </div>
      </Card>
    </div>
  )
}

