'use client'

import { useMode } from '@/contexts/mode-context'
import { Button } from '@/components/ui/button'
import { Zap, Sparkles, Moon, Sun } from 'lucide-react'

export function ModeSwitcher() {
  const { mode, cycleMode } = useMode()

  const getModeIcon = () => {
    switch (mode) {
      case 'chaos':
        return <Zap className="w-4 h-4" />
      case 'chill':
        return <Sparkles className="w-4 h-4" />
      case 'code':
        return <Moon className="w-4 h-4" />
      default:
        return <Zap className="w-4 h-4" />
    }
  }

  const getModeLabel = () => {
    switch (mode) {
      case 'chaos':
        return 'CHAOS'
      case 'chill':
        return 'CHILL'
      case 'code':
        return 'CODE'
      default:
        return 'CHAOS'
    }
  }

  return (
    <Button
      onClick={cycleMode}
      variant="ghost"
      className="relative flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700/50 hover:border-zinc-600 transition-all mode-switcher"
      aria-label={`Switch mode (currently ${mode})`}
    >
      {getModeIcon()}
      <span className="text-xs font-bold">{getModeLabel()}</span>
    </Button>
  )
}

