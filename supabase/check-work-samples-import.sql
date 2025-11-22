-- Diagnostic queries to check work samples import

-- Check if any work samples were inserted
SELECT COUNT(*) as total_work_samples FROM public.work_samples;

-- Check work sample types exist
SELECT id, name FROM public.work_sample_types ORDER BY name;

-- Check if users exist
SELECT id, full_name, email FROM public.profiles LIMIT 10;

-- Check recent work samples
SELECT 
  id,
  project_name,
  client,
  type_id,
  author_id,
  created_by,
  date,
  created_at
FROM public.work_samples 
ORDER BY created_at DESC 
LIMIT 10;

-- Check for work samples with NULL type_id (would indicate lookup failed)
SELECT 
  id,
  project_name,
  type_id
FROM public.work_samples 
WHERE type_id IS NULL;

-- Check for work samples with NULL author_id or created_by
SELECT 
  id,
  project_name,
  author_id,
  created_by
FROM public.work_samples 
WHERE author_id IS NULL OR created_by IS NULL;

