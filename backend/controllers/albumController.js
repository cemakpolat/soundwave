// controllers/albumController.js
const { Album, AlbumTrack, Track, User } = require('../models');
const { deleteFile } = require('../config/storage');
const { upload } = require('../config/storage');

// ==========================================
// ALBUM CRUD OPERATIONS
// ==========================================

// Create album
const createAlbum = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, genre, releaseDate } = req.body;
    const coverImageFile = req.file;

    let coverImageKey = null;
    if (coverImageFile) {
      // Store cover image path
      coverImageKey = coverImageFile.key || `/uploads/covers/${coverImageFile.filename}`;
    }

    const album = await Album.create({
      userId,
      title,
      description,
      genre,
      releaseDate,
      coverImageKey,
      isPublished: false
    });

    const albumWithUser = await Album.findByPk(album.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ]
    });

    res.status(201).json({
      message: 'Album created successfully',
      album: albumWithUser
    });
  } catch (error) {
    console.error('Error creating album:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all albums (public)
const getAllAlbums = async (req, res) => {
  try {
    const { page = 1, limit = 20, genre, userId } = req.query;
    const where = { isPublished: true };

    if (genre) where.genre = genre;
    if (userId) where.userId = userId;

    const albums = await Album.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        },
        {
          model: Track,
          as: 'tracks',
          through: { attributes: ['trackNumber'] },
          attributes: ['id', 'title', 'duration']
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['releaseDate', 'DESC']]
    });

    res.status(200).json({
      albums: albums.rows,
      pagination: {
        total: albums.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(albums.count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get own albums (creator)
const getMyAlbums = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const albums = await Album.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Track,
          as: 'tracks',
          through: { attributes: ['trackNumber'] },
          attributes: ['id', 'title', 'duration']
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      albums: albums.rows,
      pagination: {
        total: albums.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(albums.count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching my albums:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get album by ID
const getAlbumById = async (req, res) => {
  try {
    const { id } = req.params;

    const album = await Album.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        },
        {
          model: Track,
          as: 'tracks',
          through: { attributes: ['trackNumber'] },
          include: [
            {
              model: User,
              attributes: ['id', 'username']
            }
          ],
          order: [[AlbumTrack, 'trackNumber', 'ASC']]
        }
      ]
    });

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    // Check if album is published or belongs to current user
    if (!album.isPublished && album.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Album not published' });
    }

    res.status(200).json({ album });
  } catch (error) {
    console.error('Error fetching album:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update album
const updateAlbum = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, description, genre, releaseDate, isPublished } = req.body;

    const album = await Album.findByPk(id);
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    // Check ownership
    if (album.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update fields
    if (title) album.title = title;
    if (description !== undefined) album.description = description;
    if (genre) album.genre = genre;
    if (releaseDate) album.releaseDate = releaseDate;
    if (isPublished !== undefined) album.isPublished = isPublished;

    await album.save();

    const updatedAlbum = await Album.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        },
        {
          model: Track,
          as: 'tracks',
          through: { attributes: ['trackNumber'] }
        }
      ]
    });

    res.status(200).json({
      message: 'Album updated successfully',
      album: updatedAlbum
    });
  } catch (error) {
    console.error('Error updating album:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete album
const deleteAlbum = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const album = await Album.findByPk(id);
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    // Check ownership
    if (album.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Delete cover image if exists
    if (album.coverImageKey) {
      try {
        await deleteFile(album.coverImageKey);
      } catch (fileError) {
        console.error('Error deleting cover image:', fileError);
      }
    }

    await album.destroy();

    res.status(200).json({ message: 'Album deleted successfully' });
  } catch (error) {
    console.error('Error deleting album:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ==========================================
// ALBUM TRACK MANAGEMENT
// ==========================================

// Add track to album
const addTrackToAlbum = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params; // albumId
    const { trackId, trackNumber } = req.body;

    const album = await Album.findByPk(id);
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    // Check ownership
    if (album.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Verify track exists and belongs to user
    const track = await Track.findByPk(trackId);
    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }
    if (track.userId !== userId) {
      return res.status(403).json({ message: 'Track does not belong to you' });
    }

    // Get max track number if not provided
    let finalTrackNumber = trackNumber;
    if (!finalTrackNumber) {
      const maxTrackNumber = await AlbumTrack.max('trackNumber', {
        where: { albumId: id }
      }) || 0;
      finalTrackNumber = maxTrackNumber + 1;
    }

    // Add track to album
    await AlbumTrack.create({
      albumId: id,
      trackId,
      trackNumber: finalTrackNumber
    });

    const updatedAlbum = await Album.findByPk(id, {
      include: [
        {
          model: Track,
          as: 'tracks',
          through: { attributes: ['trackNumber'] }
        }
      ]
    });

    res.status(201).json({
      message: 'Track added to album',
      album: updatedAlbum
    });
  } catch (error) {
    console.error('Error adding track to album:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove track from album
const removeTrackFromAlbum = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, trackId } = req.params;

    const album = await Album.findByPk(id);
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    // Check ownership
    if (album.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const deleted = await AlbumTrack.destroy({
      where: {
        albumId: id,
        trackId
      }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Track not found in album' });
    }

    res.status(200).json({ message: 'Track removed from album' });
  } catch (error) {
    console.error('Error removing track from album:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createAlbum,
  getAllAlbums,
  getMyAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
  addTrackToAlbum,
  removeTrackFromAlbum
};
