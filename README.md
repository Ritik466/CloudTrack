# CloudTrack - Assignment Management App

A web app I built for managing school assignments and student submissions.

## What this does

Basically it's a simple system where:
- Teachers can create assignments
- Students can submit work (text + files)
- Teachers can review and grade stuff
- Admins can see everything

## Quick Start

### What you need
- Node.js (probably 16+ should work)
- PostgreSQL
- npm

### Setup steps

```bash
# Install dependencies
npm run install:all

# Database stuff
cd backend
cp .env.example .env
# Put your database details in .env
npm run db:setup

# Start it up
npm run dev
```

Go to http://localhost:5174 for the app and http://localhost:3001 for the API.

### Login details

| Role | Email | Password |
|------|-------|----------|
| Teacher | arjun.panuily@cloudtrack.edu | teacher123 |
| Student | kartik.sharma@student.edu | student123 |
| Student | aryan.thapa@student.edu | student123 |
| Admin | admin@cloudtrack.edu | admin123 |

## How it works

### Students
- See their assignments
- Submit homework (write stuff or attach files)
- Check if teacher reviewed it
- See grades

### Teachers  
- Create new assignments
- Set due dates
- Review what students submitted
- Download files if they attached any
- Give grades and feedback

### Admins
- See overview of everything
- Check stats

## Tech stuff I used

- Frontend: React with Vite (pretty fast)
- Backend: Node.js + Express (simple but works)
- Database: PostgreSQL (good for this kind of data)
- File uploads: Multer (handles the file stuff)
- Auth: bcrypt for passwords (secure)

## Project structure

```
simple-demo/
├── backend/          # Server code
│   ├── server.js     # Main server file
│   ├── db.js         # Database connection
│   └── uploads/      # Where files go
└── frontend/         # React app
    └── src/
        ├── pages/     # React pages
        └── api.js     # API calls
```

## Database setup

Create a `.env` file in the backend folder:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=simple_demo
DB_USER=postgres
DB_PASSWORD=your_password_here
```

## Features

- Login system with passwords (hashed properly)
- File uploads - students can submit documents/images
- Status tracking - shows if assignments are overdue, submitted, reviewed
- Different views for different user types
- Everything saved in database (won't disappear if server restarts)

## More info

Check out [DOCUMENTATION.md](./DOCUMENTATION.md) if you want the detailed technical stuff.

---

*A simple assignment management system that actually works*
