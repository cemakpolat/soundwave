
// src/components/tracks/TrackList.jsx
import React from 'react';
import { PlayIcon, PauseIcon, HeartIcon as HeartIconOutline, DotsHorizontalIcon, ClockIcon } from '@heroicons/react/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid';
import { usePlayer } from '../../hooks/usePlayer';
import { Link } from 'react-router-dom';

// Helper function to format time (seconds to MM:SS)
const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const TrackList = ({ tracks, showHeader = true, showArtist = true, showAlbum = false, showDateAdded = false }) => {
  const { 
    currentTrack, 
    isPlaying, 
    playTrack, 
    playQueue,
    togglePlay,
    handleLike
  } = usePlayer();

  const handlePlayClick = (track, index) => {
    if (currentTrack && currentTrack.id === track.id) {
      togglePlay();
    } else {
      // Play this track and queue all tracks in the list
      playQueue(tracks, index);
    }
  };

  const handleLikeClick = async (trackId) => {
    try {
      await handleLike(trackId);
    } catch (error) {
      console.error('Error liking track:', error);
    }
  };

  return (
    <div className="w-full">
      {showHeader && (
        <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-spotify-light-gray text-spotify-light text-sm">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-5">TITLE</div>
          {showArtist && <div className="col-span-2">ARTIST</div>}
          {showAlbum && <div className="col-span-2">ALBUM</div>}
          {showDateAdded && <div className="col-span-2">DATE ADDED</div>}
          <div className="col-span-1 flex justify-end">
            <ClockIcon className="h-5 w-5" />
          </div>
        </div>
      )}

      <div className="divide-y divide-spotify-light-gray divide-opacity-10">
        {tracks.map((track, index) => {
          const isCurrentTrack = currentTrack && currentTrack.id === track.id;
          
          return (
            <div 
              key={track.id}
              className={`grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-spotify-light-gray group
                          ${isCurrentTrack ? 'bg-spotify-light-gray bg-opacity-30' : ''}`}
            >
              {/* Track number/play button */}
              <div className="col-span-1 flex justify-center">
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <span className={`group-hover:hidden ${isCurrentTrack ? 'text-spotify-green' : 'text-spotify-light'}`}>
                    {index + 1}
                  </span>
                  <button 
                    className="hidden group-hover:block"
                    onClick={() => handlePlayClick(track, index)}
                  >
                    {isCurrentTrack && isPlaying ? (
                      <PauseIcon className="h-5 w-5 text-spotify-white" />
                    ) : (
                      <PlayIcon className="h-5 w-5 text-spotify-white" />
                    )}
                  </button>
                </div>
              </div>

              {/* Track info */}
              <div className="col-span-5 flex items-center">
                <div className="w-10 h-10 flex-shrink-0 mr-3">
                  <img 
                    src={track.coverArt || '/default-cover.jpg'} 
                    alt={track.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <Link 
                    to={`/track/${track.id}`}
                    className={`block truncate font-medium ${isCurrentTrack ? 'text-spotify-green' : 'text-spotify-white'}`}
                  >
                    {track.title}
                  </Link>
                  
                  {/* Only show in mobile view or when artist column is hidden */}
                  {!showArtist && (
                    <Link 
                      to={`/artist/${track.artistId}`}
                      className="text-sm text-spotify-light hover:text-spotify-white truncate block md:hidden"
                    >
                      {track.artist}
                    </Link>
                  )}
                </div>
              </div>

              {/* Artist */}
              {showArtist && (
                <div className="col-span-2 hidden md:block">
                  <Link 
                    to={`/artist/${track.artistId}`}
                    className="text-spotify-light hover:text-spotify-white truncate block"
                  >
                    {track.artist}
                  </Link>
                </div>
              )}

              {/* Album */}
              {showAlbum && (
                <div className="col-span-2 hidden md:block">
                  <Link 
                    to={`/album/${track.albumId}`}
                    className="text-spotify-light hover:text-spotify-white truncate block"
                  >
                    {track.album}
                  </Link>
                </div>
              )}

              {/* Date added */}
              {showDateAdded && (
                <div className="col-span-2 text-spotify-light text-sm hidden md:block">
                  {formatDate(track.dateAdded)}
                </div>
              )}

              {/* Actions and duration */}
              <div className="col-span-1 md:col-span-1 flex items-center justify-end space-x-4">
                <button
                  className="text-spotify-light hover:text-spotify-white hidden group-hover:block"
                  onClick={() => handleLikeClick(track.id)}
                >
                  {track.isLiked ? (
                    <HeartIconSolid className="h-5 w-5 text-spotify-green" />
                  ) : (
                    <HeartIconOutline className="h-5 w-5" />
                  )}
                </button>
                <span className="text-sm text-spotify-light">
                  {formatTime(track.duration)}
                </span>
                <div className="relative">
                  <button className="text-spotify-light hover:text-spotify-white hidden group-hover:block">
                    <DotsHorizontalIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackList;
