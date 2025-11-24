import { NextRequest, NextResponse } from 'next/server'
import { buildHoroscopePrompt, type UserProfile as PromptUserProfile } from '@/lib/horoscope-prompt-builder'
import { createClient } from '@supabase/supabase-js'

// Internal API endpoint to build prompt from slots
// This is called from n8n to build the prompt server-side
export async function POST(request: NextRequest) {
  try {
    // Verify internal token (optional but recommended)
    const internalToken = request.headers.get('X-INTERNAL-TOKEN')
    const expectedToken = process.env.INTERNAL_API_TOKEN
    
    if (expectedToken && internalToken !== expectedToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { slots, userProfile, userId, date, weekday, season } = body

    if (!slots || !userProfile || !userId || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: slots, userProfile, userId, date' },
        { status: 400 }
      )
    }

    // Get Supabase admin client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Build prompt using existing logic
    const promptUserProfile: PromptUserProfile = {
      id: userId,
      name: userProfile.name || 'User',
      role: userProfile.role || null,
      hobbies: userProfile.hobbies || null,
      starSign: userProfile.starSign || null,
      element: userProfile.element || null,
      likes_fantasy: userProfile.likes_fantasy || false,
      likes_scifi: userProfile.likes_scifi || false,
      likes_cute: userProfile.likes_cute || false,
      likes_minimal: userProfile.likes_minimal || false,
      hates_clowns: userProfile.hates_clowns || false,
    }

    // If slots are provided, we need to reconstruct the prompt
    // Otherwise, use buildHoroscopePrompt which selects slots
    if (slots && Object.keys(slots).length > 0) {
      // Fetch catalogs to get labels
      const { data: catalogItems, error: catalogError } = await supabaseAdmin
        .from('prompt_slot_catalogs')
        .select('id, slot_type, label, value')
        .in('id', [
          slots.style_medium_id,
          slots.style_reference_id,
          slots.subject_role_id,
          slots.subject_twist_id,
          slots.setting_place_id,
          slots.setting_time_id,
          slots.activity_id,
          slots.mood_vibe_id,
          slots.color_palette_id,
          slots.camera_frame_id,
          slots.lighting_style_id,
          ...(slots.constraints_ids || [])
        ].filter(Boolean))

      if (catalogError) {
        throw new Error(`Failed to fetch catalog items: ${catalogError.message}`)
      }

      // Build prompt from slots (same logic as buildPromptString)
      const catalogMap = new Map(catalogItems.map(item => [item.id, item]))
      const getCatalogItem = (slotId: string) => catalogMap.get(slotId) || null

      const styleMedium = getCatalogItem(slots.style_medium_id)
      const styleReference = getCatalogItem(slots.style_reference_id)
      const subjectRole = getCatalogItem(slots.subject_role_id)
      const subjectTwist = slots.subject_twist_id ? getCatalogItem(slots.subject_twist_id) : null
      const settingPlace = getCatalogItem(slots.setting_place_id)
      const settingTime = getCatalogItem(slots.setting_time_id)
      const activity = getCatalogItem(slots.activity_id)
      const moodVibe = getCatalogItem(slots.mood_vibe_id)
      const colorPalette = getCatalogItem(slots.color_palette_id)
      const cameraFrame = getCatalogItem(slots.camera_frame_id)
      const lightingStyle = getCatalogItem(slots.lighting_style_id)
      const constraints = (slots.constraints_ids || []).map((id: string) => getCatalogItem(id)).filter(Boolean)

      // Build subject clause - include star sign
      let subjectClause = userProfile.name || 'User'
      if (userProfile.starSign) {
        subjectClause += ` (${userProfile.starSign})`
      }
      if (userProfile.role) {
        subjectClause += `, a ${userProfile.role.toLowerCase()}`
      }
      if (userProfile.hobbies && userProfile.hobbies.length > 0) {
        subjectClause += ` who loves ${userProfile.hobbies[0].toLowerCase()}`
      }
      if (subjectRole) {
        subjectClause += `, as ${subjectRole.label.toLowerCase()}`
      }
      if (subjectTwist) {
        const twistLabel = subjectTwist.label.toLowerCase()
        if (twistLabel.includes('living') || twistLabel.includes('version') || twistLabel.includes('form')) {
          if (subjectRole) {
            subjectClause = subjectClause.replace(
              `, as ${subjectRole.label.toLowerCase()}`,
              `, as ${twistLabel} ${subjectRole.label.toLowerCase()}`
            )
          } else {
            subjectClause += `, as ${twistLabel}`
          }
        } else {
          subjectClause += ` ${twistLabel}`
        }
      }

      // Build style text
      const styleText = styleReference
        ? `${styleReference.label}${styleMedium ? `. ${styleMedium.label}` : ''}`
        : styleMedium?.label || ''

      // Build activity text
      const activityText = activity ? ` ${activity.label.toLowerCase()}` : ''

      // Build setting text
      const settingText = settingPlace?.label.toLowerCase() || 'a setting'
      let timeText = settingTime?.label.toLowerCase() || 'a time'

      // Fix grammar
      if (timeText.startsWith('stormy') || timeText.startsWith('sunny') || timeText.startsWith('rainy')) {
        timeText = `during a ${timeText}`
      } else if (timeText.includes('afternoon') || timeText.includes('morning') || timeText.includes('evening') || timeText.includes('night')) {
        if (!timeText.startsWith('during') && !timeText.startsWith('at') && !timeText.startsWith('on')) {
          timeText = `during ${timeText}`
        }
      } else if (!timeText.startsWith('at') && !timeText.startsWith('during') && !timeText.startsWith('on')) {
        timeText = `at ${timeText}`
      }

      // Build mood, color, lighting
      const moodText = moodVibe?.label.toLowerCase() || 'moody'
      const colorText = colorPalette?.label.toLowerCase() || 'colorful'
      const lightingText = lightingStyle?.label.toLowerCase() || 'natural lighting'

      // Build constraints text
      const constraintsText = constraints.map((c: any) => c.label.toLowerCase()).join(', ')

      // Build prompt
      const prompt = `${styleText}. ${cameraFrame?.label || 'Portrait'} of ${subjectClause}${activityText}. They are in ${settingText} ${timeText}. ${moodText} mood, ${colorText} palette, ${lightingText}. ${constraintsText}.`.trim()

      return NextResponse.json({ prompt })
    } else {
      // No slots provided, use buildHoroscopePrompt to select them
      const { prompt } = await buildHoroscopePrompt(
        supabaseAdmin,
        userId,
        date,
        promptUserProfile,
        weekday || 'Monday',
        season || 'spring'
      )

      return NextResponse.json({ prompt })
    }
  } catch (error: any) {
    console.error('Error building prompt:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to build prompt' },
      { status: 500 }
    )
  }
}

