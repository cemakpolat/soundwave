// src/pages/CreatorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTracks } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { 
  ChartBarIcon, 
  ClockIcon, 
  UsersIcon, 
  HeartIcon, 
  MusicNoteIcon,
  UploadIcon
} from '@heroicons/react/outline';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const CreatorDashboard = () => {
  const { currentUser } = useAuth();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('week');
  
  // Mock statistics data - in a real app this would come from the backend
  const [stats, setStats] = useState({
    totalPlays: 0,
    totalLikes: 0,
    totalComments: 0,
    followers: 0,
    recentPlays: [],
    trackPopularity: [],
    audienceGrowth: []
  });

  useEffect(() => {
    const fetchCreatorData = async () => {
      try {
        setLoading(true);
        
        // Fetch creator's tracks
        const tracksResponse = await getTracks({ userId: currentUser?.id });
        setTracks(tracksResponse);
        
        // Calculate total stats
        const totalPlays = tracksResponse.reduce((sum, track) => sum + (track.play_count || 0), 0);
        const totalLikes = tracksResponse.reduce((sum, track) => sum + (track.likes?.length || 0), 0);
        const totalComments = tracksResponse.reduce(
          (sum, track) => sum + (track.comments?.length || 0),
          0
        );

        // Generate mock data for charts
        const recentPlays = generateMockTimeSeriesData(timeRange, 'plays');
        const audienceGrowth = generateMockTimeSeriesData(timeRange, 'followers');
        const trackPopularity = tracksResponse.map(track => ({
          name: track.title,
          plays: track.play_count || Math.floor(Math.random() * 5000),
          likes: track.likes?.length || Math.floor(Math.random() * 500)
        })).sort((a, b) => b.plays - a.plays).slice(0, 5);
        
        setStats({
          totalPlays,
          totalLikes,
          totalComments,
          followers: currentUser?.followersCount || Math.floor(Math.random() * 1000),
          recentPlays,
          trackPopularity,
          audienceGrowth
        });
        
      } catch (err) {
        setError('Failed to load creator dashboard. Please try again.');
        console.error('Error fetching creator data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchCreatorData();
    }
  }, [currentUser, timeRange]);

  // Helper function to generate mock time series data
  const generateMockTimeSeriesData = (range, type) => {
    let dates = [];
    let now = new Date();
    let dataPoints = 0;
    let startValue = Math.floor(Math.random() * 1000);
    let trend = Math.random() > 0.3 ? 'up' : 'down'; // 70% chance of upward trend
    
    switch (range) {
      case 'day':
        dataPoints = 24;
        for (let i = 0; i < dataPoints; i++) {
          let date = new Date(now);
          date.setHours(date.getHours() - (dataPoints - i));
          dates.push({
            name: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: date.getTime()
          });
        }
        break;
      case 'week':
        dataPoints = 7;
        for (let i = 0; i < dataPoints; i++) {
          let date = new Date(now);
          date.setDate(date.getDate() - (dataPoints - i));
          dates.push({
            name: date.toLocaleDateString([], { weekday: 'short' }),
            timestamp: date.getTime()
          });
        }
        break;
      case 'month':
        dataPoints = 30;
        for (let i = 0; i < dataPoints; i++) {
          let date = new Date(now);
          date.setDate(date.getDate() - (dataPoints - i));
          dates.push({
            name: `${date.getMonth() + 1}/${date.getDate()}`,
            timestamp: date.getTime()
          });
        }
        break;
      case 'year':
        dataPoints = 12;
        for (let i = 0; i < dataPoints; i++) {
          let date = new Date(now);
          date.setMonth(date.getMonth() - (dataPoints - i));
          dates.push({
            name: date.toLocaleDateString([], { month: 'short' }),
            timestamp: date.getTime()
          });
        }
        break;
      default:
        return [];
    }
    
    // Generate values with some randomness but following a trend
    return dates.map((date, index) => {
      const change = Math.random() * 20 - (trend === 'up' ? 5 : 15); // More likely to go up if trend is up
      startValue = Math.max(0, startValue + change);
      
      return {
        ...date,
        [type]: Math.floor(startValue)
      };
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-spotify-light py-8">
        <p className="text-xl">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-spotify-green hover:underline mt-4 inline-block"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-spotify-white">Creator Dashboard</h1>
          <p className="text-spotify-light mt-1">Track your music performance and audience growth</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link 
            to="/upload"
            className="bg-spotify-green text-black px-5 py-2 rounded-full text-sm font-medium hover:bg-opacity-90 flex items-center"
          >
            <UploadIcon className="h-5 w-5 mr-2" />
            Upload New Track
          </Link>
        </div>
      </div>
      
      {/* Time range selector */}
      <div className="bg-spotify-dark-gray rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="font-medium text-spotify-white">Time Range</div>
          <div className="flex space-x-2">
            {['day', 'week', 'month', 'year'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-full text-sm 
                          ${timeRange === range 
                            ? 'bg-spotify-green text-black' 
                            : 'bg-spotify-light-gray text-spotify-white hover:bg-opacity-80'}`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Statistics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-spotify-dark-gray rounded-lg p-4 flex items-center">
          <div className="bg-green-500 bg-opacity-20 p-3 rounded-full mr-4">
            <ChartBarIcon className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <div className="text-sm text-spotify-light">Total Plays</div>
            <div className="text-2xl font-bold text-spotify-white">{stats.totalPlays.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="bg-spotify-dark-gray rounded-lg p-4 flex items-center">
          <div className="bg-red-500 bg-opacity-20 p-3 rounded-full mr-4">
            <HeartIcon className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <div className="text-sm text-spotify-light">Total Likes</div>
            <div className="text-2xl font-bold text-spotify-white">{stats.totalLikes.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="bg-spotify-dark-gray rounded-lg p-4 flex items-center">
          <div className="bg-blue-500 bg-opacity-20 p-3 rounded-full mr-4">
            <UsersIcon className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <div className="text-sm text-spotify-light">Followers</div>
            <div className="text-2xl font-bold text-spotify-white">{stats.followers.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="bg-spotify-dark-gray rounded-lg p-4 flex items-center">
          <div className="bg-purple-500 bg-opacity-20 p-3 rounded-full mr-4">
            <MusicNoteIcon className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <div className="text-sm text-spotify-light">Tracks</div>
            <div className="text-2xl font-bold text-spotify-white">{tracks.length}</div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-spotify-dark-gray rounded-t-lg">
        <div className="border-b border-spotify-light-gray">
          <nav className="flex">
            <button
              className={`py-3 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'overview' 
                  ? 'border-spotify-green text-spotify-white' 
                  : 'border-transparent text-spotify-light hover:text-spotify-white'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'tracks' 
                  ? 'border-spotify-green text-spotify-white' 
                  : 'border-transparent text-spotify-light hover:text-spotify-white'
              }`}
              onClick={() => setActiveTab('tracks')}
            >
              Tracks
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'audience' 
                  ? 'border-spotify-green text-spotify-white' 
                  : 'border-transparent text-spotify-light hover:text-spotify-white'
              }`}
              onClick={() => setActiveTab('audience')}
            >
              Audience
            </button>
          </nav>
        </div>
        
        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-spotify-white mb-4">Plays Over Time</h2>
              <div className="h-72 w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={stats.recentPlays}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#b3b3b3" />
                    <YAxis stroke="#b3b3b3" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#282828', borderColor: '#444' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="plays" 
                      stroke="#1DB954" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <h2 className="text-xl font-bold text-spotify-white mb-4">Top 5 Tracks</h2>
              <div className="h-72 w-full mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.trackPopularity}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis type="number" stroke="#b3b3b3" />
                    <YAxis dataKey="name" type="category" stroke="#b3b3b3" width={150} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#282828', borderColor: '#444' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar dataKey="plays" fill="#1DB954" />
                    <Bar dataKey="likes" fill="#f44336" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'tracks' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-spotify-white mb-4">Your Tracks</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="text-left border-b border-spotify-light-gray">
                    <tr>
                      <th className="pb-2 text-spotify-light font-medium">Track</th>
                      <th className="pb-2 text-spotify-light font-medium">Plays</th>
                      <th className="pb-2 text-spotify-light font-medium">Likes</th>
                      <th className="pb-2 text-spotify-light font-medium">Comments</th>
                      <th className="pb-2 text-spotify-light font-medium">Date Added</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-spotify-light-gray divide-opacity-20">
                    {tracks.map(track => (
                      <tr key={track.id} className="hover:bg-spotify-light-gray hover:bg-opacity-20">
                        <td className="py-3">
                          <div className="flex items-center">
                            <img 
                              src={track.coverArt || '/default-cover.jpg'} 
                              alt={track.title} 
                              className="w-10 h-10 object-cover rounded mr-3"
                            />
                            <div>
                              <Link to={`/track/${track.id}`} className="text-spotify-white hover:underline">
                                {track.title}
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-spotify-light">{track.play_count || 0}</td>
                        <td className="py-3 text-spotify-light">{track.likes?.length || 0}</td>
                        <td className="py-3 text-spotify-light">{track.comments?.length || 0}</td>
                        <td className="py-3 text-spotify-light">
                          {new Date(track.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'audience' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-spotify-white mb-4">Audience Growth</h2>
              <div className="h-72 w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={stats.audienceGrowth}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#b3b3b3" />
                    <YAxis stroke="#b3b3b3" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#282828', borderColor: '#444' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="followers" 
                      stroke="#1DB954" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <h2 className="text-xl font-bold text-spotify-white mb-4">Audience Demographics</h2>
              <p className="text-spotify-light mb-6">
                Detailed demographic information is available for premium creator accounts.
              </p>
              
              <div className="bg-spotify-light-gray bg-opacity-20 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-spotify-white mb-2">Upgrade to Premium</h3>
                <p className="text-spotify-light mb-4">
                  Get access to detailed audience demographics, geographic distribution, and more advanced analytics.
                </p>
                <button className="bg-spotify-green text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-90">
                  Upgrade Now
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;