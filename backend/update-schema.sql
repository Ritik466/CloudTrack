-- Add file attachment support to submissions table
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS file_name VARCHAR(255);
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS file_path VARCHAR(500);
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS file_size INTEGER;
