'use client'

import { useMode } from '@/contexts/mode-context'
import { PollChart } from '@/components/poll-chart'

/**
 * Flexible Chart Renderer Module
 * 
 * This component can render different chart types dynamically based on configuration.
 * Supports multiple charts in a single render.
 * 
 * Chart Configuration Format:
 * {
 *   charts: [
 *     {
 *       type: 'binge-shows' | 'horizontal-bar' | 'bar' | 'text' | 'image',
 *       data: {...},
 *       ...other config
 *     }
 *   ]
 * }
 * 
 * Or a single chart:
 * {
 *   type: 'binge-shows',
 *   data: {...}
 * }
 */

interface ChartConfig {
  type: 'binge-shows' | 'horizontal-bar' | 'bar' | 'text' | 'image' | 'ranking'
  data?: any
  metrics?: any[]
  accentColor?: string
  title?: string
  imageUrl?: string
  text?: string | string[]
  rankingData?: Array<{ name: string; rank: number }>
  [key: string]: any // Allow additional properties for future chart types
}

interface ChartRendererProps {
  config: ChartConfig | { charts: ChartConfig[] } | ChartConfig[]
  className?: string
}

export function ChartRenderer({ config, className = '' }: ChartRendererProps) {
  const { mode } = useMode()
  
  const getTextClass = () => {
    switch (mode) {
      case 'chaos': return 'text-white'
      case 'chill': return 'text-[#4A1818]'
      case 'code': return 'text-[#FFFFFF]'
      default: return 'text-white'
    }
  }
  
  const getRoundedClass = (base: string) => {
    if (mode === 'chaos') return base.replace('rounded', 'rounded-[1.5rem]')
    if (mode === 'chill') return base.replace('rounded', 'rounded-2xl')
    return base
  }
  
  // Normalize config to array of charts
  let charts: ChartConfig[] = []
  
  if (Array.isArray(config)) {
    charts = config
  } else if (config.charts && Array.isArray(config.charts)) {
    charts = config.charts
  } else {
    charts = [config as ChartConfig]
  }
  
  return (
    <div className={`space-y-6 ${className}`}>
      {charts.map((chart, index) => {
        // Ranking Chart (from poll options)
        if (chart.type === 'ranking' && chart.rankingData) {
          const rankingData = chart.rankingData.sort((a, b) => a.rank - b.rank)
          const accentColor = chart.accentColor || '#FF4C4C'
          
          return (
            <div key={index} className="space-y-3">
              {chart.title && (
                <h4 className={`text-xl font-black mb-4 ${getTextClass()}`}>
                  {chart.title}
                </h4>
              )}
              {rankingData.map((item, idx) => {
                const percentage = ((rankingData.length - item.rank + 1) / rankingData.length) * 100
                const isTopVoted = item.rank <= 5
                
                return (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span 
                          className={`text-lg font-black ${getTextClass()}`}
                          style={{ color: isTopVoted ? accentColor : undefined, minWidth: '2rem' }}
                        >
                          {item.rank}.
                        </span>
                        <span className={`text-base font-semibold ${getTextClass()}`}>
                          {item.name}
                        </span>
                      </div>
                    </div>
                    <div 
                      className={`${getRoundedClass('rounded-full')} h-4 overflow-hidden`}
                      style={{
                        backgroundColor: mode === 'chaos' 
                          ? 'rgba(255, 255, 255, 0.1)' 
                          : mode === 'chill'
                          ? 'rgba(74, 24, 24, 0.1)'
                          : 'rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <div
                        className="h-full transition-all duration-1000"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: isTopVoted 
                            ? accentColor
                            : `${accentColor}66`
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )
        }
        
        // Text Chart
        if (chart.type === 'text') {
          const items = Array.isArray(chart.text) ? chart.text : chart.text ? [chart.text] : []
          
          return (
            <div key={index}>
              {chart.title && (
                <h4 className={`text-xl font-black mb-3 ${getTextClass()}`}>
                  {chart.title}
                </h4>
              )}
              <ul className={`space-y-1 text-base ${getTextClass()} opacity-70`}>
                {items.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          )
        }
        
        // Image Chart
        if (chart.type === 'image' && chart.imageUrl) {
          return (
            <div key={index}>
              {chart.title && (
                <h4 className={`text-xl font-black mb-4 ${getTextClass()}`}>
                  {chart.title}
                </h4>
              )}
              <div className="flex justify-center">
                <img 
                  src={chart.imageUrl} 
                  alt={chart.title || 'Chart image'}
                  className="max-w-full h-auto"
                  style={{ maxHeight: '500px' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </div>
            </div>
          )
        }
        
        // Use PollChart for other chart types
        if (chart.type === 'binge-shows' || chart.type === 'horizontal-bar' || chart.type === 'bar') {
          return (
            <div key={index}>
              {chart.title && (
                <h4 className={`text-xl font-black mb-4 ${getTextClass()}`}>
                  {chart.title}
                </h4>
              )}
              <PollChart chartData={chart as any} />
            </div>
          )
        }
        
        return null
      })}
    </div>
  )
}

