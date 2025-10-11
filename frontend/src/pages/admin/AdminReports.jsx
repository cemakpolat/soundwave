// src/pages/AdminReports.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  SearchIcon, 
  FilterIcon, 
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ChatAlt2Icon,
  MusicNoteIcon,
  UserIcon
} from '@heroicons/react/outline';

const AdminReports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

      // Simulate API call
setTimeout(() => {
    setReports(mockReports);
    setFilteredReports(mockReports);
    setTotalPages(Math.ceil(mockReports.length / 10));
    setLoading(false);
}, 1000);

  
  // Mock report data
  const mockReports = [
    { 
      id: 'report-1', 
      contentType: 'track', 
      contentId: 'track-6', 
      contentTitle: 'Jazz Improv',
      reportedBy: 'user123',
      reporterId: 'user-5',
      reason: 'Copyright violation - this is a sampled track without permission',
      additionalInfo: 'The original track is "Jazz Classic" by Original Artist',
      status: 'pending', 
      reportedAt: '2023-06-20T14:30:00Z',
      lastUpdatedAt: '2023-06-20T14:30:00Z',
      priority: 'high'
    },
    { 
      id: 'report-2', 
      contentType: 'comment', 
      contentId: 'comment-42', 
      contentTitle: 'Comment on "Summer Vibes"',
      reportedBy: 'musiclover',
      reporterId: 'user-6',
      reason: 'Hate speech',
      additionalInfo: 'The comment contains offensive language and personal attacks',
      status: 'pending', 
      reportedAt: '2023-06-19T10:15:00Z',
      lastUpdatedAt: '2023-06-19T10:15:00Z',
      priority: 'high'
    },
    { 
      id: 'report-3', 
      contentType: 'user', 
      contentId: 'user-14', 
      contentTitle: 'Unknown Artist',
      reportedBy: 'creator07',
      reporterId: 'user-9',
      reason: 'Impersonation',
      additionalInfo: 'This user is pretending to be a famous artist',
      status: 'pending', 
      reportedAt: '2023-06-18T16:45:00Z',
      lastUpdatedAt: '2023-06-18T16:45:00Z',
      priority: 'medium'
    },
    { 
      id: 'report-4', 
      contentType: 'track', 
      contentId: 'track-10', 
      contentTitle: 'Explicit Content',
      reportedBy: 'parent01',
      reporterId: 'user-10',
      reason: 'Inappropriate content not marked as explicit',
      additionalInfo: 'This track contains explicit lyrics but is not marked accordingly',
      status: 'resolved', 
      reportedAt: '2023-06-15T09:20:00Z',
      lastUpdatedAt: '2023-06-16T11:30:00Z',
      resolution: 'Track marked as explicit',
      priority: 'medium'
    },
    { 
      id: 'report-5', 
      contentType: 'user', 
      contentId: 'user-20', 
      contentTitle: 'Spam Account',
      reportedBy: 'moderator1',
      reporterId: 'user-2',
      reason: 'Spam activity',
      additionalInfo: 'This account is posting spam comments across multiple tracks',
      status: 'resolved', 
      reportedAt: '2023-06-14T15:10:00Z',
      lastUpdatedAt: '2023-06-15T08:45:00Z',
      resolution: 'User banned',
      priority: 'low'
    },
    { 
      id: 'report-6', 
      contentType: 'track', 
      contentId: 'track-15', 
      contentTitle: 'Poor Quality Upload',
      reportedBy: 'audiophile',
      reporterId: 'user-11',
      reason: 'Extremely low quality audio',
      additionalInfo: 'This track has very poor audio quality and seems to be corrupted',
      status: 'dismissed', 
      reportedAt: '2023-06-12T13:55:00Z',
      lastUpdatedAt: '2023-06-13T09:30:00Z',
      resolution: 'Quality meets minimum standards',
      priority: 'low'
    },
    { 
      id: 'report-7', 
      contentType: 'comment', 
      contentId: 'comment-56', 
      contentTitle: 'Comment on "Classical Morning"',
      reportedBy: 'classicalfan',
      reporterId: 'user-12',
      reason: 'Spam link',
      additionalInfo: 'This comment contains suspicious links to external sites',
      status: 'pending', 
      reportedAt: '2023-06-21T08:40:00Z',
      lastUpdatedAt: '2023-06-21T08:40:00Z',
      priority: 'medium'
    },
  ];

  const reportTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'track', name: 'Tracks' },
    { id: 'comment', name: 'Comments' },
    { id: 'user', name: 'Users' },
    { id: 'playlist', name: 'Playlists' },
  ];

  const reportStatuses = [
    { id: 'all', name: 'All Statuses' },
    { id: 'pending', name: 'Pending' },
    { id: 'resolved', name: 'Resolved' },
    { id: 'dismissed', name: 'Dismissed' },
  ];

  useEffect(() => {
    // Filter reports based on search, type, and status
    let results = [...reports];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(report => 
        report.contentTitle.toLowerCase().includes(query) || 
        report.reportedBy.toLowerCase().includes(query) ||
        report.reason.toLowerCase().includes(query)
      );
    }
    
    if (selectedType !== 'all') {
      results = results.filter(report => report.contentType === selectedType);
    }
    
    if (selectedStatus !== 'all') {
      results = results.filter(report => report.status === selectedStatus);
    }
    
    setFilteredReports(results);
    setTotalPages(Math.ceil(results.length / 10));
    setCurrentPage(1);
  }, [searchQuery, selectedType, selectedStatus, reports]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  const handleTypeChange = (typeId) => {
    setSelectedType(typeId);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  const handleCloseReport = () => {
    setSelectedReport(null);
  };

  const handleResolveReport = (reportId, resolution) => {
    // In a real app, this would make an API call
    setReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { 
              ...report, 
              status: 'resolved', 
              resolution: resolution || 'Issue resolved by admin',
              lastUpdatedAt: new Date().toISOString()
            } 
          : report
      )
    );
    setSelectedReport(null);
  };

  const handleDismissReport = (reportId, reason) => {
    // In a real app, this would make an API call
    setReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { 
              ...report, 
              status: 'dismissed', 
              resolution: reason || 'No action needed',
              lastUpdatedAt: new Date().toISOString()
            } 
          : report
      )
    );
    setSelectedReport(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getReportTypeIcon = (type) => {
    switch (type) {
      case 'track':
        return <MusicNoteIcon className="h-5 w-5" />;
      case 'comment':
        return <ChatAlt2Icon className="h-5 w-5" />;
      case 'user':
        return <UserIcon className="h-5 w-5" />;
      default:
        return <ExclamationCircleIcon className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="bg-yellow-500 bg-opacity-20 text-yellow-500 px-2 py-1 rounded text-xs">Pending</span>;
      case 'resolved':
        return <span className="bg-green-500 bg-opacity-20 text-green-500 px-2 py-1 rounded text-xs">Resolved</span>;
      case 'dismissed':
        return <span className="bg-gray-500 bg-opacity-20 text-gray-500 px-2 py-1 rounded text-xs">Dismissed</span>;
      default:
        return <span className="bg-gray-500 bg-opacity-20 text-gray-500 px-2 py-1 rounded text-xs">{status}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="bg-red-500 bg-opacity-20 text-red-500 px-2 py-1 rounded text-xs">High</span>;
      case 'medium':
        return <span className="bg-orange-500 bg-opacity-20 text-orange-500 px-2 py-1 rounded text-xs">Medium</span>;
      case 'low':
        return <span className="bg-blue-500 bg-opacity-20 text-blue-500 px-2 py-1 rounded text-xs">Low</span>;
      default:
        return <span className="bg-gray-500 bg-opacity-20 text-gray-500 px-2 py-1 rounded text-xs">{priority}</span>;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-spotify-white">Reports Management</h1>
          <p className="text-spotify-light mt-1">Handle user reports and content moderation</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <button
            onClick={toggleFilters}
            className="bg-spotify-light-gray bg-opacity-30 px-4 py-2 rounded-full text-sm text-spotify-white flex items-center"
          >
            <FilterIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div 
          className="bg-spotify-dark-gray rounded-lg p-4 mb-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <form 
              onSubmit={handleSearch}
              className="md:col-span-1"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search reports..."
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
                value={selectedStatus}
                onChange={handleStatusChange}
                className="block w-full px-3 py-2 rounded-md
                          bg-spotify-light-gray text-spotify-white
                          focus:outline-none focus:ring-2 focus:ring-spotify-green"
              >
                {reportStatuses.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <div className="flex flex-wrap gap-2">
                {reportTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => handleTypeChange(type.id)}
                    className={`px-3 py-1 rounded-full text-sm
                              ${selectedType === type.id 
                                ? 'bg-spotify-green text-black' 
                                : 'bg-spotify-light-gray text-spotify-white hover:bg-opacity-80'}`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Reports table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
        </div>
      ) : filteredReports.length > 0 ? (
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-spotify-light uppercase tracking-wider">Content</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-spotify-light uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-spotify-light uppercase tracking-wider">Reporter</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-spotify-light uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-spotify-light uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-spotify-light uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-spotify-light uppercase tracking-wider">Reported At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-spotify-light uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-spotify-light-gray divide-opacity-20">
                {filteredReports.map(report => (
                  <tr key={report.id} className="hover:bg-spotify-light-gray hover:bg-opacity-10">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-spotify-white">{report.contentTitle}</div>
                      <div className="text-xs text-spotify-light">ID: {report.contentId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-spotify-light-gray bg-opacity-30 p-1 rounded mr-2">
                          {getReportTypeIcon(report.contentType)}
                        </div>
                        <span className="text-sm text-spotify-white capitalize">{report.contentType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-spotify-white">{report.reportedBy}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-spotify-white line-clamp-2">{report.reason}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(report.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-spotify-light">
                      {formatDate(report.reportedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewReport(report)}
                          className="bg-spotify-light-gray bg-opacity-30 p-1 rounded hover:bg-opacity-50"
                          title="View Details"
                        >
                          <EyeIcon className="h-5 w-5 text-spotify-white" />
                        </button>
                        {report.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleResolveReport(report.id)}
                              className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                              title="Resolve"
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDismissReport(report.id)}
                              className="bg-gray-500 text-white p-1 rounded hover:bg-gray-600"
                              title="Dismiss"
                            >
                              <XCircleIcon className="h-5 w-5" />
                            </button>
                          </>
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
              Showing {filteredReports.length > 0 ? 1 : 0} to {Math.min(filteredReports.length, 10)} of {filteredReports.length} reports
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
          <h2 className="text-xl font-bold text-spotify-white mb-2">No reports found</h2>
          <p className="text-spotify-light mb-4">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedType('all');
              setSelectedStatus('all');
            }}
            className="bg-spotify-green text-black px-4 py-2 rounded-full text-sm font-medium"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Report detail modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <motion.div 
            className="bg-spotify-dark-gray rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-start border-b border-spotify-light-gray border-opacity-30 px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-spotify-white">Report Details</h2>
                <p className="text-spotify-light text-sm">Report ID: {selectedReport.id}</p>
              </div>
              <button
                onClick={handleCloseReport}
                className="text-spotify-light hover:text-spotify-white"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-spotify-light text-sm mb-1">Content Information</h3>
                  <div className="bg-spotify-light-gray bg-opacity-10 p-4 rounded-lg mb-4">
                    <div className="flex items-center mb-2">
                      <div className="bg-spotify-light-gray bg-opacity-30 p-1 rounded mr-2">
                        {getReportTypeIcon(selectedReport.contentType)}
                      </div>
                      <span className="text-spotify-white font-medium capitalize">{selectedReport.contentType}</span>
                    </div>
                    <p className="text-spotify-white text-lg mb-1">{selectedReport.contentTitle}</p>
                    <p className="text-spotify-light text-sm">ID: {selectedReport.contentId}</p>
                    <div className="mt-4">
                      <Link
                        to={`/admin/${selectedReport.contentType}s/${selectedReport.contentId}`}
                        className="text-spotify-green hover:underline text-sm"
                      >
                        View Content
                      </Link>
                    </div>
                  </div>
                  
                  <h3 className="text-spotify-light text-sm mb-1">Reporter Information</h3>
                  <div className="bg-spotify-light-gray bg-opacity-10 p-4 rounded-lg">
                    <p className="text-spotify-white mb-1">{selectedReport.reportedBy}</p>
                    <p className="text-spotify-light text-sm">ID: {selectedReport.reporterId}</p>
                    <div className="mt-4">
                      <Link
                        to={`/admin/users/${selectedReport.reporterId}`}
                        className="text-spotify-green hover:underline text-sm"
                      >
                        View User
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-spotify-light text-sm mb-1">Report Details</h3>
                  <div className="bg-spotify-light-gray bg-opacity-10 p-4 rounded-lg mb-4">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-spotify-white font-medium">Status:</span>
                        <div className="ml-2">{getStatusBadge(selectedReport.status)}</div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-spotify-white font-medium">Priority:</span>
                        <div className="ml-2">{getPriorityBadge(selectedReport.priority)}</div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-spotify-white font-medium">Reason for Report:</p>
                      <p className="text-spotify-light mt-1">{selectedReport.reason}</p>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-spotify-white font-medium">Additional Information:</p>
                      <p className="text-spotify-light mt-1">{selectedReport.additionalInfo || 'None provided'}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-spotify-white font-medium">Reported At:</p>
                        <p className="text-spotify-light">{formatDate(selectedReport.reportedAt)}</p>
                      </div>
                      <div>
                        <p className="text-spotify-white font-medium">Last Updated:</p>
                        <p className="text-spotify-light">{formatDate(selectedReport.lastUpdatedAt)}</p>
                      </div>
                    </div>
                    
                    {selectedReport.status !== 'pending' && (
                      <div className="mt-4 pt-4 border-t border-spotify-light-gray border-opacity-20">
                        <p className="text-spotify-white font-medium">Resolution:</p>
                        <p className="text-spotify-light mt-1">{selectedReport.resolution}</p>
                      </div>
                    )}
                  </div>
                  
                  {selectedReport.status === 'pending' && (
                    <div className="bg-spotify-light-gray bg-opacity-10 p-4 rounded-lg">
                      <h3 className="text-spotify-white font-medium mb-4">Take Action</h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => handleResolveReport(selectedReport.id, "Issue resolved and appropriate action taken")}
                          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                        >
                          Resolve Report
                        </button>
                        <button
                          onClick={() => handleDismissReport(selectedReport.id, "Report reviewed and no action required")}
                          className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                        >
                          Dismiss Report
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
