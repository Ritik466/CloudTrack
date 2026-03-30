-- Create database tables for Simple Demo

-- Users table (add password column)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('teacher', 'student', 'admin'))
);

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP NOT NULL,
    teacher_id VARCHAR(10) NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id VARCHAR(10) PRIMARY KEY,
    assignment_id VARCHAR(10) NOT NULL,
    student_id VARCHAR(10) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    text TEXT,
    submitted_at TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewed')),
    grade INTEGER,
    feedback TEXT,
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    file_size INTEGER,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(assignment_id, student_id)
);

-- Insert demo data
INSERT INTO users (id, name, email, password, role) VALUES
    ('t1', 'Arjun Panuily', 'arjun.panuily@cloudtrack.edu', '$2b$10$0guUhoREJ2PeKaJMkpxT7egonmlFJwN904jznGMw9KZMbR3/oZyui', 'teacher'),
    ('s1', 'Kartik Sharma', 'kartik.sharma@student.edu', '$2b$10$fyizIvUJf4kd2bLFhVjwouCU3Dfkrs.wma0.C6RDJWXWPuWg/SHsi', 'student'),
    ('s2', 'Aryan Thapa', 'aryan.thapa@student.edu', '$2b$10$fyizIvUJf4kd2bLFhVjwouCU3Dfkrs.wma0.C6RDJWXWPuWg/SHsi', 'student'),
    ('a1', 'Admin User', 'admin@cloudtrack.edu', '$2b$10$Bq76gOl3kvmKXXhmHPu2F.OLB/xHN9qLkKuzCWOBX0Qb0QmtzFXp6', 'admin'),
    ('t2', 'New Teacher', 'teacher@cloudtrack.edu', '$2b$10$0guUhoREJ2PeKaJMkpxT7egonmlFJwN904jznGMw9KZMbR3/oZyui', 'teacher')
ON CONFLICT (id) DO NOTHING;

INSERT INTO assignments (id, title, description, due_date, teacher_id) VALUES
    ('as1', 'Python Basics', 'Solve the basic Python exercises and submit your answers.', NOW() + INTERVAL '3 days', 't1'),
    ('as2', 'SQL Practice', 'Write queries for the given schema and questions.', NOW() + INTERVAL '6 days', 't1')
ON CONFLICT (id) DO NOTHING;

