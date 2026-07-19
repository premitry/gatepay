// Docs page — dokumentasi API. Gaya kotak siku.

export function renderDocs() {
  return `<!DOCTYPE html>
<html lang="id"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dokumentasi · GatePay</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Michroma&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
  :root{
    --desk-a:#7fc6c9;--desk-b:#8ea8dc;--desk-c:#6f87c8;--grid:rgba(255,255,255,.34);
    --chrome:#eceade;--chrome-2:#e0ded1;--hi:#ffffff;--edge:#8f8b7e;--edge-dark:#54514a;
    --title-a:#26379d;--title-b:#3f7fc4;--text:#23262e;--dim:#5b5f66;--link:#3843b8;
    --accent:#c26107;--term-bg:#141f5c;--term-text:#dfe6ff;--term-ok:#8fe3f7;
  }
  *{box-sizing:border-box;border-radius:0!important;margin:0;padding:0}
  body{font-family:Verdana,Tahoma,Geneva,sans-serif;color:var(--text);font-size:14px;line-height:1.7;
    background:repeating-linear-gradient(0deg,var(--grid) 0 1px,transparent 1px 44px),repeating-linear-gradient(90deg,var(--grid) 0 1px,transparent 1px 44px),linear-gradient(135deg,var(--desk-a),var(--desk-b) 52%,var(--desk-c));background-attachment:fixed;min-height:100vh}
  a{color:var(--link);text-decoration:none}a:hover{text-decoration:underline}
  h1,h2,h3,.logo{font-family:'Michroma',sans-serif;font-weight:400}
  nav{background:linear-gradient(180deg,var(--chrome),var(--chrome-2));border-bottom:2px solid var(--edge-dark);box-shadow:0 2px 0 var(--edge);position:sticky;top:0;z-index:10}
  nav .in{max-width:1080px;margin:0 auto;padding:0 20px;display:flex;align-items:center;justify-content:space-between;height:56px}
  .logo{font-size:16px;color:var(--text);display:flex;align-items:center;gap:8px}
  .logo .mark{background:var(--accent);color:#fff;width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi)}
  .btn{padding:9px 16px;font-weight:700;font-size:13px;background:linear-gradient(180deg,#4a86c8,#26379d);color:#fff;border:2px solid;border-color:#7fb0e0 #141f5c #141f5c #7fb0e0}
  .btn:active{border-color:#141f5c #7fb0e0 #7fb0e0 #141f5c}
  .layout{max-width:1080px;margin:0 auto;padding:24px 20px;display:grid;grid-template-columns:210px 1fr;gap:26px}
  .side{position:sticky;top:80px;align-self:start;font-size:13px;background:var(--chrome);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:2px 2px 0 var(--edge);padding:12px}
  .side a{display:block;color:var(--dim);padding:5px 0;border-left:3px solid transparent;padding-left:10px}
  .side a:hover{color:var(--text);border-left-color:var(--accent);text-decoration:none}
  .side .h{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--title-a);margin:14px 0 6px;padding-left:10px;font-weight:700;font-family:'Michroma'}
  main{min-width:0;background:var(--chrome);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:2px 2px 0 var(--edge);padding:28px 26px}
  h1{font-size:26px;margin-bottom:8px;color:#12235c}
  .lead{color:var(--dim);font-size:15px;margin-bottom:28px}
  h2{font-size:17px;margin:32px 0 12px;padding:7px 12px;background:linear-gradient(90deg,var(--title-a),var(--title-b));color:#fff;border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi)}
  h3{font-size:14px;margin:20px 0 8px;font-family:Verdana,sans-serif;font-weight:700}
  p{margin-bottom:12px;color:var(--text)}
  code{background:#fff;padding:2px 6px;font-family:'Share Tech Mono',Consolas,monospace;font-size:13px;color:var(--accent);border:1px solid var(--edge)}
  pre{background:var(--term-bg);border:2px solid;border-color:var(--edge-dark) #2b3a7a #2b3a7a var(--edge-dark);padding:16px;overflow-x:auto;margin:12px 0;font-family:'Share Tech Mono',Consolas,monospace;font-size:13px;line-height:1.6}
  pre code{background:none;padding:0;color:var(--term-text);border:0}
  .method{display:inline-block;font-weight:700;font-size:11px;padding:3px 8px;margin-right:8px;font-family:'Share Tech Mono',monospace;border:1px solid rgba(0,0,0,.3)}
  .post{background:var(--ok,#0e7c66);color:#fff}
  .get{background:var(--title-a);color:#fff}
  table{width:100%;border-collapse:collapse;margin:12px 0;font-size:13px}
  th,td{text-align:left;padding:8px 10px;border:1px solid var(--edge)}
  th{background:linear-gradient(180deg,#3f7fc4,#26379d);color:#fff;font-size:11px;text-transform:uppercase}
  .tip{background:#fff6d9;border:2px solid var(--accent);padding:12px 14px;margin:14px 0;font-size:13px}
  @media(max-width:760px){.layout{grid-template-columns:1fr}.side{position:static}}
</style></head><body>
<nav><div class="in">
  <a class="logo" href="/"><span class="mark">G</span>GatePay</a>
  <a class="btn" href="/dashboard">Dashboard</a>
</div></nav>
<div class="layout">
  <aside class="side">
    <div class="h">Mulai</div>
    <a href="#intro">Pengantar</a>
    <a href="#auth">Autentikasi</a>
    <a href="#qris">Setup QRIS</a>
    <div class="h">API</div>
    <a href="#create">Bikin Order</a>
    <a href="#status">Cek Status</a>
    <a href="#cancel">Cancel Order</a>
    <a href="#callback">Webhook</a>
    <div class="h">Lain</div>
    <a href="#checkout">Halaman Checkout</a>
    <a href="#flow">Alur Lengkap</a>
  </aside>
  <main>
    <h1>Dokumentasi GatePay</h1>
    <p class="lead">Payment gateway QRIS. Bikin order → customer scan QRIS dinamis → pembayaran terkonfirmasi otomatis.</p>

    <h2 id="intro">Pengantar</h2>
    <p>Base URL semua endpoint:</p>
    <pre><code>https://gatepay.biz.id</code></pre>
    <p>Nanti bisa pakai custom domain (mis. <code>https://gatepay.biz.id</code>).</p>

    <h2 id="auth">Autentikasi</h2>
    <p>Endpoint merchant butuh header <code>x-api-key</code> berisi API key kamu.</p>
    <pre><code>x-api-key: sk_live_xxxxxxxxxxxxxxxx</code></pre>

    <h2 id="qris">Setup QRIS</h2>
    <p>Upload QRIS statis kamu sekali (dari DANA Bisnis / e-wallet). Sistem pakai ini buat generate QRIS dinamis per order.</p>
    <p><span class="method post">POST</span><code>/api/merchant/qris</code></p>
    <pre><code>curl -X POST https://gatepay.biz.id/api/merchant/qris \\
  -H "x-api-key: sk_live_xxx" \\
  -H "content-type: application/json" \\
  -d '{"qris": "00020101021126...6304ABCD"}'</code></pre>
    <div class="tip">💡 Isi <code>qris</code> = teks string QRIS statis (bukan gambar). Bisa di-decode dari foto QR pakai app scanner apa aja, atau lewat dashboard.</div>

    <h2 id="create">Bikin Order</h2>
    <p><span class="method post">POST</span><code>/api/orders</code></p>
    <table>
      <tr><th>Field</th><th>Tipe</th><th>Keterangan</th></tr>
      <tr><td><code>base_amount</code></td><td>number</td><td>Harga asli (rupiah). Wajib.</td></tr>
      <tr><td><code>reference</code></td><td>string</td><td>Nomor invoice/order kamu. Opsional.</td></tr>
      <tr><td><code>ttl_seconds</code></td><td>number</td><td>Masa berlaku (detik). Default 900.</td></tr>
    </table>
    <pre><code>curl -X POST https://gatepay.biz.id/api/orders \\
  -H "x-api-key: sk_live_xxx" \\
  -H "content-type: application/json" \\
  -d '{"base_amount": 10000, "reference": "INV-001"}'</code></pre>
    <p>Response:</p>
    <pre><code>{
  "id": "ord_xxx",
  "status": "pending",
  "base_amount": 10000,
  "unique_amount": 10237,
  "qris": "00020101021226...6304XXXX",
  "checkout_url": "https://.../pay/ord_xxx",
  "expires_in": 900
}</code></pre>
    <div class="tip">💡 <code>unique_amount</code> = nominal unik yang harus dibayar. <code>qris</code> = string QRIS dinamis (render jadi QR). <code>checkout_url</code> = halaman bayar siap pakai.</div>

    <h2 id="status">Cek Status Order</h2>
    <p><span class="method get">GET</span><code>/api/orders/:id</code></p>
    <pre><code>curl https://gatepay.biz.id/api/orders/ord_xxx \\
  -H "x-api-key: sk_live_xxx"</code></pre>
    <p>Status: <code>pending</code> · <code>paid</code> · <code>expired</code> · <code>cancelled</code>.</p>

    <h2 id="cancel">Cancel Order</h2>
    <p><span class="method post">POST</span><code>/api/orders/:id/cancel</code></p>

    <h2 id="callback">Webhook (Callback)</h2>
    <p>Webhook bikin GatePay <b>ngasih kabar otomatis ke sistem kamu</b> tiap ada order yang jadi <code>paid</code> — jadi toko/bot/invoice kamu tau tanpa perlu polling status terus. Opsional; kalau cuma pakai dashboard, skip aja.</p>

    <h3>Cara aktifin</h3>
    <p>Buka <a href="/dashboard">Dashboard</a> → menu <b>Webhook</b> → isi <b>Notify URL</b> (endpoint kamu) → Simpan. Di situ juga ada <b>Callback Secret</b> buat verifikasi. Atau lewat API:</p>
    <pre><code>curl -X POST https://gatepay.biz.id/api/merchant/settings \\
  -H "x-api-key: sk_live_xxx" \\
  -H "content-type: application/json" \\
  -d '{"notify_url": "https://sistem-kamu.com/webhook/gatepay"}'</code></pre>

    <h3>Payload yang dikirim</h3>
    <p>GatePay <span class="method post">POST</span> ke <code>notify_url</code> saat order paid:</p>
    <pre><code>{
  "event": "order.paid",
  "order_id": "ord_xxx",
  "reference": "INV-001",
  "base_amount": 10000,
  "unique_amount": 10237,
  "paid_at": 1784351000
}</code></pre>
    <p>Header <code>x-signature</code> = <code>HMAC-SHA256(raw_body, callback_secret)</code> (hex). Verifikasi dulu sebelum percaya isinya:</p>
    <pre><code>// Node.js / Cloudflare Worker
import crypto from 'crypto';

app.post('/webhook/gatepay', (req, res) =&gt; {
  const raw = req.rawBody;                    // string body mentah
  const sig = req.headers['x-signature'];
  const expect = crypto.createHmac('sha256', CALLBACK_SECRET)
                       .update(raw).digest('hex');
  if (sig !== expect) return res.status(401).end();   // bukan dari GatePay

  const ev = JSON.parse(raw);
  if (ev.event === 'order.paid') {
    // ✓ tandai invoice lunas / kirim produk / approve member
  }
  res.json({ ok: true });                     // balas 2xx = sukses
});</code></pre>
    <div class="tip">💡 Balas HTTP <code>2xx</code> supaya GatePay tau webhook diterima. Kalau endpoint down, pembayaran tetap tercatat <code>paid</code> di dashboard — webhook cuma notifikasi tambahan.</div>

    <h2 id="checkout">Halaman Checkout</h2>
    <p>Tiap order otomatis punya halaman bayar di <code>/pay/:id</code> — nampilin QR, nominal, countdown, dan auto-update jadi "Berhasil" pas dibayar. Tinggal redirect customer ke situ.</p>

    <h2 id="flow">Alur Lengkap</h2>
    <pre><code>1. (sekali) Upload QRIS statis  → POST /api/merchant/qris
2. Bikin order                  → POST /api/orders  → dapat qris + checkout_url
3. Tampilkan QR / redirect ke checkout_url
4. Customer scan & bayar (nominal terkunci)
5. Notif pembayaran tertangkap  → order jadi PAID
6. Callback ke notify_url kamu (opsional) + cek via GET status</code></pre>
    <p style="margin-top:32px;color:var(--dim);font-size:13px">Butuh bantuan integrasi? Semua kode open di repo internal.</p>
  </main>
</div>
</body></html>`;
}
