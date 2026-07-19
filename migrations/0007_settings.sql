-- Site settings (favicon, nama app, theme color, PWA) — key/value.
-- Catatan: tabel ini juga dibuat otomatis saat runtime (CREATE TABLE IF NOT EXISTS)
-- jadi live DB nggak wajib apply migration ini manual.
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT
);
