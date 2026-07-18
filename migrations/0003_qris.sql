-- Simpan QRIS statis merchant (buat generate QRIS dinamis per order)
ALTER TABLE merchants ADD COLUMN qris_static TEXT;
ALTER TABLE merchants ADD COLUMN qris_merchant_name TEXT;
