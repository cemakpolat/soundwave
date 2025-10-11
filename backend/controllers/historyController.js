// controllers/historyController.js
const { PlayHistory, Track, User } = require('../models');
const { Op } = require('sequelize');

// ==========================================
// PLAY HISTORY FUNCTIONS
// ==========================================

// Get recently played tracks
const getRecentlyPlayed = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50 } = req.query;

    const history = await PlayHistory.findAll({
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
      order: [['playedAt', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({ history });
  } catch (error) {
    console.error('Error fetching recently played:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Record a play event
const recordPlay = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params; // trackId

    // Verify track exists
    const track = await Track.findByPk(id);
    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    // Create play history entry
    await PlayHistory.create({
      userId,
      trackId: id,
      playedAt: new Date()
    });

    // Increment play count on track (already done in getTrackUrl, but keeping for completeness)
    track.play_count += 1;
    await track.save();

    res.status(201).json({ message: 'Play recorded successfully' });
  } catch (error) {
    console.error('Error recording play:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get listening statistics for user
const getListeningStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '30d' } = req.query; // 7d, 30d, 90d, 1y

    // Calculate date range
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const totalPlays = await PlayHistory.count({
      where: {
        userId,
        playedAt: { [Op.gte]: startDate }
      }
    });

    const uniqueTracks = await PlayHistory.count({
      where: {
        userId,
        playedAt: { [Op.gte]: startDate }
      },
      distinct: true,
      col: 'trackId'
    });

    res.status(200).json({
      period,
      totalPlays,
      uniqueTracks,
      averagePerDay: Math.round(totalPlays / days)
    });
  } catch (error) {
    console.error('Error fetching listening stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getRecentlyPlayed,
  recordPlay,
  getListeningStats
};
