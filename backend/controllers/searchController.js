// controllers/searchController.js
const { Track, User, Playlist, Like } = require('../models');
const { Op } = require('sequelize');

// ==========================================
// SEARCH FUNCTIONS
// ==========================================

// Search tracks with filters
const searchTracks = async (req, res) => {
  try {
    const {
      q,                          // Search query
      genre,
      minDuration,
      maxDuration,
      sortBy = 'relevance',      // relevance, popular, recent
      page = 1,
      limit = 20
    } = req.query;

    const where = { isApproved: true }; // Only show approved tracks

    // Text search
    if (q) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } }
      ];
    }

    // Genre filter
    if (genre) {
      where.genre = genre;
    }

    // Duration filters
    if (minDuration) {
      where.duration = { [Op.gte]: parseInt(minDuration) };
    }
    if (maxDuration) {
      where.duration = {
        ...where.duration,
        [Op.lte]: parseInt(maxDuration)
      };
    }

    // Determine sorting
    let order = [['createdAt', 'DESC']];
    if (sortBy === 'popular') {
      order = [['play_count', 'DESC']];
    } else if (sortBy === 'recent') {
      order = [['createdAt', 'DESC']];
    }

    const tracks = await Track.findAndCountAll({
      where,
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
      order,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.status(200).json({
      tracks: tracks.rows,
      pagination: {
        total: tracks.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(tracks.count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error searching tracks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Search artists (creators)
const searchArtists = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    const where = { role: 'creator' };

    if (q) {
      where[Op.or] = [
        { username: { [Op.iLike]: `%${q}%` } },
        { email: { [Op.iLike]: `%${q}%` } }
      ];
    }

    const artists = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: Track,
          as: 'tracks',
          attributes: ['id', 'title', 'play_count']
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      artists: artists.rows,
      pagination: {
        total: artists.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(artists.count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error searching artists:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Search playlists
const searchPlaylists = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    const where = { isPublic: true }; // Only public playlists

    if (q) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } }
      ];
    }

    const playlists = await Playlist.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      playlists: playlists.rows,
      pagination: {
        total: playlists.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(playlists.count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error searching playlists:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ==========================================
// BROWSE FUNCTIONS
// ==========================================

// Browse by genre
const browseByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const tracks = await Track.findAndCountAll({
      where: {
        genre,
        isApproved: true
      },
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['play_count', 'DESC']]
    });

    res.status(200).json({
      genre,
      tracks: tracks.rows,
      pagination: {
        total: tracks.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(tracks.count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error browsing by genre:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get featured tracks
const getFeaturedTracks = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    // Featured = most popular + approved tracks
    const tracks = await Track.findAll({
      where: {
        isApproved: true
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

    res.status(200).json({ tracks });
  } catch (error) {
    console.error('Error fetching featured tracks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get new releases
const getNewReleases = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const tracks = await Track.findAll({
      where: {
        isApproved: true
      },
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({ tracks });
  } catch (error) {
    console.error('Error fetching new releases:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get trending tracks
const getTrendingTracks = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    // Trending = tracks with high play count in last 7 days
    // For now, we'll use overall play count
    // In production, you'd filter by recent plays using PlayHistory
    const tracks = await Track.findAll({
      where: {
        isApproved: true,
        createdAt: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ],
      order: [['play_count', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({ tracks });
  } catch (error) {
    console.error('Error fetching trending tracks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  // Search
  searchTracks,
  searchArtists,
  searchPlaylists,
  // Browse
  browseByGenre,
  getFeaturedTracks,
  getNewReleases,
  getTrendingTracks
};
