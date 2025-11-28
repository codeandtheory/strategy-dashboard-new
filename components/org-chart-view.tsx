'use client'

import { buildOrgChartTree, type OrgChartNode } from '@/lib/org-chart'
import { Users, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface OrgChartViewProps {
  profiles: any[]
  mode: 'chaos' | 'chill' | 'code'
  onProfileClick: (profileId: string) => void
  getRoundedClass: (defaultClass: string) => string
  getTextColor: () => string
  greenColors: {
    primary: string
    complementary: string
  }
}

export function OrgChartView({ 
  profiles, 
  mode, 
  onProfileClick, 
  getRoundedClass,
  getTextColor,
  greenColors 
}: OrgChartViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  const [collapsedDisciplines, setCollapsedDisciplines] = useState<Set<string>>(new Set())

  const orgTree = buildOrgChartTree(profiles)

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const toggleDiscipline = (discipline: string) => {
    const newCollapsed = new Set(collapsedDisciplines)
    if (newCollapsed.has(discipline)) {
      newCollapsed.delete(discipline)
    } else {
      newCollapsed.add(discipline)
    }
    setCollapsedDisciplines(newCollapsed)
  }

  // Group root nodes by discipline for better organization
  const byDiscipline: Record<string, OrgChartNode[]> = {}
  orgTree.forEach(node => {
    const discipline = node.profile.discipline || 'Other'
    if (!byDiscipline[discipline]) {
      byDiscipline[discipline] = []
    }
    byDiscipline[discipline].push(node)
  })

  const renderNode = (node: OrgChartNode, depth: number = 0) => {
    const isExpanded = expandedNodes.has(node.id)
    const hasChildren = node.children.length > 0
    const indent = depth * 24

    return (
      <div key={node.id} className="mb-2">
        <div 
          className="flex items-center gap-2 py-2 px-3 rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
          style={{ 
            marginLeft: `${indent}px`,
            backgroundColor: mode === 'chaos' 
              ? '#00C89610' 
              : mode === 'chill' 
              ? '#C8D96120' 
              : 'rgba(255,255,255,0.05)'
          }}
          onClick={() => onProfileClick(node.id)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleNode(node.id)
              }}
              className="p-0.5 hover:opacity-70"
              style={{ color: getTextColor() }}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-5" />}
          
          {node.profile.avatar_url ? (
            <img
              src={node.profile.avatar_url}
              alt={node.profile.full_name || 'User'}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: (mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF') + '33' 
              }}
            >
              <Users className="w-4 h-4" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <p 
              className={`font-semibold text-sm truncate ${mode === 'code' ? 'font-mono' : ''}`}
              style={{ color: getTextColor() }}
            >
              {node.profile.full_name || node.profile.email || 'Unknown'}
            </p>
            {node.profile.role && (
              <p 
                className="text-xs truncate"
                style={{ 
                  color: mode === 'chill' ? '#4A1818' : '#FFFFFF',
                  opacity: 0.7 
                }}
              >
                {node.profile.role}
              </p>
            )}
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-6 border-l-2 pl-2" style={{ borderColor: mode === 'chaos' ? greenColors.primary + '40' : mode === 'chill' ? greenColors.complementary + '40' : 'rgba(255,255,255,0.2)' }}>
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(byDiscipline).map(([discipline, nodes]) => {
        const isCollapsed = collapsedDisciplines.has(discipline)
        
        return (
          <div key={discipline}>
            <button
              onClick={() => toggleDiscipline(discipline)}
              className="flex items-center gap-2 mb-3 w-full text-left"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" style={{ color: getTextColor() }} />
              ) : (
                <ChevronDown className="w-4 h-4" style={{ color: getTextColor() }} />
              )}
              <h3 
                className={`font-black text-sm ${mode === 'code' ? 'font-mono' : ''}`}
                style={{ color: getTextColor() }}
              >
                {discipline}
              </h3>
              <span 
                className="text-xs"
                style={{ 
                  color: mode === 'chill' ? '#4A1818' : '#FFFFFF',
                  opacity: 0.6 
                }}
              >
                ({nodes.length} {nodes.length === 1 ? 'person' : 'people'})
              </span>
            </button>
            
            {!isCollapsed && (
              <div className="space-y-1">
                {nodes.map(node => renderNode(node))}
              </div>
            )}
          </div>
        )
      })}
      
      {orgTree.length === 0 && (
        <p 
          className="text-sm text-center py-8"
          style={{ 
            color: mode === 'chill' ? '#4A1818' : '#FFFFFF',
            opacity: 0.6 
          }}
        >
          No org chart data available. Set manager relationships in profiles to build the org chart.
        </p>
      )}
    </div>
  )
}

