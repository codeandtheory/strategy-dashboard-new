import { useEffect, useState, useCallback } from 'react'

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string
            scope: string
            callback: (response: { access_token: string; error?: string; error_description?: string }) => void
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void
          }
        }
      }
    }
  }
}

/**
 * Hook to get a Google Calendar access token using Google Identity Services
 * This uses the user's existing Google session to request calendar access
 */
export function useGoogleCalendarToken() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tokenClient, setTokenClient] = useState<any>(null)

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    
    if (!clientId) {
      setError('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set')
      setLoading(false)
      return
    }

    // Check if we have a cached token first
    const cachedToken = localStorage.getItem('google_calendar_token')
    const tokenExpiry = localStorage.getItem('google_calendar_token_expiry')
    
    if (cachedToken && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
      // Use cached token if it hasn't expired
      setAccessToken(cachedToken)
      setLoading(false)
      return
    }

    // Check if script is already loaded
    if (window.google?.accounts?.oauth2) {
      initializeTokenClient(clientId)
      return
    }

    // Load Google Identity Services script
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    
    script.onload = () => {
      if (!window.google?.accounts?.oauth2) {
        setError('Failed to load Google Identity Services')
        setLoading(false)
        return
      }
      initializeTokenClient(clientId)
    }

    script.onerror = () => {
      setError('Failed to load Google Identity Services script')
      setLoading(false)
    }

    document.head.appendChild(script)

    return () => {
      // Don't remove the script as it might be used elsewhere
    }
  }, [])

  const initializeTokenClient = useCallback((clientId: string) => {
    if (!window.google?.accounts?.oauth2) return

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
      callback: (response) => {
        if (response.error) {
          setError(response.error_description || response.error)
          setLoading(false)
          return
        }
        
        if (response.access_token) {
          // Cache the token (Google tokens typically expire in 1 hour)
          const expiry = Date.now() + (55 * 60 * 1000) // 55 minutes to be safe
          localStorage.setItem('google_calendar_token', response.access_token)
          localStorage.setItem('google_calendar_token_expiry', expiry.toString())
          setAccessToken(response.access_token)
          setLoading(false)
        }
      },
    })

    setTokenClient(client)
    
    // Request the token (this will show a consent dialog if needed)
    // Use 'consent' prompt to ensure we get a fresh token
    client.requestAccessToken({ prompt: '' })
  }, [])

  return { accessToken, loading, error, tokenClient }
}

