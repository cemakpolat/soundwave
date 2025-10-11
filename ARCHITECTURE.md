# Soundwave - System Architecture Documentation

**Version:** 1.0
**Last Updated:** October 2025
**Status:** Local Development / MVP

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [System Components](#system-components)
3. [Data Architecture](#data-architecture)
4. [API Architecture](#api-architecture)
5. [Security Architecture](#security-architecture)
6. [File Storage Architecture](#file-storage-architecture)
7. [Deployment Architecture](#deployment-architecture)
8. [Technology Stack](#technology-stack)
9. [Architecture Diagrams](#architecture-diagrams)
10. [Design Patterns](#design-patterns)
11. [Architecture Decision Records](#architecture-decision-records)

---

## Architecture Overview

Soundwave follows a **three-tier architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│                    (React Frontend)                      │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
                     │ JSON
┌────────────────────▼────────────────────────────────────┐
│                   Application Layer                      │
│                   (Express.js Backend)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │Controllers│  │Middleware│  │ Services │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└────────────────────┬────────────────────────────────────┘
                     │ SQL/ORM
                     │ Sequelize
┌────────────────────▼────────────────────────────────────┐
│                      Data Layer                          │
│  ┌──────────────┐           ┌──────────────┐           │
│  │  PostgreSQL  │           │ File Storage │           │
│  │   Database   │           │ (Local/S3)   │           │
│  └──────────────┘           └──────────────┘           │
└─────────────────────────────────────────────────────────┘
```

### Architecture Principles

1. **Separation of Concerns** - Clear boundaries between layers
2. **Modularity** - Independent, reusable components
3. **Scalability** - Horizontal scaling capability
4. **Security by Design** - Security at every layer
5. **Flexibility** - Pluggable storage backends (local/S3)
6. **Maintainability** - Clean code, consistent patterns

---

## System Components

### 1. Frontend Application (React SPA)

**Technology:** React 19, React Router 7, Tailwind CSS

**Directory Structure:**
```
frontend/src/
├── pages/              # Page-level components
│   ├── Home.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── UploadTrack.jsx
│   ├── Discover.jsx
│   ├── YourLibrary.jsx
│   ├── SearchResultPage.jsx
│   ├── TrackDetailPage.jsx
│   ├── PlaylistDetailPage.jsx
│   ├── UserProfilPage.jsx
│   ├── NotificationPage.jsx
│   ├── admin/          # Admin pages
│   └── creator/        # Creator pages
├── components/         # Reusable components
│   ├── auth/           # Authentication components
│   ├── common/         # Shared components (buttons, cards)
│   ├── layout/         # Layout components (header, sidebar)
│   ├── playlists/      # Playlist components
│   ├── social/         # Social features (likes, follows)
│   └── tracks/         # Track components
├── context/            # React Context (state management)
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── utils/              # Utility functions
└── App.js              # Root component
```

**Key Features:**
- Single Page Application (SPA) with client-side routing
- Component-based architecture
- Context API for state management
- Custom hooks for reusable logic
- Responsive design with Tailwind CSS
- Audio playback with Howler.js
- Smooth animations with Framer Motion

**State Management:**
```javascript
// Context structure
UserContext          // User authentication state
PlayerContext        // Audio player state
NotificationContext  // Notification state
```

**Routing Structure:**
```javascript
/ (public)              → Home/Landing page
/login (public)         → Login page
/register (public)      → Register page
/discover               → Discover tracks
/library                → User's library
/upload                 → Upload track (creator only)
/track/:id              → Track details
/playlist/:id           → Playlist details
/user/:id               → User profile
/search                 → Search results
/notifications          → User notifications
/admin                  → Admin dashboard (admin only)
```

---

### 2. Backend Application (Express.js API)

**Technology:** Node.js 16+, Express.js 4.18

**Directory Structure:**
```
backend/
├── config/             # Configuration files
│   ├── database.js     # PostgreSQL & Sequelize config
│   ├── storage.js      # File storage config (local/S3)
│   └── s3.js           # AWS S3 configuration
├── controllers/        # Request handlers
│   ├── authController.js
│   ├── trackController.js
│   ├── playlistController.js
│   ├── userController.js
│   ├── socialController.js (likes, follows, comments)
│   ├── adminController.js
│   ├── analyticsController.js
│   └── notificationController.js
├── middlewares/        # Express middlewares
│   ├── auth.js         # JWT authentication
│   ├── authorization.js # Role-based authorization
│   ├── upload.js       # File upload (deprecated, use storage.js)
│   └── errorHandler.js # Global error handling
├── models/             # Sequelize models (ORM)
│   ├── index.js        # Model initialization
│   ├── associations.js # Model relationships
│   ├── User.js
│   ├── Track.js
│   ├── Playlist.js
│   ├── PlaylistTrack.js
│   ├── Comment.js
│   ├── Like.js
│   ├── Follow.js
│   └── Notification.js
├── routes/             # API route definitions
│   ├── authRoutes.js
│   ├── trackRoutes.js
│   ├── playlistRoutes.js
│   ├── userRoutes.js
│   ├── socialRoutes.js
│   ├── adminRoutes.js
│   ├── analyticsRoutes.js
│   └── notificationRoutes.js
├── migrations/         # Database migrations
├── tests/              # Test files
├── utils/              # Utility functions
├── uploads/            # Local file storage
│   ├── tracks/         # Audio files
│   └── covers/         # Cover images
├── server.js           # Application entry point
└── seed.js             # Database seeding script
```

**Request Flow:**
```
HTTP Request
    ↓
Express App (server.js)
    ↓
Middleware Stack
    ├── CORS
    ├── JSON Parser
    ├── Static File Server (/uploads)
    ├── Error Handler
    ↓
Route Handler
    ↓
Authentication Middleware (if protected)
    ├── Verify JWT token
    ├── Extract user info
    ↓
Authorization Middleware (if role-based)
    ├── Check user role
    ├── Allow/Deny access
    ↓
Controller
    ├── Validate input
    ├── Business logic
    ├── Database operations
    ├── File operations
    ↓
Response
    ├── Success: JSON data
    ├── Error: Error message
```

**Controller Pattern:**
```javascript
// Example: trackController.js
const getTracks = async (req, res) => {
  try {
    // 1. Extract parameters
    const { page, limit, search } = req.query;

    // 2. Build query
    const where = search ? { title: { [Op.iLike]: `%${search}%` } } : {};

    // 3. Database query
    const tracks = await Track.findAll({
      where,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      include: [User, Like, Comment]
    });

    // 4. Return response
    res.status(200).json({ tracks });
  } catch (error) {
    // 5. Error handling
    console.error('Error fetching tracks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
```

---

### 3. Database Layer (PostgreSQL)

**Technology:** PostgreSQL 14, Sequelize ORM 6.37

**Connection Management:**
```javascript
// Connection Pool Configuration
{
  max: 10,              // Maximum connections
  min: 0,               // Minimum connections
  acquire: 30000,       // Max time to acquire connection (ms)
  idle: 10000          // Max idle time (ms)
}
```

**Database Schema:**

#### Entity Relationship Diagram (ERD)

```
┌─────────────────┐       ┌─────────────────┐
│     Users       │       │     Tracks      │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ username        │       │ userId (FK)     │
│ email           │◄─────┐│ title           │
│ password_hash   │      ││ description     │
│ role            │      ││ duration        │
│ isBanned        │      ││ s3_key          │
│ createdAt       │      ││ cover_image_key │
│ updatedAt       │      ││ play_count      │
└─────────────────┘      ││ createdAt       │
         │               ││ updatedAt       │
         │               │└─────────────────┘
         │               │         │
         │               │         │
         │       ┌───────┘         │
         │       │                 │
┌────────▼───────▼────┐   ┌────────▼────────┐
│   Playlists         │   │     Likes       │
├─────────────────────┤   ├─────────────────┤
│ id (PK)             │   │ id (PK)         │
│ userId (FK)         │   │ userId (FK)     │
│ name                │   │ trackId (FK)    │
│ description         │   │ createdAt       │
│ isPublic            │   └─────────────────┘
│ createdAt           │
│ updatedAt           │   ┌─────────────────┐
└─────────────────────┘   │    Comments     │
         │                ├─────────────────┤
         │                │ id (PK)         │
         │                │ userId (FK)     │
         │                │ trackId (FK)    │
┌────────▼──────────┐     │ content         │
│  PlaylistTrack    │     │ createdAt       │
│  (Junction)       │     └─────────────────┘
├───────────────────┤
│ id (PK)           │     ┌─────────────────┐
│ playlistId (FK)   │     │     Follows     │
│ trackId (FK)      │     ├─────────────────┤
│ position          │     │ id (PK)         │
│ createdAt         │     │ followerId (FK) │
└───────────────────┘     │ followeeId (FK) │
                          │ createdAt       │
                          └─────────────────┘

                          ┌──────────────────┐
                          │  Notifications   │
                          ├──────────────────┤
                          │ id (PK)          │
                          │ userId (FK)      │
                          │ type             │
                          │ message          │
                          │ isRead           │
                          │ createdAt        │
                          └──────────────────┘
```

#### Model Definitions

**Users Table:**
```sql
CREATE TABLE "Users" (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('creator', 'listener', 'admin')),
  "isBanned" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);
```

**Tracks Table:**
```sql
CREATE TABLE "Tracks" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER REFERENCES "Users"(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  s3_key TEXT NOT NULL,  -- File path (local or S3 key)
  cover_image_key TEXT,
  play_count INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tracks_user_id ON "Tracks"("userId");
CREATE INDEX idx_tracks_created_at ON "Tracks"("createdAt" DESC);
```

**Playlists Table:**
```sql
CREATE TABLE "Playlists" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER REFERENCES "Users"(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  "isPublic" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_playlists_user_id ON "Playlists"("userId");
```

**PlaylistTrack Junction Table:**
```sql
CREATE TABLE "PlaylistTracks" (
  id SERIAL PRIMARY KEY,
  "playlistId" INTEGER REFERENCES "Playlists"(id) ON DELETE CASCADE,
  "trackId" INTEGER REFERENCES "Tracks"(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  UNIQUE("playlistId", "trackId")
);
```

**Likes Table:**
```sql
CREATE TABLE "Likes" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER REFERENCES "Users"(id) ON DELETE CASCADE,
  "trackId" INTEGER REFERENCES "Tracks"(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  UNIQUE("userId", "trackId")
);

CREATE INDEX idx_likes_track_user ON "Likes"("trackId", "userId");
```

**Comments Table:**
```sql
CREATE TABLE "Comments" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER REFERENCES "Users"(id) ON DELETE CASCADE,
  "trackId" INTEGER REFERENCES "Tracks"(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW()
);
```

**Follows Table:**
```sql
CREATE TABLE "Follows" (
  id SERIAL PRIMARY KEY,
  "followerId" INTEGER REFERENCES "Users"(id) ON DELETE CASCADE,
  "followeeId" INTEGER REFERENCES "Users"(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  UNIQUE("followerId", "followeeId"),
  CHECK ("followerId" != "followeeId")
);

CREATE INDEX idx_follows_follower_followee ON "Follows"("followerId", "followeeId");
```

**Notifications Table:**
```sql
CREATE TABLE "Notifications" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER REFERENCES "Users"(id) ON DELETE CASCADE,
  type VARCHAR(50),
  message TEXT NOT NULL,
  "isRead" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT NOW()
);
```

**Model Associations:**
```javascript
// User Associations
User.hasMany(Track, { foreignKey: 'userId', as: 'tracks' });
User.hasMany(Playlist, { foreignKey: 'userId', as: 'playlists' });
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
User.hasMany(Like, { foreignKey: 'userId', as: 'likes' });
User.hasMany(Follow, { foreignKey: 'followerId', as: 'following' });
User.hasMany(Follow, { foreignKey: 'followeeId', as: 'followers' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });

// Track Associations
Track.belongsTo(User, { foreignKey: 'userId' });
Track.hasMany(Comment, { foreignKey: 'trackId', as: 'comments' });
Track.hasMany(Like, { foreignKey: 'trackId', as: 'likes' });
Track.belongsToMany(Playlist, {
  through: PlaylistTrack,
  foreignKey: 'trackId',
  as: 'playlists'
});

// Playlist Associations
Playlist.belongsTo(User, { foreignKey: 'userId' });
Playlist.belongsToMany(Track, {
  through: PlaylistTrack,
  foreignKey: 'playlistId',
  as: 'tracks'
});

// Comment, Like, Follow, Notification Associations
// (see backend/models/associations.js for complete definitions)
```

---

## Data Architecture

### Data Flow

#### Track Upload Flow
```
User (Creator)
    ↓
Frontend (React)
    ├── Select audio file
    ├── Select cover image
    ├── Fill metadata (title, description, duration)
    ↓
HTTP POST /api/tracks/upload
    ├── Headers: Authorization: Bearer <JWT>
    ├── Body: multipart/form-data
    │   ├── audio: <File>
    │   ├── coverImage: <File>
    │   ├── title: String
    │   ├── description: String
    │   ├── duration: Integer
    ↓
Backend Middleware
    ├── auth.js → Verify JWT, extract userId
    ├── authorization.js → Check role = 'creator' or 'admin'
    ├── multer (storage.js) → Save files
    │   ├── Local: backend/uploads/tracks/
    │   └── S3: upload to AWS bucket
    ↓
trackController.uploadTrack()
    ├── Validate input
    ├── Get file paths
    ├── Save to database
    │   ├── INSERT INTO Tracks (userId, title, s3_key, ...)
    ├── Fetch track with user info
    ↓
Response
    ├── Status: 201 Created
    ├── Body: { track: {...}, message: "Track uploaded successfully" }
```

#### Track Playback Flow
```
User (Listener)
    ↓
Frontend (React)
    ├── Click play button
    ↓
HTTP GET /api/tracks/:id/url
    ├── Headers: Authorization: Bearer <JWT>
    ↓
Backend
    ├── Verify authentication
    ├── Find track in database
    ├── Generate URL
    │   ├── Local: /uploads/tracks/filename.mp3
    │   └── S3: Pre-signed URL (expires in 1 hour)
    ├── Increment play_count
    ↓
Response
    ├── Status: 200 OK
    ├── Body: { trackUrl: "http://localhost:5001/uploads/tracks/..." }
    ↓
Frontend
    ├── Howler.js plays audio from URL
    ├── Audio streamed via HTTP
    ├── Browser handles buffering
```

#### Authentication Flow
```
User
    ↓
POST /api/auth/login
    ├── Body: { email, password }
    ↓
authController.login()
    ├── Find user by email
    ├── Compare password with bcrypt
    ├── Generate JWT token
    │   ├── Payload: { id, role }
    │   ├── Secret: process.env.JWT_SECRET
    │   ├── Expires: 7 days
    ↓
Response
    ├── Status: 200 OK
    ├── Body: { token, user: { id, username, email, role } }
    ↓
Frontend
    ├── Store token in localStorage
    ├── Include in all subsequent requests
    │   └── Headers: Authorization: Bearer <token>
```

### Data Consistency

**Transaction Management:**
```javascript
// Example: Creating playlist with tracks
const createPlaylistWithTracks = async (playlistData, trackIds) => {
  const transaction = await sequelize.transaction();

  try {
    // 1. Create playlist
    const playlist = await Playlist.create(playlistData, { transaction });

    // 2. Add tracks to playlist
    for (const trackId of trackIds) {
      await PlaylistTrack.create({
        playlistId: playlist.id,
        trackId: trackId
      }, { transaction });
    }

    // 3. Commit transaction
    await transaction.commit();
    return playlist;

  } catch (error) {
    // 4. Rollback on error
    await transaction.rollback();
    throw error;
  }
};
```

**Cascading Deletes:**
- User deleted → All tracks, playlists, likes, follows deleted
- Track deleted → All likes, comments, playlist associations deleted
- Playlist deleted → All playlist-track associations deleted

---

## API Architecture

### RESTful API Design

**Base URL:** `http://localhost:5001/api`

**API Versioning:** Currently v1 (implicit), future: `/api/v2/...`

### Authentication

**Mechanism:** JWT (JSON Web Tokens)

**Token Structure:**
```javascript
{
  header: {
    alg: "HS256",
    typ: "JWT"
  },
  payload: {
    id: 123,           // User ID
    role: "creator",   // User role
    iat: 1696800000,   // Issued at
    exp: 1697404800    // Expires at (7 days)
  },
  signature: "..."
}
```

**Token Flow:**
```
Login → Generate Token → Store in localStorage
                              ↓
Every Request → Include in Headers
                              ↓
Backend → Verify & Decode → Extract User Info → Process Request
```

### API Endpoints

#### Authentication Endpoints

**POST /api/auth/register**
```javascript
Request:
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "creator"  // 'creator', 'listener', or 'admin'
}

Response: 201 Created
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "creator"
  }
}
```

**POST /api/auth/login**
```javascript
Request:
{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "creator"
  }
}
```

#### Track Endpoints

**GET /api/tracks**
```javascript
Request:
GET /api/tracks?page=1&limit=20&search=jazz
Headers: { Authorization: "Bearer <token>" }

Response: 200 OK
{
  "tracks": [
    {
      "id": 1,
      "title": "Smooth Jazz Night",
      "description": "Relaxing jazz track",
      "duration": 240,
      "s3_key": "/uploads/tracks/audio-1234567890.mp3",
      "cover_image_key": "/uploads/covers/cover-1234567890.jpg",
      "play_count": 150,
      "createdAt": "2025-10-01T12:00:00Z",
      "User": {
        "id": 5,
        "username": "jazzmaster"
      },
      "likes": [...],
      "comments": [...]
    },
    ...
  ]
}
```

**POST /api/tracks/upload**
```javascript
Request:
POST /api/tracks/upload
Headers: {
  Authorization: "Bearer <token>",
  Content-Type: "multipart/form-data"
}
Body: FormData
  audio: <File>
  coverImage: <File>
  title: "My New Track"
  description: "Description here"
  duration: 180

Response: 201 Created
{
  "track": {
    "id": 42,
    "userId": 1,
    "title": "My New Track",
    "description": "Description here",
    "duration": 180,
    "s3_key": "/uploads/tracks/audio-1696800000-123456.mp3",
    "cover_image_key": "/uploads/covers/cover-1696800000-123456.jpg",
    "play_count": 0,
    "User": {
      "id": 1,
      "username": "johndoe"
    }
  },
  "message": "Track uploaded successfully"
}
```

**GET /api/tracks/:id/url**
```javascript
Request:
GET /api/tracks/42/url
Headers: { Authorization: "Bearer <token>" }

Response: 200 OK
{
  "trackUrl": "http://localhost:5001/uploads/tracks/audio-1696800000-123456.mp3"
}

// Note: play_count is automatically incremented
```

**DELETE /api/tracks/:id**
```javascript
Request:
DELETE /api/tracks/42
Headers: { Authorization: "Bearer <token>" }

Response: 200 OK
{
  "message": "Track deleted successfully"
}

// Note: Files are also deleted from storage
```

#### Playlist Endpoints

**GET /api/playlists**
**POST /api/playlists**
**GET /api/playlists/:id**
**PUT /api/playlists/:id**
**DELETE /api/playlists/:id**
**POST /api/playlists/:id/tracks**

#### User Endpoints

**GET /api/users/:id**
**PUT /api/users/:id**
**GET /api/users/:id/tracks**
**GET /api/users/:id/playlists**

#### Admin Endpoints

**GET /api/admin/users** - Get all users
**PUT /api/admin/users/:id/ban** - Ban/unban user
**GET /api/admin/analytics** - Get platform statistics

### Error Responses

**Standard Error Format:**
```javascript
{
  "message": "Error description",
  "error": "Detailed error message (dev only)"
}
```

**HTTP Status Codes:**
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (wrong role)
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Security Architecture

### Authentication & Authorization

**Authentication Mechanism:**
1. User provides credentials (email + password)
2. Backend verifies with bcrypt
3. Backend generates JWT token
4. Frontend stores token in localStorage
5. Frontend includes token in all requests
6. Backend verifies token on each request

**Authorization Levels:**

| Role | Permissions |
|------|-------------|
| **Listener** | View tracks, play music, like, comment, create playlists, follow users |
| **Creator** | All Listener permissions + Upload tracks, manage own tracks |
| **Admin** | All permissions + User management, content moderation, analytics |

**Authorization Middleware:**
```javascript
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: 'Access forbidden: Insufficient permissions'
      });
    }

    next();
  };
};

// Usage
router.post('/upload',
  auth,
  authorize(['creator', 'admin']),
  uploadTrack
);
```

### Password Security

**Hashing:** bcrypt with salt rounds = 10

```javascript
const bcrypt = require('bcrypt');

// Registration
const hashedPassword = await bcrypt.hash(plainPassword, 10);

// Login
const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
```

### Input Validation

**Validation Middleware:**
```javascript
const { body, validationResult } = require('express-validator');

const validateTrackUpload = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title too long'),
  body('duration')
    .isInt({ min: 1 }).withMessage('Duration must be positive'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
```

### CORS Configuration

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### File Upload Security

**File Type Validation:**
```javascript
const fileFilter = (req, file, cb) => {
  // Audio files
  const allowedAudioTypes = [
    'audio/mpeg', 'audio/mp3', 'audio/wav',
    'audio/ogg', 'audio/flac'
  ];

  // Image files
  const allowedImageTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp'
  ];

  if (file.fieldname === 'audio' && allowedAudioTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if (file.fieldname === 'coverImage' && allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};
```

**File Size Limits:**
```javascript
limits: {
  fileSize: 100 * 1024 * 1024, // 100MB max
  files: 5                      // Max 5 files per request
}
```

### SQL Injection Prevention

- **Sequelize ORM** automatically uses parameterized queries
- Never concatenate user input into SQL queries

---

## File Storage Architecture

### Pluggable Storage System

**Design:** Abstract storage interface supporting multiple backends

**Configuration:**
```javascript
// .env
STORAGE_TYPE=local  // or 's3'

// Local storage
UPLOAD_DIR=./uploads

// S3 storage
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_BUCKET_NAME=soundwave-tracks
```

### Local File Storage

**Directory Structure:**
```
backend/uploads/
├── tracks/          # Audio files
│   ├── audio-track-1696800000-123456.mp3
│   ├── audio-track-1696800001-234567.mp3
│   └── ...
└── covers/          # Cover images
    ├── cover-image-1696800000-123456.jpg
    ├── cover-image-1696800001-234567.jpg
    └── ...
```

**File Naming Convention:**
```
{fieldname}-{originalname}-{timestamp}-{random}.{ext}

Example: audio-my-track-1696800000-123456.mp3
```

**Serving Files:**
```javascript
// server.js
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Access: http://localhost:5001/uploads/tracks/audio-123456.mp3
```

### S3 Storage (Production)

**Bucket Structure:**
```
soundwave-tracks-prod/
├── tracks/
│   ├── 1696800000-123456.mp3
│   └── ...
└── covers/
    ├── 1696800000-123456.jpg
    └── ...
```

**S3 Operations:**
```javascript
// Upload
const uploadToS3 = async (file, key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: fs.readFileSync(file.path),
    ContentType: file.mimetype
  };
  return await s3.upload(params).promise();
};

// Generate pre-signed URL (for playback)
const getSignedUrl = async (key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Expires: 3600  // 1 hour
  };
  return await s3.getSignedUrlPromise('getObject', params);
};

// Delete
const deleteFromS3 = async (key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key
  };
  return await s3.deleteObject(params).promise();
};
```

### Storage Interface

**Unified API:**
```javascript
// config/storage.js
module.exports = {
  upload,           // Multer middleware
  getFileUrl,       // Get public URL for file
  deleteFile,       // Delete file from storage
  storageType       // 'local' or 's3'
};

// Usage in controller
const { getFileUrl, deleteFile } = require('../config/storage');

const trackUrl = getFileUrl(track.s3_key, 'track');
await deleteFile(track.s3_key);
```

---

## Deployment Architecture

### Current: Local Development

```
┌─────────────────────────────────────────────┐
│            Developer Machine                 │
│                                             │
│  ┌──────────────┐      ┌─────────────────┐│
│  │   Frontend   │      │    Backend      ││
│  │ React :3000  │◄────►│ Express :5001   ││
│  └──────────────┘      └────────┬────────┘│
│                                  │         │
│  ┌──────────────┐      ┌────────▼────────┐│
│  │   Docker     │      │   File System   ││
│  │ PostgreSQL   │      │   /uploads/     ││
│  │   :5432      │      └─────────────────┘│
│  └──────────────┘                         │
└─────────────────────────────────────────────┘
```

**Components:**
- Frontend: `npm start` (port 3000)
- Backend: `npm run dev` (port 5001)
- Database: Docker Compose (port 5432)
- Storage: Local filesystem (`backend/uploads/`)

### Future: Production Architecture

```
                         ┌─────────────┐
                         │     CDN     │
                         │ CloudFront  │
                         └──────┬──────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
              ┌─────▼─────┐          ┌─────▼─────┐
              │   React   │          │    ALB    │
              │  on S3    │          │  (HTTPS)  │
              └───────────┘          └─────┬─────┘
                                           │
                        ┌──────────────────┼──────────────────┐
                        │                  │                  │
                  ┌─────▼─────┐      ┌────▼────┐      ┌─────▼─────┐
                  │   API     │      │   API   │      │   API     │
                  │  Server 1 │      │ Server 2│      │  Server 3 │
                  │   (ECS)   │      │  (ECS)  │      │   (ECS)   │
                  └─────┬─────┘      └────┬────┘      └─────┬─────┘
                        │                 │                  │
                        └─────────────────┼──────────────────┘
                                          │
                        ┌─────────────────┼──────────────────┐
                        │                 │                  │
                  ┌─────▼─────┐     ┌────▼────┐      ┌─────▼─────┐
                  │    RDS    │     │  Redis  │      │    S3     │
                  │ PostgreSQL│     │ Cluster │      │  +CDN     │
                  │ Primary   │     └─────────┘      └───────────┘
                  └─────┬─────┘
                        │
                  ┌─────▼─────┐
                  │    RDS    │
                  │ Read      │
                  │ Replicas  │
                  └───────────┘
```

**Production Stack:**
- **Frontend:** React SPA hosted on S3 + CloudFront
- **Backend:** ECS/EKS containers (auto-scaling)
- **Load Balancer:** Application Load Balancer (ALB)
- **Database:** RDS PostgreSQL (Multi-AZ)
- **Cache:** ElastiCache Redis
- **Storage:** S3 + CloudFront CDN
- **Search:** Elasticsearch (optional)
- **Monitoring:** CloudWatch, Prometheus, Grafana

---

## Technology Stack

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.0.0 | UI framework |
| React Router | 7.2.0 | Client-side routing |
| Tailwind CSS | 3.4.17 | Styling |
| Axios | 1.8.1 | HTTP client |
| Howler.js | 2.2.4 | Audio playback |
| Framer Motion | 12.4.10 | Animations |
| React Icons | 5.5.0 | Icons |

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 16+ | Runtime |
| Express.js | 4.18.2 | Web framework |
| PostgreSQL | 14 | Database |
| Sequelize | 6.37.6 | ORM |
| bcrypt | 5.1.1 | Password hashing |
| jsonwebtoken | 9.0.2 | JWT tokens |
| multer | 1.4.5 | File uploads |
| aws-sdk | 2.1692.0 | AWS S3 integration |
| ioredis | 5.3.1 | Redis client (future) |
| cors | 2.8.5 | CORS middleware |
| helmet | 6.1.5 | Security headers |
| dotenv | 16.0.3 | Environment config |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Local orchestration |
| PostgreSQL | Relational database |
| pgAdmin | Database UI |

### Development Tools

| Tool | Purpose |
|------|---------|
| nodemon | Auto-restart backend |
| eslint | Code linting |
| jest | Testing (backend) |
| react-scripts | React tooling |

---

## Architecture Diagrams

### System Context Diagram (C4 Level 1)

```
                    ┌─────────────────┐
                    │      User       │
                    │  (Creator/      │
                    │ Listener/Admin) │
                    └────────┬────────┘
                             │
                             ▼
              ┌──────────────────────────┐
              │                          │
              │    Soundwave System      │
              │                          │
              │  Music streaming platform│
              │  with social features    │
              │                          │
              └──────────┬───────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
  ┌──────────┐   ┌──────────┐   ┌──────────┐
  │PostgreSQL│   │   AWS S3 │   │  Email   │
  │ Database │   │ (Storage)│   │ Service  │
  └──────────┘   └──────────┘   └──────────┘
```

### Container Diagram (C4 Level 2)

```
┌───────────────────────────────────────────────────┐
│                 User Browser                      │
│                                                   │
│  ┌────────────────────────────────────────────┐  │
│  │         React Single Page App              │  │
│  │  [JavaScript, React Router, Howler.js]     │  │
│  │                                            │  │
│  │  Provides music streaming interface        │  │
│  └──────────────────┬─────────────────────────┘  │
└────────────────────┼────────────────────────────┘
                     │ HTTP/REST
                     │ JSON
┌────────────────────▼────────────────────────────┐
│              API Server                          │
│        [Node.js, Express.js]                     │
│                                                   │
│  Provides REST API for:                          │
│  - Authentication                                │
│  - Track management                              │
│  - User interactions                             │
│  - File uploads                                  │
└────────────┬───────────────┬────────────────────┘
             │               │
             ▼               ▼
    ┌────────────┐   ┌──────────────┐
    │ PostgreSQL │   │File Storage  │
    │  Database  │   │ (Local/S3)   │
    └────────────┘   └──────────────┘
```

### Component Diagram - Backend (C4 Level 3)

```
┌─────────────────────────────────────────────────────┐
│              Express.js API Server                   │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │            API Controllers                  │    │
│  │  ┌──────┐ ┌──────┐ ┌────────┐ ┌────────┐  │    │
│  │  │ Auth │ │Track │ │Playlist│ │ Admin  │  │    │
│  │  └───┬──┘ └───┬──┘ └────┬───┘ └───┬────┘  │    │
│  └──────┼────────┼─────────┼─────────┼───────┘    │
│         │        │         │         │             │
│  ┌──────▼────────▼─────────▼─────────▼───────┐    │
│  │            Sequelize ORM Models            │    │
│  │  ┌──────┐ ┌──────┐ ┌────────┐ ┌────────┐  │    │
│  │  │ User │ │Track │ │Playlist│ │ Comment│  │    │
│  │  └──────┘ └──────┘ └────────┘ └────────┘  │    │
│  └────────────────────┬───────────────────────┘    │
│                       │                             │
│  ┌────────────────────▼───────────────────────┐    │
│  │            Middlewares                      │    │
│  │  ┌──────────┐ ┌──────────┐ ┌────────────┐  │    │
│  │  │   Auth   │ │  Upload  │ │   Error    │  │    │
│  │  │  (JWT)   │ │ (Multer) │ │  Handler   │  │    │
│  │  └──────────┘ └──────────┘ └────────────┘  │    │
│  └──────────────────────────────────────────────   │
└─────────────────────────────────────────────────────┘
```

### Data Flow Diagram - Track Upload

```
┌─────────┐                                      ┌─────────┐
│ Creator │                                      │ Backend │
└────┬────┘                                      └────┬────┘
     │                                                │
     │ 1. Select files (audio + cover)               │
     │ 2. Fill metadata (title, description)         │
     │                                                │
     │ 3. POST /api/tracks/upload                    │
     │    [multipart/form-data]                      │
     ├───────────────────────────────────────────────►
     │                                                │
     │                                           4. Verify JWT
     │                                           5. Check role
     │                                           6. Save files
     │                                                │
     │                                         ┌──────▼──────┐
     │                                         │File Storage │
     │                                         │  (Local/S3) │
     │                                         └──────┬──────┘
     │                                                │
     │                                         ┌──────▼──────┐
     │                                         │  Database   │
     │                                         │ INSERT INTO │
     │                                         │   Tracks    │
     │                                         └──────┬──────┘
     │                                                │
     │ 7. { track: {...}, message: "Success" }       │
     │◄───────────────────────────────────────────────┤
     │                                                │
```

---

## Design Patterns

### 1. Model-View-Controller (MVC)

**Model:** Sequelize models (`backend/models/`)
**View:** React components (`frontend/src/`)
**Controller:** Express controllers (`backend/controllers/`)

### 2. Repository Pattern

Sequelize models act as repositories:
```javascript
// Track.findAll() - find tracks
// Track.create() - create track
// Track.update() - update track
// Track.destroy() - delete track
```

### 3. Middleware Pattern

Express middleware chain:
```javascript
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(...));
app.use(errorHandler);
```

### 4. Strategy Pattern

Storage strategy (Local vs S3):
```javascript
if (storageType === 's3') {
  // Use S3 strategy
} else {
  // Use local storage strategy
}
```

### 5. Dependency Injection

Controllers receive dependencies:
```javascript
const { Track, User } = require('../models');
const { getFileUrl } = require('../config/storage');
```

### 6. Factory Pattern

Sequelize model factory:
```javascript
module.exports = (sequelize, DataTypes) => {
  const Track = sequelize.define('Track', {...});
  return Track;
};
```

---

## Architecture Decision Records

### ADR-001: Use JWT for Authentication

**Status:** Accepted

**Context:** Need stateless authentication for API

**Decision:** Use JWT tokens with 7-day expiration

**Consequences:**
- ✅ Stateless, scalable
- ✅ Works across multiple servers
- ❌ Cannot revoke tokens (until refresh tokens added)

### ADR-002: Use PostgreSQL for Database

**Status:** Accepted

**Context:** Need relational database for complex queries

**Decision:** Use PostgreSQL with Sequelize ORM

**Consequences:**
- ✅ ACID compliance
- ✅ Complex joins and relationships
- ✅ Mature ecosystem
- ❌ Requires careful scaling

### ADR-003: Pluggable Storage System

**Status:** Accepted

**Context:** Need local storage for dev, S3 for production

**Decision:** Abstract storage interface supporting both

**Consequences:**
- ✅ Easy local development
- ✅ Production-ready S3 integration
- ✅ Flexible switching
- ❌ Slightly more complex code

### ADR-004: Role-Based Access Control

**Status:** Accepted

**Context:** Different user types need different permissions

**Decision:** Three roles: Creator, Listener, Admin

**Consequences:**
- ✅ Clear permission boundaries
- ✅ Easy to enforce
- ❌ Not fine-grained (can add RBAC later)

### ADR-005: Monolithic Architecture (MVP)

**Status:** Accepted for MVP, Review in 6 months

**Context:** Starting with MVP, may need microservices later

**Decision:** Single monolithic backend

**Consequences:**
- ✅ Faster development
- ✅ Simpler deployment
- ✅ Easier to debug
- ❌ May need to split for scale

---

## Performance Considerations

### Database Optimization

**Indexes:**
- Users: `username`, `email`
- Tracks: `userId`, `createdAt`, `play_count`
- Likes: `(trackId, userId)`
- Follows: `(followerId, followeeId)`

**Query Optimization:**
- Use `include` for eager loading
- Add pagination to all list endpoints
- Use `attributes` to select specific fields

### Caching Strategy (Future)

**Redis Cache Layers:**
1. Track metadata (1 hour TTL)
2. User feeds (15 min TTL)
3. Popular tracks (1 hour TTL)
4. Session data (7 days TTL)

### File Storage Optimization

**Local:**
- Direct file serving via Express static middleware
- Fast for development

**S3 + CloudFront:**
- CDN caching (24 hours for audio, 7 days for images)
- Reduced latency globally
- Byte-range requests for seeking

---

## Scalability Considerations

### Horizontal Scaling

**Stateless API:**
- No session state on server
- JWT tokens allow any server to authenticate
- Can add load balancer + multiple API instances

**Database Scaling:**
- Read replicas for read-heavy queries
- Connection pooling
- Query optimization

**Storage Scaling:**
- S3 automatically scales
- CloudFront for global distribution

### Vertical Scaling

**Database:**
- Upgrade instance size (CPU, RAM)
- Optimize queries first

**API Servers:**
- Increase container resources
- Monitor CPU/memory usage

---

## Monitoring & Observability

### Metrics to Track

**Application:**
- API response time (p50, p95, p99)
- Error rate (4xx, 5xx)
- Request throughput

**Database:**
- Query execution time
- Connection pool usage
- Slow query log

**Storage:**
- Upload success rate
- File size distribution
- Storage usage

**Business:**
- Active users (DAU, MAU)
- Track uploads per day
- Track plays per day

### Logging Strategy

**Levels:**
- ERROR: Failures, exceptions
- WARN: Issues that don't stop execution
- INFO: Important events (track upload, user login)
- DEBUG: Detailed information (dev only)

**Structured Logging:**
```javascript
logger.info('Track uploaded', {
  userId: 123,
  trackId: 456,
  duration: 240,
  timestamp: new Date()
});
```

---

## Future Architecture Evolution

### Phase 1: Current State (MVP)
- Monolithic architecture
- Single database
- Local/S3 storage
- Manual scaling

### Phase 2: Enhanced Monolith (3-6 months)
- Add Redis caching
- Add read replicas
- Add Elasticsearch
- Add message queue

### Phase 3: Service-Oriented (6-12 months)
- Split into services
- API Gateway
- Service mesh
- Event-driven architecture

### Phase 4: Microservices (12+ months)
- Full microservices
- Kubernetes orchestration
- Multi-region deployment
- Real-time features

---

## Conclusion

Soundwave's architecture is designed for:
- **Simplicity:** Easy to understand and develop
- **Flexibility:** Pluggable components (storage, cache)
- **Scalability:** Ready to scale horizontally
- **Security:** Built-in authentication and authorization
- **Maintainability:** Clean separation of concerns

The current architecture supports rapid MVP development while providing a clear path to production-scale deployment.

---

**Document Version:** 1.0
**Last Updated:** October 2025
**Maintained By:** Development Team

For implementation details, see:
- [LOCAL_SETUP.md](./LOCAL_SETUP.md) - Setup guide
- [PROJECT_EVALUATION.md](./PROJECT_EVALUATION.md) - Full evaluation
- [QUICK_START.md](./QUICK_START.md) - Quick start guide
