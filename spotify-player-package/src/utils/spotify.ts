import { PlaylistData, Track } from '../types';

/**
 * Fetches playlist data from Spotify API
 * This is a utility function that can be used to fetch playlist data
 * from your backend API endpoint that calls Spotify.
 * 
 * @param apiUrl - Your backend API endpoint that fetches Spotify data
 * @param playlistUrl - The Spotify playlist URL or ID
 * @returns Promise<PlaylistData | null>
 */
export async function fetchSpotifyPlaylist(
  apiUrl: string,
  playlistUrl: string
): Promise<PlaylistData | null> {
  try {
    const response = await fetch(`${apiUrl}?url=${encodeURIComponent(playlistUrl)}`);
    
    if (!response.ok) {
      console.error('Failed to fetch playlist:', response.status);
      return null;
    }

    const data = await response.json();
    
    // Transform the API response to PlaylistData format
    return {
      title: data.name || 'Playlist',
      curator: data.curator || 'Unknown',
      curatorPhotoUrl: data.curatorPhotoUrl || null,
      coverUrl: data.image || null,
      description: data.description || null,
      tracks: (data.tracks || []).map((track: any) => ({
        name: track.name || track.title || '',
        artist: track.artist || (Array.isArray(track.artists) ? track.artists[0] : ''),
        duration: track.duration || '',
        album: track.album || '',
        spotifyUrl: track.spotifyUrl || track.url || null
      })),
      spotifyUrl: playlistUrl,
      trackCount: data.tracks?.length || 0,
      totalDuration: data.totalDuration || null
    };
  } catch (error) {
    console.error('Error fetching Spotify playlist:', error);
    return null;
  }
}

/**
 * Formats duration in milliseconds to MM:SS format
 */
export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Creates a mock playlist for testing/demo purposes
 */
export function createMockPlaylist(): PlaylistData {
  return {
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
      { name: "Mad World", artist: "Gary Jules", duration: "3:07", album: "Trading Snakeoil for Wolftickets" },
      { name: "The Blue Notebooks", artist: "Max Richter", duration: "3:34", album: "The Blue Notebooks" },
      { name: "On Earth as It Is in Heaven", artist: "Ólafur Arnalds", duration: "5:07", album: "...And They Have Escaped the Weight of Darkness" },
      { name: "Spaces", artist: "Nils Frahm", duration: "9:39", album: "Spaces" }
    ],
    trackCount: 8,
    totalDuration: "46:23"
  };
}

