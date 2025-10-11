# Installation Checklist - Soundwave Complete

## ⚡ Quick Start

Follow these steps to run your complete Soundwave platform:

### 1. Install Node Dependencies

```bash
cd backend

# Install ALL dependencies (including new ones)
npm install socket.io

# If you get any errors, run
npm install --legacy-peer-deps
```

### 2. Start Docker Services

```bash
# From project root
docker-compose up -d

# Verify services are running
docker-compose ps
```

**Expected services:**
- soundwave_postgres (PostgreSQL database)
- soundwave_pgadmin (Database admin UI)
- soundwave_minio (Object storage)

### 3. Configure Environment

```bash
# From project root
cp .env.example .env

# Edit .env file - key settings:
STORAGE_TYPE=minio
PORT=5001
FRONTEND_URL=http://localhost:3000
```

### 4. Run Migrations

```bash
cd backend
npm run migrate
```

This will create all database tables:
- Users, Tracks, Playlists, PlaylistTracks
- Comments, Likes, Follows, Notifications
- PlayHistory, Queue (NEW)
- Albums, AlbumTracks (NEW)

### 5. Start Backend

```bash
cd backend
npm run dev
```

**You should see:**
```
============================================================
🚀 Soundwave Server Started Successfully!
============================================================
📡 Server running on: http://localhost:5001
🌐 API Base URL: http://localhost:5001/api
⚡ WebSocket server running on: ws://localhost:5001
============================================================

✅ Socket.IO initialized
✅ Database connection established successfully
✅ MinIO bucket "soundwave-tracks" created successfully
✅ MinIO connection successful! Found 1 bucket(s)

============================================================
📚 Available Routes:
============================================================
   Auth:            /api/auth
   Users:           /api/users
   Tracks:          /api/tracks
   Albums:          /api/albums        ⚡ NEW
   Playlists:       /api/playlists
   Queue:           /api/queue         ⚡ NEW
   History:         /api/history       ⚡ NEW
   Search:          /api/search        ⚡ NEW
   Recommendations: /api/recommendations ⚡ NEW
   Analytics:       /api/analytics     ⚡ ENHANCED
   Admin:           /api/admin         ⚡ ENHANCED
   Notifications:   /api/notifications
============================================================
```

### 6. Start Frontend

```bash
cd frontend
npm install
npm start
```

Frontend will open at http://localhost:3000

---

## 🔍 Verification Steps

### Test Basic Functionality

```bash
# 1. Test server is running
curl http://localhost:5001/api/auth/login

# 2. Login as admin
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'

# 3. Get platform statistics
curl -X GET "http://localhost:5001/api/admin/statistics" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test New Features

```bash
# Test Albums
curl -X GET "http://localhost:5001/api/albums"

# Test Recommendations (requires auth)
curl -X GET "http://localhost:5001/api/recommendations" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test Advanced Search
curl -X GET "http://localhost:5001/api/search/tracks?q=test&sortBy=popular"

# Test Analytics
curl -X GET "http://localhost:5001/api/analytics/top-tracks"
```

### Test WebSocket Connection

```javascript
// In browser console or Node.js
const io = require('socket.io-client');
const socket = io('http://localhost:5001', {
  auth: { token: 'YOUR_JWT_TOKEN' }
});

socket.on('connect', () => {
  console.log('✅ WebSocket connected!');
});

socket.on('notification', (data) => {
  console.log('Notification:', data);
});
```

---

## 🐛 Troubleshooting

### Issue: Socket.IO not working

**Solution:**
```bash
cd backend
npm install socket.io
npm run dev
```

If you see `⚠️ Socket.IO not available`, install it manually.

### Issue: Database tables not created

**Solution:**
```bash
cd backend
npm run migrate

# Or manually sync
node -e "require('./models').sequelize.sync({alter: true})"
```

### Issue: MinIO bucket not created

**Solution:**
```bash
# Check MinIO is running
curl http://localhost:9000/minio/health/live

# Restart MinIO
docker-compose restart minio

# Check logs
docker-compose logs minio
```

### Issue: Port already in use

**Solution:**
```bash
# Check what's using port 5001
lsof -i :5001

# Kill the process
kill -9 PID

# Or change PORT in .env
PORT=5002
```

### Issue: CORS errors

**Solution:**
Edit `backend/server.js` and update CORS configuration:
```javascript
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 📦 Required Dependencies

### Backend (package.json)

Make sure these are in your `backend/package.json`:

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.0.3",
    "pg": "^8.10.0",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.31.0",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0",
    "cors": "^2.8.5",
    "multer": "^1.4.5-lts.1",
    "multer-s3": "^3.0.1",
    "aws-sdk": "^2.1394.0",
    "socket.io": "^4.5.0"  <-- NEW (Phase 8)
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

### Frontend (package.json)

Add socket.io-client for WebSocket:

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "socket.io-client": "^4.5.0"  <-- NEW
  }
}
```

---

## 🎯 What to Test

### 1. Albums
- [ ] Create album
- [ ] Upload cover image
- [ ] Add tracks to album
- [ ] Reorder tracks
- [ ] Publish album
- [ ] Browse albums
- [ ] View album details

### 2. Recommendations
- [ ] Get personalized recommendations
- [ ] Get Discover Weekly
- [ ] Get Daily Mix
- [ ] Get similar tracks
- [ ] Get related tracks (collaborative filtering)

### 3. Advanced Analytics
- [ ] Creator dashboard (total plays, likes, comments)
- [ ] Track plays over time chart
- [ ] Listener demographics
- [ ] Admin user growth chart
- [ ] Admin upload trends
- [ ] Most active users

### 4. Real-time Features
- [ ] Real-time notifications (like, comment, follow)
- [ ] Live play count updates
- [ ] Online/offline status
- [ ] Typing indicators
- [ ] New track notifications

---

## 🚀 Ready to Launch!

Once all tests pass, your Soundwave platform is ready for:

1. **Development:** ✅ Ready now!
2. **Staging:** Change `STORAGE_TYPE=minio` (keep using MinIO on staging)
3. **Production:** Change `STORAGE_TYPE=s3` + AWS credentials

---

## 📝 Quick Reference

### Test Users (from seeds)
```
Admin:    admin@test.com    / password123
Creator:  creator@test.com  / password123
Listener: listener@test.com / password123
```

### Service URLs
```
Backend:      http://localhost:5001
Frontend:     http://localhost:3000
PostgreSQL:   localhost:5432
pgAdmin:      http://localhost:5050
MinIO Console: http://localhost:9001
MinIO API:    http://localhost:9000
```

### MinIO Credentials
```
Username: soundwave
Password: soundwave123
```

---

**Everything is ready! Start building your music empire! 🎵🚀**
