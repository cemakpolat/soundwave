// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import {
  UsersIcon,
  MusicNoteIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/outline';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Mock data for the admin dashboard
  const [adminStats, setAdminStats] = useState({
    totalUsers: 2850,
    totalTracks: 12456,
    totalPlaylists: 3782,
    reportedContent: 37,
    pendingReviews: 18,
    recentActions: [
      { id: 1, type: 'trackApproval', name: 'Approved track: "Summer Vibes"', timestamp: new Date() - 3600000 },
      { id: 2, type: 'userBan', name: 'Banned user: "spammer123"', timestamp: new Date() - 7200000 },
      { id: 3, type: 'contentRemoval', name: 'Removed track: "Copyright Violation"', timestamp: new Date() - 10800000 },
      { id: 4, type: 'trackApproval', name: 'Approved track: "Midnight Journey"', timestamp: new Date() - 14400000 },
      { id: 5, type: 'userWarning', name: 'Warned user: "inappropriateUser"', timestamp: new Date() - 28800000 },
    ],
    userGrowth: [
      { date: '01/01', count: 2500 },
      { date: '02/01', count: 2580 },
      { date: '03/01', count: 2650 },
      { date: '04/01', count: 2700 },
      { date: '05/01', count: 2780 },
      { date: '06/01', count: 2850 }
    ]
  });

  // Mock pending users for approval
  const [pendingUsers, setPendingUsers] = useState([
    { id: 'user-101', username: 'newcreator1', email: 'creator1@example.com', registeredAt: new Date() - 86400000, type: 'creator' },
    { id: 'user-102', username: 'newlistener1', email: 'listener1@example.com', registeredAt: new Date() - 172800000, type: 'listener' },
    { id: 'user-103', username: 'newartist1', email: 'artist1@example.com', registeredAt: new Date() - 259200000, type: 'creator' },
  ]);

  // Mock tracks awaiting review
  const [pendingTracks, setPendingTracks] = useState([
    {
      id: 'track-101',
      title: 'New Wave',
      artist: 'Digital Soundscape',
      submittedAt: new Date() - 43200000,
      genre: 'Electronic',
      coverArt: '/api/placeholder/300/300'
    },
    {
      id: 'track-102',
      title: 'Mountain High',
      artist: 'Nature Sounds',
      submittedAt: new Date() - 86400000,
      genre: 'Ambient',
      coverArt: '/api/placeholder/300/300'
    },
    {
      id: 'track-103',
      title: 'Urban Jungle',
      artist: 'City Beats',
      submittedAt: new Date() - 129600000,
      genre: 'Hip Hop',
      coverArt: '/api/placeholder/300/300'
    },
  ]);

  // Mock reported content
  const [reportedContent, setReportedContent] = useState([
    {
      id: 'report-101',
      contentType: 'track',
      contentId: 'track-201',
      title: 'Inappropriate Lyrics',
      reportedBy: 'user-301',
      reason: 'Explicit content not marked as such',
      reportedAt: new Date() - 21600000,
      status: 'pending'
    },
    {
      id: 'report-102',
      contentType: 'comment',
      contentId: 'comment-201',
      title: 'Hate Speech',
      reportedBy: 'user-302',
      reason: 'Comment contains offensive language',
      reportedAt: new Date() - 43200000,
      status: 'pending'
    },
    {
      id: 'report-103',
      contentType: 'user',
      contentId: 'user-201',
      title: 'Fake Profile',
      reportedBy: 'user-303',
      reason: 'Impersonating another artist',
      reportedAt: new Date() - 86400000,
      status: 'pending'
    },
  ]);

  // Check if user is admin
  useEffect(() => {
    // This would be a real check in a production app
    const checkAdminPermission = () => {
      // Mock admin check - in a real app this would check role from backend
      const isAdmin = currentUser && currentUser.role === 'admin'; // Check roles

      if (!isAdmin) {
        navigate('/');
      } else {
        setLoading(false);
      }
    };

    checkAdminPermission();
  }, [currentUser, navigate]);

  // Format date for display
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Handle approve user
  const handleApproveUser = (userId) => {
    setPendingUsers(prev => prev.filter(user => user.id !== userId));
    // In a real app, this would make an API call
  };

  // Handle reject user
  const handleRejectUser = (userId) => {
    setPendingUsers(prev => prev.filter(user => user.id !== userId));
    // In a real app, this would make an API call
  };

  // Handle approve track
  const handleApproveTrack = (trackId) => {
    setPendingTracks(prev => prev.filter(track => track.id !== trackId));
    // In a real app, this would make an API call
  };

  // Handle reject track
  const handleRejectTrack = (trackId) => {
    setPendingTracks(prev => prev.filter(track => track.id !== trackId));
    // In a real app, this would make an API call
  };

  // Handle report resolution
  const handleResolveReport = (reportId) => {
    setReportedContent(prev =>
      prev.map(report =>
        report.id === reportId
          ? { ...report, status: 'resolved' }
          : report
      )
    );
    // In a real app, this would make an API call
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
          <h1 className="text-3xl font-bold text-spotify-white">Admin Dashboard</h1>
          <p className="text-spotify-light mt-1">Platform management and moderation</p>
        </div>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-spotify-dark-gray rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-blue-500 bg-opacity-20 p-3 rounded-full mr-4">
              <UsersIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <div className="text-sm text-spotify-light">Total Users</div>
              <div className="text-2xl font-bold text-spotify-white">{adminStats.totalUsers.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="bg-spotify-dark-gray rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-green-500 bg-opacity-20 p-3 rounded-full mr-4">
              <MusicNoteIcon className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <div className="text-sm text-spotify-light">Total Tracks</div>
              <div className="text-2xl font-bold text-spotify-white">{adminStats.totalTracks.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="bg-spotify-dark-gray rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-red-500 bg-opacity-20 p-3 rounded-full mr-4">
              <ExclamationCircleIcon className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <div className="text-sm text-spotify-light">Reported Content</div>
              <div className="text-2xl font-bold text-spotify-white">{adminStats.reportedContent}</div>
            </div>
          </div>
        </div>

        <div className="bg-spotify-dark-gray rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-full mr-4">
              <ShieldCheckIcon className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <div className="text-sm text-spotify-light">Pending Reviews</div>
              <div className="text-2xl font-bold text-spotify-white">{adminStats.pendingReviews}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-spotify-dark-gray rounded-t-lg">
        <div className="border-b border-spotify-light-gray">
          <nav className="flex overflow-x-auto">
            <button
              className={`py-3 px-6 font-medium text-sm border-b-2 whitespace-nowrap ${activeTab === 'overview'
                ? 'border-spotify-green text-spotify-white'
                : 'border-transparent text-spotify-light hover:text-spotify-white'
                }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm border-b-2 whitespace-nowrap ${activeTab === 'users'
                ? 'border-spotify-green text-spotify-white'
                : 'border-transparent text-spotify-light hover:text-spotify-white'
                }`}
              onClick={() => setActiveTab('users')}
            >
              User Management
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm border-b-2 whitespace-nowrap ${activeTab === 'content'
                ? 'border-spotify-green text-spotify-white'
                : 'border-transparent text-spotify-light hover:text-spotify-white'
                }`}
              onClick={() => setActiveTab('content')}
            >
              Content Moderation
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm border-b-2 whitespace-nowrap ${activeTab === 'reports'
                ? 'border-spotify-green text-spotify-white'
                : 'border-transparent text-spotify-light hover:text-spotify-white'
                }`}
              onClick={() => setActiveTab('reports')}
            >
              Reports
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-spotify-light-gray bg-opacity-10 rounded-lg p-4">
                  <h2 className="text-xl font-bold text-spotify-white mb-4">Recent Actions</h2>
                  <div className="space-y-3">
                    {adminStats.recentActions.map(action => (
                      <div
                        key={action.id}
                        className="p-3 rounded-md bg-spotify-light-gray bg-opacity-20"
                      >
                        <p className="text-spotify-white">{action.name}</p>
                        <p className="text-sm text-spotify-light">
                          {new Date(action.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-spotify-light-gray bg-opacity-10 rounded-lg p-4">
                  <h2 className="text-xl font-bold text-spotify-white mb-4">Pending Tasks</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-spotify-white">Users Awaiting Approval</div>
                      <div className="text-spotify-green font-medium">{pendingUsers.length}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-spotify-white">Tracks Awaiting Review</div>
                      <div className="text-spotify-green font-medium">{pendingTracks.length}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-spotify-white">Reported Items</div>
                      <div className="text-spotify-green font-medium">{reportedContent.length}</div>
                    </div>
                    {/* THIS IS WHAT I AM TRYING TO MODIFY< IT DOESNT WORK*/}
                    <Link
                      to="/admin/users"
                      className="block w-full mt-4 text-center py-2 px-4 rounded-full
                              border border-spotify-light text-spotify-white
                              hover:border-spotify-white transition-colors"
                    >
                      View All Tasks
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-spotify-white mb-4">Pending User Approvals</h2>

              {pendingUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-spotify-light text-sm border-b border-spotify-light-gray">
                      <tr>
                        <th className="pb-3">Username</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Type</th>
                        <th className="pb-3">Registered</th>
                        <th className="pb-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-spotify-light-gray divide-opacity-20">
                      {pendingUsers.map(user => (
                        <tr key={user.id} className="text-spotify-white">
                          <td className="py-3">{user.username}</td>
                          <td className="py-3">{user.email}</td>
                          <td className="py-3 capitalize">{user.type}</td>
                          <td className="py-3">{formatDateTime(user.registeredAt)}</td>
                          <td className="py-3">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApproveUser(user.id)}
                                className="bg-spotify-green text-black px-3 py-1 rounded text-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectUser(user.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-spotify-light">No pending user approvals</p>
              )}

              <div className="mt-8">
                <h2 className="text-xl font-bold text-spotify-white mb-4">User Management Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link
                    to="/admin/users/search"
                    className="bg-spotify-light-gray bg-opacity-20 p-4 rounded-lg hover:bg-opacity-30"
                  >
                    <h3 className="text-lg font-medium text-spotify-white mb-2">Search Users</h3>
                    <p className="text-spotify-light text-sm">Find users by username, email, or ID</p>
                  </Link>
                  <Link
                    to="/admin/users/roles"
                    className="bg-spotify-light-gray bg-opacity-20 p-4 rounded-lg hover:bg-opacity-30"
                  >
                    <h3 className="text-lg font-medium text-spotify-white mb-2">Manage Roles</h3>
                    <p className="text-spotify-light text-sm">Assign or remove user roles and permissions</p>
                  </Link>
                  <Link
                    to="/admin/users/banned"
                    className="bg-spotify-light-gray bg-opacity-20 p-4 rounded-lg hover:bg-opacity-30"
                  >
                    <h3 className="text-lg font-medium text-spotify-white mb-2">Banned Users</h3>
                    <p className="text-spotify-light text-sm">View and manage banned users</p>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'content' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-spotify-white mb-4">Tracks Awaiting Review</h2>

              {pendingTracks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingTracks.map(track => (
                    <div
                      key={track.id}
                      className="bg-spotify-light-gray bg-opacity-20 rounded-lg overflow-hidden"
                    >
                      <img
                        src={track.coverArt}
                        alt={track.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-spotify-white">{track.title}</h3>
                        <p className="text-spotify-light">by {track.artist}</p>
                        <div className="flex justify-between items-center mt-2 text-sm">
                          <span className="text-spotify-light">Genre: {track.genre}</span>
                          <span className="text-spotify-light">
                            {new Date(track.submittedAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex space-x-2 mt-4">
                          <button
                            onClick={() => handleApproveTrack(track.id)}
                            className="flex-1 bg-spotify-green text-black py-2 rounded-full text-sm font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectTrack(track.id)}
                            className="flex-1 bg-red-500 text-white py-2 rounded-full text-sm font-medium"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-spotify-light">No tracks awaiting review</p>
              )}

              <div className="mt-8">
                <h2 className="text-xl font-bold text-spotify-white mb-4">Content Management Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link
                    to="/admin/content/search"
                    className="bg-spotify-light-gray bg-opacity-20 p-4 rounded-lg hover:bg-opacity-30"
                  >
                    <h3 className="text-lg font-medium text-spotify-white mb-2">Search Content</h3>
                    <p className="text-spotify-light text-sm">Find tracks, playlists, or comments</p>
                  </Link>
                  <Link
                    to="/admin/content/flagged"
                    className="bg-spotify-light-gray bg-opacity-20 p-4 rounded-lg hover:bg-opacity-30"
                  >
                    <h3 className="text-lg font-medium text-spotify-white mb-2">Flagged Content</h3>
                    <p className="text-spotify-light text-sm">View content flagged by the system</p>
                  </Link>
                  <Link
                    to="/admin/content/removed"
                    className="bg-spotify-light-gray bg-opacity-20 p-4 rounded-lg hover:bg-opacity-30"
                  >
                    <h3 className="text-lg font-medium text-spotify-white mb-2">Removed Content</h3>
                    <p className="text-spotify-light text-sm">View content that has been removed</p>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-spotify-white mb-4">Reported Content</h2>

              {reportedContent.length > 0 ? (
                <div className="space-y-4">
                  {reportedContent.map(report => (
                    <div
                      key={report.id}
                      className="bg-spotify-light-gray bg-opacity-20 p-4 rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-spotify-white">{report.title}</h3>
                          <p className="text-spotify-light text-sm">
                            {report.contentType.charAt(0).toUpperCase() + report.contentType.slice(1)} ID: {report.contentId}
                          </p>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium uppercase ${report.status === 'resolved'
                          ? 'bg-green-500 bg-opacity-20 text-green-500'
                          : 'bg-yellow-500 bg-opacity-20 text-yellow-500'
                          }`}>
                          {report.status}
                        </div>
                      </div>

                      <div className="mt-2">
                        <p className="text-spotify-white">Reason: {report.reason}</p>
                        <p className="text-spotify-light text-sm">
                          Reported by: {report.reportedBy} on {formatDateTime(report.reportedAt)}
                        </p>
                      </div>

                      {report.status === 'pending' && (
                        <div className="mt-4 flex space-x-3">
                          <button
                            onClick={() => handleResolveReport(report.id)}
                            className="bg-spotify-green text-black px-4 py-2 rounded-full text-sm font-medium"
                          >
                            Mark Resolved
                          </button>
                          <Link
                            to={`/admin/reports/${report.id}`}
                            className="bg-spotify-light-gray px-4 py-2 rounded-full text-sm font-medium text-spotify-white"
                          >
                            View Details
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-spotify-light">No reported content</p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

