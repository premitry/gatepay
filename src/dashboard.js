// Dashboard merchant — tema Y2K / retro-desktop (niru sendtestemail.com).
// Layout sidebar collapsible. Login/register, QRIS+fee, order, kredensial APK, webhook. Kotak siku.

export function renderDashboard() {
  return `<!DOCTYPE html>
<html lang="id"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dashboard · GatePay</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Michroma&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
  :root{
    --desk-a:#7fc6c9;--desk-b:#8ea8dc;--desk-c:#6f87c8;--grid:rgba(255,255,255,.34);
    --chrome:#eceade;--chrome-2:#e0ded1;--hi:#ffffff;--edge:#8f8b7e;--edge-dark:#54514a;
    --title-a:#26379d;--title-b:#3f7fc4;--text:#23262e;--dim:#5b5f66;--link:#3843b8;
    --accent:#c26107;--term-bg:#141f5c;--term-text:#dfe6ff;--term-ok:#8fe3f7;
    --ok:#0e7c66;--warn:#a05a00;--bad:#b0362a;
    /* alias biar inline style lama tetap jalan */
    --card:#eceade;--card2:#e0ded1;--bd:#8f8b7e;--tx:#23262e;--brand:#26379d;--brandink:#fff;
  }
  *{box-sizing:border-box;border-radius:0!important;margin:0;padding:0}
  body{
    font-family:Verdana,Tahoma,Geneva,sans-serif;color:var(--text);font-size:13px;line-height:1.6;
    background:
      repeating-linear-gradient(0deg,var(--grid) 0 1px,transparent 1px 44px),
      repeating-linear-gradient(90deg,var(--grid) 0 1px,transparent 1px 44px),
      linear-gradient(135deg,var(--desk-a),var(--desk-b) 52%,var(--desk-c));
    background-attachment:fixed;min-height:100vh;
  }
  a{color:var(--link);text-decoration:none}
  a:hover{text-decoration:underline}
  .hidden{display:none!important}
  h1,h2,.logo,.ptitle,.mark,.av{font-family:'Michroma',sans-serif}
  .mono,textarea,.cred .v,#rbreak{font-family:'Share Tech Mono',Consolas,monospace}

  /* bevel helpers */
  .out{border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:1px 1px 0 var(--edge)}
  .in{border:2px solid;border-color:var(--edge-dark) var(--hi) var(--hi) var(--edge-dark)}

  input,textarea{width:100%;background:#fff;border:2px solid;border-color:var(--edge-dark) var(--hi) var(--hi) var(--edge-dark);color:var(--text);padding:8px 9px;font-family:inherit;font-size:13px}
  textarea{resize:vertical;min-height:60px}
  label{display:block;font-size:11px;color:var(--dim);margin:9px 0 4px;text-transform:uppercase;letter-spacing:.04em}

  button{background:linear-gradient(180deg,#4a86c8,#26379d);color:#fff;border:2px solid;border-color:#7fb0e0 #141f5c #141f5c #7fb0e0;padding:9px 16px;font-weight:700;font-size:12px;cursor:pointer;margin-top:10px;width:100%;letter-spacing:.02em}
  button:hover{filter:brightness(1.06)}
  button:active{border-color:#141f5c #7fb0e0 #7fb0e0 #141f5c}
  button.sec{background:linear-gradient(180deg,var(--chrome),var(--chrome-2));color:var(--text);border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi)}
  button.sec:active{border-color:var(--edge-dark) var(--hi) var(--hi) var(--edge-dark)}

  .msg{font-size:12px;margin-top:8px;padding:8px;display:none;border:2px solid}
  .msg.ok{background:#dff3ea;color:var(--ok);border-color:var(--ok);display:block}
  .msg.err{background:#f7dcd9;color:var(--bad);border-color:var(--bad);display:block}
  .dim{color:var(--dim);font-size:12px}
  .lnk{font-size:12px}

  /* ── AUTH ── */
  .authwrap{max-width:400px;margin:70px auto;padding:0 20px}
  .authcard{background:var(--chrome);padding:0}
  .authcard .tt{background:linear-gradient(90deg,var(--title-a),var(--title-b));color:#fff;font-family:'Michroma';font-size:12px;padding:8px 12px;display:flex;align-items:center;gap:8px}
  .authcard .bd2{padding:22px}
  .authcard h1{font-size:20px;font-weight:400;margin-bottom:4px}
  .authcard .sub{color:var(--dim);font-size:12px;margin-bottom:18px}
  .tabs{display:flex;margin-bottom:16px}
  .tabs div{flex:1;text-align:center;padding:9px;font-size:12px;cursor:pointer;color:var(--text);background:linear-gradient(180deg,var(--chrome),var(--chrome-2));border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi)}
  .tabs div.active{background:linear-gradient(180deg,#4a86c8,#26379d);color:#fff;font-weight:700;border-color:#141f5c #7fb0e0 #7fb0e0 #141f5c}

  /* ── SHELL ── */
  #appview{display:flex;min-height:100vh}
  .sidebar{width:232px;flex-shrink:0;background:var(--chrome);border-right:2px solid var(--edge-dark);display:flex;flex-direction:column;position:fixed;top:0;bottom:0;left:0;z-index:40;transition:width .16s;box-shadow:2px 0 0 var(--edge)}
  .side-top{display:flex;align-items:center;justify-content:space-between;height:52px;padding:0 12px;background:linear-gradient(90deg,var(--title-a),var(--title-b));border-bottom:2px solid var(--edge-dark)}
  .logo{font-size:15px;color:#fff;display:flex;align-items:center;gap:8px;white-space:nowrap;overflow:hidden}
  .logo .mark{background:var(--accent);color:#fff;width:24px;height:24px;min-width:24px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;border:1px solid rgba(0,0,0,.3)}
  .collapse{background:linear-gradient(180deg,var(--chrome),var(--chrome-2));border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);color:var(--text);width:auto;margin:0;padding:2px 8px;font-size:13px;font-weight:700}
  .collapse:active{border-color:var(--edge-dark) var(--hi) var(--hi) var(--edge-dark)}
  .snav{flex:1;overflow-y:auto;padding:8px}
  .snav .grp{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--dim);padding:12px 6px 4px;white-space:nowrap;overflow:hidden;font-weight:700}
  .navi{display:flex;align-items:center;gap:11px;padding:9px 10px;color:var(--text);cursor:pointer;font-size:13px;white-space:nowrap;overflow:hidden;margin-bottom:3px;border:2px solid transparent}
  .navi:hover{background:var(--chrome-2);border-color:var(--edge) var(--hi) var(--hi) var(--edge)}
  .navi.active{background:linear-gradient(90deg,#26379d,#3f7fc4);color:#fff;font-weight:700;border-color:#141f5c #7fb0e0 #7fb0e0 #141f5c}
  .navi .ic{font-size:16px;width:20px;min-width:20px;text-align:center}
  .side-bot{border-top:2px solid var(--edge);padding:10px 12px;display:flex;align-items:center;justify-content:space-between;gap:8px;white-space:nowrap;overflow:hidden;background:var(--chrome-2)}
  .side-bot .who{display:flex;align-items:center;gap:9px;overflow:hidden}
  .side-bot .av{width:28px;height:28px;min-width:28px;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi)}
  .side-bot .lo{color:var(--bad);cursor:pointer;font-size:16px;font-weight:700}
  /* collapsed */
  body.col .sidebar{width:60px}
  body.col .logo span:last-child,body.col .snav .grp,body.col .navi .lbl,body.col .side-bot .txt{display:none}
  body.col .navi{justify-content:center;padding:9px 0;gap:0}
  body.col .side-top{padding:0 6px;justify-content:center}
  body.col .side-top .logo{display:none}
  body.col .side-bot{justify-content:center;padding:10px 6px}
  body.col .side-bot .who{gap:0}

  .content{flex:1;margin-left:232px;min-width:0;transition:margin .16s}
  body.col .content{margin-left:60px}
  .topbar{height:52px;background:linear-gradient(180deg,var(--chrome),var(--chrome-2));border-bottom:2px solid var(--edge-dark);display:flex;align-items:center;gap:14px;padding:0 18px;position:sticky;top:0;z-index:20;box-shadow:0 2px 0 var(--edge)}
  .topbar .ptitle{font-size:13px;color:var(--text)}
  .topbar .burger{display:none;background:linear-gradient(180deg,var(--chrome),var(--chrome-2));border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);color:var(--text);width:auto;margin:0;padding:4px 10px}
  .live{font-size:11px;color:var(--ok);display:flex;align-items:center;gap:6px;margin-left:auto;font-family:'Share Tech Mono',monospace}
  .livedot{width:9px;height:9px;background:var(--ok);display:inline-block;animation:bl 1.4s infinite;border:1px solid rgba(0,0,0,.3)}
  @keyframes bl{50%{opacity:.3}}
  .page{padding:22px;max-width:1000px}
  .view{display:none}
  .view.on{display:block}

  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px}
  .stat{background:var(--chrome);padding:12px 14px;border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:1px 1px 0 var(--edge)}
  .stat .k{color:var(--dim);font-size:10px;text-transform:uppercase;letter-spacing:.05em}
  .stat .v{font-size:20px;font-weight:700;margin-top:3px;font-family:'Share Tech Mono',monospace}
  .stat .v.g{color:var(--ok)}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}

  /* panel = window */
  .panel{background:var(--chrome);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:2px 2px 0 var(--edge);padding:0 16px 16px;margin-bottom:16px}
  .panel h2{font-family:'Michroma';font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#fff;margin:0 -16px 14px;padding:7px 14px;background:linear-gradient(90deg,var(--title-a),var(--title-b));border-bottom:2px solid var(--edge-dark)}

  .res{margin-top:12px;padding:12px;background:#fff;border:2px solid;border-color:var(--edge-dark) var(--hi) var(--hi) var(--edge-dark)}
  .res{display:none}.res.show{display:block}
  .res .amt{font-size:22px;font-weight:700;font-family:'Share Tech Mono',monospace;color:var(--accent)}
  #qrcanvas{background:#fff;padding:8px;margin-top:8px;max-width:210px;border:2px solid var(--edge-dark)}
  #qrprev{max-width:120px;margin-top:8px;display:none;background:#fff;padding:4px;border:2px solid var(--edge-dark)}
  #rbreak{white-space:pre-line}

  table{width:100%;border-collapse:collapse;font-size:12px}
  th{text-align:left;color:#fff;font-weight:700;padding:7px 8px;font-size:10px;text-transform:uppercase;background:linear-gradient(180deg,#3f7fc4,#26379d)}
  td{padding:7px 8px;border-bottom:1px solid var(--edge);vertical-align:top}
  tr:nth-child(even) td{background:rgba(255,255,255,.4)}
  tr:hover td{background:#fff6d9}
  .bd{padding:2px 8px;font-size:10px;font-weight:700;text-transform:uppercase;border:1px solid rgba(0,0,0,.35)}
  .pager{display:flex;align-items:center;gap:8px;justify-content:flex-end;margin-top:12px}
  .pager button{width:auto;margin:0;padding:5px 12px}
  .pager button:disabled{opacity:.4;cursor:default}
  .pager .pinfo{font-size:11px;color:var(--dim);font-family:'Share Tech Mono',monospace}

  /* kredensial = terminal navy */
  .cred{background:var(--term-bg);border:2px solid;border-color:var(--edge-dark) #2b3a7a #2b3a7a var(--edge-dark);padding:9px 10px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;gap:8px}
  .cred .l{font-size:10px;color:#8fa0d8;text-transform:uppercase;letter-spacing:.04em}
  .cred .v{font-size:12px;word-break:break-all;color:var(--term-ok)}
  .cred button{width:auto;margin:0;padding:5px 10px;font-size:10px}

  .scrim{display:none}
  @media(max-width:820px){
    .stats{grid-template-columns:repeat(2,1fr)}.grid2{grid-template-columns:1fr}
    .sidebar{transform:translateX(-100%);transition:transform .18s;width:232px}
    body.col .sidebar{width:232px}
    body.mnav .sidebar{transform:translateX(0)}
    .content{margin-left:0!important}
    .topbar .burger{display:block}
    body.mnav .scrim{display:block;position:fixed;inset:0;background:rgba(20,31,92,.45);z-index:35}
  }
</style></head><body>

<!-- ══ AUTH ══ -->
<div id="authview">
  <div class="authwrap"><div class="authcard out">
    <div class="tt"><span class="mark" style="background:var(--accent);color:#fff;width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;font-size:11px">G</span> GATEPAY.EXE</div>
    <div class="bd2">
      <h1>GatePay</h1>
      <div class="sub">Masuk atau daftar untuk kelola payment gateway kamu.</div>
      <div class="tabs">
        <div id="tab-login" class="active" onclick="switchTab('login')">Masuk</div>
        <div id="tab-reg" onclick="switchTab('reg')">Daftar</div>
      </div>
      <label>Username</label>
      <input id="u" type="text" placeholder="username" autocomplete="username">
      <label>Password</label>
      <input id="p" type="password" placeholder="password" autocomplete="current-password">
      <button id="authbtn" onclick="doAuth()">Masuk</button>
      <div class="msg" id="amsg"></div>
      <div class="dim" style="font-size:11px;margin-top:14px" id="reghint"></div>
    </div>
  </div></div>
</div>

<!-- ══ APP ══ -->
<div id="appview" class="hidden">
  <div class="scrim" onclick="toggleMnav(false)"></div>
  <aside class="sidebar">
    <div class="side-top">
      <a class="logo" href="/"><span class="mark">G</span><span>GatePay</span></a>
      <button class="collapse" onclick="toggleCollapse()" title="Sembunyikan">‹</button>
    </div>
    <nav class="snav" id="snav">
      <div class="grp">Menu</div>
      <div class="navi active" data-view="dash" onclick="go('dash')"><span class="ic">🏠</span><span class="lbl">Dashboard</span></div>
      <div class="navi" data-view="qris" onclick="go('qris')"><span class="ic">💳</span><span class="lbl">QRIS &amp; Order</span></div>
      <div class="grp">Integrasi</div>
      <div class="navi" data-view="apk" onclick="go('apk')"><span class="ic">🔑</span><span class="lbl">Kredensial &amp; APK</span></div>
      <div class="navi" data-view="hook" onclick="go('hook')"><span class="ic">🔗</span><span class="lbl">Webhook</span></div>
      <div class="grp">Akun</div>
      <div class="navi" data-view="pw" onclick="go('pw')"><span class="ic">🔒</span><span class="lbl">Ganti Password</span></div>
      <div class="navi hidden" id="nav-events" data-view="events" onclick="go('events')"><span class="ic">📡</span><span class="lbl">Events Device</span></div>
      <div class="navi hidden" id="nav-admin" data-view="admin" onclick="go('admin')"><span class="ic">👑</span><span class="lbl">Admin</span></div>
    </nav>
    <div class="side-bot">
      <div class="who"><span class="av" id="avatar">?</span><span class="txt mono" id="whoami"></span></div>
      <span class="lo txt" onclick="logout()" title="Keluar">⎋</span>
    </div>
  </aside>

  <div class="content">
    <div class="topbar">
      <button class="burger" onclick="toggleMnav(true)">☰</button>
      <div class="ptitle" id="ptitle">Dashboard</div>
      <div class="live"><span class="livedot"></span>LIVE · 3s</div>
    </div>
    <div class="page">

      <!-- DASHBOARD -->
      <section class="view on" id="v-dash">
        <div class="stats">
          <div class="stat"><div class="k">Total Order</div><div class="v" id="s-total">0</div></div>
          <div class="stat"><div class="k">Paid</div><div class="v g" id="s-paid">0</div></div>
          <div class="stat"><div class="k">Pending</div><div class="v" id="s-pending">0</div></div>
          <div class="stat"><div class="k">Revenue</div><div class="v" id="s-rev">Rp 0</div></div>
        </div>
        <div class="panel">
          <h2>STATISTIK.CHT · 14 hari</h2>
          <div style="height:230px;position:relative"><canvas id="chart"></canvas></div>
        </div>
        <div class="panel">
          <h2>DELIVERY_RECORD.LOG</h2>
          <table><thead><tr><th>ID</th><th>Nominal</th><th>Status</th><th>Ref</th><th>Checkout</th><th>Waktu</th></tr></thead>
          <tbody id="otbody"><tr><td colspan=6 class=dim style="text-align:center;padding:20px">Belum ada order</td></tr></tbody></table>
          <div class="pager">
            <span class="pinfo" id="opinfo"></span>
            <button class="sec" id="oprev" onclick="pageOrders(-1)">‹ Prev</button>
            <button class="sec" id="onext" onclick="pageOrders(1)">Next ›</button>
          </div>
        </div>
      </section>

      <!-- QRIS & ORDER (gabung) -->
      <section class="view" id="v-qris">
        <div class="grid2">
          <div class="panel">
            <h2>QRIS_STATIS.CFG · Langkah 1</h2>
            <div class="dim" style="margin-bottom:8px">Wajib duluan. Upload foto QRIS statis DANA Bisnis kamu → Decode → Simpan. Order nggak bisa dibuat sebelum QRIS ke-set.</div>
            <label>Upload QR (foto/gambar)</label>
            <input type="file" id="qrfile" accept="image/*">
            <button class="sec" onclick="decodeQr()">🔍 Decode QR</button>
            <img id="qrprev">
            <label>Hasil QRIS String</label>
            <textarea id="qris" placeholder="hasil decode (atau paste manual)"></textarea>
            <button onclick="uploadQris()">Simpan QRIS</button>
            <div class="msg" id="qmsg"></div>
            <div id="qstat" class="dim" style="margin-top:10px;font-family:'Share Tech Mono',monospace"></div>
            <div style="display:flex;gap:10px;margin-top:12px;border-top:1px solid var(--edge);padding-top:12px">
              <div style="flex:1"><label>Fee (%)</label><input id="fee" type="number" step="0.1" placeholder="7"></div>
              <div style="flex:1"><label>Digit kode</label><input id="digits" type="number" min="1" max="3" placeholder="2"></div>
            </div>
            <div class="dim" style="font-size:11px;margin-top:4px">Fee ditambah di atas nominal, kode unik disisipkan di digit terakhir buat matching otomatis.</div>
            <button class="sec" onclick="saveSettings()">Simpan Fee</button>
            <div class="msg" id="smsg"></div>
          </div>

          <div class="panel">
            <h2>NEW_ORDER.EXE · Langkah 2</h2>
            <div id="noqris" class="dim" style="margin-bottom:10px;padding:8px;background:#fff6d9;border:2px solid var(--accent);color:#3a2a00;display:none">⚠ Set QRIS statis dulu di panel kiri sebelum buat order.</div>
            <label>Nominal (Rp)</label>
            <input id="amt" type="number" placeholder="10000">
            <label>Reference (opsional)</label>
            <input id="ref" type="text" placeholder="INV-001">
            <button onclick="createOrder()">Buat Order + QR</button>
            <div class="msg" id="omsg"></div>
            <div class="res" id="ores">
              <div class="dim" id="rbreak" style="font-size:12px;margin-bottom:8px"></div>
              <div class="dim">Bayar persis</div>
              <div class="amt" id="ramt"></div>
              <canvas id="qrcanvas"></canvas>
              <div style="margin-top:8px"><a class="lnk" id="rlink" target="_blank">Buka halaman checkout ↗</a></div>
            </div>
          </div>
        </div>
      </section>

      <!-- KREDENSIAL & APK -->
      <section class="view" id="v-apk">
        <div class="panel" style="max-width:640px">
          <h2>CREDENTIALS.SYS</h2>
          <div class="dim" style="margin-bottom:10px">Buat integrasi API + setup HP penangkap notif pembayaran. Rahasiakan.</div>
          <div class="cred"><div><div class="l">API Key (sk_live)</div><div class="v" id="c-api">-</div></div><button class="sec" onclick="cp('c-api')">Copy</button></div>
          <div class="cred"><div><div class="l">Device ID (APK)</div><div class="v" id="c-devid">-</div></div><button class="sec" onclick="cp('c-devid')">Copy</button></div>
          <div class="cred"><div><div class="l">Device Secret (APK)</div><div class="v" id="c-devsec">-</div></div><button class="sec" onclick="cp('c-devsec')">Copy</button></div>
          <div class="cred"><div><div class="l">Server URL (APK)</div><div class="v">https://gatepay.biz.id</div></div><button class="sec" onclick="cpTxt('https://gatepay.biz.id')">Copy</button></div>
          <a href="/gatepay-catcher.apk" download><button>⬇ Download APK Catcher</button></a>
          <div class="dim" style="font-size:11px;margin-top:8px">Install APK di HP → isi Server URL, Device ID, Device Secret di atas → aktifkan Notification Access.</div>
        </div>
      </section>

      <!-- WEBHOOK -->
      <section class="view" id="v-hook">
        <div class="panel" style="max-width:640px">
          <h2>WEBHOOK.CFG</h2>
          <div class="dim" style="margin-bottom:10px">Opsional. GatePay nembak POST ke URL ini tiap ada order <b>PAID</b>, jadi sistem kamu (toko/bot/invoice) tau otomatis tanpa polling. Kosongkan kalau cuma pakai dashboard.</div>
          <label>Notify URL</label>
          <input id="notify" type="url" placeholder="https://sistem-kamu.com/webhook/gatepay">
          <button onclick="saveHook()">Simpan Webhook</button>
          <div class="msg" id="hmsg"></div>
          <div class="cred" style="margin-top:14px"><div><div class="l">Callback Secret (verifikasi HMAC)</div><div class="v" id="c-cbsec">-</div></div><button class="sec" onclick="cp('c-cbsec')">Copy</button></div>
          <div class="dim" style="font-size:11px;margin-top:8px;white-space:pre-line">Payload contoh:
{"event":"order.paid","order_id":"ord_xxx","reference":"INV-001","unique_amount":10237,"paid_at":1784...}
Header <b>x-signature</b> = HMAC-SHA256(body, callback_secret). Detail di <a href="/docs#callback">Docs</a>.</div>
        </div>
      </section>

      <!-- GANTI PASSWORD -->
      <section class="view" id="v-pw">
        <div class="panel" style="max-width:420px">
          <h2>PASSWORD.SYS</h2>
          <label>Password Lama</label><input id="oldpw" type="password" placeholder="password sekarang">
          <label>Password Baru</label><input id="newpw" type="password" placeholder="minimal 6 karakter">
          <button onclick="changePw()">Ganti Password</button>
          <div class="msg" id="pwmsg"></div>
        </div>
      </section>

      <!-- EVENTS (admin only) -->
      <section class="view" id="v-events">
        <div class="panel">
          <h2>DEVICE_EVENTS.LOG</h2>
          <table><thead><tr><th>Event</th><th>Nominal</th><th>Status</th><th>Raw</th><th>Waktu</th></tr></thead>
          <tbody id="etbody"><tr><td colspan=5 class=dim style="text-align:center;padding:20px">Belum ada event</td></tr></tbody></table>
          <div class="pager">
            <span class="pinfo" id="epinfo"></span>
            <button class="sec" id="eprev" onclick="pageEvents(-1)">‹ Prev</button>
            <button class="sec" id="enext" onclick="pageEvents(1)">Next ›</button>
          </div>
        </div>
      </section>

      <!-- ADMIN -->
      <section class="view" id="v-admin">
        <div class="panel" style="max-width:420px">
          <h2>ADMIN.EXE</h2>
          <div class="dim" style="margin-bottom:8px">Kamu punya akses admin — kelola semua merchant, statistik global, & monitoring device.</div>
          <a href="/admin"><button>Buka Dashboard Admin →</button></a>
        </div>
      </section>

    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/qrious@4.0.2/dist/qrious.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<script>
  const $ = id => document.getElementById(id);
  const idr = n => 'Rp '+(Number(n)||0).toLocaleString('id-ID');
  function msg(id,cls,t){ var e=$(id); e.className='msg '+cls; e.textContent=t; }
  function cp(id){ navigator.clipboard.writeText($(id).textContent).then(()=>{}); }
  function cpTxt(t){ navigator.clipboard.writeText(t).then(()=>{}); }

  // ── session ──
  function sess(){ try{ return JSON.parse(localStorage.getItem('gp_sess')||'null'); }catch(e){ return null; } }
  function key(){ var s=sess(); return s?s.api_key:''; }

  let mode='login';
  function switchTab(m){ mode=m; $('tab-login').className=m==='login'?'active':''; $('tab-reg').className=m==='reg'?'active':'';
    $('authbtn').textContent=m==='login'?'Masuk':'Daftar'; $('reghint').textContent=m==='reg'?'Username 3-20 karakter (huruf/angka/_). Password min 6.':''; }

  async function doAuth(){
    var u=$('u').value.trim().toLowerCase(), p=$('p').value;
    if(!u||!p) return msg('amsg','err','Isi username & password');
    try{
      var r=await fetch('/api/'+(mode==='login'?'login':'register'),{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({username:u,password:p})});
      var j=await r.json();
      if(!r.ok) return msg('amsg','err',j.error||'gagal');
      localStorage.setItem('gp_sess', JSON.stringify(j));
      showApp();
    }catch(e){ msg('amsg','err',String(e)); }
  }
  function logout(){ localStorage.removeItem('gp_sess'); location.reload(); }

  // ── shell / navigation ──
  const TITLES={dash:'Dashboard',qris:'QRIS & Order',apk:'Kredensial & APK',hook:'Webhook',pw:'Ganti Password',events:'Events Device',admin:'Admin'};
  function go(v){
    document.querySelectorAll('.view').forEach(el=>el.classList.remove('on'));
    $('v-'+v).classList.add('on');
    document.querySelectorAll('.navi').forEach(el=>el.classList.toggle('active',el.dataset.view===v));
    $('ptitle').textContent=TITLES[v]||'';
    toggleMnav(false);
  }
  function toggleCollapse(){ document.body.classList.toggle('col'); localStorage.setItem('gp_col',document.body.classList.contains('col')?'1':''); }
  function toggleMnav(on){ document.body.classList.toggle('mnav',on); }

  function showApp(){
    var s=sess(); if(!s) return;
    if(localStorage.getItem('gp_col')) document.body.classList.add('col');
    $('authview').classList.add('hidden'); $('appview').classList.remove('hidden');
    $('whoami').textContent='@'+(s.username||'');
    $('avatar').textContent=(s.username||'?').slice(0,1).toUpperCase();
    $('c-api').textContent=s.api_key||'-';
    $('c-devid').textContent=s.device_id||'-';
    $('c-devsec').textContent=s.device_secret||'-';
    if(s.fee_percent!=null) $('fee').value=s.fee_percent;
    if(s.unique_digits!=null) $('digits').value=s.unique_digits;
    if(s.is_admin){ $('nav-admin').classList.remove('hidden'); $('nav-events').classList.remove('hidden'); }
    loadSettings();
    tick(); setInterval(tick,3000);
  }

  async function changePw(){
    var o=$('oldpw').value, n=$('newpw').value;
    if(!o||!n) return msg('pwmsg','err','Isi password lama & baru');
    try{
      var r=await fetch('/api/merchant/change-password',{method:'POST',headers:{'x-api-key':key(),'content-type':'application/json'},body:JSON.stringify({old_password:o,new_password:n})});
      var j=await r.json();
      if(r.ok){ msg('pwmsg','ok','Password berhasil diganti'); $('oldpw').value=''; $('newpw').value=''; }
      else msg('pwmsg','err',j.error||'gagal');
    }catch(e){ msg('pwmsg','err',String(e)); }
  }

  // ── QRIS decode ──
  function decodeQr(){
    var f=$('qrfile').files[0]; if(!f) return msg('qmsg','err','Pilih file QR dulu');
    var img=new Image();
    img.onload=function(){
      var scale=Math.min(1,1000/Math.max(img.width,img.height));
      var w=Math.round(img.width*scale),h=Math.round(img.height*scale);
      var cv=document.createElement('canvas'); cv.width=w; cv.height=h;
      var ctx=cv.getContext('2d'); ctx.drawImage(img,0,0,w,h);
      try{
        var d=ctx.getImageData(0,0,w,h);
        var code=jsQR(d.data,w,h,{inversionAttempts:'attemptBoth'});
        if(code&&code.data){ $('qris').value=code.data; $('qrprev').src=img.src; $('qrprev').style.display='block'; msg('qmsg','ok','QR ke-decode ✓ — cek lalu Simpan'); }
        else msg('qmsg','err','QR nggak kebaca. Coba foto lebih jelas / crop.');
      }catch(e){ msg('qmsg','err','Gagal baca gambar: '+e); }
    };
    img.onerror=function(){ msg('qmsg','err','File bukan gambar valid'); };
    img.src=URL.createObjectURL(f);
  }

  async function uploadQris(){
    try{
      var r=await fetch('/api/merchant/qris',{method:'POST',headers:{'x-api-key':key(),'content-type':'application/json'},body:JSON.stringify({qris:$('qris').value.trim()})});
      var j=await r.json();
      if(r.ok){ msg('qmsg','ok','QRIS tersimpan: '+(j.merchant_name||'-')+' ('+(j.city||'-')+')'); loadSettings(); }
      else msg('qmsg','err',j.error||'gagal');
    }catch(e){ msg('qmsg','err',String(e)); }
  }

  async function loadSettings(){
    try{ var r=await fetch('/api/merchant/settings',{headers:{'x-api-key':key()}}); var j=await r.json();
      if(r.ok){ $('fee').value=j.fee_percent??0; $('digits').value=j.unique_digits??2; $('notify').value=j.notify_url||''; $('c-cbsec').textContent=j.callback_secret||'-';
        if(j.has_qris){ $('qstat').textContent='✓ QRIS aktif: '+(j.merchant_name||'-'); $('qstat').style.color='var(--ok)'; $('noqris').style.display='none'; }
        else { $('qstat').textContent='○ Belum ada QRIS statis'; $('qstat').style.color='var(--bad,#b0362a)'; $('noqris').style.display='block'; }
      } }catch(e){}
  }
  async function saveSettings(){
    try{ var r=await fetch('/api/merchant/settings',{method:'POST',headers:{'x-api-key':key(),'content-type':'application/json'},body:JSON.stringify({fee_percent:parseFloat($('fee').value)||0,unique_digits:parseInt($('digits').value,10)||2})});
      var j=await r.json(); if(r.ok) msg('smsg','ok','Fee '+j.fee_percent+'% · kode '+j.unique_digits+' digit tersimpan'); else msg('smsg','err',j.error||'gagal');
    }catch(e){ msg('smsg','err',String(e)); }
  }
  async function saveHook(){
    try{ var r=await fetch('/api/merchant/settings',{method:'POST',headers:{'x-api-key':key(),'content-type':'application/json'},body:JSON.stringify({notify_url:$('notify').value.trim()})});
      var j=await r.json(); if(r.ok) msg('hmsg','ok', j.notify_url?('Webhook aktif → '+j.notify_url):'Webhook dikosongkan'); else msg('hmsg','err',j.error||'gagal');
    }catch(e){ msg('hmsg','err',String(e)); }
  }

  async function createOrder(){
    var amt=parseInt($('amt').value,10); if(!amt||amt<=0) return msg('omsg','err','Nominal harus > 0');
    try{
      var r=await fetch('/api/orders',{method:'POST',headers:{'x-api-key':key(),'content-type':'application/json'},body:JSON.stringify({base_amount:amt,reference:$('ref').value.trim()||undefined})});
      var j=await r.json(); if(!r.ok) return msg('omsg','err',j.error||'gagal');
      msg('omsg','ok','Order dibuat: '+j.id);
      $('rbreak').textContent='base      : '+idr(j.base_amount)+'\\nfee '+(j.fee_percent||0)+'%    : '+idr(j.fee_amount||0)+'\\nkode unik : '+(j.unique_code||0)+'\\n─────────────────\\nTOTAL     : '+idr(j.unique_amount);
      $('ramt').textContent=idr(j.unique_amount); $('rlink').href=j.checkout_url; $('ores').classList.add('show');
      if(j.qris){ new QRious({element:$('qrcanvas'),value:j.qris,size:400,level:'M'}); }
      else msg('omsg','err','Order dibuat tapi QRIS belum ada — upload QRIS dulu di menu QRIS & Fee.');
      setTimeout(tick,800);
    }catch(e){ msg('omsg','err',String(e)); }
  }

  // ── real-time data + pagination ──
  const PER=10;
  let allOrders=[], allEvents=[], oPage=0, ePage=0;
  const escj=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const nows=()=>Math.floor(Date.now()/1000);
  const agoj=ts=>{ if(!ts)return'-'; let d=Math.max(0,nows()-ts); if(d<60)return d+'s'; if(d<3600)return Math.floor(d/60)+'m'; if(d<86400)return Math.floor(d/3600)+'j'; return Math.floor(d/86400)+'h'; };
  const bmap={paid:['#0e7c66','#fff'],pending:['#ffc266','#3a2a00'],expired:['#9aa0a8','#fff'],cancelled:['#b0362a','#fff'],matched:['#0e7c66','#fff'],unmatched:['#9aa0a8','#fff'],duplicate:['#3843b8','#fff']};
  const bdg=s=>{const[bg,fg]=bmap[s]||['#9aa0a8','#fff'];return '<span class="bd" style="background:'+bg+';color:'+fg+'">'+escj(s)+'</span>';};
  const dispStatus=o=>(o.status==='pending'&&o.expires_at&&o.expires_at<=nows())?'expired':o.status;

  function pageOrders(d){ var mx=Math.max(0,Math.ceil(allOrders.length/PER)-1); oPage=Math.min(mx,Math.max(0,oPage+d)); renderOrders(); }
  function pageEvents(d){ var mx=Math.max(0,Math.ceil(allEvents.length/PER)-1); ePage=Math.min(mx,Math.max(0,ePage+d)); renderEvents(); }

  function renderOrders(){
    var tot=allOrders.length, mx=Math.max(0,Math.ceil(tot/PER)-1); if(oPage>mx)oPage=mx;
    var slice=allOrders.slice(oPage*PER,oPage*PER+PER);
    $('otbody').innerHTML=slice.map(o=>{var st=dispStatus(o);return '<tr><td class=mono>'+escj(o.id.slice(0,12))+'</td><td class=mono>'+idr(o.unique_amount)+'<br><span class=dim>base '+idr(o.base_amount)+'</span></td><td>'+bdg(st)+'</td><td class=dim>'+escj(o.reference||'-')+'</td><td><a class=lnk href="/pay/'+escj(o.id)+'" target=_blank>checkout ↗</a></td><td class=dim>'+agoj(o.created_at)+'</td></tr>';}).join('')||'<tr><td colspan=6 class=dim style="text-align:center;padding:20px">Belum ada order</td></tr>';
    $('opinfo').textContent=tot?('Hal '+(oPage+1)+'/'+(mx+1)+' · '+tot+' order'):'';
    $('oprev').disabled=oPage<=0; $('onext').disabled=oPage>=mx;
  }
  function renderEvents(){
    var tot=allEvents.length, mx=Math.max(0,Math.ceil(tot/PER)-1); if(ePage>mx)ePage=mx;
    var slice=allEvents.slice(ePage*PER,ePage*PER+PER);
    $('etbody').innerHTML=slice.map(e=>'<tr><td class=mono>'+escj((e.id||'').slice(0,14))+'</td><td class=mono>'+(e.amount!=null?idr(e.amount):'-')+'</td><td>'+bdg(e.status)+'</td><td class=dim>'+escj((e.raw_text||'').slice(0,44))+'</td><td class=dim>'+agoj(e.created_at)+'</td></tr>').join('')||'<tr><td colspan=5 class=dim style="text-align:center;padding:20px">Belum ada event</td></tr>';
    $('epinfo').textContent=tot?('Hal '+(ePage+1)+'/'+(mx+1)+' · '+tot+' event'):'';
    $('eprev').disabled=ePage<=0; $('enext').disabled=ePage>=mx;
  }

  // ── grafik garis (Chart.js) ──
  let chart=null;
  function renderChart(series){
    if(typeof Chart==='undefined') return;
    // zero-fill 14 hari terakhir
    var days=[], map={};
    (series||[]).forEach(s=>{ map[s.day]={t:s.total||0,p:s.paid||0,q:s.pending||0}; });
    var base=Date.now();
    for(var i=13;i>=0;i--){ var dt=new Date(base-i*86400000); var k=dt.toISOString().slice(0,10); days.push(k); }
    var labels=days.map(k=>k.slice(5)); // MM-DD
    var tot=days.map(k=>map[k]?map[k].t:0), paid=days.map(k=>map[k]?map[k].p:0), pend=days.map(k=>map[k]?map[k].q:0);
    var ds=[
      {label:'Total',data:tot,borderColor:'#26379d',backgroundColor:'#26379d'},
      {label:'Paid',data:paid,borderColor:'#0e7c66',backgroundColor:'#0e7c66'},
      {label:'Pending',data:pend,borderColor:'#c26107',backgroundColor:'#c26107'}
    ].map(x=>Object.assign(x,{tension:0,borderWidth:2,pointRadius:2,pointStyle:'rect',pointHoverRadius:5}));
    if(chart){ chart.data.labels=labels; chart.data.datasets.forEach((d,i)=>d.data=ds[i].data); chart.update('none'); return; }
    var ctx=$('chart'); if(!ctx) return;
    chart=new Chart(ctx,{type:'line',data:{labels:labels,datasets:ds},options:{
      responsive:true,maintainAspectRatio:false,
      interaction:{mode:'index',intersect:false},
      plugins:{
        legend:{labels:{color:'#23262e',font:{family:'Share Tech Mono',size:11},boxWidth:12,usePointStyle:true,pointStyle:'rect'}},
        tooltip:{backgroundColor:'#141f5c',titleColor:'#8fe3f7',bodyColor:'#dfe6ff',borderColor:'#2b3a7a',borderWidth:1,cornerRadius:0,titleFont:{family:'Share Tech Mono'},bodyFont:{family:'Share Tech Mono'},padding:10,callbacks:{label:function(c){return ' '+c.dataset.label+': '+c.parsed.y+'x';}}}
      },
      scales:{
        x:{grid:{color:'rgba(84,81,74,.15)'},ticks:{color:'#5b5f66',font:{family:'Share Tech Mono',size:10}}},
        y:{beginAtZero:true,grid:{color:'rgba(84,81,74,.15)'},ticks:{color:'#5b5f66',precision:0,font:{family:'Share Tech Mono',size:10}}}
      }
    }});
  }

  async function tick(){
    if(!key()) return;
    try{
      var r=await fetch('/dashboard/data',{headers:{'x-api-key':key()},cache:'no-store'});
      if(r.status===401){ logout(); return; }
      var d=await r.json();
      $('s-total').textContent=d.stats?.total||0; $('s-paid').textContent=d.stats?.paid||0;
      $('s-pending').textContent=d.stats?.pending||0; $('s-rev').textContent=idr(d.stats?.revenue);
      allOrders=d.orders||[]; allEvents=d.events||[];
      renderOrders(); renderEvents(); renderChart(d.series);
    }catch(e){}
  }

  // init
  if(sess()) showApp();
</script>
</body></html>`;
}
