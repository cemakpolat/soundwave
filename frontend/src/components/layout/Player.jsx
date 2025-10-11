// src/components/layout/Player.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePlayer } from '../../hooks/usePlayer';
import { useAuth } from '../../hooks/useAuth';
import {
  PlayIcon,
  PauseIcon,
  RewindIcon,
  FastForwardIcon,
  VolumeUpIcon,
  VolumeOffIcon,
  HeartIcon as HeartIconOutline
} from '@heroicons/react/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid';

// Helper function to format time (seconds to MM:SS)
const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const Player = () => {
  const {
    currentTrack,
    isPlaying,
    duration,
    currentTime,
    volume,
    isPreviewMode,
    togglePlay,
    playNextTrack,
    playPreviousTrack,
    seekTo,
    setVolume,
    handleLike
  } = usePlayer();

  const { currentUser } = useAuth();

  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  const [isDragging, setIsDragging] = useState(false);
  const [seekValue, setSeekValue] = useState(0);

  // Update seek slider when currentTime changes
  useEffect(() => {
    if (!isDragging && currentTrack) {
      setSeekValue((currentTime / duration) * 100 || 0);
    }
  }, [currentTime, duration, isDragging, currentTrack]);

  const handleSeekChange = (e) => {
    const value = parseFloat(e.target.value);
    setSeekValue(value);
    const seekTime = (value / 100) * duration;
    if (!isDragging) {
      seekTo(seekTime);
    }
  };

  const handleSeekStart = () => {
    setIsDragging(true);
  };

  const handleSeekEnd = () => {
    setIsDragging(false);
    const seekTime = (seekValue / 100) * duration;
    seekTo(seekTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume || 0.5);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleLikeClick = async () => {
    if (currentTrack) {
      await handleLike(currentTrack.id);
    }
  };

  const isOwnTrack = currentUser && currentTrack && (
    currentUser.id === currentTrack.userId ||
    currentUser.id === currentTrack.User?.id
  );

  if (!currentTrack) {
    return (
      <div className="bg-spotify-light-gray h-20 border-t border-gray-800 text-spotify-white flex items-center justify-center">
        <p className="text-sm text-spotify-light">Select a track to play</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Preview mode banner */}
      {isPreviewMode && (
        <div className="bg-yellow-600 bg-opacity-90 text-white text-xs py-1 px-4 text-center">
          Preview Mode - 30s limit • <Link to="/login" className="underline hover:text-spotify-white">Sign in</Link> to hear full tracks
        </div>
      )}

      <div className="bg-spotify-light-gray h-20 border-t border-gray-800 text-spotify-white grid grid-cols-3 items-center px-4">
        {/* Track info (left section) */}
        <div className="flex items-center">
          <div className="flex-shrink-0 w-14 h-14 mr-3">
            <img
              src={currentTrack.coverArt || '/default-cover.jpg'}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col overflow-hidden">
            <div className="flex items-center gap-2">
              <Link
                to={`/track/${currentTrack.id}`}
                className="text-sm font-medium truncate hover:underline"
              >
                {currentTrack.title}
              </Link>
              {isPreviewMode && (
                <span className="text-xs bg-yellow-600 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                  Preview
                </span>
              )}
            </div>
            <Link
              to={`/artist/${currentTrack.artistId}`}
              className="text-xs text-spotify-light truncate hover:underline"
            >
              {currentTrack.artist}
            </Link>
          </div>
        {!isOwnTrack && (
          <button
            onClick={handleLikeClick}
            className="ml-4 text-spotify-light hover:text-spotify-white"
          >
            {currentTrack.isLiked ? (
              <HeartIconSolid className="h-5 w-5 text-spotify-green" />
            ) : (
              <HeartIconOutline className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {/* Playback controls (center section) */}
      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-4">
          <button
            className="text-spotify-light hover:text-spotify-white"
            onClick={playPreviousTrack}
          >
            <RewindIcon className="h-5 w-5" />
          </button>
          <button
            className="bg-spotify-white rounded-full p-2 text-spotify-black hover:scale-105 transition-transform"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <PauseIcon className="h-5 w-5" />
            ) : (
              <PlayIcon className="h-5 w-5" />
            )}
          </button>
          <button
            className="text-spotify-light hover:text-spotify-white"
            onClick={playNextTrack}
          >
            <FastForwardIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex items-center w-full space-x-2 mt-1">
          <span className="text-xs text-spotify-light w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <div className="relative flex-1">
            <input
              type="range"
              min="0"
              max="100"
              value={seekValue}
              onChange={handleSeekChange}
              onMouseDown={handleSeekStart}
              onMouseUp={handleSeekEnd}
              onTouchStart={handleSeekStart}
              onTouchEnd={handleSeekEnd}
              className="w-full h-1 rounded-full appearance-none cursor-pointer 
                         bg-gray-600"
              style={{
                background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${seekValue}%, #4D4D4D ${seekValue}%, #4D4D4D 100%)`
              }}
            />
          </div>
          <span className="text-xs text-spotify-light w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume controls (right section) */}
      <div className="flex items-center justify-end space-x-3">
        <button
          onClick={toggleMute}
          className="text-spotify-light hover:text-spotify-white"
        >
          {isMuted || volume === 0 ? (
            <VolumeOffIcon className="h-5 w-5" />
          ) : (
            <VolumeUpIcon className="h-5 w-5" />
          )}
        </button>
        <div className="w-24">
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={handleVolumeChange}
            className="w-full h-1 rounded-full appearance-none cursor-pointer 
                       bg-gray-600"
            style={{
              background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${volume * 100}%, #4D4D4D ${volume * 100}%, #4D4D4D 100%)`
            }}
          />
        </div>
      </div>
    </div>
    </div>
  );
};

export default Player;