'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { UserPermissions, getPermissions, PermissionConfig } from '@/lib/permissions'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './auth-context'

interface PermissionsContextType {
  user: UserPermissions | null
  permissions: PermissionConfig | null
  setUser: (user: UserPermissions | null) => void
  isLoading: boolean
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined)

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const { user: authUser } = useAuth()
  const [user, setUser] = useState<UserPermissions | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  // Load user permissions from Supabase
  useEffect(() => {
    async function loadUserPermissions() {
      if (!authUser) {
        setUser(null)
        setIsLoading(false)
        return
      }

      try {
        // Fetch user profile with role and special access
        // TODO: Create a profiles table with base_role and special_access columns
        // For now, we'll check if a profile exists, otherwise default to 'user'
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('base_role, special_access')
          .eq('id', authUser.id)
          .single()

        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "not found" - that's okay, we'll use defaults
          console.error('Error fetching user profile:', error)
        }

        const userPermissions: UserPermissions = {
          baseRole: (profile?.base_role as any) || 'user',
          specialAccess: (profile?.special_access as any[]) || [],
        }

        setUser(userPermissions)
      } catch (error) {
        console.error('Failed to load user permissions:', error)
        // Default to user role if there's an error
        setUser({
          baseRole: 'user',
          specialAccess: [],
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUserPermissions()
  }, [authUser, supabase])

  const permissions = user ? getPermissions(user) : null

  return (
    <PermissionsContext.Provider
      value={{
        user,
        permissions,
        setUser,
        isLoading,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  )
}

export function usePermissions() {
  const context = useContext(PermissionsContext)
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider')
  }
  return context
}
