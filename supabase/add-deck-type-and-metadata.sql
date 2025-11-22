-- Add deck_type and type-specific metadata to decks table
-- This allows unified uploads with type-based routing

-- Add deck_type column
ALTER TABLE decks 
ADD COLUMN IF NOT EXISTS deck_type TEXT NOT NULL DEFAULT 'agency_deck';

-- Add type-specific metadata (JSONB for flexibility)
ALTER TABLE decks
ADD COLUMN IF NOT EXISTS type_metadata JSONB DEFAULT '{}';

-- Add index for deck_type
CREATE INDEX IF NOT EXISTS decks_type_idx ON decks(deck_type);

-- Add index for type_metadata (GIN index for JSONB queries)
CREATE INDEX IF NOT EXISTS decks_type_metadata_idx ON decks USING gin(type_metadata);

-- Update the match_topics function to include deck_type
CREATE OR REPLACE FUNCTION match_topics(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10,
  filter_type TEXT DEFAULT NULL
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
  deck_title text,
  deck_type text
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
    d.title AS deck_title,
    d.deck_type
  FROM topics t
  INNER JOIN decks d ON t.deck_id = d.id
  WHERE t.embedding IS NOT NULL
    AND 1 - (t.embedding <=> query_embedding) > match_threshold
    AND (filter_type IS NULL OR d.deck_type = filter_type)
  ORDER BY t.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Update the match_slides function to include deck_type
CREATE OR REPLACE FUNCTION match_slides(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10,
  filter_type TEXT DEFAULT NULL
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
  deck_title text,
  deck_type text
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
    d.title AS deck_title,
    d.deck_type
  FROM slides s
  INNER JOIN decks d ON s.deck_id = d.id
  WHERE s.embedding IS NOT NULL
    AND 1 - (s.embedding <=> query_embedding) > match_threshold
    AND (filter_type IS NULL OR d.deck_type = filter_type)
  ORDER BY s.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Add comment for documentation
COMMENT ON COLUMN decks.deck_type IS 'Type of deck: work_sample, agency_deck, through_leadership, must_read, etc.';
COMMENT ON COLUMN decks.type_metadata IS 'Type-specific metadata stored as JSON (e.g., client, author_id, project_name for work samples)';

