-- Add pronouns field to profiles table
-- Run this in your Supabase SQL Editor

-- Add pronouns column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'pronouns'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN pronouns TEXT;
  END IF;
END $$;

-- Verify column was added
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
  AND column_name = 'pronouns';

