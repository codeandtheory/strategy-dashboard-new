/**
 * Proxy service for OpenAI API calls through Elvex (or n8n)
 * This allows processing to happen through external services to avoid rate limits
 * 
 * Elvex is a simple API proxy that forwards requests directly to OpenAI.
 * The proxy accepts OpenAI's native format and returns OpenAI's native format.
 */

import { getEnv } from '../config/env'

export interface ChatCompletionRequest {
  model: string
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
  response_format?: { type: 'json_object' }
  temperature?: number
  max_tokens?: number
}

export interface ChatCompletionResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export interface EmbeddingRequest {
  model: string
  input: string | string[]
}

export interface EmbeddingResponse {
  data: Array<{
    embedding: number[]
  }>
}

/**
 * Call OpenAI chat completion through proxy (Elvex/n8n)
 * 
 * Elvex expects OpenAI's native format directly.
 * For n8n, we wrap it with a "type" field.
 */
export async function proxyChatCompletion(
  request: ChatCompletionRequest
): Promise<ChatCompletionResponse> {
  const config = getEnv()

  if (!config.openaiProxyUrl) {
    throw new Error('OPENAI_PROXY_URL is not configured')
  }

  try {
    // Check if this is Elvex (simple proxy) or n8n (needs type wrapper)
    // Elvex typically uses /v1/chat/completions endpoint pattern
    const isElvex = config.openaiProxyUrl.includes('/v1/chat/completions') || 
                    config.openaiProxyUrl.includes('elvex')
    
    const requestBody = isElvex 
      ? request  // Elvex: send OpenAI format directly
      : { type: 'chat', ...request }  // n8n: wrap with type field

    const response = await fetch(config.openaiProxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Proxy API call failed: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    return result
  } catch (error: any) {
    console.error('Error calling proxy for chat completion:', error)
    throw new Error(`Failed to call proxy API: ${error.message || 'Unknown error'}`)
  }
}

/**
 * Call OpenAI embeddings through proxy (Elvex/n8n)
 * 
 * Note: For embeddings, you may need separate endpoints for Elvex.
 * Elvex typically requires separate URLs for chat vs embeddings.
 */
export async function proxyEmbedding(
  request: EmbeddingRequest
): Promise<EmbeddingResponse> {
  const config = getEnv()

  if (!config.openaiProxyUrl) {
    throw new Error('OPENAI_PROXY_URL is not configured')
  }

  try {
    // Check if this is Elvex (simple proxy) or n8n (needs type wrapper)
    const isElvex = config.openaiProxyUrl.includes('/v1/embeddings') || 
                    config.openaiProxyUrl.includes('elvex')
    
    // For Elvex embeddings, you might need a separate endpoint
    // If using the same URL, Elvex should handle routing based on the request body
    const embeddingUrl = isElvex && config.openaiProxyUrl.includes('/v1/chat/completions')
      ? config.openaiProxyUrl.replace('/v1/chat/completions', '/v1/embeddings')
      : config.openaiProxyUrl

    const requestBody = isElvex 
      ? request  // Elvex: send OpenAI format directly
      : { type: 'embedding', ...request }  // n8n: wrap with type field

    const response = await fetch(embeddingUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Proxy API call failed: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    return result
  } catch (error: any) {
    console.error('Error calling proxy for embedding:', error)
    throw new Error(`Failed to call proxy API: ${error.message || 'Unknown error'}`)
  }
}

