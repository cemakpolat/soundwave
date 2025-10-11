// src/pages/CreateAlbum.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAlbum } from '../services/api';
import { motion } from 'framer-motion';
import { CloudUploadIcon } from '@heroicons/react/outline';

const CreateAlbum = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    releaseDate: new Date().toISOString().split('T')[0]
  });
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
    setIsLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('genre', formData.genre);
      data.append('releaseDate', formData.releaseDate);

      if (coverImage) {
        data.append('cover', coverImage);
      }

      const album = await createAlbum(data);
      navigate(`/album/${album.id}`);
    } catch (err) {
      console.error('Error creating album:', err);
      setError(err.response?.data?.message || 'Failed to create album. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-spotify-white mb-6">Create New Album</h1>

        {error && (
          <div className="bg-red-500 bg-opacity-20 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image */}
          <div className="bg-spotify-dark-gray rounded-lg p-6">
            <h2 className="text-xl font-bold text-spotify-white mb-4">Album Cover</h2>
            <div className="flex items-start space-x-6">
              <div className="w-48 h-48 rounded-lg overflow-hidden bg-spotify-light-gray flex items-center justify-center flex-shrink-0">
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                ) : (
                  <CloudUploadIcon className="w-16 h-16 text-spotify-light" />
                )}
              </div>
              <div className="flex-1">
                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-spotify-green text-black rounded-full hover:bg-opacity-90">
                  <CloudUploadIcon className="w-5 h-5 mr-2" />
                  Choose Cover Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-spotify-light mt-2">
                  Recommended: Square image, at least 1000x1000 pixels<br />
                  JPG or PNG (max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Album Details */}
          <div className="bg-spotify-dark-gray rounded-lg p-6">
            <h2 className="text-xl font-bold text-spotify-white mb-4">Album Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-spotify-light mb-2">
                  Album Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-spotify-light-gray text-spotify-white rounded
                             focus:outline-none focus:ring-2 focus:ring-spotify-green"
                  placeholder="Enter album title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-spotify-light mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-spotify-light-gray text-spotify-white rounded
                             focus:outline-none focus:ring-2 focus:ring-spotify-green"
                  placeholder="Tell listeners about your album..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-spotify-light mb-2">
                    Genre
                  </label>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-spotify-light-gray text-spotify-white rounded
                               focus:outline-none focus:ring-2 focus:ring-spotify-green"
                  >
                    <option value="">Select genre</option>
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

                <div>
                  <label className="block text-sm font-medium text-spotify-light mb-2">
                    Release Date
                  </label>
                  <input
                    type="date"
                    name="releaseDate"
                    value={formData.releaseDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-spotify-light-gray text-spotify-white rounded
                               focus:outline-none focus:ring-2 focus:ring-spotify-green"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-full text-spotify-white border border-spotify-light
                         hover:bg-spotify-light-gray transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.title}
              className="px-6 py-3 rounded-full bg-spotify-green text-black font-medium
                         hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Album'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateAlbum;
