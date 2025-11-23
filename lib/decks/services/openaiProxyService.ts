/**
 * Proxy service for OpenAI API calls through n8n or Elvex
 * This allows processing to happen through external services to avoid rate limits
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
 * Call OpenAI chat completion through proxy (n8n/Elvex)
 */
export async function proxyChatCompletion(
  request: ChatCompletionRequest
): Promise<ChatCompletionResponse> {
  const config = getEnv()

  if (!config.openaiProxyUrl) {
    throw new Error('OPENAI_PROXY_URL is not configured')
  }

  try {
    const response = await fetch(config.openaiProxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'chat',
        ...request,
      }),
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
 * Call OpenAI embeddings through proxy (n8n/Elvex)
 */
export async function proxyEmbedding(
  request: EmbeddingRequest
): Promise<EmbeddingResponse> {
  const config = getEnv()

  if (!config.openaiProxyUrl) {
    throw new Error('OPENAI_PROXY_URL is not configured')
  }

  try {
    const response = await fetch(config.openaiProxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'embedding',
        ...request,
      }),
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

