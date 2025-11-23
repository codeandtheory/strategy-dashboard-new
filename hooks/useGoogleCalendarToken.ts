import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * Hook to get a Google Calendar access token from Supabase session
 * Since users are already logged in with Google OAuth via Supabase,
 * we try to get the token from their session.
 * If not available, we fall back to service account authentication.
 */
export function useGoogleCalendarToken() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function getTokenFromSupabase() {
      try {
        // Check cached token first
        const cachedToken = localStorage.getItem('google_calendar_token')
        const tokenExpiry = localStorage.getItem('google_calendar_token_expiry')
        
        if (cachedToken && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
          console.log('✅ Using cached Google Calendar token')
          setAccessToken(cachedToken)
          setLoading(false)
          return
        }

        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          console.log('No Supabase session found')
          setLoading(false)
          return
        }

        // Try to get token from Supabase session
        const providerToken = (session as any).provider_token
        
        if (providerToken) {
          console.log('✅ Using Google token from Supabase session')
          // Cache it
          const expiry = Date.now() + (55 * 60 * 1000)
          localStorage.setItem('google_calendar_token', providerToken)
          localStorage.setItem('google_calendar_token_expiry', expiry.toString())
          setAccessToken(providerToken)
          setLoading(false)
          return
        }
        
        // Try to get from API route (server-side check)
        const response = await fetch('/api/calendar/token')
        if (response.ok) {
          const data = await response.json()
          if (data.accessToken) {
            console.log('✅ Using Google token from API')
            const expiry = Date.now() + (55 * 60 * 1000)
            localStorage.setItem('google_calendar_token', data.accessToken)
            localStorage.setItem('google_calendar_token_expiry', expiry.toString())
            setAccessToken(data.accessToken)
            setLoading(false)
            return
          }
        }
        
        // No token available from Supabase
        // This is fine - we'll use service account fallback
        console.log('ℹ️ No Google token in Supabase session - will use service account fallback')
        setLoading(false)
      } catch (error: any) {
        console.log('Could not get token from Supabase:', error)
        setLoading(false)
        // Don't set error - we'll use service account fallback
      }
    }
    
    getTokenFromSupabase()
  }, [])

  return { accessToken, loading, error }
}

