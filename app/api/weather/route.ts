import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// WeatherAPI.com base URL
const WEATHERAPI_BASE = 'https://api.weatherapi.com/v1'

// OpenAI clients with fallback support
let openaiClient: OpenAI | null = null
let fallbackClient: OpenAI | null = null

function getOpenAIClient(useFallback = false): OpenAI {
  if (useFallback) {
    const fallbackKey = process.env.OPENAI_API_KEY_FALLBACK
    if (!fallbackKey) {
      throw new Error('Fallback OpenAI API key not configured')
    }
    if (!fallbackClient) {
      fallbackClient = new OpenAI({
        apiKey: fallbackKey,
      })
    }
    return fallbackClient
  }

  if (openaiClient) {
    return openaiClient
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set')
  }

  openaiClient = new OpenAI({
    apiKey,
  })

  return openaiClient
}

/**
 * Call OpenAI with automatic fallback to secondary API key on quota errors
 */
async function callOpenAIWithFallback<T>(
  apiCall: (client: OpenAI) => Promise<T>
): Promise<T> {
  try {
    const client = getOpenAIClient(false)
    return await apiCall(client)
  } catch (error: any) {
    // If we get a 429 (quota exceeded) or 401 (invalid key) and have a fallback, try it
    const hasFallback = !!process.env.OPENAI_API_KEY_FALLBACK
    if (
      hasFallback &&
      (error?.status === 429 || error?.status === 401 || error?.message?.includes('quota') || error?.code === 'insufficient_quota')
    ) {
      console.log('Primary OpenAI API key failed, trying fallback key...')
      const fallbackClient = getOpenAIClient(true)
      return await apiCall(fallbackClient)
    }
    throw error
  }
}

/**
 * Get weather emoji based on weather condition
 */
function getWeatherEmoji(condition: string, isDay: boolean = true): string {
  const lower = condition.toLowerCase()
  if (lower.includes('rain') || lower.includes('drizzle')) return '🌧️'
  if (lower.includes('snow')) return '❄️'
  if (lower.includes('thunder') || lower.includes('storm')) return '⛈️'
  if (lower.includes('cloud')) return '☁️'
  if (lower.includes('clear') || lower.includes('sun')) return isDay ? '☀️' : '🌙'
  if (lower.includes('fog') || lower.includes('mist')) return '🌫️'
  return '🌤️'
}

/**
 * Generate work-related weather report using OpenAI
 * Uses fallback API key and proxy support if configured
 */
async function generateWorkWeatherReport(
  temperature: number,
  condition: string,
  humidity: number,
  windSpeed: number,
  location: string
): Promise<string> {
  const prompt = `Based on the current weather in ${location}, create a brief, practical work-related weather tip (1-2 sentences max). Be specific and actionable.

Weather details:
- Temperature: ${temperature}°F
- Condition: ${condition}
- Humidity: ${humidity}%
- Wind Speed: ${windSpeed} mph

Examples:
- If rainy: "Bring an umbrella to brainstorms today - it's wet out there!"
- If sunny: "Perfect weather for a walking meeting - take advantage of the sunshine!"
- If cold: "Layer up for that client site visit - it's chilly today."
- If windy: "Hold onto your notes in outdoor meetings - it's breezy!"

Make it relevant, practical, and work-focused. Keep it concise and friendly.`

  try {
    const openaiProxyUrl = process.env.OPENAI_PROXY_URL
    const openaiChatModel = process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini'
    let completion: any

    const messages = [
      {
        role: 'system' as const,
        content: 'You are a helpful assistant that provides brief, practical work-related weather tips.',
      },
      {
        role: 'user' as const,
        content: prompt,
      },
    ]

    const requestBody = {
      model: openaiChatModel,
      messages,
      max_tokens: 100,
      temperature: 0.7,
    }

    // Use proxy if configured (n8n/Elvex), otherwise use direct OpenAI with fallback
    if (openaiProxyUrl) {
      console.log('Using proxy for OpenAI weather report:', openaiProxyUrl)
      
      // Check if this is Elvex (simple proxy) or n8n (needs type wrapper)
      const isElvex = openaiProxyUrl.includes('/v1/chat/completions') || 
                      openaiProxyUrl.includes('elvex')
      
      const proxyRequestBody = isElvex 
        ? requestBody  // Elvex: send OpenAI format directly
        : { type: 'chat', ...requestBody }  // n8n: wrap with type field

      const response = await fetch(openaiProxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proxyRequestBody),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Proxy API call failed: ${response.status} ${errorText}`)
      }

      completion = await response.json()
    } else {
      // Use direct OpenAI with automatic fallback to secondary API key on quota errors
      completion = await callOpenAIWithFallback(async (openai) => {
        return await openai.chat.completions.create(requestBody)
      })
    }

    return completion.choices[0]?.message?.content?.trim() || 'Check the weather before heading out today!'
  } catch (error: any) {
    console.error('Error generating work weather report:', error)
    
    // Check if it's a quota/billing error - don't retry, just use fallback message
    if (error?.status === 429 && (error?.code === 'insufficient_quota' || error?.message?.includes('quota'))) {
      console.warn('OpenAI quota exceeded, using fallback weather message')
    }
    
    // Fallback message based on condition
    if (condition.toLowerCase().includes('rain')) {
      return 'Bring an umbrella to brainstorms today - it\'s wet out there!'
    }
    if (condition.toLowerCase().includes('sun') || condition.toLowerCase().includes('clear')) {
      return 'Perfect weather for a walking meeting - take advantage of the sunshine!'
    }
    if (condition.toLowerCase().includes('cold') || temperature < 50) {
      return 'Layer up for that client site visit - it\'s chilly today.'
    }
    if (condition.toLowerCase().includes('wind')) {
      return 'Hold onto your notes in outdoor meetings - it\'s breezy!'
    }
    return 'Check the weather before heading out today!'
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      )
    }

    // Get WeatherAPI.com API key from environment variables
    const apiKey = process.env.WEATHERAPI_KEY || process.env.NEXT_PUBLIC_WEATHERAPI_KEY
    if (!apiKey) {
      console.error('WEATHERAPI_KEY is not set')
      return NextResponse.json(
        { error: 'Weather service not configured. Please set WEATHERAPI_KEY in Vercel environment variables. Get a free API key from https://www.weatherapi.com/' },
        { status: 500 }
      )
    }

    console.log('Fetching weather from WeatherAPI.com...')
    console.log('WeatherAPI key status:', apiKey ? `${apiKey.substring(0, 4)}...` : 'NOT SET')

    // WeatherAPI.com current weather endpoint
    // q parameter can be lat,lon or city name
    const weatherUrl = `${WEATHERAPI_BASE}/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`
    console.log('Fetching weather from WeatherAPI.com...')
    const weatherResponse = await fetch(weatherUrl)

    if (!weatherResponse.ok) {
      const errorText = await weatherResponse.text()
      console.error('WeatherAPI.com API error:', weatherResponse.status, errorText)
      
      let errorDetails = 'Failed to fetch weather data'
      try {
        const errorJson = JSON.parse(errorText)
        if (errorJson.error?.message) {
          errorDetails = errorJson.error.message
        }
      } catch {
        if (errorText) {
          errorDetails = errorText
        }
      }

      if (weatherResponse.status === 401) {
        return NextResponse.json(
          { 
            error: 'Invalid API key. Please check that WEATHERAPI_KEY is correct in Vercel environment variables.',
            details: errorDetails,
            troubleshooting: [
              '1. Verify the API key is correct in your WeatherAPI.com account dashboard',
              '2. Make sure you copied the entire key (no spaces)',
              '3. Ensure the environment variable is set in Vercel (not just locally)',
              '4. Redeploy your Vercel project after adding/updating the environment variable',
              '5. Check your WeatherAPI.com account status and API limits'
            ]
          },
          { status: 401 }
        )
      }

      return NextResponse.json(
        { error: `Failed to fetch weather data: ${weatherResponse.statusText}`, details: errorDetails },
        { status: weatherResponse.status }
      )
    }

    const weatherData = await weatherResponse.json()
    const current = weatherData.current
    const location = weatherData.location

    // Extract weather data
    const temperature = Math.round(current.temp_f) // Already in Fahrenheit
    const condition = current.condition?.text || 'Unknown'
    const description = current.condition?.text || condition
    const humidity = current.humidity
    const windSpeed = Math.round(current.wind_mph) // Already in mph
    const isDay = current.is_day === 1

    // Get location name
    const locationName = location?.name || 
                        `${location?.region || ''}, ${location?.country || ''}`.trim() ||
                        'your location'

    // Generate work-related weather report
    const workReport = await generateWorkWeatherReport(
      temperature,
      description,
      humidity,
      windSpeed,
      locationName
    )

    return NextResponse.json({
      temperature,
      condition,
      description,
      humidity,
      windSpeed,
      emoji: getWeatherEmoji(description, isDay),
      workReport,
      location: locationName,
      cached: false,
    })
  } catch (error: any) {
    console.error('Error in weather API:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch weather' },
      { status: 500 }
    )
  }
}

