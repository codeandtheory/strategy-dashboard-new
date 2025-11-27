'use client'

import { Lock, TrendingUp, Zap } from 'lucide-react'
import { useMode } from '@/contexts/mode-context'

interface ChartData {
  type: 'binge-shows' | 'bar' | 'horizontal-bar' | 'circular'
  data: Array<{
    name: string
    [key: string]: string | number // Allow additional metrics
  }>
  metrics?: Array<{
    key: string
    label: string
    icon?: 'lock' | 'trending' | 'zap' | string
    format?: 'number' | 'percentage' | 'decimal'
  }>
  accentColor?: string
}

interface PollChartProps {
  chartData: ChartData
  className?: string
}

export function PollChart({ chartData, className = '' }: PollChartProps) {
  const { mode } = useMode()
  
  const getRedSystemColors = () => ({
    primary: '#FF4C4C',
    secondary: '#C41E3A',
    lightest: '#FFD4C4',
  })
  
  const redSystem = getRedSystemColors()
  const accentColor = chartData.accentColor || redSystem.primary
  
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
  
  const getBgColor = () => {
    switch (mode) {
      case 'chaos': return '#1A1A1A'
      case 'chill': return '#F5E6D3'
      case 'code': return '#000000'
      default: return '#1A1A1A'
    }
  }
  
  // Binge Shows Style Chart (like TV shows)
  if (chartData.type === 'binge-shows') {
    const metrics = chartData.metrics || [
      { key: Object.keys(chartData.data[0] || {})[1] || 'value1', label: 'Metric 1', format: 'number' },
      { key: Object.keys(chartData.data[0] || {})[2] || 'value2', label: 'Metric 2', format: 'number' },
    ]
    
    // Calculate max values for each metric
    const maxValues: Record<string, number> = {}
    metrics.forEach(metric => {
      maxValues[metric.key] = Math.max(...chartData.data.map(item => Number(item[metric.key]) || 0))
    })
    
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Header Stats */}
        {metrics.length > 0 && (
          <div className={`grid grid-cols-${Math.min(metrics.length, 3)} gap-4 mb-8`}>
            {metrics.slice(0, 3).map((metric, idx) => {
              const maxValue = maxValues[metric.key]
              const IconComponent = metric.icon === 'lock' ? Lock : 
                                   metric.icon === 'trending' ? TrendingUp : 
                                   metric.icon === 'zap' ? Zap : null
              
              return (
                <div 
                  key={metric.key}
                  className={`${getRoundedClass('rounded-2xl')} p-4 text-center`}
                  style={{
                    backgroundColor: mode === 'chaos' 
                      ? `${accentColor}1A` 
                      : mode === 'chill'
                      ? `${accentColor}26`
                      : `${accentColor}1A`,
                    border: `1px solid ${accentColor}40`
                  }}
                >
                  {IconComponent && (
                    <IconComponent className="w-6 h-6 mx-auto mb-2" style={{ color: accentColor }} />
                  )}
                  <p className={`text-xs uppercase tracking-wider ${getTextClass()} opacity-70 mb-1`}>
                    {metric.label}
                  </p>
                  <p className={`text-2xl font-black ${getTextClass()}`} style={{ color: accentColor }}>
                    {metric.format === 'percentage' 
                      ? `${maxValue}%`
                      : metric.format === 'decimal'
                      ? maxValue.toFixed(2)
                      : maxValue}
                  </p>
                  <p className={`text-xs ${getTextClass()} opacity-60`}>
                    {metric.format === 'percentage' ? 'max' : metric.format === 'decimal' ? 'per unit (max)' : 'max'}
                  </p>
                </div>
              )
            })}
          </div>
        )}
        
        {/* Item Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chartData.data.map((item, index) => {
            const isTopItem = index === 0
            
            return (
              <div 
                key={item.name}
                className={`${getRoundedClass('rounded-2xl')} p-6 relative overflow-hidden`}
                style={{
                  backgroundColor: mode === 'chaos' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : mode === 'chill'
                    ? 'rgba(74, 24, 24, 0.05)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `2px solid ${isTopItem ? accentColor : `${accentColor}33`}`
                }}
              >
                {/* Item Name */}
                <h4 className={`text-xl font-black mb-4 ${getTextClass()}`} style={{ 
                  color: isTopItem ? accentColor : undefined 
                }}>
                  {item.name}
                </h4>
                
                {/* Metrics */}
                {metrics.map((metric, metricIdx) => {
                  const value = Number(item[metric.key]) || 0
                  const maxValue = maxValues[metric.key]
                  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0
                  const isTopMetric = value === maxValue
                  const IconComponent = metric.icon === 'lock' ? Lock : 
                                       metric.icon === 'trending' ? TrendingUp : 
                                       metric.icon === 'zap' ? Zap : null
                  
                  return (
                    <div key={metric.key} className={metricIdx < metrics.length - 1 ? 'mb-4' : ''}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {IconComponent && (
                            <IconComponent className="w-4 h-4" style={{ color: accentColor }} />
                          )}
                          <span className={`text-sm font-semibold ${getTextClass()}`}>
                            {metric.label}
                          </span>
                        </div>
                        <span className={`text-lg font-black ${getTextClass()}`} style={{ 
                          color: isTopMetric ? accentColor : undefined 
                        }}>
                          {metric.format === 'percentage' 
                            ? `${value}%`
                            : metric.format === 'decimal'
                            ? value.toFixed(2)
                            : value}
                        </span>
                      </div>
                      <div 
                        className={`${getRoundedClass('rounded-full')} h-3 overflow-hidden relative`}
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
                            backgroundColor: isTopMetric 
                              ? accentColor
                              : `${accentColor}80`
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  
  // Horizontal Bar Chart
  if (chartData.type === 'horizontal-bar' || chartData.type === 'bar') {
    const dataKey = chartData.metrics?.[0]?.key || 'value'
    const maxValue = Math.max(...chartData.data.map(item => Number(item[dataKey]) || 0))
    
    return (
      <div className={`space-y-3 ${className}`}>
        {chartData.data.map((item, index) => {
          const value = Number(item[dataKey]) || 0
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0
          const isTop = index === 0
          
          return (
            <div key={item.name} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className={`text-base font-semibold ${getTextClass()}`}>
                  {item.name}
                </span>
                <span 
                  className={`text-base font-black ${getTextClass()}`}
                  style={{ color: isTop ? accentColor : undefined }}
                >
                  {value}
                </span>
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
                    backgroundColor: isTop 
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
  
  return null
}

