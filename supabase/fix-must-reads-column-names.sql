-- Fix must_reads table column names
-- This migration renames columns to match the API expectations

DO $$ 
BEGIN
  -- Rename 'title' to 'article_title' if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'must_reads' 
    AND column_name = 'title'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'must_reads' 
    AND column_name = 'article_title'
  ) THEN
    ALTER TABLE public.must_reads RENAME COLUMN title TO article_title;
  END IF;

  -- Rename 'url' to 'article_url' if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'must_reads' 
    AND column_name = 'url'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'must_reads' 
    AND column_name = 'article_url'
  ) THEN
    ALTER TABLE public.must_reads RENAME COLUMN url TO article_url;
  END IF;

  -- If both old and new columns exist, drop the old ones (after migrating data if needed)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'must_reads' 
    AND column_name = 'title'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'must_reads' 
    AND column_name = 'article_title'
  ) THEN
    -- Copy data from title to article_title if article_title is null
    UPDATE public.must_reads 
    SET article_title = title 
    WHERE article_title IS NULL OR article_title = '';
    
    -- Drop the old title column
    ALTER TABLE public.must_reads DROP COLUMN title;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'must_reads' 
    AND column_name = 'url'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'must_reads' 
    AND column_name = 'article_url'
  ) THEN
    -- Copy data from url to article_url if article_url is null
    UPDATE public.must_reads 
    SET article_url = url 
    WHERE article_url IS NULL OR article_url = '';
    
    -- Drop the old url column
    ALTER TABLE public.must_reads DROP COLUMN url;
  END IF;
END $$;

