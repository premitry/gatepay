-- Multi-tenant: akun username/password + device per merchant
ALTER TABLE merchants ADD COLUMN username TEXT;
ALTER TABLE merchants ADD COLUMN password_hash TEXT;
ALTER TABLE merchants ADD COLUMN password_salt TEXT;
ALTER TABLE merchants ADD COLUMN device_id TEXT;
ALTER TABLE merchants ADD COLUMN device_secret TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_merchants_username ON merchants(username);
CREATE UNIQUE INDEX IF NOT EXISTS idx_merchants_deviceid ON merchants(device_id);

-- Event dikaitkan ke merchant (device pemilik)
ALTER TABLE events ADD COLUMN merchant_id TEXT;
CREATE INDEX IF NOT EXISTS idx_events_merchant ON events(merchant_id, created_at);

-- Migrasi demo merchant biar HP existing tetap jalan (device dev_redroid1)
UPDATE merchants SET device_id='dev_redroid1', device_secret='gpdev7h3n9k2p5m8' WHERE id='mch_demo' AND device_id IS NULL;
