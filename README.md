# GatePay

Payment gateway ringan buat **terima pembayaran DANA** (dan e-wallet lain) via **deteksi notifikasi**, tanpa API resmi merchant.

Cocok buat toko kecil / warung / SaaS yang mau otomasi konfirmasi pembayaran tapi belum bisa akses DANA Open API (yang butuh onboarding enterprise).

```
HP Android (DANA Bisnis + GatePay Catcher APK)
   │  notif "Anda menerima Rp X"
   │  → parse nominal → POST webhook (HMAC-signed)
   ▼
Cloudflare Worker (otak: API order + matching engine + D1 + dashboard)
   │  cocokin nominal unik ke order pending
   ▼
Order ditandai PAID → callback ke merchant (notify_url)
```

## Cara kerja

1. Merchant bikin order lewat API → dapat **nominal unik** (mis. Rp10.000 → **Rp10.237**).
2. Pembeli transfer DANA sejumlah nominal unik itu.
3. HP penerima dapat notif DANA → **GatePay Catcher** (APK) nangkep, parse nominal, kirim ke Worker (ditandatangani HMAC).
4. Worker cocokin nominal ke order pending yang belum expired → tandai **PAID** → panggil `notify_url` merchant.

Nominal unik = kunci matching. Tiap order pending dijamin punya nominal beda, jadi nggak ketuker.

---

## Struktur

```
src/         Worker code (Hono + D1)
migrations/  Schema D1
wrangler.jsonc  Config Worker
android/    Source APK GatePay Catcher (NotificationListenerService)
releases/   gatepay-catcher.apk (siap install)
docs/       Dokumentasi tambahan
```

---

## Setup

### 1. Deploy Worker ke Cloudflare

Butuh akun Cloudflare + [wrangler](https://developers.cloudflare.com/workers/wrangler/).

```bash
# (di root repo)
npm install

# Bikin D1 database (sekali aja)
npx wrangler d1 create paygate
# → copy database_id yang muncul, tempel ke wrangler.jsonc (ganti REPLACE_AFTER_CREATE)

# Init schema + seed
npx wrangler d1 execute paygate --remote --file=./migrations/0001_init.sql
npx wrangler d1 execute paygate --remote --file=./migrations/0002_seed.sql

# Deploy
npx wrangler deploy
```

Worker jalan di `https://paygate.<subdomain>.workers.dev`.

#### Auto-deploy via GitHub Actions

Repo ini udah ada workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Tinggal:

1. Buat **Cloudflare API Token** di [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens) (template "Edit Cloudflare Workers").
2. Tambah ke GitHub repo: **Settings → Secrets and variables → Actions → New secret**, nama `CLOUDFLARE_API_TOKEN`.
3. Setiap push ke `main` yang nyentuh `worker/` → auto-deploy.

> Catatan: `wrangler d1 create` + isi `database_id` tetap manual sekali di awal.

### 2. Ganti secret (WAJIB sebelum produksi)

Edit `worker/migrations/0002_seed.sql`, ganti:
- `api_key` merchant (`sk_demo_...`)
- `callback_secret` merchant
- `secret` device (`devsecret_...`)

Atau update lewat SQL setelah deploy. Secret device harus sama dengan yang diisi di APK.

### 3. Install APK ke HP

- Copy [`releases/gatepay-catcher.apk`](releases/gatepay-catcher.apk) ke HP → tap → install (izinkan "sumber tidak dikenal").
- Atau via ADB: `adb install gatepay-catcher.apk`

Buka app **GatePay Catcher**, isi:
- **Server URL** → URL Worker kamu (`https://paygate.xxx.workers.dev`)
- **Device ID** → `dev_redroid1` (atau sesuai seed)
- **Device Secret** → sama persis dengan yang di DB
- **Target Packages** → `id.dana` (+ paket DANA Bisnis kalau beda)

Lalu:
1. **Simpan Konfigurasi**
2. **Buka Setelan Notification Access** → aktifkan **GatePay Catcher**
3. **Kirim Test Event** → cek muncul di dashboard Worker
4. Pastikan DANA/DANA Bisnis kirim notif normal (jangan di-silence)

---

## API

Semua endpoint merchant butuh header `x-api-key`.

### Bikin order

```bash
curl -X POST https://paygate.xxx.workers.dev/api/orders \
  -H "x-api-key: sk_xxx" \
  -H "content-type: application/json" \
  -d '{"base_amount": 10000, "reference": "INV-001", "ttl_seconds": 900}'
```

Response:
```json
{
  "id": "ord_xxx",
  "status": "pending",
  "base_amount": 10000,
  "unique_amount": 10237,
  "unique_suffix": 237,
  "expires_at": 1784351204,
  "expires_in": 900
}
```

Suruh pembeli transfer **`unique_amount`** (Rp10.237), bukan base.

### Cek status order

```bash
curl https://paygate.xxx.workers.dev/api/orders/ord_xxx -H "x-api-key: sk_xxx"
```

### Cancel order

```bash
curl -X POST https://paygate.xxx.workers.dev/api/orders/ord_xxx/cancel -H "x-api-key: sk_xxx"
```

### Callback ke merchant (order paid)

Kalau merchant punya `notify_url`, Worker POST ke situ pas order paid:
```json
{ "event": "order.paid", "order_id": "ord_xxx", "reference": "INV-001",
  "base_amount": 10000, "unique_amount": 10237, "paid_at": 1784351000 }
```
Header `x-signature` = HMAC-SHA256(body, callback_secret). Verifikasi di sisi merchant.

### Dashboard

`https://paygate.xxx.workers.dev/dashboard` — orders, events, stats live.

---

## Catatan penting

- **Nominal unik itu bukti lemah** dibanding webhook resmi. Notif bisa telat/hilang/berubah format. Buat volume serius, pertimbangkan rekonsiliasi tambahan (baca riwayat transaksi in-app) atau DANA Open API resmi.
- **Emulator (Redroid/Waydroid) x86 nggak jalan** buat DANA: native security lib DANA (arm64) crash pas ditranslasi ke x86 (houdini OOM / ndk_translation abort). **Wajib pakai HP Android fisik** (ARM asli) atau server ARM.
- Validasi minimal di server udah ada: signature HMAC, dedup event, cek nominal persis, cek order belum expired.

## Lisensi

Private. Buat penggunaan internal.
