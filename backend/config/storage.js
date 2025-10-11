// config/storage.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');

// Determine storage type from environment
const storageType = process.env.STORAGE_TYPE || 'local';

// ==========================================
// LOCAL FILE STORAGE CONFIGURATION
// ==========================================

const setupLocalStorage = () => {
  // Ensure upload directories exist
  const uploadDir = path.resolve(__dirname, '..', process.env.UPLOAD_DIR || './uploads');
  const tracksDir = path.join(uploadDir, 'tracks');
  const coversDir = path.join(uploadDir, 'covers');
  const profilesDir = path.join(uploadDir, 'profiles');

  [uploadDir, tracksDir, coversDir, profilesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });

  // Multer disk storage configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'track' || file.fieldname === 'audio') {
        cb(null, tracksDir);
      } else if (file.fieldname === 'cover' || file.fieldname === 'coverImage') {
        cb(null, coversDir);
      } else if (file.fieldname === 'profilePicture') {
        cb(null, profilesDir);
      } else {
        cb(null, uploadDir);
      }
    },
    filename: (req, file, cb) => {
      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext)
        .replace(/[^a-zA-Z0-9]/g, '-')
        .substring(0, 50);
      cb(null, `${file.fieldname}-${baseName}-${uniqueSuffix}${ext}`);
    }
  });

  return storage;
};

// ==========================================
// S3/MinIO STORAGE CONFIGURATION
// ==========================================

const setupS3Storage = () => {
  // Configure AWS S3 or MinIO
  const s3Config = {};

  if (storageType === 'minio') {
    // MinIO configuration
    s3Config.endpoint = process.env.MINIO_ENDPOINT || 'localhost';
    s3Config.port = parseInt(process.env.MINIO_PORT || 9000);
    s3Config.useSSL = process.env.MINIO_USE_SSL === 'true';
    s3Config.accessKeyId = process.env.MINIO_ROOT_USER || 'soundwave';
    s3Config.secretAccessKey = process.env.MINIO_ROOT_PASSWORD || 'soundwave123';
    s3Config.s3ForcePathStyle = true; // Required for MinIO
    s3Config.signatureVersion = 'v4';
  } else {
    // AWS S3 configuration
    s3Config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    s3Config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    s3Config.region = process.env.AWS_REGION || 'us-east-1';
  }

  const s3 = new AWS.S3(s3Config);

  // Use multer-s3 for direct S3/MinIO uploads
  const multerS3 = require('multer-s3');

  const bucketName = storageType === 'minio'
    ? (process.env.MINIO_BUCKET || 'soundwave-tracks')
    : process.env.AWS_BUCKET_NAME;

  const storage = multerS3({
    s3: s3,
    bucket: bucketName,
    acl: 'private',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      let folder = 'uploads';
      if (file.fieldname === 'track' || file.fieldname === 'audio') {
        folder = 'tracks';
      } else if (file.fieldname === 'cover' || file.fieldname === 'coverImage') {
        folder = 'covers';
      } else if (file.fieldname === 'profilePicture') {
        folder = 'profiles';
      }
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `${folder}/${uniqueSuffix}${ext}`);
    }
  });

  return storage;
};

// ==========================================
// FILE FILTER (Security)
// ==========================================

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'track' || file.fieldname === 'audio') {
    // Accept audio files
    const allowedMimeTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/wave',
      'audio/x-wav',
      'audio/ogg',
      'audio/flac',
      'audio/aac',
      'audio/m4a',
      'audio/x-m4a'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid audio file type: ${file.mimetype}. Allowed types: ${allowedMimeTypes.join(', ')}`), false);
    }
  } else if (file.fieldname === 'cover' || file.fieldname === 'coverImage' || file.fieldname === 'profilePicture') {
    // Accept image files
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid image file type: ${file.mimetype}. Allowed types: ${allowedMimeTypes.join(', ')}`), false);
    }
  } else {
    cb(new Error(`Unknown field: ${file.fieldname}`), false);
  }
};

// ==========================================
// MULTER UPLOAD CONFIGURATION
// ==========================================

const storage = (storageType === 's3' || storageType === 'minio')
  ? setupS3Storage()
  : setupLocalStorage();

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
    files: 5 // Max 5 files per request
  }
});

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Get public URL for a file
 * @param {string} filePath - The file path (for local) or S3/MinIO key
 * @param {string} type - 'track' or 'cover'
 * @returns {string} - Public URL
 */
const getFileUrl = (filePath, type = 'track') => {
  if (!filePath) return null;

  if (storageType === 'minio') {
    // Return MinIO URL
    const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
    const port = process.env.MINIO_PORT || 9000;
    const bucket = process.env.MINIO_BUCKET || 'soundwave-tracks';
    const useSSL = process.env.MINIO_USE_SSL === 'true';
    const protocol = useSSL ? 'https' : 'http';
    return `${protocol}://${endpoint}:${port}/${bucket}/${filePath}`;
  } else if (storageType === 's3') {
    // Return S3 URL or CloudFront URL
    const region = process.env.AWS_REGION;
    const bucket = process.env.AWS_BUCKET_NAME;
    return `https://${bucket}.s3.${region}.amazonaws.com/${filePath}`;
  } else {
    // Return local URL
    // If filePath already starts with /uploads, return as is
    if (filePath.startsWith('/uploads')) {
      return filePath;
    }
    // Otherwise, construct the path
    return `/uploads/${type}s/${path.basename(filePath)}`;
  }
};

/**
 * Delete a file from storage
 * @param {string} filePath - The file path (for local) or S3/MinIO key
 * @returns {Promise<void>}
 */
const deleteFile = async (filePath) => {
  if (!filePath) return;

  if (storageType === 'minio' || storageType === 's3') {
    // Delete from MinIO or S3
    const s3Config = {};

    if (storageType === 'minio') {
      s3Config.endpoint = process.env.MINIO_ENDPOINT || 'localhost';
      s3Config.port = parseInt(process.env.MINIO_PORT || 9000);
      s3Config.useSSL = process.env.MINIO_USE_SSL === 'true';
      s3Config.accessKeyId = process.env.MINIO_ROOT_USER || 'soundwave';
      s3Config.secretAccessKey = process.env.MINIO_ROOT_PASSWORD || 'soundwave123';
      s3Config.s3ForcePathStyle = true;
      s3Config.signatureVersion = 'v4';
    } else {
      s3Config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
      s3Config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
      s3Config.region = process.env.AWS_REGION;
    }

    const s3 = new AWS.S3(s3Config);

    const bucketName = storageType === 'minio'
      ? (process.env.MINIO_BUCKET || 'soundwave-tracks')
      : process.env.AWS_BUCKET_NAME;

    await s3.deleteObject({
      Bucket: bucketName,
      Key: filePath
    }).promise();

    console.log(`Deleted file from ${storageType}: ${filePath}`);
  } else {
    // Delete from local filesystem
    const uploadDir = path.resolve(__dirname, '..', process.env.UPLOAD_DIR || './uploads');
    const fullPath = filePath.startsWith('/uploads')
      ? path.join(uploadDir, filePath.replace('/uploads', ''))
      : filePath;

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`Deleted file: ${fullPath}`);
    }
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  upload,
  getFileUrl,
  deleteFile,
  storageType
};
