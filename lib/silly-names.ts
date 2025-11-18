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

