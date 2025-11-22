-- Clear today's horoscope cache to force regeneration
-- This will allow a new image to be generated with the new Supabase storage system
-- Run this in Supabase SQL Editor

-- Option 1: Clear for a specific user (replace with your user ID)
-- To find your user ID, check the auth.users table or profiles table
DELETE FROM public.horoscopes
WHERE date = CURRENT_DATE
  AND user_id = (SELECT id FROM auth.users WHERE email = 'karen.piper@codeandtheory.com' LIMIT 1);

-- Option 2: Clear for all users (today only)
-- DELETE FROM public.horoscopes
-- WHERE date = CURRENT_DATE;

-- After running this, refresh the page and a new image will be generated
-- The new image will be stored in Supabase storage and won't expire

