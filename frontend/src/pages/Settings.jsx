// src/pages/Settings.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserCircleIcon, CloudUploadIcon } from '@heroicons/react/outline';

const Settings = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    bio: currentUser?.bio || '',
    location: currentUser?.location || '',
    twitter: currentUser?.social_links?.twitter || '',
    instagram: currentUser?.social_links?.instagram || '',
    website: currentUser?.social_links?.website || ''
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(currentUser?.profileImage || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('email', formData.email);
      data.append('bio', formData.bio);
      data.append('location', formData.location);
      data.append('social_links', JSON.stringify({
        twitter: formData.twitter,
        instagram: formData.instagram,
        website: formData.website
      }));

      if (profilePicture) {
        data.append('profilePicture', profilePicture);
        console.log('Profile picture attached:', profilePicture.name);
      }

      console.log('Submitting profile update for user:', currentUser.id);
      const updatedUser = await updateUser(currentUser.id, data);
      console.log('Received updated user:', updatedUser);

      // Update local storage and context
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const newUser = { ...storedUser, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(newUser));
      setCurrentUser(newUser);

      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        navigate(`/profile/${currentUser.id}`);
      }, 1500);

    } catch (err) {
      console.error('Profile update error:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
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
        <h1 className="text-3xl font-bold text-spotify-white mb-6">Profile Settings</h1>

        {error && (
          <div className="bg-red-500 bg-opacity-20 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500 bg-opacity-20 text-green-200 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="bg-spotify-dark-gray rounded-lg p-6">
            <h2 className="text-xl font-bold text-spotify-white mb-4">Profile Picture</h2>
            <div className="flex items-center space-x-6">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-spotify-light-gray flex items-center justify-center">
                {profilePreview ? (
                  <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserCircleIcon className="w-20 h-20 text-spotify-light" />
                )}
              </div>
              <div>
                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-spotify-green text-black rounded-full hover:bg-opacity-90">
                  <CloudUploadIcon className="w-5 h-5 mr-2" />
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-spotify-light mt-2">JPG or PNG (max 5MB)</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-spotify-dark-gray rounded-lg p-6">
            <h2 className="text-xl font-bold text-spotify-white mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-spotify-light mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-spotify-light-gray text-spotify-white rounded
                             focus:outline-none focus:ring-2 focus:ring-spotify-green"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-spotify-light mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-spotify-light-gray text-spotify-white rounded
                             focus:outline-none focus:ring-2 focus:ring-spotify-green"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-spotify-light mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-spotify-light-gray text-spotify-white rounded
                             focus:outline-none focus:ring-2 focus:ring-spotify-green"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-spotify-light mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-spotify-light-gray text-spotify-white rounded
                             focus:outline-none focus:ring-2 focus:ring-spotify-green"
                  placeholder="City, Country"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-spotify-dark-gray rounded-lg p-6">
            <h2 className="text-xl font-bold text-spotify-white mb-4">Social Links</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-spotify-light mb-2">
                  Twitter
                </label>
                <input
                  type="text"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-spotify-light-gray text-spotify-white rounded
                             focus:outline-none focus:ring-2 focus:ring-spotify-green"
                  placeholder="@username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-spotify-light mb-2">
                  Instagram
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-spotify-light-gray text-spotify-white rounded
                             focus:outline-none focus:ring-2 focus:ring-spotify-green"
                  placeholder="@username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-spotify-light mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-spotify-light-gray text-spotify-white rounded
                             focus:outline-none focus:ring-2 focus:ring-spotify-green"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
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
              disabled={isLoading}
              className="px-6 py-3 rounded-full bg-spotify-green text-black font-medium
                         hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Settings;
