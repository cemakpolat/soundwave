// controllers/trackController.js
const { Track, User, Like, Comment } = require('../models'); // Import Like and Comment
const { getFileUrl, deleteFile, storageType } = require('../config/storage');
const s3 = require('../config/s3');
const fs = require('fs');
const path = require('path');
const { Op } = require("sequelize");

// Get all tracks (with pagination and search)
const getTracks = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, userId } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where.title = { [Op.iLike]: `%${search}%` }; // Case-insensitive search
    }
    if (userId) {
      where.userId = userId; // Filter by userId
    }

    const tracks = await Track.findAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
        },
        {
          model: Like,
          as: 'likes', // Include likes
        },
        {
          model: Comment,
          as: 'comments', // Include comments
        }
      ],
      order: [['createdAt', 'DESC']], // Most recent first
    });

    res.status(200).json({ tracks });
  } catch (error) {
    console.error('Error fetching tracks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single track by ID
const getTrackById = async (req, res) => {
  try {
    const { id } = req.params;
    const track = await Track.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
        },
        {
          model: Like,
          as: 'likes', // Include likes
        },
        {
          model: Comment,
          as: 'comments', // Include comments
        }
      ],
    });

    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    res.status(200).json({ track });
  } catch (error) {
    console.error('Error fetching track:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update track details
const updateTrack = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const track = await Track.findByPk(id);
    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    // Update track details
    track.title = title || track.title;
    track.description = description || track.description;
    await track.save();

    res.status(200).json({ track });
  } catch (error) {
    console.error('Error updating track:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a track
const deleteTrack = async (req, res) => {
  try {
    const { id } = req.params;

    const track = await Track.findByPk(id);
    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    // Delete files from storage
    try {
      if (track.s3_key) {
        await deleteFile(track.s3_key);
      }
      if (track.cover_image_key) {
        await deleteFile(track.cover_image_key);
      }
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

// Get track URL for playback
const getTrackUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const track = await Track.findByPk(id);
    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    let trackUrl;

    if (storageType === 's3' || storageType === 'minio') {
      // Generate a pre-signed URL for S3/MinIO
      // Note: For MinIO, we could use direct URLs if bucket is public,
      // but pre-signed URLs are more secure
      const params = {
        Bucket: storageType === 'minio'
          ? (process.env.MINIO_BUCKET || 'soundwave-tracks')
          : process.env.AWS_BUCKET_NAME,
        Key: track.s3_key,
        Expires: 3600, // URL expires in 1 hour
      };
      trackUrl = await s3.getSignedUrlPromise('getObject', params);
    } else {
      // For local storage, return the local path
      trackUrl = getFileUrl(track.s3_key, 'track');
    }

    // Increment play count
    track.play_count += 1;
    await track.save();

    res.status(200).json({ trackUrl });
  } catch (error) {
    console.error('Error fetching track URL:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const uploadTrack = async (req, res) => {
  try {
    const { title, description, duration } = req.body;
    const userId = req.user.id; // Get userId from authenticated user
    const audioFile = req.files['audio'] ? req.files['audio'][0] : null;
    const coverImageFile = req.files['coverImage'] ? req.files['coverImage'][0] : null;

    if (!audioFile) {
      return res.status(400).json({ message: 'Audio file is required' });
    }

    if (!duration || isNaN(parseInt(duration)) || parseInt(duration) <= 0) {
      return res.status(400).json({ message: 'Valid audio duration is required' });
    }

    let audioKey, coverKey;

    if (storageType === 's3' || storageType === 'minio') {
      // Upload audio file to S3/MinIO
      const bucketName = storageType === 'minio'
        ? (process.env.MINIO_BUCKET || 'soundwave-tracks')
        : process.env.AWS_BUCKET_NAME;

      const audioParams = {
        Bucket: bucketName,
        Key: `tracks/${Date.now()}-${audioFile.originalname}`,
        Body: fs.readFileSync(audioFile.path),
        ContentType: audioFile.mimetype,
      };
      const audioUploadResult = await s3.upload(audioParams).promise();
      audioKey = audioUploadResult.Key;

      // Upload cover image to S3/MinIO (if provided)
      if (coverImageFile) {
        const imageParams = {
          Bucket: bucketName,
          Key: `covers/${Date.now()}-${coverImageFile.originalname}`,
          Body: fs.readFileSync(coverImageFile.path),
          ContentType: coverImageFile.mimetype,
        };
        const imageUploadResult = await s3.upload(imageParams).promise();
        coverKey = imageUploadResult.Key;
      }

      // Clean up temporary files
      fs.unlinkSync(audioFile.path);
      if (coverImageFile) {
        fs.unlinkSync(coverImageFile.path);
      }
    } else {
      // Local storage - files already saved by multer
      // Store relative paths for database
      audioKey = `/uploads/tracks/${audioFile.filename}`;
      coverKey = coverImageFile ? `/uploads/covers/${coverImageFile.filename}` : null;
    }

    // Save track metadata in the database
    const track = await Track.create({
      title,
      description,
      duration: parseInt(duration),
      s3_key: audioKey,
      cover_image_key: coverKey,
      userId,
    });

    // Fetch track with user info
    const trackWithUser = await Track.findByPk(track.id, {
      include: [{
        model: User,
        attributes: ['id', 'username']
      }]
    });

    res.status(201).json({
      track: trackWithUser,
      message: 'Track uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading track:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

// const uploadTrack = async (req, res) => {
//   try {
//     const { title, description, duration } = req.body;
//     const { userId } = req.user; // Assuming userId is available in the request (from auth middleware)
//     const audioFile = req.files['audio'][0];
//     const coverImageFile = req.files['coverImage'][0];

//     if (!audioFile) {
//       return res.status(400).json({ message: 'Audio file is required' });
//     }

//     // Upload audio file to S3
//     const audioParams = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: `tracks/${Date.now()}-${audioFile.originalname}`,
//       Body: fs.readFileSync(audioFile.path),
//       ContentType: audioFile.mimetype,
//     };
//     const audioUploadResult = await s3.upload(audioParams).promise();

//     // Upload cover image to S3 (if provided)
//     let coverImageUrl = null;
//     if (coverImageFile) {
//       const imageParams = {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: `images/${Date.now()}-${coverImageFile.originalname}`,
//         Body: fs.readFileSync(coverImageFile.path),
//         ContentType: coverImageFile.mimetype,
//       };
//       const imageUploadResult = await s3.upload(imageParams).promise();
//       coverImageUrl = imageUploadResult.Location;
//     }

//     // Save track metadata in the database
//     const track = await Track.create({
//       title,
//       description,
//       duration,
//       s3_key: audioUploadResult.Key,
//       cover_image_key: coverImageUrl ? path.basename(coverImageUrl) : null,
//       userId,
//     });

//     // Notify followers
//     const followers = await Follow.findAll({ where: { followeeId: userId } });
//     followers.forEach(async (follower) => {
//       await Notification.create({
//         userId: follower.followerId,
//         message: `${req.user.username} uploaded a new track: ${title}`,
//       });
//     });

//     // Clean up temporary files
//     fs.unlinkSync(audioFile.path);
//     if (coverImageFile) {
//       fs.unlinkSync(coverImageFile.path);
//     }

//     res.status(201).json({ track });
//   } catch (error) {
//     console.error('Error uploading track:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


module.exports = {
  uploadTrack,
  getTracks,
  getTrackById,
  updateTrack,
  deleteTrack,
  getTrackUrl, // Add this method
};