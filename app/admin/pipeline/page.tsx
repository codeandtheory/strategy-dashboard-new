'use client'

import { Card } from '@/components/ui/card'
import { useMode } from '@/contexts/mode-context'

export default function PipelinePage() {
  const { mode } = useMode()

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={`text-3xl font-bold ${getTextClass()}`}>
          Pipeline
        </h1>
      </div>

      <Card className={`p-6 ${getCardStyle()}`}>
        <div className="space-y-4">
          <h2 className={`text-xl font-semibold ${getTextClass()}`}>
            New Business Pipeline
          </h2>
          <p className="text-muted-foreground">
            Pipeline management functionality coming soon.
          </p>
        </div>
      </Card>
    </div>
  )
}

