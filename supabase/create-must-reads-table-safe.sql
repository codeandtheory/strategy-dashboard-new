-- Safe migration for Must Reads table
-- This will create the table if it doesn't exist, or add missing columns if it does

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.must_reads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Add columns if they don't exist
DO $$ 
BEGIN
  -- Add article_title
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'must_reads' 
    AND column_name = 'article_title'
  ) THEN
    ALTER TABLE public.must_reads ADD COLUMN article_title TEXT NOT NULL DEFAULT '';
  END IF;

  -- Add article_url
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'must_reads' 
    AND column_name = 'article_url'
  ) THEN
    ALTER TABLE public.must_reads ADD COLUMN article_url TEXT NOT NULL DEFAULT '';
  END IF;

  -- Add notes
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'must_reads' 
    AND column_name = 'notes'
  ) THEN
    ALTER TABLE public.must_reads ADD COLUMN notes TEXT;
  END IF;

  -- Add pinned
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'must_reads' 
    AND column_name = 'pinned'
  ) THEN
    ALTER TABLE public.must_reads ADD COLUMN pinned BOOLEAN DEFAULT false;
  END IF;

  -- Add submitted_by
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'must_reads' 
    AND column_name = 'submitted_by'
  ) THEN
    ALTER TABLE public.must_reads ADD COLUMN submitted_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
    -- Make it NOT NULL after adding (if table is empty)
    ALTER TABLE public.must_reads ALTER COLUMN submitted_by SET NOT NULL;
  END IF;

  -- Add assigned_to
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'must_reads' 
    AND column_name = 'assigned_to'
  ) THEN
    ALTER TABLE public.must_reads ADD COLUMN assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
  END IF;

  -- Add updated_at
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'must_reads' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.must_reads ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL;
  END IF;
END $$;

-- Remove default values from NOT NULL columns (if they were added)
ALTER TABLE public.must_reads ALTER COLUMN article_title DROP DEFAULT;
ALTER TABLE public.must_reads ALTER COLUMN article_url DROP DEFAULT;

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_must_reads_submitted_by ON public.must_reads(submitted_by);
CREATE INDEX IF NOT EXISTS idx_must_reads_assigned_to ON public.must_reads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_must_reads_pinned ON public.must_reads(pinned);
CREATE INDEX IF NOT EXISTS idx_must_reads_created_at ON public.must_reads(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.must_reads ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all must reads" ON public.must_reads;
DROP POLICY IF EXISTS "Users can insert must reads" ON public.must_reads;
DROP POLICY IF EXISTS "Users can update must reads" ON public.must_reads;
DROP POLICY IF EXISTS "Users can delete must reads" ON public.must_reads;

-- Users can view all must reads (read-only for all authenticated users)
CREATE POLICY "Users can view all must reads"
  ON public.must_reads FOR SELECT
  USING (auth.role() = 'authenticated');

-- Users can insert must reads (any authenticated user can add)
CREATE POLICY "Users can insert must reads"
  ON public.must_reads FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Users can update must reads (any authenticated user can update)
CREATE POLICY "Users can update must reads"
  ON public.must_reads FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Users can delete must reads (any authenticated user can delete)
CREATE POLICY "Users can delete must reads"
  ON public.must_reads FOR DELETE
  USING (auth.role() = 'authenticated');

