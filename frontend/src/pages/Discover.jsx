
// src/pages/Discover.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTracks } from '../services/api';
import TrackList from '../components/tracks/TrackList';
import { 
  RefreshIcon, 
  FilterIcon, 
  MusicNoteIcon 
} from '@heroicons/react/outline';

const Discover = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  
  const genres = [
    { id: 'all', name: 'All Genres' },
    { id: 'pop', name: 'Pop' },
    { id: 'rock', name: 'Rock' },
    { id: 'hiphop', name: 'Hip Hop' },
    { id: 'electronic', name: 'Electronic' },
    { id: 'jazz', name: 'Jazz' },
    { id: 'classical', name: 'Classical' },
    { id: 'rnb', name: 'R&B' },
    { id: 'country', name: 'Country' },
    { id: 'folk', name: 'Folk' },
  ];
  
  const sortOptions = [
    { id: 'recent', name: 'Recently Added' },
    { id: 'popular', name: 'Most Popular' },
    { id: 'az', name: 'A-Z' },
    { id: 'za', name: 'Z-A' },
  ];

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        
        const params = { 
          sort: sortBy,
          limit: 50
        };
        
        if (selectedGenre !== 'all') {
          params.genre = selectedGenre;
        }
        
        const response = await getTracks(params);
        setTracks(response);
      } catch (err) {
        setError('Failed to load tracks. Please try again.');
        console.error('Error fetching tracks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [selectedGenre, sortBy]);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
  };

  const handleSortChange = (sortId) => {
    setSortBy(sortId);
  };

  const refreshTracks = () => {
    setLoading(true);
    // This would re-fetch the tracks with the current filters
    setTimeout(() => setLoading(false), 500);
  };

  if (error) {
    return (
      <div className="text-center text-spotify-light py-8">
        <p className="text-xl">{error}</p>
        <button 
          onClick={refreshTracks}
          className="text-spotify-green hover:underline mt-4 inline-block"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-spotify-white">Discover</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshTracks}
            className="p-2 rounded-full bg-spotify-dark-gray text-spotify-light hover:text-spotify-white"
            title="Refresh"
          >
            <RefreshIcon className="h-5 w-5" />
          </button>
          <button
            onClick={toggleFilters}
            className="p-2 rounded-full bg-spotify-dark-gray text-spotify-light hover:text-spotify-white"
            title="Filter"
          >
            <FilterIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <motion.div 
          className="bg-spotify-dark-gray p-4 rounded-lg mb-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-spotify-white font-medium mb-2">Genre</h3>
              <div className="flex flex-wrap gap-2">
                {genres.map(genre => (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreChange(genre.id)}
                    className={`px-3 py-1 rounded-full text-sm
                                ${selectedGenre === genre.id 
                                  ? 'bg-spotify-green text-black' 
                                  : 'bg-spotify-light-gray text-spotify-white hover:bg-opacity-80'}`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-spotify-white font-medium mb-2">Sort By</h3>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleSortChange(option.id)}
                    className={`px-3 py-1 rounded-full text-sm
                                ${sortBy === option.id 
                                  ? 'bg-spotify-green text-black' 
                                  : 'bg-spotify-light-gray text-spotify-white hover:bg-opacity-80'}`}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tracks list */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
        </div>
      ) : tracks.length > 0 ? (
        <TrackList tracks={tracks} showArtist showAlbum />
      ) : (
        <div className="text-center py-16 bg-spotify-dark-gray rounded-lg">
          <MusicNoteIcon className="h-16 w-16 text-spotify-light mx-auto mb-4" />
          <p className="text-spotify-white text-lg">No tracks found</p>
          <p className="text-spotify-light">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default Discover;