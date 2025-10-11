// src/context/NotificationContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { getNotifications } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    } else {
      // Reset notifications when user logs out
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [currentUser]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getNotifications();
      setNotifications(response);
      
      // Count unread notifications
      const unread = response.filter(notification => !notification.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      setError('Failed to load notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      // Optimistically update UI
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // API call would go here in a real app
      // await markNotificationAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Revert optimistic update if API call fails
      fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    try {
      // Optimistically update UI
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      setUnreadCount(0);
      
      // API call would go here in a real app
      // await markAllNotificationsAsRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Revert optimistic update if API call fails
      fetchNotifications();
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export default NotificationProvider;