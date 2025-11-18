export interface Track {
  name: string;
  artist: string;
  duration?: string;
  album?: string;
  spotifyUrl?: string;
}

export interface PlaylistData {
  title: string;
  curator: string;
  curatorPhotoUrl?: string;
  coverUrl?: string;
  description?: string;
  tracks: Track[];
  spotifyUrl?: string;
  nowPlaying?: string;
  artistsList?: string;
  totalDuration?: string;
  trackCount?: number;
}

export interface SpotifyPlayerProps {
  playlist: PlaylistData;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onSkipBack?: () => void;
  onSkipForward?: () => void;
  onSpotifyLink?: () => void;
  className?: string;
}

