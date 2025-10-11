// src/components/auth/LoginForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const user = await login(email, password);

      // Role-based navigation
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'creator') {
        navigate('/creator/dashboard');
      } else {
        navigate('/'); // listener or default
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="max-w-md mx-auto p-8 bg-spotify-dark-gray rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-spotify-white">Sign in to SoundWave</h2>
      </div>

      {error && (
        <div className="bg-red-500 bg-opacity-20 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-spotify-light mb-2">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-spotify-light-gray text-spotify-white rounded
                       focus:outline-none focus:ring-2 focus:ring-spotify-green"
            placeholder="name@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-spotify-light mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-spotify-light-gray text-spotify-white rounded
                       focus:outline-none focus:ring-2 focus:ring-spotify-green"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-spotify-green bg-spotify-light-gray rounded border-none
                         focus:ring-spotify-green focus:ring-offset-spotify-black"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-spotify-light">
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="text-spotify-green hover:text-spotify-white"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 rounded-full
                       bg-spotify-green text-black font-medium
                       hover:bg-opacity-90 focus:outline-none focus:ring-2 
                       focus:ring-offset-2 focus:ring-spotify-green
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-spotify-light">
          Don't have an account?{' '}
          <Link to="/register" className="text-spotify-green hover:text-spotify-white">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginForm;

