-- Migration: Add birthday, discipline, and role fields to profiles table
-- Run this in your Supabase SQL Editor if the columns don't exist

-- Add birthday column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'birthday'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN birthday TEXT;
    COMMENT ON COLUMN public.profiles.birthday IS 'Stored as "MM/DD" format (e.g., "03/15" for March 15th)';
  END IF;
END $$;

-- Add discipline column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'discipline'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN discipline TEXT;
    COMMENT ON COLUMN public.profiles.discipline IS 'Department/team (e.g., "Design", "Engineering", "Marketing")';
  END IF;
END $$;

-- Drop any existing check constraint on role column in profiles table if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' 
    AND table_name = 'profiles' 
    AND constraint_name = 'profiles_role_check'
  ) THEN
    ALTER TABLE public.profiles DROP CONSTRAINT profiles_role_check;
    RAISE NOTICE 'Dropped profiles_role_check constraint';
  END IF;
END $$;

-- Add role column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN role TEXT;
    COMMENT ON COLUMN public.profiles.role IS 'Job title/role (e.g., "Creative Director", "Senior Engineer")';
    RAISE NOTICE 'Added role column to profiles table';
  ELSE
    -- Column exists - just add/update comment, don't alter type to avoid policy conflicts
    COMMENT ON COLUMN public.profiles.role IS 'Job title/role (e.g., "Creative Director", "Senior Engineer")';
    RAISE NOTICE 'Role column already exists in profiles table';
  END IF;
END $$;

-- Verify columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
  AND column_name IN ('birthday', 'discipline', 'role')
ORDER BY column_name;

