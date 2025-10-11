// config/minioSetup.js
const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Initialize MinIO bucket
 * Creates the bucket if it doesn't exist
 */
const initializeMinIO = async () => {
  const storageType = process.env.STORAGE_TYPE || 'local';

  if (storageType !== 'minio') {
    console.log('MinIO not configured (STORAGE_TYPE !== "minio"), skipping initialization');
    return;
  }

  console.log('Initializing MinIO...');

  try {
    // Configure MinIO client
    const s3 = new AWS.S3({
      endpoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || 9000),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKeyId: process.env.MINIO_ROOT_USER || 'soundwave',
      secretAccessKey: process.env.MINIO_ROOT_PASSWORD || 'soundwave123',
      s3ForcePathStyle: true, // Required for MinIO
      signatureVersion: 'v4'
    });

    const bucketName = process.env.MINIO_BUCKET || 'soundwave-tracks';

    // Check if bucket exists
    try {
      await s3.headBucket({ Bucket: bucketName }).promise();
      console.log(`✅ MinIO bucket "${bucketName}" already exists`);
    } catch (error) {
      if (error.code === 'NotFound' || error.code === 'NoSuchBucket') {
        // Bucket doesn't exist, create it
        console.log(`Creating MinIO bucket "${bucketName}"...`);
        await s3.createBucket({ Bucket: bucketName }).promise();
        console.log(`✅ MinIO bucket "${bucketName}" created successfully`);

        // Set bucket policy to allow read access for specific paths
        // (Optional: uncomment if you want public read access)
        /*
        const bucketPolicy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: '*',
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${bucketName}/*`]
            }
          ]
        };

        await s3.putBucketPolicy({
          Bucket: bucketName,
          Policy: JSON.stringify(bucketPolicy)
        }).promise();

        console.log(`✅ MinIO bucket policy set for public read access`);
        */
      } else {
        throw error;
      }
    }

    // Test connection by listing buckets
    const buckets = await s3.listBuckets().promise();
    console.log(`✅ MinIO connection successful! Found ${buckets.Buckets.length} bucket(s)`);

    return s3;
  } catch (error) {
    console.error('❌ MinIO initialization failed:', error.message);
    console.error('Make sure MinIO is running (docker-compose up minio)');
    throw error;
  }
};

module.exports = { initializeMinIO };
