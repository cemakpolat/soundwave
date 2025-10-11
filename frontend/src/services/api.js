// // src/services/api.js
// import axios from 'axios';

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
// });

// // Add a request interceptor to include the JWT token in headers
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // User API
// export const registerUser = async (userData) => {
//   const response = await api.post('/auth/register', userData);
//   return response.data;
// };

// export const loginUser = async (credentials) => {
//   const response = await api.post('/auth/login', credentials);
//   return response.data;
// };

// export const getUser = async (userId) => {
//   const response = await api.get(`/users/${userId}`);
//   return response.data;
// };

// // Track API
// export const getTracks = async () => {
//   const response = await api.get('/tracks');
//   return response.data;
// };

// export const getTrackById = async (trackId) => {
//   const response = await api.get(`/tracks/${trackId}`);
//   return response.data;
// };

// export const uploadTrack = async (trackData) => {
//   const response = await api.post('/tracks/upload', trackData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
//   return response.data;
// };

// // Playlist API
// export const getPlaylists = async () => {
//   const response = await api.get('/playlists');
//   return response.data;
// };

// export const createPlaylist = async (playlistData) => {
//   const response = await api.post('/playlists', playlistData);
//   return response.data;
// };

// export const addTrackToPlaylist = async (playlistId, trackId) => {
//   const response = await api.post(`/playlists/${playlistId}/tracks/${trackId}`);
//   return response.data;
// };

// // Social API
// export const likeTrack = async (trackId) => {
//   const response = await api.post(`/social/tracks/${trackId}/like`);
//   return response.data;
// };

// export const addComment = async (trackId, comment) => {
//   const response = await api.post(`/social/tracks/${trackId}/comments`, { content: comment });
//   return response.data;
// };

// export const followUser = async (followeeId) => {
//   const response = await api.post(`/social/users/${followeeId}/follow`);
//   return response.data;
// };

// // Notifications API
// export const getNotifications = async () => {
//   const response = await api.get('/notifications');
//   return response.data;
// };

// // Recommendations API
// export const getRecommendations = async () => {
//   const response = await api.get('/recommendations');
//   return response.data;
// };

// export default api;


// src/services/api.js
import axios from 'axios';

// Use a flag to determine if we should use mock data or real API
const USE_MOCK_DATA = false;

// Generate a fake delay for mock responses
const MOCK_DELAY = 500;

// Setup axios instance for real API
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  // Add CORS headers
  withCredentials: false,
  headers: {
    // Don't set Content-Type here - let axios set it automatically based on request data
    // This allows FormData to work correctly with multipart/form-data
    'Accept': 'application/json'
  }
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Set Content-Type for JSON requests if not already set and not FormData
  if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

// Helper to simulate API delay
const mockResponse = (data) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), MOCK_DELAY);
  });
};

// Create mock data for development - initial data first
const mockDataInitial = {
  // Initial data with empty references that will be populated later
  tracks: Array(20).fill().map((_, i) => ({
    id: `track-${i+1}`,
    title: `Track ${i+1}`,
    artist: `Artist ${Math.floor(i/3) + 1}`,
    artistId: `artist-${Math.floor(i/3) + 1}`,
    artistImage: `/api/placeholder/100/100`,
    coverArt: `/api/placeholder/300/300`,
    audioUrl: 'https://example.com/audio.mp3',
    duration: 180 + Math.floor(Math.random() * 180),
    playCount: Math.floor(Math.random() * 10000),
    likes: Math.floor(Math.random() * 1000),
    isLiked: Math.random() > 0.7,
    genre: ['pop', 'rock', 'hiphop', 'electronic', 'jazz'][Math.floor(Math.random() * 5)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    comments: Array(Math.floor(Math.random() * 5)).fill().map((_, j) => ({
      id: `comment-${i}-${j}`,
      userId: `user-${Math.floor(Math.random() * 10) + 1}`,
      username: `User ${Math.floor(Math.random() * 10) + 1}`,
      userAvatar: `/api/placeholder/50/50`,
      content: `This is comment ${j+1} on track ${i+1}. Great track!`,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString()
    }))
  })),

  playlists: Array(10).fill().map((_, i) => ({
    id: `playlist-${i+1}`,
    name: `Playlist ${i+1}`,
    ownerName: `User ${Math.floor(Math.random() * 10) + 1}`,
    ownerId: `user-${Math.floor(Math.random() * 10) + 1}`,
    coverArt: `/api/placeholder/300/300`,
    trackCount: Math.floor(Math.random() * 20) + 5,
    isPrivate: Math.random() > 0.7,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    description: 'A collection of awesome tracks!',
    tracks: []
  })),

  users: Array(10).fill().map((_, i) => ({
    id: `user-${i+1}`,
    username: `User ${i+1}`,
    email: `user${i+1}@example.com`,
    profileImage: `/api/placeholder/200/200`,
    followersCount: Math.floor(Math.random() * 1000),
    followingCount: Math.floor(Math.random() * 100),
    trackCount: Math.floor(Math.random() * 20),
    isFollowing: Math.random() > 0.7,
    tracks: [],
    playlists: [],
    likedTracks: [],
    // **Important:** Add a `role` property to each user
    role: ['listener', 'creator', 'admin'][i % 3], // Assign roles cyclically
  })),

  notifications: Array(15).fill().map((_, i) => ({
    id: `notification-${i+1}`,
    type: ['like', 'comment', 'follow'][Math.floor(Math.random() * 3)],
    senderId: `user-${Math.floor(Math.random() * 10) + 1}`,
    senderName: `User ${Math.floor(Math.random() * 10) + 1}`,
    senderImage: `/api/placeholder/50/50`,
    message: [
      'liked your track',
      'commented on your track',
      'started following you'
    ][Math.floor(Math.random() * 3)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
    isRead: Math.random() > 0.3,
    link: [
      `/track/track-${Math.floor(Math.random() * 20) + 1}`,
      `/profile/user-${Math.floor(Math.random() * 10) + 1}`
    ][Math.floor(Math.random() * 2)]
  }))
};

// Now clone the initial data and populate references
const mockData = JSON.parse(JSON.stringify(mockDataInitial));

// Process mock data references
mockData.playlists.forEach(playlist => {
  playlist.tracks = Array(playlist.trackCount).fill().map(() => {
    const trackIndex = Math.floor(Math.random() * mockData.tracks.length);
    return {...mockData.tracks[trackIndex]};
  });
});

mockData.users.forEach(user => {
  user.tracks = Array(Math.floor(Math.random() * 10)).fill().map(() => {
    const trackIndex = Math.floor(Math.random() * mockData.tracks.length);
    return {...mockData.tracks[trackIndex]};
  });

  user.playlists = Array(Math.floor(Math.random() * 5)).fill().map(() => {
    const playlistIndex = Math.floor(Math.random() * mockData.playlists.length);
    return {...mockData.playlists[playlistIndex]};
  });

  user.likedTracks = Array(Math.floor(Math.random() * 15)).fill().map(() => {
    const trackIndex = Math.floor(Math.random() * mockData.tracks.length);
    return {...mockData.tracks[trackIndex]};
  });
});

// ===================
// User API
// ===================
export const registerUser = async (userData) => {
  if (USE_MOCK_DATA) {
    // **Important:** Include the role in the mock user data
    const role = 'listener'; // Default role for new users
    return mockResponse({
      token: 'fake-jwt-token',
      user: {
        id: 'user-new',
        username: userData.username,
        email: userData.email,
        profileImage: `/api/placeholder/200/200`,
        role: role,
      }
    });
  }
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  if (USE_MOCK_DATA) {
    console.log("loginUser: mockData.users:", mockData.users); // <--- ADD THIS

    const user = mockData.users.find(u => u.email === credentials.email);

    if (user) {
      return mockResponse({
        token: 'fake-jwt-token',
        user: {
          id: user.id,
          username: user.username,
          email: credentials.email,
          profileImage: user.profileImage,
          role: user.role,
        }
      });
    } else {
      console.warn(`User with email ${credentials.email} not found in mock data.`);
      return mockResponse({
        token: 'fake-jwt-token',
        user: {
          id: 'user-not-found',
          username: 'User Not Found',
          email: credentials.email,
          profileImage: '/api/placeholder/200/200',
          role: 'listener',  // Default role
        }
      });
    }
  }
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const getUser = async (userId) => {
  if (USE_MOCK_DATA) {
    const user = mockData.users.find(u => u.id === userId) || mockData.users[0];
    return mockResponse({...user});
  }
  const response = await api.get(`/users/${userId}`);
  return response.data.user || response.data; // Extract user object from response
};

export const updateUser = async (userId, userData) => {
  if (USE_MOCK_DATA) {
    return mockResponse({
      id: userId,
      ...userData,
      profileImage: userData.profilePicture ? URL.createObjectURL(userData.profilePicture) : '/api/placeholder/200/200'
    });
  }

  try {
    console.log('Sending updateUser request for userId:', userId);
    console.log('userData is FormData:', userData instanceof FormData);

    // For FormData, axios automatically sets the correct Content-Type with boundary
    // The interceptor will add the Authorization header automatically
    const response = await api.put(`/users/${userId}`, userData);
    console.log('updateUser response received:', response.status);
    console.log('updateUser response data:', response.data);

    return response.data.user || response.data;
  } catch (error) {
    console.error('updateUser error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    throw error;
  }
};

// Helper function to transform track data from backend to frontend format
const transformTrack = (track, currentUserId = null) => {
  if (!track) return null;

  // Helper to construct proper image URL
  const getCoverArtUrl = (coverKey) => {
    if (!coverKey) return null;
    // If it already starts with /uploads, use as-is with full URL
    if (coverKey.startsWith('/uploads/')) return `http://localhost:5001${coverKey}`;
    // If it's just a filename or relative path, construct full path
    const filename = coverKey.split('/').pop();
    return `http://localhost:5001/uploads/covers/${filename}`;
  };

  // Helper to construct audio URL
  const getAudioUrl = (s3Key) => {
    if (!s3Key) return null;
    // If it already starts with /uploads, use as-is with full URL
    if (s3Key.startsWith('/uploads/')) return `http://localhost:5001${s3Key}`;
    // If it's just a filename or relative path, construct full path
    const filename = s3Key.split('/').pop();
    return `http://localhost:5001/uploads/tracks/${filename}`;
  };

  return {
    ...track,
    // Map cover_image_key to coverArt for frontend compatibility
    coverArt: getCoverArtUrl(track.cover_image_key),
    // Map s3_key to audioUrl for audio player
    audioUrl: getAudioUrl(track.s3_key),
    // Calculate isLiked based on likes array and current user
    isLiked: currentUserId && track.likes ? track.likes.some(like => like.userId === currentUserId) : false,
    // Keep original fields
    likes: track.likes || [],
    comments: track.comments || []
  };
};

// Helper to get current user ID from localStorage
const getCurrentUserId = () => {
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.id;
    }
  } catch (e) {
    console.error('Error getting current user:', e);
  }
  return null;
};

// ===================
// Track API
// ===================
export const getTracks = async (params = {}) => {
  if (USE_MOCK_DATA) {
    let tracks = [...mockData.tracks];

    // Apply genre filter
    if (params.genre && params.genre !== 'all') {
      tracks = tracks.filter(track => track.genre === params.genre);
    }

    // Apply search filter
    if (params.search) {
      const search = params.search.toLowerCase();
      tracks = tracks.filter(track =>
        track.title.toLowerCase().includes(search) ||
        track.artist.toLowerCase().includes(search)
      );
    }

    // Apply liked filter
    if (params.liked) {
      tracks = tracks.filter(track => track.isLiked);
    }

    // Apply sorting
    if (params.sort) {
      switch (params.sort) {
        case 'recent':
          tracks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'popular':
          tracks.sort((a, b) => b.playCount - a.playCount);
          break;
        case 'az':
          tracks.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'za':
          tracks.sort((a, b) => b.title.localeCompare(a.title));
          break;
        default:
          break;
      }
    }

    // Apply limit
    if (params.limit) {
      tracks = tracks.slice(0, params.limit);
    }

    return mockResponse([...tracks]);
  }
  const response = await api.get('/tracks', { params });
  const tracks = response.data.tracks || response.data;
  const currentUserId = getCurrentUserId();
  // Transform tracks to frontend format
  return Array.isArray(tracks) ? tracks.map(track => transformTrack(track, currentUserId)) : tracks;
};

export const getTrackById = async (trackId) => {
  if (USE_MOCK_DATA) {
    const track = mockData.tracks.find(t => t.id === trackId) || mockData.tracks[0];
    // Add some related tracks by the same artist
    const artistTracks = mockData.tracks
      .filter(t => t.artistId === track.artistId && t.id !== track.id)
      .slice(0, 5);
    return mockResponse({...track, artistTracks});
  }
  const response = await api.get(`/tracks/${trackId}`);
  const track = response.data.track || response.data;
  const currentUserId = getCurrentUserId();
  return transformTrack(track, currentUserId);
};

export const uploadTrack = async (trackData) => {
  if (USE_MOCK_DATA) {
    const title = trackData.get ? trackData.get('title') : trackData.title || 'New Track';
    const artist = trackData.get ? trackData.get('artist') : trackData.artist || 'Current User';

    return mockResponse({
      id: 'track-new',
      title: title,
      artist: artist,
      artistId: 'user-1',
      coverArt: '/api/placeholder/300/300',
      createdAt: new Date().toISOString()
    });
  }
  const response = await api.post('/tracks/upload', trackData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  const track = response.data.track || response.data;
  const currentUserId = getCurrentUserId();
  return transformTrack(track, currentUserId);
};

export const updateTrack = async (trackId, trackData) => {
  if (USE_MOCK_DATA) {
    return mockResponse({ success: true });
  }
  const response = await api.put(`/tracks/${trackId}`, trackData);
  return response.data.track || response.data;
};

export const deleteTrack = async (trackId) => {
  if (USE_MOCK_DATA) {
    return mockResponse({ success: true });
  }
  const response = await api.delete(`/tracks/${trackId}`);
  return response.data;
};

// ===================
// Playlist API
// ===================
export const getPlaylists = async (params = {}) => {
  if (USE_MOCK_DATA) {
    let playlists = [...mockData.playlists];

    // Filter by user ID
    if (params.userId) {
      playlists = playlists.filter(p => p.ownerId === params.userId);
    }

    // Filter featured playlists
    if (params.featured) {
      playlists = playlists.slice(0, 5); // Just use the first few as "featured"
    }

    // Apply search filter
    if (params.search) {
      const search = params.search.toLowerCase();
      playlists = playlists.filter(playlist =>
        playlist.name.toLowerCase().includes(search) ||
        playlist.ownerName.toLowerCase().includes(search)
      );
    }

    // Apply limit
    if (params.limit) {
      playlists = playlists.slice(0, params.limit);
    }

    return mockResponse([...playlists]);
  }
  const response = await api.get('/playlists', { params });
  return response.data;
};

export const createPlaylist = async (playlistData) => {
  if (USE_MOCK_DATA) {
    const name = playlistData.get ? playlistData.get('name') : playlistData.name || 'New Playlist';
    const description = playlistData.get ? playlistData.get('description') : playlistData.description || '';

    return mockResponse({
      id: 'playlist-new',
      name: name,
      ownerName: 'Current User',
      ownerId: 'user-1',
      coverArt: '/api/placeholder/300/300',
      trackCount: 0,
      tracks: [],
      createdAt: new Date().toISOString(),
      description: description
    });
  }
  const response = await api.post('/playlists', playlistData);
  return response.data.playlist || response.data; // Extract playlist object from response
};

export const addTrackToPlaylist = async (playlistId, trackId) => {
  if (USE_MOCK_DATA) {
    return mockResponse({ success: true });
  }
  const response = await api.post(`/playlists/${playlistId}/tracks/${trackId}`);
  return response.data;
};

// ===================
// Social API
// ===================
export const likeTrack = async (trackId) => {
  if (USE_MOCK_DATA) {
    return mockResponse({ success: true });
  }
  const response = await api.post(`/social/tracks/${trackId}/like`);
  return response.data;
};

export const addComment = async (trackId, comment) => {
  if (USE_MOCK_DATA) {
    return mockResponse({
      id: `comment-new-${Date.now()}`,
      userId: 'user-1',
      username: 'Current User',
      userAvatar: '/api/placeholder/50/50',
      content: comment,
      createdAt: new Date().toISOString()
    });
  }
  const response = await api.post(`/social/tracks/${trackId}/comments`, { content: comment });
  return response.data;
};

export const followUser = async (followeeId) => {
  if (USE_MOCK_DATA) {
    return mockResponse({ success: true });
  }
  const response = await api.post(`/social/users/${followeeId}/follow`);
  return response.data;
};

// ===================
// Notifications API
// ===================
export const getNotifications = async () => {
  if (USE_MOCK_DATA) {
    return mockResponse([...mockData.notifications]);
  }
  const response = await api.get('/notifications');
  return response.data.notifications || response.data; // Extract notifications array from response
};

// ===================
// Recommendations API
// ===================
export const getRecommendations = async () => {
  if (USE_MOCK_DATA) {
    // Just return some random tracks as "recommendations"
    const randomTracks = [...mockData.tracks]
      .sort(() => 0.5 - Math.random())
      .slice(0, 10)
      .map(track => ({...track}));
    return mockResponse(randomTracks);
  }
  const response = await api.get('/recommendations');
  const recommendations = response.data.recommendations || response.data;
  const currentUserId = getCurrentUserId();
  // Transform recommendations to frontend format
  return Array.isArray(recommendations) ? recommendations.map(track => transformTrack(track, currentUserId)) : recommendations;
};
// ===================
// Search API
// ===================
export const searchTracks = async (searchQuery) => {
  if (USE_MOCK_DATA) {
    const search = searchQuery.toLowerCase();
    const results = mockData.tracks.filter(track =>
      track.title.toLowerCase().includes(search) ||
      track.artist.toLowerCase().includes(search)
    );
    return mockResponse(results);
  }

  const response = await api.get(`/tracks/search?q=${encodeURIComponent(searchQuery)}`);
  return response.data;
};

// ===================
// Playlist API
// ===================
export const getPlaylistById = async (playlistId) => {
  if (USE_MOCK_DATA) {
    const playlist = mockData.playlists.find(p => p.id === playlistId);
    if (playlist) {
      return mockResponse(playlist);
    } else {
      console.warn(`Playlist with id ${playlistId} not found in mock data.`);
      return mockResponse(null); // Or throw an error, depending on your needs
    }
  }

  const response = await api.get(`/playlists/${playlistId}`);
  return response.data.playlist || response.data; // Extract playlist object from response
};

// ===================
// Album API
// ===================
export const getAlbums = async (params = {}) => {
  if (USE_MOCK_DATA) {
    return mockResponse([]);
  }
  const response = await api.get('/albums', { params });
  return response.data.albums || response.data;
};

export const getMyAlbums = async () => {
  const response = await api.get('/albums/my');
  return response.data.albums || response.data;
};

export const getAlbumById = async (albumId) => {
  const response = await api.get(`/albums/${albumId}`);
  return response.data.album || response.data;
};

export const createAlbum = async (albumData) => {
  const response = await api.post('/albums', albumData, {
    headers: albumData instanceof FormData ? {} : { 'Content-Type': 'application/json' }
  });
  return response.data.album || response.data;
};

export const updateAlbum = async (albumId, albumData) => {
  const response = await api.put(`/albums/${albumId}`, albumData);
  return response.data.album || response.data;
};

export const deleteAlbum = async (albumId) => {
  const response = await api.delete(`/albums/${albumId}`);
  return response.data;
};

export const addTrackToAlbum = async (albumId, trackId, trackNumber) => {
  const response = await api.post(`/albums/${albumId}/tracks`, { trackId, trackNumber });
  return response.data.album || response.data;
};

export const removeTrackFromAlbum = async (albumId, trackId) => {
  const response = await api.delete(`/albums/${albumId}/tracks/${trackId}`);
  return response.data;
};

export default api;