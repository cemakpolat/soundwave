// controllers/analyticsController.js
const { sequelize, Track, Like, User, Comment, PlayHistory, Follow } = require('../models');
const { Op, QueryTypes } = require('sequelize');


// Get track analytics
const getTrackAnalytics = async (req, res) => {
  try {
    const { trackId } = req.params;

    const track = await Track.findByPk(trackId, {
      include: [
        { model: Like, as: 'likes', attributes: ['id'] }, // Use alias 'likes'
        { model: Comment, as: 'comments', attributes: ['id'] }, // Use alias 'comments'
      ],
    });

    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    const analytics = {
      play_count: track.play_count,
      like_count: track.likes.length, // Access likes via alias
      comment_count: track.comments.length, // Access comments via alias
    };

    res.status(200).json({ analytics });
  } catch (error) {
    console.error('Error fetching track analytics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user analytics (total tracks, likes, comments)
const getUserAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const totalTracks = await Track.count({ where: { userId } });
    const totalLikes = await Like.count({
      include: [{ model: Track, where: { userId } }],
    });
    const totalComments = await Comment.count({
      include: [{ model: Track, where: { userId } }],
    });

    const analytics = {
      total_tracks: totalTracks,
      total_likes: totalLikes,
      total_comments: totalComments,
    };

    res.status(200).json({ analytics });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get top tracks (most played, most liked) - Optional parameters for filtering
const getTopTracks = async (req, res) => {
  try {
    const { limit = 10, sortBy = 'play_count', sortOrder = 'DESC' } = req.query;

    let order;

    if (sortBy === "play_count") {
      order = [['play_count', sortOrder.toUpperCase()]];
    } else if (sortBy === "like_count") {
      order = [[sequelize.literal('"likeCount"'), sortOrder.toUpperCase()]];  // Fix alias reference
    } else {
      return res.status(400).json({ message: 'Invalid sortBy value. Valid values are "play_count" or "like_count"' });
    }

    const tracks = await Track.findAll({
      limit: parseInt(limit),
      subQuery: false,  // Ensures JOINs are applied correctly
      include: [
        {
          model: Like,
          as: 'likes',
          attributes: [],
        },
        {
          model: User,
          attributes: ['id', 'username'],
        },
      ],
      attributes: {
        include: [
          [sequelize.fn("COUNT", sequelize.col("likes.id")), "likeCount"]
        ]
      },
      group: ['Track.id', 'User.id'],
      order: order,
      raw: true,
      nest: true
    });

    res.status(200).json({ tracks });
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Get total number of tracks
const getTotalNumberOfTracks = async (req, res) => {
    try {
      const totalTracks = await Track.count();
      res.status(200).json({ total: totalTracks });
    } catch (error) {
      console.error("Error getting total number of tracks:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// ==========================================
// ADVANCED ANALYTICS
// ==========================================

// Get track plays over time
const getTrackPlaysOverTime = async (req, res) => {
  try {
    const { trackId } = req.params;
    const { period = '30d' } = req.query; // 7d, 30d, 90d, 1y

    const track = await Track.findByPk(trackId);
    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    // Calculate date range
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const playsOverTime = await sequelize.query(`
      SELECT DATE("playedAt") as date, COUNT(*) as plays
      FROM "PlayHistory"
      WHERE "trackId" = :trackId
      AND "playedAt" >= :startDate
      GROUP BY DATE("playedAt")
      ORDER BY date ASC
    `, {
      replacements: { trackId, startDate },
      type: QueryTypes.SELECT
    });

    res.status(200).json({
      trackId,
      period,
      playsOverTime
    });
  } catch (error) {
    console.error('Error fetching track plays over time:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get creator analytics (for own tracks)
const getCreatorAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '30d' } = req.query;

    // Calculate date range
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Total tracks
    const totalTracks = await Track.count({ where: { userId } });

    // Total plays across all tracks
    const totalPlays = await PlayHistory.count({
      include: [{
        model: Track,
        where: { userId }
      }],
      where: {
        playedAt: { [Op.gte]: startDate }
      }
    });

    // Total likes across all tracks
    const totalLikes = await Like.count({
      include: [{
        model: Track,
        where: { userId }
      }]
    });

    // Total comments
    const totalComments = await Comment.count({
      include: [{
        model: Track,
        where: { userId }
      }]
    });

    // Total followers
    const totalFollowers = await Follow.count({
      where: { followeeId: userId }
    });

    // Most popular track
    const mostPopularTrack = await Track.findOne({
      where: { userId },
      order: [['play_count', 'DESC']],
      limit: 1
    });

    // Recent growth (new plays per day)
    const playsOverTime = await sequelize.query(`
      SELECT DATE("PlayHistory"."playedAt") as date, COUNT(*) as plays
      FROM "PlayHistory"
      INNER JOIN "Tracks" ON "PlayHistory"."trackId" = "Tracks"."id"
      WHERE "Tracks"."userId" = :userId
      AND "PlayHistory"."playedAt" >= :startDate
      GROUP BY DATE("PlayHistory"."playedAt")
      ORDER BY date ASC
    `, {
      replacements: { userId, startDate },
      type: QueryTypes.SELECT
    });

    res.status(200).json({
      period,
      totalTracks,
      totalPlays,
      totalLikes,
      totalComments,
      totalFollowers,
      mostPopularTrack,
      playsOverTime
    });
  } catch (error) {
    console.error('Error fetching creator analytics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get listener demographics for creator
const getListenerDemographics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get unique listeners
    const uniqueListeners = await sequelize.query(`
      SELECT DISTINCT "PlayHistory"."userId"
      FROM "PlayHistory"
      INNER JOIN "Tracks" ON "PlayHistory"."trackId" = "Tracks"."id"
      WHERE "Tracks"."userId" = :userId
    `, {
      replacements: { userId },
      type: QueryTypes.SELECT
    });

    const listenerCount = uniqueListeners.length;

    // Get top listeners (most plays)
    const topListeners = await sequelize.query(`
      SELECT "Users"."id", "Users"."username", COUNT(*) as plays
      FROM "PlayHistory"
      INNER JOIN "Tracks" ON "PlayHistory"."trackId" = "Tracks"."id"
      INNER JOIN "Users" ON "PlayHistory"."userId" = "Users"."id"
      WHERE "Tracks"."userId" = :userId
      GROUP BY "Users"."id", "Users"."username"
      ORDER BY plays DESC
      LIMIT 10
    `, {
      replacements: { userId },
      type: QueryTypes.SELECT
    });

    res.status(200).json({
      totalUniqueListeners: listenerCount,
      topListeners
    });
  } catch (error) {
    console.error('Error fetching listener demographics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user growth over time (admin only)
const getUserGrowthOverTime = async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const userGrowth = await sequelize.query(`
      SELECT DATE("createdAt") as date, COUNT(*) as new_users
      FROM "Users"
      WHERE "createdAt" >= :startDate
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `, {
      replacements: { startDate },
      type: QueryTypes.SELECT
    });

    // Calculate cumulative growth
    let cumulative = 0;
    const growthWithCumulative = userGrowth.map(day => {
      cumulative += parseInt(day.new_users);
      return {
        date: day.date,
        new_users: parseInt(day.new_users),
        cumulative_users: cumulative
      };
    });

    res.status(200).json({
      period,
      userGrowth: growthWithCumulative
    });
  } catch (error) {
    console.error('Error fetching user growth:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get track upload trends (admin only)
const getTrackUploadTrends = async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const uploadTrends = await sequelize.query(`
      SELECT DATE("createdAt") as date, COUNT(*) as uploads
      FROM "Tracks"
      WHERE "createdAt" >= :startDate
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `, {
      replacements: { startDate },
      type: QueryTypes.SELECT
    });

    res.status(200).json({
      period,
      uploadTrends
    });
  } catch (error) {
    console.error('Error fetching track upload trends:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get most active users (admin only)
const getMostActiveUsers = async (req, res) => {
  try {
    const { limit = 20, type = 'plays' } = req.query;

    let activeUsers;

    if (type === 'plays') {
      // Most active by listening
      activeUsers = await sequelize.query(`
        SELECT "Users"."id", "Users"."username", "Users"."role", COUNT(*) as play_count
        FROM "PlayHistory"
        INNER JOIN "Users" ON "PlayHistory"."userId" = "Users"."id"
        GROUP BY "Users"."id", "Users"."username", "Users"."role"
        ORDER BY play_count DESC
        LIMIT :limit
      `, {
        replacements: { limit: parseInt(limit) },
        type: QueryTypes.SELECT
      });
    } else if (type === 'uploads') {
      // Most active by uploading
      activeUsers = await sequelize.query(`
        SELECT "Users"."id", "Users"."username", "Users"."role", COUNT(*) as track_count
        FROM "Tracks"
        INNER JOIN "Users" ON "Tracks"."userId" = "Users"."id"
        GROUP BY "Users"."id", "Users"."username", "Users"."role"
        ORDER BY track_count DESC
        LIMIT :limit
      `, {
        replacements: { limit: parseInt(limit) },
        type: QueryTypes.SELECT
      });
    } else {
      // Most active by engagement (likes + comments)
      activeUsers = await sequelize.query(`
        SELECT "Users"."id", "Users"."username", "Users"."role",
               COUNT(DISTINCT "Likes"."id") + COUNT(DISTINCT "Comments"."id") as engagement_count
        FROM "Users"
        LEFT JOIN "Likes" ON "Users"."id" = "Likes"."userId"
        LEFT JOIN "Comments" ON "Users"."id" = "Comments"."userId"
        GROUP BY "Users"."id", "Users"."username", "Users"."role"
        ORDER BY engagement_count DESC
        LIMIT :limit
      `, {
        replacements: { limit: parseInt(limit) },
        type: QueryTypes.SELECT
      });
    }

    res.status(200).json({
      type,
      activeUsers
    });
  } catch (error) {
    console.error('Error fetching most active users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getTrackAnalytics,
  getUserAnalytics,
  getTopTracks,
  getTotalNumberOfTracks,
  // Advanced Analytics
  getTrackPlaysOverTime,
  getCreatorAnalytics,
  getListenerDemographics,
  getUserGrowthOverTime,
  getTrackUploadTrends,
  getMostActiveUsers
};