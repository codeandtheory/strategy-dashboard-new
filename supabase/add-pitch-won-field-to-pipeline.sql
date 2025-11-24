-- Add pitch_won field to pipeline_projects table
ALTER TABLE public.pipeline_projects
ADD COLUMN IF NOT EXISTS pitch_won BOOLEAN DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN public.pipeline_projects.pitch_won IS 'Whether a pitch project was won (only relevant when type is Pitch)';

