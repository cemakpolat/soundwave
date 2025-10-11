# Soundwave - Complete Spotify Features Implementation Plan

**Goal:** Build a complete Spotify clone with all essential features

> **📝 Important Note:**
> This document serves TWO purposes:
> 1. ✅ **Tracks what's IMPLEMENTED** - Core features are working (auth, tracks, playlists, MinIO storage)
> 2. 📋 **Documents what's PLANNED** - ~87 API endpoints for full Spotify-like experience
>
> **Current Progress:** ~30% implemented | Phase 1 (MinIO) ✅ Complete | Next: Admin features (Phase 2)

---

## Table of Contents

1. [Quick Start with MinIO](#quick-start-with-minio) ⚡ **NEW**
2. [Current Status](#current-status)
3. [Storage Infrastructure (MinIO)](#storage-infrastructure-minio)
4. [User Roles & Permissions](#user-roles--permissions)
5. [Required Features by Role](#required-features-by-role)
6. [Missing Functions & API Endpoints](#missing-functions--api-endpoints)
7. [Development Roadmap](#development-roadmap)
8. [Implementation Checklist](#implementation-checklist)

---

## Quick Start with MinIO

**MinIO is now fully integrated! 🎉** Here's how to get started:

### 1. Start All Services

```bash
# Start PostgreSQL and MinIO
docker-compose up -d

# Verify services are running
docker-compose ps
```

### 2. Configure Environment

```bash
# Set storage type to MinIO in .env
STORAGE_TYPE=minio
```

### 3. Start Backend

```bash
cd backend
npm install
npm run migrate
npm run dev
```

**Expected Output:**
```
✅ MinIO bucket "soundwave-tracks" created successfully
✅ MinIO connection successful! Found 1 bucket(s)
```

### 4. Access MinIO Console

- **URL:** http://localhost:9001
- **Credentials:** soundwave / soundwave123
- **Uploaded files appear in:**
  - `tracks/` - Audio files
  - `covers/` - Cover images

### 5. Test File Upload

```bash
# Login as creator
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"creator@test.com","password":"password123"}'

# Upload a track (use the token from login)
curl -X POST http://localhost:5001/api/tracks/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "audio=@/path/to/your/song.mp3" \
  -F "coverImage=@/path/to/cover.jpg" \
  -F "title=My Test Song" \
  -F "description=Testing MinIO upload" \
  -F "duration=180"

# Check MinIO console - file should appear!
```

**For more details, see [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)**

---

## Current Status

### ✅ Completed Features

**Authentication:**
- ✅ User registration with role selection
- ✅ Login with JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Role-based authorization middleware

**Creator Features:**
- ✅ Upload tracks (audio + cover)
- ✅ View own tracks
- ✅ Update track metadata
- ✅ Delete tracks
- ✅ Pluggable file storage (Local/MinIO/S3)

**Listener Features:**
- ✅ Browse/search tracks
- ✅ Play tracks
- ✅ Like/unlike tracks
- ✅ Comment on tracks
- ✅ Follow/unfollow users
- ✅ Create playlists
- ✅ Manage playlists

**Admin Features (Partial):**
- ✅ Ban/unban users
- ✅ Platform statistics
- ✅ Track approval

### ❌ Missing Critical Features

**Admin:**
- ❌ List all users with filters
- ❌ View user details
- ❌ Delete any user
- ❌ View all tracks
- ❌ Delete any track
- ❌ Advanced analytics dashboard

**Creator:**
- ❌ Track analytics (plays over time)
- ❌ Listener demographics
- ❌ Revenue tracking
- ❌ Album management
- ❌ Artist profile customization

**Listener:**
- ❌ Personalized recommendations
- ❌ Recently played history
- ❌ Queue management
- ❌ Discover weekly
- ❌ Radio stations

**General:**
- ✅ MinIO object storage - **COMPLETED** (+ Local & S3 support)
- ❌ Real-time notifications
- ❌ Search with filters
- ❌ Genres/categories
- ❌ Featured playlists

---

## Storage Infrastructure (MinIO)

### Why MinIO?

- ✅ S3-compatible (same API as AWS S3)
- ✅ Runs locally in Docker
- ✅ Perfect for development
- ✅ Can switch to AWS S3 in production
- ✅ Has web UI for management

### MinIO Setup

**Docker Compose Configuration:**
```yaml
minio:
  image: minio/minio:latest
  container_name: soundwave_minio
  ports:
    - "9000:9000"     # API
    - "9001:9001"     # Web UI
  environment:
    MINIO_ROOT_USER: soundwave
    MINIO_ROOT_PASSWORD: soundwave123
  command: server /data --console-address ":9001"
  volumes:
    - minio_data:/data
  networks:
    - soundwave_network
```

**Environment Configuration:**
```env
# MinIO Configuration
STORAGE_TYPE=minio
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=soundwave
MINIO_SECRET_KEY=soundwave123
MINIO_BUCKET=soundwave-tracks
MINIO_USE_SSL=false
```

**Access Points:**
- API: http://localhost:9000
- Web UI: http://localhost:9001
- Credentials: soundwave / soundwave123

---

## User Roles & Permissions

### Permission Matrix

| Feature | Admin | Creator | Listener |
|---------|-------|---------|----------|
| **Authentication** |
| Register | ✅ | ✅ | ✅ |
| Login | ✅ | ✅ | ✅ |
| Update profile | ✅ | ✅ | ✅ |
| Delete own account | ✅ | ✅ | ✅ |
| **User Management** |
| View all users | ✅ | ❌ | ❌ |
| View user details | ✅ | ✅ (own) | ✅ (own) |
| Ban users | ✅ | ❌ | ❌ |
| Delete users | ✅ | ❌ | ❌ |
| **Track Management** |
| Upload tracks | ✅ | ✅ | ❌ |
| Edit own tracks | ✅ | ✅ | ❌ |
| Delete own tracks | ✅ | ✅ | ❌ |
| Delete any track | ✅ | ❌ | ❌ |
| View all tracks | ✅ | ✅ | ✅ |
| Play tracks | ✅ | ✅ | ✅ |
| **Social Features** |
| Like tracks | ✅ | ✅ | ✅ |
| Comment | ✅ | ✅ | ✅ |
| Follow users | ✅ | ✅ | ✅ |
| **Playlists** |
| Create playlists | ✅ | ✅ | ✅ |
| Manage own playlists | ✅ | ✅ | ✅ |
| View public playlists | ✅ | ✅ | ✅ |
| **Analytics** |
| View platform stats | ✅ | ❌ | ❌ |
| View own track stats | ✅ | ✅ | ❌ |
| **Content Moderation** |
| Approve tracks | ✅ | ❌ | ❌ |
| Flag content | ✅ | ✅ | ✅ |

---

## Required Features by Role

### 🔴 ADMIN Features

#### User Management
```javascript
// 1. Get all users with pagination and filters
GET /api/admin/users?page=1&limit=20&role=creator&banned=false&search=john

// 2. Get user details
GET /api/admin/users/:id

// 3. Update user (change role, etc)
PUT /api/admin/users/:id

// 4. Delete user
DELETE /api/admin/users/:id

// 5. Ban user
PUT /api/admin/users/:id/ban

// 6. Unban user
PUT /api/admin/users/:id/unban
```

#### Content Management
```javascript
// 7. Get all tracks with filters
GET /api/admin/tracks?page=1&limit=20&approved=false&userId=123

// 8. Get track details
GET /api/admin/tracks/:id

// 9. Approve track
PUT /api/admin/tracks/:id/approve

// 10. Delete any track
DELETE /api/admin/tracks/:id

// 11. Get all playlists
GET /api/admin/playlists

// 12. Delete any playlist
DELETE /api/admin/playlists/:id

// 13. Get all comments
GET /api/admin/comments

// 14. Delete any comment
DELETE /api/admin/comments/:id
```

#### Analytics & Reports
```javascript
// 15. Get platform statistics
GET /api/admin/analytics/platform

// 16. Get user growth over time
GET /api/admin/analytics/users/growth?period=30d

// 17. Get track upload trends
GET /api/admin/analytics/tracks/trends

// 18. Get most active users
GET /api/admin/analytics/users/active

// 19. Get popular tracks
GET /api/admin/analytics/tracks/popular

// 20. Get storage usage
GET /api/admin/analytics/storage

// 21. Get revenue reports (if monetized)
GET /api/admin/analytics/revenue
```

### 🎵 CREATOR Features

#### Track Management
```javascript
// 22. Upload new track
POST /api/tracks/upload

// 23. Get own tracks
GET /api/tracks/my-tracks

// 24. Update track
PUT /api/tracks/:id

// 25. Delete track
DELETE /api/tracks/:id

// 26. Get track analytics
GET /api/tracks/:id/analytics

// 27. Get track listeners
GET /api/tracks/:id/listeners
```

#### Album Management
```javascript
// 28. Create album
POST /api/albums

// 29. Get own albums
GET /api/albums/my-albums

// 30. Update album
PUT /api/albums/:id

// 31. Add track to album
POST /api/albums/:id/tracks

// 32. Remove track from album
DELETE /api/albums/:id/tracks/:trackId

// 33. Delete album
DELETE /api/albums/:id
```

#### Artist Profile
```javascript
// 34. Update artist profile
PUT /api/artists/profile

// 35. Get artist analytics
GET /api/artists/analytics

// 36. Get followers
GET /api/artists/followers

// 37. Get listener demographics
GET /api/artists/demographics
```

### 🎧 LISTENER Features

#### Discovery & Search
```javascript
// 38. Search tracks
GET /api/search/tracks?q=jazz&genre=jazz&minDuration=120

// 39. Search artists
GET /api/search/artists?q=john

// 40. Search playlists
GET /api/search/playlists?q=workout

// 41. Browse by genre
GET /api/browse/genres/:genre

// 42. Get featured playlists
GET /api/browse/featured

// 43. Get new releases
GET /api/browse/new-releases

// 44. Get discover weekly
GET /api/recommendations/discover-weekly

// 45. Get daily mix
GET /api/recommendations/daily-mix
```

#### Playback & Queue
```javascript
// 46. Get track URL for playback
GET /api/tracks/:id/url

// 47. Record play event
POST /api/tracks/:id/play

// 48. Get recently played
GET /api/me/recently-played

// 49. Get current queue
GET /api/me/queue

// 50. Add to queue
POST /api/me/queue

// 51. Remove from queue
DELETE /api/me/queue/:trackId

// 52. Clear queue
DELETE /api/me/queue
```

#### Library Management
```javascript
// 53. Get saved tracks (liked)
GET /api/me/tracks

// 54. Save track
POST /api/me/tracks/:id

// 55. Remove saved track
DELETE /api/me/tracks/:id

// 56. Get saved albums
GET /api/me/albums

// 57. Save album
POST /api/me/albums/:id

// 58. Remove saved album
DELETE /api/me/albums/:id
```

#### Playlists
```javascript
// 59. Create playlist
POST /api/playlists

// 60. Get own playlists
GET /api/me/playlists

// 61. Get playlist
GET /api/playlists/:id

// 62. Update playlist
PUT /api/playlists/:id

// 63. Delete playlist
DELETE /api/playlists/:id

// 64. Add track to playlist
POST /api/playlists/:id/tracks

// 65. Remove track from playlist
DELETE /api/playlists/:id/tracks/:trackId

// 66. Reorder playlist
PUT /api/playlists/:id/tracks

// 67. Follow playlist
POST /api/playlists/:id/followers

// 68. Unfollow playlist
DELETE /api/playlists/:id/followers
```

#### Social Features
```javascript
// 69. Like track
POST /api/tracks/:id/like

// 70. Unlike track
DELETE /api/tracks/:id/like

// 71. Comment on track
POST /api/tracks/:id/comments

// 72. Get track comments
GET /api/tracks/:id/comments

// 73. Delete comment
DELETE /api/comments/:id

// 74. Follow user
POST /api/users/:id/follow

// 75. Unfollow user
DELETE /api/users/:id/follow

// 76. Get following
GET /api/me/following

// 77. Get followers
GET /api/me/followers

// 78. Get user profile
GET /api/users/:id

// 79. Get user's public playlists
GET /api/users/:id/playlists
```

#### Notifications
```javascript
// 80. Get notifications
GET /api/notifications

// 81. Mark as read
PUT /api/notifications/:id/read

// 82. Mark all as read
PUT /api/notifications/read-all

// 83. Delete notification
DELETE /api/notifications/:id
```

### 🌐 PUBLIC Features (No Auth Required)

```javascript
// 84. Get trending tracks
GET /api/public/trending

// 85. Get top charts
GET /api/public/charts

// 86. Get genres
GET /api/public/genres

// 87. Browse by category
GET /api/public/categories/:category
```

---

## Missing Functions & API Endpoints

### Priority 1: CRITICAL (Core Functionality)

#### Admin User Management
```javascript
// backend/controllers/adminController.js

// Get all users with filters
const getAllUsers = async (req, res) => {
  const { page = 1, limit = 20, role, banned, search } = req.query;
  const where = {};

  if (role) where.role = role;
  if (banned !== undefined) where.isBanned = banned === 'true';
  if (search) {
    where[Op.or] = [
      { username: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const users = await User.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset: (page - 1) * limit,
    attributes: { exclude: ['password_hash'] },
    include: [
      { model: Track, as: 'tracks', attributes: ['id'] },
      { model: Playlist, as: 'playlists', attributes: ['id'] }
    ]
  });

  res.json({
    users: users.rows,
    pagination: {
      total: users.count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(users.count / limit)
    }
  });
};

// Get user details
const getUserDetails = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id, {
    attributes: { exclude: ['password_hash'] },
    include: [
      { model: Track, as: 'tracks' },
      { model: Playlist, as: 'playlists' },
      { model: Follow, as: 'following' },
      { model: Follow, as: 'followers' }
    ]
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({ user });
};

// Update user (change role, etc)
const updateUserByAdmin = async (req, res) => {
  const { id } = req.params;
  const { role, isBanned } = req.body;

  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (role) user.role = role;
  if (isBanned !== undefined) user.isBanned = isBanned;

  await user.save();
  res.json({ user });
};

// Delete user
const deleteUserByAdmin = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Delete all user's tracks and files
  const tracks = await Track.findAll({ where: { userId: id } });
  for (const track of tracks) {
    await deleteFile(track.s3_key);
    if (track.cover_image_key) await deleteFile(track.cover_image_key);
  }

  await user.destroy();
  res.json({ message: 'User deleted successfully' });
};
```

#### Admin Content Management
```javascript
// Get all tracks with filters
const getAllTracks = async (req, res) => {
  const { page = 1, limit = 20, approved, userId } = req.query;
  const where = {};

  if (approved !== undefined) where.isApproved = approved === 'true';
  if (userId) where.userId = userId;

  const tracks = await Track.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset: (page - 1) * limit,
    include: [
      { model: User, attributes: ['id', 'username'] },
      { model: Like, as: 'likes' },
      { model: Comment, as: 'comments' }
    ],
    order: [['createdAt', 'DESC']]
  });

  res.json({
    tracks: tracks.rows,
    pagination: {
      total: tracks.count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(tracks.count / limit)
    }
  });
};

// Delete any track (admin)
const deleteAnyTrack = async (req, res) => {
  const { id } = req.params;

  const track = await Track.findByPk(id);
  if (!track) {
    return res.status(404).json({ message: 'Track not found' });
  }

  // Delete files
  await deleteFile(track.s3_key);
  if (track.cover_image_key) await deleteFile(track.cover_image_key);

  await track.destroy();
  res.json({ message: 'Track deleted successfully' });
};
```

### Priority 2: IMPORTANT (Enhanced Functionality)

#### Search & Discovery
```javascript
// backend/controllers/searchController.js

// Search tracks with filters
const searchTracks = async (req, res) => {
  const { q, genre, minDuration, maxDuration, sortBy = 'relevance' } = req.query;

  const where = {};

  if (q) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${q}%` } },
      { description: { [Op.iLike]: `%${q}%` } }
    ];
  }

  if (genre) where.genre = genre;
  if (minDuration) where.duration = { [Op.gte]: parseInt(minDuration) };
  if (maxDuration) where.duration = { ...where.duration, [Op.lte]: parseInt(maxDuration) };

  let order = [['createdAt', 'DESC']];
  if (sortBy === 'popular') order = [['play_count', 'DESC']];
  if (sortBy === 'recent') order = [['createdAt', 'DESC']];

  const tracks = await Track.findAll({
    where,
    include: [{ model: User, attributes: ['id', 'username'] }],
    order
  });

  res.json({ tracks });
};

// Get recommendations based on user history
const getRecommendations = async (req, res) => {
  const userId = req.user.id;

  // Get user's liked tracks
  const likedTracks = await Like.findAll({
    where: { userId },
    include: [{ model: Track }]
  });

  // Simple recommendation: tracks from same creators or similar genre
  // In production, use ML algorithms
  const recommendations = await Track.findAll({
    where: {
      userId: { [Op.in]: likedTracks.map(l => l.Track.userId) },
      id: { [Op.notIn]: likedTracks.map(l => l.Track.id) }
    },
    limit: 20,
    order: [['play_count', 'DESC']]
  });

  res.json({ recommendations });
};
```

#### Recently Played
```javascript
// backend/models/PlayHistory.js
module.exports = (sequelize, DataTypes) => {
  const PlayHistory = sequelize.define('PlayHistory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    trackId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    playedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'PlayHistory',
    timestamps: false
  });

  return PlayHistory;
};

// backend/controllers/historyController.js
const getRecentlyPlayed = async (req, res) => {
  const userId = req.user.id;

  const history = await PlayHistory.findAll({
    where: { userId },
    include: [{ model: Track, include: [User] }],
    order: [['playedAt', 'DESC']],
    limit: 50
  });

  res.json({ history });
};

const recordPlay = async (req, res) => {
  const userId = req.user.id;
  const { trackId } = req.params;

  await PlayHistory.create({ userId, trackId });
  res.json({ message: 'Play recorded' });
};
```

#### Queue Management
```javascript
// backend/models/Queue.js
module.exports = (sequelize, DataTypes) => {
  const Queue = sequelize.define('Queue', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    trackId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Queue',
    timestamps: true
  });

  return Queue;
};

// backend/controllers/queueController.js
const getQueue = async (req, res) => {
  const userId = req.user.id;

  const queue = await Queue.findAll({
    where: { userId },
    include: [{ model: Track, include: [User] }],
    order: [['position', 'ASC']]
  });

  res.json({ queue });
};

const addToQueue = async (req, res) => {
  const userId = req.user.id;
  const { trackId } = req.body;

  const maxPosition = await Queue.max('position', { where: { userId } }) || 0;

  await Queue.create({
    userId,
    trackId,
    position: maxPosition + 1
  });

  res.json({ message: 'Track added to queue' });
};

const clearQueue = async (req, res) => {
  const userId = req.user.id;

  await Queue.destroy({ where: { userId } });

  res.json({ message: 'Queue cleared' });
};
```

### Priority 3: NICE TO HAVE (Future Enhancements)

#### Album Management
```javascript
// backend/models/Album.js
module.exports = (sequelize, DataTypes) => {
  const Album = sequelize.define('Album', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    coverImageKey: {
      type: DataTypes.TEXT
    },
    releaseDate: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'Albums'
  });

  return Album;
};

// Controllers in backend/controllers/albumController.js
```

#### Genre/Category System
```javascript
// backend/models/Genre.js
// backend/controllers/genreController.js
// Predefined genres: Rock, Pop, Jazz, Classical, Hip Hop, Electronic, etc.
```

#### Advanced Analytics
```javascript
// backend/controllers/analyticsController.js

// Track plays over time
const getTrackAnalytics = async (req, res) => {
  const { id } = req.params;
  const { period = '30d' } = req.query;

  // Query play history grouped by date
  const analytics = await sequelize.query(`
    SELECT DATE(played_at) as date, COUNT(*) as plays
    FROM "PlayHistory"
    WHERE track_id = :trackId
    AND played_at > NOW() - INTERVAL :period
    GROUP BY DATE(played_at)
    ORDER BY date ASC
  `, {
    replacements: { trackId: id, period },
    type: QueryTypes.SELECT
  });

  res.json({ analytics });
};

// User demographics
const getListenerDemographics = async (req, res) => {
  const userId = req.user.id;

  // Get countries, ages, etc. of listeners
  // Requires additional user profile fields
};
```

---

## Development Roadmap

### Phase 1: Infrastructure (Week 1) ✅ COMPLETED

**Goal:** Set up MinIO and fix critical missing features

- [x] Add MinIO to docker-compose.yml
- [x] Update storage config to support MinIO
- [x] Test file upload/download with MinIO
- [x] Create MinIO buckets on startup
- [x] Update .env.example with MinIO config

### Phase 2: Admin Features (Week 2)

**Goal:** Complete admin panel functionality

- [ ] Implement getAllUsers with filters
- [ ] Implement getUserDetails for admin
- [ ] Implement updateUserByAdmin
- [ ] Implement deleteUserByAdmin
- [ ] Implement getAllTracks for admin
- [ ] Implement deleteAnyTrack for admin
- [ ] Create admin routes
- [ ] Test all admin endpoints

### Phase 3: Enhanced Search & Discovery (Week 3)

**Goal:** Improve content discovery

- [ ] Implement advanced search with filters
- [ ] Add genre/category system
- [ ] Implement searchTracks controller
- [ ] Implement browse endpoints
- [ ] Add featured/trending logic
- [ ] Test search functionality

### Phase 4: Playback History & Queue (Week 4)

**Goal:** Track user listening behavior

- [ ] Create PlayHistory model and migration
- [ ] Create Queue model and migration
- [ ] Implement getRecentlyPlayed
- [ ] Implement recordPlay
- [ ] Implement queue management (add, remove, clear)
- [ ] Test playback tracking

### Phase 5: Recommendations (Week 5)

**Goal:** Personalized user experience

- [ ] Implement basic recommendation algorithm
- [ ] Create getRecommendations endpoint
- [ ] Implement discover weekly
- [ ] Implement daily mix
- [ ] Test recommendations

### Phase 6: Albums & Artist Profiles (Week 6)

**Goal:** Enhanced creator features

- [ ] Create Album model
- [ ] Implement album CRUD
- [ ] Link tracks to albums
- [ ] Enhanced artist profile
- [ ] Artist analytics

### Phase 7: Advanced Analytics (Week 7)

**Goal:** Data-driven insights

- [ ] Track analytics dashboard
- [ ] User growth charts
- [ ] Revenue tracking
- [ ] Listener demographics
- [ ] Export reports

### Phase 8: Real-time Features (Week 8)

**Goal:** Live updates

- [ ] Set up WebSocket/Socket.io
- [ ] Real-time notifications
- [ ] Live play count updates
- [ ] Online user status
- [ ] Chat/messaging (optional)

---

## Implementation Checklist

### MinIO Integration ✅ COMPLETED

```bash
# 1. Update docker-compose.yml
- [x] Add MinIO service
- [x] Add MinIO volumes
- [x] Configure ports (9000, 9001)

# 2. Update backend/config/storage.js
- [x] Add MinIO client configuration
- [x] Add bucket creation on startup
- [x] Test upload/download

# 3. Update .env
- [x] Add MinIO environment variables
- [x] Document in .env.example

# 4. Test
- [x] Upload file via API
- [x] Verify file in MinIO UI
- [x] Download/play file
- [x] Delete file
```

### Admin User Management

```bash
# 1. Update backend/controllers/adminController.js
- [ ] Implement getAllUsers
- [ ] Implement getUserDetails
- [ ] Implement updateUserByAdmin
- [ ] Implement deleteUserByAdmin

# 2. Update backend/routes/adminRoutes.js
- [ ] Add GET /admin/users
- [ ] Add GET /admin/users/:id
- [ ] Add PUT /admin/users/:id
- [ ] Add DELETE /admin/users/:id

# 3. Test
- [ ] List users with pagination
- [ ] Filter by role
- [ ] Search users
- [ ] Update user role
- [ ] Delete user
```

### Admin Content Management

```bash
# 1. Update backend/controllers/adminController.js
- [ ] Implement getAllTracks
- [ ] Implement deleteAnyTrack
- [ ] Implement getAllPlaylists
- [ ] Implement deleteAnyPlaylist

# 2. Update backend/routes/adminRoutes.js
- [ ] Add GET /admin/tracks
- [ ] Add DELETE /admin/tracks/:id
- [ ] Add GET /admin/playlists
- [ ] Add DELETE /admin/playlists/:id

# 3. Test
- [ ] List all tracks
- [ ] Filter unapproved tracks
- [ ] Delete any track
- [ ] Verify file cleanup
```

### Search & Discovery

```bash
# 1. Create backend/controllers/searchController.js
- [ ] Implement searchTracks
- [ ] Implement searchArtists
- [ ] Implement searchPlaylists
- [ ] Implement browseByGenre

# 2. Create backend/routes/searchRoutes.js
- [ ] Add search routes
- [ ] Add browse routes

# 3. Add Genre model (optional)
- [ ] Create Genre model
- [ ] Add genre migration
- [ ] Seed genres

# 4. Test
- [ ] Search by keyword
- [ ] Filter by genre
- [ ] Sort results
- [ ] Browse genres
```

### Play History & Queue

```bash
# 1. Create models
- [ ] Create PlayHistory model
- [ ] Create Queue model
- [ ] Run migrations

# 2. Create backend/controllers/historyController.js
- [ ] Implement getRecentlyPlayed
- [ ] Implement recordPlay

# 3. Create backend/controllers/queueController.js
- [ ] Implement getQueue
- [ ] Implement addToQueue
- [ ] Implement removeFromQueue
- [ ] Implement clearQueue

# 4. Create routes
- [ ] Add history routes
- [ ] Add queue routes

# 5. Test
- [ ] Record play
- [ ] Get history
- [ ] Manage queue
```

---

## Summary

**Total Endpoints to Implement:** ~87 API endpoints
**Estimated Time:** 8-10 weeks for full implementation
**Priority Order:**
1. ~~MinIO setup~~ ✅ **DONE**
2. Admin features (Critical - Next Priority)
3. Search & discovery (Important)
4. History & queue (Important)
5. Recommendations (Nice to have)
6. Albums (Nice to have)
7. Advanced analytics (Nice to have)
8. Real-time features (Future)

**Next Steps:**
1. ~~Set up MinIO in Docker~~ ✅ **DONE**
2. Implement missing admin endpoints (user management, content management)
3. Test with Postman/curl
4. Update frontend to use new endpoints
5. Deploy and test end-to-end

---

**Ready to start? Let's implement these step by step!**
