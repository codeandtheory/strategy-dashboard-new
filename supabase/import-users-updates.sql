-- Import Users from CSV - Generated SQL Updates
-- Generated: 2025-11-23T01:20:14.891693
-- Source: Team-Grid view.csv
-- 
-- This script updates existing user profiles based on email matching
-- Users must already exist in auth.users for profiles to be updated
-- 

BEGIN;

UPDATE public.profiles
SET full_name = 'Adam Kauder', role = 'Group Director', discipline = 'Strategy', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/D7tXQJP0jkQjekqgolXjGA/5YlF7HgMw5UfPTwIzmNvFpc7bC23rJeHs9DXjj9VNlBaWyX8k_FZ9PAOkvcV7rHrliM22U9d0jVs1xrdsz_IZ-GkX3GI5LGggbhmlY1bwASHkRFJxkO-rdpQJLUKj4xDW7lpNbLH2qN-2ZOfU2ogovE-EIG10s_Bx-fPNEJCkZFxKCcHMTOAD4m8XnIcxCPtAPozvI0ToIz7I2V38z5sYw/YfOnZ8i0-IAKiViP0Vh8dwZntpoapyLPPHnQyjbzXXU', birthday = '07/20', start_date = '2025-06-23'::DATE, base_role = 'contributor', special_access = ARRAY['lead']::TEXT[], updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('adam.kauder@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Adam Rosenberg', role = 'Director', discipline = 'Product Management', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/SAS3RZSTA5pi6B5hUEFAnA/wF0SXdtGROP5aQwA-YqCqufSE6KRikEe093Bxh5Lxzgf1Q-y6o06jpukhI4W2LBwHRJkkQGMTluBfABShlJdK1YjPnGy0jqyQETrjdW4NWtm5JVFSHATOcJcPsqwEWc4qgjJg-C0Pd49UoXKb6EuaLgw-6FoBgmLqud7dUWPxZqNK3YNVhPTicLm1PrVqn-3Bg_LlwgA2aIkV2nFGgEwag/kbnYS0b9eYkYFwDNlpnPppZ36fC_NVceWamlbBEG700', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('adam.rosenberg@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Aline Bordoni', role = 'Senior', discipline = 'Product Management', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/DY3oLD9phHbwpAJja3fkLg/YLRupqt8B4HMmncRfx2Wv6Z86k9Ge0FPRDOknCNqfiumqyPbQH__RtZYz1lSici-A_fGKRQYGDNoQyQ7zA-z0Yumkl0MlDrROAYYdlZ4U5AcfbVKRNZr6OjNmDzIkwAOMP_fEeA4e3B1X4lOnuBTf2UgKtxhuB7GnJSXMo1mP1nvfxMPLhJbhskpTuGaziusXTaMuMFydBdB1zfDxUmuCA/smHuSZxXHl6UfOfBTw1EOvj3vpjpqQHxjHXHiBfitWs', birthday = '04/24', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('aline.bordoni@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Anna Kim', role = 'Senior', discipline = 'DART', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/6LwcMGivt0-jjTlHQvvgvA/HAa734m6VaYvSTbpi4oezMtG_oC2LhpOEj5WvZz_cozGSLMqMAc0NddQfQ_IJzPxhbHXt6w1fjPZVQ31nc8IF6t6Cj_RMUwNKdPcZR6SfOo4cMsOYB8yD1x0Uztx2BD0nHpGpmMT0G-OvdfgOOfB8rwJ2q7FPaPSHuQImz2kyccfefyRs3gXh41xRlJR7UDCp99fwqGTSjCYx2LOvf2CfA/r65vGfJmkJ2iS4kTtMQb0RHmQn_AF3jC7J85rXuHueo', birthday = '02/16', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('anna.kim@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Anne Sachs', role = 'Senior Director', discipline = 'Content', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/858viqQxvbM4Lp_Ryw4KrA/BnyqgfBOU-0-89g8MF_kTs0mjBY-UgA4RYkEVUiyxdDsn1a2vlFH2dY2i8iJA_spROlDdShFB2NyfrmyqxekMMHORlRSbE9vdABIoT1WkQ6PxbXIXlrNRi_x9wUtIoQ3nZkxUDPVdoGMldzGDbBntt9oL0n1mosRiA_4tAjnPec4Pt2ta24uVnHi5iDZq-3d/MdTcr-7N8VJjh2AkL7RaCIba0tzSbzYbJPHzjXNaL8E', birthday = '12/03', start_date = '2021-09-30'::DATE, base_role = 'contributor', special_access = ARRAY['lead']::TEXT[], updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('anne.sachs@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Ari Beauregard', role = 'Senior', discipline = 'Strategy', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/Et3LXkiTcnZpBuzFg5CkVw/1J9KyCXabb6rYQZpc2YUKuF4CnQQ42LeanJ99LnISsffowBtClgtPW9f7CQpLu_5j1d6qicQiKeheWaZusm8_nhgq9E1pqJAtiA_882emPd8NqdAMSAsQWiMooPCrpB3T7tlIvZgIeuE0Edrhzca0AptiGl7jg-Ws-U991en8gU6LCFrGO4Su0MBm-jTslir/c6OJfx582vjWO_RE3YzVa6m2p863Laj7UI9wkvEmiVk', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('ariane.beauregard@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Arjun Kalyanpur', role = 'Group Director', discipline = 'Strategy', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/-17UMQV6ZLXW7l4ds5ssjw/Ikv4ldRvFTZpvIOV61iJcnnSZ-61aEJ89638zivFmlQOuakMuCS-Y5j3knFxf5CxMSZdK8TCQKRfJsqUXyJwDBoYJv5Ujb6TSHMIddQYcWa51rPeRp6JRZV5OqquhEPxUk0uD7UdEMMTEYHWhEVsfUDGDod-bZp7gZ7EYCVaA2Hv0MOmUAtELQD-mZ4gt50T/VbRbR7ZPL5lfmsPDwAXwtbZjLS41jDIPxpC7tavjtsw', birthday = '07/03', base_role = 'contributor', special_access = ARRAY['lead']::TEXT[], updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('arjun.kalyanpur@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Arthur Alves Martinho', role = 'Mid-Level', discipline = 'Product Management', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/-gKlMWYQBal-euWQ7dH4fg/3_9f0HFFFh39kmWxL68pKGZGMaLuFs3AFPKS7RBNb-LfT44_uwU666WpKzcj8u46ofd92PSz7VvKoOb9qfLeck1p5m-yV8H19QCcjjc6C2NR-VLDD5lqrBizLR2xo3kVGT1T30Tch570D9xwvAZSNd53rDLb0ROv9yNrmEuL6U85wciEI0JZXfot8Z4IG7CvXLOcSNxcjKBbQn7IhFeKCA/YlWd1SUodSfwphesUmEYaNyk6U9XekHLl7XKjUINZvM', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('arthur.alvesmartinho@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Ashley Deley', role = 'Associate Director', discipline = 'DART', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/w5zZuoz8EKvU6R5475RAkg/rWuuvqJtqwe-787p1DuOUsumKYSR35u1wK2Tq3njR_oBmxKtpoaPl-UIkPNNcJ4H7xO_I1dvEh2iReWEGTTu3qWDxwTh7CrpqwUbKfmEjxEjPSII8CX9vFDbbfLqNm1PMpWDUgi6LgFaQIHBpjHDPY9IkKLwUSdHHTFW_m_dvnmW3nSxPjCkwhkvaIz4OzKIUzpVPsNbS3vgiXco5dqZiw/MA4yd9aoxxyIVJak09NtpAtaMHw1od8IaXUYj1Awweg', birthday = '11/21', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('ashley.deley@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Benaelle Benoit', role = 'Junior', discipline = 'Strategy', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/uLzlY0Y1luGBduezAMM6IA/BuIAZiv39_Lpydv-qPMKsbZQq4WQZHWpqPc5tH35vRSjYTgkjPVk-HlWwEDP_XZnItHM5AMeI-H6JpJ1Kdvtn6cSw6KjXHmXHgKGdKrLKrtpxnNWnIB_y-qKJpP6Du33NSC2PDESB185tbhG2t0iiFKj5YvZyF5MDZoZDz5DuasILlnmYLo-HHeTqVXm0o78AqppmDQBgDSFQ3naLEcYWQ/C2_TQDE8h5vrpEXHmT4DErq5jgp5a2Hsg1l0uxS2QmI', birthday = '07/28', start_date = '2025-09-08'::DATE, base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('benaelle.benoit@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Caleigh Aviv', role = 'Senior', discipline = 'Content', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/2YccHYqpvLeL-JihzC8-7A/Ta3ZjWbwHQDt6GBwjM5SaGVObCu36s7TK5PxVcyYVjtGiNNvS_n8GeTRzEC3KZTcnfDAq-1GIGo6HXEW6zCtM9FfLn5v3udN6KwzHL3eqtv1GvwKRyX1vOa3oXYKHp3PgMebRMFIFridvY6ZzOkgODfFiR9i0caIbIbZA2ELb00/Q-dhvUtLZXm3LERv6vpmHA6-iEqPHKGesX2lCt6PTDc', birthday = '06/14', start_date = '2025-04-28'::DATE, base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('caleigh.aviv@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Caroline Bush', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('caroline.bush@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Challet Jeong', role = 'Mid-Level', discipline = 'Product Management', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/6wQ4X-jcx2_Jk-NofGY4VA/S5IHVPawAxAJwGgSBVdSbmiU5Pw-tFmV7dpPDEHaZsWuyf5cJjpEO6FmKlRWxWZPt2GFjiayMYMci4Isw4-3PQeM_2922l-ksWJEXEW4uPJ5QMee9eLBvwf7dq5jZjo4COGSwy6x3119A1tVsGPdlQYMCzRDWe13BSD_yWOKcznunm68ZLB3JFz_m-gplr6hAYRtkqkP4yDkGUKbc7hqRw/HEOiVbs_V4Np96JUGprb9PboMSGax8wwL5P09FIpUBI', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('challet.jeong@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Christine Clark', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('christine.clark@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Danielle Diehl', role = 'Mid-Level', discipline = 'Product Management', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/3McAR6ZKsLPaD4kP6Ti0Zg/cXFcAHNCH7JoWDitSmxuC7OQ1xttB1zoSZgpx3v1E_ygdGciSOf0hhNkCk8ubRwydPMTFfatY3Tg-GxeQqOq-b5-vP6Lnniqbri4cWj2EQ0uWeI1F15khGjwPeFlO4Yti_i8mRZHKx-f_NsSoF2Ou-DYgLig8mi1oR417q1UNM7jCNOK9BGaLp_NOD6YbKjiYtrLSXw47UEKqM_4e3ofXw/_A3p4sNh-lgQQEqDBV97WzJsOW3cLJ_GwOghoX7Jjak', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('danielle.diehl@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Dante Clements', role = 'Director', discipline = 'Product Management', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/-R3o9LTDhUL_rd7cgemdrw/mTfInBNVRQDIyoo8DiAfn-ucqEyshN6_3BMNQV1OlLpETURqw-ujEa9h1Y9f6UmDP6fJrDYiggolc2lAsnk_SKRQ59IAKnJT0i-2hp4fFvHqrg-VCr1fFZhHvVRTMK1NiLHscqgYNaSwc2QNzWFXcZQa6ieWbKIGplzU1yoaovF7N-UT99eWDUp9wz_SvIx-yH6-OaEwiU_9Dko4-MRMZA/HpQ6TcZ5a4z6EzZNUVXUxZcHJfXITUKp-7MX7cBmnHQ', birthday = '11/15', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('dante.clements@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Deedy Chang', role = 'Mid-Level', discipline = 'Strategy', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/kln64NkzEtfaxGfekVd2_A/DOWjaZ4m1ebbujegvm_TiN49qxuTUjbB-U70aeLeKJ-LDTZFb95sqWaDlfSE2TVcsMSxvUPEVjFXPmXU64k2dJT5i9KBpAlu3pUwNxII9lZq__nHuk0sJ_4_R-kFVdR9_YBStpjCP4QumV1r_OjGr9A5uNObQ5tsA_KQMmVghg8/E9Rp-KIwrXhXp93bdwfWe5HiVCL9EJg_inc8g3RHUvE', birthday = '11/21', start_date = '2025-04-28'::DATE, base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('deedy.chang@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Deva Sharma', role = 'Junior', discipline = 'Product Management', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/IH7rBktDNJWaczHcjBWrfw/ro4iuKl9GXB2ogpRdfLhzoxjDGiVi3TaI4NiNmJN3MX4iTplXtVTVRC84uGPnfflN397-FZnPn_eOgezvqxNzRDaUgSjIIkescLjrox5f3R6uMHZm9X9c6BnL2nrzMYWJl48xigHMdBbjns9P4vFHQwI9EFy6-rLKlkGIj0ggADRrxHSjzHTXXK8wJXsbhpGTpFMxaqZe1G5mYZpSUB5xw/Mk6sREu7XnE68DcQcmml2WGFYHvlF-Au2qKKQqZBAAw', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('deva.sharma@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Erin Henry', role = 'Director', discipline = 'DART', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/bG4gtMgPN-A6G9EW6hRgmw/VSBYMjwA4HS-XLoQNDbtuNnUJS7V3vw4p0Eg5HChBfYygUtPcmqT57lgE6SzvTp_6mfcO-78JVZMgsE4r8WsYitj63vk6wRfRxz8rcaxqZsnNkXyhOcUo4uZ5kWYyPbsKqf5g6Yw9hXmBwwSLoiKmOER19GrkCm8uPFFtczd8cg-otKR3Z5wDEH08pmxmqBzQgQXjZHxScN8ulX7SF08Ew/3WrF6fda954BLvUdeFOX2WDXbQgnDzKg6tXKI43ckRE', birthday = '04/08', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('erin.henry@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Gaurang Agarwal', role = 'Mid-Level', discipline = 'Product Management', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/AYuedRxKafsAQBdt_5wQYA/8Dq3hQ6k1Uy0EymxV-CL49U0otDCuFnVnEDHvTY_DTut1D5oHP3ZQc8xKY1ZMWfASstEju7O3qB-vIeCGAJBv0vDqmhWSU86u1iN2hF4szfimT4A_8X84zucvXcSptAJgC2yUrUjPJsr9jwgLEAsGOSdVvgGwVd9rCM299cHqbkQTr3cnnVeFmDFwPTt3AQSvOtgZRwPmxKoA6jIAKvyIA/-Oio8MR7DBvfTItCRVaEok9ssJLMHpaABjw3Tl-Nct4', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('gaurang.agarwal@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Grace Zec', role = 'Associate Director', discipline = 'DART', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/urodpQSODrQZbe7fU-zFBw/Gk9AwLp8oSeOrEW_IkqhWhphrZX8bYPV-W9PLh57SzC2benWktxrKk1pbK5_dOyPT7UNTYiMqo5uXV8ID5xjBCiz7eW-OS1VQEnOLcwDTAr9CdAnKeKwWC3FEl4GBnSYwcH7bstl4gMeDMM-47AHOa24F35qkBx1L-UCwZ7k7ap1l9ii92vZ6eHCPFzeP8RaSgpmEnZbR95p8hW9UFNtsw/WH_WsUInerpbjEs2J1bOI4mJGqW_HC_AhDmzm0Wbb1E', birthday = '04/23', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('grace.zec@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Jess Volodarsky', role = 'Director', discipline = 'Strategy', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/MMVCZPN9zIIQyLcQUmS-hA/HVmmEZnnmt2vfu0uPqJJZxTBddcewHnBgX9I0uiDTvL4SdT6ENSyMQL1VLeNh3tAnEnvbx9dMous8ySZoY_5UIrxtp0Pe_SqHgxU8QMXUQ_NoRWssjZKzjhNpkIEAtPm-Z8T98M7hNPRCyUAbvsR759BJkWF0-TgAChSmF0oEhFH-YxTprfKWxlvmUGBV78fj19rG7CX7ssnNJuBiU6jeg/P4QcvzDdssqezlvO-MK_YoxD3tdJryOY8OD3MbihzC0', birthday = '04/24', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('jessica.volodarsky@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Jnanesh Nayak', role = 'Senior', discipline = 'Product Management', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/VH5Hm0J2Hk8efcG-Ao8Puw/XaWS-9rbc3zwe3aq5T6sQV8zSMXlrwnSvbcCvxg2iEKuRFnMPzbKyKloFeomi3LLfC80SEx3x6T6xaQljbcvLDcu7bBc_DvawGAMTb9oXu5618sq3TXM1Ve7a67uCx4MKHdTWoHWOp-dreH_Epo3zpp7MBJSJc8IhltZgVzaPvEOdpR5-CJGTm5qluNPsoBV5mRMz7gIa2ZDB-cVEOBJbg/Aw1O7B6Rzd_VmarK535j2bijVDjeDcNDKZUwT21Z2Ug', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('jnanesh.nayak@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'John Beadle', role = 'Senior Director', discipline = 'Product Management', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/aZcRXkd29sd3eFmSUdEkHg/9EhFJr-sQPFXejADxGrTT9abgxruoF3t1LeWeiE18i8yEj7-FiG2gM1ju-dZ7aLaXqxzxQj8JSV1vkD8DScJuV9-zygRm52XKocc2rhNmSPNZL1NI2baUvlmAxzS8D5CjKPEWgpFUzcMzj7fBXeeVqmYygOCFRc-E6vERTMJvTJ1ehfaHf6jF45M3rQxbvkdWHMLkbipmE8a4U4qsEyxHw/j1MStLYfIbxmrk4HEz1sjIoCyILKsVJrg1cRc-40U4M', birthday = '03/28', base_role = 'contributor', special_access = ARRAY['lead']::TEXT[], updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('john.beadle@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Jon Novick', role = 'Senior', discipline = 'Content', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/pR827jLyAI85jjJBI8GXew/YUZgQlkfDKA6LMvQ_v7U-a8MEkkHSKFUOTlVbki6ir7SQB2k7eUI9kR_AeoZfDt0xjna4SPxKKpGvtmivjpk58ujFikcaW0ZDrIgn77Ms_rViHCVFus9BiyL222Nlgv4FTaDeUwcg-QFUvwqIWwoTEObxXWyrdAUnWDdnJWb-vSRSTJvCp-paECrE5RgskI6y07ZFkyD21rCGzrg2rsRWA/QMFYU6bHOcRzpVfXGTFgIqaGwgGmp22WkOxZNgjXpZ0', birthday = '11/06', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('jonathan.novick@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Jonny Hawton', role = 'Group Director', discipline = 'Strategy', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/zHg2jpBqAtEP6GsbXrIp_Q/oN9YQG2YfED284XIYDHxIPbn0Mf3CBlIpgTSV78bB4DLi1sW9y0e8J1qHFNTD-huasIQ4AWf8Efb9aoUgdE0wq4qInNLWYoFDxD8rVnVv7L1L1ARpbtdLDcZ_6w5XoGu9qRNosDidNS4KiFbYYg6whEjTgjUhDETJBbTNMx2n-VP8gOXxujFuthhORH1plvb/d-VoBoGaZCpGb57KtJtgZ2CSJwDU-84Ovsc4iX2EamU', birthday = '03/24', start_date = '2023-02-27'::DATE, base_role = 'contributor', special_access = ARRAY['lead']::TEXT[], updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('jonny.hawton@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Jordan Disick', role = 'Senior', discipline = 'DART', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/cofT4G3RGNvRb7MT9h4l5Q/Ch-FrzfrY8ZcJevAIDCXQac0aPuc2t3eMebBRi5sSxotvQZuE8iFXTOmV6YQWfyKM2aD8N6exYZFAeO9R1TABlGzo1SR_aOjXD5ql-TW0W6ioxgSi_5U2TNhZW23YTeh3jeRY3MiLGBAuJVPfdjx7CWC_zPhZfk8zjxzniIyBUxxQIb9FQehE63KThtr_QmCDBVEf_ZaOgALwP0saam3GA/pcUjAgoucc7lYiMdxf_4QeUcGYiFnb7UT0KC6j1jK1g', birthday = '08/04', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('jordan.disick@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Josh Currie', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('josh.currie@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Juan Luciano', role = 'Director', discipline = 'Strategy', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/j7GrBTetXqqj_NCstJWQNg/df4c6A2Erm1ZdwATjVKVTpOtG2fdxNaQo-o4cBcOlPbDxFSsRYLGeeooY3JFJWpt7hrTibKnhInZ7IaGFEElRtYIhXPyrXVxGhTSmuFMGm7MHAuKsPWm_pWHH0SPRg8R1d9rmymKMOel6gXR0YhzA8zRwI1Fym6j0Hz5SdwUhDZUpjrwbhclXZpRSYAVLUcQVoADLbLY-18Nu_FRYqeCHA/wJ3B0g4TQqoYT89iVVKjVKcN8ZzS5-BH2fCNGGl6sD0', birthday = '07/20', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('juan.luciano@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Julian Alexander', role = 'Director', discipline = 'Strategy', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/NVKiFbP9woS9b4LsylAZhg/IZYdV_-sJu8NVfmftZqkITBicMafZxObDs4p4-UCDksUwtd5wc4pYko3aNGKRilOAl6aae0XD_hyLULn-YyBbwP5uA_y4ZVK7Lep7jCmfyh-pbaezN0U93eYWl-M1kYL3eumiGxxtxl-8vyU911lhXkbIvP-mFWXhLzGcacOlng/MCZarzTh-XhZokk_VNj4a8lUq8m9AFXB3o2CVSyVsBs', birthday = '05/27', start_date = '2025-02-03'::DATE, base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('julian.alexander@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Kaki Joiner', role = 'Junior', discipline = 'Strategy', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/NPK8o1yJVTfZN0scRk--sg/6eopbmAGLr8bpBqyfoCZtqmH3_GwSs4A-G5iySAvrN5EY5DBEhmZeF9n4Wyg6S8nqax012nloHKOX--ciVztVYG8jCyhD-4KJ1vfeGBacQHCIK8By7gDExJ4OjWpJT3yBmQVjQ1TcyD-ukEolKCFGuOm4fFC1jphQcp1lljIRGXAk5tJKu3CDHGVW5Ch_w5v2SG0i8T00lpeaeAYqfp6Mw/BgNg4q8jgh7r-jMFSNSapJaAn087tiF3O1DTIieM2iw', birthday = '08/17', start_date = '2025-09-08'::DATE, base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('katherine.joiner@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Karen Campos', role = 'Associate Director', discipline = 'Product Management', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/86lkUbhk8I1v4sUFVD6BmA/_p5U5wUen0cVoGO2qqYxvAVb441MivRZFUqM8Nf1dgK5FQyN4CrznL-U51KQqGNJlJmCNjRsPGadMVxFTe0gPEIX7A40P642_CyzwZcpsZwCv22_M5RccP95QLLjZ0gAV-I1osXHcQRYsXlrqtbErwBvjcXgAffJ9kCyVt1Gmw99DJv2ThVih8UiM7SqpTe-ctw15kjNZ0uu3e2AJ58KOw/s1Tvddx1_0NB8XHR3QpCj0YCpd9vR6wKDXeB5B_fSS8', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('karen.campos@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Karen Piper', role = 'Co-Head', discipline = 'Strategy', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/DLtlq24UUbj98Ee2OQqZvA/VPYSs6W_jNh7gJFpL8466zLHAmUz5AW2UehARR-Oxo5svWG3aZiFDOUpGW6oaLiSwpKxtoWk6Azfuw1aGhFuifbFTQq2iBHXjvGVqlBo6OVhnLNJRZHAP2gWHZGWhhY2wPzjULGEtMV-LKOxtf_rVN6_Yf3OLs3wxJx9daI5jKZamfx62G1wOPtTN6bihydJ0giYp6KH1ahV_mT_XbWxvQ/zw68xCts-MxhCaiBtlCAWO0wGc-9E-GNqcj_NVpsvS4', birthday = '08/15', start_date = '2022-08-08'::DATE, location = 'Portland, OR', bio = 'test', base_role = 'admin', special_access = ARRAY['lead']::TEXT[], updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('karen.piper@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Karina Pino', role = 'Associate Director', discipline = 'DART', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/bimZKzXZX5TWH5b60Cmrrw/nfId5vX7U5ITC8p_hKg14wEeYFz89Ocz4xIzqniN9c8PjhpLV6ugQuJLClzuvQKy3qvNgZOnbKUmd8QApZQ1l4bQr0245xO7n90aga9hHvJiOfOYAbD2SdaEKT5_HwB4eku-UKwDvtAkIeCCf7sBgHO9CozZEt2WRUztAwyc5_dIHft-NHNGe-_r8kg2ccMdrLO8X0iH0f8DJsTLyyL_NQ/bPJCKlXQyAcp-ldtE5MlRGl3SIPpCYGRDiJZkUqO9jU', birthday = '10/18', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('karina.pino@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Laura Beckford', role = 'Associate Director', discipline = 'Product Management', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/956THT-U7Lyohw45Q2kfDQ/iFg8ikxX6GoQV0TQyWn17UDdyaLu0dk_yNzI3UlbGdNZMQNbV7cQwC-nuS-8sHo_oThxCkttwCs-qdZ5MgjFRMhTBZtmD7GZ_NSjQftLe5Jep3CzQLxUZrZPDy_TEFL7vhnRW5Wxqe7p8PXNrGRbUOy43N3IPJrTJCUcuIR00SqAYAo53Qryx7YNLy3ac3qx-rBvLlcNSnzugbBfnayVtA/stWnANJdPqcDPoh8p5ZP4zvnktUj1fkSJfH1FXroVE8', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('laura.beckford@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Laura Casinelli', role = 'Director', discipline = 'Strategy', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/C7MrA3quCqWvAotcgXpz9g/lLnizQASwpQ0wv_EiQsXsJp3NKOc-kHo-Qh1le17V5kEloU3VL0y7XKHPewG8NxD6O-MTVLVTrL15Whx1me25xLXTbb9XjsDIgZ3yBJ8kn6iGr6_fHg-241eLbwf1upOU2Kr-aIxh2pHYW_Dq1fSwMvQqsHTNoIRJJYltbaYMirNV0zhP0HYduy_EPT4FIpj/9ER-uN5HiQ5FZZwr1LbGX301YZpI3najmQAxUal_Pvk', birthday = '07/26', start_date = '2023-09-18'::DATE, base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('laura.casinelli@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Leann Down', role = 'Associate Director', discipline = 'DART', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/oMemRE0m19pFMCq8mRTk0A/612IjkcjMCvITAd98VfziyYShHrPDhdUxvgouRUJlaTCppPWlG4gMp4rYvNCGZB4c2H6lQksiDRl3WaLtBY4jUDSHO185MXO1rSq1N7EzNtqt4oPmNkB6BJx1pk7SG-1N35xQ5u8DF67OK0mrgbScoq2g5fo95h4LWfFtIQor1xbh8BBZmuVwk5yZZDkf7TwxQshi-xrJ1jfT1UNbaazvA/-tx0zzFLD44-dHLY-hDOdesKhiDQoir3Znt-FRCMLQY', birthday = '08/02', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('leann.down@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Liv Ranieri', role = 'Senior', discipline = 'Product Management', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/NK8HvxWm3kBS6ZTAEE1DeA/kZzZQGX-kJaq3ZhBQOgnC7rJQyg8QIUvfOgdSlJOq2lmE0xExH2EA2lFeTmfOYo-9XyeR0CiGAdHUDslv3NQf1luyqGuHVVj55twf-7FxV5fnhy6MIrHdavHwbFXwx9MnrU61F_zl2PXgKL7sROYtXL72ZVMC45Fg7ZHo26kqElkQB0En7eBa8kjzl5CwWHodv4MqIyNITGeYBJEc2jF7A/aZ7MAfqXqzFWxAWWqkXkxALeGgd0DcDkvEwMTEAr66s', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('liv.ranieri@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Lucy Ye', role = 'Director', discipline = 'DART', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/A8bQ-37vD5fWo6B-AQELbg/rNTqfVjZxIZaRxdxUsiYMe7OuqzohvxA31DwXRrKjJCvNHphAiWaaRuAkHHHO6ZvvfcXBV1X2uM-Z0TZJFzwwV8UcKuuO6rjnixNMjfdXiY0kCZfyC48BKOiewpDBDoxg0g1FBEH4eWutjA6CJS0w-qD6VYRaMowdTdwWQnU0L-LYZ0UQr9Bd9TqB_rn7jJ0jbosyLrL-tzgrtrkIBd0aQ/2ByO7pomqdPs0_Ad0iyn3N3AVp8wB7CCFy5ouCoBA0s', birthday = '09/11', base_role = 'contributor', special_access = ARRAY['lead']::TEXT[], updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('lucy.ye@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Luis Soto', role = 'Mid-Level', discipline = 'Product Management', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/Z5YEQz8KT5r0nfhqfSp1lg/prpWqtNKfyHsetGAnXePk21dVoMJ3Wvu-CI7elPi-RLL8qc4d7cj5A0QSP6DGHHH02k62frrFRud-t5q4ZNONURnzbTzGQTrAyxhEAnmtTgcPFzFvfJzVtSME-CKcmRZ6Iw4Cbpbwu6PxsMb7_Uvn8VssiK3JABEivGv8MdyoLt8xsCjzXS-MqoXtCgYYdIfFx7wFBwM3iIpD3_tdQNFeA/Ig_iwqhCaGSDu1qaDyyUlCJeP3gfdZDN20hCDB0K_x0', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('luis.soto@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Marcos Alonso', role = 'Associate Director', discipline = 'Strategy', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/A5R0bolQW0Ltxv80jUrOIA/8mvRrQ2N8JbC2FAF6WkM9IraBg_B2ERNMGfhIAcBgS6jnS4ECBAl17KzuQW2eCdKKkJAVtRCgC4O1FK9ZYmwbQku-Q4lnFzVp6m_lQ2_ZBizqBiUgM-9kyW7jQCEvr8ZMUTK8DlE3gA4poywXZnVww/zmI0oDmHwLIvX50pZYCNeqo_PLQs9DMOdi0wUCZfWPs', birthday = '10/07', start_date = '2023-04-03'::DATE, base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('marcos.alonso@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Mark Silver', role = 'Senior Director', discipline = 'Strategy', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/ddjpy_-ofhjR7kOcZOepyQ/KgEerWiiFf2lHNvHVi73rEA9WgjDDrkwN0fD_WJ5qT-L5kwd5HY3C2GFvriQjyHbDfwqcDGvUZ3ile04gGHL0shHqX7qvbZj-lRgmlEw7LNVG5aKK4sGANyZvmBRDjmGoxNRnb6LbH0GyRjVTAwkWd9awnjTFq3IFpXjDK6Q2OTCnqmggMTxUBpXklNpiANMR5npSKeUHldWozS2kukF9w/sPF9Z2zDoQhi-QTCgif9Sl4v-Jmi566TbLGJQfzwQV4', birthday = '10/16', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('mark.silver@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Marti Rosenberger', role = 'Associate Director', discipline = 'Strategy', start_date = '2025-10-20'::DATE, base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('marti.rosenberger@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Matt Stephens', role = 'Director', discipline = 'DART', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/a8RksXGTArcWCUkDl26ulQ/ZV79UjxXNRbwt4PBE0SPlwAKYsrab-7-TM-YMxuzO2CCA0t5OzwxCQdqVqQ44Uc1mbIGyFE6kcts4jZpYm6RsMr_dGjjt9leHCg7IkwpP8vax8THFArSpX9rp2pMEs9eNklnMKm8_A0JbZe-MZ8QHqXNlN_mjaV9AtgNttdtjqlKnuL-GyYzAn-ZBZDSV6WImtDzkhlSS1No13paw2FuwA/jJPXd2azy8cwoaqWGdh56vIqjrqlTjSMz0XwAx9tW14', birthday = '01/19', base_role = 'contributor', special_access = ARRAY['lead']::TEXT[], updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('matt.stephens@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Millie Tunnell', role = 'Associate Director', discipline = 'Strategy', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/FZgymh6qiNRX_Vc9aawVxA/9SiXf1Bo1Iv5E5QLunRzjXJe7iFLOrU6Qm2X8eDSNIvUXsIHdqAF4XoTIArcsJtPVmnmjYs32sihpYafiizWB4E2Sxl5rjyEKIQKkanComnVCodHP4oLPLjD-xHE-D5UZdtSavIpwf8aYyJvpm0yRosjbcU7yRhF2OnQaafEjoY/VQNQ4fbU1fqX_NnUTBYtAhZyyzUKuh8YF2XL9McEuYM', birthday = '03/07', start_date = '2025-06-02'::DATE, base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('millie.tunnell@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Molly McGlew', role = 'Associate Director', discipline = 'Strategy', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/dfXxFHiCd0JH_Bi86mQOJA/95y8QkqtHcEOXozExgXVHtDA55BXg_jwvk2HQALPlWRVGYIKg_9VyK1ffLOiIbrv71RHmimcmbKNvdZ9zHc6N5zqFlvP7_yeK98nfVWIYcr56K72wm7qfbr5_2meQNqCBSGHEb1-FfTKTDaL7E3NBU7_P9fEJiNxG6IwF_rZ4TDCNw8aaGth12S-oIBJGxrSySroyC9webgZH_ZK_wSNMg/aSgLhndzZu_jI30JQrIFWi86mTzy8dI770IfPoDMLYA', birthday = '12/17', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('molly.mcglew@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Nicole Recchia', role = 'Director', discipline = 'Product Management', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/9C1oik_ont05rAgSnu8Z0Q/c2299_pYkf6sNO_Nn8s60nuQwWyQ3Prw0hW7d40nm5l4PG6mIhwe6xLAWQQBnPrQ6iwufSP7hGIUhiq2vdWba-kTxNp_1nLrdzlTkRlIWerlB2w6rsdzGEYjiWNUm_de4YUO85n2CQ2nBJ5ErUVbCJU6yvt5p5UfyN_Uu4ms9IFgcUnIu1kq66LAL1FlaBDFQm1UEGf7k12w4hU7tyhyuw/OmX762gyDofnrVUR6awlxrYSQMQHe7l5JhDgNNxLGSo', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('nicole.recchia@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Pat McQueen', role = 'Co-Head', discipline = 'Strategy', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/CxrcdmEzRdbiJBq1I8MJrg/GDMouiXhgNBhQ7GksTobrPDCUFH_H5jRwtfK9aXjNqIMH6CZEFb90L5oBTP2iV__gJLZuyzXpFEPOObq8flK3FAua0FXg3UEiKyN5dcb6RCaGjUK9t5Pp5uWz78gayD-TSjfSt0USOleideertXOLR8AIL7ZrzN7UHpnY4zqVpKS67ilhy9Ane2z-UZEltVF/nnuuxEvQ0vZqqgqMvZaWaxtbUDdCba_obfTcey5CSP4', birthday = '02/18', base_role = 'admin', special_access = ARRAY['lead']::TEXT[], updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('pat.mcqueen@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Prarthana Reddy', role = 'Mid-Level', discipline = 'DART', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/RtTjEWjj49XBgrIoqto84w/i3Cus67YtvVg2H_uqxsS73gtBI3gE01zbDUCaV830WkD9yt2VqbO9t1qlyp4q2CmY-4G4hplqMeCh6nGK7FMd_FCwS9xRP-Je4Q31AqmMJbGyQ61j5NiWHK6vXvZFaWio48TjKJgsPh0BjElDJd_v-JNG55otbMVxee3qMy0XbXlT4BcP5wvxSoKL-5sfoF6V2w4Gw9Fz9OwRGg8KqdVWw/cgilU23jHLQ38wbNnxN7yFS2CpkDmYz5OneH1fyloNM', birthday = '10/09', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('prarthana.reddy@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Rebecca Smith', role = 'Senior Director', discipline = 'Strategy', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/wJU_0MgcWmeT6Pwn24lsYw/fton1wqIVnyJRAQ13jXTd0iiFEYnHouJD2kK9rfpNnO2sa3vrEJ83_QqAH6tHu4IHJrzY5nHuTphDWs4C8bBDjTHKJq0Zi3DC4A0PoyLur6nmwjjQmAQl-SckcsACZRxHVDybA9eCvgw7_Xb6nRnIqI4aVSqvuS0Rxu2V8RZNvbQi5onaUjQ2DQ3mJdrRx1Cs9lkpecsxXtrt07W_leKdg/1FYn7tK13tuKDD0ApG_q9dYPX7TOdUj0j5IrJGyYF9M', birthday = '04/28', base_role = 'user', special_access = ARRAY['curator']::TEXT[], updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('rebecca.smith@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Rishabh Mishra', role = 'Senior', discipline = 'DART', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/ryA64OT7wNfex0DGMBLnWA/1m5dJsKJVsIFyx5hdMAymYmGIZX0etrC6zbzDuEEM6VJL0eqmWwkjJ5n5epJy7Lf3ZkdB6Lk2DpPwTnk0PmR1EDK6RCNmJTWWEfvDia9BoTvp-BZK_aNkDoWv4rNEyZ2Nh6m1KGJm81lNU2yULv4KEToVmI15Cyp-BlUOkRvLkOS8o4lKl4GuRF7oohe3CqJwnaWGGLXXShkoTWglBdHag/Hvq2yiWgjBlAosjb6V5Vqv9yqBAiHxp5HmgwGdn-C2I', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('rishabh.mishra@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Robyn Matza', role = 'Senior Director', discipline = 'Product Management', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/YQxj5vWoFivSLd6LiSrXKA/ib13jM46PGUGCpaZUWdt2ibJudSch5Md2lxTaDB34S9a78NSpzrsopgRTvjqInV5DfoYROw3YV3DPl-vmdQXgDbfc4EYcjXzIJMmisRhRkw93XCq6IAZxnzOP6lDDNKRCPCdAKGyKxRJwKfQcIJ4FKd81xGYvSZwSsfNfSAf0uVyyER38EkgCxPC1_YgNRqG/UdlBckPciKZJZY2WuMXfKqscZdRsK8wDJMxurEhK_Tg', base_role = 'contributor', special_access = ARRAY['lead']::TEXT[], updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('robyn.matza@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Scott Lindenbaum', role = 'Senior Director', discipline = 'Strategy', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/cMm5BB6B_7e4kwBhcCYc7Q/rcr4eYC_32iAu8lCU_Bjhf8D3u86EMrfVVF-Q5dFPtwK9moq1RwqFAgybIKPvSOMJHImi8BALNA-Fm-bVQ2nX6DuOKWs9cLhzSy6yMv8FXfBVe8XHgcqs3QDBqIHwvxKDtEmjEIhGAg37OgIZqecNjTvxk5JYugoM0MACS6A4dk2J_IeckD9VGdXZODfoO9Vf6mP6-M5yAOtJyDFcJFKwg/Kujnn7rpERWT6gzmp5NXjYlYDds3F09yhtpDxijfAA4', birthday = '11/08', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('scott.lindenbaum@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Seven Harkey', role = 'Senior Director', discipline = 'Content', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/fGGzS_aQODdfhHZtyc77cg/5NLeG1dvreghWJ8mugNRSR_Mn-OFipLyP-1SxkX5qq29NkarBIf7Lx6hwXGB17KBq1Gxa9lixG7adh_XCXuXYeAxbsg0fg-oXn9E084ifhoS5prki-e6gcKZ7L6VuKF-WywAC8UVduNZ-gR_euu1FDPDLfTI-FFXRE1dqETVgxHlzCwdk4I0wLNjWyIWqA2Pd79I-Bkr1wmiT4KwEZEYDA/po3un2hHKJWnbdPV7BFAfSkEPOyKemAQom4QZNoUFB4', birthday = '10/01', base_role = 'contributor', special_access = ARRAY['lead']::TEXT[], updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('seven.harkey@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Shanna Fischzang', role = 'Mid-Level', discipline = 'Product Management', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/fFUcL8V-RRQ_W-FEZuLc-Q/AifvKvM6K_g4bCtlb454V6T9R2xaKh7XJsOlxF09LCulNQCA3TrMKs_3dcZRpZmGbe-7PRbvQaHrxUMVAALpekRoyaJ6C0Vd8rivM-Hj3gBl0ySPMnB9bALCLL6P5dRW0yLyzE0hU5B4LrXf-Rmtuc7AF7tNZ-3DWXPxVh-W9w1ZM9YqcfWcd0WyMtLZbZuCGPeq9V-otHOE2fKSE6MJ9w/a1YkIkgv8gx3xtihFSKOqvgP8Op_Z3ge4TpJafXOUN0', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('shanna.fischzang@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Shivani Rawat', role = 'Junior', discipline = 'Product Management', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/eI1drfC0f4kdWM64bC0X6w/jgF3_Gr3qgZkKWK4ACwaL0KlvNrK2cE5jkccmZv_pOqLqjl04TlM74U9wbg_ohHCngdIrC3FLRrHr2eXHo2VJm_5osxYLMsF4hC6w9Z-PTVfXHp3F0zGFRVZiFAdVEH9SofAZ8TlbjrtB3a5vJtS8GXYYN-JTSrgE1gQg5vkwQ30hFm8PS-4RLB7Ya2HWnOlhTLzM95TMvL6G7zI6z0TLA/hn8TMBjWu1aVr8S0eR7WaxhnV-5LUVOBsfo0vt_5x8M', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('shivani.rawat@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Shreiya Chowdhary', role = 'Senior', discipline = 'Product Management', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/rWwWTh6YRDAIPaip4JVQLg/r0sbt-f6bP_v9KXfUIFJoJCwtTJDi2inAuItnYmvDnyDy16GCIjYMGiCrexrV5BTPmj1AZLt1PRhsIlDfeFCZ-gae8ObNr99Bl9_rAV9sAU0TJcZrGVCtopZP0fP2j6PP9zHmvEVrRbkVdpUpGkbc8YoEd9kvqEsQNX3hKlDdLHdg2NrXv8dCLZU8Adl5nAyDEnEajYk_nsfWDbjM--3Pw/TxLezdxBYlayQdCQlvVQCaFq1Fiw-v-ab9GG7mveSUE', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('shreiya.chowdhary@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Sophia Diaz', role = 'Senior', discipline = 'Strategy', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/GpAB4qBuAvj9IgH2J4KGQw/W2tMYWIl3wi2cJaNXwhXQZN8VhaXsjuMsj-6KWYZZUCbdtOuoRIzppE45oiGEt3YNV2LFac5Z0NqTOqVJ411Be8co_Bm0_0OOSIyXfvIduWM2bFduy5Db4wOwzcYUzhpczvRGB3znQY-XToi79CBlJClYghdYCr501ta4xo-XmJkqSMgR8JpBF2Ba4fVVqpLO3byxnU2wto-98voNxEgQQ/xGrYpbcoOR-QBUGWWXHZrCOSPi_p8iauZs1BlaEPlQQ', birthday = '11/03', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('sophia.diaz@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Sreeram Venkataramani', role = 'Senior', discipline = 'Product Management', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/VND-JmrxhIjDrDBD01_4SQ/LYYLT_GTh9UqSgifhBBDxdOV9tOX2RAui4cqOVbFSBjUbMdJRpJFp9xW8aDUCd6UNUIzHgf3tY3nUcf0pVsGouYrMTqX7Qk5UdCWHMHSnGobwe7xjcGk40UzkHmkKcT5TT_Yu1xcupWiangb4mX5Gp-nyqTBq8X9lM8Uc7FoANaVSJCkgDoXEWpnOkoUAgUcXFnNsUFnibD5Ii19RPGLkg/wA5bI2oL-SRCiVRAq3qzhWMhKwcGGBMExa5kBuZidn8', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('sreeram.venkataramani@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Susannah Green', role = 'Mid-Level', discipline = 'Content', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/PkIsohiMJKCZYXNUMh1DrA/Q-Wq6ViZNZkxbazAxEQFzjm2s5gHO4k3egNAh1K9ace_G4zuk4vf4g_-FzCwBwEbUsJSjRStU1htVZrUVqqonSaJxdVnYza_hBOAxpfVFByo747LrnfbkMzDyrj9mQhG8cIVZNykRo_cKRCliU6xpADeikmmhnsMe6-G2XCOr7qwVtg0TFpcjMeDRPcEUtMNB8aTwk-4ii9BjGs1eMbUKA/cxkWy-7nJr1scJXQfPMdVqgY1XcAhPFiNdhB2zJZD9g', birthday = '06/20', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('susannah.green@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Tomás Orihuela', role = 'Senior', discipline = 'Product Management', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/7bzdZRC3LF_BzuzsCz1dqQ/oPMAY58_lQMa3nF7dHyimYxAXRars_8iPG6p4YE-0n9D0kmmvoElHaPQqHgjSyQsw8r7rZtqP86p51oh57o2ttuL-gL9FflAok8SAl2yJzoEXTR6dzUX-eZbVrhEUQ0ReEdhh9wwLux42CxfYk6GW8pIoLSUpdPEVqotAHpG3bRUdoaZWJ23F0wqpMdaY-Sy996IOfOHy20Pp0iDUON1Qg/IQ3yF6eKaogKQYaeoyrsStV8wIIn6rSd3f4ocjChisw', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('tomas.orihuela@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Utpreksha Singh', role = 'Mid-Level', discipline = 'Product Management', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/Igrk9cUBdyoD8vqnqhjCyw/y9njcfDIdoacRJgZO_bsRkV67OLTgKXvOyBW1PMZPPuVT1buFhXw7tpEheO4Rl3Xc5W9VC1xcLcEUALgTD0MQPOCvauiuN0IKO5Av3Ln_1B4UpF7SENeAaifBiaFtnnzKdLVSaxDBB4XQrRXznX1ZPnpSnVKGe8bARLAsiU-IQp7jqGhezYQ25kvrCRjE3pWnG5xX6ojnDOQn-_S-DNO1A/W2ejvwz4M7Z50Wwy8qLcBPpq3t9q78Aun-yVc7pd_BY', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('utpreksha.singh@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Wesley Melo', role = 'Mid-Level', discipline = 'Product Management', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/EXi_4qN0GsSBXcjKIg7FjQ/JmdDuXWJ73bqIVK5N_2aIUZHXYEJtAAfsEC9sRMjKn_ePdeSjNEiJTy8y5SNS6TacD8cEs626gOTmufKJHLLeSOyA6ZUUFLuR-rscurSWUwkRh2qS5LTOljtOW7qKrbdXsufY6GB2iJB44OLGP0R16zkHdUymnggteqQlngt7hNbq-hchT_ycy93kENJrGcl66k7jkTbHShpvEvXvkQ_IA/d444GkUsxp_6nVt6lGGj1mCSCz8iaSzYCTbs8A0lSE4', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('wesley.melo@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Will Leivenberg', role = 'Senior Director', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/hXp7FuUTPX_trJfJfx7h3g/6wJZp-7gE57JpJyaAvGt_tsEUSYdOmlv0cxE5qFZ52st9DgmCdJljDnkwpQCahJ9mVEG0DWXipuvilCkaPRzNXNEphtHPbzY5ub-NcVhrojiKwOweYjNSDcdMFfP_4_5q_kHkrygZSy0IGXXh1lvhQomNHl1yFyHl7Mj_RzQ01euYz_5nthKbf5dlX3uNTX-rsDLaUOvYSfgYEYFlckfUg/CcHA8XSseQQJCo1XWUakGgCt726la2_kUiL07z3ecwI', birthday = '01/01', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('will.leivenberg@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Yeji Seoung', role = 'Mid-Level', discipline = 'DART', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/vqM5BZc-dr5ouNILtl2jEg/q0CwRFvFypgWrdm04LzsrTtI8tArMX46-FC1tlR_pjApBy55UQ-T9T2e51bBDLb-ZofwAaJmAdmN8-gyBjN-DY2TTMSlGqr05zeNFujWjTf9zBIYxELyT-d8jOAUFcnhbfrgtplBXQxsNL8ZuWMizqSQ6cvA802wKUU2Z-vPAQmGJcZDpQJJQY8Kyof04-83ncfAZ0TAmyXMU5lF3P_QXA/9qs2T87jXOb0JrO9lR3yNzPmNbYX-ZacJCzsgGwCTX4', birthday = '02/28', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('yeji.seoung@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Yenteen Hu', role = 'Senior', discipline = 'Strategy', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/Bm0R4NT8FbkOY8p7d5nxGw/90bzYezYgw8nvzEI4N1E1hP81HB2VNe0Roj8-Y_YxVE34wF7ut5BmkgnzJR1vahPeia3ezcgorldvcYrNnNxIlQNpiAoDvKByOx_ZSYxFh6afpKopwUbHFNn15KeMhPDuSGANXL9373YRBI0j3LYVI2NZWT0E_H0liLKHt5LSd9zHcaNeHzuYQ0x2z03EUaR/AeVnpJYn0DE12ck3djapJYixInd1OxkXYFqr9Nhowko', birthday = '09/14', start_date = '2023-06-05'::DATE, base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('yenteen.hu@codeandtheory.com'));

UPDATE public.profiles
SET full_name = 'Ziga Borsic', role = 'Mid-Level', discipline = 'Product Management', avatar_url = 'https://v5.airtableusercontent.com/v3/u/47/47/1763899200000/Emc1sSUf7Ue48g1vMQzZsQ/iM6mJE98-U0vXqq2DfgKEjST8uJkowNxIwly0PjUYERXyvvIHbvh1xcxVOJO-luceuYm7YtLzp9y9H7ywithkEIHGexxfFbFc2ksLTgTKMMDMWQXthggIJw7sC-j1vcTt93T9xpCBhsUfbf1XzcmlFoGqBHfA-KNRgOVCKWwfLWBizo-O1300ooMV2LaREs3tabAk5MaIaoHFPY-0PGicQ/Dy3Q15GVHUmIymq4V3Fx6rapkJpDhOWNUh6yOwVoWSw', base_role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE LOWER(TRIM(email)) = LOWER(TRIM('ziga.borsic@codeandtheory.com'));

COMMIT;

-- Summary: Count updated profiles
SELECT COUNT(*) as updated_profiles FROM public.profiles WHERE updated_at > NOW() - INTERVAL '1 minute';

-- Users in CSV (these should exist in auth.users):
-- If any are missing, create them in auth.users first, then re-run this script
-- Adam Kauder (adam.kauder@codeandtheory.com) - Group Director - Strategy
-- Adam Rosenberg (adam.rosenberg@codeandtheory.com) - Director - Product Management
-- Aline Bordoni (aline.bordoni@codeandtheory.com) - Senior - Product Management
-- Anna Kim (anna.kim@codeandtheory.com) - Senior - DART
-- Anne Sachs (anne.sachs@codeandtheory.com) - Senior Director - Content
-- Ari Beauregard (ariane.beauregard@codeandtheory.com) - Senior - Strategy
-- Arjun Kalyanpur (arjun.kalyanpur@codeandtheory.com) - Group Director - Strategy
-- Arthur Alves Martinho (arthur.alvesmartinho@codeandtheory.com) - Mid-Level - Product Management
-- Ashley Deley (ashley.deley@codeandtheory.com) - Associate Director - DART
-- Benaelle Benoit (benaelle.benoit@codeandtheory.com) - Junior - Strategy
-- Caleigh Aviv (caleigh.aviv@codeandtheory.com) - Senior - Content
-- Caroline Bush (caroline.bush@codeandtheory.com) - N/A - N/A
-- Challet Jeong (challet.jeong@codeandtheory.com) - Mid-Level - Product Management
-- Christine Clark (christine.clark@codeandtheory.com) - N/A - N/A
-- Danielle Diehl (danielle.diehl@codeandtheory.com) - Mid-Level - Product Management
-- Dante Clements (dante.clements@codeandtheory.com) - Director - Product Management
-- Deedy Chang (deedy.chang@codeandtheory.com) - Mid-Level - Strategy
-- Deva Sharma (deva.sharma@codeandtheory.com) - Junior - Product Management
-- Erin Henry (erin.henry@codeandtheory.com) - Director - DART
-- Gaurang Agarwal (gaurang.agarwal@codeandtheory.com) - Mid-Level - Product Management
-- Grace Zec (grace.zec@codeandtheory.com) - Associate Director - DART
-- Jess Volodarsky (jessica.volodarsky@codeandtheory.com) - Director - Strategy
-- Jnanesh Nayak (jnanesh.nayak@codeandtheory.com) - Senior - Product Management
-- John Beadle (john.beadle@codeandtheory.com) - Senior Director - Product Management
-- Jon Novick (jonathan.novick@codeandtheory.com) - Senior - Content
-- Jonny Hawton (jonny.hawton@codeandtheory.com) - Group Director - Strategy
-- Jordan Disick (jordan.disick@codeandtheory.com) - Senior - DART
-- Josh Currie (josh.currie@codeandtheory.com) - N/A - N/A
-- Juan Luciano (juan.luciano@codeandtheory.com) - Director - Strategy
-- Julian Alexander (julian.alexander@codeandtheory.com) - Director - Strategy
-- Kaki Joiner (katherine.joiner@codeandtheory.com) - Junior - Strategy
-- Karen Campos (karen.campos@codeandtheory.com) - Associate Director - Product Management
-- Karen Piper (karen.piper@codeandtheory.com) - Co-Head - Strategy
-- Karina Pino (karina.pino@codeandtheory.com) - Associate Director - DART
-- Laura Beckford (laura.beckford@codeandtheory.com) - Associate Director - Product Management
-- Laura Casinelli (laura.casinelli@codeandtheory.com) - Director - Strategy
-- Leann Down (leann.down@codeandtheory.com) - Associate Director - DART
-- Liv Ranieri (liv.ranieri@codeandtheory.com) - Senior - Product Management
-- Lucy Ye (lucy.ye@codeandtheory.com) - Director - DART
-- Luis Soto (luis.soto@codeandtheory.com) - Mid-Level - Product Management
-- Marcos Alonso (marcos.alonso@codeandtheory.com) - Associate Director - Strategy
-- Mark Silver (mark.silver@codeandtheory.com) - Senior Director - Strategy
-- Marti Rosenberger (marti.rosenberger@codeandtheory.com) - Associate Director - Strategy
-- Matt Stephens (matt.stephens@codeandtheory.com) - Director - DART
-- Millie Tunnell (millie.tunnell@codeandtheory.com) - Associate Director - Strategy
-- Molly McGlew (molly.mcglew@codeandtheory.com) - Associate Director - Strategy
-- Nicole Recchia (nicole.recchia@codeandtheory.com) - Director - Product Management
-- Pat McQueen (pat.mcqueen@codeandtheory.com) - Co-Head - Strategy
-- Prarthana Reddy (prarthana.reddy@codeandtheory.com) - Mid-Level - DART
-- Rebecca Smith (rebecca.smith@codeandtheory.com) - Senior Director - Strategy
-- Rishabh Mishra (rishabh.mishra@codeandtheory.com) - Senior - DART
-- Robyn Matza (robyn.matza@codeandtheory.com) - Senior Director - Product Management
-- Scott Lindenbaum (scott.lindenbaum@codeandtheory.com) - Senior Director - Strategy
-- Seven Harkey (seven.harkey@codeandtheory.com) - Senior Director - Content
-- Shanna Fischzang (shanna.fischzang@codeandtheory.com) - Mid-Level - Product Management
-- Shivani Rawat (shivani.rawat@codeandtheory.com) - Junior - Product Management
-- Shreiya Chowdhary (shreiya.chowdhary@codeandtheory.com) - Senior - Product Management
-- Sophia Diaz (sophia.diaz@codeandtheory.com) - Senior - Strategy
-- Sreeram Venkataramani (sreeram.venkataramani@codeandtheory.com) - Senior - Product Management
-- Susannah Green (susannah.green@codeandtheory.com) - Mid-Level - Content
-- Tomás Orihuela (tomas.orihuela@codeandtheory.com) - Senior - Product Management
-- Utpreksha Singh (utpreksha.singh@codeandtheory.com) - Mid-Level - Product Management
-- Wesley Melo (wesley.melo@codeandtheory.com) - Mid-Level - Product Management
-- Will Leivenberg (will.leivenberg@codeandtheory.com) - Senior Director - N/A
-- Yeji Seoung (yeji.seoung@codeandtheory.com) - Mid-Level - DART
-- Yenteen Hu (yenteen.hu@codeandtheory.com) - Senior - Strategy
-- Ziga Borsic (ziga.borsic@codeandtheory.com) - Mid-Level - Product Management
