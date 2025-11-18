# Spotify Player Component

A beautiful, fully-featured Spotify-style playlist player component with animations, vinyl record effect, equalizer visualization, and playback controls. Perfect for displaying playlists in your React applications.

## Features

- 🎵 **Animated Vinyl Record** - Spinning vinyl with customizable cover and curator photo
- 🎨 **Beautiful Animations** - Smooth transitions, pulsing effects, and animated equalizer bars
- 🎮 **Playback Controls** - Play/pause, skip forward/back, and Spotify link button
- ♿ **Accessible** - Full keyboard navigation and screen reader support
- 🎨 **Customizable** - Accepts playlist data as props, fully configurable
- 📱 **Responsive** - Works beautifully on mobile, tablet, and desktop
- 🌙 **Dark Theme** - Beautiful emerald/green gradient design
- ⚡ **Performance** - Optimized animations with reduced motion support

## Installation

```bash
npm install spotify-player-component
# or
yarn add spotify-player-component
# or
pnpm add spotify-player-component
```

### Peer Dependencies

Make sure you have these installed:

```bash
npm install react react-dom framer-motion lucide-react
```

## Quick Start

```tsx
import { SpotifyPlayer } from 'spotify-player-component';
import 'spotify-player-component/dist/styles.css'; // If using a bundler that extracts CSS

function App() {
  const playlist = {
    title: "My Awesome Playlist",
    curator: "John Doe",
    curatorPhotoUrl: "https://example.com/avatar.jpg",
    coverUrl: "https://example.com/cover.jpg",
    description: "A great playlist for coding",
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

## Props

### `SpotifyPlayerProps`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `playlist` | `PlaylistData` | Yes | The playlist data to display |
| `isPlaying` | `boolean` | No | External control of play/pause state |
| `onPlayPause` | `() => void` | No | Callback when play/pause is clicked |
| `onSkipBack` | `() => void` | No | Callback when skip back is clicked |
| `onSkipForward` | `() => void` | No | Callback when skip forward is clicked |
| `onSpotifyLink` | `() => void` | No | Callback when Spotify link is clicked (defaults to opening URL) |
| `className` | `string` | No | Additional CSS classes |

### `PlaylistData`

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | `string` | Yes | Playlist title |
| `curator` | `string` | Yes | Curator/creator name |
| `curatorPhotoUrl` | `string` | No | URL for curator avatar (shown in vinyl center) |
| `coverUrl` | `string` | No | Playlist cover image URL |
| `description` | `string` | No | Playlist description |
| `tracks` | `Track[]` | Yes | Array of track objects |
| `spotifyUrl` | `string` | No | Spotify playlist URL |
| `nowPlaying` | `string` | No | Custom "Now Playing" text (auto-generated if not provided) |
| `artistsList` | `string` | No | Custom artists list (auto-generated if not provided) |
| `totalDuration` | `string` | No | Total playlist duration (e.g., "73:48") |
| `trackCount` | `number` | No | Total number of tracks (auto-calculated from tracks array if not provided) |

### `Track`

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | Yes | Track name |
| `artist` | `string` | Yes | Artist name(s) |
| `duration` | `string` | No | Track duration (e.g., "3:45") |
| `album` | `string` | No | Album name |
| `spotifyUrl` | `string` | No | Spotify track URL |

## Advanced Usage

### With External State Management

```tsx
import { useState } from 'react';
import { SpotifyPlayer } from 'spotify-player-component';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const playlist = {
    title: "My Playlist",
    curator: "John Doe",
    tracks: [
      { name: "Track 1", artist: "Artist 1" },
      { name: "Track 2", artist: "Artist 2" },
    ],
    spotifyUrl: "https://open.spotify.com/playlist/..."
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Your audio playback logic here
  };

  const handleSkipBack = () => {
    setCurrentTrackIndex(prev => Math.max(0, prev - 1));
    // Your skip logic here
  };

  const handleSkipForward = () => {
    setCurrentTrackIndex(prev => Math.min(playlist.tracks.length - 1, prev + 1));
    // Your skip logic here
  };

  return (
    <SpotifyPlayer
      playlist={playlist}
      isPlaying={isPlaying}
      onPlayPause={handlePlayPause}
      onSkipBack={handleSkipBack}
      onSkipForward={handleSkipForward}
    />
  );
}
```

### Fetching Playlist Data from API

```tsx
import { useEffect, useState } from 'react';
import { SpotifyPlayer, fetchSpotifyPlaylist, PlaylistData } from 'spotify-player-component';

function App() {
  const [playlist, setPlaylist] = useState<PlaylistData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlaylist() {
      // Replace with your API endpoint
      const data = await fetchSpotifyPlaylist(
        '/api/spotify-playlist',
        'https://open.spotify.com/playlist/...'
      );
      setPlaylist(data);
      setLoading(false);
    }
    loadPlaylist();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!playlist) return <div>Error loading playlist</div>;

  return <SpotifyPlayer playlist={playlist} />;
}
```

## Styling

The component uses Tailwind CSS classes and CSS custom properties. Make sure your project has Tailwind CSS configured, or the component will use inline styles for the gradient background.

### Required CSS Variables

The component expects these CSS variables to be available (they're included in the component's CSS):

- `--chart-2`: Used for accent colors (defaults to emerald green)
- `--cover`: Cover image size (defaults to 180px)
- `--vinyl-gap`: Gap between cover and vinyl (defaults to 24px)

### Custom Styling

You can override styles by passing a `className` prop or by targeting the `.playlist-card` class in your CSS.

## Integration with Your Data Source

The component is designed to work with any data source. You just need to transform your playlist data into the `PlaylistData` format.

### Example: Transforming from Your API

```tsx
function transformToPlaylistData(apiResponse: any): PlaylistData {
  return {
    title: apiResponse.name,
    curator: apiResponse.curator || apiResponse.owner?.name || 'Unknown',
    curatorPhotoUrl: apiResponse.curatorPhoto || null,
    coverUrl: apiResponse.image || apiResponse.cover || null,
    description: apiResponse.description || null,
    spotifyUrl: apiResponse.spotifyLink || apiResponse.url || null,
    tracks: (apiResponse.tracks || []).map((track: any) => ({
      name: track.name || track.title,
      artist: track.artist || track.artists?.join(', ') || 'Unknown',
      duration: track.duration || null,
      album: track.album || null,
      spotifyUrl: track.spotifyUrl || track.url || null
    })),
    trackCount: apiResponse.trackCount || apiResponse.tracks?.length || 0,
    totalDuration: apiResponse.totalDuration || null
  };
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

- Full keyboard navigation support
- ARIA labels and roles
- Screen reader friendly
- Respects `prefers-reduced-motion` for animations

## License

MIT

## Contributing

This is a standalone package extracted from a larger project. Feel free to fork and modify for your needs!

