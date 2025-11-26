-- Channel Polls table
-- Stores poll metadata and configuration
CREATE TABLE IF NOT EXISTS public.channel_polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  title TEXT NOT NULL,
  question TEXT NOT NULL,
  asked_by TEXT, -- Name of person who asked the poll
  date DATE NOT NULL, -- Date the poll was created/asked
  total_responses INTEGER DEFAULT 0,
  is_ranking BOOLEAN DEFAULT FALSE, -- true for ranking polls (e.g., Top 5 Movie Soundtracks), false for count-based polls
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE, -- true for the "Latest Poll" shown on main vibes page
  image_url TEXT, -- URL for venn diagrams or other poll images (e.g., /venn_movies.png, /thxgiving.png)
  fun_fact_title TEXT, -- Optional fun fact title (e.g., "Fun Fact: Statistically speaking...")
  fun_fact_content JSONB, -- Fun fact content as JSON array (e.g., ["turkey", "custard", "caramel"])
  display_order INTEGER DEFAULT 0 -- Order for displaying polls in archive
);

-- Poll Options table
-- Stores individual poll items/options
CREATE TABLE IF NOT EXISTS public.poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  poll_id UUID REFERENCES public.channel_polls(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, -- Name of the poll option (e.g., "Stuffing", "Garden State")
  rank INTEGER, -- For ranking polls: the rank (1, 2, 3, etc.)
  count INTEGER DEFAULT 0, -- For count-based polls: number of votes
  display_order INTEGER DEFAULT 0 -- Order for displaying options within a poll
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_channel_polls_date ON public.channel_polls(date DESC);
CREATE INDEX IF NOT EXISTS idx_channel_polls_is_featured ON public.channel_polls(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_channel_polls_is_active ON public.channel_polls(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_channel_polls_display_order ON public.channel_polls(display_order DESC);
CREATE INDEX IF NOT EXISTS idx_poll_options_poll_id ON public.poll_options(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_options_rank ON public.poll_options(poll_id, rank) WHERE rank IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_poll_options_count ON public.poll_options(poll_id, count DESC) WHERE count IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_poll_options_display_order ON public.poll_options(poll_id, display_order);

-- Enable Row Level Security
ALTER TABLE public.channel_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;

-- RLS Policies for channel_polls
-- Everyone can view polls
CREATE POLICY "Anyone can view channel polls"
  ON public.channel_polls FOR SELECT
  USING (true);

-- Only admins/curators can insert polls
CREATE POLICY "Admins and curators can insert channel polls"
  ON public.channel_polls FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.base_role IN ('admin', 'leader') OR 'curator' = ANY(profiles.special_access))
    )
  );

-- Only admins/curators can update polls
CREATE POLICY "Admins and curators can update channel polls"
  ON public.channel_polls FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.base_role IN ('admin', 'leader') OR 'curator' = ANY(profiles.special_access))
    )
  );

-- Only admins can delete polls
CREATE POLICY "Only admins can delete channel polls"
  ON public.channel_polls FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.base_role IN ('admin', 'leader')
    )
  );

-- Service role can do everything
CREATE POLICY "Service role can manage all channel polls"
  ON public.channel_polls
  USING (auth.role() = 'service_role');

-- RLS Policies for poll_options
-- Everyone can view poll options
CREATE POLICY "Anyone can view poll options"
  ON public.poll_options FOR SELECT
  USING (true);

-- Only admins/curators can insert poll options
CREATE POLICY "Admins and curators can insert poll options"
  ON public.poll_options FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.base_role IN ('admin', 'leader') OR 'curator' = ANY(profiles.special_access))
    )
  );

-- Only admins/curators can update poll options
CREATE POLICY "Admins and curators can update poll options"
  ON public.poll_options FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.base_role IN ('admin', 'leader') OR 'curator' = ANY(profiles.special_access))
    )
  );

-- Only admins can delete poll options
CREATE POLICY "Only admins can delete poll options"
  ON public.poll_options FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.base_role IN ('admin', 'leader')
    )
  );

-- Service role can do everything
CREATE POLICY "Service role can manage all poll options"
  ON public.poll_options
  USING (auth.role() = 'service_role');

-- Function to update updated_at timestamp for channel_polls
CREATE OR REPLACE FUNCTION public.update_channel_polls_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp for poll_options
CREATE OR REPLACE FUNCTION public.update_poll_options_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_channel_polls_updated_at
  BEFORE UPDATE ON public.channel_polls
  FOR EACH ROW
  EXECUTE FUNCTION public.update_channel_polls_updated_at();

CREATE TRIGGER update_poll_options_updated_at
  BEFORE UPDATE ON public.poll_options
  FOR EACH ROW
  EXECUTE FUNCTION public.update_poll_options_updated_at();

