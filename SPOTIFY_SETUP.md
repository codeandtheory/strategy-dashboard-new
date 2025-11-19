# Spotify API Setup

To use the playlist management feature, you need to set up Spotify API credentials.

## Steps

1. **Create a Spotify App**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Click "Create an app"
   - Fill in app details (name, description, etc.)
   - Accept the terms

2. **Get Your Credentials**
   - In your app dashboard, you'll see:
     - **Client ID**
     - **Client Secret** (click "View client secret" to reveal it)

3. **Add Environment Variables**
   - Create a `.env.local` file in the root of your project (if it doesn't exist)
   - Add the following:
   ```
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   ```

4. **Restart Your Development Server**
   - Stop your Next.js dev server (Ctrl+C)
   - Run `npm run dev` again to load the new environment variables

## How It Works

The playlist admin form uses the Spotify Web API with Client Credentials flow to:
- Fetch playlist metadata (title, cover, description)
- Get all tracks and calculate total duration
- Extract unique artists
- Get playlist owner information

## Notes

- The API uses Client Credentials flow, which doesn't require user authentication
- This allows fetching public playlist data only
- Curator photos will use the Spotify playlist owner's photo, or you can manually set them
- Future: Curator photos can be looked up from your user profile system

