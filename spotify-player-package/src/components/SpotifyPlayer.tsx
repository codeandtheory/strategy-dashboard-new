'use client';

import React, { useState, useMemo } from 'react';
import { Music, Play, ExternalLink, Volume2, Pause, SkipBack, SkipForward } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { SpotifyPlayerProps, Track } from '../types';
import '../styles/playlist-card.css';

export function SpotifyPlayer({
  playlist,
  isPlaying: externalIsPlaying,
  onPlayPause,
  onSkipBack,
  onSkipForward,
  onSpotifyLink,
  className = ''
}: SpotifyPlayerProps) {
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Use external isPlaying if provided, otherwise use internal state
  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying;

  // Fallback cover image
  const albumArtwork = playlist.coverUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop";
  
  // Fallback to curator photo if no album artwork
  const submitterPhoto = playlist.curatorPhotoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face";

  const handlePlay = () => {
    if (onPlayPause) {
      onPlayPause();
    } else {
      setInternalIsPlaying(!internalIsPlaying);
    }
  };

  const handleSkipBack = () => {
    if (onSkipBack) {
      onSkipBack();
    } else {
      console.log('Skip back...');
    }
  };

  const handleSkipForward = () => {
    if (onSkipForward) {
      onSkipForward();
    } else {
      console.log('Skip forward...');
    }
  };

  const handleSpotifyLink = () => {
    if (onSpotifyLink) {
      onSpotifyLink();
    } else if (playlist.spotifyUrl) {
      window.open(playlist.spotifyUrl, '_blank');
    }
  };

  // Enhanced sound wave bars data with more variety - increased count for full width
  const soundBars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    baseHeight: Math.random() * 70 + 15,
    delay: i * 0.02,
    speed: 0.5 + Math.random() * 1.0
  }));

  // Derive now playing text
  const nowPlayingText = useMemo(() => {
    if (playlist.nowPlaying) return playlist.nowPlaying;
    const firstTrack = playlist.tracks?.[0];
    if (firstTrack) {
      return `Now Playing: "${firstTrack.name}" – ${firstTrack.artist}`;
    }
    return `Now Playing: "${playlist.title}"`;
  }, [playlist]);

  // Derive artists list
  const artistsList = useMemo(() => {
    if (playlist.artistsList) return playlist.artistsList;
    if (playlist.tracks && playlist.tracks.length > 0) {
      const artists = Array.from(new Set(
        playlist.tracks
          .map((t: Track) => t.artist)
          .filter(Boolean)
      ));
      return artists.join(', ');
    }
    return playlist.description || '';
  }, [playlist]);

  // Derive track count and duration
  const trackInfo = useMemo(() => {
    const count = playlist.trackCount || playlist.tracks?.length || 0;
    const duration = playlist.totalDuration || '';
    if (count && duration) {
      return `${count} tracks | ${duration}`;
    } else if (count) {
      return `${count} track${count !== 1 ? 's' : ''}`;
    }
    return '';
  }, [playlist]);

  return (
    <section 
      aria-labelledby="playlist-heading" 
      className={`playlist-card w-full h-full min-h-[520px] bg-card dark border border-border rounded-3xl p-5 md:p-6 text-card-foreground shadow-card relative ${className}`}
      style={{
        background: 'linear-gradient(135deg, #052e16 0%, #064e3b 50%, #065f46 100%)',
        ['--cover' as any]: '180px',
        ['--vinyl-gap' as any]: '24px'
      }}
    >
      {/* Skip link for keyboard users */}
      <a href="#playlist-controls" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-emerald-900 focus:text-white focus:px-3 focus:py-2 focus:rounded">
        Skip to playback controls
      </a>
      
      {/* Animated Background Waves */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        animate={{ 
          background: [
            "radial-gradient(circle at 30% 20%, hsl(var(--chart-2)) 0%, transparent 50%)",
            "radial-gradient(circle at 70% 80%, hsl(var(--chart-2) / 0.8) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 60%, hsl(var(--chart-2) / 0.6) 0%, transparent 50%)",
            "radial-gradient(circle at 30% 20%, hsl(var(--chart-2)) 0%, transparent 50%)"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Musical Note Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-chart-2/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${10 + Math.random() * 6}px`
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut"
          }}
        >
          ♪
        </motion.div>
      ))}

      {/* Media Row: grid with cover and vinyl */}
      <div className="media relative z-10 mb-2 grid grid-cols-[auto_1fr] items-start gap-5 md:gap-6">
        {/* Cover */}
        <img
          src={albumArtwork || submitterPhoto}
          alt={playlist.title || "Playlist cover"}
          className="relative z-10 object-cover w-[var(--cover)] h-[var(--cover)] rounded-none ring-2 ring-emerald-300/30"
        />
        {/* Vinyl */}
        <div className="relative">
          <div 
            className="vinyl absolute top-0 right-0 rounded-full bg-black/90 ring-1 ring-black/40 -translate-x-3 md:-translate-x-4 z-0 pointer-events-none"
            style={{ width: 'calc(var(--cover) - var(--vinyl-gap))', height: 'calc(var(--cover) - var(--vinyl-gap))' }}
            aria-hidden="true"
          >
            {/* center label avatar */}
            {submitterPhoto && (
              <img
                src={submitterPhoto}
                alt=""
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-12 md:h-12 rounded-full ring-2 ring-emerald-400"
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </div>

      {/* Content below media row */}
      <motion.header
        className="content text-center mt-5 md:mt-6 mb-2 relative z-20 space-y-1.5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <motion.div 
          role="heading"
          aria-level={4}
          id="playlist-heading"
          className="text-2xl md:text-[28px] leading-tight font-semibold text-emerald-50"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {playlist.title || 'Playlist'}
        </motion.div>
        <p className="text-[12px] md:text-sm text-emerald-200/80">by {playlist.curator || 'Unknown'}</p>
      </motion.header>

      {/* Now Playing */}
      <motion.div 
        className="text-center mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <motion.p 
          className="text-sm md:text-[15px] text-emerald-100/85"
          aria-live="polite"
          aria-atomic="true"
          animate={{ 
            opacity: shouldReduceMotion ? 1 : (isPlaying ? [0.7, 1, 0.7] : 1)
          }}
          transition={{ duration: 2, repeat: shouldReduceMotion ? 0 : (isPlaying ? Infinity : 0) }}
        >
          {nowPlayingText}
        </motion.p>
      </motion.div>

      {/* Controls */}
      <motion.div 
        id="playlist-controls"
        className="flex items-center justify-center gap-4 md:gap-5 mb-2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {/* Skip Back Button */}
        <motion.button 
          type="button"
          aria-label="Previous track"
          onClick={handleSkipBack}
          className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-emerald-800/60 backdrop-blur ring-1 ring-emerald-500/20 text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-400 hover:bg-emerald-700/60 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <SkipBack className="w-5 h-5" aria-hidden="true" />
        </motion.button>

        {/* Play/Pause Button - larger and central */}
        <motion.button 
          type="button"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          onClick={handlePlay}
          className={`w-14 h-14 md:w-15 md:h-15 rounded-full ${isPlaying ? 'bg-chart-2/90' : 'bg-chart-2'} text-white flex items-center justify-center relative overflow-hidden ring-1 ring-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 hover:bg-chart-2/80 transition-colors`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Pulsing background when playing */}
          {isPlaying && !shouldReduceMotion && (
            <motion.div
              className="absolute inset-0 bg-chart-2/60 rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3] 
              }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          
          <motion.div
            className="relative z-10 flex items-center justify-center"
            animate={{ rotate: shouldReduceMotion ? 0 : (isPlaying ? [0, 5, -5, 0] : 0) }}
            transition={{ duration: 0.5, repeat: shouldReduceMotion ? 0 : (isPlaying ? Infinity : 0) }}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" aria-hidden="true" />
            )}
          </motion.div>
        </motion.button>

        {/* Skip Forward Button */}
        <motion.button 
          type="button"
          aria-label="Next track"
          onClick={handleSkipForward}
          className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-emerald-800/60 backdrop-blur ring-1 ring-emerald-500/20 text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-400 hover:bg-emerald-700/60 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <SkipForward className="w-5 h-5" aria-hidden="true" />
        </motion.button>

        {/* Divider */}
        <span aria-hidden="true" className="h-8 w-px bg-emerald-500/20 mx-4 md:mx-6" />

        {/* Spotify pill */}
        <motion.button 
          type="button"
          aria-label="Open in Spotify"
          onClick={handleSpotifyLink}
          className="h-12 px-5 md:px-6 rounded-full inline-flex items-center gap-2 bg-emerald-800/70 ring-1 ring-emerald-500/20 text-white relative focus:outline-none focus:ring-2 focus:ring-emerald-400 hover:bg-emerald-700/70"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Music className="w-5 h-5" aria-hidden="true" />
          <span className="font-medium tracking-wide">Spotify</span>
          <ExternalLink className="w-4 h-4 ml-2" aria-hidden="true" />
        </motion.button>
      </motion.div>

      {/* Equalizer row */}
      <div className="mt-6 md:mt-8 flex justify-center">
        <motion.div 
          className="flex items-end gap-2 md:gap-2.5 h-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          {soundBars.map((bar) => (
            <motion.div
              key={bar.id}
              className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-chart-2/90"
              animate={{
                opacity: shouldReduceMotion ? 0.6 : (isPlaying ? [0.6, 1, 0.6] : 0.6),
                y: shouldReduceMotion ? 0 : (isPlaying ? [0, -2, 0] : 0)
              }}
              transition={{
                duration: Math.max(0.6, Math.min(1.2, bar.speed)),
                repeat: shouldReduceMotion ? 0 : (isPlaying ? Infinity : 0),
                ease: "easeInOut",
                delay: bar.delay
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Track Info */}
      {trackInfo && (
        <motion.div 
          className="text-center mb-2 font-sans mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <motion.p 
            className="text-[11px] md:text-xs text-emerald-200/70"
            animate={{ 
              textShadow: ["0 0 5px hsl(var(--chart-2) / 0.5)", "0 0 20px hsl(var(--chart-2) / 0.8)", "0 0 5px hsl(var(--chart-2) / 0.5)"]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {trackInfo}
          </motion.p>
        </motion.div>
      )}

      {/* Artists List - Centered */}
      {artistsList && (
        <motion.div 
          className="text-emerald-100/80 text-[15px] md:text-base leading-7 text-center px-4 font-normal tracking-tight max-w-2xl mx-auto mt-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <motion.p
            className="break-normal whitespace-normal line-clamp-6 md:line-clamp-7"
            animate={{ 
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {artistsList}
          </motion.p>
        </motion.div>
      )}

      {/* Floating Music Symbol */}
      <motion.div
        className="absolute bottom-3 right-3"
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 15, -15, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-8 h-8 bg-gradient-to-r from-chart-2 to-emerald-400 rounded-full flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            🎵
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

