# Spotify Player Package - Overview

This package contains a complete, standalone Spotify-style playlist player component that can be easily integrated into any React project.

## Package Structure

```
spotify-player-package/
├── src/
│   ├── components/
│   │   └── SpotifyPlayer.tsx    # Main player component
│   ├── styles/
│   │   └── playlist-card.css    # All styles and animations
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   ├── utils/
│   │   └── spotify.ts           # Utility functions for Spotify data
│   └── index.ts                 # Main export file
├── package.json                 # Package configuration
├── tsconfig.json                # TypeScript configuration
├── README.md                    # Full documentation
├── INSTALLATION.md              # Installation guide
├── example.tsx                  # Usage examples
└── .gitignore                   # Git ignore file
```

## What's Included

✅ **Complete Player Component** - All functionality, animations, and layout
✅ **All Styles** - CSS with animations, vinyl spin, equalizer bars
✅ **TypeScript Types** - Full type safety
✅ **Utility Functions** - Helpers for fetching and formatting data
✅ **Documentation** - Comprehensive README and examples
✅ **No Dependencies on Original Project** - Fully standalone

## Key Features Preserved

- ✨ Animated vinyl record with spinning effect
- 🎨 Beautiful gradient background with animated waves
- 🎵 Animated equalizer bars (40 bars)
- 🎮 Full playback controls (play/pause, skip forward/back)
- 🎯 Spotify link button
- 📱 Fully responsive design
- ♿ Accessibility features (keyboard nav, screen readers)
- 🎭 Respects reduced motion preferences
- 🎨 Musical note particles animation
- 📊 Track count and duration display
- 👤 Curator photo in vinyl center

## What's Different from Original

The only difference is that the **playlist data source is now configurable via props**. Instead of fetching from Airtable/Spotify API internally, you pass the playlist data as props, making it work with any data source.

## Quick Integration

1. Copy the `spotify-player-package` folder to your project
2. Install peer dependencies: `react`, `react-dom`, `framer-motion`, `lucide-react`
3. Import and use:

```tsx
import { SpotifyPlayer } from './spotify-player-package/src';
import './spotify-player-package/src/styles/playlist-card.css';

<SpotifyPlayer playlist={yourPlaylistData} />
```

## Data Format

The component expects playlist data in this format:

```typescript
{
  title: string;
  curator: string;
  curatorPhotoUrl?: string;
  coverUrl?: string;
  description?: string;
  tracks: Array<{
    name: string;
    artist: string;
    duration?: string;
    album?: string;
    spotifyUrl?: string;
  }>;
  spotifyUrl?: string;
  // ... optional fields
}
```

You can transform your data from any source (Airtable, API, Spotify, etc.) into this format.

## Next Steps

1. Read `README.md` for full documentation
2. Check `INSTALLATION.md` for setup instructions
3. See `example.tsx` for usage examples
4. Integrate with your data source

