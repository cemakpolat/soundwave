const { User, Track, Playlist, PlaylistTrack, Comment, Like, Follow, Notification } = require('./models');
const { sequelize } = require('./config/database');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt'); // Import bcrypt

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    // Drop the tables (ONLY for development!)
    // await sequelize.drop();
    // Sync the database without dropping tables
    await sequelize.sync(); // Remove { force: true } to avoid dropping tables
    console.log('Database synced successfully.');
    const saltRounds = 10; // You can adjust the salt rounds

    const hashedPassword = await bcrypt.hash('password123', saltRounds);

    // Create users
    const users = await User.bulkCreate([
      { username: 'creator', email: 'creator@test.com', password_hash: hashedPassword, role: 'creator' },
      { username: 'creator2', email: 'creator2@test.com', password_hash: hashedPassword, role: 'creator' },
      { username: 'listener', email: 'listener@test.com', password_hash: hashedPassword, role: 'listener' },
      { username: 'listener2', email: 'listener2@test.com', password_hash: hashedPassword, role: 'listener' },
      { username: 'admin', email: 'admin@test.com', password_hash: hashedPassword, role: 'admin' },
    ]);
    console.log('Users created successfully.');

    // Create tracks
    const tracks = await Track.bulkCreate([
      { title: 'Track 1', description: 'Description for Track 1', duration: 300, s3_key: 'tracks/track1.mp3', cover_image_key: 'images/cover1.jpg', userId: users[0].id },
      { title: 'Track 2', description: 'Description for Track 2', duration: 240, s3_key: 'tracks/track2.mp3', cover_image_key: 'images/cover2.jpg', userId: users[0].id },
      { title: 'Track 3', description: 'Description for Track 3', duration: 180, s3_key: 'tracks/track3.mp3', cover_image_key: 'images/cover3.jpg', userId: users[1].id },
      { title: 'Track 4', description: 'Description for Track 4', duration: 360, s3_key: 'tracks/track4.mp3', cover_image_key: 'images/cover4.jpg', userId: users[1].id },
      { title: 'Track 5', description: 'Description for Track 5', duration: 200, s3_key: 'tracks/track5.mp3', cover_image_key: 'images/cover5.jpg', userId: users[0].id },
      { title: 'Track 6', description: 'Description for Track 6', duration: 150, s3_key: 'tracks/track6.mp3', cover_image_key: 'images/cover6.jpg', userId: users[1].id },
      { title: 'Track 7', description: 'Description for Track 7', duration: 280, s3_key: 'tracks/track7.mp3', cover_image_key: 'images/cover7.jpg', userId: users[0].id },
      { title: 'Track 8', description: 'Description for Track 8', duration: 320, s3_key: 'tracks/track8.mp3', cover_image_key: 'images/cover8.jpg', userId: users[1].id },
      { title: 'Track 9', description: 'Description for Track 9', duration: 220, s3_key: 'tracks/track9.mp3', cover_image_key: 'images/cover9.jpg', userId: users[0].id },
      { title: 'Track 10', description: 'Description for Track 10', duration: 260, s3_key: 'tracks/track10.mp3', cover_image_key: 'images/cover10.jpg', userId: users[1].id },
    ]);
    console.log('Tracks created successfully.');

    // Create playlists
    const playlists = await Playlist.bulkCreate([
      { name: 'Playlist 1', description: 'Description for Playlist 1', userId: users[2].id },
      { name: 'Playlist 2', description: 'Description for Playlist 2', userId: users[3].id },
    ]);
    console.log('Playlists created successfully.');

    // Add tracks to playlists
    await PlaylistTrack.bulkCreate([
      { playlistId: playlists[0].id, trackId: tracks[0].id, position: 1 },
      { playlistId: playlists[0].id, trackId: tracks[1].id, position: 2 },
      { playlistId: playlists[1].id, trackId: tracks[2].id, position: 1 },
      { playlistId: playlists[1].id, trackId: tracks[3].id, position: 2 },
    ]);
    console.log('Tracks added to playlists successfully.');

    // Create likes
    await Like.bulkCreate([
      { userId: users[2].id, trackId: tracks[0].id },
      { userId: users[2].id, trackId: tracks[1].id },
      { userId: users[3].id, trackId: tracks[2].id },
      { userId: users[3].id, trackId: tracks[3].id },
    ]);
    console.log('Likes created successfully.');

    // Create comments
    await Comment.bulkCreate([
      { userId: users[2].id, trackId: tracks[0].id, content: 'Great track!' },
      { userId: users[3].id, trackId: tracks[1].id, content: 'I love this!' },
    ]);
    console.log('Comments created successfully.');

    // Create follows
    await Follow.bulkCreate([
      { followerId: users[2].id, followeeId: users[0].id },
      { followerId: users[3].id, followeeId: users[1].id },
    ]);
    console.log('Follows created successfully.');

    // Create notifications
    await Notification.bulkCreate([
      { userId: users[2].id, message: 'You have a new follower!' },
      { userId: users[3].id, message: 'Your track was liked!' },
    ]);
    console.log('Notifications created successfully.');

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit();
  }
};

// Run the seed script
seedDatabase();