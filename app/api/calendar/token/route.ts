import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

/**
 * GET /api/calendar/token
 * Gets the Google access token from the user's Supabase session
 * This uses the provider token that Supabase stores from the OAuth flow
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get the provider token from the session
    // Supabase stores provider tokens in session.provider_token
    const providerToken = (session as any).provider_token
    
    if (!providerToken) {
      // If no provider token, try to get it from the user's identity
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // Check if we can get the token from the user's app_metadata or user_metadata
      // Supabase might store it there
      const identities = user.identities || []
      const googleIdentity = identities.find((id: any) => id.provider === 'google')
      
      if (googleIdentity) {
        // The token might be in the identity, but Supabase doesn't expose it directly
        // We'll need to refresh the session or use a different approach
        return NextResponse.json(
          { 
            error: 'Provider token not available',
            hint: 'You may need to re-authenticate with calendar scopes'
          },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: 'Google token not found in session' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      accessToken: providerToken,
      expiresAt: session.expires_at,
    })
  } catch (error: any) {
    console.error('Error getting calendar token:', error)
    return NextResponse.json(
      {
        error: error.message || 'Failed to get calendar token',
      },
      { status: 500 }
    )
  }
}

