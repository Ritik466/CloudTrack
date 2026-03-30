# CloudTrack - Assignment Management System

CloudTrack is a full-stack educational platform for assignment management with file uploads, user authentication, role-based access control, and AWS deployment support.

## Table of Contents

- Overview
- Features
- Architecture
- Technology Stack
- Database Schema
- Installation
- Configuration
- User Guide
- API Documentation
- File Structure
- Security Features
- Troubleshooting

## Overview

CloudTrack is designed for educational institutions to manage assignments, submissions, and grading. It supports three user roles: Teachers, Students, and Administrators.

### Key Capabilities

- Secure authentication with hashed passwords
- Assignment creation and management
- Student submissions with text and optional file attachments
- Teacher grading and feedback workflow
- Role-based access for different user types
- AWS-ready deployment with Docker and Terraform

## Features

### Student Features
- View assignments with due dates
- Submit text responses and file attachments
- Track submission status
- View grades and teacher feedback

### Teacher Features
- Create and manage assignments
- Review student submissions
- Download submitted files
- Grade assignments and provide feedback

### Admin Features
- View users, assignments, and submission statistics
- Monitor overall system activity

## Architecture

### Frontend
- React 18 with Vite
- React Router for navigation
- API-driven client architecture

### Backend
- Node.js with Express
- PostgreSQL for structured data
- Multer for uploads
- Optional Amazon S3 support for file storage

### Cloud Deployment
- Amazon EC2 for hosting
- Amazon ECR for Docker image storage
- Amazon VPC for networking
- Optional Amazon S3 for file storage
- Terraform for infrastructure provisioning
- Docker Compose for service orchestration on EC2

## Technology Stack

### Frontend
- `react`
- `react-router-dom`
- `vite`

### Backend
- `express`
- `pg`
- `bcrypt`
- `multer`
- `dotenv`
- `cors`
- `@aws-sdk/client-s3`

### Infrastructure / Cloud
- `Docker`
- `Docker Compose`
- `Terraform`
- `Amazon EC2`
- `Amazon ECR`
- `Amazon VPC`
- `Amazon S3` (optional)

## Database Schema

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

## Installation

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- npm

### Local Setup
```bash
git clone <repository-url>
cd CloudTrack
npm install
cd backend && npm install
cd ../frontend && npm install
```

### Database Setup
```bash
cd backend
cp .env.example .env
node setup-db.js
```

### Run Locally
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

Application URLs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

## Configuration

### Backend Environment Variables
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=simple_demo
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3001
```

### Optional Cloud Storage Variables
```env
AWS_REGION=ap-south-1
S3_BUCKET=your-bucket-name
```

### File Upload Configuration
- Max file size: 10MB
- Allowed types: images, PDFs, text files, office files, archives
- Local storage path: `backend/uploads/`
- Optional cloud storage: Amazon S3

## User Guide

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Teacher | arjun.panuily@cloudtrack.edu | teacher123 |
| Student | kartik.sharma@student.edu | student123 |
| Student | aryan.thapa@student.edu | student123 |
| Admin | admin@cloudtrack.edu | admin123 |

### Student Workflow
1. Log in with student credentials
2. View assignments
3. Submit text and optional file
4. Track review status and grades

### Teacher Workflow
1. Log in with teacher credentials
2. Create assignments
3. Review submissions
4. Download files
5. Grade and provide feedback

### Admin Workflow
1. Log in with admin credentials
2. View system overview and user data

## API Documentation

### POST /api/login
Authenticate a user.

### GET /api/assignments
Get all assignments.

### POST /api/assignments
Create a new assignment.

### DELETE /api/assignments/:id
Delete an assignment.

### POST /api/submissions
Submit assignment text and optional file.

### GET /api/submissions/assignment/:id
Get submissions for an assignment.

### GET /api/submissions/:id/download
Download an attached file.

### PATCH /api/submissions/:id/review
Save grade and feedback.

### GET /api/users
Get all users.

## File Structure

```text
CloudTrack/
|-- backend/
|   |-- db.js
|   |-- server.js
|   |-- schema.sql
|   |-- setup-db.js
|   |-- reset-db.js
|   |-- package.json
|   `-- uploads/
|-- frontend/
|   |-- src/
|   |-- package.json
|   `-- vite.config.js
|-- Infra/
|   |-- main.tf
|   |-- variables.tf
|   |-- outputs.tf
|   `-- terraform.tfvars
|-- docker-compose.yml
|-- docker-compose.ec2.yml
|-- docker-compose.rds.yml
|-- DOCUMENTATION.md
`-- DEPLOYMENT.md
```

## Security Features

- Password hashing with bcrypt
- Parameterized SQL queries
- Role-based access logic
- File type and size validation
- Optional IAM-based S3 access for uploads

## Troubleshooting

### Database Connection Issues
```bash
cd backend
node -e "const pool = require('./db'); pool.query('SELECT NOW()').then(console.log).finally(() => pool.end())"
```

### Upload Issues
- Check file size and file type
- Verify local uploads directory permissions
- If S3 is enabled, verify bucket name, region, and IAM permissions

### Docker / EC2 Deployment Issues
- Confirm containers are running with `docker compose ps`
- Check backend logs with `docker compose logs backend`
- Verify environment variables on EC2

## Deployment Notes

- Local deployment can use Docker Compose with local PostgreSQL
- EC2 deployment can use `docker-compose.ec2.yml`
- External PostgreSQL deployment can use `docker-compose.rds.yml`
- Terraform files in `Infra/` provision the AWS networking and compute resources
- Amazon S3 can be enabled for file storage through environment variables

*Last Updated: March 2026*
