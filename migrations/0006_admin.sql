-- Admin flag + status merchant + last_seen device
ALTER TABLE merchants ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0;
ALTER TABLE merchants ADD COLUMN active INTEGER NOT NULL DEFAULT 1;
ALTER TABLE merchants ADD COLUMN last_seen INTEGER;

-- Jadikan 'ahmad' admin
UPDATE merchants SET is_admin = 1 WHERE username = 'ahmad';
