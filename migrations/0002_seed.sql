-- Seed data awal: 1 merchant demo + 1 device (Redroid catcher)
-- Ganti secret di produksi! Ini cuma buat testing.

INSERT OR IGNORE INTO merchants (id, name, api_key, notify_url, callback_secret, created_at)
VALUES (
  'mch_demo',
  'Demo Merchant',
  'sk_demo_CHANGE_ME_1234567890',
  NULL,
  'cbsecret_demo_CHANGE_ME',
  strftime('%s','now')
);

INSERT OR IGNORE INTO devices (id, label, secret, last_seen, created_at)
VALUES (
  'dev_redroid1',
  'Redroid DANA Catcher #1',
  'devsecret_CHANGE_ME_redroid1',
  NULL,
  strftime('%s','now')
);
