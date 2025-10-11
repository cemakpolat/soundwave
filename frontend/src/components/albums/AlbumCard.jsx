// src/components/albums/AlbumCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { PlayIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';

const AlbumCard = ({ album }) => {
  // Construct cover image URL
  const getCoverUrl = () => {
    if (!album.coverImageKey) return '/default-album.jpg';
    if (album.coverImageKey.startsWith('http')) return album.coverImageKey;
    if (album.coverImageKey.startsWith('/uploads')) {
      return `http://localhost:5001${album.coverImageKey}`;
    }
    return `/default-album.jpg`;
  };

  const trackCount = album.tracks?.length || 0;

  return (
    <Link to={`/album/${album.id}`}>
      <motion.div
        className="bg-spotify-dark-gray rounded-md p-4 hover:bg-spotify-light-gray transition-all duration-200 group cursor-pointer"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative mb-3">
          <img
            src={getCoverUrl()}
            alt={album.title}
            className="w-full aspect-square object-cover rounded-md shadow-lg"
            onError={(e) => {
              e.target.src = '/default-album.jpg';
            }}
          />

          {/* Play Button - appears on hover */}
          <button
            className="absolute bottom-3 right-3 bg-spotify-green text-black p-3 rounded-full
                       shadow-lg opacity-0 group-hover:opacity-100 transition-opacity
                       hover:scale-105 transform duration-200"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Play first track of album
            }}
          >
            <PlayIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-2">
          <h3 className="text-spotify-white font-semibold truncate mb-1">
            {album.title}
          </h3>
          <div className="text-sm text-spotify-light">
            <p className="truncate">
              {album.User?.username || 'Unknown Artist'}
            </p>
            <p className="text-xs mt-1">
              {trackCount} {trackCount === 1 ? 'track' : 'tracks'}
              {album.releaseDate && ` • ${new Date(album.releaseDate).getFullYear()}`}
            </p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default AlbumCard;
