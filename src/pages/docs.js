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
  .layout{max-width:1160px;margin:0 auto;padding:24px 20px;display:grid;grid-template-columns:220px 1fr;gap:28px}
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
  .demobox{background:var(--term-bg);color:var(--term-text);border:2px solid;border-color:var(--edge-dark) #2b3a7a #2b3a7a var(--edge-dark);padding:16px 18px;margin:16px 0;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
  .demobox .t{font-size:13px}.demobox .t b{color:#8fe3f7}
  .demobox a.dbtn{padding:10px 18px;font-weight:700;font-size:13px;background:linear-gradient(180deg,#4a86c8,#26379d);color:#fff;border:2px solid;border-color:#7fb0e0 #141f5c #141f5c #7fb0e0;white-space:nowrap}
  .demobox a.dbtn:hover{text-decoration:none;filter:brightness(1.08)}
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
    <a href="#create">Buat Order</a>
    <a href="#status">Cek Status</a>
    <a href="#cancel">Cancel Order</a>
    <a href="#callback">Webhook</a>
    <div class="h">Lain</div>
    <a href="#checkout">Halaman Checkout</a>
    <a href="#popup">Popup Pembayaran</a>
    <a href="#flow">Alur Lengkap</a>
  </aside>
  <main>
    <h1>Dokumentasi GatePay</h1>
    <p class="lead">Payment gateway QRIS. Buat order → customer scan QRIS dinamis → pembayaran terkonfirmasi otomatis.</p>

    <h2 id="intro">Pengantar</h2>
    <p>Base URL semua endpoint:</p>
    <pre><code>https://gatepay.biz.id</code></pre>
    <p>Nantinya dapat menggunakan custom domain (mis. <code>https://gatepay.biz.id</code>).</p>

    <h2 id="auth">Autentikasi</h2>
    <p>Endpoint merchant memerlukan header <code>x-api-key</code> berisi API key Anda.</p>
    <pre><code>x-api-key: sk_live_xxxxxxxxxxxxxxxx</code></pre>

    <h2 id="qris">Setup QRIS</h2>
    <p>Upload QRIS statis Anda sekali (dari DANA Bisnis / e-wallet). Sistem menggunakan ini untuk menghasilkan QRIS dinamis per order.</p>
    <p><span class="method post">POST</span><code>/api/merchant/qris</code></p>
    <pre><code>curl -X POST https://gatepay.biz.id/api/merchant/qris \\
  -H "x-api-key: sk_live_xxx" \\
  -H "content-type: application/json" \\
  -d '{"qris": "00020101021126...6304ABCD"}'</code></pre>
    <div class="tip">💡 Isi <code>qris</code> = teks string QRIS statis (bukan gambar). Dapat di-decode dari foto QR menggunakan aplikasi scanner apa saja, atau melalui dashboard.</div>

    <h2 id="deteksi">Deteksi Pembayaran</h2>
    <p>GatePay mengetahui order telah terbayar melalui dua cara (dapat berjalan bersamaan, saling mencadangkan):</p>
    <ul>
      <li><b>APK Catcher (default, universal)</b> — aplikasi Android menangkap notifikasi "uang masuk" (DANA, ShopeePay, OVO, dan lain-lain) lalu mengirim ke GatePay. Memerlukan HP dalam keadaan menyala. Setup melalui menu <b>Kredensial &amp; APK</b> di dashboard.</li>
      <li><b>Token ShopeePay Partner (opsional, tanpa HP)</b> — khusus <b>ShopeePay Partner</b>. GatePay memeriksa mutasi transaksi ShopeePay langsung dari server menggunakan cookie token akun Anda, sehingga pembayaran ShopeePay terkonfirmasi tanpa HP. E-wallet lain tetap memerlukan APK. Aktifkan di dashboard menu <b>QRIS &amp; Order → panel ShopeePay Partner</b>.</li>
    </ul>
    <div class="tip">⚠️ Token ShopeePay Partner tidak resmi (menggunakan cookie sesi portal <code>partner.shopee.co.id</code>) — dapat expired &amp; ada risiko ToS. Jika token tidak aktif, APK catcher otomatis menjadi cadangan. Panduan mengambil token ada di menu <b>Tutorial</b> dashboard.</div>

    <h2 id="create">Buat Order</h2>
    <p><span class="method post">POST</span><code>/api/orders</code></p>
    <table>
      <tr><th>Field</th><th>Tipe</th><th>Keterangan</th></tr>
      <tr><td><code>base_amount</code></td><td>number</td><td>Harga asli (rupiah). Wajib.</td></tr>
      <tr><td><code>reference</code></td><td>string</td><td>Nomor invoice/order Anda. Opsional.</td></tr>
      <tr><td><code>ttl_seconds</code></td><td>number</td><td>Masa berlaku order ini (detik). Default mengikuti setelan <b>Masa Aktif</b> merchant (dashboard → QRIS &amp; Order), fallback 900 (15 mnt).</td></tr>
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
    <div class="tip">💡 <code>unique_amount</code> = nominal unik yang harus dibayar. <code>qris</code> = string QRIS dinamis (render menjadi QR). <code>checkout_url</code> = halaman pembayaran siap pakai.</div>

    <h2 id="status">Cek Status Order</h2>
    <p><span class="method get">GET</span><code>/api/orders/:id</code></p>
    <pre><code>curl https://gatepay.biz.id/api/orders/ord_xxx \\
  -H "x-api-key: sk_live_xxx"</code></pre>
    <p>Status: <code>pending</code> · <code>paid</code> · <code>expired</code> · <code>cancelled</code>.</p>

    <h2 id="cancel">Cancel Order</h2>
    <p><span class="method post">POST</span><code>/api/orders/:id/cancel</code></p>

    <h2 id="callback">Webhook (Callback)</h2>
    <p>Webhook berfungsi agar GatePay <b>memberi kabar otomatis ke sistem Anda</b> setiap ada order yang menjadi <code>paid</code> — sehingga toko/bot/invoice Anda mengetahui tanpa perlu polling status terus-menerus. Opsional; jika hanya menggunakan dashboard, dapat dilewati.</p>

    <h3>Cara mengaktifkan</h3>
    <p>Buka <a href="/dashboard">Dashboard</a> → menu <b>Webhook</b> → isi <b>Notify URL</b> (endpoint Anda) → Simpan. Di sana juga tersedia <b>Callback Secret</b> untuk verifikasi. Atau melalui API:</p>
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
    <p>Header <code>x-signature</code> = <code>HMAC-SHA256(raw_body, callback_secret)</code> (hex). Verifikasi terlebih dahulu sebelum mempercayai isinya:</p>
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
    <div class="tip">💡 Balas HTTP <code>2xx</code> agar GatePay mengetahui webhook diterima. Jika endpoint down, pembayaran tetap tercatat <code>paid</code> di dashboard — webhook hanya notifikasi tambahan.</div>

    <h2 id="checkout">Halaman Checkout</h2>
    <p>Setiap order otomatis memiliki halaman pembayaran di <code>/pay/:id</code> — menampilkan QR, nominal, countdown, dan auto-update menjadi "Berhasil" saat dibayar. Cukup redirect customer ke sana.</p>

    <h2 id="popup">Popup Pembayaran (Snap)</h2>
    <p>Jika tidak ingin redirect customer keluar dari web Anda, gunakan <b>popup pembayaran</b> — mirip Snap Midtrans. QRIS muncul sebagai modal melayang di atas halaman Anda, dan Anda mendapat notifikasi melalui callback tanpa pindah halaman.</p>

    <div class="demobox">
      <div class="t">Ingin melihat langsung bentuknya? <b>Coba demo live</b> — isi API key &amp; nominal, popup muncul persis seperti di produksi.</div>
      <a class="dbtn" href="/snap-demo" target="_blank">🪟 Buka Demo</a>
    </div>

    <h3>1. Pasang loader</h3>
    <p>Letakkan sekali di halaman Anda (biasanya sebelum <code>&lt;/body&gt;</code>):</p>
    <pre><code>&lt;script src="https://gatepay.biz.id/snap.js"&gt;&lt;/script&gt;</code></pre>
    <p>Ini membuat object global <code>GatePay</code> di browser.</p>

    <h3>2. Buat order di backend</h3>
    <p>Sama seperti biasa — <code>POST /api/orders</code> dari server Anda (jangan letakkan <code>x-api-key</code> di frontend!). Ambil <code>id</code> order tersebut, lalu kirim ke halaman.</p>

    <h3>3. Buka popup di frontend</h3>
    <p>Panggil <code>GatePay.pay(orderId, callbacks)</code> — misalnya saat tombol "Bayar" diklik:</p>
    <pre><code>&lt;button onclick="bayar()"&gt;Bayar Sekarang&lt;/button&gt;
&lt;script&gt;
async function bayar(){
  // ambil order id dari backend kamu (yang manggil POST /api/orders)
  const r = await fetch('/checkout/mulai', { method:'POST' });
  const { order_id } = await r.json();

  GatePay.pay(order_id, {
    onSuccess: (o) =&gt; {
      // ✓ QRIS kebayar — nominal terkunci di o.unique_amount
      window.location = '/terima-kasih';
    },
    onPending: (o) =&gt; { console.log('menunggu bayar', o.id); },
    onError:   (o) =&gt; { alert('Order kadaluarsa / batal'); },
    onClose:   ()  =&gt; { console.log('popup ditutup user'); }
  });
}
&lt;/script&gt;</code></pre>

    <h3>Callback</h3>
    <table>
      <tr><th>Callback</th><th>Kapan dipanggil</th></tr>
      <tr><td><code>onSuccess(order)</code></td><td>Order menjadi <code>paid</code>. Popup menutup sendiri ~1.5 dtk kemudian.</td></tr>
      <tr><td><code>onPending(order)</code></td><td>Popup terbuka, order masih <code>pending</code>.</td></tr>
      <tr><td><code>onError(order)</code></td><td>Order <code>expired</code> / <code>cancelled</code>.</td></tr>
      <tr><td><code>onClose()</code></td><td>User menutup popup (tombol ✕, klik luar, atau Esc) sebelum membayar.</td></tr>
    </table>
    <p><code>order</code> yang dikirim ke callback berisi <code>{ id, unique_amount, status }</code>. <code>GatePay.pay()</code> mengembalikan <code>{ close() }</code> jika ingin menutup popup secara manual dari kode Anda.</p>

    <div class="tip">💡 Popup hanya berkaitan dengan tampilan. <b>Sumber kebenaran</b> pembayaran tetap status order di server + <a href="#callback">webhook</a>. Jangan berikan barang/akses hanya karena <code>onSuccess</code> berjalan di browser — verifikasi ulang via webhook atau <code>GET /api/orders/:id</code> di backend.</div>
    <div class="tip">⚠️ Syarat: QRIS statis Anda <b>wajib sudah diatur</b> (lihat <a href="#qris">Setup QRIS</a>), karena popup memuat QRIS dinamis dari sana.</div>

    <h2 id="flow">Alur Lengkap</h2>
    <pre><code>1. (sekali) Upload QRIS statis  → POST /api/merchant/qris
2. Buat order                  → POST /api/orders  → dapat qris + checkout_url
3. Tampilkan QR / redirect ke checkout_url
4. Customer scan & bayar (nominal terkunci)
5. Notifikasi pembayaran tertangkap  → order menjadi PAID
6. Callback ke notify_url Anda (opsional) + periksa via GET status</code></pre>
    <p style="margin-top:32px;color:var(--dim);font-size:13px">Membutuhkan bantuan integrasi? Semua kode tersedia di repo internal.</p>
  </main>
</div>
</body></html>`;
}
