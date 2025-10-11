// server.js
const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const trackRoutes = require('./routes/trackRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const socialRoutes = require('./routes/socialRoutes');
const { sequelize } = require('./config/database');
const analyticsRoutes = require('./routes/analyticsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const searchRoutes = require('./routes/searchRoutes');
const historyRoutes = require('./routes/historyRoutes');
const queueRoutes = require('./routes/queueRoutes');
const albumRoutes = require('./routes/albumRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const handleValidationErrors = require('./middlewares/errorHandler');
const { initializeMinIO } = require('./config/minioSetup');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;

// ==========================================
// SOCKET.IO SETUP (Real-time features)
// ==========================================
let io;
try {
  const socketIO = require('socket.io');
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  const { initializeSocket } = require('./sockets/socketHandler');
  initializeSocket(io);
  console.log('✅ Socket.IO initialized');
} catch (error) {
  console.log('⚠️  Socket.IO not available (optional feature). Install with: npm install socket.io');
  console.log('   Real-time features will be disabled.');
}

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads directory)
const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR || './uploads');
app.use('/uploads', express.static(uploadDir));

// Use error-handling middleware
app.use(handleValidationErrors);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/recommendations', recommendationRoutes);




// Start the server
server.listen(PORT, async () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 Soundwave Server Started Successfully!`);
  console.log(`${'='.repeat(60)}`);
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
  if (io) {
    console.log(`⚡ WebSocket server running on: ws://localhost:${PORT}`);
  }
  console.log(`${'='.repeat(60)}\n`);

  // Test the database connection
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }

  // Initialize MinIO if configured
  try {
    await initializeMinIO();
  } catch (error) {
    console.error('⚠️  MinIO initialization warning:', error.message);
    console.error('   Server will continue, but file uploads may fail if using MinIO storage');
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`📚 Available Routes:`);
  console.log(`${'='.repeat(60)}`);
  console.log(`   Auth:            /api/auth`);
  console.log(`   Users:           /api/users`);
  console.log(`   Tracks:          /api/tracks`);
  console.log(`   Albums:          /api/albums        ⚡ NEW`);
  console.log(`   Playlists:       /api/playlists`);
  console.log(`   Queue:           /api/queue         ⚡ NEW`);
  console.log(`   History:         /api/history       ⚡ NEW`);
  console.log(`   Search:          /api/search        ⚡ NEW`);
  console.log(`   Recommendations: /api/recommendations ⚡ NEW`);
  console.log(`   Analytics:       /api/analytics     ⚡ ENHANCED`);
  console.log(`   Admin:           /api/admin         ⚡ ENHANCED`);
  console.log(`   Notifications:   /api/notifications`);
  console.log(`${'='.repeat(60)}\n`);
});