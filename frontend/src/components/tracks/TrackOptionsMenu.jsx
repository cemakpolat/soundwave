// src/components/tracks/TrackOptionsMenu.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { deleteTrack } from '../../services/api';
import {
  DotsVerticalIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  PlusIcon,
  DownloadIcon
} from '@heroicons/react/outline';
import TrackEditModal from './TrackEditModal';
import ShareModal from './ShareModal';

const TrackOptionsMenu = ({ track, onUpdate, onDelete }) => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef(null);

  const isOwner = currentUser && (
    currentUser.id === track.userId ||
    currentUser.id === track.User?.id ||
    currentUser.role === 'admin'
  );

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEdit = () => {
    setIsOpen(false);
    setShowEditModal(true);
  };

  const handleShare = () => {
    setIsOpen(false);
    setShowShareModal(true);
  };

  const handleDelete = () => {
    setIsOpen(false);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTrack(track.id);
      setShowDeleteConfirm(false);
      if (onDelete) onDelete(track.id);
    } catch (error) {
      console.error('Error deleting track:', error);
      alert('Failed to delete track');
    }
  };

  const handleAddToPlaylist = () => {
    setIsOpen(false);
    // TODO: Implement add to playlist
    alert('Add to playlist feature coming soon!');
  };

  const handleDownload = () => {
    setIsOpen(false);
    if (track.audioUrl) {
      window.open(track.audioUrl, '_blank');
    }
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="text-spotify-light hover:text-spotify-white p-2 rounded-full
                     hover:bg-spotify-light-gray hover:bg-opacity-20 transition-colors"
        >
          <DotsVerticalIcon className="h-5 w-5" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-spotify-dark-gray rounded-md shadow-lg
                         border border-spotify-light-gray border-opacity-20 z-50">
            <div className="py-1">
              {/* Owner options */}
              {isOwner && (
                <>
                  <button
                    onClick={handleEdit}
                    className="w-full text-left px-4 py-2 text-sm text-spotify-white
                               hover:bg-spotify-light-gray flex items-center space-x-3"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>Edit Track</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 text-sm text-red-400
                               hover:bg-spotify-light-gray flex items-center space-x-3"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>Delete Track</span>
                  </button>
                  <div className="border-t border-spotify-light-gray border-opacity-20 my-1"></div>
                </>
              )}

              {/* Common options */}
              <button
                onClick={handleAddToPlaylist}
                className="w-full text-left px-4 py-2 text-sm text-spotify-white
                           hover:bg-spotify-light-gray flex items-center space-x-3"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add to Playlist</span>
              </button>

              <button
                onClick={handleShare}
                className="w-full text-left px-4 py-2 text-sm text-spotify-white
                           hover:bg-spotify-light-gray flex items-center space-x-3"
              >
                <ShareIcon className="h-4 w-4" />
                <span>Share</span>
              </button>

              {isOwner && track.audioUrl && (
                <button
                  onClick={handleDownload}
                  className="w-full text-left px-4 py-2 text-sm text-spotify-white
                             hover:bg-spotify-light-gray flex items-center space-x-3"
                >
                  <DownloadIcon className="h-4 w-4" />
                  <span>Download</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <TrackEditModal
        track={track}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={(updatedTrack) => {
          if (onUpdate) onUpdate(updatedTrack);
        }}
      />

      {/* Share Modal */}
      <ShareModal
        track={track}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
          <div className="bg-spotify-dark-gray rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-spotify-white mb-4">Delete Track?</h2>
            <p className="text-spotify-light mb-6">
              Are you sure you want to delete "{track.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2 rounded-full text-spotify-white border border-spotify-light
                           hover:bg-spotify-light-gray transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 rounded-full bg-red-500 text-white font-medium
                           hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TrackOptionsMenu;
