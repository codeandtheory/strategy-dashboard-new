-- This Week Stats table
-- Stores the configuration for the 4 stats displayed in the "This Week" card
CREATE TABLE IF NOT EXISTS public.this_week_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  position INTEGER NOT NULL CHECK (position >= 1 AND position <= 4),
  stat_type TEXT NOT NULL CHECK (stat_type IN ('database', 'custom')),
  -- For database stats
  database_stat_key TEXT, -- e.g., 'active_projects', 'new_business', 'pitches_due', 'active_clients'
  -- For custom stats
  custom_title TEXT,
  custom_value TEXT,
  -- Metadata
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  -- Ensure only one stat per position
  UNIQUE(position)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_this_week_stats_position ON public.this_week_stats(position);
CREATE INDEX IF NOT EXISTS idx_this_week_stats_created_by ON public.this_week_stats(created_by);

-- Enable Row Level Security
ALTER TABLE public.this_week_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view this week stats" ON public.this_week_stats;
DROP POLICY IF EXISTS "Users can insert this week stats" ON public.this_week_stats;
DROP POLICY IF EXISTS "Users can update this week stats" ON public.this_week_stats;
DROP POLICY IF EXISTS "Users can delete this week stats" ON public.this_week_stats;

CREATE POLICY "Users can view this week stats"
  ON public.this_week_stats FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert this week stats"
  ON public.this_week_stats FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update this week stats"
  ON public.this_week_stats FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete this week stats"
  ON public.this_week_stats FOR DELETE
  USING (auth.role() = 'authenticated');

-- Add comments for documentation
COMMENT ON TABLE public.this_week_stats IS 'Configuration for the 4 stats displayed in the "This Week" card on the dashboard';
COMMENT ON COLUMN public.this_week_stats.position IS 'Position of the stat (1-4)';
COMMENT ON COLUMN public.this_week_stats.stat_type IS 'Type of stat: database (pulled from DB) or custom (manual entry)';
COMMENT ON COLUMN public.this_week_stats.database_stat_key IS 'Key for database-driven stats: active_projects, new_business, pitches_due, active_clients';
COMMENT ON COLUMN public.this_week_stats.custom_title IS 'Title for custom stats (e.g., "team members")';
COMMENT ON COLUMN public.this_week_stats.custom_value IS 'Value for custom stats (e.g., "25")';

-- Insert default stats (can be updated via admin panel)
INSERT INTO public.this_week_stats (position, stat_type, database_stat_key, created_by)
SELECT 
  1, 'database', 'active_projects', id
FROM public.profiles
WHERE base_role = 'admin'
LIMIT 1
ON CONFLICT (position) DO NOTHING;

INSERT INTO public.this_week_stats (position, stat_type, database_stat_key, created_by)
SELECT 
  2, 'database', 'new_business', id
FROM public.profiles
WHERE base_role = 'admin'
LIMIT 1
ON CONFLICT (position) DO NOTHING;

INSERT INTO public.this_week_stats (position, stat_type, database_stat_key, created_by)
SELECT 
  3, 'database', 'pitches_due', id
FROM public.profiles
WHERE base_role = 'admin'
LIMIT 1
ON CONFLICT (position) DO NOTHING;

INSERT INTO public.this_week_stats (position, stat_type, database_stat_key, created_by)
SELECT 
  4, 'database', 'active_clients', id
FROM public.profiles
WHERE base_role = 'admin'
LIMIT 1
ON CONFLICT (position) DO NOTHING;

