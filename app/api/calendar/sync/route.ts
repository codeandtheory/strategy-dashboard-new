import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// Cache service account email for error messages
let cachedServiceAccountEmail: string | null = null

function getServiceAccountEmail(): string {
  if (cachedServiceAccountEmail) {
    return cachedServiceAccountEmail
  }
  
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (serviceAccountJson) {
    try {
      const parsed = JSON.parse(serviceAccountJson)
      cachedServiceAccountEmail = parsed.client_email
      return cachedServiceAccountEmail
    } catch (error) {
      // Fall through to individual vars
    }
  }
  
  cachedServiceAccountEmail = process.env.GOOGLE_CLIENT_EMAIL || 'your-service-account@...'
  return cachedServiceAccountEmail
}

/**
 * Initialize Google Calendar API using Service Account (JWT)
 * Same pattern as Google Drive API
 */
function getCalendarClient() {
  // Try service account JSON first, then fallback to individual vars
  let clientEmail: string
  let privateKey: string
  
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (serviceAccountJson) {
    try {
      const parsed = JSON.parse(serviceAccountJson)
      clientEmail = parsed.client_email
      privateKey = parsed.private_key
      cachedServiceAccountEmail = clientEmail
    } catch (error) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is invalid JSON')
    }
  } else {
    clientEmail = process.env.GOOGLE_CLIENT_EMAIL || ''
    privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || ''
    cachedServiceAccountEmail = clientEmail
  }

  if (!clientEmail || !privateKey) {
    throw new Error(
      'Google Calendar authentication required: either GOOGLE_SERVICE_ACCOUNT_JSON or both GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY must be set'
    )
  }

  // Use JWT authentication with calendar readonly scope
  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  })

  return { calendar: google.calendar({ version: 'v3', auth }), auth, clientEmail }
}

/**
 * POST /api/calendar/sync
 * Syncs calendar events from Google Calendar to database using service account
 * Query params:
 *   - calendarIds: comma-separated list of calendar IDs (optional, uses env var if not provided)
 *   - timeMin: ISO string for start time (default: now)
 *   - timeMax: ISO string for end time (default: 30 days from now)
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get calendar IDs from query params or env var
    const calendarIdsParam = searchParams.get('calendarIds')
    const calendarIds = calendarIdsParam 
      ? calendarIdsParam.split(',').map(id => id.trim()).filter(Boolean)
      : process.env.GOOGLE_CALENDAR_IDS?.split(',').map(id => id.trim()).filter(Boolean) || []
    
    if (calendarIds.length === 0) {
      return NextResponse.json(
        { error: 'No calendar IDs provided. Set calendarIds query param or GOOGLE_CALENDAR_IDS env var.' },
        { status: 400 }
      )
    }
    
    // Get time range (default: now to 30 days from now)
    const timeMin = searchParams.get('timeMin') || new Date().toISOString()
    const timeMax = searchParams.get('timeMax') || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    const maxResults = parseInt(searchParams.get('maxResults') || '250') // Default to 250 for sync

    // Initialize calendar client with service account
    const { calendar } = getCalendarClient()
    
    const supabase = await createClient()
    
    let totalAdded = 0
    let totalUpdated = 0
    let totalDeleted = 0
    const failedCalendars: Array<{ id: string; error: string }> = []

    // Sync each calendar
    for (const calendarId of calendarIds) {
      const decodedCalendarId = decodeURIComponent(calendarId.trim())
      
      try {
        console.log(`🔄 Syncing calendar: ${decodedCalendarId}`)
        
        // Fetch events from Google Calendar
        const response = await calendar.events.list({
          calendarId: decodedCalendarId,
          timeMin: timeMin,
          timeMax: timeMax,
          maxResults: maxResults,
          singleEvents: true,
          orderBy: 'startTime',
        })

        const events = response.data.items || []
        console.log(`📅 Found ${events.length} events in calendar ${decodedCalendarId}`)
        
        // Get calendar name
        let calendarName: string | undefined
        try {
          const calendarInfo = await calendar.calendars.get({
            calendarId: decodedCalendarId,
          })
          calendarName = calendarInfo.data.summary || undefined
        } catch (error) {
          console.warn(`Could not fetch calendar name for ${decodedCalendarId}:`, error)
        }

        // Get all existing events for this calendar (we'll filter by time range in memory if needed)
        // We fetch all non-deleted events for this calendar to check for deletions
        const { data: existingEvents } = await supabase
          .from('synced_calendar_events')
          .select('google_event_id')
          .eq('calendar_id', decodedCalendarId)
          .is('deleted_at', null)

        const existingEventIds = new Set(existingEvents?.map(e => e.google_event_id) || [])
        const currentEventIds = new Set<string>()

        // Process each event
        for (const event of events) {
          if (!event.id) continue
          
          currentEventIds.add(event.id)
          
          // Determine if all-day or timed event
          const isAllDay = !event.start?.dateTime && !!event.start?.date
          const startDateTime = event.start?.dateTime ? new Date(event.start.dateTime).toISOString() : null
          const startDate = event.start?.date ? event.start.date : null
          const endDateTime = event.end?.dateTime ? new Date(event.end.dateTime).toISOString() : null
          const endDate = event.end?.date ? event.end.date : null

          // Check if this is an OOO calendar and clean up summary
          const isOOOCalendar = decodedCalendarId.includes('6elnqlt8ok3kmcpim2vge0qqqk') || 
                                decodedCalendarId.includes('ojeuiov0bhit2k17g8d6gj4i68')
          let summary = event.summary || 'No Title'
          if (isOOOCalendar && summary.startsWith('[Pending approval] ')) {
            summary = summary.replace(/^\[Pending approval\] /, '')
          }

          const eventData = {
            google_event_id: event.id,
            calendar_id: decodedCalendarId,
            calendar_name: calendarName,
            summary: summary,
            description: event.description || null,
            start_date_time: startDateTime,
            start_date: startDate,
            end_date_time: endDateTime,
            end_date: endDate,
            location: event.location || null,
            is_all_day: isAllDay,
            last_synced_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
          }

          if (existingEventIds.has(event.id)) {
            // Update existing event
            const { error: updateError } = await supabase
              .from('synced_calendar_events')
              .update(eventData)
              .eq('google_event_id', event.id)
              .eq('calendar_id', decodedCalendarId)
            
            if (updateError) {
              console.error(`Error updating event ${event.id}:`, updateError)
            } else {
              totalUpdated++
            }
          } else {
            // Insert new event
            const { error: insertError } = await supabase
              .from('synced_calendar_events')
              .insert(eventData)
            
            if (insertError) {
              console.error(`Error inserting event ${event.id}:`, insertError)
            } else {
              totalAdded++
            }
          }
        }

        // Mark events that no longer exist as deleted (soft delete)
        const eventsToDelete = Array.from(existingEventIds).filter(id => !currentEventIds.has(id))
        if (eventsToDelete.length > 0) {
          const { error: deleteError } = await supabase
            .from('synced_calendar_events')
            .update({ deleted_at: new Date().toISOString() })
            .eq('calendar_id', decodedCalendarId)
            .in('google_event_id', eventsToDelete)
          
          if (deleteError) {
            console.error(`Error marking events as deleted:`, deleteError)
          } else {
            totalDeleted += eventsToDelete.length
          }
        }

        console.log(`✅ Synced calendar ${decodedCalendarId}: ${totalAdded} added, ${totalUpdated} updated, ${eventsToDelete.length} deleted`)
      } catch (error: any) {
        console.error(`❌ Error syncing calendar ${decodedCalendarId}:`, error)
        
        // Provide helpful error messages based on error type
        let errorMessage = error.message || 'Unknown error'
        const errorCode = error.code || error.response?.status
        const errorStatus = error.response?.status
        
        // Check for permission/access errors
        if (errorCode === 403 || errorStatus === 403) {
          if (error.message?.includes('not been used') || error.message?.includes('disabled')) {
            errorMessage = 'Google Calendar API is not enabled. Enable it in Google Cloud Console.'
          } else {
            // Permission denied - service account needs access
            const isPublicCalendar = decodedCalendarId.includes('holiday') || 
                                     decodedCalendarId.includes('@group.v.calendar.google.com') ||
                                     decodedCalendarId.includes('#holiday')
            
            const serviceAccountEmail = getServiceAccountEmail()
            if (isPublicCalendar) {
              errorMessage = `Permission denied: This is a public calendar but the service account doesn't have access. For public calendars you don't own, you may need to request access from the calendar owner, or the calendar may require explicit sharing with the service account email: ${serviceAccountEmail}`
            } else {
              errorMessage = `Permission denied: The service account needs to be granted access to this calendar. Share the calendar with the service account email: ${serviceAccountEmail}`
            }
          }
        } else if (errorCode === 404 || errorStatus === 404) {
          errorMessage = `Calendar not found: The calendar ID may be incorrect, or the service account doesn't have access. Verify the calendar ID and ensure the service account has been granted access.`
        } else if (errorCode === 401 || errorStatus === 401) {
          errorMessage = `Authentication failed: Check that GOOGLE_SERVICE_ACCOUNT_JSON or GOOGLE_CLIENT_EMAIL/GOOGLE_PRIVATE_KEY are correctly configured.`
        }
        
        failedCalendars.push({
          id: decodedCalendarId,
          error: errorMessage
        })
        
        // Continue with other calendars even if this one fails
        console.warn(`⚠️  Skipping calendar ${decodedCalendarId} due to error, continuing with other calendars...`)
      }
    }

    return NextResponse.json({
      success: true,
      synced: calendarIds.length - failedCalendars.length,
      failed: failedCalendars.length,
      added: totalAdded,
      updated: totalUpdated,
      deleted: totalDeleted,
      failedCalendars: failedCalendars,
    })
  } catch (error: any) {
    console.error('Error syncing calendar events:', error)
    return NextResponse.json(
      {
        error: error.message || 'Failed to sync calendar events',
      },
      { status: 500 }
    )
  }
}

