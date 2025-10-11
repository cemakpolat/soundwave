// controllers/followController.js
const { Follow, User } = require('../models');

// Follow a user
const followUser = async (req, res) => {
  try {
    const { followeeId } = req.params;
    const { userId } = req.user;

    if (userId === followeeId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const followee = await User.findByPk(followeeId);
    if (!followee) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user already follows the followee
    const existingFollow = await Follow.findOne({ where: { followerId: userId, followeeId } });
    if (existingFollow) {
      return res.status(400).json({ message: 'You already follow this user' });
    }

    // Create the follow relationship
    await Follow.create({ followerId: userId, followeeId });

    res.status(201).json({ message: 'User followed successfully' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  try {
    const { followeeId } = req.params;
    const { userId } = req.user;

    const follow = await Follow.findOne({ where: { followerId: userId, followeeId } });
    if (!follow) {
      return res.status(404).json({ message: 'Follow relationship not found' });
    }

    // Delete the follow relationship
    await follow.destroy();

    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  followUser,
  unfollowUser,
};