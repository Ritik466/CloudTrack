# CloudTrack - Simple Demo Application

A comprehensive educational platform for assignment management with file uploads, user authentication, and role-based access control.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Database Schema](#database-schema)
- [Installation](#installation)
- [Configuration](#configuration)
- [User Guide](#user-guide)
- [API Documentation](#api-documentation)
- [File Structure](#file-structure)
- [Security Features](#security-features)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

CloudTrack is a full-stack web application designed for educational institutions to manage assignments, submissions, and grading. It supports three user roles: Teachers, Students, and Administrators, each with specific functionalities.

### Key Capabilities

- **Secure Authentication**: Password-based login with bcrypt hashing
- **Assignment Management**: Create, view, and delete assignments
- **File Uploads**: Students can submit files with assignments
- **Grading System**: Teachers can review, grade, and provide feedback
- **Status Tracking**: Real-time status indicators for assignments
- **Role-Based Access**: Different interfaces for teachers, students, and admins

## ✨ Features

### 🎓 Student Features
- View all assignments with due dates
- Submit text responses and/or file attachments
- Track submission status (submitted, reviewed, overdue)
- View grades and teacher feedback
- Dashboard with progress metrics

### 👨‍🏫 Teacher Features
- Create and manage assignments
- Set due dates and descriptions
- Review student submissions
- Download submitted files
- Grade assignments and provide feedback
- View assignment statistics

### 👨‍💼 Admin Features
- Overview of all users and assignments
- Monitor submission statistics
- System-wide data management

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with Vite for fast development
- **Routing**: React Router for navigation
- **State Management**: Custom store with API integration
- **Styling**: CSS with utility classes
- **File Upload**: FormData API for multipart submissions

### Backend (Node.js + Express)
- **Framework**: Express.js with async/await
- **Database**: PostgreSQL with connection pooling
- **Authentication**: bcrypt for password hashing
- **File Handling**: Multer for file uploads
- **API**: RESTful endpoints with proper error handling

### Database (PostgreSQL)
- **Users**: Authentication and role management
- **Assignments**: Assignment creation and management
- **Submissions**: Student submissions with file attachments
- **Foreign Keys**: Proper relational constraints

## 🛠️ Technology Stack

### Frontend Dependencies
- `react`: UI framework
- `react-router-dom`: Client-side routing
- `vite`: Build tool and dev server

### Backend Dependencies
- `express`: Web framework
- `pg`: PostgreSQL client
- `bcrypt`: Password hashing
- `multer`: File upload handling
- `dotenv`: Environment variable management
- `cors`: Cross-origin resource sharing
- `nodemon`: Development auto-restart

### Database
- PostgreSQL 12+ with JSON support

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('teacher', 'student', 'admin'))
);
```

### Assignments Table
```sql
CREATE TABLE assignments (
    id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP NOT NULL,
    teacher_id VARCHAR(10) NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES users(id)
);
```

### Submissions Table
```sql
CREATE TABLE submissions (
    id VARCHAR(10) PRIMARY KEY,
    assignment_id VARCHAR(10) NOT NULL,
    student_id VARCHAR(10) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    text TEXT,
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    file_size INTEGER,
    submitted_at TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'submitted',
    grade INTEGER,
    feedback TEXT,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id),
    FOREIGN KEY (student_id) REFERENCES users(id),
    UNIQUE(assignment_id, student_id)
);
```

## 🚀 Installation

### Prerequisites
- Node.js 16+ 
- PostgreSQL 12+
- npm or yarn

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd simple-demo

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Database Setup

```bash
# Create PostgreSQL database
createdb simple_demo

# Set up environment variables
cd backend
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=simple_demo
# DB_USER=postgres
# DB_PASSWORD=your_password

# Run database setup
npm run db:setup
```

### Step 3: Start the Application

```bash
# Start backend server (Terminal 1)
cd backend
npm run dev

# Start frontend server (Terminal 2)
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5174
- Backend API: http://localhost:3001

## ⚙️ Configuration

### Environment Variables (Backend)
Create a `.env` file in the `backend` directory:

```env
# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=simple_demo
DB_USER=postgres
DB_PASSWORD=your_password

# Server Configuration
PORT=3001
```

### File Upload Configuration
- **Max File Size**: 10MB
- **Allowed Types**: Images, PDFs, Documents, Archives
- **Storage Location**: `backend/uploads/`
- **Unique Filenames**: Timestamp + random string

## 👥 User Guide

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Teacher | arjun.panuily@cloudtrack.edu | teacher123 |
| Student | kartik.sharma@student.edu | student123 |
| Student | aryan.thapa@student.edu | student123 |
| Admin | admin@cloudtrack.edu | admin123 |

### Student Workflow

1. **Login**: Use student credentials
2. **View Assignments**: See all assignments with due dates and status
3. **Submit Work**: 
   - Enter text response
   - Attach file (optional)
   - Submit assignment
4. **Track Progress**: View submission status, grades, and feedback

### Teacher Workflow

1. **Login**: Use teacher credentials
2. **Create Assignments**: 
   - Click "+ New Assignment"
   - Fill title, description, due date
   - Create assignment
3. **Review Submissions**:
   - Select assignment
   - View student submissions
   - Download attached files
   - Grade and provide feedback
4. **Manage Assignments**: Delete assignments if needed

### Admin Workflow

1. **Login**: Use admin credentials
2. **Monitor**: View system statistics
3. **Manage**: Overview of users and assignments

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/login
Authenticate user with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "s1",
    "name": "Student Name",
    "email": "student@example.com",
    "role": "student"
  }
}
```

### Assignment Endpoints

#### GET /api/assignments
Get all assignments.

**Response:**
```json
[
  {
    "id": "as1",
    "title": "Assignment Title",
    "description": "Assignment description",
    "due_date": "2024-01-15T23:59:59.000Z",
    "teacher_id": "t1"
  }
]
```

#### POST /api/assignments
Create new assignment (teacher only).

**Request:**
```json
{
  "title": "New Assignment",
  "description": "Assignment description",
  "dueDate": "2024-01-15T23:59:59.000Z",
  "teacherId": "t1"
}
```

#### DELETE /api/assignments/:id
Delete assignment (teacher only).

### Submission Endpoints

#### POST /api/submissions
Submit assignment with optional file.

**Request (multipart/form-data):**
- `assignmentId`: Assignment ID
- `studentId`: Student ID
- `studentName`: Student name
- `text`: Submission text
- `file`: File attachment (optional)

#### GET /api/submissions/assignment/:id
Get all submissions for an assignment.

#### GET /api/submissions/:id/download
Download attached file.

#### PATCH /api/submissions/:id/review
Grade and provide feedback (teacher only).

**Request:**
```json
{
  "grade": 85,
  "feedback": "Good work!"
}
```

### User Endpoints

#### GET /api/users
Get all users (admin only).

## 📁 File Structure

```
simple-demo/
├── README.md
├── package.json                 # Root package.json
├── DOCUMENTATION.md             # This file
├── backend/
│   ├── package.json
│   ├── server.js                # Main server file
│   ├── db.js                    # Database connection
│   ├── schema.sql               # Database schema
│   ├── reset-db.js              # Database reset script
│   ├── apply-schema-update.js   # Schema update script
│   ├── .env.example             # Environment template
│   └── uploads/                 # File upload directory
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx              # React entry point
        ├── App.jsx               # Main App component
        ├── api.js                # API client
        ├── store.js              # State management
        ├── styles.css            # Global styles
        └── pages/
            ├── SimpleLogin.jsx   # Login page
            ├── Layout.jsx        # Layout component
            ├── Teacher.jsx       # Teacher interface
            ├── Student.jsx       # Student interface
            └── Admin.jsx         # Admin interface
```

## 🔒 Security Features

### Authentication
- **Password Hashing**: bcrypt with salt rounds (10)
- **Session Management**: JWT-like localStorage approach
- **Role-Based Access**: Server-side role verification

### File Upload Security
- **File Type Validation**: Only allowed file types accepted
- **Size Limits**: 10MB maximum file size
- **Unique Filenames**: Prevents directory traversal
- **Secure Storage**: Files stored outside web root

### Data Protection
- **SQL Injection Prevention**: Parameterized queries
- **XSS Prevention**: Input sanitization
- **CORS Configuration**: Proper cross-origin setup

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check PostgreSQL is running
pg_isready

# Test database connection
cd backend
node -e "const pool = require('./db'); pool.query('SELECT NOW()').then(console.log)"
```

#### File Upload Issues
- Check file size (max 10MB)
- Verify file type is allowed
- Ensure uploads directory exists and is writable

#### Assignment Creation Errors
- Check teacher role authentication
- Verify database schema is up to date
- Check assignment ID length (max 10 characters)

#### Submission Not Showing in Teacher Interface
- Verify student submission was successful
- Check assignment ID matches
- Refresh teacher interface

### Database Reset

If you need to reset the database:

```bash
cd backend
node reset-db.js
```

### Schema Updates

For database schema changes:

```bash
cd backend
node apply-schema-update.js
```

### Development Tips

1. **Backend Debugging**: Use `console.log` for API debugging
2. **Frontend Debugging**: Use browser dev tools and React DevTools
3. **Database Queries**: Use `psql` for direct database access
4. **File Uploads**: Check `backend/uploads/` directory

## 🚀 Deployment Notes

### Production Considerations
- Use HTTPS for secure file uploads
- Implement proper session management
- Add rate limiting for API endpoints
- Set up database backups
- Configure file cleanup for old uploads

### Environment Variables
Ensure all sensitive data is in environment variables, not hardcoded.

### Database Security
- Use strong database passwords
- Restrict database user permissions
- Enable SSL for database connections

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Verify environment configuration
4. Check browser console for errors

---

*Last Updated: March 2026*
