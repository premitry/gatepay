// Landing marketing page — gaya Saweria, sudut kotak siku.

export function renderLanding() {
  return `<!DOCTYPE html>
<html lang="id"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>GatePay — Payment Gateway QRIS Otomatis</title>
<meta name="description" content="Terima pembayaran QRIS DANA otomatis. Bikin order, customer scan, langsung terkonfirmasi. Tanpa ribet API merchant enterprise.">
<style>
  :root{--bg:#0f1115;--card:#171a21;--card2:#1e222b;--bd:#2b3038;--tx:#eef0f4;--dim:#9aa3b2;--brand:#3ddc97;--brandink:#04120b;--accent:#7c6cff}
  *{box-sizing:border-box;border-radius:0!important;margin:0;padding:0}
  body{font-family:'Inter',-apple-system,'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--tx);line-height:1.6}
  a{color:inherit;text-decoration:none}
  .wrap{max-width:1080px;margin:0 auto;padding:0 20px}
  nav{border-bottom:1px solid var(--bd);position:sticky;top:0;background:rgba(15,17,21,.9);backdrop-filter:blur(8px);z-index:10}
  nav .wrap{display:flex;align-items:center;justify-content:space-between;height:64px}
  .logo{font-weight:800;font-size:20px;letter-spacing:-.5px;display:flex;align-items:center;gap:8px}
  .logo .mark{background:var(--brand);color:var(--brandink);width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;font-size:16px}
  .nav-links{display:flex;gap:8px;align-items:center}
  .btn{display:inline-block;padding:11px 20px;font-weight:700;font-size:14px;border:1px solid var(--bd);background:var(--card2);color:var(--tx)}
  .btn.primary{background:var(--brand);color:var(--brandink);border-color:var(--brand)}
  .btn:hover{opacity:.9}
  .hero{padding:80px 0 60px;text-align:center}
  .badge{display:inline-block;padding:6px 14px;background:var(--card2);border:1px solid var(--bd);font-size:12px;color:var(--dim);margin-bottom:24px;text-transform:uppercase;letter-spacing:.08em}
  h1{font-size:52px;font-weight:900;letter-spacing:-2px;line-height:1.05;margin-bottom:20px}
  h1 .hl{color:var(--brand)}
  .sub{font-size:19px;color:var(--dim);max-width:620px;margin:0 auto 32px}
  .cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
  .cta .btn{padding:14px 28px;font-size:15px}
  .stats{display:flex;gap:0;justify-content:center;margin-top:56px;border:1px solid var(--bd);max-width:640px;margin-left:auto;margin-right:auto}
  .stat{flex:1;padding:20px;border-right:1px solid var(--bd)}
  .stat:last-child{border-right:0}
  .stat .n{font-size:26px;font-weight:800;color:var(--brand)}
  .stat .l{font-size:12px;color:var(--dim);text-transform:uppercase;letter-spacing:.05em}
  section{padding:64px 0}
  .sec-title{text-align:center;margin-bottom:44px}
  .sec-title h2{font-size:34px;font-weight:800;letter-spacing:-1px;margin-bottom:10px}
  .sec-title p{color:var(--dim);font-size:16px}
  .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border:1px solid var(--bd)}
  .step{padding:28px 24px;border-right:1px solid var(--bd)}
  .step:last-child{border-right:0}
  .step .num{width:36px;height:36px;background:var(--brand);color:var(--brandink);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;margin-bottom:16px}
  .step h3{font-size:18px;margin-bottom:8px}
  .step p{color:var(--dim);font-size:14px}
  .feats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
  .feat{background:var(--card);border:1px solid var(--bd);padding:24px}
  .feat .ic{font-size:24px;margin-bottom:12px}
  .feat h3{font-size:16px;margin-bottom:6px}
  .feat p{color:var(--dim);font-size:14px}
  .cta-box{background:var(--card);border:1px solid var(--bd);padding:48px 24px;text-align:center}
  .cta-box h2{font-size:30px;font-weight:800;margin-bottom:12px;letter-spacing:-1px}
  .cta-box p{color:var(--dim);margin-bottom:24px}
  footer{border-top:1px solid var(--bd);padding:32px 0;color:var(--dim);font-size:13px}
  footer .wrap{display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px}
  .warn{max-width:640px;margin:24px auto 0;font-size:12px;color:var(--dim);border:1px dashed var(--bd);padding:12px}
  @media(max-width:720px){h1{font-size:36px}.steps,.feats{grid-template-columns:1fr}.step{border-right:0;border-bottom:1px solid var(--bd)}.stat .n{font-size:20px}}
</style></head><body>
<nav><div class="wrap">
  <div class="logo"><span class="mark">G</span>GatePay</div>
  <div class="nav-links">
    <a class="btn" href="/docs">Docs</a>
    <a class="btn primary" href="/dashboard">Dashboard</a>
  </div>
</div></nav>

<header class="hero"><div class="wrap">
  <div class="badge">Payment Gateway QRIS · Indonesia</div>
  <h1>Terima <span class="hl">QRIS</span> otomatis,<br>tanpa ribet.</h1>
  <p class="sub">Bikin order, customer scan QRIS, pembayaran langsung terkonfirmasi otomatis. QRIS statis kamu diubah jadi dinamis dengan nominal terkunci — anti salah transfer.</p>
  <div class="cta">
    <a class="btn primary" href="/dashboard">Mulai Sekarang →</a>
    <a class="btn" href="/docs">Lihat Dokumentasi</a>
  </div>
  <div class="stats">
    <div class="stat"><div class="n">QRIS</div><div class="l">Semua e-wallet</div></div>
    <div class="stat"><div class="n">Real-time</div><div class="l">Konfirmasi</div></div>
    <div class="stat"><div class="n">API</div><div class="l">Integrasi mudah</div></div>
  </div>
  <div class="warn">Saat ini dipakai internal/pribadi. Nominal unik dipakai buat matching otomatis dari notifikasi pembayaran.</div>
</div></header>

<section style="background:var(--card2)"><div class="wrap">
  <div class="sec-title"><h2>Cara Kerja</h2><p>Tiga langkah, pembayaran langsung masuk.</p></div>
  <div class="steps">
    <div class="step"><div class="num">1</div><h3>Bikin Order</h3><p>Panggil API atau lewat dashboard. Sistem generate nominal unik + QRIS dinamis otomatis.</p></div>
    <div class="step"><div class="num">2</div><h3>Customer Scan</h3><p>Customer scan QRIS pakai DANA / e-wallet / m-banking. Nominal udah terkunci, tinggal bayar.</p></div>
    <div class="step"><div class="num">3</div><h3>Auto Konfirmasi</h3><p>Begitu bayar, notifikasi tertangkap & dicocokkan. Order jadi PAID + callback ke sistem kamu.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <div class="sec-title"><h2>Kenapa GatePay</h2><p>Simpel, cepat, dan cocok buat toko kecil sampai SaaS.</p></div>
  <div class="feats">
    <div class="feat"><div class="ic">🔒</div><h3>Nominal Terkunci</h3><p>QRIS dinamis dengan nominal ke-embed. Customer nggak bisa salah nominal.</p></div>
    <div class="feat"><div class="ic">⚡</div><h3>Real-time</h3><p>Konfirmasi otomatis dari notifikasi pembayaran, tanpa cek manual.</p></div>
    <div class="feat"><div class="ic">🧩</div><h3>API Sederhana</h3><p>Satu endpoint bikin order, satu buat cek status. Callback webhook ke sistem kamu.</p></div>
    <div class="feat"><div class="ic">📊</div><h3>Dashboard</h3><p>Pantau order, pembayaran, dan statistik secara live.</p></div>
    <div class="feat"><div class="ic">🏦</div><h3>Semua e-wallet</h3><p>QRIS = 1 kode buat DANA, OVO, GoPay, ShopeePay, m-banking, dll.</p></div>
    <div class="feat"><div class="ic">🚀</div><h3>Tanpa Onboarding Ribet</h3><p>Nggak perlu PKS enterprise. Upload QRIS statis kamu, langsung jalan.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <div class="cta-box">
    <h2>Siap terima pembayaran?</h2>
    <p>Upload QRIS kamu, bikin order pertama, dalam hitungan menit.</p>
    <a class="btn primary" href="/dashboard" style="padding:14px 32px;font-size:15px">Buka Dashboard →</a>
  </div>
</div></section>

<footer><div class="wrap">
  <div class="logo"><span class="mark">G</span>GatePay</div>
  <div>© 2026 GatePay · <a href="/docs">Docs</a> · <a href="/dashboard">Dashboard</a></div>
</div></footer>
</body></html>`;
}
