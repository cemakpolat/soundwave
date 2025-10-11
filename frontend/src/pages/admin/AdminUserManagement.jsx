// src/pages/AdminUserManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  SearchIcon, 
  UserAddIcon, 
  BanIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon,
  PencilIcon,
  TrashIcon  
} from '@heroicons/react/outline';

const AdminUserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openUserId, setOpenUserId] = useState(null);

  // Mock user data
  const mockUsers = [
    { 
      id: 'user-1', 
      username: 'johnsmith', 
      email: 'john@example.com', 
      role: 'admin', 
      status: 'active', 
      profileImage: '/api/placeholder/40/40',
      createdAt: '2023-01-15T10:30:00Z',
      tracks: 12,
      followers: 235
    },
    { 
      id: 'user-2', 
      username: 'musiclover', 
      email: 'music@example.com', 
      role: 'user', 
      status: 'active', 
      profileImage: '/api/placeholder/40/40',
      createdAt: '2023-02-20T14:15:00Z',
      tracks: 0,
      followers: 48
    },
    { 
      id: 'user-3', 
      username: 'songcreator', 
      email: 'creator@example.com', 
      role: 'creator', 
      status: 'active', 
      profileImage: '/api/placeholder/40/40',
      createdAt: '2023-03-10T09:45:00Z',
      tracks: 37,
      followers: 1289
    },
    { 
      id: 'user-4', 
      username: 'banneduser', 
      email: 'banned@example.com', 
      role: 'user', 
      status: 'banned', 
      profileImage: '/api/placeholder/40/40',
      createdAt: '2023-01-05T16:20:00Z',
      tracks: 3,
      followers: 12
    },
    { 
      id: 'user-5', 
      username: 'pendingcreator', 
      email: 'pending@example.com', 
      role: 'creator', 
      status: 'pending', 
      profileImage: '/api/placeholder/40/40',
      createdAt: '2023-04-25T11:05:00Z',
      tracks: 0,
      followers: 0
    },
    { 
      id: 'user-6', 
      username: 'moderator1', 
      email: 'mod1@example.com', 
      role: 'moderator', 
      status: 'active', 
      profileImage: '/api/placeholder/40/40',
      createdAt: '2023-02-10T13:30:00Z',
      tracks: 5,
      followers: 87
    },
    { 
      id: 'user-7', 
      username: 'verifiedartist', 
      email: 'artist@example.com', 
      role: 'creator', 
      status: 'verified', 
      profileImage: '/api/placeholder/40/40',
      createdAt: '2023-01-20T08:45:00Z',
      tracks: 42,
      followers: 5634
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setTotalPages(Math.ceil(mockUsers.length / 10));
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filter users based on search, role, and status
    let results = [...users];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(user => 
        user.username.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query)
      );
    }
    
    if (selectedRole !== 'all') {
      results = results.filter(user => user.role === selectedRole);
    }
    
    if (selectedStatus !== 'all') {
      results = results.filter(user => user.status === selectedStatus);
    }
    
    setFilteredUsers(results);
    setTotalPages(Math.ceil(results.length / 10));
    setCurrentPage(1);
  }, [searchQuery, selectedRole, selectedStatus, users]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleUserActionClick = (userId) => {
    setOpenUserId(openUserId === userId ? null : userId);
  };

  const handleBanUser = (userId) => {
    // In a real app, this would make an API call
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, status: 'banned' } 
          : user
      )
    );
    setOpenUserId(null);
  };

  const handleUnbanUser = (userId) => {
    // In a real app, this would make an API call
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, status: 'active' } 
          : user
      )
    );
    setOpenUserId(null);
  };

  const handleDeleteUser = (userId) => {
    // In a real app, this would make an API call
    setUsers(prev => prev.filter(user => user.id !== userId));
    setOpenUserId(null);
  };

  const handleVerifyUser = (userId) => {
    // In a real app, this would make an API call
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, status: 'verified' } 
          : user
      )
    );
    setOpenUserId(null);
  };

  const getUserStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="bg-green-500 bg-opacity-20 text-green-500 px-2 py-1 rounded text-xs">Active</span>;
      case 'banned':
        return <span className="bg-red-500 bg-opacity-20 text-red-500 px-2 py-1 rounded text-xs">Banned</span>;
      case 'pending':
        return <span className="bg-yellow-500 bg-opacity-20 text-yellow-500 px-2 py-1 rounded text-xs">Pending</span>;
      case 'verified':
        return <span className="bg-blue-500 bg-opacity-20 text-blue-500 px-2 py-1 rounded text-xs">Verified</span>;
      default:
        return <span className="bg-gray-500 bg-opacity-20 text-gray-500 px-2 py-1 rounded text-xs">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-spotify-white">User Management</h1>
          <p className="text-spotify-light mt-1">Search, filter, and manage users</p>
        </div>
        
        <Link 
          to="/admin/users/new" 
          className="mt-4 md:mt-0 bg-spotify-green text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-90 flex items-center"
        >
          <UserAddIcon className="h-5 w-5 mr-2" />
          Add New User
        </Link>
      </div>

      {/* Filters and search */}
      <div className="bg-spotify-dark-gray rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <form 
            onSubmit={handleSearch}
            className="md:col-span-2"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by username, email, or ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 rounded-md
                          bg-spotify-light-gray text-spotify-white
                          placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-spotify-green"
              />
            </div>
          </form>
          
          <div>
            <select
              value={selectedRole}
              onChange={handleRoleChange}
              className="block w-full px-3 py-2 rounded-md
                        bg-spotify-light-gray text-spotify-white
                        focus:outline-none focus:ring-2 focus:ring-spotify-green"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="creator">Creator</option>
              <option value="user">User</option>
            </select>
          </div>
          
          <div>
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="block w-full px-3 py-2 rounded-md
                        bg-spotify-light-gray text-spotify-white
                        focus:outline-none focus:ring-2 focus:ring-spotify-green"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
        </div>
      ) : filteredUsers.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-spotify-dark-gray rounded-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-spotify-light-gray bg-opacity-30 border-b border-spotify-light-gray border-opacity-30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-spotify-light uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-spotify-light uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-spotify-light uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-spotify-light uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-spotify-light uppercase tracking-wider">Stats</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-spotify-light uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-spotify-light-gray divide-opacity-20">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-spotify-light-gray hover:bg-opacity-10">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full" src={user.profileImage} alt={user.username} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-spotify-white">{user.username}</div>
                          <div className="text-sm text-spotify-light">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-spotify-white capitalize">{user.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getUserStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-spotify-light">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-spotify-white">{user.tracks} Tracks</div>
                      <div className="text-sm text-spotify-light">{user.followers} Followers</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() => handleUserActionClick(user.id)}
                          className="text-spotify-green hover:text-spotify-white"
                        >
                          Actions
                        </button>
                        
                        {openUserId === user.id && (
                          <div className="absolute right-0 top-6 mt-2 w-48 bg-spotify-light-gray rounded-md shadow-lg z-10">
                            <Link 
                              to={`/admin/users/edit/${user.id}`}
                              className="block px-4 py-2 text-sm text-spotify-white hover:bg-spotify-dark-gray"
                            >
                              <PencilIcon className="h-4 w-4 inline mr-2" />
                              Edit User
                            </Link>
                            
                            <Link 
                              to={`/admin/users/view/${user.id}`}
                              className="block px-4 py-2 text-sm text-spotify-white hover:bg-spotify-dark-gray"
                            >
                              <CheckCircleIcon className="h-4 w-4 inline mr-2" />
                              View Details
                            </Link>
                            
                            {user.status !== 'banned' ? (
                              <button
                                onClick={() => handleBanUser(user.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-spotify-dark-gray"
                              >
                                <BanIcon className="h-4 w-4 inline mr-2" />
                                Ban User
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUnbanUser(user.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-green-400 hover:bg-spotify-dark-gray"
                              >
                                <CheckCircleIcon className="h-4 w-4 inline mr-2" />
                                Unban User
                              </button>
                            )}
                            
                            {user.status === 'pending' && (
                              <button
                                onClick={() => handleVerifyUser(user.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-blue-400 hover:bg-spotify-dark-gray"
                              >
                                <CheckCircleIcon className="h-4 w-4 inline mr-2" />
                                Verify User
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-spotify-dark-gray"
                            >
                              <TrashIcon className="h-4 w-4 inline mr-2" />
                              Delete User
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-3 flex items-center justify-between border-t border-spotify-light-gray border-opacity-30">
            <div className="text-sm text-spotify-light">
              Showing {filteredUsers.length > 0 ? 1 : 0} to {Math.min(filteredUsers.length, 10)} of {filteredUsers.length} users
            </div>
            <div className="flex space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="bg-spotify-light-gray bg-opacity-30 px-3 py-1 rounded text-sm text-spotify-white disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="bg-spotify-light-gray bg-opacity-30 px-3 py-1 rounded text-sm text-spotify-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-12 bg-spotify-dark-gray rounded-lg">
          <ExclamationCircleIcon className="h-16 w-16 text-spotify-light mx-auto mb-4" />
          <h2 className="text-xl font-bold text-spotify-white mb-2">No users found</h2>
          <p className="text-spotify-light mb-4">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRole('all');
              setSelectedStatus('all');
            }}
            className="bg-spotify-green text-black px-4 py-2 rounded-full text-sm font-medium"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;