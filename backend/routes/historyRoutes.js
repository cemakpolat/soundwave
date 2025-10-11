// routes/historyRoutes.js
const express = require('express');
const historyController = require('../controllers/historyController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Get recently played tracks
// GET /api/history/recently-played
router.get('/recently-played', auth, historyController.getRecentlyPlayed);

// Record a play event
// POST /api/history/tracks/:id/play
router.post('/tracks/:id/play', auth, historyController.recordPlay);

// Get listening statistics
// GET /api/history/stats?period=30d
router.get('/stats', auth, historyController.getListeningStats);

module.exports = router;
