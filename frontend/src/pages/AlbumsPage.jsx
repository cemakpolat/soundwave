// src/pages/AlbumsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAlbums } from '../services/api';
import { motion } from 'framer-motion';
import AlbumCard from '../components/albums/AlbumCard';
import { useAuth } from '../hooks/useAuth';

const AlbumsPage = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('');
  const { currentUser } = useAuth();

  const isCreator = currentUser && (currentUser.role === 'creator' || currentUser.role === 'admin');

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const params = selectedGenre ? { genre: selectedGenre } : {};
        const data = await getAlbums(params);
        setAlbums(data);
      } catch (err) {
        setError('Failed to load albums. Please try again.');
        console.error('Error fetching albums:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [selectedGenre]);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-spotify-white mb-2">Albums</h1>
          <p className="text-spotify-light">
            Discover amazing albums from talented artists
          </p>
        </div>
        {isCreator && (
          <Link
            to="/create-album"
            className="px-6 py-3 rounded-full bg-spotify-green text-black font-medium hover:bg-opacity-90"
          >
            Create Album
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <label className="text-spotify-light">Genre:</label>
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="px-4 py-2 bg-spotify-dark-gray text-spotify-white rounded-full
                     focus:outline-none focus:ring-2 focus:ring-spotify-green"
        >
          <option value="">All Genres</option>
          <option value="pop">Pop</option>
          <option value="rock">Rock</option>
          <option value="hiphop">Hip Hop</option>
          <option value="electronic">Electronic</option>
          <option value="jazz">Jazz</option>
          <option value="classical">Classical</option>
          <option value="rnb">R&B</option>
          <option value="country">Country</option>
          <option value="folk">Folk</option>
          <option value="blues">Blues</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Albums Grid */}
      {albums.length > 0 ? (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <p className="text-spotify-light text-xl mb-4">
            No albums found
            {selectedGenre && ` in ${selectedGenre} genre`}
          </p>
          {isCreator && (
            <Link
              to="/create-album"
              className="inline-block px-6 py-3 rounded-full bg-spotify-green text-black font-medium hover:bg-opacity-90"
            >
              Create Your First Album
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default AlbumsPage;
