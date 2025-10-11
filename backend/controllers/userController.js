// // controllers/userController.js

const { User, Track, Playlist, Follow, Notification } = require('../models'); // Import necessary models
// // Get user details
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] }, // Exclude sensitive data
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user details
const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] }, // Exclude sensitive data
      include: [
        {
          model: Track,
          as: 'tracks',
          required: false // Set to true if you want only users with tracks to be returned
        },
        {
          model: Playlist,
          as: 'playlists',
          required: false // Set to true if you want only users with playlists to be returned
        },
        {
          model: Follow,
          as: 'following', // Users this user is following
          required: false,
          include: {
            model: User,
            as: 'followee',
            attributes: ['id', 'username'] // avoid circular dependencies
          }
        },
        {
          model: Follow,
          as: 'followers',  // Users following this user
          required: false,
          include: {
            model: User,
            as: 'follower',
            attributes: ['id', 'username'] // avoid circular dependencies
          }
        },
        {
          model: Notification,
          as: 'notifications',
          required: false // Set to true if you want only users with notifications to be returned
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user profile
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, bio, location, social_links } = req.body;
    const userId = req.user.id;

    console.log('Update user request:', {
      userId: id,
      requestingUserId: userId,
      username,
      email,
      bio,
      location,
      social_links,
      hasFile: !!req.file
    });

    // Check if user is updating their own profile
    if (parseInt(id) !== userId) {
      return res.status(403).json({ message: 'Unauthorized to update this profile' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Current user data:', {
      id: user.id,
      username: user.username,
      email: user.email,
      profile_picture_key: user.profile_picture_key
    });

    // Update user details (handle empty strings from FormData)
    if (username && username.trim()) user.username = username.trim();
    if (email && email.trim()) user.email = email.trim();
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;

    if (social_links) {
      try {
        user.social_links = typeof social_links === 'string' ? JSON.parse(social_links) : social_links;
      } catch (parseError) {
        console.error('Error parsing social_links:', parseError);
        return res.status(400).json({ message: 'Invalid social links format' });
      }
    }

    // Handle profile picture upload if present
    let oldProfilePictureKey = null;
    let newProfilePictureKey = null;

    if (req.file) {
      const { storageType, deleteFile } = require('../config/storage');
      const fs = require('fs');
      const s3 = require('../config/s3');

      // Save old key for potential rollback
      oldProfilePictureKey = user.profile_picture_key;

      let profilePictureKey;
      if (storageType === 's3' || storageType === 'minio') {
        const bucketName = storageType === 'minio'
          ? (process.env.MINIO_BUCKET || 'soundwave-tracks')
          : process.env.AWS_BUCKET_NAME;

        const params = {
          Bucket: bucketName,
          Key: `profiles/${Date.now()}-${req.file.originalname}`,
          Body: fs.readFileSync(req.file.path),
          ContentType: req.file.mimetype,
        };
        const uploadResult = await s3.upload(params).promise();
        profilePictureKey = uploadResult.Key;
        fs.unlinkSync(req.file.path); // Clean up temp file
      } else {
        // Local storage - file already saved by multer
        profilePictureKey = `/uploads/profiles/${req.file.filename}`;
      }

      newProfilePictureKey = profilePictureKey;
      user.profile_picture_key = profilePictureKey;
    }

    console.log('About to save user with data:', {
      username: user.username,
      email: user.email,
      bio: user.bio,
      location: user.location,
      social_links: user.social_links,
      profile_picture_key: user.profile_picture_key
    });

    // Save user
    await user.save();
    console.log('User saved successfully');

    // Only delete old profile picture after successful save
    if (oldProfilePictureKey && newProfilePictureKey) {
      const { deleteFile } = require('../config/storage');
      try {
        await deleteFile(oldProfilePictureKey);
      } catch (err) {
        console.error('Error deleting old profile picture:', err);
        // Don't fail the request if old file deletion fails
      }
    }

    // Return user without sensitive data, include virtual fields
    const userJSON = user.toJSON();
    const { password_hash, ...userWithoutPassword } = userJSON;

    console.log('Sending user response with profileImage:', userWithoutPassword.profileImage);
    res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Error updating user:', error);
    console.error('Error stack:', error.stack);

    // Clean up uploaded file if save failed
    if (req.file && req.file.path) {
      const fs = require('fs');
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (cleanupErr) {
        console.error('Error cleaning up file:', cleanupErr);
      }
    }

    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Delete user account
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getUser,getUserDetails, updateUser, deleteUser };