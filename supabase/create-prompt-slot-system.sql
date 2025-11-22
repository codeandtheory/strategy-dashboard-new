-- Create prompt slot catalog system for horoscope image generation
-- This migration creates tables for style groups, prompt slot catalogs, and user avatar state tracking

-- Style groups table - groups styles into high-level categories
CREATE TABLE IF NOT EXISTS public.style_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE, -- "illustration_2D", "traditional", "digital_retro", "digital_modern"
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Prompt slot catalogs - stores all possible values for each prompt slot
CREATE TABLE IF NOT EXISTS public.prompt_slot_catalogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_type TEXT NOT NULL, -- "style_medium", "style_reference", "subject_role", "subject_twist", "setting_place", "setting_time", "activity", "mood_vibe", "color_palette", "camera_frame", "lighting_style", "constraints"
  value TEXT NOT NULL, -- The actual value (e.g., "watercolor", "Adventure Time style", "wizard")
  label TEXT NOT NULL, -- Human-readable label
  style_group_id UUID REFERENCES public.style_groups(id) ON DELETE SET NULL, -- For style_reference items
  compatible_mediums JSONB DEFAULT '[]'::jsonb, -- Array of style_medium IDs that work with this style_reference
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(slot_type, value)
);

-- User avatar state - tracks recent choices to avoid repeats
CREATE TABLE IF NOT EXISTS public.user_avatar_state (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_generated_date DATE, -- Last date an avatar was generated
  recent_style_group_ids JSONB DEFAULT '[]'::jsonb, -- Array of style_group IDs used in last N days
  recent_style_reference_ids JSONB DEFAULT '[]'::jsonb, -- Array of style_reference catalog IDs
  recent_subject_role_ids JSONB DEFAULT '[]'::jsonb, -- Array of subject_role catalog IDs
  recent_setting_place_ids JSONB DEFAULT '[]'::jsonb, -- Array of setting_place catalog IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- Add prompt_slots_json to horoscopes table to store selected slot IDs
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'horoscopes' 
    AND column_name = 'prompt_slots_json'
  ) THEN
    ALTER TABLE public.horoscopes ADD COLUMN prompt_slots_json JSONB;
  END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_prompt_slot_catalogs_slot_type ON public.prompt_slot_catalogs(slot_type) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_prompt_slot_catalogs_style_group ON public.prompt_slot_catalogs(style_group_id) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_user_avatar_state_user_id ON public.user_avatar_state(user_id);

-- Enable Row Level Security
ALTER TABLE public.style_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_slot_catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_avatar_state ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Public can view style groups" ON public.style_groups;
DROP POLICY IF EXISTS "Public can view active prompt slot catalogs" ON public.prompt_slot_catalogs;
DROP POLICY IF EXISTS "Users can view own avatar state" ON public.user_avatar_state;
DROP POLICY IF EXISTS "Service role can manage avatar state" ON public.user_avatar_state;

CREATE POLICY "Public can view style groups" ON public.style_groups FOR SELECT USING (true);
CREATE POLICY "Public can view active prompt slot catalogs" ON public.prompt_slot_catalogs FOR SELECT USING (active = true);
CREATE POLICY "Users can view own avatar state" ON public.user_avatar_state FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage avatar state" ON public.user_avatar_state FOR ALL USING (auth.role() = 'service_role');

