// controllers/playlistController.js
const { Playlist, PlaylistTrack, Track, User } = require('../models');

// Create a playlist
const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { userId } = req.user; // Assuming userId is available in the request (from auth middleware)

    const playlist = await Playlist.create({
      name,
      description,
      userId,
    });

    res.status(201).json({ playlist });
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add a track to a playlist
const addTrackToPlaylist = async (req, res) => {
  try {
    const { playlistId, trackId } = req.params;

    // Check if the playlist and track exist
    const playlist = await Playlist.findByPk(playlistId);
    const track = await Track.findByPk(trackId);

    if (!playlist || !track) {
      return res.status(404).json({ message: 'Playlist or track not found' });
    }

    // Add the track to the playlist
    await PlaylistTrack.create({
      playlistId,
      trackId,
      position: (await PlaylistTrack.count({ where: { playlistId } })) + 1, // Set position as the next in the playlist
    });

    res.status(201).json({ message: 'Track added to playlist successfully' });
  } catch (error) {
    console.error('Error adding track to playlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove a track from a playlist
const removeTrackFromPlaylist = async (req, res) => {
  try {
    const { playlistId, trackId } = req.params;

    // Check if the playlist and track exist
    const playlist = await Playlist.findByPk(playlistId);
    const track = await Track.findByPk(trackId);

    if (!playlist || !track) {
      return res.status(404).json({ message: 'Playlist or track not found' });
    }

    // Remove the track from the playlist
    await PlaylistTrack.destroy({
      where: { playlistId, trackId },
    });

    res.status(200).json({ message: 'Track removed from playlist successfully' });
  } catch (error) {
    console.error('Error removing track from playlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all playlists (public, with optional filters)
const getAllPlaylists = async (req, res) => {
  try {
    const { featured, limit, search, userId } = req.query;
    const where = {};

    // Filter by user if specified
    if (userId) {
      where.userId = userId;
    }

    // Filter by search term
    if (search) {
      where.name = { [require('sequelize').Op.iLike]: `%${search}%` };
    }

    const playlists = await Playlist.findAll({
      where,
      include: [{
        model: Track,
        as: 'tracks',
        through: { attributes: [] }
      },
      {
        model: User,
        attributes: ['id', 'username']
      }],
      limit: limit ? parseInt(limit) : undefined,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(playlists);
  } catch (error) {
    console.error('Error fetching all playlists:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all playlists for a user
const getUserPlaylists = async (req, res) => {
  try {
    const userId = req.user.id;
    const playlists = await Playlist.findAll({
      where: { userId },
      include: [{
        model: Track,
        as: 'tracks', // Use the alias 'tracks'
        through: { attributes: [] } // Exclude join table attributes
      },
      {
        model: User,
        attributes: ['id', 'username']
      }],
    });

    res.status(200).json({ playlists });
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single playlist by ID
const getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params;

    const playlist = await Playlist.findByPk(id, {
      include: [{
        model: Track,
        as: 'tracks', // Use the alias 'tracks'
        through: { attributes: [] } // Exclude join table attributes
      },
      {
        model: User,
        attributes: ['id', 'username']
      }],
    });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.status(200).json({ playlist });
  } catch (error) {
    console.error('Error fetching playlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reorder tracks in a playlist
const reorderTracksInPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { trackIds } = req.body; // Array of track IDs in the new order

    // Validate input
    if (!Array.isArray(trackIds)) {
      return res.status(400).json({ message: 'Invalid track order' });
    }

    // Update positions of tracks in the playlist
    await Promise.all(
      trackIds.map(async (trackId, index) => {
        await PlaylistTrack.update(
          { position: index + 1 },
          { where: { playlistId, trackId } }
        );
      })
    );

    res.status(200).json({ message: 'Playlist reordered successfully' });
  } catch (error) {
    console.error('Error reordering playlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update playlist details
const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const playlist = await Playlist.findByPk(id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Update playlist details
    playlist.name = name || playlist.name;
    playlist.description = description || playlist.description;
    await playlist.save();

    res.status(200).json({ playlist });
  } catch (error) {
    console.error('Error updating playlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a playlist
const deletePlaylist = async (req, res) => {
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

// Get playlist queue
const getPlaylistQueue = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { shuffle, repeat } = req.query;

    const playlist = await Playlist.findByPk(playlistId, {
      include: [{
        model: Track,
        as: 'tracks', // Use the alias 'tracks'
        through: { attributes: [] } // Exclude join table attributes
      },
      {
        model: User,
        attributes: ['id', 'username']
      }],
    });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    let tracks = playlist.tracks; // Access tracks via alias

    // Shuffle the tracks if requested
    if (shuffle === 'true') {
      tracks = tracks.sort(() => Math.random() - 0.5);
    }

    // Repeat the tracks if requested
    if (repeat === 'true') {
      tracks = [...tracks, ...tracks]; // Duplicate the tracks for repeat
    }

    res.status(200).json({ queue: tracks });
  } catch (error) {
    console.error('Error fetching playlist queue:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createPlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  getAllPlaylists,
  getUserPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  getPlaylistQueue,
  reorderTracksInPlaylist,
};