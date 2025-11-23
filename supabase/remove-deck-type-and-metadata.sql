-- Remove deck_type and type_metadata columns (reverting unified type system)
-- This makes the system work-sample specific

-- Remove type_metadata column
ALTER TABLE decks 
DROP COLUMN IF EXISTS type_metadata;

-- Remove deck_type column (will default existing rows)
ALTER TABLE decks 
DROP COLUMN IF EXISTS deck_type;

-- Drop indexes
DROP INDEX IF EXISTS decks_type_idx;
DROP INDEX IF EXISTS decks_type_metadata_idx;

-- Revert match_topics function to original (remove deck_type from results)
CREATE OR REPLACE FUNCTION match_topics(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  deck_id uuid,
  topic_title text,
  topic_summary text,
  story_context text,
  topics text[],
  reuse_suggestions text[],
  slide_numbers int[],
  similarity float,
  deck_title text
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.deck_id,
    t.topic_title,
    t.topic_summary,
    t.story_context,
    t.topics,
    t.reuse_suggestions,
    t.slide_numbers,
    1 - (t.embedding <=> query_embedding) AS similarity,
    d.title AS deck_title
  FROM topics t
  INNER JOIN decks d ON t.deck_id = d.id
  WHERE t.embedding IS NOT NULL
    AND 1 - (t.embedding <=> query_embedding) > match_threshold
  ORDER BY t.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Revert match_slides function to original (remove deck_type from results)
CREATE OR REPLACE FUNCTION match_slides(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  deck_id uuid,
  slide_number int,
  slide_caption text,
  slide_type text,
  topics text[],
  reusable text,
  similarity float,
  deck_title text
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.deck_id,
    s.slide_number,
    s.slide_caption,
    s.slide_type,
    s.topics,
    s.reusable,
    1 - (s.embedding <=> query_embedding) AS similarity,
    d.title AS deck_title
  FROM slides s
  INNER JOIN decks d ON s.deck_id = d.id
  WHERE s.embedding IS NOT NULL
    AND 1 - (s.embedding <=> query_embedding) > match_threshold
  ORDER BY s.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;


