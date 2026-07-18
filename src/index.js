import { Hono } from 'hono';
import { renderDashboard } from './dashboard.js';
import { makeDynamic, isValidQris, qrisInfo } from './qris.js';
import { renderLanding } from './pages/landing.js';
import { renderDocs } from './pages/docs.js';
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
// Auth middleware
// ─────────────────────────────────────────────────────────
async function requireMerchant(c) {
  const key = c.req.header('x-api-key') || '';
  if (!key) return null;
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
  const m = await c.env.DB.prepare('SELECT * FROM merchants WHERE username = ?').bind(username).first();
  if (!m || !m.password_hash) return json(c, { error: 'username / password salah' }, 401);
  const ok = await verifyPassword(password, m.password_salt, m.password_hash);
  if (!ok) return json(c, { error: 'username / password salah' }, 401);
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

  const ttl = parseInt(body.ttl_seconds ?? c.env.ORDER_TTL_SECONDS ?? '900', 10);
  const t = now();
  const expires = t + ttl;

  // Fee: dari param order, fallback ke setting merchant, fallback 0
  const feePct = body.fee_percent != null ? Number(body.fee_percent) : (merchant.fee_percent || 0);
  const feeAmount = Math.round((base * feePct) / 100);
  const subtotal = base + feeAmount;

  // Kode unik: panjang digit dari setting merchant (default 2 → kode 1..99)
  const digits = merchant.unique_digits || 2;
  const codeMax = Math.pow(10, digits) - 1; // 2 digit → 99

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
  });
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
  await c.env.DB.prepare('UPDATE merchants SET fee_percent = ?, unique_digits = ? WHERE id = ?')
    .bind(fee, digits, merchant.id)
    .run();
  return json(c, { ok: true, fee_percent: fee, unique_digits: digits });
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
  const ok = await verifyPassword(oldP, merchant.password_salt, merchant.password_hash);
  if (!ok) return json(c, { error: 'password lama salah' }, 401);
  const { salt, hash } = await hashPassword(newP);
  await c.env.DB.prepare('UPDATE merchants SET password_hash = ?, password_salt = ? WHERE id = ?')
    .bind(hash, salt, merchant.id).run();
  return json(c, { ok: true });
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
  return c.html(renderCheckout({ order, qris }));
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
app.get('/', (c) => c.html(renderLanding()));
app.get('/docs', (c) => c.html(renderDocs()));

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
app.get('/dashboard', (c) => c.html(renderDashboard()));

// Data dashboard — WAJIB api key merchant. Scoped ke order milik merchant itu.
app.get('/dashboard/data', async (c) => {
  const merchant = await requireMerchant(c);
  if (!merchant) return json(c, { error: 'invalid api key' }, 401);

  const orders = await c.env.DB.prepare(
    `SELECT * FROM orders WHERE merchant_id = ? ORDER BY created_at DESC LIMIT 50`,
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
  return json(c, {
    merchant_name: merchant.qris_merchant_name || merchant.name,
    orders: orders.results || [],
    events: events.results || [],
    stats,
  });
});

// ─────────────────────────────────────────────────────────
// Admin — kelola merchant (butuh akun dengan is_admin=1)
// ─────────────────────────────────────────────────────────
async function requireAdmin(c) {
  const m = await requireMerchant(c);
  return m && m.is_admin ? m : null;
}

// List merchant + statistik ringkas per merchant
app.get('/api/admin/merchants', async (c) => {
  if (!(await requireAdmin(c))) return json(c, { error: 'unauthorized' }, 401);
  const r = await c.env.DB.prepare(
    `SELECT m.id, m.name, m.username, m.api_key, m.device_id, m.fee_percent, m.unique_digits,
            m.active, m.is_admin, m.last_seen, m.created_at,
            (m.qris_static IS NOT NULL) as has_qris,
            (SELECT COUNT(*) FROM orders o WHERE o.merchant_id = m.id) as total_orders,
            (SELECT COUNT(*) FROM orders o WHERE o.merchant_id = m.id AND o.status='paid') as paid_orders,
            (SELECT COALESCE(SUM(base_amount),0) FROM orders o WHERE o.merchant_id = m.id AND o.status='paid') as revenue
     FROM merchants m ORDER BY m.created_at DESC`,
  ).all();
  return json(c, { merchants: r.results || [] });
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
  const newPass = hex(6);
  const { salt, hash } = await hashPassword(newPass);
  await c.env.DB.prepare('UPDATE merchants SET password_hash = ?, password_salt = ? WHERE id = ?')
    .bind(hash, salt, c.req.param('id')).run();
  return json(c, { ok: true, new_password: newPass });
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
  return json(c, { merchants, orders });
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
app.get('/admin', (c) => c.html(renderAdmin()));

export default app;
