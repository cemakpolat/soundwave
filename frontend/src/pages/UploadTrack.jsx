// src/pages/UploadTrack.jsx
import React from 'react';
import UploadTrackForm from '../components/tracks/UploadTrackForm';
import { useAuth } from '../hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { PlusIcon, UploadIcon } from '@heroicons/react/outline';

const UploadTrack = () => {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-spotify-white">Upload Track</h1>
        <Link 
          to="/creator/dashboard" 
          className="text-sm text-spotify-green hover:underline flex items-center"
        >
          <span className="mr-1">View Creator Dashboard</span>
        </Link>
      </div>
      
      <p className="text-spotify-light mb-6">
        Share your music with the world. Upload high-quality audio files and provide details to help listeners discover your tracks.
      </p>

      <UploadTrackForm />
    </div>
  );
};

export default UploadTrack;