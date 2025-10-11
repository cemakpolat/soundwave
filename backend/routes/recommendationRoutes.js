// routes/recommendationRoutes.js
const express = require('express');
const recommendationController = require('../controllers/recommendationController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Get personalized recommendations
// GET /api/recommendations?limit=20
router.get('/', auth, recommendationController.getRecommendations);

// Get Discover Weekly
// GET /api/recommendations/discover-weekly
router.get('/discover-weekly', auth, recommendationController.getDiscoverWeekly);

// Get Daily Mix
// GET /api/recommendations/daily-mix?mixNumber=1
router.get('/daily-mix', auth, recommendationController.getDailyMix);

// Get similar tracks
// GET /api/recommendations/similar/:id
router.get('/similar/:id', recommendationController.getSimilarTracks);

// Get tracks related by collaborative filtering
// GET /api/recommendations/related
router.get('/related', auth, recommendationController.getRelatedByLikes);

module.exports = router;