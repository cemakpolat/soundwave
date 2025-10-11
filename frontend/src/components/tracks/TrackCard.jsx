// src/components/tracks/TrackCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { PlayIcon, PauseIcon, HeartIcon as HeartIconOutline } from '@heroicons/react/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid';
import { usePlayer } from '../../hooks/usePlayer';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import TrackOptionsMenu from './TrackOptionsMenu';

const TrackCard = ({ track, showArtist = true, onUpdate, onDelete }) => {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    handleLike
  } = usePlayer();

  const { currentUser } = useAuth();

  const isCurrentTrack = currentTrack && currentTrack.id === track.id;
  const isOwnTrack = currentUser && (currentUser.id === track.userId || currentUser.id === track.User?.id);

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCurrentTrack) {
      togglePlay();
    } else {
      // Enable preview mode (30s limit) if user is not authenticated
      const previewMode = !currentUser;
      playTrack(track, previewMode);
    }
  };

  const handleLikeClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await handleLike(track.id);
    } catch (error) {
      console.error('Error liking track:', error);
    }
  };

  const handleTrackClick = () => {
    window.location.href = `/track/${track.id}`;
  };

  const handleArtistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/profile/${track.User.id}`;
  };

  return (
    <motion.div
      className="bg-spotify-dark-gray rounded-md p-4 hover:bg-spotify-light-gray transition-all duration-200 group cursor-pointer"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={handleTrackClick}
    >
      <div className="relative">
        <img
          src={track.coverArt || '../../../assets/images/default-cover.jpg'}
          alt={track.title}
          className="w-full aspect-square object-cover rounded-md mb-3"
        />

        {/* Options Menu - Top Right */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <TrackOptionsMenu
            track={track}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </div>

        {/* Play Button - Bottom Right */}
        <button
          className="absolute bottom-3 right-3 bg-spotify-green text-black p-3 rounded-full
                     shadow-lg opacity-0 group-hover:opacity-100 transition-opacity
                     hover:scale-105 transform duration-200"
          onClick={handlePlayClick}
        >
          {isCurrentTrack && isPlaying ? (
            <PauseIcon className="h-5 w-5" />
          ) : (
            <PlayIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="flex justify-between items-start">
        <div className="min-w-0 flex-1">
          <h3 className="text-spotify-white font-medium truncate">
            {track.title}
          </h3>
          {showArtist && track.User && (
            <span
              className="text-sm text-spotify-light hover:text-spotify-white truncate block cursor-pointer"
              onClick={handleArtistClick}
            >
              {track.User.username}
            </span>
          )}
        </div>

        {!isOwnTrack && (
          <button
            onClick={handleLikeClick}
            className="text-spotify-light hover:text-spotify-white ml-2 flex-shrink-0"
          >
            {track.isLiked ? (
              <HeartIconSolid className="h-5 w-5 text-spotify-green" />
            ) : (
              <HeartIconOutline className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default TrackCard;