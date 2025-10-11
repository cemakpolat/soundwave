
// src/pages/YourLibrary.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPlaylists, getTracks } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import PlaylistList from '../components/playlists/PlaylistList';
import TrackList from '../components/tracks/TrackList';
import { 
  HeartIcon, 
  CollectionIcon 
} from '@heroicons/react/outline';
import { FaMusic } from 'react-icons/fa'; // Font Awesome musical note icon

const YourLibrary = () => {
  const [activeTab, setActiveTab] = useState('playlists');
  const [playlists, setPlaylists] = useState([]);
  const [likedTracks, setLikedTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        setLoading(true);
        
        if (activeTab === 'playlists') {
          const response = await getPlaylists({ userId: currentUser.id });
          setPlaylists(response);
        } else if (activeTab === 'liked') {
          const response = await getTracks({ liked: true });
          setLikedTracks(response);
        }
        
      } catch (err) {
        setError('Failed to load library data. Please try again.');
        console.error('Error fetching library data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchLibraryData();
    }
  }, [activeTab, currentUser]);

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <CollectionIcon className="h-16 w-16 mx-auto mb-4 text-spotify-light" />
        <h2 className="text-2xl font-bold text-spotify-white mb-4">Enjoy your library</h2>
        <p className="text-spotify-light mb-6">
          Log in to see saved playlists and liked songs in Your Library.
        </p>
        <Link 
          to="/login" 
          className="bg-spotify-white text-spotify-black px-8 py-3 rounded-full text-sm font-medium hover:bg-opacity-80"
        >
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-spotify-white mb-6">Your Library</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-spotify-light-gray mb-6">
        <button
          className={`py-3 px-6 font-medium text-sm border-b-2 ${
            activeTab === 'playlists' 
              ? 'border-spotify-green text-spotify-white' 
              : 'border-transparent text-spotify-light hover:text-spotify-white'
          }`}
          onClick={() => setActiveTab('playlists')}
        >
          Playlists
        </button>
        <button
          className={`py-3 px-6 font-medium text-sm border-b-2 ${
            activeTab === 'liked' 
              ? 'border-spotify-green text-spotify-white' 
              : 'border-transparent text-spotify-light hover:text-spotify-white'
          }`}
          onClick={() => setActiveTab('liked')}
        >
          Liked Songs
        </button>
      </div>
      
      {/* Tab content */}
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
      ) : (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'playlists' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-spotify-white">Your Playlists</h2>
                <Link 
                  to="/create-playlist" 
                  className="bg-spotify-green text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-90"
                >
                  Create Playlist
                </Link>
              </div>
              
              {playlists.length > 0 ? (
                <PlaylistList playlists={playlists} />
              ) : (
                <div className="text-center py-12 bg-spotify-dark-gray rounded-lg">
                  <FaMusic className="h-16 w-16 mx-auto mb-4 text-spotify-light" />
                  <h3 className="text-xl font-bold text-spotify-white mb-2">Create your first playlist</h3>
                  <p className="text-spotify-light mb-6">It's easy, we'll help you</p>
                  <Link 
                    to="/create-playlist" 
                    className="bg-spotify-green text-black px-6 py-3 rounded-full text-sm font-medium hover:bg-opacity-90"
                  >
                    Create Playlist
                  </Link>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'liked' && (
            <div>
              <h2 className="text-2xl font-bold text-spotify-white mb-4">Liked Songs</h2>
              
              {likedTracks.length > 0 ? (
                <TrackList tracks={likedTracks} showArtist showAlbum showDateAdded />
              ) : (
                <div className="text-center py-12 bg-spotify-dark-gray rounded-lg">
                  <HeartIcon className="h-16 w-16 mx-auto mb-4 text-spotify-light" />
                  <h3 className="text-xl font-bold text-spotify-white mb-2">Songs you like will appear here</h3>
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
          )}
        </motion.div>
      )}
    </div>
  );
};

export default YourLibrary;

