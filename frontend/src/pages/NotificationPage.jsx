// src/pages/NotificationsPage.jsx
import React, { useState, useEffect } from 'react';
import { getNotifications } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Link, Navigate } from 'react-router-dom';
import { BellIcon, UserIcon, MusicNoteIcon } from '@heroicons/react/outline';
import { motion } from 'framer-motion';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await getNotifications();
        setNotifications(response);
      } catch (err) {
        setError('Failed to load notifications. Please try again.');
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Helper to format date
  const formatNotificationDate = (dateString) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - notificationDate) / 1000);

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
      return notificationDate.toLocaleDateString();
    }
  };

  // Helper to get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'follow':
        return <UserIcon className="h-5 w-5" />;
      case 'like':
      case 'comment':
        return <MusicNoteIcon className="h-5 w-5" />;
      default:
        return <BellIcon className="h-5 w-5" />;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-spotify-white mb-6">Notifications</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
        </div>
      ) : error ? (
        <div className="text-center text-spotify-light py-8">
          <p className="text-xl">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-spotify-green hover:underline mt-4 inline-block"
          >
            Retry
          </button>
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              className={`p-4 rounded-lg ${notification.isRead ? 'bg-spotify-dark-gray' : 'bg-spotify-light-gray'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  {notification.senderImage ? (
                    <img 
                      src={notification.senderImage} 
                      alt={notification.senderName} 
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-spotify-light flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-spotify-white">
                      {notification.senderName || 'Someone'}
                    </span>
                    <span className="text-xs text-spotify-light">
                      {formatNotificationDate(notification.createdAt)}
                    </span>
                  </div>
                  <p className="text-spotify-light text-sm">{notification.message}</p>
                  
                  {notification.link && (
                    <Link 
                      to={notification.link}
                      className="text-spotify-green text-sm hover:underline mt-1 inline-block"
                    >
                      View
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-spotify-dark-gray rounded-lg">
          <BellIcon className="h-16 w-16 mx-auto mb-4 text-spotify-light" />
          <h3 className="text-xl font-bold text-spotify-white mb-2">No notifications yet</h3>
          <p className="text-spotify-light">
            We'll let you know when something interesting happens
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;