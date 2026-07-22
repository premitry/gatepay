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
    background:repeating-linear-gradient(0deg,var(--grid) 0 1px,transparent 1px 44px),repeating-linear-gradient(90deg,var(--grid) 0 1px,transparent 1px 44px),linear-gradient(135deg,var(--desk-a),var(--desk-b) 52%,var(--desk-c));background-attachment:scroll;min-height:100vh}
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
    <h1>Ketentuan Layanan &amp; Kebijakan Privasi</h1>
    <p class="lead">Berlaku untuk seluruh layanan <b>GatePay</b> — dashboard, API, halaman checkout, aplikasi <b>GatePay Catcher</b>, serta integrasi opsional <b>ShopeePay Partner</b> dan <b>GoPay Merchant</b>.</p>

    <h2>1. Ringkasan Layanan</h2>
    <p>GatePay adalah gateway pembayaran QRIS yang mengubah QRIS statis merchant menjadi QRIS dinamis dengan nominal unik, kemudian mendeteksi pembayaran yang masuk secara otomatis melalui salah satu jalur berikut:</p>
    <ul>
      <li><b>APK Catcher</b> — aplikasi Android membaca notifikasi pembayaran dari aplikasi target yang Anda pilih (mis. DANA, ShopeePay, GoPay), lalu mengirim nominal &amp; waktu ke server GatePay untuk dicocokkan dengan order.</li>
      <li><b>Token ShopeePay Partner (opsional)</b> — GatePay memeriksa mutasi transaksi melalui portal <code>partner.shopee.co.id</code> menggunakan cookie sesi yang Anda tempel sendiri.</li>
      <li><b>Login GoPay Merchant (opsional)</b> — GatePay login otomatis ke portal <code>gobiz.co.id</code> menggunakan email &amp; kata sandi yang Anda masukkan sendiri.</li>
    </ul>

    <h2>2. Data yang Diakses (APK Catcher)</h2>
    <div class="ok-box">
      <b>✓ Hanya notifikasi</b> dari aplikasi target yang Anda tentukan. Data yang dikirim ke server: <code>nominal</code>, <code>waktu</code>, dan teks notifikasi seperlunya untuk pencocokan order.
    </div>
    <div class="no-box" style="margin-top:8px">
      Aplikasi ini <b>tidak dapat</b> dan <b>tidak pernah</b>:
      <ul>
        <li>Membaca SMS atau kode OTP</li>
        <li>Membuka kontak, berkas, galeri, atau foto</li>
        <li>Mengakses lokasi</li>
        <li>Menggunakan VPN atau menyadap lalu lintas internet</li>
        <li>Mengambil alih atau mengendalikan perangkat</li>
      </ul>
      Aplikasi hanya meminta izin <b>Akses Notifikasi</b> + internet. Tidak ada izin SMS, kontak, lokasi, kamera, maupun penyimpanan.
    </div>

    <h2>3. Data yang Diakses (Integrasi ShopeePay &amp; GoPay Opsional)</h2>
    <p>Jika Anda mengaktifkan salah satu integrasi opsional:</p>
    <ul>
      <li><b>ShopeePay Partner</b> — GatePay menyimpan cookie sesi <code>__shopee_partner_website_x_token_live</code> yang Anda tempel. Cookie ini digunakan untuk memanggil endpoint <code>get-transaction-list</code> di portal ShopeePay Partner secara berkala pada saat ada order aktif.</li>
      <li><b>GoPay Merchant</b> — GatePay menyimpan email &amp; kata sandi akun GoPay Merchant Anda. Kredensial ini digunakan untuk login otomatis ke portal GoBiz (<code>api.gobiz.co.id/goid/token</code>), memperbarui <code>access_token</code> saat kedaluwarsa, kemudian memanggil endpoint <i>merchant analytics</i> untuk memeriksa mutasi transaksi.</li>
    </ul>
    <div class="ok-box">
      <b>✓ Enkripsi kredensial.</b> Seluruh kolom sensitif — <b>cookie ShopeePay</b>, <b>kata sandi GoPay</b>, <b>access_token</b>, dan <b>refresh_token</b> GoPay — dienkripsi dengan <b>AES-GCM 256-bit</b> sebelum disimpan ke database. Kunci enkripsi disimpan sebagai <i>Cloudflare Worker secret</i> dan tidak dapat dibaca dari luar server. Bahkan pengelola database tidak dapat melihat kredensial dalam bentuk asli.
    </div>

    <h2>4. Risiko Penggunaan Integrasi Opsional</h2>
    <div class="no-box">
      Anda harus memahami dan menerima risiko berikut sebelum mengaktifkan ShopeePay Partner atau GoPay Merchant:
      <ul>
        <li><b>Tidak resmi.</b> Endpoint ShopeePay Partner dan GoPay Merchant/GoBiz adalah <i>API internal portal web</i>, bukan API publik yang disediakan oleh Shopee/Gojek. Penggunaannya adalah <i>reverse-engineering</i> yang tidak diendorse pihak mereka.</li>
        <li><b>Melanggar Ketentuan Layanan (ToS).</b> Kemungkinan besar penggunaan otomatis melalui integrasi ini melanggar ToS ShopeePay Partner dan GoBiz. <b>Akun Anda dapat diblokir, ditangguhkan, atau di-<i>flag</i></b> oleh pihak Shopee/Gojek tanpa pemberitahuan.</li>
        <li><b>Rapuh.</b> Format request dan response API internal dapat berubah sewaktu-waktu tanpa peringatan. Fitur ini bisa rusak sewaktu-waktu sampai kami sesuaikan.</li>
        <li><b>Dana milik Anda.</b> Akun ShopeePay/GoPay adalah akun uang. Jika akun diblokir sementara, saldo dan pencairan dana dapat tertahan.</li>
        <li><b>IP server.</b> GatePay berjalan di Cloudflare Workers. Pihak Shopee/Gojek dapat memblokir IP data center di kemudian hari.</li>
      </ul>
      <b>Konsekuensi:</b> jika Anda tetap memilih mengaktifkan integrasi opsional, Anda <b>menerima seluruh risiko</b> di atas dan setuju bahwa GatePay <b>tidak bertanggung jawab</b> atas pemblokiran akun, kehilangan akses dana, atau kerugian lain yang timbul akibat pihak Shopee/Gojek. Fitur opsional ini disediakan <i>as-is</i> untuk kenyamanan; jalur default (APK catcher) selalu tersedia sebagai alternatif.
    </div>

    <h2>5. Penyimpanan &amp; Pengiriman Data</h2>
    <p>Data transaksi (nominal, waktu, referensi order) dikirim langsung ke server GatePay menggunakan kredensial perangkat (Device ID &amp; Secret) milik akun Anda. GatePay hanya menggunakan data ini untuk menandai order sebagai <b>PAID</b> dan meneruskan webhook (jika Anda konfigurasi). Kami tidak menjual atau membagikan data ke pihak ketiga.</p>
    <p>Data disimpan di database <b>Cloudflare D1</b> milik akun operator GatePay. Backup dan retensi mengikuti kebijakan Cloudflare. Anda dapat meminta penghapusan akun kapan saja melalui menu <b>Tiket Support</b>.</p>

    <h2>6. Kontrol Pengguna</h2>
    <ul>
      <li><b>APK Catcher.</b> Anda dapat mencabut Akses Notifikasi kapan saja lewat <b>Setelan &rarr; Akses notifikasi</b>, atau menghapus aplikasi. Setelah dicabut/dihapus, aplikasi berhenti membaca notifikasi sepenuhnya.</li>
      <li><b>ShopeePay Partner.</b> Klik <b>🗑 Hapus Token</b> di panel dashboard. Cookie akan dihapus dari database secara permanen.</li>
      <li><b>GoPay Merchant.</b> Klik <b>🗑 Putuskan</b> di panel dashboard. Email, kata sandi, dan seluruh token akan dihapus dari database secara permanen.</li>
      <li><b>Regenerasi API Key.</b> Anda dapat me-<i>regenerate</i> API Key kapan saja di menu Kredensial &amp; APK jika mencurigai kebocoran.</li>
    </ul>

    <h2>7. Keamanan</h2>
    <ul>
      <li>Kredensial ShopeePay/GoPay dienkripsi dengan <b>AES-GCM 256-bit</b> menggunakan kunci yang disimpan sebagai <i>Cloudflare secret</i>.</li>
      <li>Password akun GatePay disimpan dalam bentuk hash <b>PBKDF2-SHA256</b> (100.000 iterasi + salt unik).</li>
      <li>Autentikasi dua faktor (<b>2FA</b>) tersedia di menu Profil.</li>
      <li>Webhook dilindungi tanda tangan <b>HMAC-SHA256</b> agar Anda dapat memverifikasi keaslian payload.</li>
      <li>Seluruh komunikasi dilakukan melalui HTTPS/TLS.</li>
      <li>APK didistribusikan di luar Play Store (sideload), sehingga Android menampilkan peringatan "aplikasi tidak dikenal" — hal ini normal untuk semua APK non-Play Store dan bukan tanda virus. Izin yang diminta sengaja dibuat seminimal mungkin agar mudah diaudit.</li>
    </ul>

    <h2>8. Batasan Tanggung Jawab</h2>
    <p>Layanan GatePay disediakan <b>sebagaimana adanya (as-is)</b>, tanpa jaminan apa pun. GatePay bukan bank, PJP (Penyelenggara Jasa Pembayaran), maupun agregator resmi. GatePay hanya menghubungkan QRIS statis milik Anda dengan sistem pencocokan pembayaran; seluruh dana masuk ke akun e-wallet/bank <b>milik Anda sendiri</b>, GatePay tidak menampung dana pihak ketiga.</p>
    <p>Dalam batas maksimum yang diizinkan hukum, GatePay tidak bertanggung jawab atas kehilangan dana, pemblokiran akun oleh pihak ketiga, keterlambatan konfirmasi, atau kerugian tidak langsung yang timbul dari penggunaan layanan ini.</p>

    <h2>9. Perubahan</h2>
    <p>Kebijakan ini dapat diperbarui sewaktu-waktu. Versi terbaru selalu tersedia di halaman <code>/privasi</code>. Dengan terus menggunakan layanan setelah pembaruan, Anda dianggap menyetujui perubahan tersebut.</p>

    <h2>10. Kontak</h2>
    <p>Pertanyaan seputar ketentuan &amp; privasi dapat dikirim melalui menu <b>Tiket Support</b> di dashboard GatePay.</p>
  </div>
  <div class="foot">GatePay · Kebijakan Privasi</div>
</main>
</body></html>`;
}
