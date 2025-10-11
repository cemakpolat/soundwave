// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // if (loading) {
  //   return <div className="flex items-center justify-center h-screen bg-spotify-black">
  //     <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-spotify-green"></div>
  //   </div>;
  // }

  if (!currentUser) {
    // Redirect to login page but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;