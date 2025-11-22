/**
 * Converts an image URL to ASCII art
 * @param imageUrl - URL of the image to convert
 * @param width - Width of ASCII art in characters (default: 60)
 * @param height - Height of ASCII art in characters (default: 30)
 * @returns Promise<string> - ASCII art representation of the image
 */
export async function imageToAscii(
  imageUrl: string,
  width: number = 60,
  height: number = 30
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      try {
        // Create a canvas to draw the image
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }
        
        // Set canvas size to match desired ASCII dimensions
        canvas.width = width
        canvas.height = height
        
        // Draw the image to the canvas (scaled down)
        ctx.drawImage(img, 0, 0, width, height)
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, width, height)
        const data = imageData.data
        
        // ASCII characters from darkest to lightest
        const asciiChars = '@%#*+=-:. '
        
        let asciiArt = ''
        
        // Process each pixel
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4
            
            // Get RGB values
            const r = data[index]
            const g = data[index + 1]
            const b = data[index + 2]
            
            // Calculate brightness (luminance formula)
            const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255
            
            // Map brightness to ASCII character
            const charIndex = Math.floor(brightness * (asciiChars.length - 1))
            const char = asciiChars[charIndex]
            
            asciiArt += char
          }
          asciiArt += '\n'
        }
        
        resolve(asciiArt)
      } catch (error) {
        reject(error)
      }
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    img.src = imageUrl
  })
}

