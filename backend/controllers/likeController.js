// controllers/likeController.js
const { Like, Track, User } = require('../models');

// Like a track
const likeTrack = async (req, res) => {
  try {
    const { trackId } = req.params;
    const userId = req.user.id; // Access user ID correctly

    const track = await Track.findByPk(trackId, {
      include: [
        {
          model: User,
          attributes: ['id', 'username'], // Include user details to check ownership
        },
      ],
    });

    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    // Prevent liking your own track
    if (track.userId === userId) {
      return res
        .status(400)
        .json({ message: 'You cannot like your own track' });
    }

    // Check if the user already liked the track
    const existingLike = await Like.findOne({ where: { userId, trackId } });
    if (existingLike) {
      return res
        .status(400)
        .json({ message: 'You already liked this track' });
    }

    // Create the like
    await Like.create({ userId, trackId });

    res.status(201).json({ message: 'Track liked successfully' });
  } catch (error) {
    console.error('Error liking track:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Unlike a track
const unlikeTrack = async (req, res) => {
  try {
    const { trackId } = req.params;
    const userId = req.user.id; // Access user ID correctly

    const like = await Like.findOne({ where: { userId, trackId } });
    if (!like) {
      return res.status(404).json({ message: 'Like not found' });
    }

    // Delete the like
    await like.destroy();

    res.status(200).json({ message: 'Track unliked successfully' });
  } catch (error) {
    console.error('Error unliking track:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  likeTrack,
  unlikeTrack,
};