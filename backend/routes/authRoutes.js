// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');
const { authorize } = require("../middlewares/authorization");

const router = express.Router();

// Register a new user
router.post('/register', authController.register);

// Login a user
router.post('/login', authController.login);

// Ban a user (admin only)
router.put('/users/:id/ban', auth, authorize(['admin']), authController.banUser);

// Unban a user (admin only)
router.put('/users/:id/unban', auth, authorize(['admin']), authController.unbanUser);

module.exports = router;