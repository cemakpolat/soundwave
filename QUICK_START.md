# Soundwave - Quick Start Guide

Get your Spotify clone running in 5 minutes!

## What's Been Done

Your Soundwave project has been configured for local development with:
- ✅ Local file storage (no AWS needed)
- ✅ PostgreSQL database setup
- ✅ Complete backend API
- ✅ React frontend
- ✅ User roles: Creator, Listener, Admin
- ✅ Upload, play, and manage tracks

## Prerequisites

- Node.js v16+
- Docker & Docker Compose
- Your favorite code editor

## Start the Application

### 1. Setup Environment

```bash
# Copy environment template
cp .env.example .env

# The defaults work fine for local development!
```

### 2. Start Database

```bash
# Start PostgreSQL in Docker
docker-compose up -d

# Verify it's running
docker-compose ps
```

### 3. Start Backend

```bash
cd backend

# Install dependencies
npm install

# Create database tables
npm run migrate

# (Optional) Add test users and data
npm run seed_test_data

# Start the server
npm run dev
```

You should see:
```
Server running on port 5001
Database connection has been established successfully.
Created directory: .../backend/uploads
Created directory: .../backend/uploads/tracks
Created directory: .../backend/uploads/covers
```

### 4. Start Frontend

Open a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Start React app
npm start
```

Browser opens automatically to http://localhost:3000

## Test It Out

### Test Accounts (if you ran `seed_test_data`)

| Role | Email | Password |
|------|-------|----------|
| Creator | creator@test.com | password123 |
| Listener | listener@test.com | password123 |
| Admin | admin@test.com | password123 |

### Quick Tests

**1. As Creator - Upload Music**
- Login as `creator@test.com`
- Go to Upload page
- Select an MP3 file and cover image
- Fill in title, description, duration
- Click Upload
- ✅ Track appears in Your Library

**2. As Listener - Play Music**
- Login as `listener@test.com`
- Browse tracks
- Click play
- ✅ Music plays from local server

**3. As Admin - Manage Users**
- Login as `admin@test.com`
- Go to Admin Dashboard
- View users, ban/unban
- ✅ User management works

## Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Main application |
| Backend API | http://localhost:5001/api | REST API |
| pgAdmin | http://localhost:5050 | Database management |
| Uploads | http://localhost:5001/uploads | Uploaded files |

## File Structure

```
soundwave/
├── backend/
│   ├── config/
│   │   ├── database.js      # PostgreSQL config
│   │   └── storage.js       # Local file storage (NEW!)
│   ├── controllers/         # Business logic
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── uploads/             # Uploaded files (NEW!)
│   │   ├── tracks/          # Audio files
│   │   └── covers/          # Cover images
│   └── server.js            # Express app
├── frontend/
│   └── src/
│       ├── pages/           # React pages
│       ├── components/      # React components
│       └── services/        # API calls
├── .env.example             # Environment template (NEW!)
├── docker-compose.yml       # Database setup
├── LOCAL_SETUP.md           # Detailed setup guide (NEW!)
└── PROJECT_EVALUATION.md    # Full architecture (NEW!)
```

## What Changed?

### Backend Changes
1. **config/storage.js** - New unified storage system (local or S3)
2. **controllers/trackController.js** - Updated for local storage
3. **routes/trackRoutes.js** - Uses new storage config
4. **server.js** - Serves static files from /uploads

### Configuration
1. **.env.example** - Environment template with all variables
2. **uploads/** - Directory for storing files locally
3. **.gitignore** - Updated to ignore uploaded files

## Troubleshooting

### Database won't connect
```bash
docker-compose down
docker-compose up -d
cd backend && npm run migrate
```

### Port already in use
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9

# Or change port in .env
PORT=5002
```

### Can't upload files
```bash
# Check uploads directory exists
ls -la backend/uploads/

# Fix permissions if needed
chmod -R 755 backend/uploads/
```

### Frontend shows CORS errors
- Verify backend is running on port 5001
- Check `.env` has `FRONTEND_URL=http://localhost:3000`
- Restart backend server

## Next Steps

### Immediate
1. ✅ Get it running (you're here!)
2. 📖 Read [LOCAL_SETUP.md](./LOCAL_SETUP.md) for details
3. 🎵 Upload your first track
4. 🎧 Test all user workflows

### Short-term
1. 📚 Review [PROJECT_EVALUATION.md](./PROJECT_EVALUATION.md)
2. 🧪 Add tests
3. 🎨 Customize the UI
4. ✨ Add new features

### Long-term
1. 🚀 Plan production deployment
2. 📊 Add analytics
3. 🔍 Implement search with Elasticsearch
4. 📱 Build mobile app

## Key Features

### Current Features
- ✅ User authentication (JWT)
- ✅ Role-based access (Creator, Listener, Admin)
- ✅ Track upload and streaming
- ✅ Playlists
- ✅ Social features (likes, comments, follows)
- ✅ Admin dashboard
- ✅ File storage (local or S3)

### Architecture Highlights
- **Storage**: Flexible (local for dev, S3 for production)
- **Database**: PostgreSQL with Sequelize ORM
- **API**: RESTful with Express.js
- **Frontend**: React with React Router
- **Auth**: JWT with role-based authorization

## Development Workflow

### Making Changes

**Backend**:
```bash
cd backend
npm run dev  # Auto-reloads on changes
```

**Frontend**:
```bash
cd frontend
npm start  # Auto-reloads on changes
```

### Database Changes

**Create migration**:
```bash
cd backend
npx sequelize-cli migration:generate --name add-genre-to-tracks
```

**Run migrations**:
```bash
npm run migrate
```

### Testing APIs

```bash
# Register user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"password123","role":"creator"}'

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Get tracks (replace TOKEN)
curl -X GET http://localhost:5001/api/tracks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Production Considerations

When ready for production, see [PROJECT_EVALUATION.md](./PROJECT_EVALUATION.md) for:
- 🏗️ Scalable architecture design
- ☁️ Cloud deployment (AWS/GCP/Azure)
- 🔒 Security hardening
- 📈 Performance optimization
- 💰 Cost estimates
- 📊 Monitoring setup

## Storage Options

### Local Storage (Current)
- ✅ No AWS account needed
- ✅ Fast for development
- ✅ Free
- ❌ Not for production
- ❌ Not scalable

### S3 Storage (Production)
To switch to S3, update `.env`:
```env
STORAGE_TYPE=s3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_BUCKET_NAME=soundwave-tracks
```

Code automatically handles both!

## Getting Help

1. **Check logs**: Backend terminal and browser console
2. **Read docs**:
   - [LOCAL_SETUP.md](./LOCAL_SETUP.md) - Detailed setup
   - [PROJECT_EVALUATION.md](./PROJECT_EVALUATION.md) - Architecture
3. **Verify setup**:
   ```bash
   docker-compose ps  # Database running?
   curl http://localhost:5001/api/tracks  # API responding?
   ```
4. **Reset everything**:
   ```bash
   docker-compose down -v
   rm -rf backend/node_modules frontend/node_modules
   # Then start from step 1
   ```

## Success Checklist

- [ ] Docker containers running
- [ ] Backend on port 5001
- [ ] Frontend on port 3000
- [ ] Can register/login
- [ ] Can upload track (as creator)
- [ ] Can play track (as listener)
- [ ] Can access admin panel (as admin)
- [ ] Files stored in backend/uploads/

If all checked, you're ready to develop! 🎉

---

**Need more details?** Check [LOCAL_SETUP.md](./LOCAL_SETUP.md)

**Planning production?** See [PROJECT_EVALUATION.md](./PROJECT_EVALUATION.md)

**Happy Coding!** 🎵
