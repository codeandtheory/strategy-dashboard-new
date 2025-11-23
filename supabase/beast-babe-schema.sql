-- Beast Babe History Table
-- Tracks the history of who has been the beast babe and when
CREATE TABLE IF NOT EXISTS public.beast_babe_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL, -- when they became beast babe
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement TEXT, -- why they got it (from CSV or when passed)
  passed_by_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- who passed it to them (nullable for CSV imports)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_beast_babe_history_user_id ON public.beast_babe_history(user_id);
CREATE INDEX IF NOT EXISTS idx_beast_babe_history_date ON public.beast_babe_history(date DESC);
CREATE INDEX IF NOT EXISTS idx_beast_babe_history_passed_by ON public.beast_babe_history(passed_by_user_id);

-- Enable Row Level Security
ALTER TABLE public.beast_babe_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Everyone can view beast babe history (it's public information)
CREATE POLICY "Anyone can view beast babe history"
  ON public.beast_babe_history FOR SELECT
  USING (true);

-- Only service role can insert/update (handled via API with proper auth)
CREATE POLICY "Service role can manage beast babe history"
  ON public.beast_babe_history
  USING (auth.role() = 'service_role');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_beast_babe_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on row update
DROP TRIGGER IF EXISTS update_beast_babe_history_updated_at_trigger ON public.beast_babe_history;
CREATE TRIGGER update_beast_babe_history_updated_at_trigger
  BEFORE UPDATE ON public.beast_babe_history
  FOR EACH ROW
  EXECUTE FUNCTION update_beast_babe_history_updated_at();

