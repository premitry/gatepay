-- Fee % configurable + panjang kode unik (digit)
ALTER TABLE merchants ADD COLUMN fee_percent REAL NOT NULL DEFAULT 0;
ALTER TABLE merchants ADD COLUMN unique_digits INTEGER NOT NULL DEFAULT 2;

-- Catat rincian di order
ALTER TABLE orders ADD COLUMN fee_amount INTEGER NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN fee_percent REAL NOT NULL DEFAULT 0;
