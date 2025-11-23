import { getOpenAIClient, callOpenAIWithFallback } from '../config/openaiClient'
import { getEnv } from '../config/env'
import { proxyEmbedding } from '../services/openaiProxyService'

const MAX_EMBEDDING_TEXT_LENGTH = 8000 // Conservative limit for text-embedding-3-small

export async function embedText(text: string): Promise<number[]> {
  if (!text || text.trim().length === 0) {
    throw new Error('Text cannot be empty for embedding')
  }

  const config = getEnv()

  // Truncate text if needed
  let truncatedText = text
  if (text.length > MAX_EMBEDDING_TEXT_LENGTH) {
    truncatedText = text.substring(0, MAX_EMBEDDING_TEXT_LENGTH)
  }

  try {
    let response: any

    // Use proxy if configured (n8n/Elvex), otherwise use direct OpenAI
    if (config.openaiProxyUrl) {
      console.log('Using proxy for OpenAI embedding:', config.openaiProxyUrl)
      response = await proxyEmbedding({
        model: config.openaiEmbeddingModel,
        input: truncatedText,
      })
    } else {
      response = await callOpenAIWithFallback(async (openai) => {
        return await openai.embeddings.create({
          model: config.openaiEmbeddingModel,
          input: truncatedText,
        })
      })
    }

    const embedding = response.data[0]?.embedding
    if (!embedding || embedding.length !== 1536) {
      throw new Error(`Invalid embedding response: expected 1536 dimensions, got ${embedding?.length || 0}`)
    }

    return embedding
  } catch (error: any) {
    console.error('Error generating embedding:', error)
    throw new Error(`Failed to generate embedding: ${error.message || 'Unknown error'}`)
  }
}

