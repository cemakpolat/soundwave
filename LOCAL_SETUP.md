# Soundwave - Local Development Setup Guide

This guide will help you set up Soundwave for local development with minimal external dependencies. No AWS account required!

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [User Workflows](#user-workflows)
- [Troubleshooting](#troubleshooting)
- [API Endpoints](#api-endpoints)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Docker** & **Docker Compose** - [Download](https://www.docker.com/get-started)
- **Git** - [Download](https://git-scm.com/)

Check your installations:
```bash
node --version  # Should be v16+
npm --version
docker --version
docker-compose --version
```

---

## Quick Start

For the impatient! Get up and running in 5 minutes:

```bash
# 1. Clone the repository (if not already done)
cd /path/to/soundwave

# 2. Create environment file
cp .env.example .env

# 3. Start the database
docker-compose up -d

# 4. Set up backend
cd backend
npm install
npm run migrate
npm run seed_test_data  # Optional: adds test users and data
npm run dev

# 5. In a new terminal, set up frontend
cd frontend
npm install
npm start

# 6. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5001/api
# pgAdmin: http://localhost:5050
```

**Test Users** (if you ran `seed_test_data`):
- **Creator**: `creator@test.com` / `password123`
- **Listener**: `listener@test.com` / `password123`
- **Admin**: `admin@test.com` / `password123`

---

## Detailed Setup

### Step 1: Environment Configuration

1. **Create `.env` file** in the project root:
```bash
cp .env.example .env
```

2. **Edit `.env`** with your local settings (defaults should work):
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

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# pgAdmin Configuration
PGADMIN_DEFAULT_EMAIL=admin@soundwave.com
PGADMIN_DEFAULT_PASSWORD=admin123
```

### Step 2: Start the Database

1. **Start PostgreSQL and pgAdmin** using Docker Compose:
```bash
docker-compose up -d
```

2. **Verify containers are running**:
```bash
docker-compose ps

# You should see:
# soundwave_postgres  - running on port 5432
# soundcloud_pgadmin  - running on port 5050
```

3. **Access pgAdmin** (optional, for database management):
   - URL: http://localhost:5050
   - Email: `admin@soundwave.com`
   - Password: `admin123`

### Step 3: Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Run database migrations** (creates tables):
```bash
npm run migrate
```

Expected output:
```
Sequelize CLI [Node: 16.x.x]
== 20XX... - migration - migrating =======
== 20XX... - migration - migrated (0.123s)
```

4. **Seed test data** (optional but recommended):
```bash
npm run seed_test_data
```

This creates:
- 3 test users (creator, listener, admin)
- Sample tracks (if any)
- Sample playlists

5. **Start the backend server**:
```bash
npm run dev
```

Expected output:
```
Server running on port 5001
Database connection has been established successfully.
Created directory: /path/to/soundwave/backend/uploads
Created directory: /path/to/soundwave/backend/uploads/tracks
Created directory: /path/to/soundwave/backend/uploads/covers
```

### Step 4: Frontend Setup

1. **Open a new terminal** and navigate to frontend directory:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the frontend development server**:
```bash
npm start
```

Expected output:
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

4. **Access the application**:
   - Open your browser to http://localhost:3000
   - You should see the Soundwave login page

---

## User Workflows

### As a Creator (Upload Music)

1. **Register/Login**:
   - Go to http://localhost:3000
   - Click "Register" or use test account: `creator@test.com` / `password123`
   - Make sure your role is "creator"

2. **Upload a Track**:
   - Click "Upload" or navigate to the upload page
   - Fill in track details:
     - Title: e.g., "My Awesome Track"
     - Description: e.g., "A cool song I made"
     - Duration: e.g., "180" (in seconds)
   - Select audio file (MP3, WAV, OGG supported)
   - Select cover image (JPG, PNG, WEBP supported)
   - Click "Upload"

3. **Verify Upload**:
   - Track appears in "Your Library"
   - File is stored in `backend/uploads/tracks/`
   - Cover is stored in `backend/uploads/covers/`
   - Track metadata saved in database

4. **Manage Your Tracks**:
   - Edit track details
   - Delete tracks
   - View play counts
   - See comments and likes

### As a Listener (Play Music)

1. **Register/Login**:
   - Go to http://localhost:3000
   - Register with role "listener" or use: `listener@test.com` / `password123`

2. **Discover Music**:
   - Browse the home page
   - Use search to find tracks
   - Click on a track to view details

3. **Play a Track**:
   - Click the play button
   - Audio streams from local server
   - Play count increments automatically

4. **Interact with Tracks**:
   - Like tracks
   - Add comments
   - Create playlists
   - Follow creators

5. **Manage Playlists**:
   - Create new playlists
   - Add tracks to playlists
   - Reorder tracks
   - Share playlists

### As an Admin (Manage Platform)

1. **Login as Admin**:
   - Use admin account: `admin@test.com` / `password123`

2. **Access Admin Dashboard**:
   - Navigate to `/admin` or click "Admin" in menu

3. **Manage Users**:
   - View all registered users
   - Ban/unban users
   - View user activity
   - Delete users

4. **Moderate Content**:
   - View all tracks
   - Delete inappropriate content
   - View reports (if implemented)

5. **View Analytics**:
   - Total users, tracks, plays
   - Popular tracks
   - User growth metrics
   - Storage usage

---

## Troubleshooting

### Database Connection Issues

**Problem**: `Unable to connect to the database`

**Solutions**:
1. Verify Docker containers are running:
   ```bash
   docker-compose ps
   ```

2. Check database logs:
   ```bash
   docker-compose logs postgres
   ```

3. Verify `.env` database credentials match `docker-compose.yml`

4. Restart containers:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### Port Already in Use

**Problem**: `Port 5001 is already in use` or `Port 3000 is already in use`

**Solutions**:
1. Find and kill the process using the port:
   ```bash
   # On Mac/Linux
   lsof -ti:5001 | xargs kill -9
   lsof -ti:3000 | xargs kill -9

   # On Windows
   netstat -ano | findstr :5001
   taskkill /PID <PID> /F
   ```

2. Or change the port in `.env`:
   ```env
   PORT=5002  # Change backend port
   ```

### File Upload Issues

**Problem**: `Error uploading track` or `Invalid file type`

**Solutions**:
1. Verify upload directory exists:
   ```bash
   ls -la backend/uploads/
   ```

2. Check file permissions:
   ```bash
   chmod -R 755 backend/uploads/
   ```

3. Verify file types:
   - Audio: MP3, WAV, OGG, FLAC, AAC, M4A
   - Images: JPG, JPEG, PNG, WEBP, GIF

4. Check file size (max 100MB):
   ```bash
   ls -lh your-audio-file.mp3
   ```

### Frontend Not Loading

**Problem**: Blank page or CORS errors

**Solutions**:
1. Verify backend is running on port 5001

2. Check browser console for errors

3. Verify CORS configuration in `.env`:
   ```env
   FRONTEND_URL=http://localhost:3000
   ```

4. Clear browser cache and reload

5. Check if API is accessible:
   ```bash
   curl http://localhost:5001/api/tracks
   ```

### Migration Errors

**Problem**: `Migration failed` or `Table already exists`

**Solutions**:
1. Reset database:
   ```bash
   cd backend
   npx sequelize-cli db:migrate:undo:all
   npm run migrate
   ```

2. Or drop and recreate database:
   ```bash
   docker-compose down -v  # WARNING: Deletes all data
   docker-compose up -d
   npm run migrate
   ```

### JWT Token Issues

**Problem**: `Invalid token` or `Token expired`

**Solutions**:
1. Clear localStorage in browser:
   ```javascript
   // In browser console
   localStorage.clear()
   ```

2. Verify JWT_SECRET in `.env` is set

3. Re-login to get new token

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Tracks
- `GET /api/tracks` - Get all tracks (with pagination)
- `GET /api/tracks/:id` - Get track by ID
- `GET /api/tracks/:id/url` - Get track playback URL
- `POST /api/tracks/upload` - Upload new track (Creator only)
- `PUT /api/tracks/:id` - Update track details (Creator only)
- `DELETE /api/tracks/:id` - Delete track (Creator/Admin)

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/tracks` - Get user's tracks
- `GET /api/users/:id/playlists` - Get user's playlists

### Playlists
- `GET /api/playlists` - Get all playlists
- `GET /api/playlists/:id` - Get playlist by ID
- `POST /api/playlists` - Create playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist
- `POST /api/playlists/:id/tracks` - Add track to playlist

### Admin
- `GET /api/admin/users` - Get all users (Admin only)
- `PUT /api/admin/users/:id/ban` - Ban/unban user (Admin only)
- `GET /api/admin/analytics` - Get platform analytics (Admin only)

### Testing API with curl

**Register a user**:
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "role": "creator"
  }'
```

**Login**:
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get tracks** (with auth token):
```bash
curl -X GET http://localhost:5001/api/tracks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- **Backend**: Uses `nodemon` - saves automatically restart server
- **Frontend**: React dev server - saves automatically update browser

### Viewing Logs

**Backend logs**:
```bash
cd backend
npm run dev  # Logs appear in terminal
```

**Database logs**:
```bash
docker-compose logs -f postgres
```

**Frontend logs**:
- Check browser console (F12)
- Check terminal running `npm start`

### Database Management

**Using pgAdmin**:
1. Go to http://localhost:5050
2. Login with credentials from `.env`
3. Add server:
   - Host: `postgres` (if accessing from Docker) or `localhost`
   - Port: `5432`
   - Database: `soundwave_db`
   - Username: `soundwave_user`
   - Password: `soundwave_password`

**Using psql** (command line):
```bash
docker exec -it soundwave_postgres psql -U soundwave_user -d soundwave_db

# Example queries
\dt                    # List tables
SELECT * FROM "Users"; # View users
SELECT * FROM "Tracks"; # View tracks
\q                     # Quit
```

### Resetting Everything

To start fresh:

```bash
# Stop all services
docker-compose down -v  # WARNING: Deletes all data

# Clean backend
cd backend
rm -rf node_modules uploads
npm install

# Clean frontend
cd frontend
rm -rf node_modules
npm install

# Start fresh
docker-compose up -d
cd backend && npm run migrate && npm run seed_test_data
```

---

## Next Steps

Once you have the local setup working:

1. **Read PROJECT_EVALUATION.md** for architecture details
2. **Explore the codebase**:
   - Backend: `backend/controllers/`, `backend/models/`, `backend/routes/`
   - Frontend: `frontend/src/pages/`, `frontend/src/components/`
3. **Run tests** (if available):
   ```bash
   cd backend && npm test
   cd frontend && npm test
   ```
4. **Start developing features**
5. **Plan for production** (see PROJECT_EVALUATION.md)

---

## Getting Help

- Check the [PROJECT_EVALUATION.md](./PROJECT_EVALUATION.md) for architecture details
- Review backend logs for API errors
- Check browser console for frontend errors
- Verify `.env` configuration
- Ensure all services are running

## Contributing

1. Create a feature branch
2. Make your changes
3. Test locally
4. Submit a pull request

---

**Happy Coding!** 🎵🎧
