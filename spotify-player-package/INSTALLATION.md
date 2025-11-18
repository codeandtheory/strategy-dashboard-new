# Installation Guide

## Quick Setup

1. **Copy the package folder** to your project or upload it to Cursor

2. **Install peer dependencies** in your project:

```bash
npm install react react-dom framer-motion lucide-react
# or
yarn add react react-dom framer-motion lucide-react
# or
pnpm add react react-dom framer-motion lucide-react
```

3. **Import and use the component**:

```tsx
import { SpotifyPlayer } from './spotify-player-package/src';
import './spotify-player-package/src/styles/playlist-card.css';

function App() {
  const playlist = {
    title: "My Playlist",
    curator: "John Doe",
    tracks: [
      { name: "Song 1", artist: "Artist 1" },
      { name: "Song 2", artist: "Artist 2" },
    ],
    spotifyUrl: "https://open.spotify.com/playlist/..."
  };

  return <SpotifyPlayer playlist={playlist} />;
}
```

## Integration Steps

### Step 1: Add to Your Project

Copy the entire `spotify-player-package` folder into your project, or upload it to Cursor.

### Step 2: Configure Tailwind CSS (if using Tailwind)

The component uses Tailwind CSS classes. Make sure your `tailwind.config.js` includes:

```js
module.exports = {
  content: [
    './spotify-player-package/**/*.{js,ts,jsx,tsx}',
    // ... your other paths
  ],
  // ... rest of config
}
```

### Step 3: Import CSS

You need to import the CSS file. Add this to your main app file or layout:

```tsx
import './spotify-player-package/src/styles/playlist-card.css';
```

Or if using Next.js, add it to your `globals.css` or `_app.tsx`:

```tsx
import '../spotify-player-package/src/styles/playlist-card.css';
```

### Step 4: Use the Component

See the README.md for detailed usage examples.

## Customizing the Data Source

The component accepts playlist data as props. You can fetch this data from any source:

1. **From your API**:
```tsx
const response = await fetch('/api/playlist');
const data = await response.json();
// Transform to PlaylistData format
```

2. **From Airtable** (like the original):
```tsx
// Your Airtable fetch logic
const playlist = {
  title: airtableRecord.fields.Title,
  curator: airtableRecord.fields.Curator,
  // ... etc
};
```

3. **From Spotify API**:
Use the `fetchSpotifyPlaylist` utility function (requires your backend API endpoint).

## Troubleshooting

### Styles not working?
- Make sure you've imported the CSS file
- Check that Tailwind CSS is configured if using Tailwind classes
- The component has inline styles for the gradient background, so it should work even without Tailwind

### Animations not working?
- Check that `framer-motion` is installed
- Verify React version compatibility (18+)

### TypeScript errors?
- Make sure TypeScript is configured
- Check that all peer dependencies are installed

