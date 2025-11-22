-- Add new fields to must_reads table
DO $$ 
BEGIN
  -- Add category
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'must_reads' 
    AND column_name = 'category'
  ) THEN
    ALTER TABLE public.must_reads ADD COLUMN category TEXT;
    COMMENT ON COLUMN public.must_reads.category IS 'Category: Technology, Culture, Fun, Industry, Craft';
  END IF;

  -- Add source
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'must_reads' 
    AND column_name = 'source'
  ) THEN
    ALTER TABLE public.must_reads ADD COLUMN source TEXT;
    COMMENT ON COLUMN public.must_reads.source IS 'Source of the article (extracted from URL)';
  END IF;

  -- Add summary
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'must_reads' 
    AND column_name = 'summary'
  ) THEN
    ALTER TABLE public.must_reads ADD COLUMN summary TEXT;
    COMMENT ON COLUMN public.must_reads.summary IS 'AI-generated summary of the article';
  END IF;

  -- Add tags (stored as TEXT array)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'must_reads' 
    AND column_name = 'tags'
  ) THEN
    ALTER TABLE public.must_reads ADD COLUMN tags TEXT[] DEFAULT '{}';
    COMMENT ON COLUMN public.must_reads.tags IS 'AI-generated tags for the article (array of up to 3 tags)';
  END IF;
END $$;

