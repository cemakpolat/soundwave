// src/components/social/CommentSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const CommentSection = ({ trackId, comments }) => {
  const { currentUser } = useAuth();

  // Helper to format date
  const formatCommentDate = (dateString) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
      return commentDate.toLocaleDateString();
    }
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-6 text-spotify-light">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex">
          <div className="mr-3 flex-shrink-0">
            <Link to={`/profile/${comment.userId}`}>
              <img
                src={comment.userAvatar || '/default-user.jpg'}
                alt={comment.username}
                className="h-10 w-10 rounded-full object-cover"
              />
            </Link>
          </div>
          <div className="flex-1 bg-spotify-light-gray bg-opacity-20 rounded-lg p-3">
            <div className="flex justify-between items-start mb-1">
              <Link 
                to={`/profile/${comment.userId}`}
                className="font-medium text-spotify-white hover:underline"
              >
                {comment.username}
              </Link>
              <span className="text-xs text-spotify-light">
                {formatCommentDate(comment.createdAt)}
              </span>
            </div>
            <p className="text-spotify-white text-sm">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;

