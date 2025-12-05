# Profile Creation Setup

This document explains how user profiles are automatically created when users authenticate with Google OAuth.

## How It Works

When a user logs in with Google OAuth, there are **two layers of protection** to ensure they get a profile:

### 1. Database Trigger (Primary Method)
- **Location**: Database trigger `on_auth_user_created` on `auth.users` table
- **Function**: `handle_new_user()`
- **When it runs**: Automatically when a new user is inserted into `auth.users`
- **What it does**: Creates a profile in the `profiles` table with:
  - User ID (from auth.users)
  - Email
  - Full name (from Google OAuth metadata)
  - Avatar URL (from Google OAuth metadata)
  - Default `base_role`: `'user'`
  - Timestamps

### 2. Client-Side Safety Net (Backup Method)
- **Location**: `contexts/auth-context.tsx`
- **API Endpoint**: `/api/profiles/ensure`
- **When it runs**: 
  - When a user signs in (`SIGNED_IN` event)
  - On initial session load
- **What it does**: Checks if profile exists, creates one if missing

## Setup Instructions

### Step 1: Run the Database Schema

Run the SQL in `supabase/profiles-schema.sql` in your Supabase SQL Editor. This will:
- Create the `profiles` table
- Set up RLS policies
- Create the `handle_new_user()` function
- Create the trigger that automatically creates profiles

### Step 2: Verify the Trigger

You can verify the trigger is working by:

1. **Check if trigger exists:**
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

2. **Check the function:**
```sql
SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
```

3. **Test with a new user:**
   - Have someone log in with Google OAuth
   - Check if a profile was automatically created:
```sql
SELECT * FROM profiles WHERE id = '<user_id>';
```

### Step 3: If Trigger Fails

If the trigger fails or doesn't run, the client-side safety net will automatically create the profile. You'll see a log message in development mode:

```
[Auth] Profile created via safety net: user@example.com
```

## Troubleshooting

### Problem: User authenticated but no profile exists

**Solution 1**: Check if the trigger exists and is enabled
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

**Solution 2**: Manually run the trigger fix
```sql
-- Run the SQL from supabase/fix-profile-trigger.sql
```

**Solution 3**: The client-side safety net should automatically create the profile. Check browser console for errors.

### Problem: Trigger fails silently

The trigger has error handling that logs warnings but doesn't fail user creation. Check Supabase logs for:
```
WARNING: Error creating profile for user <id>: <error message>
```

### Problem: RLS policy blocking profile creation

Make sure the RLS policy "Users can insert own profile" exists:
```sql
SELECT * FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile';
```

If it doesn't exist, run:
```sql
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

## Files Involved

- `supabase/profiles-schema.sql` - Main schema with trigger
- `supabase/fix-profile-trigger.sql` - Improved trigger with error handling
- `app/api/profiles/ensure/route.ts` - API endpoint for safety net
- `contexts/auth-context.tsx` - Client-side profile check

## Default Profile Values

When a profile is created (via trigger or API), it gets:
- `base_role`: `'user'` (default)
- `special_access`: `[]` (empty array)
- `email`: From Google OAuth
- `full_name`: From Google OAuth metadata
- `avatar_url`: From Google OAuth metadata
- `birthday`: `NULL` (user can set later)
- `discipline`: `NULL` (user can set later)
- `role`: `NULL` (user can set later)

