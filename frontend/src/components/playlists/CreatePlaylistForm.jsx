
// src/components/playlists/CreatePlaylistForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPlaylist } from '../../services/api';
import { motion } from 'framer-motion';
import { CloudUploadIcon, MusicNoteIcon } from '@heroicons/react/outline';

const CreatePlaylistForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setError('Playlist name is required');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('isPrivate', isPrivate);
      
      if (coverImage) {
        formData.append('coverArt', coverImage);
      }

      const response = await createPlaylist(formData);
      
      // Navigate to the new playlist page
      navigate(`/playlist/${response.id}`);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create playlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="max-w-2xl mx-auto p-6 bg-spotify-dark-gray rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-spotify-white mb-6">Create Playlist</h2>

      {error && (
        <div className="bg-red-500 bg-opacity-20 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-spotify-light mb-2">
                Playlist Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-spotify-light-gray text-spotify-white rounded
                           focus:outline-none focus:ring-2 focus:ring-spotify-green"
                placeholder="Give your playlist a name"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-spotify-light mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 bg-spotify-light-gray text-spotify-white rounded
                           focus:outline-none focus:ring-2 focus:ring-spotify-green"
                placeholder="Tell us about your playlist"
              />
            </div>

            <div className="flex items-center">
              <input
                id="isPrivate"
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="h-4 w-4 text-spotify-green bg-spotify-light-gray rounded border-none
                           focus:ring-spotify-green focus:ring-offset-spotify-black"
              />
              <label htmlFor="isPrivate" className="ml-2 block text-sm text-spotify-light">
                Make playlist private
              </label>
            </div>
          </div>

          <div>
            {/* Cover image upload */}
            <label htmlFor="coverArt" className="block text-sm font-medium text-spotify-light mb-2">
              Cover Image
            </label>
            <div className="relative border-2 border-dashed border-spotify-light border-opacity-50 rounded-lg p-6 flex flex-col items-center justify-center h-64">
              {coverPreview ? (
                <div className="text-center">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="h-40 w-40 object-cover rounded-md mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImage(null);
                      setCoverPreview('');
                    }}
                    className="mt-3 text-xs text-spotify-green hover:text-spotify-white"
                  >
                    Change image
                  </button>
                </div>
              ) : (
                <>
                  <CloudUploadIcon className="h-12 w-12 text-spotify-light mb-2" />
                  <p className="text-spotify-light text-sm text-center">
                    Drag & drop your cover image here or click to browse
                  </p>
                  <p className="text-xs text-spotify-light text-center mt-1">
                    JPG or PNG (min 1000x1000, max 5MB)
                  </p>
                </>
              )}
              <input
                id="coverArt"
                type="file"
                onChange={handleCoverChange}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="py-3 px-8 rounded-full
                     bg-spotify-green text-black font-medium
                     hover:bg-opacity-90 focus:outline-none focus:ring-2 
                     focus:ring-offset-2 focus:ring-spotify-green
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create Playlist'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreatePlaylistForm;

