import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string
            scope: string
            callback: (response: { access_token: string; expires_in: number }) => void
          }) => {
            requestAccessToken: () => void
          }
        }
      }
    }
  }
}

/**
 * Hook to get a Google Calendar access token
 * Uses Google Identity Services to request calendar permissions separately
 * since Supabase OAuth doesn't include calendar scopes
 */
export function useGoogleCalendarToken() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [needsAuth, setNeedsAuth] = useState(false)

  useEffect(() => {
    async function getToken() {
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

        // Check if user is authenticated with Supabase
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          console.log('No Supabase session found')
          setLoading(false)
          return
        }

        // Try Supabase provider token first (might work if scopes were requested)
        const providerToken = (session as any).provider_token
        if (providerToken) {
          // Test if this token works by trying to use it
          // For now, we'll try GSI anyway since Supabase tokens often don't have calendar scopes
          console.log('ℹ️ Found provider token in Supabase session, but will try GSI for calendar scopes')
        }

        // Check if we have Google Client ID
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
        if (!clientId) {
          console.log('ℹ️ NEXT_PUBLIC_GOOGLE_CLIENT_ID not set - will use service account fallback')
          setLoading(false)
          return
        }

        // Load Google Identity Services script if not already loaded
        if (!window.google) {
          await new Promise<void>((resolve, reject) => {
            if (window.google) {
              resolve()
              return
            }
            const script = document.createElement('script')
            script.src = 'https://accounts.google.com/gsi/client'
            script.async = true
            script.defer = true
            script.onload = () => resolve()
            script.onerror = () => reject(new Error('Failed to load Google Identity Services'))
            document.head.appendChild(script)
          })
        }

        // Wait a bit for GSI to initialize
        await new Promise(resolve => setTimeout(resolve, 100))

        if (!window.google?.accounts?.oauth2) {
          console.log('ℹ️ Google Identity Services not available - will use service account fallback')
          setLoading(false)
          return
        }

        // Request token using Google Identity Services
        let callbackFired = false
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'https://www.googleapis.com/auth/calendar.readonly',
          callback: (response) => {
            callbackFired = true
            if (response.access_token) {
              console.log('✅ Got Google Calendar token from GSI')
              // Cache the token (expires_in is in seconds)
              const expiry = Date.now() + (response.expires_in * 1000) - (5 * 60 * 1000) // 5 min buffer
              localStorage.setItem('google_calendar_token', response.access_token)
              localStorage.setItem('google_calendar_token_expiry', expiry.toString())
              setAccessToken(response.access_token)
              setNeedsAuth(false)
              setLoading(false)
            } else {
              console.error('No access token in GSI response:', response)
              setError('Failed to get calendar access token. User may have denied access.')
              setLoading(false)
            }
          },
        })

        // Request token (will show consent dialog if needed)
        // This is non-blocking - user can interact with the consent dialog
        tokenClient.requestAccessToken()
        setNeedsAuth(true) // We're requesting, so we might need user interaction
        
        // Set a timeout in case the callback never fires (e.g., popup blocked)
        setTimeout(() => {
          if (!callbackFired) {
            console.log('ℹ️ GSI token request timed out - will use service account fallback')
            setLoading(false)
            // Don't set error - allow fallback to service account
          }
        }, 30000) // 30 second timeout
      } catch (error: any) {
        console.log('Could not get token:', error)
        setError(error.message)
        setLoading(false)
      }
    }
    
    getToken()
  }, [])

  return { accessToken, loading, error, needsAuth }
}

