// src/components/layout/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  UploadIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  MusicNoteIcon,
  ExclamationCircleIcon,
  CogIcon,
  MenuIcon, // Import MenuIcon for toggling
  CollectionIcon, // Import CollectionIcon for Albums
} from '@heroicons/react/outline';

const Sidebar = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // Initially closed

  // Effect to open sidebar on login and close on logout
  useEffect(() => {
    if (currentUser) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [currentUser]);

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navigation = [
    { name: 'Home', path: '/', icon: HomeIcon, roles: ['listener', 'creator', 'admin'] },
    { name: 'Search', path: '/search', icon: SearchIcon, roles: ['listener', 'creator', 'admin'] },
    { name: 'Albums', path: '/albums', icon: CollectionIcon, roles: ['listener', 'creator', 'admin'] },
    { name: 'Your Library', path: '/library', icon: LibraryIcon, roles: ['listener', 'creator', 'admin'] },
  ];

  const userLibrary = [
    { name: 'Create Playlist', path: '/create-playlist', icon: PlusCircleIcon, roles: ['listener', 'creator', 'admin'] },
    { name: 'Liked Songs', path: '/collection/tracks', icon: HeartIcon, roles: ['listener', 'creator', 'admin'] },
  ];

  const creatorLinks = [
    { name: 'Upload Track', path: '/upload', icon: UploadIcon, roles: ['creator', 'admin'] },
    { name: 'Create Album', path: '/create-album', icon: CollectionIcon, roles: ['creator', 'admin'] },
    { name: 'Creator Dashboard', path: '/creator/dashboard', icon: ChartBarIcon, roles: ['creator', 'admin'] },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin', icon: ShieldCheckIcon, roles: ['admin'] },
    { name: 'User Management', path: '/admin/users', icon: UserGroupIcon, roles: ['admin'] },
    { name: 'Track Management', path: '/admin/tracks', icon: MusicNoteIcon, roles: ['admin'] },
    { name: 'Reports', path: '/admin/reports', icon: ExclamationCircleIcon, roles: ['admin'] },
    { name: 'Admin Settings', path: '/admin/settings', icon: CogIcon, roles: ['admin'] },
  ];

  // Helper function to check if the current user has the required role(s)
  const hasRequiredRole = (roles) => {
    return currentUser && currentUser.role && roles.includes(currentUser.role);
  };

  return (
    <>
      {/* Hamburger menu for smaller screens - Only show when logged in */}
      {currentUser && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden absolute top-4 left-4 bg-spotify-black text-spotify-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-spotify-green"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      )}

      {/* Conditionally render the sidebar based on login state */}
      {currentUser && (
        <div
          className={`bg-spotify-black text-spotify-white w-64 flex-shrink-0 h-full overflow-y-auto fixed top-0 left-0 z-20 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:w-64`}
        >
          {/* Logo */}
          <div className="px-6 pt-6 pb-4">
            <Link to="/" className="text-2xl font-bold">SoundWave</Link>
          </div>

          {/* Main navigation */}
          <nav className="px-4 pt-2">
            {navigation.filter(item => hasRequiredRole(item.roles)).map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-2 py-3 rounded-md text-sm font-medium mb-1
                ${isActivePath(item.path)
                    ? 'bg-spotify-light-gray text-spotify-white'
                    : 'text-spotify-light hover:text-spotify-white'}
                `}
              >
                <item.icon className="mr-4 h-6 w-6" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User library section */}
          <div className="px-4 pt-4 mt-2">
            <h3 className="text-xs uppercase tracking-wider text-spotify-light px-2 mb-2">Library</h3>
            {userLibrary.filter(item => hasRequiredRole(item.roles)).map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-2 py-3 rounded-md text-sm font-medium mb-1
                ${isActivePath(item.path)
                    ? 'bg-spotify-light-gray text-spotify-white'
                    : 'text-spotify-light hover:text-spotify-white'}
                `}
              >
                <item.icon className="mr-4 h-6 w-6" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Creator section - only shown to logged in users */}
          {hasRequiredRole(['creator', 'admin']) && (
            <div className="px-4 pt-4 mt-2">
              <h3 className="text-xs uppercase tracking-wider text-spotify-light px-2 mb-2">For Creators</h3>
              {creatorLinks.filter(item => hasRequiredRole(item.roles)).map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-2 py-3 rounded-md text-sm font-medium mb-1
                ${isActivePath(item.path)
                      ? 'bg-spotify-light-gray text-spotify-white'
                      : 'text-spotify-light hover:text-spotify-white'}
                `}
                >
                  <item.icon className="mr-4 h-6 w-6" />
                  {item.name}
                </Link>
              ))}
            </div>
          )}

          {/* Admin section - only shown to admin users */}
          {hasRequiredRole(['admin']) && (
            <div className="px-4 pt-4 mt-2">
              <h3 className="text-xs uppercase tracking-wider text-spotify-light px-2 mb-2">Admin</h3>
              {adminLinks.filter(item => hasRequiredRole(item.roles)).map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-2 py-3 rounded-md text-sm font-medium mb-1
                ${isActivePath(item.path)
                      ? 'bg-spotify-light-gray text-spotify-white'
                      : 'text-spotify-light hover:text-spotify-white'}
                `}
                >
                  <item.icon className="mr-4 h-6 w-6" />
                  {item.name}
                </Link>
              ))}
            </div>
          )}

          {/* User's playlists */}
          {currentUser && (
            <div className="px-6 pt-4">
              <h3 className="text-xs uppercase tracking-wider text-spotify-light mb-2">Your Playlists</h3>
              <div className="space-y-1">
                {/* This would be populated from API data */}
                <Link to="/playlist/1" className="block text-sm text-spotify-light hover:text-spotify-white py-1">
                  My Favorite Tracks
                </Link>
                <Link to="/playlist/2" className="block text-sm text-spotify-light hover:text-spotify-white py-1">
                  Workout Mix
                </Link>
                <Link to="/playlist/3" className="block text-sm text-spotify-light hover:text-spotify-white py-1">
                  Chill Vibes
                </Link>
              </div>
            </div>
          )}

          {/* Following section */}
          {currentUser && (
            <div className="px-6 pt-4 pb-6">
              <h3 className="text-xs uppercase tracking-wider text-spotify-light mb-2">Following</h3>
              <div className="space-y-1">
                {/* This would be populated from API data */}
                <Link to="/artist/1" className="block text-sm text-spotify-light hover:text-spotify-white py-1">
                  Artist 1
                </Link>
                <Link to="/artist/2" className="block text-sm text-spotify-light hover:text-spotify-white py-1">
                  Artist 2
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Sidebar;