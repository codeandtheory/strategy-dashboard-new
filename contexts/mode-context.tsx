'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Mode = 'chaos' | 'chill' | 'code'

interface ModeContextType {
  mode: Mode
  setMode: (mode: Mode) => void
  toggleMode: () => void
  cycleMode: () => void
}

const ModeContext = createContext<ModeContextType | undefined>(undefined)

const MODE_ORDER: Mode[] = ['chaos', 'chill', 'code']

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>('chaos')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load from localStorage
    const savedMode = localStorage.getItem('dashboard-mode') as Mode | null
    if (savedMode && MODE_ORDER.includes(savedMode)) {
      setModeState(savedMode)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      // Apply mode to document
      document.documentElement.setAttribute('data-mode', mode)
      // Save to localStorage
      localStorage.setItem('dashboard-mode', mode)
    }
  }, [mode, mounted])

  const setMode = (newMode: Mode) => {
    setModeState(newMode)
  }

  const toggleMode = () => {
    // Toggle between chaos and chill (original behavior)
    setModeState(prev => prev === 'chaos' ? 'chill' : 'chaos')
  }

  const cycleMode = () => {
    // Cycle through all modes
    const currentIndex = MODE_ORDER.indexOf(mode)
    const nextIndex = (currentIndex + 1) % MODE_ORDER.length
    setModeState(MODE_ORDER[nextIndex])
  }

  // Always provide the context, even before mounted, to prevent runtime errors
  return (
    <ModeContext.Provider value={{ mode, setMode, toggleMode, cycleMode }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  const context = useContext(ModeContext)
  if (context === undefined) {
    // During SSR or if provider isn't available, return default values
    // This prevents build errors while still allowing the component to render
    if (typeof window === 'undefined') {
      return {
        mode: 'chaos' as Mode,
        setMode: () => {},
        toggleMode: () => {},
        cycleMode: () => {},
      }
    }
    throw new Error('useMode must be used within a ModeProvider')
  }
  return context
}

