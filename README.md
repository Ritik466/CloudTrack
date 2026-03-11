# CloudTrack - Assignment Management System

A simple web app for schools to manage assignments and student submissions.

## Quick Start

### What you need
- Node.js 16+
- PostgreSQL 12+
- npm

### Setup

```bash
# Install everything
npm run install:all

# Database setup
cd backend
cp .env.example .env
# Edit .env with your database info
npm run db:setup

# Start the app
npm run dev
```

Open http://localhost:5174 for the frontend and http://localhost:3001 for the backend API.

### Login Accounts

| Role | Email | Password |
|------|-------|----------|
| Teacher | arjun.panuily@cloudtrack.edu | teacher123 |
| Student | kartik.sharma@student.edu | student123 |
| Student | aryan.thapa@student.edu | student123 |
| Admin | admin@cloudtrack.edu | admin123 |

## What it does

### Students can:
- See all their assignments
- Submit homework with text or files
- Check if their work was reviewed
- See grades and feedback

### Teachers can:
- Create new assignments
- Review student work
- Download submitted files
- Give grades and feedback

### Admins can:
- See overview of everything
- Check system stats

## Tech Stuff

- **Frontend**: React + Vite
- **Backend**: Node.js + Express + PostgreSQL
- **Database**: PostgreSQL with proper tables
- **Files**: Secure upload system

## Project Structure

```
simple-demo/
├── backend/          # Server stuff
│   ├── server.js     # Main server file
│   ├── db.js         # Database connection
│   └── uploads/      # File storage
└── frontend/         # React app
    └── src/
        ├── pages/     # React components
        └── api.js     # API calls
```

## Setup Details

Create `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=simple_demo
DB_USER=postgres
DB_PASSWORD=your_password
```

## More Info

Check out [DOCUMENTATION.md](./DOCUMENTATION.md) for detailed info about the API and how everything works.

## Main Features

- **Secure Login**: Password-based with proper hashing
- **File Uploads**: Students can submit files (max 10MB)
- **Status Tracking**: See if assignments are submitted/reviewed/overdue
- **Different Roles**: Separate interfaces for teachers, students, and admins
- **Real Database**: PostgreSQL for persistent data

---

*A simple but functional assignment management system for schools*
