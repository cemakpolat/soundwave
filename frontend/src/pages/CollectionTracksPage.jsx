// src/pages/CollectionTracksPage.jsx
import React, { useState, useEffect } from 'react';
import { getTracks } from '../services/api';
import TrackList from '../components/tracks/TrackList';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { HeartIcon, PlayIcon } from '@heroicons/react/solid';
import { usePlayer } from '../hooks/usePlayer';
import { Link } from 'react-router-dom';

const CollectionTracksPage = () => {
  const [likedTracks, setLikedTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const { playQueue, isPlaying, togglePlay } = usePlayer();

  useEffect(() => {
    const fetchLikedTracks = async () => {
      try {
        setLoading(true);
        // Get only liked tracks
        const response = await getTracks({ liked: true });
        setLikedTracks(response);
      } catch (err) {
        setError('Failed to load your liked tracks. Please try again.');
        console.error('Error fetching liked tracks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedTracks();
  }, []);

  const handlePlayAll = () => {
    if (likedTracks.length > 0) {
      playQueue(likedTracks, 0);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center md:items-end mb-8 bg-gradient-to-b from-green-600 to-spotify-dark-gray p-6 rounded-lg">
        <div className="w-48 h-48 md:w-56 md:h-56 flex-shrink-0 mr-0 md:mr-6 mb-4 md:mb-0 flex items-center justify-center bg-spotify-light-gray rounded-lg shadow-lg">
          <HeartIcon className="h-24 w-24 text-spotify-green" />
        </div>
        
        <div className="flex flex-col text-center md:text-left">
          <p className="text-sm text-spotify-white uppercase mb-1">Playlist</p>
          <h1 className="text-4xl md:text-5xl font-bold text-spotify-white mb-2">
            Liked Songs
          </h1>
          <div className="flex flex-col md:flex-row md:items-center text-sm mb-4">
            {currentUser && (
              <span className="text-spotify-light">
                <Link to={`/profile/${currentUser.id}`} className="text-spotify-white hover:underline">
                  {currentUser.username}
                </Link>
              </span>
            )}
            <span className="hidden md:inline mx-1 text-spotify-light">•</span>
            <span className="text-spotify-light">
              {likedTracks.length} songs
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center mb-8 space-x-4">
        <button
          onClick={handlePlayAll}
          disabled={likedTracks.length === 0 || loading}
          className={`bg-spotify-green text-black rounded-full p-4 
                   hover:scale-105 transition-transform
                   disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <PlayIcon className="h-8 w-8" />
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
        </div>
      ) : error ? (
        <div className="text-center text-spotify-light py-8">
          <p className="text-xl">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-spotify-green hover:underline mt-4 inline-block"
          >
            Retry
          </button>
        </div>
      ) : likedTracks.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <TrackList tracks={likedTracks} showArtist showAlbum showDateAdded />
        </motion.div>
      ) : (
        <div className="text-center py-16 bg-spotify-dark-gray rounded-lg">
          <HeartIcon className="h-16 w-16 text-spotify-light mx-auto mb-4" />
          <h2 className="text-xl font-bold text-spotify-white mb-2">Songs you like will appear here</h2>
          <p className="text-spotify-light mb-6">Save songs by tapping the heart icon</p>
          <Link 
            to="/discover" 
            className="bg-spotify-green text-black px-6 py-3 rounded-full text-sm font-medium hover:bg-opacity-90"
          >
            Find Songs
          </Link>
        </div>
      )}
    </div>
  );
};

export default CollectionTracksPage;