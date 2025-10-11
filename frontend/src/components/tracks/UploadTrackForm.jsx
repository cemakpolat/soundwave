// src/components/tracks/UploadTrackForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadTrack } from '../../services/api';
import { motion } from 'framer-motion';
import { CloudUploadIcon } from '@heroicons/react/outline';

const UploadTrackForm = () => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
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

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);

      // Calculate duration
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.addEventListener('loadedmetadata', () => {
        setAudioDuration(Math.floor(audio.duration));
        URL.revokeObjectURL(audio.src); // Clean up
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !audioFile) {
      setError('Title and audio file are required');
      return;
    }

    if (!audioDuration || audioDuration <= 0) {
      setError('Please wait for the audio file to load');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('title', title);
      formData.append('artist', artist);
      formData.append('genre', genre);
      formData.append('description', description);
      formData.append('audio', audioFile);
      formData.append('duration', audioDuration);
      formData.append('isPrivate', isPrivate);

      if (coverImage) {
        formData.append('coverImage', coverImage);
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      const response = await uploadTrack(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Navigate to the track page
      setTimeout(() => {
        navigate(`/track/${response.id}`);
      }, 1000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="max-w-3xl mx-auto p-6 bg-spotify-dark-gray rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-spotify-white mb-6">Upload Track</h2>

      {error && (
        <div className="bg-red-500 bg-opacity-20 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-spotify-light mb-2">
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-spotify-light-gray text-spotify-white rounded
                           focus:outline-none focus:ring-2 focus:ring-spotify-green"
                placeholder="Track title"
                required
              />
            </div>

            <div>
              <label htmlFor="artist" className="block text-sm font-medium text-spotify-light mb-2">
                Artist
              </label>
              <input
                id="artist"
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full px-4 py-3 bg-spotify-light-gray text-spotify-white rounded
                           focus:outline-none focus:ring-2 focus:ring-spotify-green"
                placeholder="Artist name"
              />
            </div>

            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-spotify-light mb-2">
                Genre
              </label>
              <select
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
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
                <option value="other">Other</option>
              </select>
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
                placeholder="Tell listeners about your track"
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
                Make track private
              </label>
            </div>
          </div>

          <div className="space-y-4">
            {/* Audio file upload */}
            <div>
              <label htmlFor="audio" className="block text-sm font-medium text-spotify-light mb-2">
                Audio File *
              </label>
              <div className="relative border-2 border-dashed border-spotify-light border-opacity-50 rounded-lg p-6 flex flex-col items-center justify-center space-y-2">
                {audioFile ? (
                  <div className="text-spotify-white text-center">
                    <p className="font-medium truncate max-w-xs">{audioFile.name}</p>
                    <p className="text-sm text-spotify-light">{(audioFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    {audioDuration > 0 && (
                      <p className="text-sm text-spotify-green">
                        Duration: {Math.floor(audioDuration / 60)}:{String(audioDuration % 60).padStart(2, '0')}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setAudioFile(null);
                        setAudioDuration(0);
                      }}
                      className="mt-2 text-xs text-spotify-green hover:text-spotify-white"
                    >
                      Change file
                    </button>
                  </div>
                ) : (
                  <>
                    <CloudUploadIcon className="h-10 w-10 text-spotify-light" />
                    <p className="text-spotify-light text-sm text-center">
                      Drag & drop your audio file here or click to browse
                    </p>
                    <p className="text-xs text-spotify-light text-center">
                      MP3, WAV, FLAC, AIFF or OGG (max 50MB)
                    </p>
                  </>
                )}
                <input
                  id="audio"
                  type="file"
                  onChange={handleAudioChange}
                  accept="audio/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Cover image upload */}
            <div>
              <label htmlFor="coverArt" className="block text-sm font-medium text-spotify-light mb-2">
                Cover Art
              </label>
              <div className="relative border-2 border-dashed border-spotify-light border-opacity-50 rounded-lg p-6 flex flex-col items-center justify-center space-y-2">
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
                      className="mt-2 text-xs text-spotify-green hover:text-spotify-white"
                    >
                      Change image
                    </button>
                  </div>
                ) : (
                  <>
                    <CloudUploadIcon className="h-10 w-10 text-spotify-light" />
                    <p className="text-spotify-light text-sm text-center">
                      Drag & drop your cover image here or click to browse
                    </p>
                    <p className="text-xs text-spotify-light text-center">
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
        </div>

        {isLoading && (
          <div className="mt-4">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-spotify-green">
                    Uploading...
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-spotify-green">
                    {uploadProgress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-spotify-light-gray">
                <div 
                  style={{ width: `${uploadProgress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-spotify-green"
                ></div>
              </div>
            </div>
          </div>
        )}

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
            {isLoading ? 'Uploading...' : 'Upload Track'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default UploadTrackForm;