-- Add skipped field to curator_assignments table
-- This marks assignments that were skipped (won't count toward curator count)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'curator_assignments' 
    AND column_name = 'skipped'
  ) THEN
    ALTER TABLE public.curator_assignments 
    ADD COLUMN skipped BOOLEAN DEFAULT false;
    
    COMMENT ON COLUMN public.curator_assignments.skipped IS 'True if curator skipped this assignment (does not count toward curator count)';
  END IF;
END $$;

-- Add exclude_from_curator_rotation field to profiles table
-- This removes someone from the curator rotation pool entirely
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'exclude_from_curator_rotation'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN exclude_from_curator_rotation BOOLEAN DEFAULT false;
    
    COMMENT ON COLUMN public.profiles.exclude_from_curator_rotation IS 'True if person should be excluded from curator rotation pool';
  END IF;
END $$;

-- Create index on skipped field for faster queries
CREATE INDEX IF NOT EXISTS idx_curator_assignments_skipped 
ON public.curator_assignments(skipped) 
WHERE skipped = true;

-- Create index on exclude_from_curator_rotation field
CREATE INDEX IF NOT EXISTS idx_profiles_exclude_from_curator_rotation 
ON public.profiles(exclude_from_curator_rotation) 
WHERE exclude_from_curator_rotation = true;

