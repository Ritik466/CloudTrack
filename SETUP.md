# Quick Setup Guide

## 🚀 One-Command Setup

### Prerequisites
- Node.js 16+
- PostgreSQL 12+

### Step 1: Database Setup
```sql
CREATE DATABASE simple_demo;
```

### Step 2: Application Setup
```bash
# Install all dependencies
npm run install:all

# Configure database
cd backend
cp .env.example .env
# Edit .env with your database credentials

# Setup database schema
npm run db:setup

# Start application
npm run dev
```

### Step 3: Access Application
- **Frontend**: http://localhost:5174
- **Backend**: http://localhost:3001

## 🔑 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Teacher | arjun.panuily@cloudtrack.edu | teacher123 |
| Student | kartik.sharma@student.edu | student123 |
| Admin | admin@cloudtrack.edu | admin123 |

## ✅ Verification

1. **Backend**: Check http://localhost:3001 - should see "Simple Demo backend running"
2. **Frontend**: Check http://localhost:5174 - should see login page
3. **Database**: Run `cd backend && node test-db.js` to verify connection

## 🐛 Common Issues

### Database Connection Error
- Check PostgreSQL is running
- Verify .env credentials
- Ensure database `simple_demo` exists

### Port Already in Use
- Change PORT in backend/.env
- Kill existing process: `taskkill /PID <pid> /F` (Windows)

### File Upload Not Working
- Ensure `backend/uploads/` directory exists
- Check file permissions
- Verify file size < 10MB

---

**Need help? See [DOCUMENTATION.md](./DOCUMENTATION.md) for detailed guide.**
