-- Payment Gateway schema (D1 / SQLite)

-- Merchant = pemilik toko/website yang pakai gateway ini
CREATE TABLE IF NOT EXISTS merchants (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  api_key        TEXT UNIQUE NOT NULL,      -- dipakai merchant buat call /api/orders
  notify_url     TEXT,                      -- callback URL merchant (dipanggil pas order paid)
  callback_secret TEXT NOT NULL,            -- buat sign callback ke merchant (HMAC)
  created_at     INTEGER NOT NULL
);

-- Device = catcher di Redroid (APK notif + poller transaksi)
CREATE TABLE IF NOT EXISTS devices (
  id         TEXT PRIMARY KEY,
  label      TEXT,
  secret     TEXT NOT NULL,                 -- shared secret HMAC dengan APK
  last_seen  INTEGER,
  created_at INTEGER NOT NULL
);

-- Order = tagihan yang nunggu dibayar
CREATE TABLE IF NOT EXISTS orders (
  id            TEXT PRIMARY KEY,
  merchant_id   TEXT NOT NULL,
  reference     TEXT,                        -- ref order dari merchant (opsional)
  base_amount   INTEGER NOT NULL,            -- harga asli (rupiah)
  unique_amount INTEGER NOT NULL,            -- nominal unik yang harus dibayar
  status        TEXT NOT NULL DEFAULT 'pending', -- pending|paid|expired|cancelled
  expires_at    INTEGER NOT NULL,
  paid_at       INTEGER,
  paid_event_id TEXT,
  created_at    INTEGER NOT NULL,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id)
);

-- Index utama buat matching: cari order pending dgn nominal tertentu yg belum expired
CREATE INDEX IF NOT EXISTS idx_orders_match
  ON orders(status, unique_amount, expires_at);
CREATE INDEX IF NOT EXISTS idx_orders_merchant
  ON orders(merchant_id, created_at);

-- Event = notif/transaksi mentah dari device
CREATE TABLE IF NOT EXISTS events (
  id              TEXT PRIMARY KEY,          -- dedup key (hash konten) dari device
  device_id       TEXT NOT NULL,
  source          TEXT NOT NULL,             -- notification | transaction_scrape
  amount          INTEGER,
  sender          TEXT,                      -- nama pengirim kalau kebaca
  raw_text        TEXT,
  received_at     INTEGER NOT NULL,          -- waktu di device
  matched_order_id TEXT,
  status          TEXT NOT NULL DEFAULT 'unmatched', -- unmatched|matched|duplicate|ignored
  created_at      INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_events_amount
  ON events(amount, received_at);

-- Callback log = riwayat pemanggilan notify_url merchant
CREATE TABLE IF NOT EXISTS callbacks (
  id          TEXT PRIMARY KEY,
  order_id    TEXT NOT NULL,
  url         TEXT NOT NULL,
  attempt     INTEGER NOT NULL DEFAULT 1,
  status_code INTEGER,
  ok          INTEGER NOT NULL DEFAULT 0,
  response    TEXT,
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_callbacks_order ON callbacks(order_id);
