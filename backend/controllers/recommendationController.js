// controllers/recommendationController.js
const { Track, Like, Follow, User, PlayHistory, Comment } = require('../models');
const { Op } = require('sequelize');

// ==========================================
// RECOMMENDATION ALGORITHMS
// ==========================================

// Get personalized recommendations
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20 } = req.query;

    // Get liked tracks
    const likedTracks = await Like.findAll({
      where: { userId },
      attributes: ['trackId']
    });

    // Get followed artists
    const followedArtists = await Follow.findAll({
      where: { followerId: userId },
      attributes: ['followeeId']
    });

    // Extract IDs
    const likedTrackIds = likedTracks.map(like => like.trackId);
    const followedArtistIds = followedArtists.map(follow => follow.followeeId);

    // Build where clause - recommend tracks from followed artists that user hasn't liked
    let where = {};

    if (likedTrackIds.length > 0) {
      where.id = { [Op.notIn]: likedTrackIds };
    }

    // If user follows artists, recommend their tracks
    if (followedArtistIds.length > 0) {
      where.userId = { [Op.in]: followedArtistIds };
    }

    // Get recommendations
    const recommendations = await Track.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        },
        {
          model: Like,
          as: 'likes',
          required: false
        }
      ],
      order: [['play_count', 'DESC']], // Prefer popular tracks
      limit: parseInt(limit)
    });

    // If no recommendations (user doesn't follow anyone), return popular tracks
    if (recommendations.length === 0) {
      const popularTracks = await Track.findAll({
        where: likedTrackIds.length > 0 ? { id: { [Op.notIn]: likedTrackIds } } : {},
        include: [
          {
            model: User,
            attributes: ['id', 'username']
          }
        ],
        order: [['play_count', 'DESC']],
        limit: parseInt(limit)
      });
      return res.status(200).json({ recommendations: popularTracks });
    }

    res.status(200).json({ recommendations });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get Discover Weekly (personalized weekly playlist)
const getDiscoverWeekly = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's top genres from play history
    const recentPlays = await PlayHistory.findAll({
      where: {
        userId,
        playedAt: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      include: [{ model: Track }],
      order: [['playedAt', 'DESC']],
      limit: 100
    });

    const topGenres = [...new Set(
      recentPlays
        .map(play => play.Track?.genre)
        .filter(genre => genre)
    )].slice(0, 5);

    // Get tracks the user hasn't played
    const playedTrackIds = recentPlays.map(play => play.trackId);

    const discoverWeekly = await Track.findAll({
      where: {
        id: { [Op.notIn]: playedTrackIds },
        genre: { [Op.in]: topGenres },
        isApproved: true,
        createdAt: {
          [Op.gte]: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
        }
      },
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ],
      order: [['play_count', 'DESC']],
      limit: 30
    });

    res.status(200).json({ discoverWeekly });
  } catch (error) {
    console.error('Error fetching discover weekly:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get Daily Mix (mix based on user's favorite genres)
const getDailyMix = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mixNumber = 1 } = req.query; // Support multiple daily mixes

    // Get user's liked tracks
    const likedTracks = await Like.findAll({
      where: { userId },
      include: [{ model: Track }]
    });

    if (likedTracks.length === 0) {
      // If no likes, return popular tracks
      const popularTracks = await Track.findAll({
        where: { isApproved: true },
        include: [
          {
            model: User,
            attributes: ['id', 'username']
          }
        ],
        order: [['play_count', 'DESC']],
        limit: 50
      });
      return res.status(200).json({ dailyMix: popularTracks });
    }

    // Group by genre
    const genreCounts = {};
    likedTracks.forEach(like => {
      const genre = like.Track.genre;
      if (genre) {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      }
    });

    // Get top genre for this mix number
    const sortedGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([genre]) => genre);

    const targetGenre = sortedGenres[(parseInt(mixNumber) - 1) % sortedGenres.length] || sortedGenres[0];

    // Get tracks in this genre
    const dailyMix = await Track.findAll({
      where: {
        genre: targetGenre,
        isApproved: true
      },
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ],
      order: [['play_count', 'DESC']],
      limit: 50
    });

    res.status(200).json({
      dailyMix,
      genre: targetGenre,
      mixNumber: parseInt(mixNumber)
    });
  } catch (error) {
    console.error('Error fetching daily mix:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get similar tracks
const getSimilarTracks = async (req, res) => {
  try {
    const { id } = req.params; // trackId
    const { limit = 20 } = req.query;

    const track = await Track.findByPk(id);
    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    // Find similar tracks based on genre and artist
    const similarTracks = await Track.findAll({
      where: {
        id: { [Op.ne]: id }, // Exclude the current track
        isApproved: true,
        [Op.or]: [
          { genre: track.genre },
          { userId: track.userId }
        ]
      },
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        },
        {
          model: Like,
          as: 'likes'
        }
      ],
      order: [['play_count', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({ similarTracks });
  } catch (error) {
    console.error('Error fetching similar tracks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get tracks liked by users who liked the same track
const getRelatedByLikes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20 } = req.query;

    // Get tracks liked by the user
    const userLikes = await Like.findAll({
      where: { userId },
      attributes: ['trackId']
    });

    if (userLikes.length === 0) {
      return res.status(200).json({ relatedTracks: [] });
    }

    const userLikedTrackIds = userLikes.map(like => like.trackId);

    // Find users who liked the same tracks
    const similarUsers = await Like.findAll({
      where: {
        trackId: { [Op.in]: userLikedTrackIds },
        userId: { [Op.ne]: userId }
      },
      attributes: ['userId'],
      group: ['userId']
    });

    const similarUserIds = [...new Set(similarUsers.map(like => like.userId))];

    if (similarUserIds.length === 0) {
      return res.status(200).json({ relatedTracks: [] });
    }

    // Get tracks liked by similar users that current user hasn't liked
    const relatedTracks = await Track.findAll({
      include: [
        {
          model: Like,
          as: 'likes',
          where: {
            userId: { [Op.in]: similarUserIds }
          }
        },
        {
          model: User,
          attributes: ['id', 'username']
        }
      ],
      where: {
        id: { [Op.notIn]: userLikedTrackIds },
        isApproved: true
      },
      order: [['play_count', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({ relatedTracks });
  } catch (error) {
    console.error('Error fetching related tracks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getRecommendations,
  getDiscoverWeekly,
  getDailyMix,
  getSimilarTracks,
  getRelatedByLikes
};