// Landing marketing page — tema Y2K retro-desktop. Kotak siku.

export function renderLanding() {
  return `<!DOCTYPE html>
<html lang="id"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>GatePay — Payment Gateway QRIS Otomatis</title>
<meta name="description" content="Terima pembayaran QRIS DANA secara otomatis. Buat order, customer melakukan scan, langsung terkonfirmasi. Tanpa kerumitan API merchant enterprise.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Michroma&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
  :root{
    --desk-a:#7fc6c9;--desk-b:#8ea8dc;--desk-c:#6f87c8;--grid:rgba(255,255,255,.34);
    --chrome:#eceade;--chrome-2:#e0ded1;--hi:#ffffff;--edge:#8f8b7e;--edge-dark:#54514a;
    --title-a:#26379d;--title-b:#3f7fc4;--text:#23262e;--dim:#5b5f66;--link:#3843b8;
    --accent:#c26107;--term-bg:#141f5c;--term-text:#dfe6ff;--term-ok:#8fe3f7;--ok:#0e7c66;
  }
  *{box-sizing:border-box;border-radius:0!important;margin:0;padding:0}
  body{font-family:Verdana,Tahoma,Geneva,sans-serif;color:var(--text);font-size:14px;line-height:1.7;
    background:repeating-linear-gradient(0deg,var(--grid) 0 1px,transparent 1px 44px),repeating-linear-gradient(90deg,var(--grid) 0 1px,transparent 1px 44px),linear-gradient(135deg,var(--desk-a),var(--desk-b) 52%,var(--desk-c));background-attachment:fixed;min-height:100vh}
  a{color:var(--link);text-decoration:none}a:hover{text-decoration:underline}
  h1,h2,h3,.logo{font-family:'Michroma',sans-serif;font-weight:400}
  .mono{font-family:'Share Tech Mono',monospace}
  .wrap{max-width:1120px;margin:0 auto;padding:0 20px}
  .out{border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:2px 2px 0 var(--edge)}
  /* nav = window titlebar */
  nav{background:linear-gradient(180deg,var(--chrome),var(--chrome-2));border-bottom:2px solid var(--edge-dark);box-shadow:0 2px 0 var(--edge);position:sticky;top:0;z-index:10}
  nav .wrap{display:flex;align-items:center;justify-content:space-between;height:56px}
  .logo{font-size:17px;display:flex;align-items:center;gap:8px;color:var(--text)}
  .logo .mark{background:var(--accent);color:#fff;width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi)}
  .nav-links{display:flex;gap:10px;align-items:center}
  .btn{display:inline-block;padding:9px 18px;font-weight:700;font-size:13px;cursor:pointer;font-family:Verdana,sans-serif;background:linear-gradient(180deg,var(--chrome),var(--chrome-2));color:var(--text);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi)}
  .btn:hover{filter:brightness(1.04);text-decoration:none}
  .btn:active{border-color:var(--edge-dark) var(--hi) var(--hi) var(--edge-dark)}
  .btn.primary{background:linear-gradient(180deg,#4a86c8,#26379d);color:#fff;border-color:#7fb0e0 #141f5c #141f5c #7fb0e0}
  .btn.primary:active{border-color:#141f5c #7fb0e0 #7fb0e0 #141f5c}
  /* hero */
  .hero{padding:64px 0 48px;text-align:center}
  .badge{display:inline-block;padding:5px 14px;background:var(--term-bg);border:2px solid;border-color:var(--edge-dark) #2b3a7a #2b3a7a var(--edge-dark);font-size:11px;color:var(--term-ok);margin-bottom:24px;letter-spacing:.06em;font-family:'Share Tech Mono',monospace}
  h1{font-size:40px;line-height:1.15;margin-bottom:20px;color:#12235c;text-shadow:1px 1px 0 rgba(255,255,255,.5)}
  h1 .hl{color:var(--accent)}
  .sub{font-size:16px;color:#1c2740;max-width:620px;margin:0 auto 30px;font-family:Verdana,sans-serif}
  .cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
  .cta .btn{padding:13px 26px;font-size:14px}
  .stats{display:flex;margin:52px auto 0;max-width:640px;background:var(--chrome)}
  .stat{flex:1;padding:18px;border-right:2px solid var(--edge)}
  .stat:last-child{border-right:0}
  .stat .n{font-size:18px;font-family:'Michroma';color:var(--title-a)}
  .stat .l{font-size:11px;color:var(--dim);text-transform:uppercase;letter-spacing:.05em;margin-top:4px}
  section{padding:52px 0}
  .win{background:var(--chrome);margin-bottom:0}
  .win .tt{background:linear-gradient(90deg,var(--title-a),var(--title-b));color:#fff;font-family:'Michroma';font-size:11px;padding:8px 14px;border-bottom:2px solid var(--edge-dark)}
  .win .bd2{padding:28px 24px}
  .sec-title{text-align:center;margin-bottom:34px}
  .sec-title h2{font-size:26px;margin-bottom:10px;color:#12235c}
  .sec-title p{color:#1c2740}
  .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  .step{background:var(--chrome);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:1px 1px 0 var(--edge);padding:22px 18px}
  .step .num{width:34px;height:34px;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-family:'Michroma';font-size:14px;margin-bottom:14px;border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi)}
  .step h3{font-size:15px;margin-bottom:8px}
  .step p{color:var(--dim);font-size:13px}
  .feats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  .feat{background:var(--chrome);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:1px 1px 0 var(--edge);padding:20px}
  .feat .ic{font-size:22px;margin-bottom:10px}
  .feat h3{font-size:14px;margin-bottom:6px}
  .feat p{color:var(--dim);font-size:13px}
  .cta-box{background:var(--chrome);text-align:center}
  .cta-box .bd2{padding:44px 24px}
  .cta-box h2{font-size:24px;margin-bottom:12px;color:#12235c}
  .cta-box p{color:var(--dim);margin-bottom:22px}
  .warn{max-width:640px;margin:22px auto 0;font-size:12px;color:var(--term-text);background:var(--term-bg);border:2px solid;border-color:var(--edge-dark) #2b3a7a #2b3a7a var(--edge-dark);padding:12px;font-family:'Share Tech Mono',monospace}
  footer{border-top:2px solid var(--edge-dark);background:linear-gradient(180deg,var(--chrome),var(--chrome-2));padding:24px 0;color:var(--dim);font-size:12px;margin-top:20px}
  footer .wrap{display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px}
  @media(max-width:720px){h1{font-size:30px}.steps,.feats{grid-template-columns:1fr}.stat .n{font-size:15px}}
</style></head><body>
<nav><div class="wrap">
  <div class="logo"><span class="mark">G</span>GatePay</div>
  <div class="nav-links">
    <a class="btn" href="/docs">Docs</a>
    <a class="btn primary" href="/dashboard">Dashboard</a>
  </div>
</div></nav>

<header class="hero"><div class="wrap">
  <div class="badge">▮ PAYMENT_GATEWAY.SYS · QRIS · INDONESIA</div>
  <h1>Terima <span class="hl">QRIS</span> otomatis,<br>tanpa kerumitan.</h1>
  <p class="sub">Buat order, customer scan QRIS, pembayaran langsung terkonfirmasi otomatis. QRIS statis Anda diubah menjadi dinamis dengan nominal terkunci — mencegah kesalahan transfer.</p>
  <div class="cta">
    <a class="btn primary" href="/dashboard">Mulai Sekarang →</a>
    <a class="btn" href="/docs">Lihat Dokumentasi</a>
  </div>
  <div class="stats out">
    <div class="stat"><div class="n">QRIS</div><div class="l">Semua e-wallet</div></div>
    <div class="stat"><div class="n">Real-time</div><div class="l">Konfirmasi</div></div>
    <div class="stat"><div class="n">API</div><div class="l">Integrasi mudah</div></div>
  </div>
  <div class="warn">&gt; Nominal unik digunakan untuk pencocokan otomatis dari notifikasi pembayaran.</div>
</div></header>

<section><div class="wrap">
  <div class="win out">
    <div class="tt">CARA_KERJA.TXT</div>
    <div class="bd2">
      <div class="sec-title"><h2>Cara Kerja</h2><p>Tiga langkah, pembayaran langsung masuk.</p></div>
      <div class="steps">
        <div class="step"><div class="num">1</div><h3>Buat Order</h3><p>Panggil API atau melalui dashboard. Sistem menghasilkan nominal unik + QRIS dinamis secara otomatis.</p></div>
        <div class="step"><div class="num">2</div><h3>Customer Scan</h3><p>Customer scan QRIS menggunakan DANA / e-wallet / m-banking. Nominal sudah terkunci, tinggal melakukan pembayaran.</p></div>
        <div class="step"><div class="num">3</div><h3>Auto Konfirmasi</h3><p>Setelah pembayaran dilakukan, notifikasi tertangkap & dicocokkan. Order menjadi PAID + callback ke sistem Anda.</p></div>
      </div>
    </div>
  </div>
</div></section>

<section><div class="wrap">
  <div class="win out">
    <div class="tt">FITUR.TXT</div>
    <div class="bd2">
      <div class="sec-title"><h2>Kenapa GatePay</h2><p>Sederhana, cepat, dan cocok untuk toko kecil hingga SaaS.</p></div>
      <div class="feats">
        <div class="feat"><div class="ic">🔒</div><h3>Nominal Terkunci</h3><p>QRIS dinamis dengan nominal tertanam. Customer tidak dapat salah nominal.</p></div>
        <div class="feat"><div class="ic">⚡</div><h3>Real-time</h3><p>Konfirmasi otomatis dari notifikasi pembayaran, tanpa pemeriksaan manual.</p></div>
        <div class="feat"><div class="ic">🧩</div><h3>API Sederhana</h3><p>Satu endpoint untuk order, satu untuk memeriksa status. Callback webhook ke sistem Anda.</p></div>
        <div class="feat"><div class="ic">📊</div><h3>Dashboard</h3><p>Pantau order, pembayaran, dan statistik secara live.</p></div>
        <div class="feat"><div class="ic">🏦</div><h3>Semua e-wallet</h3><p>QRIS = 1 kode untuk DANA, OVO, GoPay, ShopeePay, m-banking, dan lain-lain.</p></div>
        <div class="feat"><div class="ic">🚀</div><h3>Tanpa Onboarding Ribet</h3><p>Tidak perlu PKS enterprise. Upload QRIS statis Anda, langsung berjalan.</p></div>
      </div>
    </div>
  </div>
</div></section>

<section><div class="wrap">
  <div class="win out">
    <div class="tt">APLIKASI_DIDUKUNG.TXT</div>
    <div class="bd2">
      <div class="sec-title"><h2>Aplikasi yang Didukung</h2><p>APK penangkap notifikasi GatePay membaca notifikasi "uang masuk" dari aplikasi apa pun di HP Anda.</p></div>
      <div class="feats" style="grid-template-columns:repeat(2,1fr)">
        <div class="feat"><div class="ic">💙</div><h3>DANA &amp; DANA Bisnis</h3><p>Paling utama & paling cepat. Notifikasi transaksi masuk langsung tertangkap.<br><span class="mono" style="font-size:12px;color:var(--accent)">id.dana</span></p></div>
        <div class="feat"><div class="ic">💜</div><h3>E-wallet lain</h3><p>OVO, GoPay, ShopeePay, LinkAja — asalkan menampilkan notifikasi uang masuk.<br><span class="mono" style="font-size:12px;color:var(--accent)">ovo.id · com.gojek.app · com.shopee.id</span></p></div>
        <div class="feat"><div class="ic">🏦</div><h3>Mobile Banking</h3><p>BCA mobile, BRImo, Livin' Mandiri, dan lain-lain — jika memberikan notifikasi kredit masuk.<br><span class="mono" style="font-size:12px;color:var(--accent)">com.bca · id.co.bri.brimo</span></p></div>
        <div class="feat"><div class="ic">➕</div><h3>Bebas Tambah</h3><p>Isi package name aplikasi lain (pisah koma) di APK — apa pun yang notifikasinya memuat nominal Rp.</p></div>
      </div>
      <div class="warn" style="margin-top:20px;text-align:left">&gt; SYARAT: Anda harus upload QRIS statis terlebih dahulu di dashboard. Semua e-wallet/bank di atas membayar ke QRIS tersebut — GatePay hanya mencocokkan nominalnya dari notifikasi. Cara menemukan package name: Setelan HP → Aplikasi → detail aplikasi, atau isi contoh di atas.</div>
    </div>
  </div>
</div></section>

<section><div class="wrap">
  <div class="cta-box out">
    <div class="bd2">
      <h2>Siap terima pembayaran?</h2>
      <p>Upload QRIS Anda, buat order pertama, dalam hitungan menit.</p>
      <a class="btn primary" href="/dashboard" style="padding:13px 30px;font-size:14px">Buka Dashboard →</a>
    </div>
  </div>
</div></section>

<footer><div class="wrap">
  <div class="logo" style="font-size:14px"><span class="mark">G</span>GatePay</div>
  <div>© 2026 GatePay · <a href="/docs">Docs</a> · <a href="/dashboard">Dashboard</a></div>
</div></footer>
</body></html>`;
}
