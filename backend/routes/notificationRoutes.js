// routes/notificationRoutes.js
const express = require('express');
const notificationController = require('../controllers/notificationController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Get notifications (protected route)
router.get('/', auth, notificationController.getNotifications);

module.exports = router;