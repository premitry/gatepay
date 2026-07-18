import { Hono } from 'hono';
import { renderDashboard } from './dashboard.js';
import { makeDynamic, isValidQris, qrisInfo } from './qris.js';
import { renderLanding } from './pages/landing.js';
import { renderDocs } from './pages/docs.js';
import { renderCheckout } from './pages/checkout.js';

const app = new Hono();

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
const now = () => Math.floor(Date.now() / 1000);

function rid(prefix) {
  const b = crypto.getRandomValues(new Uint8Array(12));
  const hex = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
  return `${prefix}_${hex}`;
}

const enc = new TextEncoder();

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

  const device = await c.env.DB.prepare('SELECT * FROM devices WHERE id = ?').bind(deviceId).first();
  if (!device) return json(c, { error: 'unknown device' }, 401);

  const expected = await hmacHex(device.secret, raw);
  if (!safeEqual(expected, signature)) return json(c, { error: 'bad signature' }, 401);

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

  // update last_seen
  await c.env.DB.prepare('UPDATE devices SET last_seen = ? WHERE id = ?').bind(t, deviceId).run();

  // dedup
  const existing = await c.env.DB.prepare('SELECT id, status, matched_order_id FROM events WHERE id = ?')
    .bind(eventId)
    .first();
  if (existing) {
    return json(c, { status: 'duplicate', event_id: eventId, matched_order_id: existing.matched_order_id });
  }

  // matching: cari order pending dgn nominal == amount, belum expired
  let matchedOrder = null;
  if (amount != null && Number.isFinite(amount)) {
    matchedOrder = await c.env.DB.prepare(
      `SELECT * FROM orders
       WHERE status = 'pending' AND unique_amount = ? AND expires_at > ?
       ORDER BY created_at ASC LIMIT 1`,
    )
      .bind(amount, t)
      .first();
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
    `INSERT INTO events (id, device_id, source, amount, sender, raw_text, received_at, matched_order_id, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      eventId,
      deviceId,
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
app.get('/dashboard', async (c) => {
  const orders = await c.env.DB.prepare(
    `SELECT o.*, m.name as merchant_name FROM orders o
     LEFT JOIN merchants m ON m.id = o.merchant_id
     ORDER BY o.created_at DESC LIMIT 50`,
  ).all();
  const events = await c.env.DB.prepare(
    `SELECT * FROM events ORDER BY created_at DESC LIMIT 50`,
  ).all();
  const stats = await c.env.DB.prepare(
    `SELECT
       COUNT(*) as total,
       SUM(CASE WHEN status='paid' THEN 1 ELSE 0 END) as paid,
       SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) as pending,
       SUM(CASE WHEN status='paid' THEN base_amount ELSE 0 END) as revenue
     FROM orders`,
  ).first();
  return c.html(renderDashboard({ orders: orders.results || [], events: events.results || [], stats }));
});

// JSON stats untuk polling dashboard
app.get('/dashboard/data', async (c) => {
  const orders = await c.env.DB.prepare(
    `SELECT o.*, m.name as merchant_name FROM orders o
     LEFT JOIN merchants m ON m.id = o.merchant_id
     ORDER BY o.created_at DESC LIMIT 50`,
  ).all();
  const events = await c.env.DB.prepare(`SELECT * FROM events ORDER BY created_at DESC LIMIT 50`).all();
  const stats = await c.env.DB.prepare(
    `SELECT COUNT(*) as total,
       SUM(CASE WHEN status='paid' THEN 1 ELSE 0 END) as paid,
       SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) as pending,
       SUM(CASE WHEN status='paid' THEN base_amount ELSE 0 END) as revenue
     FROM orders`,
  ).first();
  return json(c, { orders: orders.results || [], events: events.results || [], stats });
});

export default app;
