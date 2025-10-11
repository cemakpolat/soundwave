// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import { NotificationProvider } from './context/NotificationContext';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PlayerAuthBridge from './components/PlayerAuthBridge';
import { useAuth } from './hooks/useAuth';

// Pages
import Home from './pages/Home';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Discover from './pages/Discover';
import TrackDetailPage from './pages/TrackDetailPage';
import PlaylistDetailPage from './pages/PlaylistDetailPage';
import UploadTrack from './pages/UploadTrack';
import UserProfilePage from './pages/UserProfilPage';
import YourLibrary from './pages/YourLibrary';
import NotificationsPage from './pages/NotificationPage';
import CreatePlaylistPage from './pages/CreatePlayListPage';
import SearchResultsPage from './pages/SearchResultPage';
import CollectionTracksPage from './pages/CollectionTracksPage';
import Settings from './pages/Settings';
import AlbumsPage from './pages/AlbumsPage';
import AlbumDetailPage from './pages/AlbumDetailPage';
import CreateAlbum from './pages/CreateAlbum';

// Creator Pages
import CreatorDashboard from './pages/creator/CreatorDashboard';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUserManagement from './pages/admin/AdminUserManagement';
import AdminTrackManagement from './pages/admin/AdminTrackManagement';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';


// Placeholder pages (Consider moving these to a separate folder if they become more complex)

const SearchPage = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-spotify-white mb-6">Search</h1>
    <p className="text-spotify-light mb-4">Use the search bar above to find tracks, artists, and playlists.</p>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
      {['Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 'Classical', 'R&B', 'Country', 'Folk', 'Blues'].map(genre => (
        <div
          key={genre}
          className="bg-gradient-to-br from-purple-500 to-indigo-700 rounded-lg aspect-square flex items-center justify-center p-4 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => alert(`${genre} category clicked`)}
        >
          <span className="text-white font-bold text-lg">{genre}</span>
        </div>
      ))}
    </div>
  </div>
);

const PopularPage = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-spotify-white mb-6">Popular Tracks</h1>
    <p className="text-spotify-light">Popular tracks will appear here.</p>
  </div>
);


// Role-Based Authorization Wrappers
const withRole = (Component, allowedRoles) => {
  return function RoleBasedComponent(props) {
    const { currentUser } = useAuth();

    console.log("withRole: Checking user:", currentUser?.username, " (role:", currentUser?.role, ") against allowed roles:", allowedRoles); // <-- ADD USERNAME

    if (!currentUser || !currentUser.role) {
      console.log("withRole: Redirecting - No user or role.");
      return <Navigate to="/" replace />;
    }

    const hasRequiredRole = allowedRoles.includes(currentUser.role);
    console.log("withRole: Has Required Role?", hasRequiredRole);

    if (!hasRequiredRole) {
      console.log("withRole: Redirecting - Insufficient role.");
      return <Navigate to="/" replace />;
    }

    console.log("withRole: Role check passed - rendering component.");
    return <Component {...props} />;
  };
};
// Example Usage:
const AdminRoute = withRole(React.Fragment, ['admin']);
const CreatorRoute = withRole(React.Fragment, ['creator', 'admin']); // Creators and Admins can access

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <PlayerProvider>
          <NotificationProvider>
            {/* Bridge component to connect Auth and Player contexts */}
            <PlayerAuthBridge />
            <Routes>
              {/* Auth routes - No layout */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Main Layout - Everything inside this uses MainLayout */}
              <Route path="/" element={<MainLayout />}>

                {/* Public Routes */}
                <Route index element={<Home />} />
                <Route path="discover" element={<Discover />} />
                <Route path="track/:trackId" element={<TrackDetailPage />} />
                <Route path="playlist/:playlistId" element={<PlaylistDetailPage />} />
                <Route path="profile/:userId" element={<UserProfilePage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="search/:query" element={<SearchResultsPage />} />
                <Route path="popular" element={<PopularPage />} />
                <Route path="collection/tracks" element={<CollectionTracksPage />} />
                <Route path="albums" element={<AlbumsPage />} />
                <Route path="album/:albumId" element={<AlbumDetailPage />} />


                {/* User Protected Routes */}
                <Route
                  path="settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="library"
                  element={
                    <ProtectedRoute>
                      <YourLibrary />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="create-playlist"
                  element={
                    <ProtectedRoute>
                      <CreatePlaylistPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="notifications"
                  element={
                    <ProtectedRoute>
                      <NotificationsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Creator Routes - Only accessible to users with the 'creator' role */}
                <Route
                  path="upload"
                  element={
                    <ProtectedRoute>
                      <CreatorRoute>
                        <UploadTrack />
                      </CreatorRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="create-album"
                  element={
                    <ProtectedRoute>
                      <CreatorRoute>
                        <CreateAlbum />
                      </CreatorRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="creator/dashboard"
                  element={
                    <ProtectedRoute>
                      <CreatorRoute>
                        <CreatorDashboard />
                      </CreatorRoute>
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes - Only accessible to users with the 'admin' role */}
                <Route
                  path="admin"
                  element={
                    <ProtectedRoute>
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="admin/users"
                  element={
                    <ProtectedRoute>
                      <AdminRoute>
                        <AdminUserManagement />
                      </AdminRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="admin/tracks"
                  element={
                    <ProtectedRoute>
                      <AdminRoute>
                        <AdminTrackManagement />
                      </AdminRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="admin/reports"
                  element={
                    <ProtectedRoute>
                      <AdminRoute>
                        <AdminReports />
                      </AdminRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="admin/settings"
                  element={
                    <ProtectedRoute>
                      <AdminRoute>
                        <AdminSettings />
                      </AdminRoute>
                    </ProtectedRoute>
                  }
                />


                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </NotificationProvider>
        </PlayerProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;