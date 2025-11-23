import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

export const runtime = 'nodejs'

/**
 * GET /api/calendars/list
 * Lists all calendars accessible to the authenticated user
 * Query params:
 *   - accessToken: Google OAuth access token (required for user session)
 *   - minAccessRole: minimum access role to filter by (default: 'reader')
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accessToken = searchParams.get('accessToken')
    const minAccessRole = searchParams.get('minAccessRole') || 'reader'

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token is required' },
        { status: 400 }
      )
    }

    // Use the provided access token
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({ access_token: accessToken })
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    // List all calendars
    const response = await calendar.calendarList.list({
      minAccessRole: minAccessRole as 'owner' | 'writer' | 'reader',
    })

    const calendars = (response.data.items || []).map((cal) => ({
      id: cal.id,
      summary: cal.summary,
      description: cal.description,
      backgroundColor: cal.backgroundColor,
      foregroundColor: cal.foregroundColor,
      accessRole: cal.accessRole,
      primary: cal.primary || false,
      selected: cal.selected !== false, // Default to true if not specified
    }))

    return NextResponse.json({
      calendars,
      count: calendars.length,
    })
  } catch (error: any) {
    console.error('Error listing calendars:', error)
    return NextResponse.json(
      {
        error: error.message || 'Failed to list calendars',
      },
      { status: 500 }
    )
  }
}

