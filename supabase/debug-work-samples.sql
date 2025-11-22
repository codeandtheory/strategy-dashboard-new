-- Debug work samples query
-- This will help identify why work samples aren't showing up

-- 1. Check if work samples exist
SELECT COUNT(*) as total_count FROM public.work_samples;

-- 2. Check a few sample records
SELECT 
  id,
  project_name,
  author_id,
  created_by,
  type_id,
  date
FROM public.work_samples 
LIMIT 5;

-- 3. Check if author_ids exist in profiles
SELECT 
  ws.id,
  ws.project_name,
  ws.author_id,
  p.id as profile_exists,
  p.full_name
FROM public.work_samples ws
LEFT JOIN public.profiles p ON ws.author_id = p.id
LIMIT 10;

-- 4. Check if created_by exists in profiles
SELECT 
  ws.id,
  ws.project_name,
  ws.created_by,
  p.id as profile_exists,
  p.full_name
FROM public.work_samples ws
LEFT JOIN public.profiles p ON ws.created_by = p.id
LIMIT 10;

-- 5. Test the exact query the API uses (simplified)
SELECT 
  id,
  project_name,
  description,
  type_id,
  client,
  author_id,
  date,
  created_by,
  created_at,
  updated_at,
  thumbnail_url,
  file_url,
  file_link,
  file_name
FROM public.work_samples
ORDER BY date DESC, created_at DESC
LIMIT 10;

-- 6. Test with foreign key joins
SELECT 
  ws.id,
  ws.project_name,
  ws.description,
  ws.type_id,
  ws.client,
  ws.author_id,
  ws.date,
  ws.created_by,
  ws.created_at,
  ws.updated_at,
  ws.thumbnail_url,
  ws.file_url,
  ws.file_link,
  ws.file_name,
  wt.id as type_id_check,
  wt.name as type_name,
  p_author.id as author_profile_id,
  p_author.full_name as author_name,
  p_created.id as created_by_profile_id,
  p_created.full_name as created_by_name
FROM public.work_samples ws
LEFT JOIN public.work_sample_types wt ON ws.type_id = wt.id
LEFT JOIN public.profiles p_author ON ws.author_id = p_author.id
LEFT JOIN public.profiles p_created ON ws.created_by = p_created.id
ORDER BY ws.date DESC, ws.created_at DESC
LIMIT 10;

-- 7. Check for NULL foreign keys that might cause issues
SELECT 
  COUNT(*) as null_author_id_count
FROM public.work_samples
WHERE author_id IS NULL;

SELECT 
  COUNT(*) as null_created_by_count
FROM public.work_samples
WHERE created_by IS NULL;

-- 8. Check RLS is enabled
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename = 'work_samples';

