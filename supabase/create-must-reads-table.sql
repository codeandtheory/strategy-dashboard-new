-- Must Reads table for storing articles and resources
CREATE TABLE IF NOT EXISTS public.must_reads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_title TEXT NOT NULL,
  article_url TEXT NOT NULL,
  notes TEXT,
  pinned BOOLEAN DEFAULT false,
  submitted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

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

