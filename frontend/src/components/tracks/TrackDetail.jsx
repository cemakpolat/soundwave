// src/components/tracks/TrackDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTrackById, addComment } from '../../services/api';
import { usePlayer } from '../../hooks/usePlayer';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import {
  PlayIcon,
  PauseIcon,
  HeartIcon as HeartIconOutline,
  ShareIcon,
  DotsHorizontalIcon,
  ClockIcon
} from '@heroicons/react/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid';
import CommentSection from '../social/CommentSection';

// Helper to format time
const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const TrackDetail = () => {
  const { trackId } = useParams();
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    handleLike
  } = usePlayer();

  const { currentUser } = useAuth();

  const isCurrentTrack = currentTrack && currentTrack.id === trackId;

  // Check if this is the user's own track
  const isOwnTrack = currentUser && track && (
    currentUser.id === track.userId ||
    currentUser.id === track.User?.id
  );

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        setLoading(true);
        const data = await getTrackById(trackId);
        setTrack(data);
      } catch (err) {
        setError('Failed to load track. Please try again.');
        console.error('Error fetching track:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrack();
  }, [trackId]);

  const handlePlayClick = () => {
    if (isCurrentTrack) {
      togglePlay();
    } else if (track) {
      playTrack(track);
    }
  };

  const handleLikeClick = async () => {
    try {
      await handleLike(trackId);
      // Update local track state to reflect like status
      setTrack(prev => ({
        ...prev,
        isLiked: !prev.isLiked,
        likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
      }));
    } catch (error) {
      console.error('Error liking track:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const comment = await addComment(trackId, newComment);
      
      // Update local state with new comment
      setTrack(prev => ({
        ...prev,
        comments: [comment, ...(prev.comments || [])]
      }));
      
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
      </div>
    );
  }

  if (error || !track) {
    return (
      <div className="text-center text-spotify-light py-8">
        <p className="text-xl">{error || 'Track not found'}</p>
        <Link to="/" className="text-spotify-green hover:underline mt-4 inline-block">
          Go back to home
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Track header with cover art */}
      <div className="flex flex-col md:flex-row items-center md:items-end mb-8 bg-gradient-to-b from-spotify-light-gray to-spotify-black p-6 rounded-lg">
        <div className="w-48 h-48 md:w-56 md:h-56 flex-shrink-0 mr-0 md:mr-6 mb-4 md:mb-0">
          <img 
            src={track.coverArt || '/default-cover.jpg'} 
            alt={track.title} 
            className="w-full h-full object-cover shadow-lg"
          />
        </div>
        
        <div className="flex flex-col">
          <p className="text-sm text-spotify-white uppercase mb-1">Track</p>
          <h1 className="text-4xl md:text-5xl font-bold text-spotify-white mb-2">
            {track.title}
          </h1>
          <div className="flex items-center text-sm mb-4">
            <Link 
              to={`/artist/${track.artistId}`}
              className="text-spotify-white hover:underline flex items-center"
            >
              {track.artist}
            </Link>
            <span className="mx-1 text-spotify-light">•</span>
            <span className="text-spotify-light">{new Date(track.createdAt).getFullYear()}</span>
            <span className="mx-1 text-spotify-light">•</span>
            <span className="text-spotify-light">{formatTime(track.duration)}</span>
          </div>
        </div>
      </div>

      {/* Player controls */}
      <div className="flex items-center mb-8 space-x-4">
        <button
          onClick={handlePlayClick}
          className="bg-spotify-green text-black rounded-full p-4 hover:scale-105 transition-transform"
        >
          {isCurrentTrack && isPlaying ? (
            <PauseIcon className="h-8 w-8" />
          ) : (
            <PlayIcon className="h-8 w-8" />
          )}
        </button>

        {/* Only show like button if it's not the user's own track */}
        {!isOwnTrack && (
          <button
            onClick={handleLikeClick}
            className="text-spotify-light hover:text-spotify-white"
          >
            {track.isLiked ? (
              <HeartIconSolid className="h-8 w-8 text-spotify-green" />
            ) : (
              <HeartIconOutline className="h-8 w-8" />
            )}
          </button>
        )}

        <button className="text-spotify-light hover:text-spotify-white">
          <ShareIcon className="h-6 w-6" />
        </button>

        <button className="text-spotify-light hover:text-spotify-white">
          <DotsHorizontalIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Track info and stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="col-span-2">
          <div className="bg-spotify-dark-gray rounded-lg p-6">
            <h2 className="text-xl font-semibold text-spotify-white mb-4">About</h2>
            <p className="text-spotify-light mb-4">
              {track.description || 'No description provided.'}
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <p className="text-spotify-light">Genre</p>
                <p className="text-spotify-white">{track.genre || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-spotify-light">Released</p>
                <p className="text-spotify-white">{new Date(track.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-spotify-light">Plays</p>
                <p className="text-spotify-white">{track.playCount || 0}</p>
              </div>
            </div>
          </div>

          {/* Comment section */}
          <div className="bg-spotify-dark-gray rounded-lg p-6 mt-6">
            <h2 className="text-xl font-semibold text-spotify-white mb-4">Comments</h2>
            
            <form onSubmit={handleAddComment} className="mb-6">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Write a comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-4 py-3 bg-spotify-light-gray text-spotify-white rounded-l
                            focus:outline-none focus:ring-2 focus:ring-spotify-green"
                />
                <button
                  type="submit"
                  disabled={submittingComment || !newComment.trim()}
                  className="bg-spotify-green text-black px-4 py-2 rounded-r
                            hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </form>
            
            <CommentSection trackId={trackId} comments={track.comments || []} />
          </div>
        </div>
        
        <div>
          <div className="bg-spotify-dark-gray rounded-lg p-6 sticky top-20">
            <h2 className="text-xl font-semibold text-spotify-white mb-4">Artist</h2>
            
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                <img 
                  src={track.artistImage || '/default-user.jpg'} 
                  alt={track.artist} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <Link 
                  to={`/artist/${track.artistId}`}
                  className="text-spotify-white font-medium hover:underline"
                >
                  {track.artist}
                </Link>
                <p className="text-sm text-spotify-light">
                  {track.artistFollowers || 0} followers
                </p>
              </div>
            </div>
            
            <Link 
              to={`/artist/${track.artistId}`}
              className="block w-full text-center py-2 px-4 rounded-full
                        border border-spotify-light text-spotify-white
                        hover:border-spotify-white transition-colors"
            >
              View Artist
            </Link>

            {/* More tracks by this artist */}
            <div className="mt-6">
              <h3 className="text-md font-semibold text-spotify-white mb-3">More by {track.artist}</h3>
              {track.artistTracks && track.artistTracks.length > 0 ? (
                <div className="space-y-2">
                  {track.artistTracks
                    .filter(t => t.id !== track.id)
                    .slice(0, 4)
                    .map(t => (
                      <Link 
                        key={t.id}
                        to={`/track/${t.id}`}
                        className="flex items-center p-2 hover:bg-spotify-light-gray rounded-md"
                      >
                        <img 
                          src={t.coverArt || '/default-cover.jpg'} 
                          alt={t.title} 
                          className="w-10 h-10 object-cover rounded mr-3"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-spotify-white truncate">{t.title}</p>
                          <p className="text-xs text-spotify-light">{formatTime(t.duration)}</p>
                        </div>
                      </Link>
                    ))
                  }
                </div>
              ) : (
                <p className="text-spotify-light text-sm">No other tracks available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TrackDetail;