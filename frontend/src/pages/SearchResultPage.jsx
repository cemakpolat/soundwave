// src/pages/SearchResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTracks, getPlaylists } from '../services/api';
import TrackList from '../components/tracks/TrackList';
import PlaylistList from '../components/playlists/PlaylistList';
import { SearchIcon } from '@heroicons/react/outline';
import { motion } from 'framer-motion';

const SearchResultsPage = () => {
  const { query } = useParams();
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would have a dedicated search API endpoint
        // Here we're simulating by calling separate endpoints
        const [tracksResponse, playlistsResponse] = await Promise.all([
          getTracks({ search: query }),
          getPlaylists({ search: query })
        ]);

        setTracks(tracksResponse);
        setPlaylists(playlistsResponse);
        
        // Extract unique artists from tracks
        const uniqueArtists = [];
        const artistIds = new Set();
        
        tracksResponse.forEach(track => {
          if (track.artistId && !artistIds.has(track.artistId)) {
            artistIds.add(track.artistId);
            uniqueArtists.push({
              id: track.artistId,
              name: track.artist,
              image: track.artistImage
            });
          }
        });
        
        setArtists(uniqueArtists);
      } catch (err) {
        setError('Failed to load search results. Please try again.');
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  const hasResults = tracks.length > 0 || playlists.length > 0 || artists.length > 0;

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
    <div>
      <h1 className="text-3xl font-bold text-spotify-white mb-6">
        Search results for "{query}"
      </h1>

      {hasResults ? (
        <div>
          {/* Tabs */}
          <div className="flex border-b border-spotify-light-gray mb-6">
            <button
              className={`py-3 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'all' 
                  ? 'border-spotify-green text-spotify-white' 
                  : 'border-transparent text-spotify-light hover:text-spotify-white'
              }`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            {tracks.length > 0 && (
              <button
                className={`py-3 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'tracks' 
                    ? 'border-spotify-green text-spotify-white' 
                    : 'border-transparent text-spotify-light hover:text-spotify-white'
                }`}
                onClick={() => setActiveTab('tracks')}
              >
                Tracks
              </button>
            )}
            {artists.length > 0 && (
              <button
                className={`py-3 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'artists' 
                    ? 'border-spotify-green text-spotify-white' 
                    : 'border-transparent text-spotify-light hover:text-spotify-white'
                }`}
                onClick={() => setActiveTab('artists')}
              >
                Artists
              </button>
            )}
            {playlists.length > 0 && (
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
            )}
          </div>
          
          {/* Tab content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'all' && (
              <div className="space-y-8">
                {/* Top result */}
                <div>
                  <h2 className="text-2xl font-bold text-spotify-white mb-4">Top result</h2>
                  <div className="bg-spotify-dark-gray rounded-lg p-6 max-w-sm">
                    {tracks.length > 0 ? (
                      <div>
                        <img 
                          src={tracks[0].coverArt || '/default-cover.jpg'} 
                          alt={tracks[0].title} 
                          className="w-32 h-32 mb-4 object-cover rounded-md"
                        />
                        <h3 className="text-xl font-bold text-spotify-white mb-1">{tracks[0].title}</h3>
                        <p className="text-spotify-light mb-2">
                          {tracks[0].artist} • Track
                        </p>
                        <button
                          className="bg-spotify-green text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-opacity-90"
                          onClick={() => window.location.href = `/track/${tracks[0].id}`}
                        >
                          Play
                        </button>
                      </div>
                    ) : playlists.length > 0 ? (
                      <div>
                        <img 
                          src={playlists[0].coverArt || '/default-playlist.jpg'} 
                          alt={playlists[0].name} 
                          className="w-32 h-32 mb-4 object-cover rounded-md"
                        />
                        <h3 className="text-xl font-bold text-spotify-white mb-1">{playlists[0].name}</h3>
                        <p className="text-spotify-light mb-2">
                          By {playlists[0].ownerName} • Playlist
                        </p>
                        <button
                          className="bg-spotify-green text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-opacity-90"
                          onClick={() => window.location.href = `/playlist/${playlists[0].id}`}
                        >
                          Play
                        </button>
                      </div>
                    ) : (
                      <div>
                        <img 
                          src={artists[0].image || '/default-user.jpg'} 
                          alt={artists[0].name} 
                          className="w-32 h-32 mb-4 object-cover rounded-full"
                        />
                        <h3 className="text-xl font-bold text-spotify-white mb-1">{artists[0].name}</h3>
                        <p className="text-spotify-light mb-2">Artist</p>
                        <button
                          className="bg-spotify-green text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-opacity-90"
                          onClick={() => window.location.href = `/profile/${artists[0].id}`}
                        >
                          View
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Tracks section */}
                {tracks.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-spotify-white mb-4">Tracks</h2>
                    <TrackList tracks={tracks.slice(0, 5)} showArtist />
                  </div>
                )}
                
                {/* Artists section */}
                {artists.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-spotify-white mb-4">Artists</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {artists.slice(0, 5).map(artist => (
                        <div 
                          key={artist.id} 
                          className="bg-spotify-dark-gray rounded-md p-4 hover:bg-spotify-light-gray transition-all duration-200"
                          onClick={() => window.location.href = `/profile/${artist.id}`}
                        >
                          <div className="mb-3">
                            <img 
                              src={artist.image || '/default-user.jpg'} 
                              alt={artist.name} 
                              className="w-full aspect-square object-cover rounded-full"
                            />
                          </div>
                          <h3 className="text-spotify-white font-medium truncate">
                            {artist.name}
                          </h3>
                          <p className="text-sm text-spotify-light">Artist</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Playlists section */}
                {playlists.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-spotify-white mb-4">Playlists</h2>
                    <PlaylistList playlists={playlists.slice(0, 5)} />
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'tracks' && (
              <div>
                <h2 className="text-2xl font-bold text-spotify-white mb-4">Tracks</h2>
                <TrackList tracks={tracks} showArtist showAlbum />
              </div>
            )}
            
            {activeTab === 'artists' && (
              <div>
                <h2 className="text-2xl font-bold text-spotify-white mb-4">Artists</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {artists.map(artist => (
                    <div 
                      key={artist.id} 
                      className="bg-spotify-dark-gray rounded-md p-4 hover:bg-spotify-light-gray transition-all duration-200"
                      onClick={() => window.location.href = `/profile/${artist.id}`}
                    >
                      <div className="mb-3">
                        <img 
                          src={artist.image || '/default-user.jpg'} 
                          alt={artist.name} 
                          className="w-full aspect-square object-cover rounded-full"
                        />
                      </div>
                      <h3 className="text-spotify-white font-medium truncate">
                        {artist.name}
                      </h3>
                      <p className="text-sm text-spotify-light">Artist</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'playlists' && (
              <div>
                <h2 className="text-2xl font-bold text-spotify-white mb-4">Playlists</h2>
                <PlaylistList playlists={playlists} />
              </div>
            )}
          </motion.div>
        </div>
      ) : (
        <div className="text-center py-16 bg-spotify-dark-gray rounded-lg">
          <SearchIcon className="h-16 w-16 text-spotify-light mx-auto mb-4" />
          <h2 className="text-xl font-bold text-spotify-white mb-2">No results found for "{query}"</h2>
          <p className="text-spotify-light">
            Please check your spelling or try different keywords.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;