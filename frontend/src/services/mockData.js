// src/services/mockData.js

// Mock user data with role information
const users = [
    {
      id: 1,
      email: 'user@example.com',
      password: 'password',
      name: 'Regular User',
      username: 'regularuser',
      profilePicture: '/mock-images/user1.jpg',
      role: 'user',
      createdAt: '2023-01-01T00:00:00Z',
      stats: {
        followers: 23,
        following: 45,
        tracks: 5
      }
    },
    {
      id: 2,
      email: 'creator@example.com',
      password: 'password',
      name: 'Content Creator',
      username: 'contentcreator',
      profilePicture: '/mock-images/creator1.jpg',
      role: 'creator',
      createdAt: '2023-01-15T00:00:00Z',
      stats: {
        followers: 1250,
        following: 84,
        tracks: 37
      }
    },
    {
      id: 3,
      email: 'admin@example.com',
      password: 'password',
      name: 'Admin User',
      username: 'adminuser',
      profilePicture: '/mock-images/admin1.jpg',
      role: 'admin',
      createdAt: '2022-11-05T00:00:00Z',
      stats: {
        followers: 5,
        following: 10,
        tracks: 0
      }
    }
  ];
  
  // Mock tracks data
  const tracks = [
    // ... Your existing mock tracks data with added status and creator information
  ];
  
  // Mock playlists data
  const playlists = [
    // ... Your existing mock playlists data
  ];
  
  // Mock Authentication Service
  export const mockAuthService = {
    login: async (email, password) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = users.find(u => u.email === email && u.password === password);
          
          if (user) {
            // Create a copy without the password
            const { password, ...userWithoutPassword } = user;
            
            // Store mock token in localStorage for consistency with real API
            localStorage.setItem('auth_token', 'mock-jwt-token');
            localStorage.setItem('refresh_token', 'mock-refresh-token');
            localStorage.setItem('user_role', user.role);
            localStorage.setItem('user_id', user.id.toString());
            
            resolve(userWithoutPassword);
          } else {
            reject(new Error('Invalid email or password'));
          }
        }, 800); // Simulate network delay
      });
    },
    
    register: async (userData) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newUser = {
            id: users.length + 1,
            email: userData.email,
            password: userData.password,
            name: userData.name,
            username: userData.username || userData.email.split('@')[0],
            profilePicture: '/mock-images/default-avatar.jpg',
            role: 'user', // Default role for new users
            createdAt: new Date().toISOString(),
            stats: {
              followers: 0,
              following: 0,
              tracks: 0
            }
          };
          
          users.push(newUser);
          
          const { password, ...userWithoutPassword } = newUser;
          resolve(userWithoutPassword);
        }, 1000);
      });
    },
    
    logout: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_role');
          localStorage.removeItem('user_id');
          resolve(true);
        }, 300);
      });
    },
    
    getCurrentUser: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const userId = localStorage.getItem('user_id');
          
          if (!userId) {
            resolve(null);
            return;
          }
          
          const user = users.find(u => u.id === parseInt(userId));
          
          if (user) {
            const { password, ...userWithoutPassword } = user;
            resolve(userWithoutPassword);
          } else {
            resolve(null);
          }
        }, 500);
      });
    }
  };
  
  // Mock Tracks Service
  export const mockTracksService = {
    getAllTracks: async (params = {}) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          let filteredTracks = [...tracks];
          
          // Apply filters if provided
          if (params.search) {
            const searchLower = params.search.toLowerCase();
            filteredTracks = filteredTracks.filter(track => 
              track.title.toLowerCase().includes(searchLower) || 
              track.artist.toLowerCase().includes(searchLower)
            );
          }
          
          // Sort if needed
          if (params.sort) {
            filteredTracks.sort((a, b) => {
              if (params.sort === 'popular') {
                return b.plays - a.plays;
              } else if (params.sort === 'newest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
              }
              return 0;
            });
          }
          
          // Pagination
          const page = params.page || 1;
          const limit = params.limit || 20;
          const startIndex = (page - 1) * limit;
          const endIndex = page * limit;
          const paginatedTracks = filteredTracks.slice(startIndex, endIndex);
          
          resolve({
            tracks: paginatedTracks,
            total: filteredTracks.length,
            page,
            limit,
            totalPages: Math.ceil(filteredTracks.length / limit)
          });
        }, 800);
      });
    },
    
    getTrackById: async (id) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const track = tracks.find(t => t.id === parseInt(id));
          
          if (track) {
            resolve(track);
          } else {
            reject(new Error('Track not found'));
          }
        }, 500);
      });
    },
    
    uploadTrack: async (trackData) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const userId = localStorage.getItem('user_id');
          const user = users.find(u => u.id === parseInt(userId));
          
          const newTrack = {
            id: tracks.length + 1,
            title: trackData.title,
            description: trackData.description || '',
            coverImage: trackData.coverImageUrl || '/mock-images/default-cover.jpg',
            audioUrl: '/mock-audio/sample-track.mp3',
            duration: 235, // Sample duration in seconds
            artist: user.name,
            artistId: user.id,
            createdAt: new Date().toISOString(),
            plays: 0,
            likes: 0,
            comments: [],
            status: 'pending' // Tracks start with pending status
          };
          
          tracks.push(newTrack);
          resolve(newTrack);
        }, 1500);
      });
    },
    
    updateTrack: async (id, updateData) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const trackIndex = tracks.findIndex(t => t.id === parseInt(id));
          
          if (trackIndex === -1) {
            reject(new Error('Track not found'));
            return;
          }
          
          const userId = parseInt(localStorage.getItem('user_id'));
          const userRole = localStorage.getItem('user_role');
          
          // Only track owner or admin can update
          if (tracks[trackIndex].artistId !== userId && userRole !== 'admin') {
            reject(new Error('Unauthorized'));
            return;
          }
          
          const updatedTrack = {
            ...tracks[trackIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
          };
          
          tracks[trackIndex] = updatedTrack;
          resolve(updatedTrack);
        }, 700);
      });
    },
    
    deleteTrack: async (id) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const trackIndex = tracks.findIndex(t => t.id === parseInt(id));
          
          if (trackIndex === -1) {
            reject(new Error('Track not found'));
            return;
          }
          
          const userId = parseInt(localStorage.getItem('user_id'));
          const userRole = localStorage.getItem('user_role');
          
          // Only track owner or admin can delete
          if (tracks[trackIndex].artistId !== userId && userRole !== 'admin') {
            reject(new Error('Unauthorized'));
            return;
          }
          
          tracks.splice(trackIndex, 1);
          resolve(true);
        }, 600);
      });
    }
  };
  
  // Mock Playlists Service
  export const mockPlaylistsService = {
    // Implement similar methods as the tracks service but for playlists
    // ...
  };
  
  // Mock Users Service
  export const mockUsersService = {
    // Implement user profile, follow/unfollow functionality
    // ...
  };
  
  // Mock Admin Service
  export const mockAdminService = {
    getAllUsers: async (filters = {}) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          let filteredUsers = [...users].map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
          });
          
          // Apply filters
          if (filters.role) {
            filteredUsers = filteredUsers.filter(user => user.role === filters.role);
          }
          
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredUsers = filteredUsers.filter(user => 
              user.name.toLowerCase().includes(searchLower) || 
              user.email.toLowerCase().includes(searchLower) ||
              user.username.toLowerCase().includes(searchLower)
            );
          }
          
          // Pagination
          const page = filters.page || 1;
          const limit = filters.limit || 20;
          const startIndex = (page - 1) * limit;
          const endIndex = page * limit;
          const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
          
          resolve({
            users: paginatedUsers,
            total: filteredUsers.length,
            page,
            limit,
            totalPages: Math.ceil(filteredUsers.length / limit)
          });
        }, 800);
      });
    },
    
    updateUserStatus: async (userId, status) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const userIndex = users.findIndex(u => u.id === parseInt(userId));
          
          if (userIndex === -1) {
            reject(new Error('User not found'));
            return;
          }
          
          users[userIndex] = {
            ...users[userIndex],
            status: status,
            updatedAt: new Date().toISOString()
          };
          
          const { password, ...userWithoutPassword } = users[userIndex];
          resolve(userWithoutPassword);
        }, 600);
      });
    },
    
    updateUserRole: async (userId, role) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const userIndex = users.findIndex(u => u.id === parseInt(userId));
          
          if (userIndex === -1) {
            reject(new Error('User not found'));
            return;
          }
          
          // Validate role
          if (!['user', 'creator', 'admin'].includes(role)) {
            reject(new Error('Invalid role'));
            return;
          }
          
          users[userIndex] = {
            ...users[userIndex],
            role: role,
            updatedAt: new Date().toISOString()
          };
          
          const { password, ...userWithoutPassword } = users[userIndex];
          resolve(userWithoutPassword);
        }, 600);
      });
    },
    
    getAllTracksAdmin: async (filters = {}) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          let filteredTracks = [...tracks];
          
          // Apply admin-specific filters
          if (filters.status) {
            filteredTracks = filteredTracks.filter(track => track.status === filters.status);
          }
          
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredTracks = filteredTracks.filter(track => 
              track.title.toLowerCase().includes(searchLower) || 
              track.artist.toLowerCase().includes(searchLower)
            );
          }
          
          // Pagination
          const page = filters.page || 1;
          const limit = filters.limit || 20;
          const startIndex = (page - 1) * limit;
          const endIndex = page * limit;
          const paginatedTracks = filteredTracks.slice(startIndex, endIndex);
          
          resolve({
            tracks: paginatedTracks,
            total: filteredTracks.length,
            page,
            limit,
            totalPages: Math.ceil(filteredTracks.length / limit)
          });
        }, 800);
      });
    },
    
    updateTrackStatus: async (trackId, status) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const trackIndex = tracks.findIndex(t => t.id === parseInt(trackId));
          
          if (trackIndex === -1) {
            reject(new Error('Track not found'));
            return;
          }
          
          // Validate status
          if (!['pending', 'approved', 'rejected'].includes(status)) {
            reject(new Error('Invalid status'));
            return;
          }
          
          tracks[trackIndex] = {
            ...tracks[trackIndex],
            status: status,
            updatedAt: new Date().toISOString()
          };
          
          resolve(tracks[trackIndex]);
        }, 600);
      });
    },
    
    // Implement other admin methods (reports, settings, etc.)
    // ...
  };
  
  // Mock Creator Service
  export const mockCreatorService = {
    getDashboardStats: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const userId = parseInt(localStorage.getItem('user_id'));
          const userTracks = tracks.filter(track => track.artistId === userId);
          
          // Calculate stats
          const totalPlays = userTracks.reduce((sum, track) => sum + track.plays, 0);
          const totalLikes = userTracks.reduce((sum, track) => sum + track.likes, 0);
          const totalComments = userTracks.reduce((sum, track) => sum + (track.comments ? track.comments.length : 0), 0);
          
          // Create sample data for charts
          const last30Days = Array(30).fill().map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return date.toISOString().split('T')[0];
          });
          
          const playsData = last30Days.map(date => ({
            date,
            plays: Math.floor(Math.random() * 50) + 10
          }));
          
          const likesData = last30Days.map(date => ({
            date,
            likes: Math.floor(Math.random() * 10) + 1
          }));
          
          // Top tracks
          const topTracks = [...userTracks]
            .sort((a, b) => b.plays - a.plays)
            .slice(0, 5)
            .map(track => ({
              id: track.id,
              title: track.title,
              plays: track.plays,
              likes: track.likes
            }));
          
          resolve({
            totalTracks: userTracks.length,
            totalPlays,
            totalLikes,
            totalComments,
            playsData,
            likesData,
            topTracks,
            recentActivity: [
              {
                type: 'play',
                trackId: userTracks[0]?.id,
                trackTitle: userTracks[0]?.title,
                user: 'Anonymous User',
                timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
              },
              {
                type: 'like',
                trackId: userTracks[0]?.id,
                trackTitle: userTracks[0]?.title,
                user: 'John Doe',
                userId: 4,
                timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString()
              },
              {
                type: 'comment',
                trackId: userTracks[1]?.id,
                trackTitle: userTracks[1]?.title,
                user: 'Jane Smith',
                userId: 5,
                comment: 'Great track! Love the beats.',
                timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString()
              }
            ]
          });
        }, 1000);
      });
    },
    
    getTrackAnalytics: async (trackId) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const track = tracks.find(t => t.id === parseInt(trackId));
          
          if (!track) {
            reject(new Error('Track not found'));
            return;
          }
          
          const userId = parseInt(localStorage.getItem('user_id'));
          
          // Only allow creator to see their own track analytics
          if (track.artistId !== userId) {
            reject(new Error('Unauthorized'));
            return;
          }
          
          // Last 30 days dates
          const last30Days = Array(30).fill().map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return date.toISOString().split('T')[0];
          });
          
          // Generate random play data
          const playsData = last30Days.map(date => ({
            date,
            plays: Math.floor(Math.random() * 30) + 5
          }));
          
          // Sample demographic data
          const demographics = {
            age: [
              { group: '13-17', percentage: 5 },
              { group: '18-24', percentage: 35 },
              { group: '25-34', percentage: 40 },
              { group: '35-44', percentage: 15 },
              { group: '45+', percentage: 5 }
            ],
            gender: [
              { group: 'Male', percentage: 65 },
              { group: 'Female', percentage: 32 },
              { group: 'Other', percentage: 3 }
            ],
            countries: [
              { country: 'United States', percentage: 40 },
              { country: 'United Kingdom', percentage: 15 },
              { country: 'Germany', percentage: 10 },
              { country: 'Canada', percentage: 8 },
              { country: 'Australia', percentage: 7 },
              { country: 'Other', percentage: 20 }
            ]
          };
          
          resolve({
            track: {
              id: track.id,
              title: track.title,
              coverImage: track.coverImage,
              plays: track.plays,
              likes: track.likes,
              comments: track.comments?.length || 0
            },
            playsData,
            sourcesData: [
              { source: 'Direct', percentage: 25 },
              { source: 'Profile Page', percentage: 30 },
              { source: 'Search', percentage: 15 },
              { source: 'Playlists', percentage: 20 },
              { source: 'External Links', percentage: 10 }
            ],
            demographics
          });
        }, 800);
      });
    },
    
    getAudienceStats: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Mock audience growth data
          const last12Months = Array(12).fill().map((_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - (11 - i));
            return date.toISOString().split('T')[0].substring(0, 7); // YYYY-MM format
          });
          
          const followerGrowth = last12Months.map((month, i) => ({
            month,
            followers: 100 + (i * 12) + Math.floor(Math.random() * 20)
          }));
          
          // Mock audience demographics
          const demographics = {
            age: [
              { group: '13-17', percentage: 8 },
              { group: '18-24', percentage: 32 },
              { group: '25-34', percentage: 38 },
              { group: '35-44', percentage: 16 },
              { group: '45+', percentage: 6 }
            ],
            gender: [
              { group: 'Male', percentage: 62 },
              { group: 'Female', percentage: 35 },
              { group: 'Other', percentage: 3 }
            ],
            countries: [
              { country: 'United States', percentage: 38 },
              { country: 'United Kingdom', percentage: 14 },
              { country: 'Germany', percentage: 12 },
              { country: 'Canada', percentage: 9 },
              { country: 'Australia', percentage: 6 },
              { country: 'Other', percentage: 21 }
            ]
          };
          
          resolve({
            totalFollowers: 242,
            newFollowersThisMonth: 18,
            followerGrowth,
            demographics,
            topEngagers: [
              {
                id: 4,
                name: 'John Doe',
                username: 'johndoe',
                profilePicture: '/mock-images/user2.jpg',
                engagement: 'High',
                likes: 42,
                comments: 7
              },
              {
                id: 5,
                name: 'Jane Smith',
                username: 'janesmith',
                profilePicture: '/mock-images/user3.jpg',
                engagement: 'High',
                likes: 38,
                comments: 12
              },
              {
                id: 6,
                name: 'Mike Johnson',
                username: 'mikej',
                profilePicture: '/mock-images/user4.jpg',
                engagement: 'Medium',
                likes: 26,
                comments: 3
              }
            ]
          });
        }, 900);
      });
    }
  };