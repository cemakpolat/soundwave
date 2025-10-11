# SoundWave - Quick Reference Guide

## 🚀 Quick Start

### 1. Apply Database Changes
```bash
cd backend
node syncDatabase.js
```

### 2. Start Backend
```bash
cd backend
npm start
# Server runs on http://localhost:5001
```

### 3. Start Frontend
```bash
cd frontend
npm start
# App runs on http://localhost:3000
```

### 4. Test Login
- **Creator**: creator@test.com / password123
- **Listener**: listener@test.com / password123
- **Admin**: admin@test.com / password123

---

## 📍 New Features (Just Added)

### Profile Editing
1. Login to your account
2. Click profile icon → Settings
3. Or navigate to: `http://localhost:3000/settings`
4. Upload photo, add bio, location, social links
5. Click "Save Changes"

### Track Management (Creators Only)
1. Navigate to Creator Dashboard
2. Hover over your track
3. Click three-dot menu (top-right)
4. Choose:
   - **Edit Track** - Change title/description
   - **Delete Track** - Remove track (with confirmation)
   - **Share** - Share on social media
   - **Add to Playlist** - (Coming soon)
   - **Download** - Download your track

### Share Any Track
1. Hover over any track card
2. Click three-dot menu
3. Click "Share"
4. Options:
   - Copy link
   - Share on Twitter
   - Share on Facebook

### Social Features
- **Like Track**: Click heart icon
- **Comment**: Go to track page, add comment
- **Follow User**: Visit profile, click Follow
- **View Notifications**: Click bell icon

---

## 📁 Project Structure

```
soundwave/
├── backend/
│   ├── config/          # Database, storage config
│   ├── controllers/     # Business logic
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── uploads/         # File uploads
│   │   ├── tracks/      # Audio files
│   │   ├── covers/      # Cover images
│   │   └── profiles/    # Profile pictures ✨ NEW
│   ├── seed.js          # Sample data
│   ├── syncDatabase.js  # Schema sync ✨ NEW
│   └── server.js        # Main server
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── tracks/
    │   │   │   ├── TrackCard.jsx           # ✅ Updated
    │   │   │   ├── TrackEditModal.jsx      # ✨ NEW
    │   │   │   ├── ShareModal.jsx          # ✨ NEW
    │   │   │   └── TrackOptionsMenu.jsx    # ✨ NEW
    │   │   └── ...
    │   ├── pages/
    │   │   ├── Settings.jsx  # ✨ NEW
    │   │   └── ...
    │   ├── services/
    │   │   └── api.js        # ✅ Enhanced
    │   └── App.js            # ✅ Updated
    └── ...
```

---

## 🔌 API Endpoints

### User Management
```bash
GET    /api/users/:id          # Get user profile
PUT    /api/users/:id          # Update profile ✨ (with file upload)
DELETE /api/users/:id          # Delete user (admin)
```

### Track Management
```bash
GET    /api/tracks             # Get all tracks ✅ (now supports userId filter)
GET    /api/tracks/:id         # Get track by ID
POST   /api/tracks/upload      # Upload track
PUT    /api/tracks/:id         # Update track ✨ NEW
DELETE /api/tracks/:id         # Delete track ✅
```

### Social Features ✅ ALL FIXED
```bash
POST   /api/social/tracks/:trackId/like      # Like track
DELETE /api/social/tracks/:trackId/like      # Unlike track
POST   /api/social/tracks/:trackId/comments  # Add comment
DELETE /api/social/comments/:id              # Delete comment
POST   /api/social/users/:userId/follow      # Follow user
DELETE /api/social/users/:userId/unfollow    # Unfollow user
```

---

## 🎨 Component Usage

### TrackCard (Enhanced)
```jsx
import TrackCard from './components/tracks/TrackCard';

<TrackCard
  track={track}
  showArtist={true}
  onUpdate={(updated) => handleTrackUpdate(updated)}
  onDelete={(trackId) => handleTrackDelete(trackId)}
/>
```

### TrackEditModal
```jsx
import TrackEditModal from './components/tracks/TrackEditModal';

<TrackEditModal
  track={track}
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onUpdate={(updated) => console.log('Track updated:', updated)}
/>
```

### ShareModal
```jsx
import ShareModal from './components/tracks/ShareModal';

<ShareModal
  track={track}
  isOpen={showShare}
  onClose={() => setShowShare(false)}
/>
```

### TrackOptionsMenu
```jsx
import TrackOptionsMenu from './components/tracks/TrackOptionsMenu';

<TrackOptionsMenu
  track={track}
  onUpdate={handleUpdate}
  onDelete={handleDelete}
/>
```

---

## 🎯 Common Tasks

### Upload a Track (Creator)
1. Login as creator
2. Navigate to `/upload`
3. Fill form:
   - Title (required)
   - Audio file (required - MP3/WAV)
   - Cover image (optional)
   - Description (optional)
4. Click "Upload Track"

### Edit Your Profile
1. Click profile icon (top-right)
2. Select "Settings"
3. Upload profile picture
4. Add bio, location
5. Add social links
6. Click "Save Changes"

### Share a Track
1. Find any track
2. Hover to see options menu
3. Click three-dot menu
4. Click "Share"
5. Choose sharing method

### Edit Your Track
1. Go to Creator Dashboard
2. Find your track
3. Click three-dot menu
4. Click "Edit Track"
5. Update title/description
6. Click "Save Changes"

### Delete Your Track
1. Find your track
2. Click three-dot menu
3. Click "Delete Track"
4. Confirm deletion
5. Track removed from database

---

## 🔧 Troubleshooting

### "404 on /api/social/..."
**Fixed!** Restart backend server:
```bash
cd backend
npm start
```

### "Track not showing in Creator Dashboard"
**Fixed!** The dashboard now filters by userId.

### "Can't edit profile"
Run database sync:
```bash
cd backend
node syncDatabase.js
```

### "Music stops when navigating"
Architecture is correct. If issue persists:
1. Clear browser cache
2. Restart frontend
3. Check browser console for errors

### "Profile picture not uploading"
Check:
1. File size (max 5MB)
2. File type (JPG, PNG)
3. `backend/uploads/profiles/` directory exists

---

## 📊 User Roles

### Listener
- Browse tracks
- Like tracks
- Comment on tracks
- Create playlists
- Follow users
- Edit own profile

### Creator
- All Listener permissions +
- Upload tracks
- Edit own tracks
- Delete own tracks
- View analytics dashboard
- Download own tracks

### Admin
- All Creator permissions +
- Edit ANY track
- Delete ANY track
- Manage users
- View all analytics
- Access admin panel

---

## 🎨 UI Components

### Hover Effects
- **Track Cards**: Show play button + options menu
- **Buttons**: Slight scale animation
- **Links**: Underline on hover

### Colors
- **Primary Green**: `#1DB954` (Spotify green)
- **Background**: `#121212` (Dark)
- **Card Background**: `#181818` (Lighter dark)
- **Text**: `#FFFFFF` (White), `#B3B3B3` (Gray)

### Spacing
- Use Tailwind spacing: `p-4`, `m-6`, etc.
- Consistent spacing between sections

---

## 📝 Environment Variables

### Backend `.env`
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=soundwave
DB_USER=your_user
DB_PASSWORD=your_password

# Server
PORT=5001
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your_secret_key

# Storage
STORAGE_TYPE=local  # or 'minio' or 's3'
UPLOAD_DIR=./uploads
```

### Frontend `.env`
```bash
REACT_APP_API_URL=http://localhost:5001/api
```

---

## 🧪 Testing Scenarios

### Scenario 1: Complete User Flow
1. Register new account (creator)
2. Edit profile (add bio, picture)
3. Upload a track
4. View in Creator Dashboard
5. Edit track title
6. Share track on Twitter
7. Like another user's track
8. Comment on a track
9. Follow another creator

### Scenario 2: Admin Flow
1. Login as admin
2. View all tracks in admin panel
3. Edit another user's track
4. Delete inappropriate content
5. Ban a user (if implemented)

### Scenario 3: Social Flow
1. Login as listener
2. Browse tracks on home
3. Like 5 tracks
4. Add comments to tracks
5. Follow 3 creators
6. Create a playlist
7. Add tracks to playlist
8. Share playlist

---

## 📚 Documentation

- **Full Status**: `PROJECT_STATUS_2025_10_11.md`
- **Implementation Summary**: `IMPLEMENTATION_SUMMARY_OCT_11.md`
- **This Guide**: `QUICK_REFERENCE.md`

---

## 🆘 Need Help?

### Backend Issues
- Check `backend/server.js` console
- Verify database connection
- Check `.env` configuration

### Frontend Issues
- Open browser console (F12)
- Check Network tab for API errors
- Verify API URL in `.env`

### File Upload Issues
- Check upload directories exist
- Verify file permissions
- Check file size limits

---

## ✅ Feature Checklist

- [x] User authentication
- [x] Profile editing with pictures
- [x] Track upload
- [x] Track editing
- [x] Track deletion
- [x] Like tracks
- [x] Comment on tracks
- [x] Follow users
- [x] Share tracks
- [x] Creator dashboard
- [x] Three-dot menu
- [x] Modals (Edit, Share, Delete)
- [x] Music player
- [x] Search (basic)
- [x] Playlists (basic)
- [ ] Albums (backend ready)
- [ ] Queue (backend ready)
- [ ] History (backend ready)
- [ ] Real-time notifications
- [ ] Advanced search
- [ ] Mobile responsive
- [ ] PWA support

---

**Last Updated**: October 11, 2025
**Version**: 1.0
