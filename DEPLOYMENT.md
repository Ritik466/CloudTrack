# How to deploy my project

## Deploy to GitHub

### Step 1: Git setup
```bash
cd simple-demo
git init
git add .
git commit -m "First version of my assignment app"
```

### Step 2: Create GitHub repository
1. Go to https://github.com
2. Click "New repository"
3. Name it: `CloudTrack`
4. Description: `My assignment management system for schools`
5. Make it Public
6. Don't initialize with README

### Step 3: Push to GitHub
```bash
git remote add origin https://github.com/Ritik466/CloudTrack.git
git branch -M main
git push -u origin main
```

## Deploy the frontend

### Option 1: Netlify (easiest)
1. Go to https://netlify.com
2. Sign up/login with GitHub
3. Click "New site from Git"
4. Select your repository
5. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
6. Click "Deploy site"

### Option 2: Vercel
1. Go to https://vercel.com
2. Sign up/login with GitHub
3. Click "New Project"
4. Select your repository
5. Framework: `Vite`
6. Root directory: `frontend`
7. Click "Deploy"

## Deploy the backend

### Option 1: Railway
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

### Option 2: Heroku
1. Go to https://heroku.com
2. Sign up/login
3. Click "New App"
4. Connect GitHub repository
5. Set root directory: `backend`
6. Add database addon
7. Configure environment variables
8. Deploy

## After deployment

1. Update API URL in `frontend/src/api.js`
2. Test everything works
3. Share your live app!

## Important notes

### Environment variables
Make sure to set these in your hosting:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`

### File uploads
For production, you might want cloud storage instead of local files.

### Database
For production database, consider:
- Railway PostgreSQL
- Heroku Postgres
- Supabase

## Checklist before deploying

- [ ] Update API_BASE in frontend
- [ ] Set environment variables
- [ ] Test database connection
- [ ] Check file upload permissions
- [ ] Test all user roles
- [ ] Make sure CORS is working

---

Good luck with deployment!
