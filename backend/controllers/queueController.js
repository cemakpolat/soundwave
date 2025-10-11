// controllers/queueController.js
const { Queue, Track, User } = require('../models');

// ==========================================
// QUEUE MANAGEMENT FUNCTIONS
// ==========================================

// Get user's queue
const getQueue = async (req, res) => {
  try {
    const userId = req.user.id;

    const queue = await Queue.findAll({
      where: { userId },
      include: [
        {
          model: Track,
          include: [
            {
              model: User,
              attributes: ['id', 'username']
            }
          ]
        }
      ],
      order: [['position', 'ASC']]
    });

    res.status(200).json({ queue });
  } catch (error) {
    console.error('Error fetching queue:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add track to queue
const addToQueue = async (req, res) => {
  try {
    const userId = req.user.id;
    const { trackId, position } = req.body;

    // Verify track exists
    const track = await Track.findByPk(trackId);
    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    // Get current max position
    const maxPosition = await Queue.max('position', { where: { userId } }) || 0;

    // Create queue entry
    const queueEntry = await Queue.create({
      userId,
      trackId,
      position: position !== undefined ? position : maxPosition + 1,
      addedAt: new Date()
    });

    // If a specific position was requested, reorder other items
    if (position !== undefined) {
      await Queue.increment(
        { position: 1 },
        {
          where: {
            userId,
            position: { $gte: position },
            id: { $ne: queueEntry.id }
          }
        }
      );
    }

    const queueWithTrack = await Queue.findByPk(queueEntry.id, {
      include: [
        {
          model: Track,
          include: [{ model: User, attributes: ['id', 'username'] }]
        }
      ]
    });

    res.status(201).json({
      message: 'Track added to queue',
      queueEntry: queueWithTrack
    });
  } catch (error) {
    console.error('Error adding to queue:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove track from queue
const removeFromQueue = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params; // Queue entry ID

    const queueEntry = await Queue.findOne({
      where: {
        id,
        userId
      }
    });

    if (!queueEntry) {
      return res.status(404).json({ message: 'Queue entry not found' });
    }

    const removedPosition = queueEntry.position;

    await queueEntry.destroy();

    // Reorder remaining items
    await Queue.decrement(
      { position: 1 },
      {
        where: {
          userId,
          position: { $gt: removedPosition }
        }
      }
    );

    res.status(200).json({ message: 'Track removed from queue' });
  } catch (error) {
    console.error('Error removing from queue:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Clear entire queue
const clearQueue = async (req, res) => {
  try {
    const userId = req.user.id;

    await Queue.destroy({
      where: { userId }
    });

    res.status(200).json({ message: 'Queue cleared successfully' });
  } catch (error) {
    console.error('Error clearing queue:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reorder queue
const reorderQueue = async (req, res) => {
  try {
    const userId = req.user.id;
    const { queueItems } = req.body; // Array of { id, position }

    if (!Array.isArray(queueItems)) {
      return res.status(400).json({ message: 'queueItems must be an array' });
    }

    // Update positions
    for (const item of queueItems) {
      await Queue.update(
        { position: item.position },
        {
          where: {
            id: item.id,
            userId
          }
        }
      );
    }

    const updatedQueue = await Queue.findAll({
      where: { userId },
      include: [
        {
          model: Track,
          include: [{ model: User, attributes: ['id', 'username'] }]
        }
      ],
      order: [['position', 'ASC']]
    });

    res.status(200).json({
      message: 'Queue reordered successfully',
      queue: updatedQueue
    });
  } catch (error) {
    console.error('Error reordering queue:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getQueue,
  addToQueue,
  removeFromQueue,
  clearQueue,
  reorderQueue
};
