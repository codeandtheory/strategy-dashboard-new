-- Add optional preference fields to profiles table for horoscope image personalization
-- These fields are optional and can be added later when user preferences are implemented

DO $$ 
BEGIN
  -- Add likes_fantasy
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'likes_fantasy'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN likes_fantasy BOOLEAN DEFAULT false;
  END IF;

  -- Add likes_scifi
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'likes_scifi'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN likes_scifi BOOLEAN DEFAULT false;
  END IF;

  -- Add likes_cute
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'likes_cute'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN likes_cute BOOLEAN DEFAULT false;
  END IF;

  -- Add likes_minimal
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'likes_minimal'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN likes_minimal BOOLEAN DEFAULT false;
  END IF;

  -- Add hates_clowns
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'hates_clowns'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN hates_clowns BOOLEAN DEFAULT false;
  END IF;

  -- Add hobbies as JSONB array
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'hobbies'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN hobbies JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

