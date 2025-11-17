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
 * Get illustration style for zodiac sign
 */
function getZodiacStyle(starSign: string): string {
  const styles: Record<string, string> = {
    'Aries': 'bold, energetic, dynamic illustration with fiery reds and oranges, action-oriented, confident character with ram symbolism',
    'Taurus': 'grounded, earthy illustration with rich greens and browns, serene and stable, bull symbolism with natural elements',
    'Gemini': 'playful, dual-natured illustration with bright yellows and blues, twin figures, communicative and curious, airy and light',
    'Cancer': 'emotional, nurturing illustration with soft blues and silvers, moon symbolism, water elements, cozy and protective',
    'Leo': 'dramatic, regal illustration with golds and warm oranges, lion symbolism, confident and theatrical, sun motifs',
    'Virgo': 'detailed, refined illustration with earth tones and greens, organized and precise, harvest symbolism, clean lines',
    'Libra': 'balanced, harmonious illustration with pastels and soft pinks, scales symbolism, elegant and diplomatic, aesthetic beauty',
    'Scorpio': 'intense, mysterious illustration with deep purples and reds, scorpion symbolism, transformative and powerful, water elements',
    'Sagittarius': 'adventurous, free-spirited illustration with vibrant purples and blues, archer symbolism, travel and exploration themes',
    'Capricorn': 'ambitious, structured illustration with dark greens and browns, mountain goat symbolism, disciplined and goal-oriented',
    'Aquarius': 'innovative, unique illustration with electric blues and silvers, water bearer symbolism, futuristic and humanitarian',
    'Pisces': 'dreamy, flowing illustration with sea greens and purples, fish symbolism, mystical and intuitive, water and cosmic elements',
  }
  return styles[starSign] || 'mystical, colorful illustration with cosmic elements'
}

/**
 * Generate a fun, illustrative portrait for the horoscope
 */
export async function generateHoroscopeImage(
  starSign: string,
  department: string | null,
  title: string | null
): Promise<string> {
  const styleDescription = getZodiacStyle(starSign)
  const departmentText = department ? `, incorporating subtle ${department.toLowerCase()} design elements` : ''
  const titleText = title ? `, reflecting a ${title.toLowerCase()} aesthetic` : ''
  
  const prompt = `A fun, vibrant, and whimsical illustration portrait representing ${starSign} energy. ${styleDescription}${departmentText}${titleText}. 

Style requirements:
- Playful, illustrative art style (like modern digital illustration, whimsical character art, or stylized fantasy illustration)
- Absolutely NO text, NO words, NO letters, NO numbers anywhere in the image
- No borders, clean background or subtle abstract background
- Full body or three-quarter portrait of a character or figure
- Vibrant, saturated colors
- Fun, expressive, and engaging
- Square format, portrait orientation
- Professional digital art quality
- Suitable for use as a profile picture or avatar

The illustration should be creative, fun, and capture the essence of ${starSign} in an entertaining and visually appealing way.`

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

