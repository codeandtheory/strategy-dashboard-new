import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Transform a Cafe Astrology horoscope into Co-Star style with do's and don'ts
 */
export async function transformHoroscopeToCoStarStyle(
  cafeAstrologyText: string,
  starSign: string
): Promise<{ horoscope: string; dos: string[]; donts: string[] }> {
  console.log('Transforming horoscope to Co-Star style...')
  
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables')
    }
    
    const prompt = `Transform this horoscope from Cafe Astrology into the irreverent, silly style of Co-Star. Make it witty, slightly sarcastic, and fun. Keep the core meaning but make it more casual and entertaining.

Original horoscope for ${starSign}:
${cafeAstrologyText}

Return a JSON object with this exact structure:
{
  "horoscope": "A short, irreverent version of the horoscope in Co-Star's style (2-3 sentences, witty and casual)",
  "dos": ["Do thing 1", "Do thing 2", "Do thing 3"],
  "donts": ["Don't thing 1", "Don't thing 2", "Don't thing 3"]
}

Make the do's and don'ts silly, specific, and related to the horoscope content. They should be funny and slightly absurd but still relevant.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a witty horoscope transformer. You take traditional horoscopes and make them irreverent and fun in the style of Co-Star. You always return valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 500,
      temperature: 0.9,
      timeout: 30000,
    })

    const responseText = completion.choices[0]?.message?.content?.trim()
    if (!responseText) {
      throw new Error('Failed to transform horoscope - empty response')
    }

    const parsed = JSON.parse(responseText)
    
    if (!parsed.horoscope || !Array.isArray(parsed.dos) || !Array.isArray(parsed.donts)) {
      throw new Error('Invalid response format from OpenAI')
    }

    console.log('Successfully transformed horoscope to Co-Star style')
    return {
      horoscope: parsed.horoscope,
      dos: parsed.dos,
      donts: parsed.donts,
    }
  } catch (error: any) {
    console.error('Error transforming horoscope:', error)
    if (error.response) {
      console.error('OpenAI API error response:', error.response.status, error.response.data)
    }
    throw error
  }
}

/**
 * Generate a portrait illustration for the horoscope
 */
export async function generateHoroscopeImage(
  starSign: string,
  department: string | null,
  title: string | null
): Promise<string> {
  const departmentText = department ? ` with subtle ${department.toLowerCase()} aesthetic elements` : ''
  const titleText = title ? ` reflecting a ${title.toLowerCase()} persona` : ''
  
  const prompt = `A beautiful portrait illustration of a figure representing ${starSign} energy${departmentText}${titleText}. Full body or three-quarter portrait, artistic illustration style, no text, no borders, clean background. The figure should embody ${starSign} characteristics and symbolism. Professional digital art, vibrant colors, detailed illustration, portrait orientation. Suitable for use as a profile picture or avatar.`

  console.log('Calling OpenAI DALL-E API...')
  
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables')
    }
    
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      size: '1024x1024', // Square format for portrait/avatar use
      quality: 'standard',
      n: 1,
      timeout: 60000, // 60 second timeout for image generation
    })

    const imageUrl = response.data[0]?.url
    if (!imageUrl) {
      throw new Error('Failed to generate horoscope image - empty response')
    }

    console.log('OpenAI DALL-E API call successful')
    return imageUrl
  } catch (error: any) {
    console.error('Error generating horoscope image:', error)
    if (error.response) {
      console.error('OpenAI API error response:', error.response.status, error.response.data)
    }
    throw error
  }
}

