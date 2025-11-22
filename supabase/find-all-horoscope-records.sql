-- Find ALL horoscope records for debugging
-- Run this in Supabase SQL Editor

-- 1. Check if table exists and get total count
SELECT 
  'horoscopes' as table_name,
  COUNT(*) as total_records
FROM horoscopes;

-- 2. Get ALL records (no date filter)
SELECT 
  h.id,
  h.user_id,
  h.date,
  h.date::text as date_text,
  CURRENT_DATE as today,
  CURRENT_DATE::text as today_text,
  h.date = CURRENT_DATE as matches_today,
  h.star_sign,
  LENGTH(h.horoscope_text) as text_length,
  h.horoscope_text IS NULL as text_is_null,
  h.horoscope_text = '' as text_is_empty,
  LENGTH(h.image_url) as image_url_length,
  h.image_url IS NULL as image_is_null,
  h.image_url = '' as image_is_empty,
  h.generated_at,
  h.created_at
FROM horoscopes h
ORDER BY h.created_at DESC NULLS LAST, h.generated_at DESC NULLS LAST
LIMIT 20;

-- 3. Check for your specific user ID
-- Replace with your actual user ID from the logs: 6a3c26af-3ad6-401d-91e3-7ec38fdc7c0b
SELECT 
  h.id,
  h.user_id,
  h.date,
  h.date::text as date_text,
  CURRENT_DATE as today,
  h.date = CURRENT_DATE as matches_today,
  h.star_sign,
  LENGTH(h.horoscope_text) as text_length,
  LENGTH(h.image_url) as image_url_length,
  h.generated_at
FROM horoscopes h
WHERE h.user_id = '6a3c26af-3ad6-401d-91e3-7ec38fdc7c0b'
ORDER BY h.date DESC, h.generated_at DESC;

-- 4. Check date formats - see if dates are stored differently
SELECT 
  h.date,
  h.date::text as date_text,
  h.date::date as date_cast,
  EXTRACT(YEAR FROM h.date) as year,
  EXTRACT(MONTH FROM h.date) as month,
  EXTRACT(DAY FROM h.date) as day,
  CURRENT_DATE as today,
  CURRENT_DATE::text as today_text
FROM horoscopes h
WHERE h.user_id = '6a3c26af-3ad6-401d-91e3-7ec38fdc7c0b'
ORDER BY h.date DESC
LIMIT 5;

