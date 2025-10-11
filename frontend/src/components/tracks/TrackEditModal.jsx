// src/components/tracks/TrackEditModal.jsx
import React, { useState } from 'react';
import { updateTrack } from '../../services/api';
import { XIcon } from '@heroicons/react/outline';
import { motion, AnimatePresence } from 'framer-motion';

const TrackEditModal = ({ track, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: track?.title || '',
    description: track?.description || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const updatedTrack = await updateTrack(track.id, formData);
      onUpdate(updatedTrack);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update track');
    } finally {
      setIsLoading(false);
    }
  };

  if (!track) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-spotify-dark-gray rounded-lg max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-spotify-light hover:text-spotify-white"
            >
              <XIcon className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold text-spotify-white mb-6">Edit Track</h2>

            {error && (
              <div className="bg-red-500 bg-opacity-20 text-red-200 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Cover Art Preview */}
              <div className="flex justify-center mb-4">
                <img
                  src={track.coverArt || '/default-cover.jpg'}
                  alt={track.title}
                  className="w-32 h-32 object-cover rounded-md"
                />
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-spotify-light mb-2">
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-spotify-light-gray text-spotify-white rounded
                             focus:outline-none focus:ring-2 focus:ring-spotify-green"
                  placeholder="Track title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-spotify-light mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-spotify-light-gray text-spotify-white rounded
                             focus:outline-none focus:ring-2 focus:ring-spotify-green"
                  placeholder="Tell listeners about your track"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 rounded-full text-spotify-white border border-spotify-light
                             hover:bg-spotify-light-gray transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 rounded-full bg-spotify-green text-black font-medium
                             hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TrackEditModal;
