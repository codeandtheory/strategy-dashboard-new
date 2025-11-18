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
  "horoscope": "An irreverent, expanded version of the horoscope in Co-Star's style. Make it approximately 150 words. Keep it witty, casual, and entertaining while expanding on the themes from the original. Break it into multiple paragraphs for readability.",
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
      max_tokens: 600,
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
 * Generate a fun, illustrative portrait for the horoscope using resolved choices
 * Returns both the image URL and the prompt used
 */
export async function generateHoroscopeImage(
  starSign: string,
  resolvedChoices: {
    characterType: 'human' | 'animal' | 'object' | 'hybrid'
    styleLabel: string
    promptTags?: string[]
    themeSnippet?: string | null
  },
  userProfile?: {
    element?: string
    modality?: string
    discipline?: string | null
    roleLevel?: string | null
    weekday?: string
    season?: string
  }
): Promise<{ imageUrl: string; prompt: string }> {
  const { characterType, styleLabel, promptTags = [], themeSnippet } = resolvedChoices
  const { element, modality, discipline, roleLevel, weekday, season } = userProfile || {}
  
  // Build detailed character description based on type and profile
  let characterDescription = ''
  switch (characterType) {
    case 'human':
      characterDescription = 'a human character or figure'
      if (roleLevel) {
        characterDescription += ` with ${roleLevel.toLowerCase()}-level energy`
      }
      break
    case 'animal':
      characterDescription = 'an animal character (realistic or anthropomorphic)'
      if (element) {
        characterDescription += ` embodying ${element} element energy`
      }
      break
    case 'object':
      characterDescription = 'an object or inanimate thing personified'
      if (discipline) {
        characterDescription += ` related to ${discipline.toLowerCase()} work`
      }
      break
    case 'hybrid':
      characterDescription = 'a hybrid or fantastical creature combining human, animal, or object elements'
      if (modality) {
        characterDescription += ` with ${modality} energy`
      }
      break
  }
  
  // Build zodiac-specific details
  const zodiacDetails: string[] = []
  if (element) {
    const elementTraits: Record<string, string> = {
      fire: 'fiery, energetic, bold, passionate',
      earth: 'grounded, practical, stable, earthy',
      air: 'light, airy, intellectual, breezy',
      water: 'fluid, emotional, deep, flowing'
    }
    zodiacDetails.push(elementTraits[element] || element)
  }
  
  if (modality) {
    const modalityTraits: Record<string, string> = {
      cardinal: 'initiating, action-oriented, leadership energy',
      fixed: 'stable, persistent, unwavering energy',
      mutable: 'adaptable, flexible, changeable energy'
    }
    zodiacDetails.push(modalityTraits[modality] || modality)
  }
  
  // Build context details
  const contextDetails: string[] = []
  if (discipline) {
    contextDetails.push(`${discipline.toLowerCase()} professional`)
  }
  if (roleLevel) {
    contextDetails.push(`${roleLevel.toLowerCase()} level`)
  }
  if (weekday) {
    contextDetails.push(`${weekday.toLowerCase()} energy`)
  }
  if (season) {
    contextDetails.push(`${season.toLowerCase()} season vibes`)
  }
  
  // Build prompt tags text with more detail
  let tagsText = ''
  if (promptTags.length > 0) {
    tagsText = `\n\nMood and style elements: ${promptTags.join(', ')}.`
  }
  
  // Build theme snippet text
  let themeText = ''
  if (themeSnippet) {
    themeText = `\n\nTheme context: ${themeSnippet}`
  }
  
  // Build zodiac context
  let zodiacContext = ''
  if (zodiacDetails.length > 0) {
    zodiacContext = `\n\nZodiac energy: ${zodiacDetails.join(', ')}.`
  }
  
  // Build professional context
  let professionalContext = ''
  if (contextDetails.length > 0) {
    professionalContext = `\n\nCharacter context: ${contextDetails.join(', ')}.`
  }
  
  // Build specific visual details based on character type
  let visualDetails = ''
  if (characterType === 'object') {
    const objectExamples: Record<string, string> = {
      'Design': 'a personified design tool like a stylized pen, paintbrush, or computer mouse with expressive eyes and limbs',
      'Engineering': 'a personified tech object like a keyboard, circuit board, or code symbol with animated features',
      'Marketing': 'a personified marketing object like a megaphone, chart, or social media icon with personality',
    }
    const objectBase = discipline && objectExamples[discipline] 
      ? objectExamples[discipline]
      : 'a personified everyday object with exaggerated facial features, expressive eyes, and comical limbs'
    visualDetails = `${objectBase}, positioned in a dynamic pose with exaggerated gestures`
  } else if (characterType === 'hybrid') {
    const hybridCombos = [
      'combining human torso with animal features like wings, tails, or animal heads',
      'merging object elements with living creature characteristics',
      'blending multiple species or forms in unexpected ways',
    ]
    visualDetails = `a fantastical hybrid creature ${hybridCombos[Math.floor(Math.random() * hybridCombos.length)]}, with exaggerated proportions and whimsical details`
  } else if (characterType === 'animal') {
    const animalPoses = [
      'standing upright in a confident, anthropomorphic pose',
      'in a playful, dynamic action pose',
      'with exaggerated facial expressions and human-like gestures',
    ]
    visualDetails = `an anthropomorphic animal character ${animalPoses[Math.floor(Math.random() * animalPoses.length)]}, with expressive eyes and exaggerated features`
  } else {
    const humanPoses = [
      'in an exaggerated, theatrical pose with dramatic gestures',
      'with an over-the-top expression and dynamic body language',
      'striking a comically confident or silly pose',
    ]
    visualDetails = `a human character ${humanPoses[Math.floor(Math.random() * humanPoses.length)]}, with exaggerated facial features and expressive body language`
  }
  
  // Build specific accessory/prop suggestions
  const accessoryIdeas: string[] = []
  if (element === 'fire') {
    accessoryIdeas.push('flames, sparks, or fiery elements', 'warm, glowing accessories', 'energetic motion lines')
  } else if (element === 'water') {
    accessoryIdeas.push('water droplets, waves, or fluid elements', 'flowing, liquid-like accessories', 'bubbles or mist')
  } else if (element === 'earth') {
    accessoryIdeas.push('rocks, plants, or earthy elements', 'grounded, natural accessories', 'crystals or minerals')
  } else if (element === 'air') {
    accessoryIdeas.push('wind, clouds, or airy elements', 'floating, light accessories', 'feathers or breezy details')
  }
  
  if (discipline === 'Design') {
    accessoryIdeas.push('art supplies, color swatches, or design tools')
  } else if (discipline === 'Engineering') {
    accessoryIdeas.push('tech gadgets, code symbols, or digital elements')
  } else if (discipline === 'Marketing') {
    accessoryIdeas.push('charts, graphs, or communication symbols')
  }
  
  if (season === 'winter') {
    accessoryIdeas.push('snowflakes, icicles, or winter elements')
  } else if (season === 'spring') {
    accessoryIdeas.push('flowers, buds, or spring growth')
  } else if (season === 'summer') {
    accessoryIdeas.push('sun rays, beach elements, or summer vibes')
  } else if (season === 'fall') {
    accessoryIdeas.push('autumn leaves, pumpkins, or fall colors')
  }
  
  const accessoriesText = accessoryIdeas.length > 0 
    ? `\n- Include specific visual elements: ${accessoryIdeas.slice(0, 3).join(', ')}`
    : ''
  
  // Build specific expression/pose details
  const expressionDetails = modality === 'cardinal' 
    ? 'bold, action-oriented expression with forward-leaning, initiating energy'
    : modality === 'fixed' 
    ? 'steady, determined expression with stable, unwavering posture'
    : 'flexible, adaptable expression with dynamic, changeable energy'
  
  const prompt = `An absolutely absurd, hilariously silly, and delightfully ridiculous illustration portrait representing ${starSign} energy, featuring ${characterDescription}.${zodiacContext}${professionalContext}

Illustration style: ${styleLabel}.${tagsText}${themeText}

Character description:
- ${visualDetails}
- The character should have ${expressionDetails}
- Facial expression: exaggerated, comical, with wide eyes and an absurdly expressive face
- Body language: dynamic, over-the-top, with exaggerated gestures and poses
- Clothing/accessories: ${characterType === 'object' ? 'personified elements that give the object personality' : 'whimsical, absurd clothing or accessories that enhance the character\'s energy'}${accessoriesText}
- Color palette: ${element === 'fire' ? 'warm oranges, reds, and yellows with vibrant energy' : element === 'water' ? 'cool blues, teals, and aquas with fluid movement' : element === 'earth' ? 'earthy browns, greens, and terracottas with grounded tones' : element === 'air' ? 'light blues, whites, and pastels with airy lightness' : 'vibrant, saturated colors that pop'}
- Composition: character should fill most of the frame, centered or slightly off-center, with clear focus on their absurd personality

Visual style details:
- Absolutely NO text, NO words, NO letters, NO numbers anywhere in the image
- Background: clean, simple, or subtle abstract pattern that doesn't distract from the character
- Lighting: ${element === 'fire' ? 'warm, glowing light' : element === 'water' ? 'soft, fluid lighting' : element === 'earth' ? 'natural, grounded lighting' : element === 'air' ? 'bright, airy lighting' : 'vibrant, dynamic lighting'} that enhances the character
- Texture: ${styleLabel.toLowerCase().includes('watercolor') ? 'soft, flowing watercolor textures' : styleLabel.toLowerCase().includes('oil') ? 'rich, painterly textures' : styleLabel.toLowerCase().includes('pixel') ? 'pixelated, retro game textures' : styleLabel.toLowerCase().includes('3d') ? 'smooth, rendered 3D textures' : 'clean, polished digital art textures'}
- Details: include small, whimsical details that add to the absurdity - unexpected elements, playful interactions, or silly visual gags

Format requirements:
- Square format (1:1 aspect ratio), portrait orientation
- Full body or three-quarter portrait view
- Professional digital art quality suitable for use as a profile picture or avatar
- High resolution, crisp details, vibrant colors

The illustration should be creatively absurd, hilariously silly, and capture the essence of ${starSign} combined with ${element || 'its'} element energy, ${modality || 'its'} modality, ${discipline ? discipline + ' discipline' : 'professional energy'}, and ${season || 'seasonal'} vibes in the most ridiculous and entertaining way possible. Think maximum absurdity, complete silliness, and delightful nonsense.`

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
    return { imageUrl, prompt }
  } catch (error: any) {
    console.error('Error generating horoscope image:', error)
    if (error.response) {
      console.error('OpenAI API error response:', error.response.status, error.response.data)
    }
    throw error
  }
}

