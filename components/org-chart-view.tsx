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
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null)

  const orgTree = buildOrgChartTree(profiles)
  
  // Group profiles by discipline for macro view
  const byDiscipline: Record<string, any[]> = {}
  profiles.forEach(profile => {
    const discipline = profile.discipline || 'Other'
    if (!byDiscipline[discipline]) {
      byDiscipline[discipline] = []
    }
    byDiscipline[discipline].push(profile)
  })
  
  // Get discipline stats
  const disciplineStats = Object.entries(byDiscipline).map(([discipline, disciplineProfiles]) => {
    const orgTreeForDiscipline = buildOrgChartTree(disciplineProfiles)
    const topLevelCount = orgTreeForDiscipline.length
    return {
      discipline,
      totalCount: disciplineProfiles.length,
      topLevelCount,
      profiles: disciplineProfiles,
      orgTree: orgTreeForDiscipline
    }
  })

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

  // If a discipline is selected, show detailed view for that discipline
  if (selectedDiscipline) {
    const disciplineData = disciplineStats.find(s => s.discipline === selectedDiscipline)
    if (!disciplineData) {
      setSelectedDiscipline(null)
      return null
    }

    return (
      <div className="space-y-4">
        {/* Back button */}
        <button
          onClick={() => setSelectedDiscipline(null)}
          className="flex items-center gap-2 mb-4 text-sm hover:opacity-70 transition-opacity"
          style={{ color: getTextColor() }}
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span>Back to All Disciplines</span>
        </button>

        {/* Discipline header */}
        <div className="mb-4">
          <h3 
            className={`text-lg font-black mb-2 ${mode === 'code' ? 'font-mono' : ''}`}
            style={{ color: getTextColor() }}
          >
            {selectedDiscipline}
          </h3>
          <p 
            className="text-sm"
            style={{ 
              color: mode === 'chill' ? '#4A1818' : '#FFFFFF',
              opacity: 0.7 
            }}
          >
            {disciplineData.totalCount} {disciplineData.totalCount === 1 ? 'person' : 'people'} • {disciplineData.topLevelCount} top-level {disciplineData.topLevelCount === 1 ? 'position' : 'positions'}
          </p>
        </div>

        {/* Detailed org chart for this discipline */}
        <div className="space-y-1">
          {disciplineData.orgTree.length > 0 ? (
            disciplineData.orgTree.map(node => renderNode(node))
          ) : (
            <p 
              className="text-sm py-4"
              style={{ 
                color: mode === 'chill' ? '#4A1818' : '#FFFFFF',
                opacity: 0.6 
              }}
            >
              No manager relationships set for this discipline. People are shown at the same level.
            </p>
          )}
        </div>
      </div>
    )
  }

  // Macro view: Show all disciplines
  return (
    <div className="space-y-6">
      <p 
        className="text-sm mb-4"
        style={{ 
          color: mode === 'chill' ? '#4A1818' : '#FFFFFF',
          opacity: 0.7 
        }}
      >
        Click on a discipline to view its detailed org chart
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {disciplineStats.map(({ discipline, totalCount, topLevelCount, orgTree }) => (
          <button
            key={discipline}
            onClick={() => setSelectedDiscipline(discipline)}
            className={`p-4 ${getRoundedClass('rounded-xl')} border hover:opacity-80 transition-all text-left`}
            style={{
              backgroundColor: mode === 'chaos' 
                ? '#00C89610' 
                : mode === 'chill' 
                ? '#C8D96120' 
                : 'rgba(255,255,255,0.05)',
              borderColor: mode === 'chaos' 
                ? greenColors.primary + '30' 
                : mode === 'chill' 
                ? greenColors.complementary + '30' 
                : 'rgba(255,255,255,0.2)',
              borderWidth: '1px'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 
                className={`font-black text-base ${mode === 'code' ? 'font-mono' : ''}`}
                style={{ color: getTextColor() }}
              >
                {discipline}
              </h3>
              <ChevronRight 
                className="w-5 h-5 flex-shrink-0" 
                style={{ 
                  color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF',
                  opacity: 0.7 
                }} 
              />
            </div>
            
            <div className="space-y-1">
              <p 
                className="text-sm"
                style={{ 
                  color: mode === 'chill' ? '#4A1818' : '#FFFFFF',
                  opacity: 0.8 
                }}
              >
                {totalCount} {totalCount === 1 ? 'person' : 'people'}
              </p>
              <p 
                className="text-xs"
                style={{ 
                  color: mode === 'chill' ? '#4A1818' : '#FFFFFF',
                  opacity: 0.6 
                }}
              >
                {topLevelCount} top-level {topLevelCount === 1 ? 'position' : 'positions'}
              </p>
            </div>

            {/* Show top-level people preview */}
            {orgTree.length > 0 && orgTree.length <= 3 && (
              <div className="mt-3 pt-3 border-t" style={{ borderColor: mode === 'chaos' ? greenColors.primary + '20' : mode === 'chill' ? greenColors.complementary + '20' : 'rgba(255,255,255,0.1)' }}>
                <p 
                  className="text-xs mb-2"
                  style={{ 
                    color: mode === 'chill' ? '#4A1818' : '#FFFFFF',
                    opacity: 0.6 
                  }}
                >
                  Top Level:
                </p>
                <div className="flex flex-wrap gap-2">
                  {orgTree.slice(0, 3).map(node => (
                    <div
                      key={node.id}
                      className="flex items-center gap-1.5 px-2 py-1 rounded"
                      style={{
                        backgroundColor: mode === 'chaos' 
                          ? greenColors.primary + '20' 
                          : mode === 'chill' 
                          ? greenColors.complementary + '20' 
                          : 'rgba(255,255,255,0.1)'
                      }}
                    >
                      {node.profile.avatar_url ? (
                        <img
                          src={node.profile.avatar_url}
                          alt={node.profile.full_name || 'User'}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <div 
                          className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ 
                            backgroundColor: (mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF') + '33' 
                          }}
                        >
                          <Users className="w-3 h-3" style={{ color: mode === 'chaos' ? greenColors.primary : mode === 'chill' ? greenColors.complementary : '#FFFFFF' }} />
                        </div>
                      )}
                      <span 
                        className="text-xs truncate max-w-[100px]"
                        style={{ color: getTextColor() }}
                      >
                        {node.profile.full_name || node.profile.email || 'Unknown'}
                      </span>
                    </div>
                  ))}
                  {orgTree.length > 3 && (
                    <span 
                      className="text-xs px-2 py-1"
                      style={{ 
                        color: mode === 'chill' ? '#4A1818' : '#FFFFFF',
                        opacity: 0.6 
                      }}
                    >
                      +{orgTree.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
      
      {disciplineStats.length === 0 && (
        <p 
          className="text-sm text-center py-8"
          style={{ 
            color: mode === 'chill' ? '#4A1818' : '#FFFFFF',
            opacity: 0.6 
          }}
        >
          No team members found
        </p>
      )}
    </div>
  )
}

