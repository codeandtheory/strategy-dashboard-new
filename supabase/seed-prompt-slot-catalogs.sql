-- Seed script for prompt slot catalogs
-- Populates style groups and all prompt slot catalogs with the examples from the design notes

-- Insert style groups
INSERT INTO public.style_groups (name, description) VALUES
  ('illustration_2D', '2D illustration styles like Adventure Time, Ghibli, comics, vector'),
  ('traditional', 'Traditional art styles like watercolor, oil, ink, collage'),
  ('digital_retro', 'Retro digital styles like pixel art, 8 bit, eBoy, PS1'),
  ('digital_modern', 'Modern digital styles like 3D render, CG, concept art')
ON CONFLICT (name) DO NOTHING;

-- Get style group IDs for reference
DO $$
DECLARE
  v_illustration_2d_id UUID;
  v_traditional_id UUID;
  v_digital_retro_id UUID;
  v_digital_modern_id UUID;
BEGIN
  SELECT id INTO v_illustration_2d_id FROM public.style_groups WHERE name = 'illustration_2D';
  SELECT id INTO v_traditional_id FROM public.style_groups WHERE name = 'traditional';
  SELECT id INTO v_digital_retro_id FROM public.style_groups WHERE name = 'digital_retro';
  SELECT id INTO v_digital_modern_id FROM public.style_groups WHERE name = 'digital_modern';

  -- Style Medium catalog
  INSERT INTO public.prompt_slot_catalogs (slot_type, value, label) VALUES
    ('style_medium', 'watercolor', 'Watercolor'),
    ('style_medium', 'gouache', 'Gouache'),
    ('style_medium', 'ink_wash', 'Ink Wash'),
    ('style_medium', 'charcoal_sketch', 'Charcoal Sketch'),
    ('style_medium', 'pencil_drawing', 'Pencil Drawing'),
    ('style_medium', 'marker_illustration', 'Marker Illustration'),
    ('style_medium', 'flat_vector', 'Flat Vector'),
    ('style_medium', 'isometric_vector', 'Isometric Vector'),
    ('style_medium', 'comic_book_inked', 'Comic Book Inked'),
    ('style_medium', 'oil_painting', 'Oil Painting'),
    ('style_medium', 'acrylic_painting', 'Acrylic Painting'),
    ('style_medium', 'risograph_print', 'Risograph Print'),
    ('style_medium', 'stencil_art', 'Stencil Art'),
    ('style_medium', 'papercraft_cutout', 'Papercraft Cutout'),
    ('style_medium', 'collage', 'Collage'),
    ('style_medium', 'pixel_art', 'Pixel Art'),
    ('style_medium', '8_bit', '8 Bit'),
    ('style_medium', '16_bit', '16 Bit'),
    ('style_medium', 'low_poly_3d', 'Low Poly 3D'),
    ('style_medium', 'high_detail_3d_render', 'High Detail 3D Render'),
    ('style_medium', 'claymation_style', 'Claymation Style'),
    ('style_medium', 'plush_toy_style', 'Plush Toy Style'),
    ('style_medium', 'lego_brick_style', 'Lego Brick Style')
  ON CONFLICT (slot_type, value) DO NOTHING;

  -- Style Reference catalog (with style groups)
  INSERT INTO public.prompt_slot_catalogs (slot_type, value, label, style_group_id) VALUES
    ('style_reference', 'adventure_time_style', 'Adventure Time Style', v_illustration_2d_id),
    ('style_reference', 'studio_ghibli_style', 'Studio Ghibli Style', v_illustration_2d_id),
    ('style_reference', 'disney_animation_style', 'Disney Animation Style', v_illustration_2d_id),
    ('style_reference', 'cartoon_network_style', 'Cartoon Network Style', v_illustration_2d_id),
    ('style_reference', 'retro_90s_anime', 'Retro 90s Anime', v_illustration_2d_id),
    ('style_reference', 'manga_screentone_style', 'Manga Screentone Style', v_illustration_2d_id),
    ('style_reference', 'american_superhero_comic_style', 'American Superhero Comic Style', v_illustration_2d_id),
    ('style_reference', 'franco_belgian_comic_style', 'Franco Belgian Comic Style', v_illustration_2d_id),
    ('style_reference', 'childrens_picture_book', 'Children''s Picture Book', v_illustration_2d_id),
    ('style_reference', 'rubber_hose_cartoon', 'Rubber Hose Cartoon', v_illustration_2d_id),
    ('style_reference', 'chibi_anime_style', 'Chibi Anime Style', v_illustration_2d_id),
    ('style_reference', 'y2k_web_graphics', 'Y2K Web Graphics', v_illustration_2d_id),
    ('style_reference', 'vaporwave_poster', 'Vaporwave Poster', v_illustration_2d_id),
    ('style_reference', 'cyberpunk_concept_art', 'Cyberpunk Concept Art', v_digital_modern_id),
    ('style_reference', 'eboy_style_pixel_art', 'eBoy Style Pixel Art', v_digital_retro_id),
    ('style_reference', 'game_boy_era_sprite_art', 'Game Boy Era Sprite Art', v_digital_retro_id),
    ('style_reference', 'playstation_1_low_poly', 'PlayStation 1 Low Poly', v_digital_retro_id),
    ('style_reference', 'dreamworks_style_cg', 'DreamWorks Style CG', v_digital_modern_id),
    ('style_reference', 'pixar_style_cg', 'Pixar Style CG', v_digital_modern_id)
  ON CONFLICT (slot_type, value) DO NOTHING;

  -- Subject Role catalog
  INSERT INTO public.prompt_slot_catalogs (slot_type, value, label) VALUES
    ('subject_role', 'your_real_face_as_yourself', 'Your Real Face as Yourself'),
    ('subject_role', 'fantasy_wizard', 'Fantasy Wizard'),
    ('subject_role', 'sci_fi_pilot', 'Sci Fi Pilot'),
    ('subject_role', 'hero_in_rpg', 'Hero in an RPG'),
    ('subject_role', 'space_explorer', 'Space Explorer'),
    ('subject_role', 'robot_version_of_yourself', 'Robot Version of Yourself'),
    ('subject_role', 'quirky_inventor', 'Quirky Inventor'),
    ('subject_role', 'chef', 'Chef'),
    ('subject_role', 'street_artist', 'Street Artist'),
    ('subject_role', 'gamer_in_tournament', 'Gamer in a Tournament'),
    ('subject_role', 'superhero', 'Superhero'),
    ('subject_role', 'detective', 'Detective'),
    ('subject_role', 'pirate_captain', 'Pirate Captain'),
    ('subject_role', 'rock_musician', 'Rock Musician'),
    ('subject_role', 'dj', 'DJ'),
    ('subject_role', 'time_traveler', 'Time Traveler')
  ON CONFLICT (slot_type, value) DO NOTHING;

  -- Subject Twist catalog
  INSERT INTO public.prompt_slot_catalogs (slot_type, value, label) VALUES
    ('subject_twist', 'made_of_crystal', 'Made of Crystal'),
    ('subject_twist', 'made_of_plush_fabric', 'Made of Plush Fabric'),
    ('subject_twist', 'made_of_origami_paper', 'Made of Origami Paper'),
    ('subject_twist', 'tiny_chibi_character', 'Tiny Chibi Character'),
    ('subject_twist', 'giant_kaiju_version', 'Giant Kaiju Version'),
    ('subject_twist', 'hologram', 'Hologram'),
    ('subject_twist', '3d_wireframe', '3D Wireframe'),
    ('subject_twist', 'living_neon_sign', 'Living Neon Sign'),
    ('subject_twist', 'statue', 'Statue'),
    ('subject_twist', 'comic_panel_character', 'Comic Panel Character'),
    ('subject_twist', '8_bit_sprite', '8 Bit Sprite')
  ON CONFLICT (slot_type, value) DO NOTHING;

  -- Setting Place catalog
  INSERT INTO public.prompt_slot_catalogs (slot_type, value, label) VALUES
    ('setting_place', 'modern_office', 'Modern Office'),
    ('setting_place', 'space_station_window', 'Space Station Window'),
    ('setting_place', 'cyberpunk_night_city', 'Cyberpunk Night City'),
    ('setting_place', 'retro_80s_arcade', 'Retro 80s Arcade'),
    ('setting_place', '90s_lan_party', '90s LAN Party'),
    ('setting_place', 'cloud_city_in_sky', 'Cloud City in the Sky'),
    ('setting_place', 'underwater_city', 'Underwater City'),
    ('setting_place', 'enchanted_forest', 'Enchanted Forest'),
    ('setting_place', 'floating_island', 'Floating Island'),
    ('setting_place', 'desert_with_giant_sculptures', 'Desert with Giant Sculptures'),
    ('setting_place', 'rooftop_garden', 'Rooftop Garden'),
    ('setting_place', 'cozy_library', 'Cozy Library'),
    ('setting_place', 'coffee_shop', 'Coffee Shop'),
    ('setting_place', 'busy_train_station', 'Busy Train Station'),
    ('setting_place', 'futuristic_lab', 'Futuristic Lab'),
    ('setting_place', 'ancient_temple', 'Ancient Temple'),
    ('setting_place', 'medieval_town_square', 'Medieval Town Square')
  ON CONFLICT (slot_type, value) DO NOTHING;

  -- Setting Time catalog
  INSERT INTO public.prompt_slot_catalogs (slot_type, value, label) VALUES
    ('setting_time', 'golden_hour', 'Golden Hour'),
    ('setting_time', 'blue_hour', 'Blue Hour'),
    ('setting_time', 'midnight', 'Midnight'),
    ('setting_time', 'stormy_afternoon', 'Stormy Afternoon'),
    ('setting_time', 'bright_noon', 'Bright Noon'),
    ('setting_time', 'foggy_morning', 'Foggy Morning'),
    ('setting_time', 'neon_soaked_night', 'Neon Soaked Night'),
    ('setting_time', 'sunrise', 'Sunrise')
  ON CONFLICT (slot_type, value) DO NOTHING;

  -- Activity catalog
  INSERT INTO public.prompt_slot_catalogs (slot_type, value, label) VALUES
    ('activity', 'typing_on_glowing_keyboard', 'Typing on a Glowing Keyboard'),
    ('activity', 'presenting_in_front_of_huge_screen', 'Presenting in Front of a Huge Screen'),
    ('activity', 'flying_through_air', 'Flying Through the Air'),
    ('activity', 'casting_spell', 'Casting a Spell'),
    ('activity', 'riding_hoverboard', 'Riding a Hoverboard'),
    ('activity', 'walking_robot_dog', 'Walking a Robot Dog'),
    ('activity', 'painting_mural', 'Painting a Mural'),
    ('activity', 'djing_at_party', 'DJing at a Party'),
    ('activity', 'cooking_in_tiny_kitchen', 'Cooking in a Tiny Kitchen'),
    ('activity', 'piloting_spaceship', 'Piloting a Spaceship'),
    ('activity', 'reading_massive_floating_book', 'Reading a Massive Floating Book'),
    ('activity', 'building_robot', 'Building a Robot'),
    ('activity', 'skateboarding_through_city', 'Skateboarding Through the City'),
    ('activity', 'relaxing_with_coffee_and_laptop', 'Relaxing with Coffee and a Laptop')
  ON CONFLICT (slot_type, value) DO NOTHING;

  -- Mood Vibe catalog
  INSERT INTO public.prompt_slot_catalogs (slot_type, value, label) VALUES
    ('mood_vibe', 'playful_and_fun', 'Playful and Fun'),
    ('mood_vibe', 'epic_and_heroic', 'Epic and Heroic'),
    ('mood_vibe', 'mysterious_and_moody', 'Mysterious and Moody'),
    ('mood_vibe', 'cozy_and_relaxed', 'Cozy and Relaxed'),
    ('mood_vibe', 'energetic_and_chaotic', 'Energetic and Chaotic'),
    ('mood_vibe', 'sci_fi_high_tech', 'Sci Fi High Tech'),
    ('mood_vibe', 'whimsical_and_surreal', 'Whimsical and Surreal')
  ON CONFLICT (slot_type, value) DO NOTHING;

  -- Color Palette catalog
  INSERT INTO public.prompt_slot_catalogs (slot_type, value, label) VALUES
    ('color_palette', 'neon_cyan_and_magenta', 'Neon Cyan and Magenta'),
    ('color_palette', 'warm_oranges_and_reds', 'Warm Oranges and Reds'),
    ('color_palette', 'cool_blues_and_greens', 'Cool Blues and Greens'),
    ('color_palette', 'pastel_candy_colors', 'Pastel Candy Colors'),
    ('color_palette', 'grayscale_with_one_accent_color', 'Grayscale with One Accent Color'),
    ('color_palette', 'sepia_vintage_tones', 'Sepia Vintage Tones'),
    ('color_palette', 'jewel_tones', 'Jewel Tones'),
    ('color_palette', 'high_contrast_black_and_white', 'High Contrast Black and White')
  ON CONFLICT (slot_type, value) DO NOTHING;

  -- Camera Frame catalog
  INSERT INTO public.prompt_slot_catalogs (slot_type, value, label) VALUES
    ('camera_frame', 'tight_portrait_close_up', 'Tight Portrait Close Up'),
    ('camera_frame', 'waist_up_mid_shot', 'Waist Up Mid Shot'),
    ('camera_frame', 'full_body_shot', 'Full Body Shot'),
    ('camera_frame', 'isometric_view', 'Isometric View'),
    ('camera_frame', 'top_down_view', 'Top Down View'),
    ('camera_frame', 'low_angle_hero_shot', 'Low Angle Hero Shot'),
    ('camera_frame', 'high_angle_looking_down', 'High Angle Looking Down')
  ON CONFLICT (slot_type, value) DO NOTHING;

  -- Lighting Style catalog
  INSERT INTO public.prompt_slot_catalogs (slot_type, value, label) VALUES
    ('lighting_style', 'soft_natural_lighting', 'Soft Natural Lighting'),
    ('lighting_style', 'studio_softbox_lighting', 'Studio Softbox Lighting'),
    ('lighting_style', 'dramatic_chiaroscuro_lighting', 'Dramatic Chiaroscuro Lighting'),
    ('lighting_style', 'backlit_silhouette', 'Backlit Silhouette'),
    ('lighting_style', 'neon_lighting', 'Neon Lighting'),
    ('lighting_style', 'volumetric_god_rays', 'Volumetric God Rays'),
    ('lighting_style', 'moonlit_night', 'Moonlit Night'),
    ('lighting_style', 'candlelight', 'Candlelight')
  ON CONFLICT (slot_type, value) DO NOTHING;

  -- Constraints catalog
  INSERT INTO public.prompt_slot_catalogs (slot_type, value, label) VALUES
    ('constraints', 'centered_composition', 'Centered Composition'),
    ('constraints', 'clean_simple_background', 'Clean, Simple Background'),
    ('constraints', 'no_text_in_image', 'No Text in the Image'),
    ('constraints', 'sharp_focus_on_face', 'Sharp Focus on the Face'),
    ('constraints', 'high_detail_high_resolution', 'High Detail, High Resolution'),
    ('constraints', 'avatar_friendly_portrait_ratio', 'Avatar Friendly Portrait Ratio')
  ON CONFLICT (slot_type, value) DO NOTHING;

END $$;

