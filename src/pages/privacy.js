// Halaman Kebijakan Privasi — dirujuk dari APK catcher & footer. Gaya kotak siku Y2K.

export function renderPrivacy() {
  return `<!DOCTYPE html>
<html lang="id"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Kebijakan Privasi · GatePay</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Michroma&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
  :root{
    --desk-a:#7fc6c9;--desk-b:#8ea8dc;--desk-c:#6f87c8;--grid:rgba(255,255,255,.34);
    --chrome:#eceade;--chrome-2:#e0ded1;--hi:#ffffff;--edge:#8f8b7e;--edge-dark:#54514a;
    --title-a:#26379d;--title-b:#3f7fc4;--text:#23262e;--dim:#5b5f66;--link:#3843b8;
    --accent:#c26107;--term-bg:#141f5c;--term-text:#dfe6ff;--ok:#0e7c66;--red:#b0362a;
  }
  *{box-sizing:border-box;border-radius:0!important;margin:0;padding:0}
  body{font-family:Verdana,Tahoma,Geneva,sans-serif;color:var(--text);font-size:14px;line-height:1.7;
    background:repeating-linear-gradient(0deg,var(--grid) 0 1px,transparent 1px 44px),repeating-linear-gradient(90deg,var(--grid) 0 1px,transparent 1px 44px),linear-gradient(135deg,var(--desk-a),var(--desk-b) 52%,var(--desk-c));background-attachment:fixed;min-height:100vh}
  a{color:var(--link);text-decoration:none}a:hover{text-decoration:underline}
  h1,h2,.logo{font-family:'Michroma',sans-serif;font-weight:400}
  nav{background:linear-gradient(180deg,var(--chrome),var(--chrome-2));border-bottom:2px solid var(--edge-dark);box-shadow:0 2px 0 var(--edge);position:sticky;top:0;z-index:10}
  nav .in{max-width:820px;margin:0 auto;padding:0 20px;display:flex;align-items:center;justify-content:space-between;height:56px}
  .logo{font-size:16px;color:var(--text);display:flex;align-items:center;gap:8px}
  .logo .mark{background:var(--accent);color:#fff;width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi)}
  .btn{padding:9px 16px;font-weight:700;font-size:13px;background:linear-gradient(180deg,#4a86c8,#26379d);color:#fff;border:2px solid;border-color:#7fb0e0 #141f5c #141f5c #7fb0e0}
  main{max-width:820px;margin:24px auto;padding:0 20px}
  .card{background:var(--chrome);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:2px 2px 0 var(--edge);padding:28px 26px}
  h1{font-size:24px;margin-bottom:6px;color:#12235c}
  .lead{color:var(--dim);font-size:14px;margin-bottom:24px}
  h2{font-size:16px;margin:26px 0 10px;padding:7px 12px;background:linear-gradient(90deg,var(--title-a),var(--title-b));color:#fff;border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi)}
  p{margin-bottom:12px}
  ul{margin:0 0 12px 20px}li{margin-bottom:6px}
  .ok-box{background:#dff3ea;border:2px solid var(--ok);padding:12px 14px;margin:12px 0}
  .no-box{background:#f7dcd9;border:2px solid var(--red);padding:12px 14px;margin:12px 0}
  .ok-box b{color:var(--ok)}.no-box b{color:var(--red)}
  code{background:#fff;padding:2px 6px;font-family:'Share Tech Mono',monospace;font-size:13px;color:var(--accent);border:1px solid var(--edge)}
  .foot{text-align:center;color:var(--dim);font-size:12px;margin:18px 0;font-family:'Share Tech Mono',monospace}
</style></head><body>
<nav><div class="in">
  <a class="logo" href="/"><span class="mark">G</span>GatePay</a>
  <a class="btn" href="/dashboard">Dashboard</a>
</div></nav>
<main>
  <div class="card">
    <h1>Kebijakan Privasi</h1>
    <p class="lead">Berlaku untuk aplikasi <b>GatePay Catcher</b> (penangkap notifikasi pembayaran) dan layanan GatePay.</p>

    <h2>Apa yang aplikasi lakukan</h2>
    <p>GatePay Catcher membantu mendeteksi pembayaran QRIS yang masuk ke akun e-wallet/bank kamu, dengan cara <b>membaca notifikasi</b> dari aplikasi pembayaran yang kamu pilih sendiri (mis. DANA). Saat ada notifikasi transaksi masuk, aplikasi mengambil <b>nominal</b> dan <b>waktu</b>-nya lalu mengirimkannya ke server GatePay milikmu untuk mencocokkan order.</p>

    <h2>Yang kami akses</h2>
    <div class="ok-box">
      <b>✓ Hanya notifikasi</b> dari aplikasi target yang kamu tentukan.<br>
      Data yang dikirim ke server: <code>nominal</code>, <code>waktu</code>, dan teks notifikasi seperlunya untuk pencocokan.
    </div>

    <h2>Yang TIDAK kami akses</h2>
    <div class="no-box">
      Aplikasi ini <b>tidak bisa</b> dan <b>tidak pernah</b>:
      <ul>
        <li>Membaca SMS atau kode OTP</li>
        <li>Membuka kontak, file, galeri, atau foto</li>
        <li>Mengakses lokasi</li>
        <li>Menggunakan VPN atau menyadap lalu lintas internet</li>
        <li>Mengambil alih atau mengendalikan perangkat</li>
      </ul>
      Aplikasi hanya meminta izin <b>Akses Notifikasi</b> + internet. Tidak ada izin SMS, kontak, lokasi, kamera, maupun penyimpanan.
    </div>

    <h2>Penyimpanan & pengiriman data</h2>
    <p>Data transaksi dikirim langsung ke server GatePay yang kamu konfigurasi (endpoint <code>/ingest</code>) memakai kredensial perangkat (Device ID &amp; Secret) milik akunmu. GatePay memakainya hanya untuk menandai order sebagai <b>PAID</b>. Kami tidak menjual atau membagikan data ke pihak ketiga.</p>

    <h2>Kontrol pengguna</h2>
    <p>Kamu bisa mencabut Akses Notifikasi kapan saja lewat <b>Setelan &rarr; Akses notifikasi</b>, atau menghapus aplikasi. Setelah dicabut/dihapus, aplikasi berhenti membaca notifikasi sepenuhnya.</p>

    <h2>Keamanan</h2>
    <p>Aplikasi didistribusikan di luar Play Store (sideload), sehingga Android akan menampilkan peringatan "aplikasi tidak dikenal" — ini normal untuk semua APK non-Play Store dan bukan tanda virus. Izin yang diminta sengaja dibuat seminimal mungkin agar mudah diaudit.</p>

    <h2>Kontak</h2>
    <p>Pertanyaan soal privasi bisa lewat menu <b>Tiket Support</b> di dashboard GatePay.</p>
  </div>
  <div class="foot">GatePay · Kebijakan Privasi</div>
</main>
</body></html>`;
}
