export { SpotifyPlayer } from './components/SpotifyPlayer';
export type { SpotifyPlayerProps, PlaylistData, Track } from './types';
export { fetchSpotifyPlaylist, formatDuration, createMockPlaylist } from './utils/spotify';

// Note: Users need to import the CSS separately:
// import 'spotify-player-component/src/styles/playlist-card.css';
// Or copy the CSS file to their project

