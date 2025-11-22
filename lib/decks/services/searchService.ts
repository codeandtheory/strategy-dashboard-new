import { getSupabaseClient } from '../config/supabaseClient'
import { embedText } from '../llm/embeddingService'

export interface SearchResult {
  type: 'topic' | 'slide'
  deck_id: string
  deck_title: string
  deck_gdrive_url?: string
  topic_id?: string
  slide_id?: string
  slide_number?: number
  summary: string
  score: number
}

export async function searchKeywordAndSemantic(
  query: string,
  options: { limit: number }
): Promise<SearchResult[]> {
  const supabase = getSupabaseClient()
  const limit = options.limit || 20

  // Generate embedding for semantic search
  let queryEmbedding: number[] | null = null
  try {
    queryEmbedding = await embedText(query)
  } catch (error) {
    console.warn('Failed to generate query embedding, falling back to keyword search only:', error)
  }

  const results: SearchResult[] = []

  // Keyword search on decks
  const { data: keywordDecks } = await supabase
    .from('decks')
    .select('id, title, deck_summary, gdrive_file_url')
    .or(`title.ilike.%${query}%,deck_summary.ilike.%${query}%`)
    .limit(limit)

  if (keywordDecks) {
    for (const deck of keywordDecks as Array<{
      id: string
      title: string
      deck_summary: string | null
      gdrive_file_url: string | null
    }>) {
      results.push({
        type: 'topic',
        deck_id: deck.id,
        deck_title: deck.title,
        deck_gdrive_url: deck.gdrive_file_url || undefined,
        summary: deck.deck_summary || deck.title,
        score: 0.8, // Keyword match score
      })
    }
  }

  // Keyword search on topics
  const { data: keywordTopics } = await supabase
    .from('topics')
    .select('id, deck_id, topic_title, topic_summary, decks!inner(title, gdrive_file_url)')
    .or(`topic_title.ilike.%${query}%,topic_summary.ilike.%${query}%`)
    .limit(limit)

  if (keywordTopics) {
    for (const topic of keywordTopics as Array<{
      id: string
      deck_id: string
      topic_title: string
      topic_summary: string
      decks: { title: string; gdrive_file_url: string | null }
    }>) {
      const deck = topic.decks
      results.push({
        type: 'topic',
        deck_id: topic.deck_id,
        deck_title: deck.title,
        deck_gdrive_url: deck.gdrive_file_url || undefined,
        topic_id: topic.id,
        summary: topic.topic_summary || topic.topic_title,
        score: 0.9, // Topic keyword match
      })
    }
  }

  // Keyword search on slides
  const { data: keywordSlides } = await supabase
    .from('slides')
    .select('id, deck_id, slide_number, slide_caption, decks!inner(title, gdrive_file_url)')
    .ilike('slide_caption', `%${query}%`)
    .limit(limit)

  if (keywordSlides) {
    for (const slide of keywordSlides as Array<{
      id: string
      deck_id: string
      slide_number: number
      slide_caption: string | null
      decks: { title: string; gdrive_file_url: string | null }
    }>) {
      const deck = slide.decks
      results.push({
        type: 'slide',
        deck_id: slide.deck_id,
        deck_title: deck.title,
        deck_gdrive_url: deck.gdrive_file_url || undefined,
        slide_id: slide.id,
        slide_number: slide.slide_number,
        summary: slide.slide_caption || `Slide ${slide.slide_number}`,
        score: 0.85, // Slide keyword match
      })
    }
  }

  // Semantic search on topics if embedding is available
  if (queryEmbedding) {
    const { data: semanticTopics } = await (supabase.rpc as any)('match_topics', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: limit,
    })

    if (semanticTopics) {
      for (const topic of semanticTopics as Array<{
        id: string
        deck_id: string
        deck_title: string
        deck_gdrive_url: string | null
        topic_summary: string
        topic_title: string
        similarity: number
      }>) {
        results.push({
          type: 'topic',
          deck_id: topic.deck_id,
          deck_title: topic.deck_title,
          deck_gdrive_url: topic.deck_gdrive_url || undefined,
          topic_id: topic.id,
          summary: topic.topic_summary || topic.topic_title,
          score: topic.similarity || 0.5,
        })
      }
    }

    // Semantic search on slides
    const { data: semanticSlides } = await (supabase.rpc as any)('match_slides', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: limit,
    })

    if (semanticSlides) {
      for (const slide of semanticSlides as Array<{
        id: string
        deck_id: string
        deck_title: string
        deck_gdrive_url: string | null
        slide_number: number
        slide_caption: string | null
        similarity: number
      }>) {
        results.push({
          type: 'slide',
          deck_id: slide.deck_id,
          deck_title: slide.deck_title,
          deck_gdrive_url: slide.deck_gdrive_url || undefined,
          slide_id: slide.id,
          slide_number: slide.slide_number,
          summary: slide.slide_caption || `Slide ${slide.slide_number}`,
          score: slide.similarity || 0.5,
        })
      }
    }
  }

  // Deduplicate and sort by score
  const uniqueResults = new Map<string, SearchResult>()
  for (const result of results) {
    const key = `${result.type}-${result.topic_id || result.slide_id || result.deck_id}`
    const existing = uniqueResults.get(key)
    if (!existing || result.score > existing.score) {
      uniqueResults.set(key, result)
    }
  }

  return Array.from(uniqueResults.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

