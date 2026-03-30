const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { Readable } = require('stream')
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')
const pool = require('./db')

const app = express()
app.use(cors())
app.use(express.json())

const s3Bucket = process.env.S3_BUCKET
const s3Region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION
const useS3Storage = Boolean(s3Bucket && s3Region)
const s3Client = useS3Storage ? new S3Client({ region: s3Region }) : null

// Serve uploaded files - needed for file downloads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// File upload configuration
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads')
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // Generate unique filename to avoid conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})

const upload = multer({
  storage: useS3Storage ? multer.memoryStorage() : diskStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit - should be enough for most files
  fileFilter: (req, file, cb) => {
    // Accept common file types for educational content
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip|rar/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Only image, PDF, document, and archive files are allowed'))
    }
  }
})

async function uploadFile(file) {
  if (!file) return null

  if (useS3Storage) {
    const objectKey = `submissions/${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`
    await s3Client.send(new PutObjectCommand({
      Bucket: s3Bucket,
      Key: objectKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    }))

    return {
      fileName: file.originalname,
      filePath: objectKey,
      fileSize: file.size
    }
  }

  return {
    fileName: file.originalname,
    filePath: file.filename,
    fileSize: file.size
  }
}

// Routes
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if password is provided
    if (!password) {
      return res.status(400).json({ error: 'Please enter your password to log in' })
    }

    // Query database for user with matching email
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    )

    // Check if user exists
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password. Please try again' })
    }

    const user = result.rows[0]
    const passwordMatch = await bcrypt.compare(password, user.password)

    // Check if password is correct
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password. Please try again' })
    }

    // Remove password from response - don't want to send this back to client
    const { password: _, ...userWithoutPassword } = user
    res.json({ user: userWithoutPassword })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'An unexpected error occurred while logging in. Please try again later' })
  }
})

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id')
    res.json(result.rows)
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/assignments', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM assignments ORDER BY due_date'
    )
    res.json(result.rows)
  } catch (error) {
    console.error('Get assignments error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/assignments', async (req, res) => {
  try {
    const { title, description, dueDate, teacherId } = req.body

    if (!title || !description || !dueDate || !teacherId) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    // Generate a unique 10-character ID
    const id = 'as' + Math.random().toString(36).substring(2, 9)

    const result = await pool.query(
      `INSERT INTO assignments (id, title, description, due_date, teacher_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, title, description, dueDate, teacherId]
    )

    res.json(result.rows[0])
  } catch (error) {
    console.error('Create assignment error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.delete('/api/assignments/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'DELETE FROM assignments WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' })
    }

    res.json({ message: 'Assignment deleted successfully' })
  } catch (error) {
    console.error('Delete assignment error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/submissions', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM submissions ORDER BY submitted_at DESC'
    )
    res.json(result.rows)
  } catch (error) {
    console.error('Get submissions error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/submissions/assignment/:assignmentId', async (req, res) => {
  try {
    const { assignmentId } = req.params
    const result = await pool.query(
      'SELECT * FROM submissions WHERE assignment_id = $1 ORDER BY submitted_at DESC',
      [assignmentId]
    )
    res.json(result.rows)
  } catch (error) {
    console.error('Get assignment submissions error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/submissions/assignment/:assignmentId/student/:studentId', async (req, res) => {
  try {
    const { assignmentId, studentId } = req.params
    const result = await pool.query(
      'SELECT * FROM submissions WHERE assignment_id = $1 AND student_id = $2',
      [assignmentId, studentId]
    )
    res.json(result.rows[0] || null)
  } catch (error) {
    console.error('Get student submission error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/submissions', upload.single('file'), async (req, res) => {
  try {
    const { assignmentId, studentId, studentName, text } = req.body
    const now = new Date().toISOString()

    // Check if submission exists and update or insert
    const existingResult = await pool.query(
      'SELECT id FROM submissions WHERE assignment_id = $1 AND student_id = $2',
      [assignmentId, studentId]
    )

    let submission
    const fileData = req.file ? await uploadFile(req.file) : null

    if (existingResult.rows.length > 0) {
      // Update existing submission
      const result = await pool.query(
        `UPDATE submissions 
         SET text = $1, submitted_at = $2, status = 'submitted',
             file_name = COALESCE($3, file_name),
             file_path = COALESCE($4, file_path),
             file_size = COALESCE($5, file_size)
         WHERE assignment_id = $6 AND student_id = $7 
         RETURNING *`,
        [text, now, fileData?.fileName, fileData?.filePath, fileData?.fileSize, assignmentId, studentId]
      )
      submission = result.rows[0]
    } else {
      // Insert new submission
      const submissionId = 'sub' + Math.random().toString(36).substring(2, 9)
      const result = await pool.query(
        `INSERT INTO submissions (id, assignment_id, student_id, student_name, text, submitted_at, status, file_name, file_path, file_size)
         VALUES ($1, $2, $3, $4, $5, $6, 'submitted', $7, $8, $9)
         RETURNING *`,
        [submissionId, assignmentId, studentId, studentName, text, now, fileData?.fileName, fileData?.filePath, fileData?.fileSize]
      )
      submission = result.rows[0]
    }

    res.json(submission)
  } catch (error) {
    console.error('Create/update submission error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.patch('/api/submissions/:id/review', async (req, res) => {
  try {
    const { id } = req.params
    const { grade, feedback } = req.body

    const result = await pool.query(
      `UPDATE submissions 
       SET status = 'reviewed', grade = $1, feedback = $2 
       WHERE id = $3 
       RETURNING *`,
      [grade, feedback, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Review submission error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.delete('/api/data/reset', async (req, res) => {
  try {
    await pool.query('DELETE FROM submissions')
    res.json({ message: 'Demo data reset' })
  } catch (error) {
    console.error('Reset data error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// File download endpoint
app.get('/api/submissions/:id/download', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'SELECT file_name, file_path FROM submissions WHERE id = $1 AND file_path IS NOT NULL',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' })
    }

    const { file_name, file_path } = result.rows[0]
    if (useS3Storage) {
      const object = await s3Client.send(new GetObjectCommand({
        Bucket: s3Bucket,
        Key: file_path
      }))

      res.setHeader('Content-Disposition', `attachment; filename="${file_name}"`)

      if (object.ContentType) {
        res.setHeader('Content-Type', object.ContentType)
      }

      Readable.from(object.Body).pipe(res)
      return
    }

    const filePath = path.join(__dirname, 'uploads', file_path)

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on server' })
    }

    res.download(filePath, file_name)
  } catch (error) {
    console.error('Download file error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Simple Demo backend running on http://localhost:${PORT}`)
})
