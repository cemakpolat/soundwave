// src/components/social/FollowButton.jsx
import React, { useState } from 'react';
import { followUser } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const FollowButton = ({ userId, isFollowing, onFollowChange }) => {
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleFollow = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    try {
      setLoading(true);
      await followUser(userId);
      setFollowing(!following);
      
      if (onFollowChange) {
        onFollowChange(!following);
      }
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`py-2 px-6 rounded-full font-medium transition-colors
                ${following 
                  ? 'border border-spotify-light text-spotify-white hover:border-spotify-white' 
                  : 'bg-spotify-green text-black hover:bg-opacity-90'}
                disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? 'Processing...' : following ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;

