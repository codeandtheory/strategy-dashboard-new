-- Seed initial polls data
-- This migrates the hardcoded polls to the database

-- Insert Thanksgiving Poll (count-based)
INSERT INTO public.channel_polls (title, question, asked_by, date, total_responses, is_ranking, is_active, is_featured, image_url, fun_fact_title, fun_fact_content, display_order)
VALUES (
  'Thanksgiving Grub',
  'What are your top Thanksgiving dishes?',
  NULL,
  '2024-11-01',
  14,
  FALSE,
  TRUE,
  TRUE, -- Featured as latest poll
  '/thxgiving.png',
  'Fun Fact: Statistically speaking, cigarettes appear as often as:',
  '["turkey", "custard", "caramel", "mashed potatoes with gravy", "empanadas", "jollof rice"]'::jsonb,
  1
)
ON CONFLICT DO NOTHING
RETURNING id;

-- Insert Thanksgiving poll options
DO $$
DECLARE
  thanksgiving_poll_id UUID;
BEGIN
  -- Get the Thanksgiving poll ID
  SELECT id INTO thanksgiving_poll_id FROM public.channel_polls WHERE title = 'Thanksgiving Grub' LIMIT 1;
  
  IF thanksgiving_poll_id IS NOT NULL THEN
    -- Insert all Thanksgiving poll options
    INSERT INTO public.poll_options (poll_id, name, count, display_order) VALUES
      (thanksgiving_poll_id, 'Stuffing', 7, 1),
      (thanksgiving_poll_id, 'Mashed potatoes', 3, 2),
      (thanksgiving_poll_id, 'Peking duck', 2, 3),
      (thanksgiving_poll_id, 'Pumpkin pie', 2, 4),
      (thanksgiving_poll_id, 'Gravy', 2, 5),
      (thanksgiving_poll_id, 'Fried turkey', 1, 6),
      (thanksgiving_poll_id, 'Turkey breast', 1, 7),
      (thanksgiving_poll_id, 'Peppercorn encrusted filet mignon', 1, 8),
      (thanksgiving_poll_id, 'Outdoor KBBQ', 1, 9),
      (thanksgiving_poll_id, 'Chicken biriyani', 1, 10),
      (thanksgiving_poll_id, 'Jollof rice', 1, 11),
      (thanksgiving_poll_id, 'Arepas', 1, 12),
      (thanksgiving_poll_id, 'Empanadas', 1, 13),
      (thanksgiving_poll_id, 'Ham', 1, 14),
      (thanksgiving_poll_id, 'Funeral potatoes', 1, 15),
      (thanksgiving_poll_id, 'Cornbread', 1, 16),
      (thanksgiving_poll_id, 'Corn soufflé', 1, 17),
      (thanksgiving_poll_id, 'Fire-roasted sweet potatoes', 1, 18),
      (thanksgiving_poll_id, 'Butternut squash', 1, 19),
      (thanksgiving_poll_id, 'Sweet potato pie', 1, 20),
      (thanksgiving_poll_id, 'Caramel custard', 1, 21),
      (thanksgiving_poll_id, 'Custard pie', 1, 22),
      (thanksgiving_poll_id, 'Dessert spread', 1, 23),
      (thanksgiving_poll_id, 'Dots candy', 1, 24),
      (thanksgiving_poll_id, 'Trolli exploding worms', 1, 25),
      (thanksgiving_poll_id, 'White Monster', 1, 26),
      (thanksgiving_poll_id, 'Eggnog', 1, 27),
      (thanksgiving_poll_id, 'Appetizer red wine', 1, 28),
      (thanksgiving_poll_id, 'Dinner red wine', 1, 29),
      (thanksgiving_poll_id, 'Dessert amaro', 1, 30),
      (thanksgiving_poll_id, 'Peanut butter whiskey "during gravy"', 1, 31),
      (thanksgiving_poll_id, 'Skinny French cigarette', 1, 32),
      (thanksgiving_poll_id, 'Capri cigarettes with my mother in law and great aunt', 1, 33),
      (thanksgiving_poll_id, 'Caviar before dinner', 1, 34),
      (thanksgiving_poll_id, 'Cheese plate before', 1, 35),
      (thanksgiving_poll_id, 'All of the above mixed together in one perfect bite', 1, 36),
      (thanksgiving_poll_id, 'Green bean casserole', 1, 37),
      (thanksgiving_poll_id, 'Horseradish mashed potatoes', 1, 38),
      (thanksgiving_poll_id, 'Hongshaorou', 1, 39)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Insert Top 5 Movie Soundtracks Poll (ranking-based)
INSERT INTO public.channel_polls (title, question, asked_by, date, total_responses, is_ranking, is_active, is_featured, image_url, fun_fact_title, fun_fact_content, display_order)
VALUES (
  'Top 5 Movie Soundtracks',
  'Top 5 movie sound tracks - ranked. You can choose to isolate musicals from non-musicals or combine',
  'Rebecca Smith',
  '2024-11-21',
  3,
  TRUE,
  TRUE,
  FALSE, -- Not featured (archive only)
  '/venn_movies.png',
  NULL,
  NULL,
  2
)
ON CONFLICT DO NOTHING
RETURNING id;

-- Insert Movie Soundtracks poll options
DO $$
DECLARE
  soundtracks_poll_id UUID;
BEGIN
  -- Get the Movie Soundtracks poll ID
  SELECT id INTO soundtracks_poll_id FROM public.channel_polls WHERE title = 'Top 5 Movie Soundtracks' LIMIT 1;
  
  IF soundtracks_poll_id IS NOT NULL THEN
    -- Insert all Movie Soundtracks poll options with ranks
    INSERT INTO public.poll_options (poll_id, name, rank, display_order) VALUES
      (soundtracks_poll_id, 'Garden State', 1, 1),
      (soundtracks_poll_id, 'Good Will Hunting', 2, 2),
      (soundtracks_poll_id, 'Purple Rain', 3, 3),
      (soundtracks_poll_id, 'Interstellar', 4, 4),
      (soundtracks_poll_id, 'Trainspotting', 5, 5),
      (soundtracks_poll_id, 'Scott Pilgrim vs the World', 6, 6),
      (soundtracks_poll_id, 'Marie Antoinette', 7, 7),
      (soundtracks_poll_id, 'The Royal Tenenbaums', 8, 8),
      (soundtracks_poll_id, 'Twilight', 9, 9),
      (soundtracks_poll_id, 'Black Panther', 10, 10)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

