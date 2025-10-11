// controllers/adminController.js
const { User, Track, Playlist, Like, Comment, Follow } = require('../models');
const { Op } = require('sequelize');
const { deleteFile } = require('../config/storage');

const banUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is already banned
    if (user.isBanned) {
      return res.status(400).json({ message: 'User is already banned' });
    }

    // Ban the user
    user.isBanned = true;
    await user.save();

    res.status(200).json({ message: 'User banned successfully' });
  } catch (error) {
    console.error('Error banning user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const unbanUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is already unbanned
    if (!user.isBanned) {
      return res.status(400).json({ message: 'User is not banned' });
    }

    // Unban the user
    user.isBanned = false;
    await user.save();

    res.status(200).json({ message: 'User unbanned successfully' });
  } catch (error) {
    console.error('Error unbanning user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Approve a track
const approveTrack = async (req, res) => {
  try {
    const { id } = req.params;

    const track = await Track.findByPk(id);
    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    // Approve the track
    track.isApproved = true;
    await track.save();

    res.status(200).json({ message: 'Track approved successfully' });
  } catch (error) {
    console.error('Error approving track:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get platform statistics
const getPlatformStatistics = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalTracks = await Track.count();
    const totalPlaylists = await Playlist.count();

    res.status(200).json({ totalUsers, totalTracks, totalPlaylists });
  } catch (error) {
    console.error('Error fetching platform statistics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ==========================================
// USER MANAGEMENT
// ==========================================

// Get all users with filters and pagination
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, banned, search } = req.query;
    const where = {};

    if (role) where.role = role;
    if (banned !== undefined) where.isBanned = banned === 'true';
    if (search) {
      where[Op.or] = [
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const users = await User.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: Track,
          as: 'tracks',
          attributes: ['id', 'title', 'play_count']
        },
        {
          model: Playlist,
          as: 'playlists',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      users: users.rows,
      pagination: {
        total: users.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(users.count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user details by ID
const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: Track,
          as: 'tracks',
          include: [
            { model: Like, as: 'likes' },
            { model: Comment, as: 'comments' }
          ]
        },
        {
          model: Playlist,
          as: 'playlists'
        },
        {
          model: Follow,
          as: 'following',
          include: [{ model: User, as: 'followee', attributes: ['id', 'username'] }]
        },
        {
          model: Follow,
          as: 'followers',
          include: [{ model: User, as: 'follower', attributes: ['id', 'username'] }]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user (change role, ban status, etc.)
const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isBanned, username, email } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update allowed fields
    if (role) user.role = role;
    if (isBanned !== undefined) user.isBanned = isBanned;
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    const { password_hash, ...userWithoutPassword } = user.get({ plain: true });
    res.status(200).json({
      message: 'User updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete user (admin)
const deleteUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete all user's tracks and associated files
    const tracks = await Track.findAll({ where: { userId: id } });
    for (const track of tracks) {
      try {
        if (track.s3_key) await deleteFile(track.s3_key);
        if (track.cover_image_key) await deleteFile(track.cover_image_key);
      } catch (fileError) {
        console.error('Error deleting files:', fileError);
        // Continue with deletion even if file deletion fails
      }
    }

    // Sequelize will handle cascade deletes for related records
    await user.destroy();

    res.status(200).json({ message: 'User and all associated data deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ==========================================
// CONTENT MANAGEMENT
// ==========================================

// Get all tracks with filters
const getAllTracks = async (req, res) => {
  try {
    const { page = 1, limit = 20, approved, userId, search } = req.query;
    const where = {};

    if (approved !== undefined) where.isApproved = approved === 'true';
    if (userId) where.userId = userId;
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const tracks = await Track.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email']
        },
        {
          model: Like,
          as: 'likes'
        },
        {
          model: Comment,
          as: 'comments'
        }
      ],
      order: [['createdAt', 'DESC']]
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
    console.error('Error fetching tracks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete any track (admin)
const deleteAnyTrack = async (req, res) => {
  try {
    const { id } = req.params;

    const track = await Track.findByPk(id);
    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    // Delete files from storage
    try {
      if (track.s3_key) await deleteFile(track.s3_key);
      if (track.cover_image_key) await deleteFile(track.cover_image_key);
    } catch (fileError) {
      console.error('Error deleting files:', fileError);
      // Continue with database deletion even if file deletion fails
    }

    await track.destroy();

    res.status(200).json({ message: 'Track deleted successfully' });
  } catch (error) {
    console.error('Error deleting track:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all playlists (admin)
const getAllPlaylists = async (req, res) => {
  try {
    const { page = 1, limit = 20, userId } = req.query;
    const where = {};

    if (userId) where.userId = userId;

    const playlists = await Playlist.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ],
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
    console.error('Error fetching playlists:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete any playlist (admin)
const deleteAnyPlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    const playlist = await Playlist.findByPk(id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    await playlist.destroy();

    res.status(200).json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all comments (admin)
const getAllComments = async (req, res) => {
  try {
    const { page = 1, limit = 50, trackId, userId } = req.query;
    const where = {};

    if (trackId) where.trackId = trackId;
    if (userId) where.userId = userId;

    const comments = await Comment.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        },
        {
          model: Track,
          attributes: ['id', 'title']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      comments: comments.rows,
      pagination: {
        total: comments.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(comments.count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete any comment (admin)
const deleteAnyComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await comment.destroy();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  banUser,
  unbanUser,
  approveTrack,
  getPlatformStatistics,
  // User Management
  getAllUsers,
  getUserDetails,
  updateUserByAdmin,
  deleteUserByAdmin,
  // Content Management
  getAllTracks,
  deleteAnyTrack,
  getAllPlaylists,
  deleteAnyPlaylist,
  getAllComments,
  deleteAnyComment
};