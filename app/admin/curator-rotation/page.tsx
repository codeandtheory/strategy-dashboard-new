'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useMode } from '@/contexts/mode-context'
import { RotateCw, Plus } from 'lucide-react'

export default function CuratorRotationPage() {
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
          <h1 className={`text-2xl font-black uppercase tracking-wider ${getTextClass()} mb-1`}>Curator Rotation</h1>
          <p className={`${getTextClass()}/70 text-sm font-normal`}>Manage weekly curator responsibilities and rotation schedule.</p>
        </div>

      <Card className={`${cardStyle.bg} ${cardStyle.border} border p-6 ${getRoundedClass('rounded-xl')}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <RotateCw className={`w-6 h-6 ${getTextClass()}`} />
            <h2 className={`text-2xl font-black uppercase ${getTextClass()}`}>Curator Schedule</h2>
          </div>
          <Button
            className={`${getRoundedClass('rounded-lg')} ${
              mode === 'chaos' ? 'bg-[#C4F500] text-black hover:bg-[#C4F500]/80' :
              mode === 'chill' ? 'bg-[#FFC043] text-[#4A1818] hover:bg-[#FFC043]/80' :
              'bg-[#FFFFFF] text-black hover:bg-[#FFFFFF]/80'
            } font-black uppercase tracking-wider ${mode === 'code' ? 'font-mono' : ''}`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Assign Curator
          </Button>
        </div>

        <div className={`text-center py-12 ${cardStyle.text}/70`}>
          <p className="text-lg">Curator rotation management coming soon.</p>
        </div>
      </Card>
      </div>
    </div>
  )
}

