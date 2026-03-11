# GitHub Deployment Guide

## 🚀 Deploy to GitHub

### Step 1: Initialize Git Repository
```bash
cd simple-demo
git init
git add .
git commit -m "Initial commit: CloudTrack assignment management system"
```

### Step 2: Create GitHub Repository
1. Go to https://github.com
2. Click "New repository"
3. Name it: `cloudtrack-assignment-system`
4. Description: "A simple web app for schools to manage assignments and student submissions"
5. Make it Public
6. Don't initialize with README (we already have one)

### Step 3: Push to GitHub
```bash
git remote add origin https://github.com/yourusername/cloudtrack-assignment-system.git
git branch -M main
git push -u origin main
```

### Step 4: Deploy to Netlify (Frontend)

#### Option A: Netlify (Recommended)
1. Go to https://netlify.com
2. Sign up/login with GitHub
3. Click "New site from Git"
4. Select your repository
5. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
6. Click "Deploy site"

#### Option B: Vercel
1. Go to https://vercel.com
2. Sign up/login with GitHub
3. Click "New Project"
4. Select your repository
5. Framework: `Vite`
6. Root directory: `frontend`
7. Click "Deploy"

### Step 5: Deploy Backend (Optional)

#### Option A: Railway
1. Go to https://railway.app
2. Sign up/login with GitHub
3. Click "New Project"
4. Select your repository
5. Set root directory: `backend`
6. Environment variables:
   - `DB_HOST`: Your database host
   - `DB_PORT`: 5432
   - `DB_NAME`: Your database name
   - `DB_USER`: Your database user
   - `DB_PASSWORD`: Your database password
7. Click "Deploy"

#### Option B: Heroku
1. Go to https://heroku.com
2. Sign up/login
3. Click "New App"
4. Connect GitHub repository
5. Set root directory: `backend`
6. Add database addon (PostgreSQL)
7. Configure environment variables
8. Deploy

### Step 6: Update Frontend API URL

After backend deployment, update the API URL in `frontend/src/api.js`:

```javascript
const API_BASE = 'https://your-backend-url.railway.app' // or your deployed URL
```

### Step 7: Test Deployment

1. Visit your frontend URL
2. Try logging in with demo accounts
3. Test assignment creation and submission
4. Verify file uploads work

## 🔧 Important Notes

### Environment Variables
Make sure to set these in your hosting platform:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`

### File Uploads
For production, you might want to use cloud storage instead of local files:
- AWS S3
- Cloudinary
- Firebase Storage

### Database
For production database:
- Railway PostgreSQL
- Heroku Postgres
- Supabase
- PlanetScale

## 📋 Pre-Deployment Checklist

- [ ] Update API_BASE in `frontend/src/api.js`
- [ ] Set environment variables
- [ ] Test database connection
- [ ] Verify file upload permissions
- [ ] Check CORS settings
- [ ] Test all user roles

## 🎯 Live Demo

Once deployed, your app will be available at:
- Frontend: https://your-app-name.netlify.app
- Backend API: https://your-app-name.railway.app

---

**Good luck with your deployment!** 🚀
