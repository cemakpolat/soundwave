# Soundwave (Spotify Clone) - Project Evaluation & Architecture Plan

## Executive Summary

Soundwave is a full-stack Spotify clone with a Node.js/Express backend, React frontend, PostgreSQL database, and AWS S3 integration. This document provides a comprehensive evaluation and implementation plan for both local minimal setup and scalable production architecture.

---

## Table of Contents

1. [Current Architecture Overview](#current-architecture-overview)
2. [Local Minimal Setup](#local-minimal-setup)
3. [Scalable Architecture Design](#scalable-architecture-design)
4. [Migration Roadmap](#migration-roadmap)
5. [Implementation Priorities](#implementation-priorities)

---

## Current Architecture Overview

### Tech Stack

#### Backend
- **Runtime**: Node.js (>=16.0.0)
- **Framework**: Express.js 4.18.2
- **Database**: PostgreSQL with Sequelize ORM 6.37.6
- **Authentication**: JWT (jsonwebtoken 9.0.2) + bcrypt 5.1.1
- **File Storage**: AWS S3 (aws-sdk 2.1692.0)
- **Caching**: Redis via ioredis 5.3.1 (configured but disabled)
- **File Upload**: Multer 1.4.5-lts.1
- **Security**: Helmet 6.1.5, CORS 2.8.5
- **Validation**: express-validator 6.15.0

#### Frontend
- **Framework**: React 19.0.0
- **Routing**: React Router DOM 7.2.0
- **Styling**: Tailwind CSS 3.4.17
- **Audio**: Howler.js 2.2.4
- **Animations**: Framer Motion 12.4.10
- **HTTP Client**: Axios 1.8.1
- **Icons**: React Icons 5.5.0, Heroicons 1.0.6

#### Infrastructure (Current)
- **Database**: PostgreSQL 14 (Docker)
- **Admin UI**: pgAdmin 4 (Docker)
- **Container Orchestration**: Docker Compose

### Application Features

#### Authentication & User Management
- User registration with role-based access (creator, listener, admin)
- JWT-based authentication
- User profiles
- Password hashing with bcrypt

#### Music Features
- Track upload (audio + cover image)
- Track playback
- Track metadata (title, description, duration)
- Play count tracking
- Search functionality

#### Social Features
- User following system
- Track likes
- Track comments
- Notifications
- User feeds

#### Playlist Management
- Create playlists
- Add/remove tracks
- Public/private playlists
- Playlist sharing

#### Admin Features
- User management
- Content moderation
- User ban/unban
- Analytics dashboard

### Database Schema

#### Core Models
1. **User** - Authentication, profiles, role management
2. **Track** - Audio metadata, S3 references, play counts
3. **Playlist** - User playlists
4. **PlaylistTrack** - Many-to-many relationship
5. **Comment** - Track comments
6. **Like** - Track likes
7. **Follow** - User following relationships
8. **Notification** - User notifications

#### Relationships
- User → Tracks (one-to-many)
- User → Playlists (one-to-many)
- User → Comments (one-to-many)
- User → Likes (one-to-many)
- User → Followers/Following (many-to-many via Follow)
- Track ↔ Playlists (many-to-many via PlaylistTrack)
- Track → Comments (one-to-many)
- Track → Likes (one-to-many)

### Current File Structure

```
soundwave/
├── backend/
│   ├── config/
│   │   ├── database.js       # PostgreSQL + Sequelize config
│   │   └── s3.js             # AWS S3 configuration
│   ├── controllers/          # Business logic (11 controllers)
│   ├── middlewares/          # Auth, validation, error handling
│   ├── migrations/           # Database migrations
│   ├── models/               # Sequelize models (10 models)
│   ├── routes/               # API routes (9 route files)
│   ├── tests/                # Test files
│   ├── utils/                # Helper utilities
│   ├── seed.js               # Database seeding
│   ├── server.js             # Express app entry point
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/       # React components (organized)
│   │   ├── context/          # React context
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/            # Page components (15+ pages)
│   │   ├── services/         # API service layer
│   │   ├── utils/            # Frontend utilities
│   │   ├── App.js            # Main app component
│   │   └── index.js
│   └── package.json
├── docker-compose.yml        # Container orchestration
└── .gitignore
```

### Current Issues & Blockers

1. **AWS S3 Dependency**: Requires AWS credentials for local development
2. **No .env File**: No environment configuration template
3. **Dual Database Connections**: Both pool and sequelize initialized (backend/config/database.js)
4. **Commented Services**: Backend, frontend, and Redis disabled in docker-compose.yml
5. **No Migration Setup**: Database tables not auto-created
6. **Missing Documentation**: No local setup guide

---

## Local Minimal Setup

### Goal
Enable local development with minimal external dependencies:
- Creator can upload music files
- Listener can play music
- Admin can manage users and content
- No AWS account required
- Simple one-command startup

### Architecture Changes

#### 1. Local File Storage (Replace S3)

**Changes Required:**
- Remove AWS S3 dependency
- Use multer disk storage
- Serve files via Express static middleware
- Store files in `backend/uploads/` directory

**Directory Structure:**
```
backend/uploads/
├── tracks/          # Audio files
└── covers/          # Cover images
```

#### 2. Environment Configuration

Create `.env` file with local settings:

```env
# Node Environment
NODE_ENV=development

# Server Configuration
PORT=5001

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=soundwave_db
DB_USER=soundwave_user
DB_PASSWORD=soundwave_password

# JWT Configuration
JWT_SECRET=local-dev-secret-change-in-production-min-32-chars
JWT_EXPIRATION=7d

# File Storage (Local)
STORAGE_TYPE=local
UPLOAD_DIR=./uploads

# pgAdmin Configuration
PGADMIN_DEFAULT_EMAIL=admin@soundwave.com
PGADMIN_DEFAULT_PASSWORD=admin123

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Optional: Redis (can be enabled later)
# REDIS_HOST=localhost
# REDIS_PORT=6379
```

#### 3. Database Setup

**Migration Strategy:**
```bash
# Create database
npm run migrate

# Seed test data (optional)
npm run seed_test_data
```

**Test Data Includes:**
- 3 users (creator, listener, admin)
- Sample tracks
- Sample playlists

#### 4. Simplified Docker Compose

Keep only PostgreSQL running:
```yaml
services:
  postgres:
    image: postgres:14
    container_name: soundwave_postgres
    environment:
      POSTGRES_USER: soundwave_user
      POSTGRES_PASSWORD: soundwave_password
      POSTGRES_DB: soundwave_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - soundwave_network

  pgadmin:
    image: dpage/pgadmin4
    container_name: soundwave_pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@soundwave.com
      PGADMIN_DEFAULT_PASSWORD: admin123
    ports:
      - "5050:80"
    depends_on:
      - postgres
    networks:
      - soundwave_network

volumes:
  postgres_data:

networks:
  soundwave_network:
```

### Implementation Steps

#### Phase 1: Configuration Setup

**1. Create .env.example**
```bash
cp .env.example .env
# Edit .env with your local values
```

**2. Create uploads directory**
```bash
mkdir -p backend/uploads/tracks
mkdir -p backend/uploads/covers
```

**3. Update .gitignore**
```
backend/uploads/*
!backend/uploads/.gitkeep
.env
```

#### Phase 2: Backend Modifications

**1. Update config/storage.js (new file)**
```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDir = process.env.UPLOAD_DIR || './uploads';
const tracksDir = path.join(uploadDir, 'tracks');
const coversDir = path.join(uploadDir, 'covers');

[tracksDir, coversDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'track') {
      cb(null, tracksDir);
    } else if (file.fieldname === 'cover') {
      cb(null, coversDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'track') {
    // Accept audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed for tracks'), false);
    }
  } else if (file.fieldname === 'cover') {
    // Accept image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for covers'), false);
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

module.exports = upload;
```

**2. Update server.js**
```javascript
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Serve uploaded files statically
const uploadDir = process.env.UPLOAD_DIR || './uploads';
app.use('/uploads', express.static(path.join(__dirname, uploadDir)));

// Routes...
```

**3. Update trackController.js**

Replace S3 upload logic with local file storage:
```javascript
// Before: uploadTrack used S3
// After: Files are saved by multer, just store the path

const createTrack = async (req, res) => {
  try {
    const { title, description, duration } = req.body;
    const userId = req.user.id;

    // Files uploaded by multer
    const trackFile = req.files.track[0];
    const coverFile = req.files.cover ? req.files.cover[0] : null;

    // Store relative paths (not S3 keys)
    const trackPath = `/uploads/tracks/${trackFile.filename}`;
    const coverPath = coverFile ? `/uploads/covers/${coverFile.filename}` : null;

    const track = await Track.create({
      userId,
      title,
      description,
      duration,
      s3_key: trackPath,  // Reuse field for local path
      cover_image_key: coverPath,
      play_count: 0
    });

    res.status(201).json(track);
  } catch (error) {
    console.error('Error creating track:', error);
    res.status(500).json({ message: 'Failed to create track' });
  }
};
```

**4. Update routes/trackRoutes.js**
```javascript
const upload = require('../config/storage');

// Upload track route
router.post(
  '/upload',
  authMiddleware,
  creatorMiddleware,
  upload.fields([
    { name: 'track', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  trackController.createTrack
);
```

**5. Clean up database.js**

Remove dual connection (keep only Sequelize):
```javascript
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = { sequelize };
```

#### Phase 3: Frontend Modifications

**1. Update API service for local URLs**

File: `frontend/src/services/api.js`
```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

// Interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
```

**2. Update track playback URLs**

Ensure audio player uses local server URLs:
```javascript
// Before: https://bucket.s3.amazonaws.com/key
// After: http://localhost:5001/uploads/tracks/filename

const getTrackUrl = (track) => {
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
  return `${baseUrl}${track.s3_key}`;
};
```

**3. Create .env for frontend**
```env
REACT_APP_API_URL=http://localhost:5001
```

#### Phase 4: Database Setup

**1. Run migrations**
```bash
cd backend
npx sequelize-cli db:migrate
```

**2. Seed test users**
```bash
npm run seed_test_data
```

**Test Users:**
- Creator: `creator@test.com` / `password123`
- Listener: `listener@test.com` / `password123`
- Admin: `admin@test.com` / `password123`

### Local Development Workflow

#### Starting the Application

**1. Start database**
```bash
docker-compose up -d
```

**2. Start backend**
```bash
cd backend
npm install
npm run migrate
npm run seed_test_data  # Optional
npm run dev
```

**3. Start frontend**
```bash
cd frontend
npm install
npm start
```

**4. Access application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001/api
- pgAdmin: http://localhost:5050

#### User Workflows

**As Creator:**
1. Register/Login with role: "creator"
2. Navigate to Upload page
3. Select audio file + cover image
4. Fill in title, description
5. Upload → Track stored in `backend/uploads/tracks/`
6. Track appears in "Your Library"

**As Listener:**
1. Register/Login with role: "listener"
2. Browse/Search tracks
3. Click play → Audio streams from local server
4. Like, comment, add to playlist
5. Follow creators

**As Admin:**
1. Login with admin account
2. Access admin dashboard
3. View all users
4. Ban/unban users
5. View analytics
6. Moderate content

### Testing Checklist

- [ ] Database connection successful
- [ ] User registration works (all 3 roles)
- [ ] User login returns JWT token
- [ ] Creator can upload track (audio + cover)
- [ ] Uploaded files stored in `backend/uploads/`
- [ ] Track appears in database
- [ ] Listener can browse tracks
- [ ] Audio playback works
- [ ] Like/comment functionality works
- [ ] Playlist creation works
- [ ] Admin can view users
- [ ] Admin can ban users
- [ ] Search functionality works
- [ ] Follow/unfollow works
- [ ] Notifications generated

---

## Scalable Architecture Design

### High-Level Overview

```
                         ┌─────────────┐
                         │   CDN       │
                         │ (CloudFront)│
                         └──────┬──────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
              ┌─────▼─────┐          ┌─────▼─────┐
              │   Static  │          │    API    │
              │  Assets   │          │  Gateway  │
              └───────────┘          └─────┬─────┘
                                           │
                      ┌────────────────────┼────────────────────┐
                      │                    │                    │
                ┌─────▼─────┐        ┌────▼────┐         ┌─────▼─────┐
                │   Auth    │        │  Track  │         │  Social   │
                │  Service  │        │ Service │         │  Service  │
                └─────┬─────┘        └────┬────┘         └─────┬─────┘
                      │                   │                    │
                      └───────────────────┼────────────────────┘
                                          │
                      ┌───────────────────┼────────────────────┐
                      │                   │                    │
                ┌─────▼─────┐       ┌────▼────┐         ┌─────▼─────┐
                │ PostgreSQL│       │  Redis  │         │    S3     │
                │ (Primary) │       │ Cluster │         │  +CDN     │
                └───────────┘       └─────────┘         └───────────┘
                      │
                ┌─────▼─────┐
                │ Read      │
                │ Replicas  │
                └───────────┘
```

### Infrastructure Components

#### 1. Container Orchestration

**Kubernetes (EKS/GKE)**
- Deploy services as microservices
- Auto-scaling based on metrics
- Rolling updates with zero downtime
- Health checks and self-healing

**Deployments:**
- API Server (3+ replicas)
- Worker Nodes (for async tasks)
- Frontend (Nginx, 2+ replicas)

**Configuration:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: soundwave-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: soundwave-api
  template:
    metadata:
      labels:
        app: soundwave-api
    spec:
      containers:
      - name: api
        image: soundwave/api:latest
        ports:
        - containerPort: 5001
        env:
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: host
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 5001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 5001
          initialDelaySeconds: 5
          periodSeconds: 5
```

#### 2. Database Layer

**PostgreSQL (Managed - RDS/Cloud SQL)**

**Primary Database:**
- Instance: db.r5.xlarge (4 vCPU, 32GB RAM)
- Multi-AZ deployment
- Automated backups (daily)
- Point-in-time recovery
- Encryption at rest

**Read Replicas:**
- 2-3 read replicas for queries
- Route analytics queries to replicas
- Async replication

**Connection Pooling:**
- PgBouncer (max 100 connections)
- Application-level pool (max 20 per instance)

**Optimization:**
```sql
-- Indexes
CREATE INDEX idx_tracks_user_id ON Tracks(userId);
CREATE INDEX idx_tracks_created_at ON Tracks(createdAt DESC);
CREATE INDEX idx_tracks_play_count ON Tracks(play_count DESC);
CREATE INDEX idx_likes_track_user ON Likes(trackId, userId);
CREATE INDEX idx_follows_follower_followee ON Follows(followerId, followeeId);
CREATE INDEX idx_playlists_user_id ON Playlists(userId);

-- Partial indexes
CREATE INDEX idx_tracks_recent
ON Tracks(createdAt DESC)
WHERE createdAt > NOW() - INTERVAL '30 days';

-- Full-text search
CREATE INDEX idx_tracks_title_search
ON Tracks USING gin(to_tsvector('english', title));
```

#### 3. Caching Layer

**Redis Cluster**

**Use Cases:**
1. **Session Storage** - JWT refresh tokens, user sessions
2. **API Response Caching** - Popular tracks, user feeds
3. **Rate Limiting** - Per-user/IP rate limits
4. **Real-time Data** - Online users, trending tracks
5. **Queue** - Background jobs

**Configuration:**
```javascript
// Redis caching strategy
const cacheTrack = async (trackId) => {
  const cacheKey = `track:${trackId}`;
  const cached = await redis.get(cacheKey);

  if (cached) return JSON.parse(cached);

  const track = await Track.findByPk(trackId);
  await redis.setex(cacheKey, 3600, JSON.stringify(track)); // 1 hour TTL

  return track;
};

// Cache invalidation
const invalidateTrackCache = async (trackId) => {
  await redis.del(`track:${trackId}`);
};
```

**Redis Keys Structure:**
```
track:{id}                  # Track metadata (1 hour TTL)
user:{id}:feed              # User feed (15 min TTL)
track:{id}:likes            # Like count (5 min TTL)
trending:tracks             # Trending tracks (1 hour TTL)
ratelimit:{ip}:{endpoint}   # Rate limiting (1 min TTL)
session:{userId}            # User session (7 days TTL)
```

#### 4. File Storage & CDN

**AWS S3**
- Bucket structure:
  - `soundwave-tracks-prod/`
  - `soundwave-covers-prod/`
  - `soundwave-static-prod/`
- Versioning enabled
- Lifecycle policies (archive old tracks to Glacier after 1 year)
- Server-side encryption

**CloudFront CDN**
- Global edge locations
- Custom domain (cdn.soundwave.com)
- Cache audio files (24 hours)
- Cache images (7 days)
- Signed URLs for private content

**Audio Streaming:**
- Byte-range requests support
- HTTP/2 enabled
- Gzip compression for metadata

#### 5. Load Balancing

**Application Load Balancer (ALB)**
- SSL termination
- Health checks on `/health` endpoint
- Sticky sessions (if needed)
- WebSocket support (for notifications)
- Request routing based on path

**Configuration:**
```
Rules:
- /api/* → API Target Group (port 5001)
- /uploads/* → Static Files Target Group
- /ws → WebSocket Target Group
- /* → Frontend Target Group (Nginx)
```

#### 6. Message Queue

**AWS SQS / RabbitMQ**

**Queues:**
1. **track-processing** - Audio transcoding, metadata extraction
2. **notifications** - Send notifications to users
3. **analytics** - Process play events, aggregate metrics
4. **emails** - Send email notifications

**Worker Implementation:**
```javascript
// Worker for track processing
const processTrackQueue = async () => {
  while (true) {
    const message = await queue.receive('track-processing');

    if (message) {
      const { trackId, s3Key } = message.body;

      try {
        // Download from S3
        // Transcode to multiple bitrates
        // Extract waveform data
        // Generate thumbnail
        // Update database

        await queue.delete(message);
      } catch (error) {
        await queue.retry(message);
      }
    }

    await sleep(1000);
  }
};
```

#### 7. Search Engine

**Elasticsearch**

**Indexed Data:**
- Tracks (title, description, artist, tags)
- Users (username, bio)
- Playlists (name, description)

**Search Features:**
- Full-text search
- Autocomplete
- Fuzzy matching
- Filters (genre, duration, date)
- Sorting (relevance, plays, date)

**Index Mapping:**
```json
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "english",
        "fields": {
          "keyword": { "type": "keyword" }
        }
      },
      "description": { "type": "text" },
      "artistName": { "type": "text" },
      "playCount": { "type": "integer" },
      "duration": { "type": "integer" },
      "createdAt": { "type": "date" },
      "tags": { "type": "keyword" }
    }
  }
}
```

### Application Architecture

#### Microservices Split (Phase 4)

**1. Auth Service**
- User registration/login
- JWT generation/validation
- Password reset
- OAuth integration

**2. Track Service**
- Track CRUD operations
- File upload handling
- Play count tracking
- Track search

**3. Social Service**
- Follows
- Likes
- Comments
- User feeds

**4. Playlist Service**
- Playlist CRUD
- Track management
- Sharing

**5. Analytics Service**
- Play event tracking
- User metrics
- Dashboard data

**6. Notification Service**
- Real-time notifications (WebSocket)
- Email notifications
- Push notifications

**7. Admin Service**
- User management
- Content moderation
- System monitoring

### API Design

#### RESTful API Structure

```
/api/v1
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── POST /refresh
│   └── POST /logout
├── /users
│   ├── GET /:id
│   ├── PUT /:id
│   ├── GET /:id/tracks
│   ├── GET /:id/playlists
│   └── GET /:id/followers
├── /tracks
│   ├── GET /
│   ├── POST /
│   ├── GET /:id
│   ├── PUT /:id
│   ├── DELETE /:id
│   ├── POST /:id/like
│   ├── POST /:id/play
│   └── GET /:id/comments
├── /playlists
│   ├── GET /
│   ├── POST /
│   ├── GET /:id
│   ├── PUT /:id
│   ├── DELETE /:id
│   └── POST /:id/tracks
├── /search
│   ├── GET /tracks
│   ├── GET /users
│   └── GET /playlists
└── /admin
    ├── GET /users
    ├── PUT /users/:id/ban
    └── GET /analytics
```

#### Pagination

```javascript
GET /api/v1/tracks?page=1&limit=20&sort=-createdAt

Response:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1000,
    "totalPages": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Error Handling

```javascript
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ],
    "requestId": "req-123456",
    "timestamp": "2025-10-09T12:00:00Z"
  }
}
```

### Performance Optimizations

#### Database Optimizations

**1. Query Optimization**
```javascript
// Bad: N+1 query
const tracks = await Track.findAll();
for (const track of tracks) {
  const user = await User.findByPk(track.userId);
}

// Good: Eager loading
const tracks = await Track.findAll({
  include: [{ model: User, as: 'user' }]
});
```

**2. Pagination with Cursor**
```javascript
// Cursor-based pagination (better for large datasets)
const tracks = await Track.findAll({
  where: {
    id: { [Op.gt]: lastId }
  },
  limit: 20,
  order: [['id', 'ASC']]
});
```

**3. Database Connection Pooling**
```javascript
pool: {
  max: 20,              // Maximum connections
  min: 5,               // Minimum connections
  acquire: 30000,       // Max time to acquire connection
  idle: 10000,          // Max idle time
  evict: 10000          // Eviction time for idle connections
}
```

#### API Optimizations

**1. Response Compression**
```javascript
const compression = require('compression');
app.use(compression());
```

**2. Field Selection**
```javascript
GET /api/v1/tracks?fields=id,title,duration

// Only return requested fields
```

**3. ETag Caching**
```javascript
const etag = require('etag');

app.get('/api/tracks/:id', async (req, res) => {
  const track = await Track.findByPk(req.params.id);
  const etagValue = etag(JSON.stringify(track));

  if (req.headers['if-none-match'] === etagValue) {
    return res.status(304).send();
  }

  res.setHeader('ETag', etagValue);
  res.json(track);
});
```

**4. Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    client: redisClient
  })
});

app.use('/api/', limiter);
```

#### Frontend Optimizations

**1. Code Splitting**
```javascript
// Lazy load routes
const Home = lazy(() => import('./pages/Home'));
const TrackDetail = lazy(() => import('./pages/TrackDetail'));

<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/track/:id" element={<TrackDetail />} />
  </Routes>
</Suspense>
```

**2. Image Optimization**
```javascript
// Use WebP format
// Responsive images
<picture>
  <source srcSet={`${cover}.webp`} type="image/webp" />
  <img src={cover} alt={title} loading="lazy" />
</picture>
```

**3. Virtual Scrolling**
```javascript
// For long lists of tracks
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={tracks.length}
  itemSize={80}
  width="100%"
>
  {({ index, style }) => (
    <TrackItem track={tracks[index]} style={style} />
  )}
</FixedSizeList>
```

**4. Service Worker (PWA)**
```javascript
// Cache audio files for offline playback
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/uploads/tracks/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
```

### Security Enhancements

#### 1. Authentication & Authorization

**Current (Good):**
- JWT tokens ✓
- bcrypt password hashing ✓
- Role-based access ✓

**Improvements:**
```javascript
// Refresh token rotation
const generateTokenPair = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Store refresh token in Redis
await redis.setex(
  `refresh:${user.id}`,
  7 * 24 * 60 * 60,
  refreshToken
);
```

#### 2. Input Validation

```javascript
const { body, param, validationResult } = require('express-validator');

const validateTrackUpload = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title too long'),
  body('description')
    .trim()
    .isLength({ max: 1000 }).withMessage('Description too long'),
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

#### 3. File Upload Security

```javascript
const fileFilter = (req, file, cb) => {
  // Check file type by magic number, not extension
  const fileType = require('file-type');

  fileType.fromBuffer(file.buffer).then(type => {
    if (file.fieldname === 'track') {
      const allowedAudio = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
      if (allowedAudio.includes(type.mime)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid audio file type'), false);
      }
    } else if (file.fieldname === 'cover') {
      const allowedImages = ['image/jpeg', 'image/png', 'image/webp'];
      if (allowedImages.includes(type.mime)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid image file type'), false);
      }
    }
  });
};
```

#### 4. SQL Injection Prevention

```javascript
// Sequelize parameterized queries (already safe)
const tracks = await Track.findAll({
  where: {
    title: {
      [Op.like]: `%${searchTerm}%` // Safe with Sequelize
    }
  }
});

// Raw queries (use parameterized)
await sequelize.query(
  'SELECT * FROM Tracks WHERE title LIKE :search',
  {
    replacements: { search: `%${searchTerm}%` },
    type: QueryTypes.SELECT
  }
);
```

#### 5. CSRF Protection

```javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.use(csrfProtection);

// Send token to frontend
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
```

#### 6. Content Security Policy

```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      mediaSrc: ["'self'", "https://cdn.soundwave.com"],
      connectSrc: ["'self'", "https://api.soundwave.com"]
    }
  }
}));
```

### Monitoring & Observability

#### 1. Application Monitoring (APM)

**New Relic / DataDog Integration**

```javascript
// server.js
const newrelic = require('newrelic');

// Custom metrics
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    newrelic.recordMetric('API/ResponseTime', duration);
  });

  next();
});
```

#### 2. Logging

**Winston Logger**

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Log with context
logger.info('Track uploaded', {
  userId: user.id,
  trackId: track.id,
  duration: track.duration,
  timestamp: new Date()
});
```

**Centralized Logging (ELK Stack)**
- Elasticsearch: Store logs
- Logstash: Process logs
- Kibana: Visualize logs

#### 3. Metrics & Dashboards

**Prometheus + Grafana**

```javascript
const prometheus = require('prom-client');

// Create metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

const trackUploads = new prometheus.Counter({
  name: 'track_uploads_total',
  help: 'Total number of track uploads'
});

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});
```

**Key Metrics to Track:**
- API response time (p50, p95, p99)
- Error rate (4xx, 5xx)
- Request throughput (req/sec)
- Database query time
- Cache hit rate
- Active users
- Track uploads/plays per minute
- Storage usage

#### 4. Alerting

**Alert Rules:**
```yaml
alerts:
  - name: HighErrorRate
    condition: error_rate > 5%
    duration: 5m
    severity: critical
    notify: pagerduty

  - name: SlowAPI
    condition: p95_response_time > 2s
    duration: 10m
    severity: warning
    notify: slack

  - name: DatabaseConnectionPool
    condition: db_connections > 80%
    duration: 5m
    severity: warning
    notify: email
```

#### 5. Health Checks

```javascript
app.get('/health', async (req, res) => {
  const checks = {
    database: false,
    redis: false,
    storage: false
  };

  try {
    await sequelize.authenticate();
    checks.database = true;
  } catch (error) {
    logger.error('Database health check failed', error);
  }

  try {
    await redis.ping();
    checks.redis = true;
  } catch (error) {
    logger.error('Redis health check failed', error);
  }

  const allHealthy = Object.values(checks).every(v => v === true);

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'healthy' : 'unhealthy',
    checks,
    timestamp: new Date()
  });
});
```

### Deployment Strategy

#### 1. CI/CD Pipeline

**GitHub Actions Workflow**

```yaml
name: Deploy Soundwave

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'

      - name: Install backend dependencies
        run: cd backend && npm ci

      - name: Run backend tests
        run: cd backend && npm test

      - name: Install frontend dependencies
        run: cd frontend && npm ci

      - name: Run frontend tests
        run: cd frontend && npm test

      - name: Lint code
        run: cd backend && npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Build backend Docker image
        run: docker build -t soundwave/api:${{ github.sha }} ./backend

      - name: Build frontend
        run: cd frontend && npm run build

      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push soundwave/api:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/soundwave-api \
            api=soundwave/api:${{ github.sha }}
          kubectl rollout status deployment/soundwave-api
```

#### 2. Blue-Green Deployment

```bash
# Deploy new version (green)
kubectl apply -f k8s/deployment-green.yaml

# Wait for healthy
kubectl wait --for=condition=available deployment/soundwave-api-green

# Switch traffic
kubectl patch service soundwave-api -p '{"spec":{"selector":{"version":"green"}}}'

# Monitor for 15 minutes
# If issues, rollback:
# kubectl patch service soundwave-api -p '{"spec":{"selector":{"version":"blue"}}}'

# If stable, delete blue
kubectl delete deployment soundwave-api-blue
```

#### 3. Database Migrations

**Zero-Downtime Migration Strategy:**

```javascript
// Migration: Add column with default value
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tracks', 'genre', {
      type: Sequelize.STRING(50),
      defaultValue: 'unknown'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Tracks', 'genre');
  }
};

// Run before deployment
npm run migrate

// Deploy new code that uses 'genre' column
```

#### 4. Feature Flags

```javascript
// Feature flag service
const featureFlags = {
  newAudioPlayer: {
    enabled: true,
    rollout: 50 // Percentage of users
  },
  socialSharing: {
    enabled: false
  }
};

const isFeatureEnabled = (flagName, userId) => {
  const flag = featureFlags[flagName];
  if (!flag || !flag.enabled) return false;

  if (flag.rollout) {
    // Hash-based rollout
    const hash = userId % 100;
    return hash < flag.rollout;
  }

  return true;
};
```

### Cost Optimization

#### 1. Infrastructure Costs

**Estimated Monthly Costs (10K users):**
- EC2/Compute: $300 (3x t3.medium)
- RDS PostgreSQL: $200 (db.t3.large)
- ElastiCache Redis: $50 (cache.t3.micro)
- S3 Storage: $50 (1TB storage)
- CloudFront: $100 (bandwidth)
- Load Balancer: $25
- **Total: ~$725/month**

**Cost Optimization Strategies:**

1. **Reserved Instances** - 30-50% savings
2. **S3 Lifecycle Policies** - Move old tracks to Glacier
3. **Auto-scaling** - Scale down during low traffic
4. **Spot Instances** - For worker nodes (70% savings)
5. **CDN Caching** - Reduce origin requests
6. **Database Query Optimization** - Smaller instance size
7. **Compression** - Reduce bandwidth costs

#### 2. Storage Optimization

```javascript
// S3 lifecycle policy
{
  "Rules": [
    {
      "Id": "ArchiveOldTracks",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 365,
          "StorageClass": "GLACIER"
        }
      ]
    },
    {
      "Id": "DeleteTempFiles",
      "Status": "Enabled",
      "Expiration": {
        "Days": 7
      },
      "Filter": {
        "Prefix": "temp/"
      }
    }
  ]
}
```

#### 3. Database Optimization

```sql
-- Archive old data to separate table
CREATE TABLE Tracks_Archive (LIKE Tracks INCLUDING ALL);

-- Move old tracks
INSERT INTO Tracks_Archive
SELECT * FROM Tracks
WHERE createdAt < NOW() - INTERVAL '2 years'
  AND play_count < 10;

-- Delete archived tracks
DELETE FROM Tracks
WHERE id IN (SELECT id FROM Tracks_Archive);

-- Vacuum to reclaim space
VACUUM FULL Tracks;
```

---

## Migration Roadmap

### Phase 1: Local Minimal Setup (Week 1)
**Goal:** Get local development working

**Tasks:**
- [ ] Create .env.example file
- [ ] Replace S3 with local file storage
- [ ] Create config/storage.js
- [ ] Update trackController.js for local storage
- [ ] Update server.js to serve static files
- [ ] Clean up database.js (remove dual connection)
- [ ] Create uploads directory structure
- [ ] Update frontend API URLs
- [ ] Write LOCAL_SETUP.md documentation
- [ ] Test full user workflows (creator/listener/admin)

**Deliverables:**
- Fully functional local development environment
- Documentation for new developers
- Test data seeding script

---

### Phase 2: Production Preparation (Weeks 2-4)
**Goal:** Make application production-ready

**Tasks:**
- [ ] Add comprehensive error handling
- [ ] Implement request validation on all endpoints
- [ ] Add rate limiting
- [ ] Implement refresh token rotation
- [ ] Add logging (Winston)
- [ ] Expand test coverage (target 70%)
- [ ] Add health check endpoints
- [ ] Implement graceful shutdown
- [ ] Add API documentation (Swagger)
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Containerize application (Dockerfile)
- [ ] Create Kubernetes manifests
- [ ] Set up staging environment

**Deliverables:**
- Production-ready codebase
- Automated testing and deployment
- Staging environment for testing

---

### Phase 3: Initial Production Deployment (Weeks 5-6)
**Goal:** Deploy to production (single region)

**Tasks:**
- [ ] Provision infrastructure (Terraform/CloudFormation)
  - [ ] VPC and networking
  - [ ] RDS PostgreSQL
  - [ ] ElastiCache Redis
  - [ ] S3 buckets
  - [ ] Load balancer
  - [ ] EC2 instances / ECS / EKS
- [ ] Set up monitoring (Prometheus + Grafana)
- [ ] Configure alerting (PagerDuty/Slack)
- [ ] Set up centralized logging (CloudWatch/ELK)
- [ ] Configure CDN (CloudFront)
- [ ] Set up backup and recovery procedures
- [ ] Database migration strategy
- [ ] Deploy application
- [ ] Load testing (target: 1000 concurrent users)
- [ ] Security audit
- [ ] Performance optimization

**Deliverables:**
- Live production environment
- Monitoring and alerting
- Runbook for operations

---

### Phase 4: Scaling & Optimization (Weeks 7-12)
**Goal:** Optimize for scale and performance

**Tasks:**
- [ ] Add Redis caching layer
  - [ ] Cache popular tracks
  - [ ] Cache user feeds
  - [ ] Session storage
- [ ] Implement database read replicas
- [ ] Add message queue (SQS/RabbitMQ)
  - [ ] Async notifications
  - [ ] Track processing
  - [ ] Analytics aggregation
- [ ] Implement Elasticsearch for search
- [ ] Add audio transcoding pipeline
- [ ] Implement WebSockets for real-time features
- [ ] Add pagination to all list endpoints
- [ ] Optimize database queries
- [ ] Add database indexes
- [ ] Implement API response compression
- [ ] Frontend performance optimization
  - [ ] Code splitting
  - [ ] Lazy loading
  - [ ] Image optimization
  - [ ] Service worker (PWA)
- [ ] Multi-region deployment prep
- [ ] Capacity planning

**Deliverables:**
- Highly scalable architecture
- Sub-second API response times
- Support for 100K+ users

---

### Phase 5: Advanced Features (Months 4-6)
**Goal:** Add advanced functionality

**Tasks:**
- [ ] Microservices architecture (if needed)
  - [ ] Split auth service
  - [ ] Split track service
  - [ ] Split social service
- [ ] Real-time analytics dashboard
- [ ] Recommendation engine
- [ ] Social features
  - [ ] User feeds
  - [ ] Track sharing
  - [ ] Reposts
- [ ] Email notifications (SendGrid/SES)
- [ ] Push notifications (FCM)
- [ ] Mobile app API enhancements
- [ ] Admin analytics improvements
- [ ] Content moderation tools
- [ ] Payment integration (if monetizing)
- [ ] Advanced search features
- [ ] Playlist collaboration
- [ ] Live streaming support

**Deliverables:**
- Feature-complete platform
- Enhanced user engagement
- Monetization capabilities

---

## Implementation Priorities

### Immediate (This Week)
1. **Create .env.example** - 1 hour
2. **Replace S3 with local storage** - 4 hours
3. **Test local upload/playback** - 2 hours
4. **Write setup documentation** - 2 hours

### Short-term (Next 2 Weeks)
1. **Add error handling** - 1 day
2. **Implement rate limiting** - 1 day
3. **Add request validation** - 2 days
4. **Expand test coverage** - 3 days
5. **Set up CI/CD** - 2 days

### Medium-term (Next Month)
1. **Deploy to staging** - 1 week
2. **Add monitoring** - 1 week
3. **Performance testing** - 1 week
4. **Security audit** - 1 week

### Long-term (Next 3 Months)
1. **Production deployment** - 2 weeks
2. **Redis caching** - 1 week
3. **Elasticsearch integration** - 2 weeks
4. **Message queue** - 2 weeks
5. **Read replicas** - 1 week
6. **CDN optimization** - 1 week

---

## Success Metrics

### Performance Targets
- API response time: p95 < 200ms, p99 < 500ms
- Audio start time: < 1 second
- Search latency: < 100ms
- Database query time: < 50ms (average)
- Cache hit rate: > 80%
- Error rate: < 0.1%
- Uptime: 99.9% (43 minutes downtime/month)

### Scale Targets
- Support 100K registered users
- Support 10K concurrent users
- Handle 1M track plays/day
- Handle 10K track uploads/day
- Store 100TB of audio data
- Serve 1PB of bandwidth/month

### Cost Targets
- Cost per user: < $0.10/month
- Storage cost: < $20/TB/month
- Bandwidth cost: < $50/TB
- Total infrastructure: < $5K/month at 50K users

---

## Conclusion

This evaluation provides a comprehensive roadmap for Soundwave from local development to production-scale deployment. The phased approach allows for iterative improvements while maintaining a working system at each stage.

**Next Steps:**
1. Implement local minimal setup (this week)
2. Test all user flows (creator/listener/admin)
3. Begin Phase 2 preparation
4. Set up staging environment
5. Plan production infrastructure

**Key Success Factors:**
- Start simple, scale incrementally
- Monitor everything
- Automate deployments
- Plan for failure
- Optimize continuously

For questions or clarifications on any section, refer to the specific component documentation or reach out to the development team.
