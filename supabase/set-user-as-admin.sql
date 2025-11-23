-- Set a user as admin by email
-- Replace 'your-email@example.com' with your actual email address
-- Run this in Supabase SQL Editor

UPDATE public.profiles
SET base_role = 'admin',
    updated_at = TIMEZONE('utc', NOW())
WHERE email = 'your-email@example.com';

-- Verify the update
SELECT id, email, full_name, base_role, updated_at
FROM public.profiles
WHERE email = 'your-email@example.com';

