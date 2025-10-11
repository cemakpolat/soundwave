// routes/playlistRoutes.js
const express = require('express');
const playlistController = require('../controllers/playlistController');
const auth = require('../middlewares/auth');
const { authorize } = require("../middlewares/authorization");
const { body, param, validationResult } = require('express-validator');

const router = express.Router();

// Get all playlists (public route - supports filters)
router.get('/', playlistController.getAllPlaylists);

// Create a playlist (protected route - any authenticated user)
router.post('/', auth, playlistController.createPlaylist);

// Reorder tracks in a playlist (protected route - any authenticated user)
router.put('/:playlistId/reorder', auth, playlistController.reorderTracksInPlaylist);

// Add a track to a playlist (protected route - any authenticated user)
router.post('/:playlistId/tracks/:trackId', auth, playlistController.addTrackToPlaylist);

// Remove a track from a playlist (protected route - any authenticated user)
router.delete('/:playlistId/tracks/:trackId', auth, playlistController.removeTrackFromPlaylist);

// Get all playlists for the logged-in user (protected route - any authenticated user)
router.get('/user', auth, playlistController.getUserPlaylists);

// Get a single playlist by ID (protected route - any authenticated user)
router.get('/:id', auth, playlistController.getPlaylistById);

// Update playlist details (protected route - any authenticated user)
router.put('/:id', auth, playlistController.updatePlaylist);

// Delete a playlist (protected route - any authenticated user)
router.delete('/:id', auth, playlistController.deletePlaylist);

// Get playlist queue (protected route - any authenticated user)
router.get('/:playlistId/queue', auth, playlistController.getPlaylistQueue);

module.exports = router;