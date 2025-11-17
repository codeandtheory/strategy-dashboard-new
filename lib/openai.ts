import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Generate a personalized horoscope text using GPT
 */
export async function generateHoroscope(
  starSign: string,
  department: string | null,
  title: string | null
): Promise<string> {
  const departmentText = department ? ` in the ${department} department` : ''
  const titleText = title ? ` who works as a ${title}` : ''
  
  const prompt = `Generate a fun, personalized daily horoscope for a ${starSign}${titleText}${departmentText}. Keep it lighthearted and work-appropriate, 2-3 sentences. Make it specific to their role and department if provided.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a fun, lighthearted horoscope writer. Keep horoscopes work-appropriate, positive, and engaging. 2-3 sentences maximum.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.8,
    })

    const horoscopeText = completion.choices[0]?.message?.content?.trim()
    if (!horoscopeText) {
      throw new Error('Failed to generate horoscope text')
    }

    return horoscopeText
  } catch (error) {
    console.error('Error generating horoscope:', error)
    throw error
  }
}

/**
 * Generate a tarot card-style horoscope image using DALL-E
 */
export async function generateHoroscopeImage(
  starSign: string,
  department: string | null,
  title: string | null
): Promise<string> {
  const departmentText = department ? `, incorporating elements related to ${department} work` : ''
  const titleText = title ? ` and ${title} role` : ''
  
  const prompt = `A tarot card style illustration for ${starSign} horoscope${departmentText}${titleText}. Mystical, artistic, tarot card aesthetic with ${starSign} symbolism. Vertical orientation, ornate borders, rich colors, professional illustration style.`

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      size: '1024x1792', // Vertical tarot card aspect ratio (approximately 2:3)
      quality: 'standard',
      n: 1,
    })

    const imageUrl = response.data[0]?.url
    if (!imageUrl) {
      throw new Error('Failed to generate horoscope image')
    }

    return imageUrl
  } catch (error) {
    console.error('Error generating horoscope image:', error)
    throw error
  }
}

