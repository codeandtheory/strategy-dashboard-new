# Google OAuth Authentication Setup

This guide will help you set up Google OAuth authentication using Supabase.

## Prerequisites

- A Supabase project
- A Google Cloud Console project

## Step 1: Configure Google OAuth in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Choose **Web application** as the application type
6. Add authorized redirect URIs:
   - `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - For local development: `http://localhost:3000/auth/callback`
7. Copy the **Client ID** and **Client Secret**

## Step 2: Configure Google OAuth in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Navigate to **Authentication** > **Providers**
3. Find **Google** and enable it
4. Enter your Google **Client ID** and **Client Secret**
5. Click **Save**

## Step 3: Set Up Database Schema

Run the profiles schema migration to create the profiles table:

```sql
-- Run this in your Supabase SQL Editor
-- See supabase/profiles-schema.sql for the full schema
```

This will:
- Create a `profiles` table to store user roles and permissions
- Set up Row Level Security (RLS) policies
- Create a trigger to automatically create profiles when users sign up

## Step 4: Environment Variables

Make sure you have these environment variables set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 5: Test the Authentication

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. You should be redirected to the login page
4. Click "Continue with Google"
5. Complete the Google OAuth flow
6. You should be redirected back to the dashboard

## Default User Roles

When a new user signs up, they will be created with:
- `base_role`: `'user'` (default)
- `special_access`: `[]` (empty array)

To assign roles, use the User Management page in the admin panel (Admin only) or update the database directly.

## Troubleshooting

### Redirect URI Mismatch
- Make sure the redirect URI in Google Cloud Console matches exactly: `https://<your-project-ref>.supabase.co/auth/v1/callback`
- For local development, also add: `http://localhost:3000/auth/callback`

### Profile Not Created
- Check that the trigger function `handle_new_user()` was created
- Verify the trigger `on_auth_user_created` exists on `auth.users`

### Permission Errors
- Ensure RLS policies are set up correctly
- Check that the service role key has access to manage profiles

