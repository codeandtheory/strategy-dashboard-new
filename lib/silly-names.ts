/**
 * Generate a really silly and absurd character name (no zodiac references)
 */

const ABSURD_SILLY_NAMES = [
  // Completely absurd names
  'Bubbles McWobble',
  'Zigzag Zucchini',
  'Fluffy Pickle',
  'Snuggles the Sock',
  'Bouncy Banana',
  'Wobble Waffle',
  'Sparkle Spatula',
  'Glimmer Garbage',
  'Twinkle Toaster',
  'Cosmic Carrot',
  'Stardust Sandwich',
  'Moonbeam Muffin',
  'Galaxy Gremlin',
  'Nebula Noodle',
  'Comet Cookie',
  'Asteroid Avocado',
  'Planet Pancake',
  'Solar Spaghetti',
  'Lunar Lemon',
  'Universe Unicorn',
  'Space Spatula',
  'Starfish Supreme',
  'Sunshine Silliness',
  'Cosmic Clown',
  'Stellar Silliness',
  'The Absurd Avocado',
  'The Silly Sock',
  'The Ridiculous Radish',
  'The Wacky Waffle',
  'The Zany Zucchini',
  'The Bizarre Banana',
  'The Quirky Quiche',
  'The Eccentric Eggplant',
  'Sir Pickle the Great',
  'Madame Muffin',
  'Captain Carrot',
  'Professor Pancake',
  'The Enigma Eggplant',
  'Lord Lemon',
  'Lady Lollipop',
  'Duke of Doughnuts',
  'Baron of Bananas',
  'Count Cookie',
  'Princess Pickle',
  'Emperor Eggplant',
  'Queen Quiche',
  'King Ketchup',
  'Wizard Waffle',
  'Sorcerer Spatula',
  'Mage Muffin',
  'Necromancer Noodle',
]

export function generateSillyCharacterName(starSign: string): string {
  // Always return a completely random absurd name (no zodiac references)
  return ABSURD_SILLY_NAMES[Math.floor(Math.random() * ABSURD_SILLY_NAMES.length)]
}

/**
 * Generate a silly descriptor of the picture from image prompt or slots
 * This creates a whimsical description of what's in the image
 */
export function generateSillyPictureDescriptor(
  imagePrompt: string | null,
  imageSlotsLabels: any | null
): string | null {
  if (!imagePrompt && !imageSlotsLabels) {
    return null
  }

  // Try to extract key elements from slots labels first (more structured)
  if (imageSlotsLabels) {
    const subjectRole = imageSlotsLabels.subject_role?.label
    const subjectTwist = imageSlotsLabels.subject_twist?.label
    const settingPlace = imageSlotsLabels.setting_place?.label
    const activity = imageSlotsLabels.activity?.label
    const styleReference = imageSlotsLabels.style_reference?.label

    // Build descriptor from slots - create a natural description
    let descriptor = ''
    
    // Build the main subject description
    if (subjectTwist && subjectRole) {
      descriptor = `${subjectTwist.toLowerCase()} ${subjectRole.toLowerCase()}`
    } else if (subjectRole) {
      descriptor = subjectRole.toLowerCase()
    }
    
    // Add activity if present
    if (activity) {
      if (descriptor) {
        descriptor += ` ${activity.toLowerCase()}`
      } else {
        descriptor = activity.toLowerCase()
      }
    }
    
    // Add setting
    if (settingPlace) {
      if (descriptor) {
        descriptor += ` in ${settingPlace.toLowerCase()}`
      } else {
        descriptor = `scene in ${settingPlace.toLowerCase()}`
      }
    }
    
    // Add style reference if no other content
    if (!descriptor && styleReference) {
      descriptor = `scene in ${styleReference.toLowerCase()} style`
    } else if (styleReference && descriptor) {
      descriptor += ` (${styleReference.toLowerCase()} style)`
    }

    if (descriptor) {
      // Make it silly and whimsical
      const sillyPrefixes = [
        'A whimsical',
        'An absurd',
        'A delightful',
        'A quirky',
        'A zany',
        'A wacky',
        'A surreal',
        'A fantastical',
        'A goofy',
        'A charming',
      ]
      const prefix = sillyPrefixes[Math.floor(Math.random() * sillyPrefixes.length)]
      return `${prefix} ${descriptor}`
    }
  }

  // Fallback: parse the image prompt string
  if (imagePrompt) {
    // Extract key phrases from the prompt
    // Prompts typically follow: "Style. Camera of Subject. They are in Setting at Time. Mood, colors, lighting."
    const prompt = imagePrompt.toLowerCase()
    
    // Try to extract subject role (e.g., "as hero", "as wizard", "as pilot")
    const roleMatch = prompt.match(/as (?:a |an )?([^,\.]+?)(?: in|,|\.|$)/)
    const role = roleMatch ? roleMatch[1].trim() : null
    
    // Try to extract setting (e.g., "in cozy library", "in space station")
    // Look for "in [setting]" pattern, avoiding "in an" or "in a" at the start
    const settingMatch = prompt.match(/in (?:a |an )?([^,\.]+?)(?: at| during|\.|$)/)
    const setting = settingMatch ? settingMatch[1].trim() : null
    
    // Try to extract common activity verbs
    const activityVerbs = ['flying', 'reading', 'standing', 'sitting', 'dancing', 'running', 'jumping', 'exploring', 'wandering', 'gazing', 'working', 'playing', 'creating', 'building', 'painting', 'drawing', 'writing', 'singing', 'listening', 'watching', 'studying', 'relaxing', 'resting', 'dreaming', 'traveling', 'journeying', 'adventuring', 'seeking', 'discovering', 'searching', 'finding', 'celebrating', 'contemplating', 'meditating']
    let activity: string | null = null
    for (const verb of activityVerbs) {
      const match = prompt.match(new RegExp(`${verb}(?:\\s+[^,\.]+?)?(?:,|\\.|$)`, 'i'))
      if (match) {
        activity = match[0].trim().replace(/[,\.]$/, '')
        break
      }
    }
    
    // Build descriptor
    const parts: string[] = []
    if (role) {
      parts.push(role)
    }
    if (activity) {
      parts.push(activity)
    }
    if (setting) {
      parts.push(`in ${setting}`)
    }

    if (parts.length > 0) {
      const sillyPrefixes = [
        'A whimsical',
        'An absurd',
        'A delightful',
        'A quirky',
        'A zany',
        'A wacky',
        'A surreal',
        'A fantastical',
        'A goofy',
        'A charming',
      ]
      const prefix = sillyPrefixes[Math.floor(Math.random() * sillyPrefixes.length)]
      return `${prefix} ${parts.join(' ')}`
    }
  }

  // Ultimate fallback: return a generic silly descriptor
  const genericDescriptors = [
    'A whimsical scene',
    'An absurd tableau',
    'A delightful moment',
    'A quirky composition',
    'A zany visual',
    'A wacky image',
    'A surreal picture',
    'A fantastical scene',
    'A goofy snapshot',
    'A charming view',
  ]
  return genericDescriptors[Math.floor(Math.random() * genericDescriptors.length)]
}

