// routes/searchRoutes.js
const express = require('express');
const searchController = require('../controllers/searchController');
const auth = require('../middlewares/auth');

const router = express.Router();

// ==========================================
// SEARCH ENDPOINTS
// ==========================================

// Search tracks
// GET /api/search/tracks?q=jazz&genre=jazz&minDuration=120&sortBy=popular
router.get('/tracks', searchController.searchTracks);

// Search artists
// GET /api/search/artists?q=john
router.get('/artists', searchController.searchArtists);

// Search playlists
// GET /api/search/playlists?q=workout
router.get('/playlists', searchController.searchPlaylists);

// ==========================================
// BROWSE ENDPOINTS
// ==========================================

// Browse by genre
// GET /api/search/browse/genre/:genre
router.get('/browse/genre/:genre', searchController.browseByGenre);

// Get featured tracks
// GET /api/search/browse/featured
router.get('/browse/featured', searchController.getFeaturedTracks);

// Get new releases
// GET /api/search/browse/new-releases
router.get('/browse/new-releases', searchController.getNewReleases);

// Get trending tracks
// GET /api/search/browse/trending
router.get('/browse/trending', searchController.getTrendingTracks);

module.exports = router;
