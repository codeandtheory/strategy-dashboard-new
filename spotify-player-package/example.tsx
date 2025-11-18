/**
 * Example usage of the Spotify Player Component
 * 
 * This file demonstrates how to use the component in your application.
 * Copy this code to your project and customize as needed.
 */

import React from 'react';
import { SpotifyPlayer, PlaylistData } from './src';
import './src/styles/playlist-card.css';

// Example 1: Basic usage with static data
export function BasicExample() {
  const playlist: PlaylistData = {
    title: "Focus Flow",
    curator: "Karen Piper",
    curatorPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    coverUrl: "https://i.scdn.co/image/ab67616d00001e0255ca6371b6e3b4e11a2c4dfe",
    description: "Perfect for deep work and creative sessions",
    spotifyUrl: "https://open.spotify.com/playlist/example",
    tracks: [
      { name: "Weightless", artist: "Marconi Union", duration: "8:10", album: "Weightless" },
      { name: "Aqueous Transmission", artist: "Incubus", duration: "7:49", album: "Morning View" },
      { name: "Clair de Lune", artist: "Claude Debussy", duration: "5:25", album: "Suite Bergamasque" },
      { name: "Gymnopédie No. 1", artist: "Erik Satie", duration: "3:32", album: "Gymnopédies" },
    ],
    trackCount: 4,
    totalDuration: "24:56"
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <SpotifyPlayer playlist={playlist} />
    </div>
  );
}

// Example 2: With external state management
export function StatefulExample() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTrack, setCurrentTrack] = React.useState(0);

  const playlist: PlaylistData = {
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
    // Add your audio playback logic here
  };

  const handleSkipBack = () => {
    setCurrentTrack(prev => Math.max(0, prev - 1));
  };

  const handleSkipForward = () => {
    setCurrentTrack(prev => Math.min(playlist.tracks.length - 1, prev + 1));
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

// Example 3: Fetching from API
export function ApiExample() {
  const [playlist, setPlaylist] = React.useState<PlaylistData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadPlaylist() {
      // Replace with your actual API endpoint
      const response = await fetch('/api/playlist');
      const data = await response.json();
      
      // Transform your API response to PlaylistData format
      setPlaylist({
        title: data.name,
        curator: data.curator,
        coverUrl: data.image,
        description: data.description,
        tracks: data.tracks.map((t: any) => ({
          name: t.name,
          artist: t.artist,
          duration: t.duration
        })),
        spotifyUrl: data.spotifyUrl
      });
      setLoading(false);
    }
    loadPlaylist();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!playlist) return <div>Error loading playlist</div>;

  return <SpotifyPlayer playlist={playlist} />;
}

