// src/components/tracks/ShareModal.jsx
import React, { useState } from 'react';
import { XIcon, ClipboardCopyIcon, CheckIcon } from '@heroicons/react/outline';
import { motion, AnimatePresence } from 'framer-motion';

const ShareModal = ({ track, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!track) return null;

  const shareUrl = `${window.location.origin}/track/${track.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    const text = `Check out "${track.title}" by ${track.User?.username || track.artist} on SoundWave!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70"
          onClick={onClose}
        >
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

            <h2 className="text-2xl font-bold text-spotify-white mb-6">Share Track</h2>

            {/* Track info */}
            <div className="flex items-center mb-6 p-4 bg-spotify-light-gray rounded-lg">
              <img
                src={track.coverArt || '/default-cover.jpg'}
                alt={track.title}
                className="w-16 h-16 object-cover rounded mr-4"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-spotify-white font-medium truncate">{track.title}</h3>
                <p className="text-sm text-spotify-light truncate">
                  {track.User?.username || track.artist}
                </p>
              </div>
            </div>

            {/* Copy link */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-spotify-light mb-2">
                Track Link
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-spotify-light-gray text-spotify-white rounded
                             focus:outline-none focus:ring-2 focus:ring-spotify-green"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-3 bg-spotify-green text-black rounded hover:bg-opacity-90
                             flex items-center space-x-2"
                >
                  {copied ? (
                    <>
                      <CheckIcon className="h-5 w-5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <ClipboardCopyIcon className="h-5 w-5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Social media buttons */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-spotify-light mb-3">Share on Social Media</p>

              <button
                onClick={shareToTwitter}
                className="w-full px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600
                           flex items-center justify-center space-x-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
                <span>Share on Twitter</span>
              </button>

              <button
                onClick={shareToFacebook}
                className="w-full px-4 py-3 bg-blue-700 text-white rounded hover:bg-blue-800
                           flex items-center justify-center space-x-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Share on Facebook</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
