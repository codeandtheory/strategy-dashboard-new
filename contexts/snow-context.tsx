'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SnowContextType {
  snowEnabled: boolean
  toggleSnow: () => void
}

const SnowContext = createContext<SnowContextType | undefined>(undefined)

export function SnowProvider({ children }: { children: ReactNode }) {
  const [snowEnabled, setSnowEnabled] = useState<boolean>(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load from localStorage, default to true (enabled)
    const savedSnow = localStorage.getItem('snow-enabled')
    if (savedSnow !== null) {
      setSnowEnabled(savedSnow === 'true')
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      // Save to localStorage
      localStorage.setItem('snow-enabled', snowEnabled.toString())
    }
  }, [snowEnabled, mounted])

  const toggleSnow = () => {
    setSnowEnabled(prev => !prev)
  }

  // Always provide the context, even before mounted, to prevent runtime errors
  return (
    <SnowContext.Provider value={{ snowEnabled, toggleSnow }}>
      {children}
    </SnowContext.Provider>
  )
}

export function useSnow() {
  const context = useContext(SnowContext)
  if (context === undefined) {
    // During SSR or if provider isn't available, return default values
    // This prevents build errors while still allowing the component to render
    if (typeof window === 'undefined') {
      return {
        snowEnabled: true,
        toggleSnow: () => {},
      }
    }
    throw new Error('useSnow must be used within a SnowProvider')
  }
  return context
}

