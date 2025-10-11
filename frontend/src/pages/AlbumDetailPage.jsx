// src/pages/AlbumDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAlbumById, deleteAlbum } from '../services/api';
import { usePlayer } from '../hooks/usePlayer';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import {
  PlayIcon,
  PauseIcon,
  DotsHorizontalIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/outline';
import { ClockIcon } from '@heroicons/react/solid';

// Helper to format duration
const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const AlbumDetailPage = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const { playQueue, currentTrack, isPlaying, togglePlay } = usePlayer();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        setLoading(true);
        const data = await getAlbumById(albumId);
        setAlbum(data);
      } catch (err) {
        setError('Failed to load album. Please try again.');
        console.error('Error fetching album:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [albumId]);

  const getCoverUrl = () => {
    if (!album?.coverImageKey) return '/default-album.jpg';
    if (album.coverImageKey.startsWith('http')) return album.coverImageKey;
    if (album.coverImageKey.startsWith('/uploads')) {
      return `http://localhost:5001${album.coverImageKey}`;
    }
    return '/default-album.jpg';
  };

  const handlePlayAlbum = () => {
    if (album?.tracks && album.tracks.length > 0) {
      playQueue(album.tracks, 0);
    }
  };

  const handlePlayTrack = (index) => {
    if (album?.tracks && album.tracks.length > 0) {
      playQueue(album.tracks, index);
    }
  };

  const isOwnAlbum = currentUser && album && currentUser.id === album.userId;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this album? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteAlbum(albumId);
      navigate('/creator/albums');
    } catch (err) {
      console.error('Error deleting album:', err);
      alert('Failed to delete album. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="text-center text-spotify-light py-8">
        <p className="text-xl">{error || 'Album not found'}</p>
        <Link to="/" className="text-spotify-green hover:underline mt-4 inline-block">
          Go back to home
        </Link>
      </div>
    );
  }

  const totalDuration = album.tracks?.reduce((sum, track) => sum + (track.duration || 0), 0) || 0;
  const totalMinutes = Math.floor(totalDuration / 60);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Album Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end mb-8 bg-gradient-to-b from-spotify-light-gray to-spotify-black p-6 rounded-lg">
        <div className="w-56 h-56 flex-shrink-0 mr-0 md:mr-6 mb-4 md:mb-0">
          <img
            src={getCoverUrl()}
            alt={album.title}
            className="w-full h-full object-cover shadow-2xl rounded"
            onError={(e) => {
              e.target.src = '/default-album.jpg';
            }}
          />
        </div>

        <div className="flex flex-col text-center md:text-left">
          <p className="text-sm text-spotify-white uppercase mb-1">Album</p>
          <h1 className="text-4xl md:text-5xl font-bold text-spotify-white mb-2">
            {album.title}
          </h1>
          <div className="flex items-center text-sm flex-wrap justify-center md:justify-start">
            <Link
              to={`/profile/${album.userId}`}
              className="text-spotify-white hover:underline flex items-center"
            >
              {album.User?.username || 'Unknown Artist'}
            </Link>
            <span className="mx-2 text-spotify-light">•</span>
            <span className="text-spotify-light">
              {album.releaseDate && new Date(album.releaseDate).getFullYear()}
            </span>
            <span className="mx-2 text-spotify-light">•</span>
            <span className="text-spotify-light">
              {album.tracks?.length || 0} songs, {totalMinutes} min
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center mb-6 space-x-4">
        <button
          onClick={handlePlayAlbum}
          className="bg-spotify-green text-black rounded-full p-4 hover:scale-105 transition-transform"
        >
          <PlayIcon className="h-8 w-8" />
        </button>

        {isOwnAlbum && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-spotify-light hover:text-spotify-white"
            >
              <DotsHorizontalIcon className="h-6 w-6" />
            </button>

            {showMenu && (
              <div className="absolute top-10 left-0 bg-spotify-dark-gray rounded-md shadow-lg py-2 z-10 min-w-[200px]">
                <Link
                  to={`/creator/albums/${albumId}/edit`}
                  className="flex items-center px-4 py-2 text-sm text-spotify-white hover:bg-spotify-light-gray"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Album
                </Link>
                <Link
                  to={`/creator/albums/${albumId}/add-tracks`}
                  className="flex items-center px-4 py-2 text-sm text-spotify-white hover:bg-spotify-light-gray"
                >
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Add Tracks
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-spotify-light-gray"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete Album
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Track List */}
      <div className="bg-spotify-dark-gray rounded-lg p-6">
        <div className="grid grid-cols-12 gap-4 px-4 mb-4 text-spotify-light text-sm border-b border-spotify-light-gray pb-2">
          <div className="col-span-1">#</div>
          <div className="col-span-6">Title</div>
          <div className="col-span-3">Artist</div>
          <div className="col-span-2 text-right">
            <ClockIcon className="h-5 w-5 inline" />
          </div>
        </div>

        {album.tracks && album.tracks.length > 0 ? (
          <div className="space-y-1">
            {album.tracks
              .sort((a, b) => (a.AlbumTrack?.trackNumber || 0) - (b.AlbumTrack?.trackNumber || 0))
              .map((track, index) => {
                const isCurrentTrack = currentTrack && currentTrack.id === track.id;
                return (
                  <div
                    key={track.id}
                    className="grid grid-cols-12 gap-4 px-4 py-3 rounded hover:bg-spotify-light-gray group cursor-pointer"
                    onClick={() => handlePlayTrack(index)}
                  >
                    <div className="col-span-1 flex items-center">
                      {isCurrentTrack && isPlaying ? (
                        <PauseIcon className="h-5 w-5 text-spotify-green" />
                      ) : (
                        <span className="text-spotify-light group-hover:hidden">
                          {track.AlbumTrack?.trackNumber || index + 1}
                        </span>
                      )}
                      <PlayIcon className="h-5 w-5 text-spotify-white hidden group-hover:block" />
                    </div>
                    <div className="col-span-6 flex items-center">
                      <span className={`truncate ${isCurrentTrack ? 'text-spotify-green' : 'text-spotify-white'}`}>
                        {track.title}
                      </span>
                    </div>
                    <div className="col-span-3 flex items-center">
                      <Link
                        to={`/profile/${track.userId}`}
                        className="text-spotify-light hover:underline truncate"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {track.User?.username || 'Unknown'}
                      </Link>
                    </div>
                    <div className="col-span-2 flex items-center justify-end text-spotify-light">
                      {formatTime(track.duration)}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-spotify-light mb-4">No tracks in this album yet</p>
            {isOwnAlbum && (
              <Link
                to={`/creator/albums/${albumId}/add-tracks`}
                className="inline-block px-6 py-3 rounded-full bg-spotify-green text-black font-medium hover:bg-opacity-90"
              >
                Add Tracks
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Album Info */}
      {album.description && (
        <div className="bg-spotify-dark-gray rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-spotify-white mb-4">About</h2>
          <p className="text-spotify-light">{album.description}</p>
        </div>
      )}
    </motion.div>
  );
};

export default AlbumDetailPage;
