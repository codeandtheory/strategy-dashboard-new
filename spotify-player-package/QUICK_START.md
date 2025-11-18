# Quick Start Guide

Get the Spotify player up and running in 3 steps!

## Step 1: Install Dependencies

In your project, install the required packages:

```bash
npm install react react-dom framer-motion lucide-react
```

## Step 2: Import the Component

```tsx
import { SpotifyPlayer } from './spotify-player-package/src';
import './spotify-player-package/src/styles/playlist-card.css';
```

## Step 3: Use It!

```tsx
function MyApp() {
  const playlist = {
    title: "My Awesome Playlist",
    curator: "John Doe",
    coverUrl: "https://example.com/cover.jpg",
    curatorPhotoUrl: "https://example.com/avatar.jpg",
    spotifyUrl: "https://open.spotify.com/playlist/...",
    tracks: [
      { name: "Song 1", artist: "Artist 1", duration: "3:45" },
      { name: "Song 2", artist: "Artist 2", duration: "4:12" },
    ],
    trackCount: 2,
    totalDuration: "7:57"
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <SpotifyPlayer playlist={playlist} />
    </div>
  );
}
```

That's it! 🎉

## Connecting to Your Data Source

The component accepts playlist data as props. Transform your data (from Airtable, API, database, etc.) into this format:

```typescript
{
  title: string;           // Required
  curator: string;         // Required
  tracks: Array<{          // Required
    name: string;
    artist: string;
    duration?: string;
    // ... more optional fields
  }>;
  coverUrl?: string;       // Optional
  curatorPhotoUrl?: string; // Optional
  spotifyUrl?: string;     // Optional
  // ... more optional fields
}
```

See `README.md` for the complete API documentation.

