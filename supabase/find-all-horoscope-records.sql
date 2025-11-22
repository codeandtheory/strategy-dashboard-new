-- Find ALL horoscope records for debugging
-- Run this in Supabase SQL Editor

-- 1. Check if table exists and get total count
SELECT 
  'horoscopes' as table_name,
  COUNT(*) as total_records
FROM horoscopes;

-- 2. Get ALL records (no date filter)
SELECT 
  id,
  user_id,
  date,
  date::text as date_text,
  CURRENT_DATE as today,
  CURRENT_DATE::text as today_text,
  date = CURRENT_DATE as matches_today,
  star_sign,
  LENGTH(horoscope_text) as text_length,
  horoscope_text IS NULL as text_is_null,
  horoscope_text = '' as text_is_empty,
  LENGTH(image_url) as image_url_length,
  image_url IS NULL as image_is_null,
  image_url = '' as image_is_empty,
  generated_at,
  created_at
FROM horoscopes
ORDER BY created_at DESC NULLS LAST, generated_at DESC NULLS LAST
LIMIT 20;

-- 3. Check for your specific user ID
-- Replace with your actual user ID from the logs: 6a3c26af-3ad6-401d-91e3-7ec38fdc7c0b
SELECT 
  id,
  user_id,
  date,
  date::text as date_text,
  CURRENT_DATE as today,
  date = CURRENT_DATE as matches_today,
  star_sign,
  LENGTH(horoscope_text) as text_length,
  LENGTH(image_url) as image_url_length,
  generated_at
FROM horoscopes
WHERE user_id = '6a3c26af-3ad6-401d-91e3-7ec38fdc7c0b'
ORDER BY date DESC, generated_at DESC;

-- 4. Check date formats - see if dates are stored differently
SELECT 
  date,
  date::text,
  date::date,
  EXTRACT(YEAR FROM date) as year,
  EXTRACT(MONTH FROM date) as month,
  EXTRACT(DAY FROM date) as day,
  CURRENT_DATE,
  CURRENT_DATE::text
FROM horoscopes
WHERE user_id = '6a3c26af-3ad6-401d-91e3-7ec38fdc7c0b'
ORDER BY date DESC
LIMIT 5;

