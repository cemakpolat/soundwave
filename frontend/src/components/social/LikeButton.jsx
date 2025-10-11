// src/components/social/LikeButton.jsx
import React from 'react';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid';
import { usePlayer } from '../../hooks/usePlayer';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LikeButton = ({ trackId, isLiked, size = 'medium' }) => {
  const { handleLike } = usePlayer();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const sizeClass = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8'
  };

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    try {
      await handleLike(trackId);
    } catch (error) {
      console.error('Error liking track:', error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="text-spotify-light hover:text-spotify-white focus:outline-none"
      aria-label={isLiked ? 'Unlike' : 'Like'}
    >
      {isLiked ? (
        <HeartIconSolid className={`${sizeClass[size]} text-spotify-green`} />
      ) : (
        <HeartIconOutline className={sizeClass[size]} />
      )}
    </button>
  );
};

export default LikeButton;

