// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useRef } from 'react';
import { loginUser, registerUser } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Store a callback ref for stopPlayback - will be set by App.js
  const stopPlaybackRef = useRef(null);

  console.log("AuthContext: Initial currentUser state:", currentUser); // <--- ADD THIS

  useEffect(() => {
    // Check if user is logged in (via token in localStorage)
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      const parsedUserData = JSON.parse(userData);
      setCurrentUser(parsedUserData);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await loginUser({ email, password });
      localStorage.setItem('token', response.token);
      // **Important:** Include the role in the user data stored in localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
      setCurrentUser(response.user);
      return response.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await registerUser(userData);
      localStorage.setItem('token', response.token);
      // **Important:** Include the role in the user data stored in localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
      setCurrentUser(response.user);
      return response.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Stop any playing music before logging out
    if (stopPlaybackRef.current) {
      stopPlaybackRef.current();
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const setStopPlaybackCallback = (callback) => {
    stopPlaybackRef.current = callback;
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
    setStopPlaybackCallback,
    setCurrentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};