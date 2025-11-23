import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

// Initialize Google Calendar API
// Supports both OAuth2 (for shared calendars) and Service Account authentication
function getCalendarClient() {
  // Try OAuth2 first (better for shared calendars)
  const oauthClientId = process.env.GOOGLE_OAUTH_CLIENT_ID
  const oauthClientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
  const oauthRefreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN

  if (oauthClientId && oauthClientSecret && oauthRefreshToken) {
    console.log('Using OAuth2 authentication for Google Calendar')
    const oauth2Client = new google.auth.OAuth2(
      oauthClientId,
      oauthClientSecret
    )
    oauth2Client.setCredentials({
      refresh_token: oauthRefreshToken,
    })
    return google.calendar({ version: 'v3', auth: oauth2Client })
  }

  // Fallback to service account
  console.log('Using Service Account authentication for Google Calendar')
  let clientEmail: string
  let privateKey: string
  
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (serviceAccountJson) {
    try {
      const parsed = JSON.parse(serviceAccountJson)
      clientEmail = parsed.client_email
      privateKey = parsed.private_key
    } catch (error) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is invalid JSON')
    }
  } else {
    clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL || ''
    privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n') || ''
  }

  if (!clientEmail || !privateKey) {
    throw new Error(
      'Google Calendar authentication required: either OAuth2 credentials (GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REFRESH_TOKEN) or Service Account credentials (GOOGLE_SERVICE_ACCOUNT_JSON or GOOGLE_DRIVE_CLIENT_EMAIL + GOOGLE_DRIVE_PRIVATE_KEY) must be set'
    )
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: [
      'https://www.googleapis.com/auth/calendar.readonly',
    ],
  })

  return google.calendar({ version: 'v3', auth })
}

export const runtime = 'nodejs'

interface CalendarEvent {
  id: string
  summary: string
  start: { dateTime?: string; date?: string }
  end: { dateTime?: string; date?: string }
  location?: string
  description?: string
  calendarId: string
  calendarName?: string
}

/**
 * GET /api/calendar
 * Fetches events from multiple Google Calendars
 * Query params:
 *   - calendarIds: comma-separated list of calendar IDs (default: primary calendar)
 *   - timeMin: ISO string for start time (default: now)
 *   - timeMax: ISO string for end time (default: 7 days from now)
 *   - maxResults: max number of results per calendar (default: 10)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get calendar IDs from query params or use primary calendar
    const calendarIdsParam = searchParams.get('calendarIds')
    const calendarIds = calendarIdsParam 
      ? calendarIdsParam.split(',').map(id => id.trim()).filter(Boolean)
      : ['primary']
    
    // Get time range (default: now to 7 days from now)
    const timeMin = searchParams.get('timeMin') || new Date().toISOString()
    const timeMax = searchParams.get('timeMax') || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    const maxResults = parseInt(searchParams.get('maxResults') || '10')

    // Check if an access token was provided (from client-side OAuth)
    const accessToken = searchParams.get('accessToken')
    let calendar
    
    if (accessToken) {
      // Use the provided access token (from user's Google OAuth session)
      console.log('✅ Using provided Google OAuth access token for calendar access')
      // Try to get client ID from env (optional, but helps with token validation)
      const oauthClientId = process.env.GOOGLE_OAUTH_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      const oauth2Client = oauthClientId 
        ? new google.auth.OAuth2(oauthClientId)
        : new google.auth.OAuth2()
      oauth2Client.setCredentials({ access_token: accessToken })
      calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    } else {
      // Use server-side authentication (OAuth2 refresh token or service account)
      console.log('⚠️ No access token provided - falling back to server-side authentication')
      calendar = getCalendarClient()
    }
    const allEvents: CalendarEvent[] = []
    const successfulCalendars: string[] = []
    const failedCalendars: Array<{ id: string; error: string }> = []
    
    // Get authentication info for error messages
    let authInfo: string
    let usingOAuth2 = false
    try {
      if (accessToken) {
        authInfo = 'OAuth2 (user session token)'
        usingOAuth2 = true
      } else if (process.env.GOOGLE_OAUTH_REFRESH_TOKEN) {
        authInfo = 'OAuth2 (refresh token)'
        usingOAuth2 = true
      } else {
        const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
        if (serviceAccountJson) {
          const parsed = JSON.parse(serviceAccountJson)
          authInfo = parsed.client_email || 'Service Account'
        } else {
          authInfo = process.env.GOOGLE_DRIVE_CLIENT_EMAIL || 'Service Account'
        }
      }
    } catch {
      authInfo = process.env.GOOGLE_DRIVE_CLIENT_EMAIL || 'Service Account'
    }

    // Fetch events from each calendar
    for (const calendarId of calendarIds) {
      try {
        // Decode the calendar ID in case it's URL encoded
        const decodedCalendarId = decodeURIComponent(calendarId)
        
        console.log(`Fetching events from calendar: ${decodedCalendarId}`)
        
        const response = await calendar.events.list({
          calendarId: decodedCalendarId,
          timeMin: timeMin,
          timeMax: timeMax,
          maxResults: maxResults,
          singleEvents: true,
          orderBy: 'startTime',
        })

        const events = response.data.items || []
        console.log(`Found ${events.length} events in calendar ${decodedCalendarId}`)
        
        // Get calendar name
        let calendarName: string | undefined
        try {
          const calendarInfo = await calendar.calendars.get({
            calendarId: decodedCalendarId,
          })
          calendarName = calendarInfo.data.summary || undefined
        } catch (error) {
          // If we can't get calendar name, continue without it
          console.warn(`Could not fetch calendar name for ${decodedCalendarId}:`, error)
        }

        // Transform events to our format
        const transformedEvents: CalendarEvent[] = events.map((event) => ({
          id: event.id || '',
          summary: event.summary || 'No Title',
          start: {
            dateTime: event.start?.dateTime || undefined,
            date: event.start?.date || undefined,
          },
          end: {
            dateTime: event.end?.dateTime || undefined,
            date: event.end?.date || undefined,
          },
          location: event.location || undefined,
          description: event.description || undefined,
          calendarId: decodedCalendarId,
          calendarName: calendarName,
        }))

        allEvents.push(...transformedEvents)
        successfulCalendars.push(decodedCalendarId)
      } catch (error: any) {
        const errorDetails = {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          statusText: error.response?.statusText,
        }
        console.error(`Error fetching events from calendar ${decodedCalendarId}:`, error)
        console.error(`Error details:`, errorDetails)
        
        let errorMessage = error.message || 'Unknown error'
        
        // Provide helpful error messages for common issues
        if (error.code === 403 || error.status === 403) {
          if (error.message?.includes('not been used') || error.message?.includes('disabled')) {
            errorMessage = 'Google Calendar API is not enabled'
            console.error(`⚠️  Google Calendar API is not enabled. Enable it at: https://console.developers.google.com/apis/api/calendar-json.googleapis.com/overview?project=141888268813`)
          } else {
            if (process.env.GOOGLE_OAUTH_REFRESH_TOKEN) {
              errorMessage = 'Permission denied - calendar not accessible with your account'
              console.error(`⚠️  Permission denied. Make sure you have access to this calendar in your Google account.`)
            } else {
              errorMessage = 'Permission denied - calendar not shared with service account'
              console.error(`⚠️  Permission denied. The service account may need to be shared with this calendar.`)
              console.error(`   Service account email: ${authInfo}`)
              console.error(`   To fix: Share the calendar with the service account email, make the calendar public, or switch to OAuth2 authentication.`)
            }
            console.error(`   Calendar ID: ${decodedCalendarId}`)
          }
        } else if (error.code === 404 || error.status === 404) {
          errorMessage = 'Calendar not found or not accessible'
          console.error(`⚠️  Calendar not found (404).`)
          console.error(`   Calendar ID: ${decodedCalendarId}`)
          if (process.env.GOOGLE_OAUTH_REFRESH_TOKEN) {
            console.error(`   Using OAuth2 authentication. Make sure you have access to this calendar in your Google account.`)
          } else {
            console.error(`   Authentication: ${authInfo}`)
            console.error(`   To fix: Share the calendar "${decodedCalendarId}" with "${authInfo}" in Google Calendar settings, or switch to OAuth2 authentication.`)
          }
        }
        
        failedCalendars.push({ id: decodedCalendarId, error: errorMessage })
        // Continue with other calendars even if one fails
      }
    }

    // Sort all events by start time
    allEvents.sort((a, b) => {
      const aStart = a.start.dateTime || a.start.date || ''
      const bStart = b.start.dateTime || b.start.date || ''
      return aStart.localeCompare(bStart)
    })

    return NextResponse.json({
      events: allEvents,
      count: allEvents.length,
      successfulCalendars: successfulCalendars.length,
      failedCalendars: failedCalendars.length,
      failedCalendarDetails: failedCalendars,
      authInfo: authInfo, // Include auth info for debugging
      usingOAuth2: usingOAuth2,
    })
  } catch (error: any) {
    console.error('Error fetching calendar events:', error)
    return NextResponse.json(
      {
        error: error.message || 'Failed to fetch calendar events',
      },
      { status: 500 }
    )
  }
}

