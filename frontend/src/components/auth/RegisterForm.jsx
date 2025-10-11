// src/components/auth/RegisterForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'listener' // default role
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword, role } = formData;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const user = await register({
        username,
        email,
        password,
        role
      });

      // Role-based navigation
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'creator') {
        navigate('/creator/dashboard');
      } else {
        navigate('/'); // listener or default
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
        <h2 className="text-2xl font-bold text-spotify-white">Sign up for SoundWave</h2>
      </div>

      {error && (
        <div className="bg-red-500 bg-opacity-20 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-spotify-light mb-2">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-spotify-light-gray text-spotify-white rounded
                       focus:outline-none focus:ring-2 focus:ring-spotify-green"
            placeholder="Choose a username"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-spotify-light mb-2">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-spotify-light-gray text-spotify-white rounded
                       focus:outline-none focus:ring-2 focus:ring-spotify-green"
            placeholder="name@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-spotify-light mb-2">
            Account Type
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-spotify-light-gray text-spotify-white rounded
                       focus:outline-none focus:ring-2 focus:ring-spotify-green"
            required
          >
            <option value="listener">Listener - Listen to music</option>
            <option value="creator">Creator - Upload and share your music</option>
            <option value="admin">Admin - Manage the platform</option>
          </select>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-spotify-light mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-spotify-light-gray text-spotify-white rounded
                       focus:outline-none focus:ring-2 focus:ring-spotify-green"
            placeholder="••••••••"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-spotify-light mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-spotify-light-gray text-spotify-white rounded
                       focus:outline-none focus:ring-2 focus:ring-spotify-green"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 rounded-full
                       bg-spotify-green text-black font-medium
                       hover:bg-opacity-90 focus:outline-none focus:ring-2 
                       focus:ring-offset-2 focus:ring-spotify-green
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Sign up'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-spotify-light">
          Already have an account?{' '}
          <Link to="/login" className="text-spotify-green hover:text-spotify-white">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default RegisterForm;

