// routes/socialRoutes.js
const express = require('express');
const likeController = require('../controllers/likeController');
const commentController = require('../controllers/commentController');
const followController = require('../controllers/followController');
const auth = require('../middlewares/auth');
const { authorize } = require("../middlewares/authorization");

const router = express.Router();

// Like a track (protected route - any authenticated user)
router.post('/tracks/:trackId/like', auth, likeController.likeTrack);

// Unlike a track (protected route - any authenticated user)
router.delete('/tracks/:trackId/like', auth, likeController.unlikeTrack);

// Add a comment to a track (protected route - any authenticated user)
router.post('/tracks/:trackId/comments', auth, commentController.addComment);

// Delete a comment (protected route - any authenticated user)
router.delete('/comments/:id', auth, commentController.deleteComment);

// Follow a user (protected route - any authenticated user)
router.post('/users/:followeeId/follow', auth, followController.followUser);

// Unfollow a user (protected route - any authenticated user)
router.delete('/users/:followeeId/unfollow', auth, followController.unfollowUser);

module.exports = router;