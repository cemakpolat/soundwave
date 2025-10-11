// src/components/social/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUser, followUser } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import FollowButton from './FollowButton';
import TrackList from '../tracks/TrackList';
import { motion } from 'framer-motion';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('tracks');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUser(userId);
        setUser(userData);
      } catch (err) {
        setError('Failed to load user profile. Please try again.');
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleFollowChange = (isFollowing) => {
    setUser(prev => ({
      ...prev,
      isFollowing,
      followersCount: isFollowing ? prev.followersCount + 1 : prev.followersCount - 1
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center text-spotify-light py-8">
        <p className="text-xl">{error || 'User not found'}</p>
        <Link to="/" className="text-spotify-green hover:underline mt-4 inline-block">
          Go back to home
        </Link>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser.id === user.id;

  return (
    <div>
      {/* Profile header */}
      <div className="flex flex-col md:flex-row items-center md:items-end mb-8 bg-gradient-to-b from-spotify-light-gray to-spotify-black p-6 rounded-lg">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden flex-shrink-0 mr-0 md:mr-6 mb-4 md:mb-0">
          <img 
            src={user.profileImage || '/default-user.jpg'} 
            alt={user.username} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex flex-col text-center md:text-left">
          <p className="text-sm text-spotify-white uppercase mb-1">Profile</p>
          <h1 className="text-4xl md:text-5xl font-bold text-spotify-white mb-2">
            {user.username}
          </h1>
          <div className="flex flex-col md:flex-row md:items-center text-sm mb-4">
            <span className="text-spotify-light">
              <span className="text-spotify-white font-medium">{user.trackCount || 0}</span> Tracks
            </span>
            <span className="hidden md:inline mx-1 text-spotify-light">•</span>
            <span className="text-spotify-light">
              <span className="text-spotify-white font-medium">{user.followersCount || 0}</span> Followers
            </span>
            <span className="hidden md:inline mx-1 text-spotify-light">•</span>
            <span className="text-spotify-light">
              <span className="text-spotify-white font-medium">{user.followingCount || 0}</span> Following
            </span>
          </div>
          
          {!isOwnProfile && (
            <div className="mt-2">
              <FollowButton 
                userId={user.id} 
                isFollowing={user.isFollowing}
                onFollowChange={handleFollowChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-spotify-light-gray mb-6">
        <nav className="flex space-x-4">
          <button
            className={`py-3 px-1 border-b-2 font-medium text-sm
                      ${activeTab === 'tracks' 
                        ? 'border-spotify-green text-spotify-white' 
                        : 'border-transparent text-spotify-light hover:text-spotify-white'}
                     `}
            onClick={() => setActiveTab('tracks')}
          >
            Tracks
          </button>
          <button
            className={`py-3 px-1 border-b-2 font-medium text-sm
                      ${activeTab === 'playlists' 
                        ? 'border-spotify-green text-spotify-white' 
                        : 'border-transparent text-spotify-light hover:text-spotify-white'}
                     `}
            onClick={() => setActiveTab('playlists')}
          >
            Playlists
          </button>
          <button
            className={`py-3 px-1 border-b-2 font-medium text-sm
                      ${activeTab === 'liked' 
                        ? 'border-spotify-green text-spotify-white' 
                        : 'border-transparent text-spotify-light hover:text-spotify-white'}
                     `}
            onClick={() => setActiveTab('liked')}
          >
            Liked Tracks
          </button>
          {isOwnProfile && (
            <button
              className={`py-3 px-1 border-b-2 font-medium text-sm
                        ${activeTab === 'following' 
                          ? 'border-spotify-green text-spotify-white' 
                          : 'border-transparent text-spotify-light hover:text-spotify-white'}
                       `}
              onClick={() => setActiveTab('following')}
            >
              Following
            </button>
          )}
        </nav>
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'tracks' && (
          <div>
            <h2 className="text-2xl font-bold text-spotify-white mb-4">Tracks</h2>
            {user.tracks && user.tracks.length > 0 ? (
              <TrackList tracks={user.tracks} showArtist={false} showDateAdded />
            ) : (
              <p className="text-spotify-light text-center py-8">No tracks yet.</p>
            )}
          </div>
        )}
        
        {activeTab === 'playlists' && (
          <div>
            <h2 className="text-2xl font-bold text-spotify-white mb-4">Playlists</h2>
            {user.playlists && user.playlists.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {user.playlists.map(playlist => (
                  <Link
                    key={playlist.id}
                    to={`/playlist/${playlist.id}`}
                    className="bg-spotify-dark-gray p-4 rounded-lg hover:bg-spotify-light-gray transition-colors"
                  >
                    <div className="aspect-square mb-3">
                      <img 
                        src={playlist.coverArt || '/default-playlist.jpg'} 
                        alt={playlist.name} 
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <h3 className="text-spotify-white font-medium truncate">{playlist.name}</h3>
                    <p className="text-xs text-spotify-light">{playlist.trackCount} tracks</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-spotify-light text-center py-8">No playlists yet.</p>
            )}
          </div>
        )}
        
        {activeTab === 'liked' && (
          <div>
            <h2 className="text-2xl font-bold text-spotify-white mb-4">Liked Tracks</h2>
            {user.likedTracks && user.likedTracks.length > 0 ? (
              <TrackList tracks={user.likedTracks} showArtist showDateAdded />
            ) : (
              <p className="text-spotify-light text-center py-8">No liked tracks yet.</p>
            )}
          </div>
        )}
        
        {activeTab === 'following' && (
          <div>
            <h2 className="text-2xl font-bold text-spotify-white mb-4">Following</h2>
            {user.following && user.following.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {user.following.map(followedUser => (
                  <Link
                    key={followedUser.id}
                    to={`/profile/${followedUser.id}`}
                    className="flex items-center p-4 bg-spotify-dark-gray rounded-lg hover:bg-spotify-light-gray transition-colors"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                      <img 
                        src={followedUser.profileImage || '/default-user.jpg'} 
                        alt={followedUser.username} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-spotify-white font-medium">{followedUser.username}</h3>
                      <p className="text-xs text-spotify-light">{followedUser.trackCount || 0} tracks</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-spotify-light text-center py-8">Not following anyone yet.</p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserProfile;