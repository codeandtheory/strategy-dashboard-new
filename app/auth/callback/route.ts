import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  const origin = requestUrl.origin

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorDescription || error)}`)
  }

  if (code) {
    try {
      // Create a response object for cookie handling
      const response = NextResponse.redirect(`${origin}/`)
      
      // Create Supabase client with proper cookie handling for route handlers
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll()
            },
            set(name: string, value: string, options: any) {
              // Set cookie on both request and response
              request.cookies.set({ name, value, ...options })
              response.cookies.set({ name, value, ...options })
            },
            remove(name: string, options: any) {
              // Remove cookie from both request and response
              request.cookies.set({ name, value: '', ...options })
              response.cookies.set({ name, value: '', ...options })
            },
          },
        }
      )

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError)
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(exchangeError.message)}`)
      }

      // Verify the session was created
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        console.error('Session not created after exchange:', sessionError)
        return NextResponse.redirect(`${origin}/login?error=Session not created`)
      }

      console.log('Successfully authenticated user:', session.user.email)

      // Successfully authenticated, redirect to home with cookies set
      return response
    } catch (error: any) {
      console.error('Error in auth callback:', error)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message || 'Authentication failed')}`)
    }
  }

  // No code provided, redirect to login
  return NextResponse.redirect(`${origin}/login?error=No authorization code provided`)
}

