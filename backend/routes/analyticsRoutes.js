// routes/analyticsRoutes.js
const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middlewares/auth');
const { authorize } = require('../middlewares/authorization');

const router = express.Router();

// ==========================================
// BASIC ANALYTICS
// ==========================================

// Get track analytics
// GET /api/analytics/tracks/:trackId/analytics
router.get('/tracks/:trackId/analytics', auth, analyticsController.getTrackAnalytics);

// Get user analytics
// GET /api/analytics/users/:userId/analytics
router.get('/users/:userId/analytics', auth, analyticsController.getUserAnalytics);

// Get top tracks
// GET /api/analytics/top-tracks?limit=10&sortBy=play_count
router.get('/top-tracks', auth, analyticsController.getTopTracks);

// Get total number of tracks
// GET /api/analytics/tracks/total
router.get('/tracks/total', auth, authorize(['admin']), analyticsController.getTotalNumberOfTracks);

// ==========================================
// ADVANCED ANALYTICS
// ==========================================

// Get track plays over time
// GET /api/analytics/tracks/:trackId/plays-over-time?period=30d
router.get('/tracks/:trackId/plays-over-time', auth, analyticsController.getTrackPlaysOverTime);

// Get creator analytics (own tracks)
// GET /api/analytics/creator/stats?period=30d
router.get('/creator/stats', auth, authorize(['creator', 'admin']), analyticsController.getCreatorAnalytics);

// Get listener demographics (creator only)
// GET /api/analytics/creator/demographics
router.get('/creator/demographics', auth, authorize(['creator', 'admin']), analyticsController.getListenerDemographics);

// Get user growth over time (admin only)
// GET /api/analytics/admin/user-growth?period=30d
router.get('/admin/user-growth', auth, authorize(['admin']), analyticsController.getUserGrowthOverTime);

// Get track upload trends (admin only)
// GET /api/analytics/admin/upload-trends?period=30d
router.get('/admin/upload-trends', auth, authorize(['admin']), analyticsController.getTrackUploadTrends);

// Get most active users (admin only)
// GET /api/analytics/admin/active-users?limit=20&type=plays
router.get('/admin/active-users', auth, authorize(['admin']), analyticsController.getMostActiveUsers);

module.exports = router;