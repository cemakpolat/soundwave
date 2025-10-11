// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const { upload } = require('../config/storage');
const auth = require('../middlewares/auth');
const { authorize } = require("../middlewares/authorization");

const router = express.Router();

// Get user details (protected route - any authenticated user)
router.get('/:id', auth, userController.getUser);

// Update user profile (protected route - any authenticated user)
router.put('/:id', auth, upload.single('profilePicture'), userController.updateUser);

// Delete user account (protected route - admin only)
router.delete('/:id', auth, authorize(['admin']), userController.deleteUser);

module.exports = router;