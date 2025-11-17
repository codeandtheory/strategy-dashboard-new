/**
 * Fetch daily horoscope from Cafe Astrology
 * URL format: https://cafeastrology.com/{sign}dailyhoroscope.html
 */
export async function fetchCafeAstrologyHoroscope(starSign: string): Promise<string> {
  // Map star signs to Cafe Astrology URL format (lowercase)
  const signMap: Record<string, string> = {
    'Aries': 'aries',
    'Taurus': 'taurus',
    'Gemini': 'gemini',
    'Cancer': 'cancer',
    'Leo': 'leo',
    'Virgo': 'virgo',
    'Libra': 'libra',
    'Scorpio': 'scorpio',
    'Sagittarius': 'sagittarius',
    'Capricorn': 'capricorn',
    'Aquarius': 'aquarius',
    'Pisces': 'pisces',
  }
  
  const signSlug = signMap[starSign] || starSign.toLowerCase()
  const url = `https://cafeastrology.com/${signSlug}dailyhoroscope.html`
  
  console.log('Fetching horoscope from Cafe Astrology:', url)
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch horoscope: ${response.status} ${response.statusText}`)
    }
    
    const html = await response.text()
    
    // Parse the HTML to extract the daily horoscope text
    // The horoscope is typically in a paragraph after "Today's {Sign} Horoscope from Cafe Astrology"
    let horoscopeText = ''
    
    // Method 1: Look for the date pattern and extract text after it
    const datePattern = /(November|December|January|February|March|April|May|June|July|August|September|October)\s+\d{1,2},\s+\d{4}/
    const dateMatch = html.match(datePattern)
    
    if (dateMatch) {
      const dateIndex = html.indexOf(dateMatch[0])
      const afterDate = html.substring(dateIndex + dateMatch[0].length)
      
      // Extract text until we hit another section or the "Creativity:" line
      const nextSection = afterDate.match(/<(h[1-6]|div class|section|nav|footer|Creativity:)/i)
      const endIndex = nextSection ? afterDate.indexOf(nextSection[0]) : Math.min(afterDate.length, 2000)
      
      let extracted = afterDate.substring(0, endIndex)
      // Remove HTML tags
      extracted = extracted.replace(/<[^>]*>/g, ' ')
      // Remove script and style content
      extracted = extracted.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
      extracted = extracted.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
      // Clean up whitespace
      extracted = extracted.replace(/\s+/g, ' ').trim()
      
      // Find the actual horoscope text (usually the longest paragraph)
      // Split by common separators and find the longest meaningful text
      const sentences = extracted.split(/[.!?]\s+/).filter(s => s.length > 50)
      if (sentences.length > 0) {
        // Take the first few sentences that form a coherent horoscope
        horoscopeText = sentences.slice(0, 5).join('. ').trim()
        if (horoscopeText && !horoscopeText.endsWith('.')) {
          horoscopeText += '.'
        }
      }
    }
    
    // Method 2: Look for paragraph tags with substantial content
    if (!horoscopeText || horoscopeText.length < 200) {
      const paragraphMatches = html.match(/<p[^>]*>([^<]+(?:<[^>]+>[^<]+<\/[^>]+>[^<]+)*)<\/p>/gi)
      if (paragraphMatches) {
        for (const match of paragraphMatches) {
          let text = match.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
          // Look for substantial paragraphs that don't contain navigation
          if (text.length > 200 && 
              !text.includes('Yesterday') && 
              !text.includes('Tomorrow') &&
              !text.includes('Choose Another Sign') &&
              !text.includes('More') &&
              !text.match(/^Creativity:|^Love:|^Business:/i) &&
              !text.includes('Aries Sun Dates')) {
            horoscopeText = text
            break
          }
        }
      }
    }
    
    if (!horoscopeText) {
      throw new Error('Could not extract horoscope text from Cafe Astrology page')
    }
    
    console.log('Successfully fetched horoscope from Cafe Astrology')
    return horoscopeText
  } catch (error: any) {
    console.error('Error fetching from Cafe Astrology:', error)
    throw new Error(`Failed to fetch horoscope from Cafe Astrology: ${error.message}`)
  }
}

