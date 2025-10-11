// routes/trackRoutes.js
const express = require('express');
const trackController = require('../controllers/trackController');
const { upload } = require('../config/storage'); // Use new storage config
const auth = require('../middlewares/auth');
const { authorize } = require("../middlewares/authorization");

const router = express.Router();

// Upload a track (protected route - creator or admin)
router.post(
  '/upload',
  auth,
  authorize(['creator', 'admin']),
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  trackController.uploadTrack
);

// Get all tracks (public route - anyone can browse tracks)
router.get('/', trackController.getTracks);

// Get track URL for playback (protected route - any authenticated user)
router.get('/:id/url', auth, trackController.getTrackUrl);

// Get a single track by ID (public route - anyone can view track details)
router.get('/:id', trackController.getTrackById);

// Update track details (protected route - creator or admin)
router.put('/:id', auth, authorize(['creator', 'admin']), trackController.updateTrack);

// Delete a track (protected route - creator or admin)
router.delete('/:id', auth, authorize(['creator', 'admin']), trackController.deleteTrack);

module.exports = router;