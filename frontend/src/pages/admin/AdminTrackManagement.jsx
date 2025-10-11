// src/pages/AdminTrackManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  SearchIcon, 
  MusicNoteIcon, 
  FilterIcon, 
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
  PauseIcon,
  TrashIcon,
  ExclamationCircleIcon
} from '@heroicons/react/outline';
import { usePlayer } from '../../hooks/usePlayer';

const AdminTrackManagement = () => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [tracks, setTracks] = useState([]);
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Mock track data
  const mockTracks = [
    { 
      id: 'track-1', 
      title: 'Summer Vibes', 
      artist: 'Beach Soundz', 
      artistId: 'user-10',
      uploadedBy: 'creator01',
      uploaderId: 'user-3',
      genre: 'pop', 
      status: 'approved', 
      coverArt: '/api/placeholder/300/300',
      uploadedAt: '2023-06-15T14:30:00Z',
      duration: 215,
      playCount: 24567,
      likes: 1289,
      comments: 47,
      reports: 0,
      audioUrl: 'https://example.com/audio.mp3'
    },
    { 
      id: 'track-2', 
      title: 'Late Night Drive', 
      artist: 'Midnight Cruisers', 
      artistId: 'user-11',
      uploadedBy: 'creator02',
      uploaderId: 'user-4',
      genre: 'electronic', 
      status: 'approved', 
      coverArt: '/api/placeholder/300/300',
      uploadedAt: '2023-05-20T09:15:00Z',
      duration: 198,
      playCount: 18234,
      likes: 943,
      comments: 31,
      reports: 0,
      audioUrl: 'https://example.com/audio.mp3'
    },
    { 
      id: 'track-3', 
      title: 'Urban Jungle', 
      artist: 'City Beats', 
      artistId: 'user-12',
      uploadedBy: 'creator03',
      uploaderId: 'user-5',
      genre: 'hiphop', 
      status: 'pending', 
      coverArt: '/api/placeholder/300/300',
      uploadedAt: '2023-06-28T11:45:00Z',
      duration: 187,
      playCount: 0,
      likes: 0,
      comments: 0,
      reports: 0,
      audioUrl: 'https://example.com/audio.mp3'
    },
    { 
      id: 'track-4', 
      title: 'Acoustic Dreams', 
      artist: 'Guitar Master', 
      artistId: 'user-13',
      uploadedBy: 'creator04',
      uploaderId: 'user-6',
      genre: 'folk', 
      status: 'pending', 
      coverArt: '/api/placeholder/300/300',
      uploadedAt: '2023-06-26T16:20:00Z',
      duration: 243,
      playCount: 0,
      likes: 0,
      comments: 0,
      reports: 0,
      audioUrl: 'https://example.com/audio.mp3'
    },
    { 
      id: 'track-5', 
      title: 'Copyright Violation', 
      artist: 'Unknown Artist', 
      artistId: 'user-14',
      uploadedBy: 'creator05',
      uploaderId: 'user-7',
      genre: 'pop', 
      status: 'rejected', 
      coverArt: '/api/placeholder/300/300',
      uploadedAt: '2023-06-10T13:10:00Z',
      duration: 195,
      playCount: 0,
      likes: 0,
      comments: 0,
      reports: 2,
      audioUrl: 'https://example.com/audio.mp3'
    },
    { 
      id: 'track-6', 
      title: 'Jazz Improv', 
      artist: 'Saxophone King', 
      artistId: 'user-15',
      uploadedBy: 'creator06',
      uploaderId: 'user-8',
      genre: 'jazz', 
      status: 'flagged', 
      coverArt: '/api/placeholder/300/300',
      uploadedAt: '2023-06-05T10:05:00Z',
      duration: 312,
      playCount: 5467,
      likes: 276,
      comments: 14,
      reports: 3,
      audioUrl: 'https://example.com/audio.mp3'
    },
    { 
      id: 'track-7', 
      title: 'Classical Morning', 
      artist: 'Piano Virtuoso', 
      artistId: 'user-16',
      uploadedBy: 'creator07',
      uploaderId: 'user-9',
      genre: 'classical', 
      status: 'approved', 
      coverArt: '/api/placeholder/300/300',
      uploadedAt: '2023-05-15T08:30:00Z',
      duration: 267,
      playCount: 9872,
      likes: 542,
      comments: 27,
      reports: 0,
      audioUrl: 'https://example.com/audio.mp3'
    },
  ];

  const genres = [
    { id: 'all', name: 'All Genres' },
    { id: 'pop', name: 'Pop' },
    { id: 'rock', name: 'Rock' },
    { id: 'hiphop', name: 'Hip Hop' },
    { id: 'electronic', name: 'Electronic' },
    { id: 'jazz', name: 'Jazz' },
    { id: 'classical', name: 'Classical' },
    { id: 'folk', name: 'Folk' },
  ];

  const statuses = [
    { id: 'all', name: 'All Statuses' },
    { id: 'approved', name: 'Approved' },
    { id: 'pending', name: 'Pending' },
    { id: 'rejected', name: 'Rejected' },
    { id: 'flagged', name: 'Flagged' },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTracks(mockTracks);
      setFilteredTracks(mockTracks);
      setTotalPages(Math.ceil(mockTracks.length / 10));
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filter tracks based on search, genre, and status
    let results = [...tracks];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(track => 
        track.title.toLowerCase().includes(query) || 
        track.artist.toLowerCase().includes(query) ||
        track.uploadedBy.toLowerCase().includes(query)
      );
    }
    
    if (selectedGenre !== 'all') {
      results = results.filter(track => track.genre === selectedGenre);
    }
    
    if (selectedStatus !== 'all') {
      results = results.filter(track => track.status === selectedStatus);
    }
    
    setFilteredTracks(results);
    setTotalPages(Math.ceil(results.length / 10));
    setCurrentPage(1);
  }, [searchQuery, selectedGenre, selectedStatus, tracks]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handlePlayClick = (track) => {
    if (currentTrack && currentTrack.id === track.id) {
      togglePlay();
    } else {
      playTrack(track);
    }
  };

  const handleApproveTrack = (trackId) => {
    // In a real app, this would make an API call
    setTracks(prev => 
      prev.map(track => 
        track.id === trackId 
          ? { ...track, status: 'approved' } 
          : track
      )
    );
  };

  const handleRejectTrack = (trackId) => {
    // In a real app, this would make an API call
    setTracks(prev => 
      prev.map(track => 
        track.id === trackId 
          ? { ...track, status: 'rejected' } 
          : track
      )
    );
  };

  const handleDeleteTrack = (trackId) => {
    // In a real app, this would make an API call
    setTracks(prev => prev.filter(track => track.id !== trackId));
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="bg-green-500 bg-opacity-20 text-green-500 px-2 py-1 rounded text-xs">Approved</span>;
      case 'pending':
        return <span className="bg-yellow-500 bg-opacity-20 text-yellow-500 px-2 py-1 rounded text-xs">Pending</span>;
      case 'rejected':
        return <span className="bg-red-500 bg-opacity-20 text-red-500 px-2 py-1 rounded text-xs">Rejected</span>;
      case 'flagged':
        return <span className="bg-orange-500 bg-opacity-20 text-orange-500 px-2 py-1 rounded text-xs">Flagged</span>;
      default:
        return <span className="bg-gray-500 bg-opacity-20 text-gray-500 px-2 py-1 rounded text-xs">{status}</span>;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-spotify-white">Track Management</h1>
          <p className="text-spotify-light mt-1">Approve, reject, and manage tracks</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <button
            onClick={toggleFilters}
            className="bg-spotify-light-gray bg-opacity-30 px-4 py-2 rounded-full text-sm text-spotify-white flex items-center"
          >
            <FilterIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div 
          className="bg-spotify-dark-gray rounded-lg p-4 mb-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <form 
              onSubmit={handleSearch}
              className="md:col-span-1"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search tracks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 rounded-md
                            bg-spotify-light-gray text-spotify-white
                            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-spotify-green"
                />
              </div>
            </form>
            
            <div>
              <select
                value={selectedStatus}
                onChange={handleStatusChange}
                className="block w-full px-3 py-2 rounded-md
                          bg-spotify-light-gray text-spotify-white
                          focus:outline-none focus:ring-2 focus:ring-spotify-green"
              >
                {statuses.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
            </div>
            
            <div>
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
          </div>
        </motion.div>
      )}

      {/* Tracks table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
        </div>
      ) : filteredTracks.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-spotify-dark-gray rounded-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-spotify-light-gray bg-opacity-30 border-b border-spotify-light-gray border-opacity-30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-spotify-light uppercase tracking-wider">Track</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-spotify-light uppercase tracking-wider">Uploader</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-spotify-light uppercase tracking-wider">Genre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-spotify-light uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-spotify-light uppercase tracking-wider">Stats</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-spotify-light uppercase tracking-wider">Uploaded</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-spotify-light uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-spotify-light-gray divide-opacity-20">
                {filteredTracks.map(track => {
                  const isCurrentlyPlaying = currentTrack && currentTrack.id === track.id && isPlaying;
                  
                  return (
                    <tr key={track.id} className="hover:bg-spotify-light-gray hover:bg-opacity-10">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            <img className="h-10 w-10 rounded" src={track.coverArt} alt={track.title} />
                            <button
                              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 rounded"
                              onClick={() => handlePlayClick(track)}
                            >
                              {isCurrentlyPlaying ? (
                                <PauseIcon className="h-5 w-5 text-white" />
                              ) : (
                                <PlayIcon className="h-5 w-5 text-white" />
                              )}
                            </button>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-spotify-white">{track.title}</div>
                            <div className="text-sm text-spotify-light">{track.artist}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-spotify-white">{track.uploadedBy}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-spotify-white capitalize">{track.genre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(track.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-spotify-white">{track.playCount} plays</div>
                        <div className="text-sm text-spotify-white">{track.likes} likes</div>
                        <div className="text-xs text-spotify-light">{formatDuration(track.duration)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-spotify-light">
                        {formatDate(track.uploadedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {track.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveTrack(track.id)}
                                className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                                title="Approve"
                              >
                                <CheckCircleIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleRejectTrack(track.id)}
                                className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                                title="Reject"
                              >
                                <XCircleIcon className="h-5 w-5" />
                              </button>
                            </>
                          )}
                          {track.status === 'flagged' && (
                            <>
                              <button
                                onClick={() => handleApproveTrack(track.id)}
                                className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                                title="Approve"
                              >
                                <CheckCircleIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleRejectTrack(track.id)}
                                className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                                title="Reject"
                              >
                                <XCircleIcon className="h-5 w-5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteTrack(track.id)}
                            className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-3 flex items-center justify-between border-t border-spotify-light-gray border-opacity-30">
            <div className="text-sm text-spotify-light">
              Showing {filteredTracks.length > 0 ? 1 : 0} to {Math.min(filteredTracks.length, 10)} of {filteredTracks.length} tracks
            </div>
            <div className="flex space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="bg-spotify-light-gray bg-opacity-30 px-3 py-1 rounded text-sm text-spotify-white disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="bg-spotify-light-gray bg-opacity-30 px-3 py-1 rounded text-sm text-spotify-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-12 bg-spotify-dark-gray rounded-lg">
          <MusicNoteIcon className="h-16 w-16 text-spotify-light mx-auto mb-4" />
          <h2 className="text-xl font-bold text-spotify-white mb-2">No tracks found</h2>
          <p className="text-spotify-light mb-4">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedGenre('all');
              setSelectedStatus('all');
            }}
            className="bg-spotify-green text-black px-4 py-2 rounded-full text-sm font-medium"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminTrackManagement;