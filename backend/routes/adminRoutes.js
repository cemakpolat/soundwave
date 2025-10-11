// routes/adminRoutes.js
const express = require('express');
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/auth');
const { authorize } = require('../middlewares/authorization');

const router = express.Router();

// ==========================================
// USER MANAGEMENT (Admin Only)
// ==========================================

// Get all users with filters
router.get('/users', auth, authorize(['admin']), adminController.getAllUsers);

// Get user details by ID
router.get('/users/:id', auth, authorize(['admin']), adminController.getUserDetails);

// Update user (change role, ban status, etc.)
router.put('/users/:id', auth, authorize(['admin']), adminController.updateUserByAdmin);

// Delete user
router.delete('/users/:id', auth, authorize(['admin']), adminController.deleteUserByAdmin);

// Ban a user
router.put('/users/:id/ban', auth, authorize(['admin']), adminController.banUser);

// Unban a user
router.put('/users/:id/unban', auth, authorize(['admin']), adminController.unbanUser);

// ==========================================
// CONTENT MANAGEMENT (Admin Only)
// ==========================================

// Get all tracks with filters
router.get('/tracks', auth, authorize(['admin']), adminController.getAllTracks);

// Approve a track
router.put('/tracks/:id/approve', auth, authorize(['admin']), adminController.approveTrack);

// Delete any track
router.delete('/tracks/:id', auth, authorize(['admin']), adminController.deleteAnyTrack);

// Get all playlists
router.get('/playlists', auth, authorize(['admin']), adminController.getAllPlaylists);

// Delete any playlist
router.delete('/playlists/:id', auth, authorize(['admin']), adminController.deleteAnyPlaylist);

// Get all comments
router.get('/comments', auth, authorize(['admin']), adminController.getAllComments);

// Delete any comment
router.delete('/comments/:id', auth, authorize(['admin']), adminController.deleteAnyComment);

// ==========================================
// ANALYTICS & STATISTICS (Admin Only)
// ==========================================

// Get platform statistics
router.get('/statistics', auth, authorize(['admin']), adminController.getPlatformStatistics);

module.exports = router;