import { Hono } from 'hono';
import { renderDashboard } from './dashboard.js';
import { makeDynamic, isValidQris, qrisInfo } from './qris.js';
import { renderLanding } from './pages/landing.js';
import { renderDocs } from './pages/docs.js';
import { renderPrivacy } from './pages/privacy.js';
import { renderCheckout } from './pages/checkout.js';
import { renderAdmin } from './pages/admin.js';

const app = new Hono();

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
const now = () => Math.floor(Date.now() / 1000);

function hex(nbytes) {
  const b = crypto.getRandomValues(new Uint8Array(nbytes));
  return [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

function rid(prefix) {
  return `${prefix}_${hex(12)}`;
}

const enc = new TextEncoder();

// ── Password hashing (PBKDF2-SHA256 via Web Crypto) ──
async function hashPassword(password, salt) {
  salt = salt || hex(16);
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    256,
  );
  const hashHex = [...new Uint8Array(bits)].map((x) => x.toString(16).padStart(2, '0')).join('');
  return { salt, hash: hashHex };
}

async function verifyPassword(password, salt, expectedHash) {
  const { hash } = await hashPassword(password, salt);
  return safeEqual(hash, expectedHash);
}

async function hmacHex(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return [...new Uint8Array(sig)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

// Timing-safe hex compare
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function json(c, obj, status = 200) {
  return c.json(obj, status);
}

// ─────────────────────────────────────────────────────────
// Site settings (favicon, nama app, theme, PWA) — key/value di D1
// ─────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  site_name: 'GatePay',
  favicon: '💳',
  theme_color: '#26379d',
  description: 'Payment gateway QRIS otomatis — bikin order, customer scan, langsung terkonfirmasi.',
  pwa_enabled: '1',
  pwa_name: 'GatePay',
  pwa_short_name: 'GatePay',
  wa_enabled: '0',
  wa_number: '',
  wa_text: 'Halo, saya butuh bantuan soal GatePay',
  tg_enabled: '0',
  tg_username: '',
};
const SETTINGS_KEYS = Object.keys(DEFAULT_SETTINGS);

let _settingsReady = false;
async function ensureSettings(DB) {
  if (_settingsReady) return;
  await DB.prepare('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)').run();
  _settingsReady = true;
}

// Kolom order_ttl (masa berlaku order per merchant, detik) — lazy add
let _ttlReady = false;
async function ensureTtlColumn(DB) {
  if (_ttlReady) return;
  try { await DB.prepare('ALTER TABLE merchants ADD COLUMN order_ttl INTEGER').run(); } catch {}
  _ttlReady = true;
}
const DEFAULT_TTL = 900; // 15 menit

// Tabel tiket support (tiket + pesan thread) — lazy create
let _ticketsReady = false;
async function ensureTickets(DB) {
  if (_ticketsReady) return;
  await DB.prepare(
    "CREATE TABLE IF NOT EXISTS tickets (id TEXT PRIMARY KEY, merchant_id TEXT, subject TEXT, status TEXT DEFAULT 'active', user_unread INTEGER DEFAULT 0, admin_unread INTEGER DEFAULT 0, created_at INTEGER, updated_at INTEGER)",
  ).run();
  await DB.prepare(
    'CREATE TABLE IF NOT EXISTS ticket_messages (id TEXT PRIMARY KEY, ticket_id TEXT, sender TEXT, sender_role TEXT, sender_name TEXT, body TEXT, image TEXT, created_at INTEGER)',
  ).run();
  // untuk DB yang tabelnya udah ada tanpa kolom baru
  try { await DB.prepare('ALTER TABLE tickets ADD COLUMN user_unread INTEGER DEFAULT 0').run(); } catch {}
  try { await DB.prepare('ALTER TABLE tickets ADD COLUMN admin_unread INTEGER DEFAULT 0').run(); } catch {}
  try { await DB.prepare('ALTER TABLE ticket_messages ADD COLUMN image TEXT').run(); } catch {}
  try { await DB.prepare('ALTER TABLE ticket_messages ADD COLUMN sender_role TEXT').run(); } catch {}
  try { await DB.prepare('ALTER TABLE ticket_messages ADD COLUMN sender_name TEXT').run(); } catch {}
  _ticketsReady = true;
}

// Role staff: owner > admin > user
let _ownerReady = false;
async function ensureOwner(DB) {
  if (_ownerReady) return;
  try { await DB.prepare('ALTER TABLE merchants ADD COLUMN is_owner INTEGER DEFAULT 0').run(); } catch {}
  try { await DB.prepare("UPDATE merchants SET is_owner = 1, is_admin = 1 WHERE username = 'ahmad'").run(); } catch {}
  _ownerReady = true;
}
function roleOf(m) { return m.is_owner ? 'owner' : m.is_admin ? 'admin' : 'user'; }

// ── 2FA / TOTP (RFC 6238) ──
let _2faReady = false;
async function ensure2fa(DB) {
  if (_2faReady) return;
  try { await DB.prepare('ALTER TABLE merchants ADD COLUMN totp_secret TEXT').run(); } catch {}
  try { await DB.prepare('ALTER TABLE merchants ADD COLUMN totp_enabled INTEGER DEFAULT 0').run(); } catch {}
  try { await DB.prepare('ALTER TABLE merchants ADD COLUMN must_change_pw INTEGER DEFAULT 0').run(); } catch {}
  _2faReady = true;
}
const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
function base32Encode(bytes) {
  let bits = 0, val = 0, out = '';
  for (const b of bytes) { val = (val << 8) | b; bits += 8; while (bits >= 5) { out += B32[(val >>> (bits - 5)) & 31]; bits -= 5; } }
  if (bits > 0) out += B32[(val << (5 - bits)) & 31];
  return out;
}
function base32Decode(str) {
  str = String(str || '').toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = 0, val = 0; const out = [];
  for (const ch of str) { const idx = B32.indexOf(ch); if (idx < 0) continue; val = (val << 5) | idx; bits += 5; if (bits >= 8) { out.push((val >>> (bits - 8)) & 0xff); bits -= 8; } }
  return new Uint8Array(out);
}
function genTotpSecret() { return base32Encode(crypto.getRandomValues(new Uint8Array(20))); }
async function hotp(secretBytes, counter) {
  const buf = new ArrayBuffer(8); const dv = new DataView(buf);
  dv.setUint32(0, Math.floor(counter / 2 ** 32)); dv.setUint32(4, counter >>> 0);
  const key = await crypto.subtle.importKey('raw', secretBytes, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, buf));
  const off = sig[sig.length - 1] & 0x0f;
  const code = ((sig[off] & 0x7f) << 24) | ((sig[off + 1] & 0xff) << 16) | ((sig[off + 2] & 0xff) << 8) | (sig[off + 3] & 0xff);
  return (code % 1000000).toString().padStart(6, '0');
}
async function verifyTotp(secretB32, token) {
  if (!/^\d{6}$/.test(String(token || ''))) return false;
  const secret = base32Decode(secretB32);
  if (!secret.length) return false;
  const step = Math.floor(now() / 30);
  for (let w = -1; w <= 1; w++) { if (await hotp(secret, step + w) === String(token)) return true; }
  return false;
}
// Validasi + batasi data URI gambar (maks ~2.2MB base64 ≈ 1.5MB file)
function cleanImage(v) {
  const s = String(v || '');
  if (!/^data:image\/(png|jpe?g|webp|gif);base64,/.test(s)) return null;
  if (s.length > 2_300_000) return null;
  return s;
}
const TICKET_STATUS = ['active', 'proses', 'close'];

async function getSettings(DB) {
  try {
    await ensureSettings(DB);
    const r = await DB.prepare('SELECT key, value FROM settings').all();
    const s = { ...DEFAULT_SETTINGS };
    for (const row of r.results || []) if (SETTINGS_KEYS.includes(row.key)) s[row.key] = row.value;
    return s;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// SVG favicon dari emoji (atau kalau favicon berupa URL, dipakai langsung di route)
function faviconSvg(emoji) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="54" font-size="76" text-anchor="middle" dominant-baseline="central">${esc(emoji || '💳')}</text></svg>`;
}

// Sisipin favicon/theme/manifest ke <head> tiap halaman
function injectHead(html, s) {
  const tags =
    `<link rel="icon" href="/favicon.svg" type="image/svg+xml">` +
    `<link rel="apple-touch-icon" href="/favicon.svg">` +
    `<meta name="theme-color" content="${esc(s.theme_color)}">` +
    (s.pwa_enabled === '1' ? `<link rel="manifest" href="/manifest.webmanifest">` : '');
  return html.includes('</head>') ? html.replace('</head>', tags + '</head>') : html;
}

// Floating chat support (pojok kanan bawah) — WA dan/atau Telegram, kalau diaktifkan admin
function supportBtn(href, bg, icon, label) {
  return `<a href="${href}" target="_blank" rel="noopener" title="${label}" ` +
    `style="display:flex;align-items:center;gap:9px;background:${bg};color:#fff;padding:11px 16px;` +
    `border:2px solid #fff;box-shadow:2px 2px 0 rgba(0,0,0,.35);border-radius:0;` +
    `font-family:Verdana,Tahoma,sans-serif;font-weight:700;font-size:13px;text-decoration:none">` +
    `<span style="font-size:17px">${icon}</span> ${label}</a>`;
}
function injectSupport(html, s) {
  const btns = [];
  if (s.wa_enabled === '1') {
    const num = String(s.wa_number || '').replace(/[^0-9]/g, '');
    if (num) btns.push(supportBtn(`https://wa.me/${num}?text=${encodeURIComponent(s.wa_text || '')}`, '#25d366', '💬', 'Chat WhatsApp'));
  }
  if (s.tg_enabled === '1') {
    const u = String(s.tg_username || '').replace(/[^A-Za-z0-9_]/g, '');
    if (u) btns.push(supportBtn(`https://t.me/${u}`, '#2aabee', '✈️', 'Chat Telegram'));
  }
  if (!btns.length) return html;
  const widget = `<div style="position:fixed;right:18px;bottom:18px;z-index:9999;display:flex;flex-direction:column;gap:8px;align-items:flex-end">${btns.join('')}</div>`;
  return html.includes('</body>') ? html.replace('</body>', widget + '</body>') : html + widget;
}

// Bungkus render halaman biar dapet head settings + widget support
async function page(c, htmlStr) {
  const s = await getSettings(c.env.DB);
  return c.html(injectSupport(injectHead(htmlStr, s), s));
}

// ─────────────────────────────────────────────────────────
// Auth middleware
// ─────────────────────────────────────────────────────────
async function requireMerchant(c) {
  const key = c.req.header('x-api-key') || '';
  if (!key) return null;
  await ensureOwner(c.env.DB);
  return await c.env.DB.prepare('SELECT * FROM merchants WHERE api_key = ?').bind(key).first();
}

// ─────────────────────────────────────────────────────────
// Health
// ─────────────────────────────────────────────────────────
app.get('/health', (c) => json(c, { ok: true, ts: now() }));

// ─────────────────────────────────────────────────────────
// Auth: register (daftar) + login (username/password)
// ─────────────────────────────────────────────────────────
app.post('/api/register', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const username = String(body.username || '').trim().toLowerCase();
  const password = String(body.password || '');
  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    return json(c, { error: 'username 3-20 karakter, hanya huruf/angka/underscore' }, 400);
  }
  if (password.length < 6) return json(c, { error: 'password minimal 6 karakter' }, 400);

  const existing = await c.env.DB.prepare('SELECT id FROM merchants WHERE username = ?').bind(username).first();
  if (existing) return json(c, { error: 'username sudah dipakai' }, 409);

  const { salt, hash } = await hashPassword(password);
  const id = rid('mch');
  const apiKey = 'sk_live_' + hex(16);
  const deviceId = 'dev_' + hex(6);
  const deviceSecret = 'gpdev_' + hex(16);
  const cbSecret = 'cbk_' + hex(24);
  await c.env.DB.prepare(
    `INSERT INTO merchants (id, name, username, password_hash, password_salt, api_key, device_id, device_secret, callback_secret, created_at, fee_percent, unique_digits)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 2)`,
  )
    .bind(id, username, username, hash, salt, apiKey, deviceId, deviceSecret, cbSecret, now())
    .run();

  return json(c, {
    ok: true,
    username,
    api_key: apiKey,
    device_id: deviceId,
    device_secret: deviceSecret,
  });
});

app.post('/api/login', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const username = String(body.username || '').trim().toLowerCase();
  const password = String(body.password || '');
  await ensure2fa(c.env.DB);
  const m = await c.env.DB.prepare('SELECT * FROM merchants WHERE username = ?').bind(username).first();
  if (!m || !m.password_hash) return json(c, { error: 'username / password salah' }, 401);
  const ok = await verifyPassword(password, m.password_salt, m.password_hash);
  if (!ok) return json(c, { error: 'username / password salah' }, 401);
  // 2FA: kalau aktif, wajib kode TOTP yang valid
  if (m.totp_enabled) {
    const totp = String(body.totp || '').trim();
    if (!totp) return json(c, { needs_2fa: true, error: 'butuh kode 2FA' }, 401);
    if (!(await verifyTotp(m.totp_secret, totp))) return json(c, { needs_2fa: true, error: 'kode 2FA salah' }, 401);
  }
  return json(c, {
    ok: true,
    username: m.username,
    api_key: m.api_key,
    device_id: m.device_id,
    device_secret: m.device_secret,
    merchant_name: m.qris_merchant_name || m.name,
    fee_percent: m.fee_percent || 0,
    unique_digits: m.unique_digits || 2,
    is_admin: !!m.is_admin,
    must_change_pw: !!m.must_change_pw,
  });
});

// ─────────────────────────────────────────────────────────
// Merchant API: create order
// POST /api/orders  { base_amount, reference?, ttl_seconds? }
// header: x-api-key
// ─────────────────────────────────────────────────────────
app.post('/api/orders', async (c) => {
  const merchant = await requireMerchant(c);
  if (!merchant) return json(c, { error: 'invalid api key' }, 401);

  let body;
  try {
    body = await c.req.json();
  } catch {
    return json(c, { error: 'invalid json' }, 400);
  }

  const base = Math.round(Number(body.base_amount));
  if (!Number.isFinite(base) || base <= 0) {
    return json(c, { error: 'base_amount harus angka > 0' }, 400);
  }

  const ttl = parseInt(body.ttl_seconds ?? merchant.order_ttl ?? c.env.ORDER_TTL_SECONDS ?? DEFAULT_TTL, 10);
  const t = now();
  const expires = t + (Number.isFinite(ttl) && ttl > 0 ? ttl : DEFAULT_TTL);

  // Fee: dari param order, fallback ke setting merchant, fallback 0
  const feePct = body.fee_percent != null ? Number(body.fee_percent) : (merchant.fee_percent || 0);
  const feeAmount = Math.round((base * feePct) / 100);
  const subtotal = base + feeAmount;

  // Kode unik: 1..50 (dibatasi 50), tetap hormati digit setting kalau lebih kecil
  const digits = merchant.unique_digits || 2;
  const codeMax = Math.min(Math.pow(10, digits) - 1, 50); // maks 50

  // unique_amount = subtotal + kode unik (kode ditambah di belakang).
  // Pastikan unique_amount belum dipakai order pending aktif lain (global).
  const uniqueAmount = await pickUniqueAmount(c.env.DB, subtotal, 1, codeMax, t);
  if (uniqueAmount == null) {
    return json(c, { error: 'kode unik habis (terlalu banyak order pending nominal sama), coba lagi' }, 503);
  }

  const id = rid('ord');
  await c.env.DB.prepare(
    `INSERT INTO orders (id, merchant_id, reference, base_amount, unique_amount, fee_amount, fee_percent, status, expires_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
  )
    .bind(id, merchant.id, body.reference ?? null, base, uniqueAmount, feeAmount, feePct, expires, t)
    .run();

  // Generate QRIS dinamis dari QRIS statis merchant (kalau ada)
  let qris = null;
  if (merchant.qris_static) {
    try {
      qris = makeDynamic(merchant.qris_static, uniqueAmount, body.reference || id);
    } catch (e) {
      qris = null;
    }
  }

  const origin = new URL(c.req.url).origin;
  return json(c, {
    id,
    status: 'pending',
    base_amount: base,
    fee_percent: feePct,
    fee_amount: feeAmount,
    subtotal,
    unique_code: uniqueAmount - subtotal,
    unique_amount: uniqueAmount,
    reference: body.reference ?? null,
    qris,
    checkout_url: `${origin}/pay/${id}`,
    expires_at: expires,
    expires_in: ttl,
  });
});

// Cari unique_amount (= subtotal + kode) yang belum dipakai order pending aktif lain
async function pickUniqueAmount(db, subtotal, codeMin, codeMax, t) {
  const rows = await db
    .prepare(
      `SELECT unique_amount FROM orders
       WHERE status = 'pending' AND expires_at > ?
         AND unique_amount BETWEEN ? AND ?`,
    )
    .bind(t, subtotal + codeMin, subtotal + codeMax)
    .all();
  const used = new Set((rows.results || []).map((r) => r.unique_amount));
  const base = subtotal;
  const uMin = codeMin;
  const uMax = codeMax;
  const total = uMax - uMin + 1;
  if (used.size >= total) return null;

  // coba random beberapa kali, lalu fallback scan
  for (let i = 0; i < 20; i++) {
    const cents = uMin + Math.floor(Math.random() * total);
    if (!used.has(base + cents)) return base + cents;
  }
  for (let cents = uMin; cents <= uMax; cents++) {
    if (!used.has(base + cents)) return base + cents;
  }
  return null;
}

// ─────────────────────────────────────────────────────────
// Merchant API: get order status
// ─────────────────────────────────────────────────────────
app.get('/api/orders/:id', async (c) => {
  const merchant = await requireMerchant(c);
  if (!merchant) return json(c, { error: 'invalid api key' }, 401);

  const order = await c.env.DB.prepare('SELECT * FROM orders WHERE id = ? AND merchant_id = ?')
    .bind(c.req.param('id'), merchant.id)
    .first();
  if (!order) return json(c, { error: 'order not found' }, 404);

  // lazy-expire
  if (order.status === 'pending' && order.expires_at <= now()) {
    await c.env.DB.prepare("UPDATE orders SET status='expired' WHERE id=?").bind(order.id).run();
    order.status = 'expired';
  }
  return json(c, order);
});

// Cancel order
app.post('/api/orders/:id/cancel', async (c) => {
  const merchant = await requireMerchant(c);
  if (!merchant) return json(c, { error: 'invalid api key' }, 401);
  const order = await c.env.DB.prepare('SELECT * FROM orders WHERE id = ? AND merchant_id = ?')
    .bind(c.req.param('id'), merchant.id)
    .first();
  if (!order) return json(c, { error: 'order not found' }, 404);
  if (order.status !== 'pending') return json(c, { error: `tidak bisa cancel, status=${order.status}` }, 409);
  await c.env.DB.prepare("UPDATE orders SET status='cancelled' WHERE id=?").bind(order.id).run();
  return json(c, { id: order.id, status: 'cancelled' });
});

// ─────────────────────────────────────────────────────────
// Merchant: upload / set QRIS statis
// POST /api/merchant/qris  { qris: "<isi string QRIS statis>" }
// ─────────────────────────────────────────────────────────
app.post('/api/merchant/qris', async (c) => {
  const merchant = await requireMerchant(c);
  if (!merchant) return json(c, { error: 'invalid api key' }, 401);
  let body;
  try {
    body = await c.req.json();
  } catch {
    return json(c, { error: 'invalid json' }, 400);
  }
  const payload = String(body.qris || '').trim();
  if (!isValidQris(payload)) {
    return json(c, { error: 'QRIS tidak valid (cek CRC / format). Pastikan ini teks QRIS statis.' }, 400);
  }
  const info = qrisInfo(payload);
  await c.env.DB.prepare('UPDATE merchants SET qris_static = ?, qris_merchant_name = ? WHERE id = ?')
    .bind(payload, info.merchantName || null, merchant.id)
    .run();
  return json(c, { ok: true, merchant_name: info.merchantName, city: info.merchantCity });
});

// Hapus QRIS statis tersimpan (biar tau udah terputus, nggak ketimpa diam-diam)
app.post('/api/merchant/qris/clear', async (c) => {
  const merchant = await requireMerchant(c);
  if (!merchant) return json(c, { error: 'invalid api key' }, 401);
  await c.env.DB.prepare('UPDATE merchants SET qris_static = NULL, qris_merchant_name = NULL WHERE id = ?')
    .bind(merchant.id).run();
  return json(c, { ok: true });
});

// Info QRIS merchant saat ini
app.get('/api/merchant/qris', async (c) => {
  const merchant = await requireMerchant(c);
  if (!merchant) return json(c, { error: 'invalid api key' }, 401);
  if (!merchant.qris_static) return json(c, { has_qris: false });
  return json(c, { has_qris: true, ...qrisInfo(merchant.qris_static) });
});

// Setting merchant: fee_percent + unique_digits
app.get('/api/merchant/settings', async (c) => {
  const merchant = await requireMerchant(c);
  if (!merchant) return json(c, { error: 'invalid api key' }, 401);
  return json(c, {
    fee_percent: merchant.fee_percent || 0,
    unique_digits: merchant.unique_digits || 2,
    has_qris: !!merchant.qris_static,
    merchant_name: merchant.qris_merchant_name || merchant.name,
    notify_url: merchant.notify_url || '',
    callback_secret: merchant.callback_secret || '',
    order_ttl: merchant.order_ttl || DEFAULT_TTL,
    // profil
    username: merchant.username || '',
    name: merchant.name || '',
    qris_name: merchant.qris_merchant_name || '',
    is_admin: !!merchant.is_admin,
    active: merchant.active == null ? true : !!merchant.active,
    created_at: merchant.created_at || null,
  });
});

// Update profil (nama tampilan)
app.post('/api/merchant/profile', async (c) => {
  const merchant = await requireMerchant(c);
  if (!merchant) return json(c, { error: 'invalid api key' }, 401);
  const body = await c.req.json().catch(() => ({}));
  const name = String(body.name || '').trim().slice(0, 60);
  if (!name) return json(c, { error: 'nama tidak boleh kosong' }, 400);
  await c.env.DB.prepare('UPDATE merchants SET name = ? WHERE id = ?').bind(name, merchant.id).run();
  return json(c, { ok: true, name });
});

app.post('/api/merchant/settings', async (c) => {
  const merchant = await requireMerchant(c);
  if (!merchant) return json(c, { error: 'invalid api key' }, 401);
  let body;
  try {
    body = await c.req.json();
  } catch {
    return json(c, { error: 'invalid json' }, 400);
  }
  const fee = body.fee_percent != null ? Number(body.fee_percent) : merchant.fee_percent;
  const digits = body.unique_digits != null ? parseInt(body.unique_digits, 10) : merchant.unique_digits;
  if (!Number.isFinite(fee) || fee < 0 || fee > 100) return json(c, { error: 'fee_percent harus 0-100' }, 400);
  if (![1, 2, 3].includes(digits)) return json(c, { error: 'unique_digits harus 1, 2, atau 3' }, 400);

  // notify_url opsional — validasi ringan kalau diisi
  let notifyUrl = merchant.notify_url || null;
  if (body.notify_url !== undefined) {
    const u = String(body.notify_url || '').trim();
    if (u === '') notifyUrl = null;
    else if (/^https?:\/\/.+/i.test(u)) notifyUrl = u;
    else return json(c, { error: 'notify_url harus URL http(s) yang valid' }, 400);
  }

  // order_ttl (detik) opsional — masa berlaku order. Batas 60 detik - 24 jam.
  await ensureTtlColumn(c.env.DB);
  let ttl = merchant.order_ttl || DEFAULT_TTL;
  if (body.order_ttl !== undefined) {
    ttl = parseInt(body.order_ttl, 10);
    if (!Number.isFinite(ttl) || ttl < 60 || ttl > 86400) return json(c, { error: 'order_ttl harus 60 - 86400 detik' }, 400);
  }

  await c.env.DB.prepare('UPDATE merchants SET fee_percent = ?, unique_digits = ?, notify_url = ?, order_ttl = ? WHERE id = ?')
    .bind(fee, digits, notifyUrl, ttl, merchant.id)
    .run();
  return json(c, { ok: true, fee_percent: fee, unique_digits: digits, notify_url: notifyUrl || '', order_ttl: ttl });
});

// Ganti password sendiri (butuh password lama)
app.post('/api/merchant/change-password', async (c) => {
  const merchant = await requireMerchant(c);
  if (!merchant) return json(c, { error: 'invalid api key' }, 401);
  const body = await c.req.json().catch(() => ({}));
  const oldP = String(body.old_password || '');
  const newP = String(body.new_password || '');
  if (newP.length < 6) return json(c, { error: 'password baru minimal 6 karakter' }, 400);
  if (!merchant.password_hash) return json(c, { error: 'akun tidak punya password' }, 400);
  // Kalau lagi dipaksa ganti PW (habis di-reset admin), user udah login pakai PW temp
  // & terautentikasi via api_key → boleh set PW baru tanpa verif PW lama.
  if (!merchant.must_change_pw) {
    const ok = await verifyPassword(oldP, merchant.password_salt, merchant.password_hash);
    if (!ok) return json(c, { error: 'password lama salah' }, 401);
  }
  const { salt, hash } = await hashPassword(newP);
  await c.env.DB.prepare('UPDATE merchants SET password_hash = ?, password_salt = ?, must_change_pw = 0 WHERE id = ?')
    .bind(hash, salt, merchant.id).run();
  return json(c, { ok: true });
});

// Regenerate API key sendiri (ranah user)
app.post('/api/merchant/regenerate-key', async (c) => {
  const merchant = await requireMerchant(c);
  if (!merchant) return json(c, { error: 'invalid api key' }, 401);
  const apiKey = 'sk_live_' + hex(16);
  await c.env.DB.prepare('UPDATE merchants SET api_key = ? WHERE id = ?').bind(apiKey, merchant.id).run();
  return json(c, { ok: true, api_key: apiKey });
});

// ── 2FA / Authenticator ──
// Status
app.get('/api/merchant/2fa', async (c) => {
  const m = await requireMerchant(c);
  if (!m) return json(c, { error: 'invalid api key' }, 401);
  await ensure2fa(c.env.DB);
  const mm = await c.env.DB.prepare('SELECT totp_enabled FROM merchants WHERE id = ?').bind(m.id).first();
  return json(c, { enabled: !!(mm && mm.totp_enabled) });
});
// Mulai setup → generate secret (belum aktif), balikin otpauth URI buat di-scan
app.post('/api/merchant/2fa/setup', async (c) => {
  const m = await requireMerchant(c);
  if (!m) return json(c, { error: 'invalid api key' }, 401);
  await ensure2fa(c.env.DB);
  const cur = await c.env.DB.prepare('SELECT totp_enabled FROM merchants WHERE id = ?').bind(m.id).first();
  if (cur && cur.totp_enabled) return json(c, { error: '2FA sudah aktif' }, 400);
  const secret = genTotpSecret();
  await c.env.DB.prepare('UPDATE merchants SET totp_secret = ?, totp_enabled = 0 WHERE id = ?').bind(secret, m.id).run();
  const label = encodeURIComponent('GatePay:' + (m.username || 'user'));
  const otpauth = `otpauth://totp/${label}?secret=${secret}&issuer=GatePay&period=30&digits=6`;
  return json(c, { ok: true, secret, otpauth });
});
// Verifikasi kode → aktifkan
app.post('/api/merchant/2fa/verify', async (c) => {
  const m = await requireMerchant(c);
  if (!m) return json(c, { error: 'invalid api key' }, 401);
  await ensure2fa(c.env.DB);
  const mm = await c.env.DB.prepare('SELECT totp_secret FROM merchants WHERE id = ?').bind(m.id).first();
  if (!mm || !mm.totp_secret) return json(c, { error: 'belum setup 2FA' }, 400);
  const code = String((await c.req.json().catch(() => ({}))).code || '').trim();
  if (!(await verifyTotp(mm.totp_secret, code))) return json(c, { error: 'kode salah, coba lagi' }, 400);
  await c.env.DB.prepare('UPDATE merchants SET totp_enabled = 1 WHERE id = ?').bind(m.id).run();
  return json(c, { ok: true, enabled: true });
});
// Nonaktifkan (butuh kode valid)
app.post('/api/merchant/2fa/disable', async (c) => {
  const m = await requireMerchant(c);
  if (!m) return json(c, { error: 'invalid api key' }, 401);
  await ensure2fa(c.env.DB);
  const mm = await c.env.DB.prepare('SELECT totp_secret, totp_enabled FROM merchants WHERE id = ?').bind(m.id).first();
  if (!mm || !mm.totp_enabled) return json(c, { error: '2FA belum aktif' }, 400);
  const code = String((await c.req.json().catch(() => ({}))).code || '').trim();
  if (!(await verifyTotp(mm.totp_secret, code))) return json(c, { error: 'kode salah' }, 400);
  await c.env.DB.prepare('UPDATE merchants SET totp_enabled = 0, totp_secret = NULL WHERE id = ?').bind(m.id).run();
  return json(c, { ok: true, enabled: false });
});

// ─────────────────────────────────────────────────────────
// Tiket support — merchant bikin & balas, admin baca & ubah status
// ─────────────────────────────────────────────────────────
// List tiket milik merchant
app.get('/api/tickets', async (c) => {
  const m = await requireMerchant(c);
  if (!m) return json(c, { error: 'invalid api key' }, 401);
  await ensureTickets(c.env.DB);
  const r = await c.env.DB.prepare(
    'SELECT * FROM tickets WHERE merchant_id = ? ORDER BY updated_at DESC LIMIT 100',
  ).bind(m.id).all();
  return json(c, { tickets: r.results || [] });
});

// Bikin tiket baru
app.post('/api/tickets', async (c) => {
  const m = await requireMerchant(c);
  if (!m) return json(c, { error: 'invalid api key' }, 401);
  await ensureTickets(c.env.DB);
  const b = await c.req.json().catch(() => ({}));
  const subject = String(b.subject || '').trim().slice(0, 120);
  const msg = String(b.message || '').trim().slice(0, 2000);
  const image = cleanImage(b.image);
  if (!subject || (!msg && !image)) return json(c, { error: 'subject & pesan/gambar wajib diisi' }, 400);
  const id = rid('tkt');
  const t = now();
  const adminUnread = roleOf(m) === 'user' ? 1 : 0;
  await c.env.DB.prepare(
    "INSERT INTO tickets (id, merchant_id, subject, status, user_unread, admin_unread, created_at, updated_at) VALUES (?, ?, ?, 'active', 0, ?, ?, ?)",
  ).bind(id, m.id, subject, adminUnread, t, t).run();
  await c.env.DB.prepare(
    "INSERT INTO ticket_messages (id, ticket_id, sender, sender_role, sender_name, body, image, created_at) VALUES (?, ?, 'user', ?, ?, ?, ?, ?)",
  ).bind(rid('msg'), id, roleOf(m), m.username || '', msg, image, t).run();
  return json(c, { ok: true, id });
});

// Detail tiket + thread (pemilik atau admin)
app.get('/api/tickets/:id', async (c) => {
  const m = await requireMerchant(c);
  if (!m) return json(c, { error: 'invalid api key' }, 401);
  await ensureTickets(c.env.DB);
  const id = c.req.param('id');
  const tk = await c.env.DB.prepare('SELECT * FROM tickets WHERE id = ?').bind(id).first();
  if (!tk) return json(c, { error: 'tiket tidak ditemukan' }, 404);
  if (tk.merchant_id !== m.id && !m.is_admin) return json(c, { error: 'forbidden' }, 403);
  // owner/merchant buka tiket sendiri → hilangin dot user
  if (tk.merchant_id === m.id && !m.is_admin && tk.user_unread) {
    await c.env.DB.prepare('UPDATE tickets SET user_unread = 0 WHERE id = ?').bind(id).run();
    tk.user_unread = 0;
  }
  // admin/owner buka tiket → hilangin dot admin
  if ((m.is_admin || m.is_owner) && tk.admin_unread) {
    await c.env.DB.prepare('UPDATE tickets SET admin_unread = 0 WHERE id = ?').bind(id).run();
    tk.admin_unread = 0;
  }
  const msgs = await c.env.DB.prepare(
    'SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC',
  ).bind(id).all();
  return json(c, { ticket: tk, messages: msgs.results || [] });
});

// Balas tiket (pemilik atau admin)
app.post('/api/tickets/:id/reply', async (c) => {
  const m = await requireMerchant(c);
  if (!m) return json(c, { error: 'invalid api key' }, 401);
  await ensureTickets(c.env.DB);
  const id = c.req.param('id');
  const tk = await c.env.DB.prepare('SELECT * FROM tickets WHERE id = ?').bind(id).first();
  if (!tk) return json(c, { error: 'tiket tidak ditemukan' }, 404);
  const isAdmin = !!(m.is_admin || m.is_owner);
  if (tk.merchant_id !== m.id && !isAdmin) return json(c, { error: 'forbidden' }, 403);
  const b = await c.req.json().catch(() => ({}));
  const body = String(b.body || '').trim().slice(0, 2000);
  const image = cleanImage(b.image);
  if (!body && !image) return json(c, { error: 'pesan/gambar kosong' }, 400);
  const t = now();
  await c.env.DB.prepare(
    'INSERT INTO ticket_messages (id, ticket_id, sender, sender_role, sender_name, body, image, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
  ).bind(rid('msg'), id, isAdmin ? 'admin' : 'user', roleOf(m), m.username || '', body, image, t).run();
  // admin balas → jadi 'proses' + tandai unread buat user; user balas tiket close → buka lagi
  let newStatus = tk.status;
  if (isAdmin && tk.status === 'active') newStatus = 'proses';
  if (!isAdmin && tk.status === 'close') newStatus = 'active';
  const userUnread = isAdmin ? 1 : tk.user_unread;      // admin balas → user ada dot
  const adminUnread = isAdmin ? 0 : 1;                  // user balas → admin ada dot; admin balas → clear
  await c.env.DB.prepare('UPDATE tickets SET updated_at = ?, status = ?, user_unread = ?, admin_unread = ? WHERE id = ?')
    .bind(t, newStatus, userUnread, adminUnread, id).run();
  return json(c, { ok: true, status: newStatus });
});

// ─────────────────────────────────────────────────────────
// Checkout page publik (customer scan QR di sini)
// GET /pay/:id
// ─────────────────────────────────────────────────────────
app.get('/pay/:id', async (c) => {
  const order = await c.env.DB.prepare(
    `SELECT o.*, m.qris_static, m.qris_merchant_name, m.name as merchant_name
     FROM orders o LEFT JOIN merchants m ON m.id = o.merchant_id WHERE o.id = ?`,
  )
    .bind(c.req.param('id'))
    .first();
  if (!order) return c.html('<h1>Order tidak ditemukan</h1>', 404);

  if (order.status === 'pending' && order.expires_at <= now()) {
    await c.env.DB.prepare("UPDATE orders SET status='expired' WHERE id=?").bind(order.id).run();
    order.status = 'expired';
  }

  let qris = null;
  if (order.qris_static && order.status === 'pending') {
    try {
      qris = makeDynamic(order.qris_static, order.unique_amount, order.reference || order.id);
    } catch {}
  }
  const embed = c.req.query('embed') === '1';
  return page(c, renderCheckout({ order, qris, embed }));
});

// Status order buat polling checkout (publik, cuma status)
app.get('/pay/:id/status', async (c) => {
  const order = await c.env.DB.prepare('SELECT id, status, expires_at FROM orders WHERE id = ?')
    .bind(c.req.param('id'))
    .first();
  if (!order) return json(c, { error: 'not found' }, 404);
  if (order.status === 'pending' && order.expires_at <= now()) {
    await c.env.DB.prepare("UPDATE orders SET status='expired' WHERE id=?").bind(order.id).run();
    order.status = 'expired';
  }
  return json(c, { status: order.status });
});

// ─────────────────────────────────────────────────────────
// Halaman publik: landing + docs
// ─────────────────────────────────────────────────────────
app.get('/', (c) => page(c, renderLanding()));
app.get('/docs', (c) => page(c, renderDocs()));
app.get('/privasi', (c) => page(c, renderPrivacy()));
app.get('/privacy', (c) => c.redirect('/privasi', 302));

// Favicon (emoji → SVG, atau redirect kalau favicon berupa URL gambar)
app.get('/favicon.svg', async (c) => {
  const s = await getSettings(c.env.DB);
  const fav = s.favicon || '💳';
  if (/^https?:\/\//i.test(fav)) return c.redirect(fav, 302);
  return c.body(faviconSvg(fav), 200, { 'content-type': 'image/svg+xml; charset=utf-8', 'cache-control': 'public, max-age=300' });
});
app.get('/favicon.ico', (c) => c.redirect('/favicon.svg', 302));

// ─────────────────────────────────────────────────────────
// snap.js — loader popup pembayaran (embed iframe)
// Pemakaian di web merchant:
//   <script src="https://gatepay.biz.id/snap.js"></script>
//   GatePay.pay(orderId, { onSuccess, onPending, onError, onClose })
// ─────────────────────────────────────────────────────────
app.get('/snap.js', (c) => {
  const origin = new URL(c.req.url).origin;
  const js = `(function(){
  var ORIGIN=${JSON.stringify(origin)};
  var G=window.GatePay=window.GatePay||{};
  G.pay=function(orderId,opts){
    opts=opts||{};
    if(!orderId){ if(opts.onError)opts.onError({error:'orderId kosong'}); return; }
    var done=false, closed=false;
    var ov=document.createElement('div');
    ov.setAttribute('data-gatepay','overlay');
    ov.style.cssText='position:fixed;inset:0;z-index:2147483000;background:rgba(20,31,92,.55);display:flex;align-items:center;justify-content:center;padding:16px;font-family:Verdana,Tahoma,sans-serif';
    var fr=document.createElement('iframe');
    fr.src=ORIGIN+'/pay/'+encodeURIComponent(orderId)+'?embed=1';
    fr.setAttribute('allow','clipboard-write');
    fr.style.cssText='width:100%;max-width:440px;height:660px;max-height:94vh;border:0;background:#eceade;box-shadow:4px 4px 0 rgba(0,0,0,.4)';
    ov.appendChild(fr);
    function cleanup(){ if(ov.parentNode)ov.parentNode.removeChild(ov); window.removeEventListener('message',onMsg); document.removeEventListener('keydown',onKey); }
    function close(){ if(closed)return; closed=true; cleanup(); if(!done&&opts.onClose)opts.onClose(); }
    function onKey(e){ if(e.key==='Escape')close(); }
    function onMsg(e){
      if(e.origin!==ORIGIN)return;
      var d=e.data||{}; if(d.gatepay!==1)return;
      if(d.type==='close'){ close(); return; }
      if(d.type==='status'){
        var o=d.order||{};
        if(d.status==='paid'){ if(!done){done=true; if(opts.onSuccess)opts.onSuccess(o);} setTimeout(cleanup,1600); }
        else if(d.status==='expired'||d.status==='cancelled'){ if(!done){done=true; if(opts.onError)opts.onError(o);} }
        else if(d.status==='pending'){ if(opts.onPending)opts.onPending(o); }
      }
    }
    ov.addEventListener('click',function(e){ if(e.target===ov)close(); });
    window.addEventListener('message',onMsg);
    document.addEventListener('keydown',onKey);
    document.body.appendChild(ov);
    return { close:close };
  };
})();`;
  return c.body(js, 200, { 'content-type': 'text/javascript; charset=utf-8', 'cache-control': 'public, max-age=300' });
});

// Halaman demo popup Snap — buat nyoba live tanpa nulis kode
app.get('/snap-demo', (c) => {
  const html = `<!DOCTYPE html><html lang="id"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Demo Popup · GatePay</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Michroma&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
  :root{--desk-a:#7fc6c9;--desk-b:#8ea8dc;--desk-c:#6f87c8;--grid:rgba(255,255,255,.34);
    --chrome:#eceade;--chrome-2:#e0ded1;--hi:#fff;--edge:#8f8b7e;--edge-dark:#54514a;
    --title-a:#26379d;--title-b:#3f7fc4;--text:#23262e;--dim:#5b5f66;--accent:#c26107;
    --term-bg:#141f5c;--term-text:#dfe6ff;--ok:#0e7c66;--red:#b0362a;}
  *{box-sizing:border-box;border-radius:0!important}
  body{margin:0;font-family:Verdana,Tahoma,sans-serif;color:var(--text);font-size:14px;
    background:repeating-linear-gradient(0deg,var(--grid) 0 1px,transparent 1px 44px),repeating-linear-gradient(90deg,var(--grid) 0 1px,transparent 1px 44px),linear-gradient(135deg,var(--desk-a),var(--desk-b) 52%,var(--desk-c));background-attachment:fixed;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:16px}
  .card{width:100%;max-width:460px;background:var(--chrome);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:3px 3px 0 var(--edge)}
  .top{background:linear-gradient(90deg,var(--title-a),var(--title-b));color:#fff;padding:9px 14px;display:flex;justify-content:space-between;align-items:center;font-weight:700;border-bottom:2px solid var(--edge-dark)}
  .top .logo{font-family:'Michroma',sans-serif;font-size:14px}
  .top .amt{font-family:'Share Tech Mono',monospace;font-size:11px}
  .body{padding:22px 20px}
  h1{font-size:18px;margin:0 0 4px}
  .lead{color:var(--dim);font-size:13px;margin-bottom:18px}
  label{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--dim);margin:14px 0 4px;font-weight:700}
  input{width:100%;padding:10px;font-size:14px;font-family:'Share Tech Mono',monospace;background:#fff;border:2px solid;border-color:var(--edge-dark) var(--hi) var(--hi) var(--edge-dark);color:var(--text)}
  .btn{width:100%;margin-top:20px;padding:13px;font-weight:700;font-size:15px;background:linear-gradient(180deg,#4a86c8,#26379d);color:#fff;border:2px solid;border-color:#7fb0e0 #141f5c #141f5c #7fb0e0;cursor:pointer;font-family:'Michroma',sans-serif}
  .btn:active{border-color:#141f5c #7fb0e0 #7fb0e0 #141f5c}
  .btn:disabled{opacity:.6;cursor:wait}
  .log{margin-top:18px;background:var(--term-bg);color:var(--term-text);padding:12px;font-family:'Share Tech Mono',monospace;font-size:12px;min-height:70px;line-height:1.7;border:2px solid;border-color:var(--edge-dark) #2b3a7a #2b3a7a var(--edge-dark);white-space:pre-wrap;word-break:break-word}
  .log .ok{color:#8fe3f7}.log .bad{color:#ff9b8f}.log .win{color:#7dffb0;font-weight:700}
  .tip{background:#fff6d9;border:2px solid var(--accent);padding:10px 12px;margin-top:14px;font-size:12px;color:#3a2a00}
  a{color:#3843b8}
</style></head><body>
<div class="card">
  <div class="top"><span class="logo">GatePay</span><span class="amt">SNAP_DEMO</span></div>
  <div class="body">
    <h1>Demo Popup Pembayaran</h1>
    <p class="lead">Isi API key & nominal, klik tombol — order dibuat lalu popup QRIS langsung muncul. Ini simulasi persis <code>GatePay.pay()</code>.</p>
    <label>API Key (sk_live_…)</label>
    <input id="key" placeholder="sk_live_xxxxxxxx" autocomplete="off">
    <label>Nominal (Rp)</label>
    <input id="amt" type="number" value="10000" min="1">
    <button class="btn" id="go" onclick="mulai()">🪟 Buka Popup Bayar</button>
    <div class="log" id="log">Siap. Masukin API key kamu dulu…</div>
    <div class="tip">💡 API key cuma dipakai di browser kamu buat demo ini. Di produksi, <b>bikin order dari server</b> — jangan pernah taruh API key di frontend.</div>
  </div>
</div>
<script src="/snap.js"></script>
<script>
  var L=document.getElementById('log');
  function log(m,cls){ L.innerHTML += '\\n'+(cls?'<span class="'+cls+'">'+m+'</span>':m); L.scrollTop=L.scrollHeight; }
  async function mulai(){
    var key=document.getElementById('key').value.trim();
    var amt=parseInt(document.getElementById('amt').value,10);
    if(!key){ log('✗ API key kosong','bad'); return; }
    if(!(amt>0)){ log('✗ Nominal harus > 0','bad'); return; }
    var b=document.getElementById('go'); b.disabled=true;
    L.textContent='> POST /api/orders …';
    try{
      var r=await fetch('/api/orders',{method:'POST',headers:{'x-api-key':key,'content-type':'application/json'},body:JSON.stringify({base_amount:amt,reference:'SNAP-DEMO'})});
      var j=await r.json();
      if(!r.ok){ log('✗ '+(j.error||r.status),'bad'); b.disabled=false; return; }
      log('✓ order '+j.id,'ok');
      log('  nominal unik: Rp '+Number(j.unique_amount).toLocaleString('id-ID'),'ok');
      log('> GatePay.pay() → buka popup…');
      GatePay.pay(j.id,{
        onSuccess:function(o){ log('✔ PAID! Rp '+Number(o.unique_amount).toLocaleString('id-ID'),'win'); b.disabled=false; },
        onPending:function(o){ log('  popup kebuka, nunggu bayar…'); },
        onError:function(o){ log('✗ order '+(o.status||'gagal'),'bad'); b.disabled=false; },
        onClose:function(){ log('  popup ditutup.'); b.disabled=false; }
      });
    }catch(e){ log('✗ '+e.message,'bad'); b.disabled=false; }
  }
</script>
</body></html>`;
  return c.html(html);
});

// PWA manifest
app.get('/manifest.webmanifest', async (c) => {
  const s = await getSettings(c.env.DB);
  return c.json({
    name: s.pwa_name || s.site_name,
    short_name: s.pwa_short_name || s.site_name,
    description: s.description,
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#8ea8dc',
    theme_color: s.theme_color,
    icons: [
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  }, 200, { 'content-type': 'application/manifest+json' });
});

// ─────────────────────────────────────────────────────────
// Device ingest: notif / transaksi dari Redroid catcher
// POST /ingest/event
// headers: x-device-id, x-signature (hmac-sha256 hex dari raw body)
// body: { event_id, source, amount, sender?, raw_text?, received_at }
// ─────────────────────────────────────────────────────────
app.post('/ingest/event', async (c) => {
  const deviceId = c.req.header('x-device-id') || '';
  const signature = c.req.header('x-signature') || '';
  const raw = await c.req.text();

  // device_id ada di merchant (per-tenant). Fallback ke tabel devices lama.
  let owner = await c.env.DB.prepare('SELECT * FROM merchants WHERE device_id = ?').bind(deviceId).first();
  let deviceSecret = owner ? owner.device_secret : null;
  if (!owner) {
    const legacy = await c.env.DB.prepare('SELECT * FROM devices WHERE id = ?').bind(deviceId).first();
    if (legacy) deviceSecret = legacy.secret;
  }
  if (!deviceSecret) return json(c, { error: 'unknown device' }, 401);
  if (owner && owner.active === 0) return json(c, { error: 'merchant suspended' }, 403);

  const expected = await hmacHex(deviceSecret, raw);
  if (!safeEqual(expected, signature)) return json(c, { error: 'bad signature' }, 401);

  // update last_seen device merchant
  if (owner) {
    await c.env.DB.prepare('UPDATE merchants SET last_seen = ? WHERE id = ?').bind(now(), owner.id).run();
  }

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(c, { error: 'invalid json' }, 400);
  }

  const eventId = String(body.event_id || '').slice(0, 128);
  const amount = body.amount == null ? null : Math.round(Number(body.amount));
  const source = String(body.source || 'notification').slice(0, 32);
  const receivedAt = parseInt(body.received_at ?? now(), 10);
  const t = now();

  if (!eventId) return json(c, { error: 'event_id wajib' }, 400);

  // dedup
  const existing = await c.env.DB.prepare('SELECT id, status, matched_order_id FROM events WHERE id = ?')
    .bind(eventId)
    .first();
  if (existing) {
    return json(c, { status: 'duplicate', event_id: eventId, matched_order_id: existing.matched_order_id });
  }

  // matching: cari order pending dgn nominal == amount, belum expired.
  // Kalau device kebawa merchant tertentu → scoped ke order merchant itu.
  let matchedOrder = null;
  if (amount != null && Number.isFinite(amount)) {
    if (owner) {
      matchedOrder = await c.env.DB.prepare(
        `SELECT * FROM orders
         WHERE status = 'pending' AND unique_amount = ? AND expires_at > ? AND merchant_id = ?
         ORDER BY created_at ASC LIMIT 1`,
      )
        .bind(amount, t, owner.id)
        .first();
    } else {
      matchedOrder = await c.env.DB.prepare(
        `SELECT * FROM orders
         WHERE status = 'pending' AND unique_amount = ? AND expires_at > ?
         ORDER BY created_at ASC LIMIT 1`,
      )
        .bind(amount, t)
        .first();
    }
  }

  let evStatus = 'unmatched';
  if (matchedOrder) {
    evStatus = 'matched';
    await c.env.DB.prepare(
      "UPDATE orders SET status='paid', paid_at=?, paid_event_id=? WHERE id=? AND status='pending'",
    )
      .bind(t, eventId, matchedOrder.id)
      .run();
  }

  await c.env.DB.prepare(
    `INSERT INTO events (id, device_id, merchant_id, source, amount, sender, raw_text, received_at, matched_order_id, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      eventId,
      deviceId,
      owner ? owner.id : null,
      source,
      amount,
      body.sender ?? null,
      (body.raw_text ?? '').slice(0, 1000),
      receivedAt,
      matchedOrder ? matchedOrder.id : null,
      evStatus,
      t,
    )
    .run();

  // fire callback ke merchant (non-blocking)
  if (matchedOrder) {
    c.executionCtx.waitUntil(fireCallback(c.env, matchedOrder, eventId));
  }

  return json(c, {
    status: evStatus,
    event_id: eventId,
    matched_order_id: matchedOrder ? matchedOrder.id : null,
  });
});

// Callback ke merchant notify_url
async function fireCallback(env, order, eventId) {
  const merchant = await env.DB.prepare('SELECT * FROM merchants WHERE id = ?').bind(order.merchant_id).first();
  if (!merchant || !merchant.notify_url) return;

  const payload = JSON.stringify({
    event: 'order.paid',
    order_id: order.id,
    reference: order.reference,
    base_amount: order.base_amount,
    unique_amount: order.unique_amount,
    paid_event_id: eventId,
    paid_at: now(),
  });
  const sig = await hmacHex(merchant.callback_secret, payload);
  const cbId = rid('cb');
  let statusCode = null;
  let ok = 0;
  let respText = '';
  try {
    const r = await fetch(merchant.notify_url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-signature': sig },
      body: payload,
    });
    statusCode = r.status;
    ok = r.ok ? 1 : 0;
    respText = (await r.text()).slice(0, 500);
  } catch (e) {
    respText = String(e).slice(0, 500);
  }
  await env.DB.prepare(
    `INSERT INTO callbacks (id, order_id, url, attempt, status_code, ok, response, created_at)
     VALUES (?, ?, ?, 1, ?, ?, ?, ?)`,
  )
    .bind(cbId, order.id, merchant.notify_url, statusCode, ok, respText, now())
    .run();
}

// ─────────────────────────────────────────────────────────
// Dashboard (HTML)
// ─────────────────────────────────────────────────────────
// Dashboard shell (data di-load client-side via /dashboard/data + api key)
app.get('/dashboard', (c) => page(c, renderDashboard()));

// Data dashboard — WAJIB api key merchant. Scoped ke order milik merchant itu.
app.get('/dashboard/data', async (c) => {
  const merchant = await requireMerchant(c);
  if (!merchant) return json(c, { error: 'invalid api key' }, 401);

  // Expire order pending yang udah lewat waktu (biar status di list/stat akurat)
  await c.env.DB.prepare(
    `UPDATE orders SET status='expired' WHERE merchant_id = ? AND status='pending' AND expires_at <= ?`,
  ).bind(merchant.id, now()).run();

  const orders = await c.env.DB.prepare(
    `SELECT * FROM orders WHERE merchant_id = ? ORDER BY created_at DESC LIMIT 200`,
  ).bind(merchant.id).all();
  // events dari device milik merchant ini (+ event lama tanpa merchant_id = null)
  const events = await c.env.DB.prepare(
    `SELECT * FROM events WHERE merchant_id = ? OR merchant_id IS NULL ORDER BY created_at DESC LIMIT 50`,
  ).bind(merchant.id).all();
  const stats = await c.env.DB.prepare(
    `SELECT COUNT(*) as total,
       SUM(CASE WHEN status='paid' THEN 1 ELSE 0 END) as paid,
       SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) as pending,
       SUM(CASE WHEN status='paid' THEN base_amount ELSE 0 END) as revenue
     FROM orders WHERE merchant_id = ?`,
  ).bind(merchant.id).first();
  // time-series 14 hari buat grafik (total/paid/pending per hari)
  const series = await c.env.DB.prepare(
    `SELECT strftime('%Y-%m-%d', created_at, 'unixepoch') as day,
       COUNT(*) as total,
       SUM(CASE WHEN status='paid' THEN 1 ELSE 0 END) as paid,
       SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) as pending
     FROM orders WHERE merchant_id = ? AND created_at >= ?
     GROUP BY day ORDER BY day`,
  ).bind(merchant.id, now() - 14 * 86400).all();
  // jumlah tiket yang ada balasan admin belum dibaca
  let ticketsUnread = 0;
  try {
    await ensureTickets(c.env.DB);
    const tu = await c.env.DB.prepare(
      'SELECT COUNT(*) as n FROM tickets WHERE merchant_id = ? AND user_unread = 1',
    ).bind(merchant.id).first();
    ticketsUnread = (tu && tu.n) || 0;
  } catch {}
  return json(c, {
    merchant_name: merchant.qris_merchant_name || merchant.name,
    orders: orders.results || [],
    events: events.results || [],
    stats,
    series: series.results || [],
    tickets_unread: ticketsUnread,
  });
});

// ─────────────────────────────────────────────────────────
// Admin — kelola merchant (butuh akun dengan is_admin=1)
// ─────────────────────────────────────────────────────────
async function requireAdmin(c) {
  const m = await requireMerchant(c);
  return m && (m.is_admin || m.is_owner) ? m : null;
}
async function requireOwner(c) {
  const m = await requireMerchant(c);
  return m && m.is_owner ? m : null;
}

// List merchant + statistik ringkas per merchant
app.get('/api/admin/merchants', async (c) => {
  if (!(await requireAdmin(c))) return json(c, { error: 'unauthorized' }, 401);
  await ensure2fa(c.env.DB);
  const r = await c.env.DB.prepare(
    `SELECT m.id, m.name, m.username, m.api_key, m.device_id, m.fee_percent, m.unique_digits,
            m.active, m.is_admin, m.is_owner, m.totp_enabled, m.last_seen, m.created_at,
            (m.qris_static IS NOT NULL) as has_qris,
            (SELECT COUNT(*) FROM orders o WHERE o.merchant_id = m.id) as total_orders,
            (SELECT COUNT(*) FROM orders o WHERE o.merchant_id = m.id AND o.status='paid') as paid_orders,
            (SELECT COALESCE(SUM(base_amount),0) FROM orders o WHERE o.merchant_id = m.id AND o.status='paid') as revenue
     FROM merchants m ORDER BY m.created_at DESC`,
  ).all();
  const me = await requireMerchant(c);
  return json(c, { merchants: r.results || [], me_is_owner: !!(me && me.is_owner) });
});

// Owner: jadikan / cabut admin (owner only)
app.post('/api/admin/merchants/:id/set-admin', async (c) => {
  const owner = await requireOwner(c);
  if (!owner) return json(c, { error: 'hanya owner yang bisa atur admin' }, 403);
  const id = c.req.param('id');
  const body = await c.req.json().catch(() => ({}));
  const target = await c.env.DB.prepare('SELECT id, is_owner FROM merchants WHERE id = ?').bind(id).first();
  if (!target) return json(c, { error: 'merchant tidak ditemukan' }, 404);
  if (target.is_owner) return json(c, { error: 'tidak bisa ubah role owner' }, 400);
  const makeAdmin = body.admin ? 1 : 0;
  await c.env.DB.prepare('UPDATE merchants SET is_admin = ? WHERE id = ?').bind(makeAdmin, id).run();
  return json(c, { ok: true, is_admin: makeAdmin });
});

// Suspend / aktifkan
app.post('/api/admin/merchants/:id/active', async (c) => {
  if (!(await requireAdmin(c))) return json(c, { error: 'unauthorized' }, 401);
  const body = await c.req.json().catch(() => ({}));
  const active = body.active ? 1 : 0;
  await c.env.DB.prepare('UPDATE merchants SET active = ? WHERE id = ?').bind(active, c.req.param('id')).run();
  return json(c, { ok: true, active });
});

// Hapus merchant
app.post('/api/admin/merchants/:id/delete', async (c) => {
  const admin = await requireAdmin(c);
  if (!admin) return json(c, { error: 'unauthorized' }, 401);
  const id = c.req.param('id');
  if (id === admin.id) return json(c, { error: 'tidak bisa hapus akun admin sendiri' }, 400);
  await c.env.DB.prepare('DELETE FROM merchants WHERE id = ?').bind(id).run();
  return json(c, { ok: true });
});

// Reset password → password baru random
app.post('/api/admin/merchants/:id/reset-password', async (c) => {
  if (!(await requireAdmin(c))) return json(c, { error: 'unauthorized' }, 401);
  await ensure2fa(c.env.DB);
  const newPass = hex(6);
  const { salt, hash } = await hashPassword(newPass);
  // set flag must_change_pw → user dipaksa ganti PW pas login berikutnya
  await c.env.DB.prepare('UPDATE merchants SET password_hash = ?, password_salt = ?, must_change_pw = 1 WHERE id = ?')
    .bind(hash, salt, c.req.param('id')).run();
  return json(c, { ok: true, new_password: newPass });
});

// Reset / matikan 2FA user (buat kasus authenticator hilang)
app.post('/api/admin/merchants/:id/reset-2fa', async (c) => {
  if (!(await requireAdmin(c))) return json(c, { error: 'unauthorized' }, 401);
  await ensure2fa(c.env.DB);
  await c.env.DB.prepare('UPDATE merchants SET totp_enabled = 0, totp_secret = NULL WHERE id = ?')
    .bind(c.req.param('id')).run();
  return json(c, { ok: true });
});

// Regenerate API key
app.post('/api/admin/merchants/:id/regenerate-key', async (c) => {
  if (!(await requireAdmin(c))) return json(c, { error: 'unauthorized' }, 401);
  const apiKey = 'sk_live_' + hex(16);
  await c.env.DB.prepare('UPDATE merchants SET api_key = ? WHERE id = ?').bind(apiKey, c.req.param('id')).run();
  return json(c, { ok: true, api_key: apiKey });
});

// Statistik global
app.get('/api/admin/stats', async (c) => {
  if (!(await requireAdmin(c))) return json(c, { error: 'unauthorized' }, 401);
  const merchants = await c.env.DB.prepare('SELECT COUNT(*) as n, SUM(active) as active FROM merchants').first();
  const orders = await c.env.DB.prepare(
    `SELECT COUNT(*) as total,
       SUM(CASE WHEN status='paid' THEN 1 ELSE 0 END) as paid,
       SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) as pending,
       SUM(CASE WHEN status='paid' THEN base_amount ELSE 0 END) as revenue
     FROM orders`,
  ).first();
  let ticketsUnread = 0;
  try {
    await ensureTickets(c.env.DB);
    const tu = await c.env.DB.prepare('SELECT COUNT(*) as n FROM tickets WHERE admin_unread = 1').first();
    ticketsUnread = (tu && tu.n) || 0;
  } catch {}
  return json(c, { merchants, orders, tickets_unread: ticketsUnread });
});

// Log global (order + event lintas merchant)
app.get('/api/admin/log', async (c) => {
  if (!(await requireAdmin(c))) return json(c, { error: 'unauthorized' }, 401);
  const orders = await c.env.DB.prepare(
    `SELECT o.*, m.username FROM orders o LEFT JOIN merchants m ON m.id=o.merchant_id
     ORDER BY o.created_at DESC LIMIT 100`,
  ).all();
  const events = await c.env.DB.prepare(
    `SELECT e.*, m.username FROM events e LEFT JOIN merchants m ON m.id=e.merchant_id
     ORDER BY e.created_at DESC LIMIT 100`,
  ).all();
  return json(c, { orders: orders.results || [], events: events.results || [] });
});

// Halaman admin
app.get('/admin', (c) => page(c, renderAdmin()));

// Site settings — baca (admin) & simpan (admin)
app.get('/api/admin/settings', async (c) => {
  if (!(await requireAdmin(c))) return json(c, { error: 'unauthorized' }, 401);
  return json(c, await getSettings(c.env.DB));
});
app.post('/api/admin/settings', async (c) => {
  if (!(await requireAdmin(c))) return json(c, { error: 'unauthorized' }, 401);
  const body = await c.req.json().catch(() => ({}));
  await ensureSettings(c.env.DB);
  const saved = {};
  for (const k of SETTINGS_KEYS) {
    if (body[k] === undefined) continue;
    let v = String(body[k]).slice(0, 300);
    if (k === 'theme_color' && !/^#[0-9a-fA-F]{3,8}$/.test(v)) continue; // abaikan warna invalid
    if (['pwa_enabled', 'wa_enabled', 'tg_enabled'].includes(k)) v = body[k] ? '1' : '0';
    await c.env.DB.prepare(
      'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    ).bind(k, v).run();
    saved[k] = v;
  }
  return json(c, { ok: true, ...(await getSettings(c.env.DB)) });
});

// Admin: list semua tiket + ubah status
app.get('/api/admin/tickets', async (c) => {
  if (!(await requireAdmin(c))) return json(c, { error: 'unauthorized' }, 401);
  await ensureTickets(c.env.DB);
  const r = await c.env.DB.prepare(
    `SELECT t.*, m.username,
            (SELECT COUNT(*) FROM ticket_messages tm WHERE tm.ticket_id = t.id) as msg_count
     FROM tickets t LEFT JOIN merchants m ON m.id = t.merchant_id
     ORDER BY t.updated_at DESC LIMIT 200`,
  ).all();
  return json(c, { tickets: r.results || [] });
});
app.post('/api/admin/tickets/:id/status', async (c) => {
  if (!(await requireAdmin(c))) return json(c, { error: 'unauthorized' }, 401);
  await ensureTickets(c.env.DB);
  const b = await c.req.json().catch(() => ({}));
  const st = String(b.status || '');
  if (!TICKET_STATUS.includes(st)) return json(c, { error: 'status harus active/proses/close' }, 400);
  await c.env.DB.prepare('UPDATE tickets SET status = ?, updated_at = ? WHERE id = ?')
    .bind(st, now(), c.req.param('id')).run();
  return json(c, { ok: true, status: st });
});

export default app;
