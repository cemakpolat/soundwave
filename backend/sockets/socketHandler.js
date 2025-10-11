// sockets/socketHandler.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Store active users
const activeUsers = new Map(); // userId -> socketId

// Initialize Socket.IO
const initializeSocket = (io) => {
  // Authentication middleware for Socket.IO
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId} (Socket ID: ${socket.id})`);

    // Add user to active users
    activeUsers.set(socket.userId, socket.id);

    // Broadcast online status to friends/followers
    socket.broadcast.emit('user:online', { userId: socket.userId });

    // ==========================================
    // NOTIFICATION EVENTS
    // ==========================================

    // Listen for new track upload (creator)
    socket.on('track:uploaded', (data) => {
      // Broadcast to all followers
      socket.broadcast.emit('track:new', {
        userId: socket.userId,
        track: data.track,
        timestamp: new Date()
      });
    });

    // Listen for new like
    socket.on('track:liked', (data) => {
      const { trackId, trackOwnerId } = data;

      // Notify track owner
      const ownerSocketId = activeUsers.get(trackOwnerId);
      if (ownerSocketId) {
        io.to(ownerSocketId).emit('notification', {
          type: 'like',
          message: `Someone liked your track!`,
          trackId,
          userId: socket.userId,
          timestamp: new Date()
        });
      }
    });

    // Listen for new comment
    socket.on('track:commented', (data) => {
      const { trackId, trackOwnerId, comment } = data;

      // Notify track owner
      const ownerSocketId = activeUsers.get(trackOwnerId);
      if (ownerSocketId) {
        io.to(ownerSocketId).emit('notification', {
          type: 'comment',
          message: `Someone commented on your track!`,
          trackId,
          comment,
          userId: socket.userId,
          timestamp: new Date()
        });
      }
    });

    // Listen for new follower
    socket.on('user:followed', (data) => {
      const { followeeId } = data;

      // Notify followed user
      const followeeSocketId = activeUsers.get(followeeId);
      if (followeeSocketId) {
        io.to(followeeSocketId).emit('notification', {
          type: 'follow',
          message: `Someone started following you!`,
          userId: socket.userId,
          timestamp: new Date()
        });
      }
    });

    // ==========================================
    // REAL-TIME UPDATES
    // ==========================================

    // Track play count update
    socket.on('track:play', (data) => {
      const { trackId, newPlayCount } = data;

      // Broadcast updated play count to all users viewing this track
      io.emit('track:playcount-updated', {
        trackId,
        playCount: newPlayCount
      });
    });

    // Typing indicator for comments
    socket.on('comment:typing', (data) => {
      const { trackId } = data;
      socket.broadcast.emit('comment:typing', {
        trackId,
        userId: socket.userId,
        username: data.username
      });
    });

    socket.on('comment:stop-typing', (data) => {
      const { trackId } = data;
      socket.broadcast.emit('comment:stop-typing', {
        trackId,
        userId: socket.userId
      });
    });

    // ==========================================
    // PRESENCE & STATUS
    // ==========================================

    // User is currently playing a track
    socket.on('status:playing', (data) => {
      const { trackId, trackTitle } = data;

      // Broadcast to followers only (you'd need to fetch followers list)
      socket.broadcast.emit('friend:status', {
        userId: socket.userId,
        status: 'playing',
        trackId,
        trackTitle
      });
    });

    // ==========================================
    // DISCONNECT HANDLER
    // ==========================================

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);

      // Remove from active users
      activeUsers.delete(socket.userId);

      // Broadcast offline status
      socket.broadcast.emit('user:offline', { userId: socket.userId });
    });

    // ==========================================
    // ERROR HANDLER
    // ==========================================

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return { io, activeUsers };
};

// Helper function to send notification to specific user
const sendNotificationToUser = (io, userId, notification) => {
  const socketId = activeUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit('notification', notification);
    return true;
  }
  return false;
};

// Helper function to broadcast to multiple users
const broadcastToUsers = (io, userIds, event, data) => {
  userIds.forEach(userId => {
    const socketId = activeUsers.get(userId);
    if (socketId) {
      io.to(socketId).emit(event, data);
    }
  });
};

module.exports = {
  initializeSocket,
  sendNotificationToUser,
  broadcastToUsers,
  activeUsers
};
