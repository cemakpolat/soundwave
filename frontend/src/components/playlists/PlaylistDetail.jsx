// src/components/playlists/PlaylistDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTrackById, addTrackToPlaylist, searchTracks, getPlaylistById } from '../../services/api';
import { usePlayer } from '../../hooks/usePlayer';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { 
  PlayIcon, 
  PauseIcon, 
  DotsHorizontalIcon, 
  PlusIcon,
  ClockIcon
} from '@heroicons/react/outline';
import TrackList from '../tracks/TrackList';

const PlaylistDetail = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddTrackMenu, setShowAddTrackMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  
  const { currentUser } = useAuth();
  const { 
    currentTrack, 
    isPlaying, 
    playQueue,
    togglePlay
  } = usePlayer();
  const navigate = useNavigate();

  // Check if any track from this playlist is currently playing
  const isPlaylistPlaying = currentTrack && playlist?.tracks && 
    playlist.tracks.some(track => track.id === currentTrack.id) && isPlaying;

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        setLoading(true);
        // This would be replaced with an actual API call
        // const data = await fetch(`/api/playlists/${playlistId}`).then(res => res.json());
        const data = await getPlaylistById(playlistId); // Call the function

        setPlaylist(data);
      } catch (err) {
        setError('Failed to load playlist. Please try again.');
        console.error('Error fetching playlist:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  const handlePlayClick = () => {
    if (playlist?.tracks && playlist.tracks.length > 0) {
      if (isPlaylistPlaying) {
        togglePlay();
      } else {
        playQueue(playlist.tracks, 0);
      }
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setSearching(true);
      // This would be replaced with an actual API call
      // const results = await fetch(`/api/tracks/search?q=${encodeURIComponent(searchQuery)}`).then(res => res.json());
      const results = await searchTracks(searchQuery); // Call the function
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching tracks:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleAddTrack = async (trackId) => {
    try {
      await addTrackToPlaylist(playlistId, trackId);
      
      // Fetch the added track details
      const trackData = await getTrackById(trackId);
      
      // Update local playlist state
      setPlaylist(prev => ({
        ...prev,
        tracks: [...prev.tracks, trackData],
        trackCount: (prev.trackCount || prev.tracks.length) + 1
      }));
      
      // Close the add track menu
      setShowAddTrackMenu(false);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error adding track to playlist:', error);
    }
  };

  const isOwner = currentUser && playlist && currentUser.id === playlist.ownerId;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="text-center text-spotify-light py-8">
        <p className="text-xl">{error || 'Playlist not found'}</p>
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
      {/* Playlist header with cover art */}
      <div className="flex flex-col md:flex-row items-center md:items-end mb-8 bg-gradient-to-b from-spotify-light-gray to-spotify-black p-6 rounded-lg">
        <div className="w-48 h-48 md:w-56 md:h-56 flex-shrink-0 mr-0 md:mr-6 mb-4 md:mb-0">
          <img 
            src={playlist.coverArt || '/default-playlist.jpg'} 
            alt={playlist.name} 
            className="w-full h-full object-cover shadow-lg"
          />
        </div>
        
        <div className="flex flex-col">
          <p className="text-sm text-spotify-white uppercase mb-1">Playlist</p>
          <h1 className="text-4xl md:text-5xl font-bold text-spotify-white mb-2">
            {playlist.name}
          </h1>
          <p className="text-spotify-light mb-2">{playlist.description}</p>
          <div className="flex items-center text-sm">
            <Link 
              to={`/profile/${playlist.ownerId}`}
              className="text-spotify-white hover:underline"
            >
              {playlist.ownerName}
            </Link>
            <span className="mx-1 text-spotify-light">•</span>
            <span className="text-spotify-light">{playlist.trackCount || playlist.tracks.length} tracks</span>
            <span className="mx-1 text-spotify-light">•</span>
            <span className="text-spotify-light">
              {new Date(playlist.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center mb-8 space-x-4">
        <button
          onClick={handlePlayClick}
          disabled={!playlist.tracks || playlist.tracks.length === 0}
          className={`bg-spotify-green text-black rounded-full p-4 
                     hover:scale-105 transition-transform
                     disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isPlaylistPlaying ? (
            <PauseIcon className="h-8 w-8" />
          ) : (
            <PlayIcon className="h-8 w-8" />
          )}
        </button>
        
        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowAddTrackMenu(!showAddTrackMenu)}
              className="text-spotify-light hover:text-spotify-white"
            >
              <PlusIcon className="h-6 w-6" />
            </button>
            
            {showAddTrackMenu && (
              <div className="absolute top-10 left-0 w-64 bg-spotify-light-gray rounded-md shadow-lg z-10 p-4">
                <h3 className="text-spotify-white font-medium mb-2">Add tracks</h3>
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Search tracks"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 px-3 py-2 bg-spotify-dark-gray text-spotify-white rounded-l
                                focus:outline-none focus:ring-1 focus:ring-spotify-green"
                    />
                    <button
                      type="submit"
                      disabled={searching || !searchQuery.trim()}
                      className="bg-spotify-green text-black px-3 py-2 rounded-r
                                hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {searching ? '...' : 'Search'}
                    </button>
                  </div>
                </form>
                
                {searchResults.length > 0 && (
                  <div className="max-h-64 overflow-y-auto">
                    {searchResults.map(track => (
                      <div 
                        key={track.id}
                        className="flex items-center p-2 hover:bg-spotify-dark-gray rounded-md"
                      >
                        <img 
                          src={track.coverArt || '/default-cover.jpg'} 
                          alt={track.title} 
                          className="w-8 h-8 object-cover rounded mr-2"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-spotify-white text-sm truncate">{track.title}</p>
                          <p className="text-xs text-spotify-light truncate">{track.artist}</p>
                        </div>
                        <button
                          onClick={() => handleAddTrack(track.id)}
                          className="ml-2 text-spotify-light hover:text-spotify-green"
                        >
                          <PlusIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {searching && (
                  <div className="text-center py-4">
                    <div className="animate-spin inline-block w-6 h-6 border-t-2 border-spotify-green rounded-full"></div>
                  </div>
                )}
                
                {searchResults.length === 0 && searchQuery && !searching && (
                  <p className="text-spotify-light text-sm text-center py-2">No tracks found</p>
                )}
              </div>
            )}
          </div>
        )}
        
        <button className="text-spotify-light hover:text-spotify-white">
          <DotsHorizontalIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Tracks list */}
      {playlist.tracks && playlist.tracks.length > 0 ? (
        <TrackList 
          tracks={playlist.tracks} 
          showArtist 
          showAlbum
          showDateAdded
        />
      ) : (
        <div className="text-center py-10 bg-spotify-dark-gray rounded-lg">
          <p className="text-spotify-white text-lg mb-2">This playlist is empty</p>
          {isOwner && (
            <button
              onClick={() => setShowAddTrackMenu(true)}
              className="mt-4 px-6 py-2 bg-spotify-green text-black rounded-full
                        hover:bg-opacity-90 transition-colors"
            >
              Add tracks
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default PlaylistDetail;