// routes/albumRoutes.js
const express = require('express');
const albumController = require('../controllers/albumController');
const auth = require('../middlewares/auth');
const { authorize } = require('../middlewares/authorization');
const { upload } = require('../config/storage');

const router = express.Router();

// ==========================================
// PUBLIC ALBUM ENDPOINTS
// ==========================================

// Get all published albums
// GET /api/albums?page=1&limit=20&genre=rock&userId=5
router.get('/', albumController.getAllAlbums);

// Get album by ID
// GET /api/albums/:id
router.get('/:id', albumController.getAlbumById);

// ==========================================
// CREATOR ALBUM ENDPOINTS
// ==========================================

// Get own albums (creator only)
// GET /api/albums/my-albums
router.get('/me/my-albums', auth, authorize(['creator', 'admin']), albumController.getMyAlbums);

// Create album (creator only)
// POST /api/albums
router.post(
  '/',
  auth,
  authorize(['creator', 'admin']),
  upload.single('coverImage'),
  albumController.createAlbum
);

// Update album (creator only)
// PUT /api/albums/:id
router.put('/:id', auth, authorize(['creator', 'admin']), albumController.updateAlbum);

// Delete album (creator only)
// DELETE /api/albums/:id
router.delete('/:id', auth, authorize(['creator', 'admin']), albumController.deleteAlbum);

// ==========================================
// ALBUM TRACK MANAGEMENT
// ==========================================

// Add track to album
// POST /api/albums/:id/tracks
router.post('/:id/tracks', auth, authorize(['creator', 'admin']), albumController.addTrackToAlbum);

// Remove track from album
// DELETE /api/albums/:id/tracks/:trackId
router.delete('/:id/tracks/:trackId', auth, authorize(['creator', 'admin']), albumController.removeTrackFromAlbum);

module.exports = router;
