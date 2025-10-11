// src/components/playlists/PlaylistCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { usePlayer } from '../../hooks/usePlayer';
import { PlayIcon, PauseIcon } from '@heroicons/react/outline';
import { motion } from 'framer-motion';

const PlaylistCard = ({ playlist }) => {
  const { 
    currentTrack, 
    isPlaying, 
    playQueue
  } = usePlayer();

  // Check if any track from this playlist is currently playing
  const isPlaylistPlaying = currentTrack && playlist.tracks && 
    playlist.tracks.some(track => track.id === currentTrack.id) && isPlaying;

  const handlePlayClick = (e) => {
    e.preventDefault();
    if (playlist.tracks && playlist.tracks.length > 0) {
      playQueue(playlist.tracks, 0);
    }
  };

  return (
    <motion.div 
      className="bg-spotify-dark-gray rounded-md p-4 hover:bg-spotify-light-gray transition-all duration-200 group"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/playlist/${playlist.id}`} className="block">
        <div className="relative">
          <img 
            src={playlist.coverArt || '/default-playlist.jpg'} 
            alt={playlist.name} 
            className="w-full aspect-square object-cover rounded-md mb-3"
          />
          <button
            className="absolute bottom-3 right-3 bg-spotify-green text-black p-3 rounded-full 
                      shadow-lg opacity-0 group-hover:opacity-100 transition-opacity
                      hover:scale-105 transform duration-200"
            onClick={handlePlayClick}
          >
            {isPlaylistPlaying ? (
              <PauseIcon className="h-5 w-5" />
            ) : (
              <PlayIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        
        <h3 className="text-spotify-white font-medium truncate">
          {playlist.name}
        </h3>
        <p className="text-sm text-spotify-light truncate mt-1">
          By {playlist.ownerName} • {playlist.trackCount || playlist.tracks?.length || 0} tracks
        </p>
      </Link>
    </motion.div>
  );
};

export default PlaylistCard;
