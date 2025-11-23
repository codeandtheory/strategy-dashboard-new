-- Snaps table for storing recognition/snap messages
CREATE TABLE IF NOT EXISTS public.snaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Add columns if they don't exist
DO $$ 
BEGIN
  -- Add date
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'snaps' 
    AND column_name = 'date'
  ) THEN
    ALTER TABLE public.snaps ADD COLUMN date DATE NOT NULL DEFAULT CURRENT_DATE;
  END IF;

  -- Add snap_content
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'snaps' 
    AND column_name = 'snap_content'
  ) THEN
    ALTER TABLE public.snaps ADD COLUMN snap_content TEXT NOT NULL DEFAULT '';
  END IF;

  -- Add mentioned
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'snaps' 
    AND column_name = 'mentioned'
  ) THEN
    ALTER TABLE public.snaps ADD COLUMN mentioned TEXT;
  END IF;

  -- Add mentioned_user_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'snaps' 
    AND column_name = 'mentioned_user_id'
  ) THEN
    ALTER TABLE public.snaps ADD COLUMN mentioned_user_id UUID;
  END IF;

  -- Add foreign key constraint for mentioned_user_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' 
    AND table_name = 'snaps' 
    AND constraint_name = 'snaps_mentioned_user_id_fkey'
  ) THEN
    ALTER TABLE public.snaps 
      ADD CONSTRAINT snaps_mentioned_user_id_fkey 
      FOREIGN KEY (mentioned_user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
  END IF;

  -- Add submitted_by
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'snaps' 
    AND column_name = 'submitted_by'
  ) THEN
    ALTER TABLE public.snaps ADD COLUMN submitted_by UUID;
  END IF;

  -- Add foreign key constraint for submitted_by if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' 
    AND table_name = 'snaps' 
    AND constraint_name = 'snaps_submitted_by_fkey'
  ) THEN
    ALTER TABLE public.snaps 
      ADD CONSTRAINT snaps_submitted_by_fkey 
      FOREIGN KEY (submitted_by) REFERENCES public.profiles(id) ON DELETE SET NULL;
  END IF;

  -- Add updated_at
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'snaps' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.snaps ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL;
  END IF;
END $$;

-- Remove default values from NOT NULL columns (if they were added)
DO $$ 
BEGIN
  ALTER TABLE public.snaps ALTER COLUMN snap_content DROP DEFAULT;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_snaps_mentioned_user_id ON public.snaps(mentioned_user_id);
CREATE INDEX IF NOT EXISTS idx_snaps_submitted_by ON public.snaps(submitted_by);
CREATE INDEX IF NOT EXISTS idx_snaps_date ON public.snaps(date DESC);
CREATE INDEX IF NOT EXISTS idx_snaps_created_at ON public.snaps(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.snaps ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all snaps" ON public.snaps;
DROP POLICY IF EXISTS "Users can insert snaps" ON public.snaps;
DROP POLICY IF EXISTS "Users can update snaps" ON public.snaps;
DROP POLICY IF EXISTS "Users can delete snaps" ON public.snaps;

-- Users can view all snaps (read-only for all authenticated users)
CREATE POLICY "Users can view all snaps"
  ON public.snaps FOR SELECT
  USING (auth.role() = 'authenticated');

-- Users can insert snaps (any authenticated user can add)
CREATE POLICY "Users can insert snaps"
  ON public.snaps FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Users can update snaps (any authenticated user can update)
CREATE POLICY "Users can update snaps"
  ON public.snaps FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Users can delete snaps (any authenticated user can delete)
CREATE POLICY "Users can delete snaps"
  ON public.snaps FOR DELETE
  USING (auth.role() = 'authenticated');

