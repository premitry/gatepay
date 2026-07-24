// Landing marketing page — tema Y2K retro-desktop. Kotak siku.

export function renderLanding() {
  return `<!DOCTYPE html>
<html lang="id"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>GatePay — Payment Gateway QRIS Otomatis</title>
<meta name="description" content="GatePay — gateway pembayaran QRIS yang mengonfirmasi transaksi secara otomatis: dari notifikasi perangkat hingga langsung dari akun ShopeePay Partner dan GoPay Merchant Anda. Gratis, nominal terkunci, tanpa pengecekan manual.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Michroma&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
  :root{
    --desk-a:#7fc6c9;--desk-b:#8ea8dc;--desk-c:#6f87c8;--grid:rgba(255,255,255,.34);
    --chrome:#eceade;--chrome-2:#e0ded1;--hi:#ffffff;--edge:#8f8b7e;--edge-dark:#54514a;
    --title-a:#26379d;--title-b:#3f7fc4;--text:#23262e;--dim:#5b5f66;--link:#3843b8;
    --accent:#c26107;--term-bg:#141f5c;--term-text:#dfe6ff;--term-ok:#8fe3f7;--ok:#0e7c66;--red:#b0362a;
  }
  *{box-sizing:border-box;border-radius:0!important;margin:0;padding:0}
  body{font-family:Verdana,Tahoma,Geneva,sans-serif;color:var(--text);font-size:13.5px;line-height:1.65;
    background:repeating-linear-gradient(0deg,var(--grid) 0 1px,transparent 1px 44px),repeating-linear-gradient(90deg,var(--grid) 0 1px,transparent 1px 44px),linear-gradient(135deg,var(--desk-a),var(--desk-b) 52%,var(--desk-c));background-attachment:scroll;min-height:100vh}
  a{color:var(--link);text-decoration:none}a:hover{text-decoration:underline}
  h1,h2,h3,.logo{font-family:'Michroma',sans-serif;font-weight:400}
  .mono{font-family:'Share Tech Mono',monospace}
  .wrap{max-width:1120px;margin:0 auto;padding:0 20px}
  .out{border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:2px 2px 0 var(--edge)}
  nav{background:linear-gradient(180deg,var(--chrome),var(--chrome-2));border-bottom:2px solid var(--edge-dark);box-shadow:0 2px 0 var(--edge);position:sticky;top:0;z-index:10}
  nav .wrap{display:flex;align-items:center;justify-content:space-between;height:56px}
  .logo{font-size:17px;display:flex;align-items:center;gap:8px;color:var(--text)}
  .logo .mark{background:var(--accent);color:#fff;width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi)}
  .nav-links{display:flex;gap:10px;align-items:center}
  .nav-links .nlink{font-size:13px;color:var(--text);font-weight:700;padding:6px 8px}
  .btn{display:inline-block;padding:9px 18px;font-weight:700;font-size:13px;cursor:pointer;font-family:Verdana,sans-serif;background:linear-gradient(180deg,var(--chrome),var(--chrome-2));color:var(--text);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi)}
  .btn:hover{filter:brightness(1.04);text-decoration:none}
  .btn:active{border-color:var(--edge-dark) var(--hi) var(--hi) var(--edge-dark)}
  .btn.primary{background:linear-gradient(180deg,#4a86c8,#26379d);color:#fff;border-color:#7fb0e0 #141f5c #141f5c #7fb0e0}
  .btn.primary:active{border-color:#141f5c #7fb0e0 #7fb0e0 #141f5c}
  /* hero */
  .hero{padding:44px 0 32px;text-align:center}
  .badge{display:inline-block;padding:5px 14px;background:var(--term-bg);border:2px solid;border-color:var(--edge-dark) #2b3a7a #2b3a7a var(--edge-dark);font-size:11px;color:var(--term-ok);margin-bottom:24px;letter-spacing:.06em;font-family:'Share Tech Mono',monospace}
  h1{font-size:clamp(23px,4.5vw,34px);line-height:1.02;margin:0 auto;max-width:900px;color:#12235c;text-shadow:1px 1px 0 rgba(255,255,255,.5);overflow-wrap:break-word}
  h1 .hl{color:var(--accent)}
  .hrule{width:80px;height:3px;margin:18px auto;background:#22d3ee;box-shadow:0 0 10px rgba(34,211,238,.85),0 0 3px rgba(34,211,238,1)}
  .sub{font-size:14.5px;color:#1c2740;max-width:580px;margin:0 auto;line-height:1.65;font-family:Verdana,sans-serif}
  .hlb{color:var(--title-a);font-weight:700}
  .chips{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:14px auto 0;max-width:640px}
  .chip{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:var(--text);background:var(--chrome);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:1px 1px 0 var(--edge);padding:7px 12px;white-space:nowrap}
  .chip .d{width:7px;height:7px;background:#22d3ee;box-shadow:0 0 5px rgba(34,211,238,.9)}
  .cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:22px}
  .cta .btn{padding:12px 22px;font-size:13.5px}
  .subcta{margin-top:12px;font-size:12px;color:#1c2740}
  .subcta b{color:var(--title-a)}
  section{padding:24px 0}
  /* statistik global tanpa kotak */
  .gstats{display:grid;grid-template-columns:repeat(4,1fr);gap:0;max-width:860px;margin:0 auto}
  .gstat{padding:14px 12px;text-align:center;border-right:2px solid rgba(84,81,74,.35);display:flex;flex-direction:column;justify-content:flex-start;align-items:center}
  .gstat:last-child{border-right:0}
  .gn{font-family:'Michroma';font-size:clamp(15px,2vw,21px);line-height:1.15;white-space:nowrap;color:#0d1c4d;-webkit-text-stroke:.7px #0d1c4d;text-shadow:1px 1px 0 rgba(255,255,255,.6)}
  .gl{font-size:12px;font-weight:800;color:#152350;text-transform:uppercase;letter-spacing:.03em;margin-top:8px}
  /* windows */
  .win{background:var(--chrome)}
  .win .tt{background:linear-gradient(90deg,var(--title-a),var(--title-b));color:#fff;font-family:'Michroma';font-size:11px;padding:8px 14px;border-bottom:2px solid var(--edge-dark)}
  .win .bd2{padding:20px 20px}
  .sec-title{text-align:center;margin-bottom:18px}
  .sec-title h2{font-size:18px;margin-bottom:8px;color:#12235c}
  .sec-title p{color:#1c2740}
  .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  .step{background:var(--chrome);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:1px 1px 0 var(--edge);padding:15px 14px}
  .step .num{width:28px;height:28px;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-family:'Michroma';font-size:12px;margin-bottom:10px;border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi)}
  .step h3{font-size:14px;margin-bottom:6px}
  .step p{color:var(--dim);font-size:12.5px;line-height:1.55}
  .feats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
  .feat{background:var(--chrome);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:1px 1px 0 var(--edge);padding:11px 12px}
  .feat .ic{font-size:17px;margin-bottom:5px}
  .feat h3{font-size:13px;margin-bottom:4px}
  .feat p{color:var(--dim);font-size:12px;line-height:1.5}
  .seclist{display:grid;grid-template-columns:1fr 1fr;gap:10px 24px;max-width:720px;margin:0 auto}
  .seci{display:flex;align-items:flex-start;gap:10px;font-size:13px;color:var(--text)}
  .seci .ck{color:var(--ok);font-weight:900;flex:0 0 auto}
  .faq{margin:0;display:grid;grid-template-columns:1fr 1fr;gap:4px 8px;align-items:start}
  .faq details{background:var(--chrome);border:2px solid;border-color:var(--edge-dark) var(--hi) var(--hi) var(--edge-dark);margin-bottom:0}
  .faq summary{cursor:pointer;padding:7px 11px;font-weight:700;font-size:12.5px;list-style:none}
  .faq summary::-webkit-details-marker{display:none}
  .faq summary:before{content:'▸ ';color:var(--title-a)}
  .faq details[open] summary:before{content:'▾ '}
  .faq details>div{padding:0 12px 10px;font-size:12.5px;color:var(--dim);line-height:1.6}
  .foot-note{text-align:center;margin:18px auto 0;font-size:13px;line-height:1.65;color:#1c2b4d;max-width:820px}
  .foot-note a{font-weight:700}
  .cta-box{background:var(--chrome);text-align:center}
  .cta-box .bd2{padding:44px 24px}
  .cta-box h2{font-size:20px;margin-bottom:12px;color:#12235c}
  .cta-box p{color:var(--dim);margin-bottom:22px}
  /* footer */
  footer{border-top:2px solid var(--edge-dark);background:linear-gradient(180deg,var(--chrome),var(--chrome-2));padding:18px 0 12px;color:var(--dim);font-size:12px;margin-top:10px}
  .fcols{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr 1fr;gap:18px;margin-bottom:12px}
  .fcol h4{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--title-a);font-family:'Michroma';margin-bottom:7px}
  .fcol a{display:block;color:var(--dim);padding:2px 0;font-size:12px}
  .fcol a:hover{color:var(--text)}
  .fbrand p{font-size:12px;color:var(--dim);margin-top:8px;max-width:240px;line-height:1.6}
  .fbot{border-top:1px solid var(--edge);padding-top:10px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px}
  @media(max-width:820px){.fcols{grid-template-columns:1fr 1fr}}
  @media(max-width:720px){.steps,.feats{grid-template-columns:1fr}.seclist{grid-template-columns:1fr}.faq{grid-template-columns:1fr}}
  @media(max-width:640px){.gstats{grid-template-columns:1fr 1fr}.gstat{border-bottom:2px solid rgba(84,81,74,.25)}}
</style></head><body id="top">
<nav><div class="wrap">
  <div class="logo"><span class="mark">G</span>GatePay</div>
  <div class="nav-links">
    <a class="nlink" href="#cara-kerja">Cara Kerja</a>
    <a class="nlink" href="#fitur">Fitur</a>
    <a class="btn" href="/docs">Docs</a>
    <a class="btn primary" href="/dashboard">Dashboard</a>
  </div>
</div></nav>

<header class="hero"><div class="wrap">
  <div class="badge">▮ GATEPAY · QRIS PAYMENT GATEWAY · INDONESIA</div>
  <h1>Terima &amp; konfirmasi<br>pembayaran <span class="hl">QRIS otomatis.</span></h1>
  <div class="hrule"></div>
  <p class="sub">Ubah QRIS statis menjadi QRIS dinamis: nominal dikunci dan diberi <span class="hlb" style="white-space:nowrap">kode unik</span> untuk pencocokan <span class="hlb">otomatis</span> setiap pembayaran masuk.</p>
  <div class="chips">
    <span class="chip"><span class="d"></span>🛍 ShopeePay Partner</span>
    <span class="chip"><span class="d"></span>🟢 GoPay Merchant</span>
    <span class="chip"><span class="d"></span>📱 Notifikasi Perangkat</span>
  </div>
  <div class="cta">
    <a class="btn primary" href="/dashboard">Mulai Sekarang →</a>
    <a class="btn" href="/snap-demo" target="_blank">Coba Demo Pembayaran</a>
  </div>
  <div class="subcta"><b>Gratis</b> · Tanpa kartu kredit · Setup ±5 menit · <b>Wajib sudah memiliki QRIS merchant</b></div>
</div></header>

<section id="statistik" style="padding:6px 0"><div class="wrap">
  <div class="sec-title" style="margin-bottom:10px"><h2>Total di Seluruh GatePay</h2><p>Agregat semua merchant — diperbarui langsung.</p></div>
  <div class="gstats">
    <div class="gstat"><div class="gn" id="g-rev">—</div><div class="gl">Total Transaksi</div></div>
    <div class="gstat"><div class="gn" id="g-today">—</div><div class="gl">Sukses Hari Ini</div></div>
    <div class="gstat"><div class="gn" id="g-paid">—</div><div class="gl">Total Sukses</div></div>
    <div class="gstat"><div class="gn" id="g-merch">—</div><div class="gl">Merchant Terdaftar</div></div>
  </div>
</div></section>

<section id="cara-kerja"><div class="wrap">
  <div class="win out">
    <div class="tt">CARA_KERJA.TXT</div>
    <div class="bd2">
      <div class="sec-title"><h2>Cara Kerja</h2><p>Tiga langkah, pembayaran langsung masuk.</p></div>
      <div class="steps">
        <div class="step"><div class="num">1</div><h3>Buat Order</h3><p>Lewat API atau dashboard. Sistem menghasilkan nominal berkode unik + QRIS dinamis secara otomatis.</p></div>
        <div class="step"><div class="num">2</div><h3>Customer Scan</h3><p>Customer scan QRIS menggunakan DANA / e-wallet / m-banking. Nominal sudah terkunci, tinggal membayar.</p></div>
        <div class="step"><div class="num">3</div><h3>Auto Konfirmasi</h3><p>Pembayaran terdeteksi &amp; dicocokkan otomatis. Order menjadi PAID + webhook ke sistem Anda.</p></div>
      </div>
    </div>
  </div>
</div></section>

<section id="fitur"><div class="wrap">
  <div class="win out">
    <div class="tt">FITUR.TXT</div>
    <div class="bd2">
      <div class="sec-title"><h2>Kenapa GatePay</h2><p>Sederhana, cepat, cocok dari toko kecil hingga SaaS.</p></div>
      <div class="feats">
        <div class="feat"><div class="ic">🔒</div><h3>Nominal Terkunci + Kode Unik</h3><p>Nominal tertanam di QRIS dan diberi kode unik, sehingga tiap pembayaran bisa dicocokkan otomatis.</p></div>
        <div class="feat"><div class="ic">⚡</div><h3>Konfirmasi Otomatis</h3><p>Order menjadi PAID dalam hitungan detik* tanpa pemeriksaan manual.</p></div>
        <div class="feat"><div class="ic">🧩</div><h3>API &amp; Popup Pembayaran</h3><p>Satu endpoint untuk order, satu untuk status. Tersedia halaman checkout &amp; popup embed.</p></div>
        <div class="feat"><div class="ic">🔔</div><h3>Webhook HMAC</h3><p>GatePay mengirim callback ke sistem Anda tiap order PAID, ditandatangani HMAC-SHA256.</p></div>
        <div class="feat"><div class="ic">📊</div><h3>Dashboard Live</h3><p>Pantau order, pembayaran, dan statistik secara langsung.</p></div>
        <div class="feat"><div class="ic">🚀</div><h3>Integrasi Cepat</h3><p>Tanpa perjanjian enterprise. Upload QRIS statis Anda, langsung berjalan.</p></div>
      </div>
    </div>
  </div>
</div></section>

<section id="metode"><div class="wrap">
  <div class="win out">
    <div class="tt">METODE_KONFIRMASI.TXT</div>
    <div class="bd2">
      <div class="sec-title"><h2>Metode Konfirmasi Pembayaran</h2><p>Beberapa jalur deteksi yang dapat berjalan bersamaan dan saling mencadangkan.</p></div>
      <div class="feats">
        <div class="feat"><div class="ic">📱</div><h3>Notifikasi Perangkat</h3><p>Aplikasi pendamping menangkap notifikasi "uang masuk" dari DANA, OVO, ShopeePay, GoPay, m-banking, dan lainnya. Memerlukan HP menyala &amp; online.</p></div>
        <div class="feat"><div class="ic">🛍</div><h3>ShopeePay Partner</h3><p>Konfirmasi langsung dari akun ShopeePay Partner Anda secara server-side — tanpa perangkat tambahan.</p></div>
        <div class="feat"><div class="ic">🟢</div><h3>GoPay Merchant</h3><p>Konfirmasi langsung dari akun GoPay Merchant (GoBiz) Anda secara server-side — tanpa perangkat tambahan.</p></div>
      </div>
      <div class="foot-note">* Kecepatan bergantung pada notifikasi aplikasi atau koneksi akun merchant. Integrasi ShopeePay/GoPay menggunakan API internal (tidak resmi) — <a href="/privasi">baca risikonya</a>.</div>
    </div>
  </div>
</div></section>

<section id="penyedia"><div class="wrap">
  <div class="win out">
    <div class="tt">PENYEDIA_QRIS.TXT</div>
    <div class="bd2">
      <div class="sec-title"><h2>Penyedia QRIS yang Didukung</h2><p>Bekerja dengan QRIS statis dari penyedia mana pun. Belum punya? Daftar merchant di salah satu berikut.</p></div>
      <div class="feats" style="grid-template-columns:repeat(2,1fr)">
        <div class="feat"><div class="ic">💙</div><h3>DANA Bisnis</h3><p>QRIS statis dari akun DANA Bisnis Anda.</p></div>
        <div class="feat"><div class="ic">🛍</div><h3>ShopeePay Partner</h3><p>QRIS merchant dari portal ShopeePay Partner.</p></div>
        <div class="feat"><div class="ic">🟢</div><h3>GoPay Merchant (GoBiz)</h3><p>QRIS dari akun GoPay Merchant di GoBiz.</p></div>
        <div class="feat"><div class="ic">🏦</div><h3>Bank / PSP Berlisensi</h3><p>QRIS dari BCA, BRI, Mandiri, atau penyedia jasa pembayaran (PSP) berlisensi QRIS lainnya.</p></div>
      </div>
      <div class="foot-note">Detail aplikasi &amp; package name yang didukung ada di <a href="/docs">dokumentasi</a>.</div>
    </div>
  </div>
</div></section>

<section id="keamanan"><div class="wrap">
  <div class="win out">
    <div class="tt">KEAMANAN.TXT</div>
    <div class="bd2">
      <div class="sec-title"><h2>Dibangun dengan Keamanan yang Jelas</h2><p>Menangani kredensial &amp; pembayaran, jadi keamanan dibuat transparan.</p></div>
      <div class="seclist">
        <div class="seci"><span class="ck">✓</span><span>Kredensial ShopeePay/GoPay <b>dienkripsi AES-GCM 256-bit</b></span></div>
        <div class="seci"><span class="ck">✓</span><span>Webhook ditandatangani <b>HMAC-SHA256</b></span></div>
        <div class="seci"><span class="ck">✓</span><span>Dukungan <b>autentikasi 2FA</b> (Authenticator)</span></div>
        <div class="seci"><span class="ck">✓</span><span>Password akun di-hash <b>PBKDF2</b> (salt unik)</span></div>
        <div class="seci"><span class="ck">✓</span><span><b>API Key dapat dirotasi</b> kapan saja</span></div>
        <div class="seci"><span class="ck">✓</span><span>Data tiap merchant <b>terisolasi</b> per akun</span></div>
      </div>
    </div>
  </div>
</div></section>

<section><div class="wrap">
  <div class="cta-box out">
    <div class="bd2">
      <h2>Siap menerima pembayaran QRIS otomatis?</h2>
      <p>Upload QRIS Anda dan buat order pertama dalam hitungan menit — gratis.</p>
      <div class="cta" style="margin-top:0">
        <a class="btn primary" href="/dashboard" style="padding:13px 30px;font-size:14px">Buka Dashboard →</a>
        <a class="btn" href="/snap-demo" target="_blank">Coba Demo</a>
      </div>
    </div>
  </div>
</div></section>

<section id="faq"><div class="wrap">
  <div class="win out">
    <div class="tt">FAQ.TXT</div>
    <div class="bd2">
      <div class="sec-title"><h2>Pertanyaan Umum</h2></div>
      <div class="faq">
        <details><summary>Apakah saya harus punya QRIS sendiri?</summary><div>Ya. GatePay tidak menerbitkan QRIS baru. Anda harus sudah memiliki QRIS merchant (DANA Bisnis, ShopeePay Partner, GoBiz, bank, atau PSP berlisensi). GatePay mengubah QRIS statis menjadi QRIS dinamis dan mengonfirmasi pembayaran otomatis.</div></details>
        <details><summary>Apakah GatePay benar-benar gratis?</summary><div>Ya. Tidak ada biaya bulanan maupun potongan transaksi. Dana pembayaran tetap masuk langsung ke akun merchant Anda.</div></details>
        <details><summary>Apakah perlu HP Android?</summary><div>Untuk metode notifikasi, ya. HP Android harus menyala, terhubung internet, dan menjalankan aplikasi pendamping. Khusus ShopeePay Partner dan GoPay Merchant tersedia metode tanpa HP.</div></details>
        <details><summary>Apakah saya perlu kartu kredit untuk mendaftar?</summary><div>Tidak. Anda cukup membuat akun, menghubungkan QRIS merchant, lalu mulai membuat pembayaran.</div></details>
        <details><summary>Bagaimana cara kerja GatePay?</summary><div>GatePay membuat QRIS dinamis dengan nominal unik. Setelah pelanggan membayar, sistem akan mendeteksi transaksi dan mengirim webhook ke server Anda secara otomatis.</div></details>
        <details><summary>Berapa lama konfirmasi pembayaran?</summary><div>Umumnya dalam hitungan detik setelah pembayaran berhasil. Kecepatan bergantung pada metode deteksi yang digunakan.</div></details>
        <details><summary>Apakah dana pembayaran masuk ke GatePay?</summary><div>Tidak. Dana tetap masuk langsung ke akun QRIS merchant Anda. GatePay hanya membantu membuat QRIS dinamis dan mengonfirmasi pembayaran — kami tidak pernah menahan atau menampung dana Anda.</div></details>
        <details><summary>Apakah GatePay aman digunakan?</summary><div>Kredensial dienkripsi menggunakan AES-GCM 256-bit, webhook ditandatangani dengan HMAC-SHA256, tersedia autentikasi 2FA, dan API Key dapat dirotasi kapan saja.</div></details>
        <details><summary>Apakah tersedia REST API dan Webhook?</summary><div>Ya. GatePay menyediakan REST API untuk membuat pembayaran serta webhook untuk menerima status transaksi secara otomatis.</div></details>
        <details><summary>Aplikasi apa saja yang didukung?</summary><div>GatePay mendukung berbagai e-wallet dan mobile banking. Daftar lengkap aplikasi yang didukung tersedia pada <a href="/docs">dokumentasi</a>.</div></details>
      </div>
    </div>
  </div>
</div></section>

<footer><div class="wrap">
  <div class="fcols">
    <div class="fcol fbrand">
      <div class="logo" style="font-size:15px"><span class="mark">G</span>GatePay</div>
      <p>Gateway pembayaran QRIS otomatis untuk Indonesia. Nominal terkunci, konfirmasi otomatis.</p>
    </div>
    <div class="fcol">
      <h4>Produk</h4>
      <a href="#cara-kerja">Cara Kerja</a>
      <a href="#fitur">Fitur</a>
      <a href="#metode">Metode Konfirmasi</a>
      <a href="/snap-demo" target="_blank">Demo</a>
    </div>
    <div class="fcol">
      <h4>Developer</h4>
      <a href="/docs">Dokumentasi</a>
      <a href="/docs#create">Buat Order (API)</a>
      <a href="/docs#callback">Webhook</a>
      <a href="/docs#popup">Popup Pembayaran</a>
    </div>
    <div class="fcol">
      <h4>Legal</h4>
      <a href="/privasi">Ketentuan Layanan</a>
      <a href="/privasi">Kebijakan Privasi</a>
    </div>
    <div class="fcol">
      <h4>Akun</h4>
      <a href="/dashboard">Dashboard</a>
      <a href="/dashboard">Daftar / Masuk</a>
      <a href="/dashboard">Tiket Support</a>
    </div>
  </div>
  <div class="fbot">
    <div>© 2026 GatePay · Indonesia</div>
    <div>GatePay bukan bank / PJP / agregator resmi. Dana masuk langsung ke akun Anda.</div>
  </div>
</div></footer>
<script>
  (function(){
    function idr(n){ return 'Rp ' + (Number(n)||0).toLocaleString('id-ID'); }
    fetch('/api/public/stats',{cache:'no-store'}).then(function(r){return r.json();}).then(function(d){
      var set=function(id,v){ var e=document.getElementById(id); if(e) e.textContent=v; };
      set('g-rev', idr(d.revenue));
      set('g-today', (Number(d.today)||0).toLocaleString('id-ID'));
      set('g-paid', (Number(d.paid)||0).toLocaleString('id-ID'));
      set('g-merch', (Number(d.merchants)||0).toLocaleString('id-ID'));
    }).catch(function(){});
  })();
</script>
</body></html>`;
}
