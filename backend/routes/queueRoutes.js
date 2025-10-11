// routes/queueRoutes.js
const express = require('express');
const queueController = require('../controllers/queueController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Get user's queue
// GET /api/queue
router.get('/', auth, queueController.getQueue);

// Add track to queue
// POST /api/queue
router.post('/', auth, queueController.addToQueue);

// Remove track from queue
// DELETE /api/queue/:id
router.delete('/:id', auth, queueController.removeFromQueue);

// Clear entire queue
// DELETE /api/queue
router.delete('/', auth, queueController.clearQueue);

// Reorder queue
// PUT /api/queue/reorder
router.put('/reorder', auth, queueController.reorderQueue);

module.exports = router;
