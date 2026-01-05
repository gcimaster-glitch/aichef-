-- Add authentication fields to households table
ALTER TABLE households ADD COLUMN email TEXT;
ALTER TABLE households ADD COLUMN password_hash TEXT;

-- Create unique index on email
CREATE UNIQUE INDEX IF NOT EXISTS idx_households_email ON households(email);
