
// src/components/playlists/PlaylistList.jsx
import React from 'react';
import PlaylistCard from './PlaylistCard';

const PlaylistList = ({ playlists, title }) => {
  if (!playlists || playlists.length === 0) {
    return (
      <div className="text-spotify-light text-center py-8">
        No playlists available.
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h2 className="text-2xl font-bold text-spotify-white mb-4">{title}</h2>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {playlists.map(playlist => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>
    </div>
  );
};

export default PlaylistList;
