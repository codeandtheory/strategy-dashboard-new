import OpenAI from 'openai'
import { getEnv } from './env'

let openaiClient: OpenAI | null = null
let fallbackClient: OpenAI | null = null

export function getOpenAIClient(useFallback = false) {
  const config = getEnv()
  
  if (useFallback) {
    if (!config.openaiApiKeyFallback) {
      throw new Error('Fallback OpenAI API key not configured')
    }
    if (!fallbackClient) {
      fallbackClient = new OpenAI({
        apiKey: config.openaiApiKeyFallback,
      })
    }
    return fallbackClient
  }

  if (openaiClient) {
    return openaiClient
  }

  openaiClient = new OpenAI({
    apiKey: config.openaiApiKey,
  })

  return openaiClient
}

/**
 * Call OpenAI with automatic fallback to secondary API key on quota errors
 * Or use proxy (n8n/Elvex) if configured
 */
export async function callOpenAIWithFallback<T>(
  apiCall: (client: OpenAI) => Promise<T>
): Promise<T> {
  const config = getEnv()
  
  // If proxy is configured, we'll handle it in the service layer
  // This function is for direct OpenAI calls with fallback
  
  try {
    const client = getOpenAIClient(false)
    return await apiCall(client)
  } catch (error: any) {
    // If we get a 429 (quota exceeded) or 401 (invalid key) and have a fallback, try it
    if (
      (error?.status === 429 || error?.status === 401 || error?.message?.includes('quota')) &&
      config.openaiApiKeyFallback
    ) {
      console.log('Primary OpenAI API key failed, trying fallback key...')
      const fallbackClient = getOpenAIClient(true)
      return await apiCall(fallbackClient)
    }
    throw error
  }
}

