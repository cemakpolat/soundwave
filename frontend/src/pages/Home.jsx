// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTracks, getPlaylists, getRecommendations } from '../services/api';
import TrackCard from '../components/tracks/TrackCard';
import PlaylistCard from '../components/playlists/PlaylistCard';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Home = () => {
  const [recentTracks, setRecentTracks] = useState([]);
  const [popularTracks, setPopularTracks] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch recent tracks
        const tracksResponse = await getTracks({ sort: 'recent', limit: 10 });
        setRecentTracks(tracksResponse);
        
        // Fetch popular tracks
        const popularResponse = await getTracks({ sort: 'popular', limit: 10 });
        setPopularTracks(popularResponse);
        
        // Fetch featured playlists
        const playlistsResponse = await getPlaylists({ featured: true, limit: 5 });
        setFeaturedPlaylists(playlistsResponse);
        
        // Fetch recommended tracks if user is logged in
        if (currentUser) {
          const recommendationsResponse = await getRecommendations();
          setRecommendedTracks(recommendationsResponse);
        }
        
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-spotify-light py-8">
        <p className="text-xl">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-spotify-green hover:underline mt-4 inline-block"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <section>
        <h1 className="text-3xl font-bold text-spotify-white mb-6">
          {currentUser ? `Welcome back, ${currentUser.username || currentUser.email || 'User'}!` : 'Welcome to SoundWave'}
        </h1>
      </section>

      {/* Recommended section (only for logged-in users) */}
      {currentUser && recommendedTracks.length > 0 && (
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-spotify-white">Recommended for You</h2>
            <Link to="/recommendations" className="text-sm text-spotify-green hover:underline">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendedTracks.slice(0, 5).map(track => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        </motion.section>
      )}

      {/* Recent tracks section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-spotify-white">Recently Added</h2>
          <Link to="/tracks" className="text-sm text-spotify-green hover:underline">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {recentTracks.slice(0, 5).map(track => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </motion.section>

      {/* Featured playlists section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-spotify-white">Featured Playlists</h2>
          <Link to="/playlists" className="text-sm text-spotify-green hover:underline">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {featuredPlaylists.map(playlist => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </motion.section>

      {/* Popular tracks section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-spotify-white">Popular Now</h2>
          <Link to="/popular" className="text-sm text-spotify-green hover:underline">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {popularTracks.slice(0, 5).map(track => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
