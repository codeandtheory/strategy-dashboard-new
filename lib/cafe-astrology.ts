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
    // Add timeout to prevent hanging (10 seconds for Cafe Astrology fetch)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
      console.log('⏱️ Cafe Astrology fetch timeout after 10 seconds')
    }, 10000)
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        cache: 'no-store', // Don't cache in API routes
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
    
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
      // Try to find all paragraph content
      const allText = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
                          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
                          .replace(/<[^>]+>/g, ' ')
                          .replace(/\s+/g, ' ')
                          .trim()
      
      // Look for the horoscope text after the date
      if (dateMatch) {
        const dateText = dateMatch[0]
        const dateIndex = allText.indexOf(dateText)
        if (dateIndex !== -1) {
          const afterDate = allText.substring(dateIndex + dateText.length)
          // Find text until we hit keywords that indicate the end
          const endMarkers = ['Creativity:', 'Love:', 'Business:', 'Yesterday', 'Tomorrow', 'Choose Another Sign']
          let endIndex = afterDate.length
          for (const marker of endMarkers) {
            const markerIndex = afterDate.indexOf(marker)
            if (markerIndex !== -1 && markerIndex < endIndex) {
              endIndex = markerIndex
            }
          }
          
          const extracted = afterDate.substring(0, endIndex).trim()
          if (extracted.length > 200) {
            horoscopeText = extracted
          }
        }
      }
    }
    
    // Method 3: Look for paragraph tags with substantial content
    if (!horoscopeText || horoscopeText.length < 200) {
      const paragraphMatches = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi)
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
              !text.includes('Aries Sun Dates') &&
              !text.includes('Sun Dates:')) {
            horoscopeText = text
            break
          }
        }
      }
    }
    
    if (!horoscopeText || horoscopeText.length < 100) {
      console.error('Failed to extract horoscope. HTML length:', html.length)
      throw new Error(`Could not extract horoscope text from Cafe Astrology page. Found text length: ${horoscopeText?.length || 0}`)
    }
    
    console.log('Successfully fetched horoscope from Cafe Astrology')
    return horoscopeText
  } catch (error: any) {
    console.error('Error fetching from Cafe Astrology:', error)
    throw new Error(`Failed to fetch horoscope from Cafe Astrology: ${error.message}`)
  }
}

