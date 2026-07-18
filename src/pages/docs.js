// Docs page — dokumentasi API. Gaya kotak siku.

export function renderDocs() {
  return `<!DOCTYPE html>
<html lang="id"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dokumentasi · GatePay</title>
<style>
  :root{--bg:#0f1115;--card:#171a21;--card2:#1e222b;--bd:#2b3038;--tx:#eef0f4;--dim:#9aa3b2;--brand:#3ddc97;--brandink:#04120b;--code:#0b0d11}
  *{box-sizing:border-box;border-radius:0!important;margin:0;padding:0}
  body{font-family:'Inter',-apple-system,'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--tx);line-height:1.65}
  a{color:var(--brand);text-decoration:none}
  nav{border-bottom:1px solid var(--bd);position:sticky;top:0;background:rgba(15,17,21,.92);backdrop-filter:blur(8px);z-index:10}
  nav .in{max-width:1080px;margin:0 auto;padding:0 20px;display:flex;align-items:center;justify-content:space-between;height:60px}
  .logo{font-weight:800;font-size:19px;letter-spacing:-.5px;color:var(--tx);display:flex;align-items:center;gap:8px}
  .logo .mark{background:var(--brand);color:var(--brandink);width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center}
  .btn{padding:9px 16px;font-weight:700;font-size:13px;border:1px solid var(--bd);background:var(--card2);color:var(--tx)}
  .layout{max-width:1080px;margin:0 auto;padding:32px 20px;display:grid;grid-template-columns:200px 1fr;gap:40px}
  .side{position:sticky;top:92px;align-self:start;font-size:14px}
  .side a{display:block;color:var(--dim);padding:6px 0;border-left:2px solid transparent;padding-left:12px}
  .side a:hover{color:var(--tx);border-left-color:var(--brand)}
  .side .h{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--dim);margin:16px 0 6px;padding-left:12px}
  main{min-width:0}
  h1{font-size:34px;font-weight:800;letter-spacing:-1px;margin-bottom:8px}
  .lead{color:var(--dim);font-size:16px;margin-bottom:32px}
  h2{font-size:22px;font-weight:700;margin:36px 0 12px;padding-top:12px;border-top:1px solid var(--bd)}
  h3{font-size:16px;margin:20px 0 8px}
  p{margin-bottom:12px;color:#cdd3dd}
  code{background:var(--card2);padding:2px 6px;font-family:'JetBrains Mono',Consolas,monospace;font-size:13px;color:var(--brand)}
  pre{background:var(--code);border:1px solid var(--bd);padding:16px;overflow-x:auto;margin:12px 0;font-family:'JetBrains Mono',Consolas,monospace;font-size:13px;line-height:1.6}
  pre code{background:none;padding:0;color:#cdd3dd}
  .method{display:inline-block;font-weight:700;font-size:12px;padding:3px 8px;margin-right:8px}
  .post{background:#123a2a;color:var(--brand)}
  .get{background:#12294a;color:#6aa6ff}
  table{width:100%;border-collapse:collapse;margin:12px 0;font-size:14px}
  th,td{text-align:left;padding:8px 10px;border:1px solid var(--bd)}
  th{background:var(--card2);color:var(--dim);font-size:12px;text-transform:uppercase}
  .tip{background:var(--card);border:1px solid var(--bd);border-left:3px solid var(--brand);padding:12px 14px;margin:14px 0;font-size:14px}
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
    <a href="#callback">Callback</a>
    <div class="h">Lain</div>
    <a href="#checkout">Halaman Checkout</a>
    <a href="#flow">Alur Lengkap</a>
  </aside>
  <main>
    <h1>Dokumentasi GatePay</h1>
    <p class="lead">Payment gateway QRIS. Bikin order → customer scan QRIS dinamis → pembayaran terkonfirmasi otomatis.</p>

    <h2 id="intro">Pengantar</h2>
    <p>Base URL semua endpoint:</p>
    <pre><code>https://gatepay.julianspes.workers.dev</code></pre>
    <p>Nanti bisa pakai custom domain (mis. <code>https://gatepay.biz.id</code>).</p>

    <h2 id="auth">Autentikasi</h2>
    <p>Endpoint merchant butuh header <code>x-api-key</code> berisi API key kamu.</p>
    <pre><code>x-api-key: sk_live_xxxxxxxxxxxxxxxx</code></pre>

    <h2 id="qris">Setup QRIS</h2>
    <p>Upload QRIS statis kamu sekali (dari DANA Bisnis / e-wallet). Sistem pakai ini buat generate QRIS dinamis per order.</p>
    <p><span class="method post">POST</span><code>/api/merchant/qris</code></p>
    <pre><code>curl -X POST https://gatepay.julianspes.workers.dev/api/merchant/qris \\
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
    <pre><code>curl -X POST https://gatepay.julianspes.workers.dev/api/orders \\
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
    <pre><code>curl https://gatepay.julianspes.workers.dev/api/orders/ord_xxx \\
  -H "x-api-key: sk_live_xxx"</code></pre>
    <p>Status: <code>pending</code> · <code>paid</code> · <code>expired</code> · <code>cancelled</code>.</p>

    <h2 id="cancel">Cancel Order</h2>
    <p><span class="method post">POST</span><code>/api/orders/:id/cancel</code></p>

    <h2 id="callback">Callback (Webhook)</h2>
    <p>Kalau merchant punya <code>notify_url</code>, GatePay POST ke situ saat order paid:</p>
    <pre><code>{
  "event": "order.paid",
  "order_id": "ord_xxx",
  "reference": "INV-001",
  "base_amount": 10000,
  "unique_amount": 10237,
  "paid_at": 1784351000
}</code></pre>
    <p>Header <code>x-signature</code> = HMAC-SHA256(body, callback_secret). Verifikasi di sisi kamu.</p>

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
