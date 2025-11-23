-- Add is_active field to profiles table
-- Run this in your Supabase SQL Editor

-- Add is_active column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'is_active'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN is_active BOOLEAN DEFAULT true;
    COMMENT ON COLUMN public.profiles.is_active IS 'Whether the user is currently active (default: true)';
    
    -- Set all existing users to active by default
    UPDATE public.profiles SET is_active = true WHERE is_active IS NULL;
  END IF;
END $$;

-- Verify column was added
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
  AND column_name = 'is_active';

