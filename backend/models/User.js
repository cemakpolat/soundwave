// models/User.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true, // Ensures the string is not empty
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true  // Validates that the string is an email format
      }
    },
    password_hash: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['creator', 'listener', 'admin']] // Enforces the CHECK constraint
      }
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    profile_picture_key: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    social_links: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    isBanned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    // Virtual field to construct profile image URL
    profileImage: {
      type: DataTypes.VIRTUAL,
      get() {
        const profile_picture_key = this.getDataValue('profile_picture_key');
        if (!profile_picture_key) return null;

        // Check storage type
        const storageType = process.env.STORAGE_TYPE || 'local';

        if (storageType === 'minio') {
          const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
          const port = process.env.MINIO_PORT || 9000;
          const bucket = process.env.MINIO_BUCKET || 'soundwave-tracks';
          const useSSL = process.env.MINIO_USE_SSL === 'true';
          const protocol = useSSL ? 'https' : 'http';
          return `${protocol}://${endpoint}:${port}/${bucket}/${profile_picture_key}`;
        } else if (storageType === 's3') {
          const region = process.env.AWS_REGION;
          const bucket = process.env.AWS_BUCKET_NAME;
          return `https://${bucket}.s3.${region}.amazonaws.com/${profile_picture_key}`;
        } else {
          // Local storage - construct URL
          // If it already starts with /uploads, use with backend URL
          if (profile_picture_key.startsWith('/uploads')) {
            return `http://localhost:5001${profile_picture_key}`;
          }
          return `http://localhost:5001/uploads/profiles/${profile_picture_key}`;
        }
      }
    }
  }, {
      tableName: 'Users'
  });

  return User;
};