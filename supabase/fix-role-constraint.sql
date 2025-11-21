-- Fix: Remove check constraint from role column in profiles table
-- This fixes the error: "new row for relation 'profiles' violates check constraint 'profiles_role_check'"
-- Run this in your Supabase SQL Editor

-- Drop the check constraint if it exists (this is safe and won't affect other tables)
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Verify the constraint is removed from profiles table
SELECT 
  constraint_name, 
  constraint_type,
  table_name
FROM information_schema.table_constraints
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
  AND constraint_name LIKE '%role%';

-- Note: This only affects the profiles table. If you have other tables with role columns
-- that have constraints, those are separate and won't be affected by this script.

