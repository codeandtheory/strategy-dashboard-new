'use client'

import { Card } from '@/components/ui/card'
import { useMode } from '@/contexts/mode-context'
import { TrendingUp, Users, FileText, Music } from 'lucide-react'

export default function StatsAdmin() {
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

  return (
    <div className={`${getBgClass()} ${getTextClass()} ${mode === 'code' ? 'font-mono' : 'font-[family-name:var(--font-raleway)]'} min-h-screen p-6`}>
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-4">
          <h1 className={`text-2xl font-black uppercase tracking-wider ${getTextClass()} mb-1`}>Stats & Metrics</h1>
          <p className={`${getTextClass()}/70 text-sm font-normal`}>View dashboard statistics and analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className={`${cardStyle.bg} ${cardStyle.border} border p-6 ${getRoundedClass('rounded-xl')}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${cardStyle.text}/70`}>Total Playlists</p>
                <p className={`text-3xl font-bold ${cardStyle.text} mt-2`}>1</p>
              </div>
              <Music className="w-8 h-8" style={{ color: cardStyle.accent }} />
            </div>
          </Card>

          <Card className={`${cardStyle.bg} ${cardStyle.border} border p-6 ${getRoundedClass('rounded-xl')}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${cardStyle.text}/70`}>Content Cards</p>
                <p className={`text-3xl font-bold ${cardStyle.text} mt-2`}>6+</p>
              </div>
              <FileText className="w-8 h-8" style={{ color: cardStyle.accent }} />
            </div>
          </Card>

          <Card className={`${cardStyle.bg} ${cardStyle.border} border p-6 ${getRoundedClass('rounded-xl')}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${cardStyle.text}/70`}>Active Users</p>
                <p className={`text-3xl font-bold ${cardStyle.text} mt-2`}>-</p>
              </div>
              <Users className="w-8 h-8" style={{ color: cardStyle.accent }} />
            </div>
          </Card>

          <Card className={`${cardStyle.bg} ${cardStyle.border} border p-6 ${getRoundedClass('rounded-xl')}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${cardStyle.text}/70`}>Growth</p>
                <p className={`text-3xl font-bold ${cardStyle.text} mt-2`}>+15%</p>
              </div>
              <TrendingUp className="w-8 h-8" style={{ color: cardStyle.accent }} />
            </div>
          </Card>
        </div>

        <Card className={`${cardStyle.bg} ${cardStyle.border} border p-6 mt-6 ${getRoundedClass('rounded-xl')}`}>
          <h2 className={`text-xl font-semibold ${cardStyle.text} mb-4`}>Analytics Dashboard</h2>
          <p className={`${cardStyle.text}/70`}>Detailed analytics and reporting coming soon...</p>
        </Card>
      </div>
    </div>
  )
}

