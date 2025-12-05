-- Manual Calendar Events Table
-- Stores manually added calendar events that are displayed alongside Google Calendar events

CREATE TABLE IF NOT EXISTS public.manual_calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  start_time TIME, -- Optional time (HH:MM:SS format)
  end_date DATE, -- Optional end date (defaults to start_date if not provided)
  end_time TIME, -- Optional end time
  location TEXT,
  is_all_day BOOLEAN DEFAULT false,
  color TEXT, -- Optional color for display (hex code)
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_manual_calendar_events_start_date ON public.manual_calendar_events(start_date);
CREATE INDEX IF NOT EXISTS idx_manual_calendar_events_created_by ON public.manual_calendar_events(created_by);
CREATE INDEX IF NOT EXISTS idx_manual_calendar_events_dates ON public.manual_calendar_events(start_date, end_date);

-- Enable Row Level Security
ALTER TABLE public.manual_calendar_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view all manual calendar events" ON public.manual_calendar_events;
DROP POLICY IF EXISTS "Users can create manual calendar events" ON public.manual_calendar_events;
DROP POLICY IF EXISTS "Users can update own manual calendar events" ON public.manual_calendar_events;
DROP POLICY IF EXISTS "Users can delete own manual calendar events" ON public.manual_calendar_events;
DROP POLICY IF EXISTS "Admins can manage all manual calendar events" ON public.manual_calendar_events;

-- All authenticated users can view manual calendar events
CREATE POLICY "Users can view all manual calendar events"
  ON public.manual_calendar_events FOR SELECT
  USING (auth.role() = 'authenticated');

-- All authenticated users can create manual calendar events
CREATE POLICY "Users can create manual calendar events"
  ON public.manual_calendar_events FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Users can update their own events, or admins can update any
CREATE POLICY "Users can update own manual calendar events"
  ON public.manual_calendar_events FOR UPDATE
  USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.base_role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.base_role = 'admin'
    )
  );

-- Users can delete their own events, or admins can delete any
CREATE POLICY "Users can delete own manual calendar events"
  ON public.manual_calendar_events FOR DELETE
  USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.base_role = 'admin'
    )
  );

-- Service role can do everything (for admin operations)
CREATE POLICY "Service role can manage all manual calendar events"
  ON public.manual_calendar_events
  USING (auth.role() = 'service_role');

