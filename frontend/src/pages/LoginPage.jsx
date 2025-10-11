
// src/pages/Login.jsx
import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-spotify-black">
      <LoginForm />
    </div>
  );
};

export default Login;

