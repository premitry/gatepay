// Dashboard merchant — layout sidebar (ala TemanQRIS), collapsible ke ikon.
// Login/register, kelola QRIS+fee, buat order, kredensial APK, webhook. Gaya kotak siku.

export function renderDashboard() {
  return `<!DOCTYPE html>
<html lang="id"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dashboard · GatePay</title>
<style>
  :root{--bg:#0f1115;--card:#171a21;--card2:#1e222b;--bd:#2b3038;--tx:#eef0f4;--dim:#9aa3b2;--brand:#3ddc97;--brandink:#04120b;--side:#12151b}
  *{box-sizing:border-box;border-radius:0!important;margin:0;padding:0}
  body{font-family:'Inter',-apple-system,'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--tx);line-height:1.5}
  a{color:var(--brand);text-decoration:none}
  .hidden{display:none!important}
  input,textarea{width:100%;background:var(--card2);border:1px solid var(--bd);color:var(--tx);padding:9px 10px;font-family:inherit;font-size:13px}
  textarea{resize:vertical;min-height:60px;font-family:'JetBrains Mono',Consolas,monospace}
  label{display:block;font-size:12px;color:var(--dim);margin:8px 0 4px}
  button{background:var(--brand);color:var(--brandink);border:0;padding:10px 16px;font-weight:700;font-size:13px;cursor:pointer;margin-top:10px;width:100%}
  button:hover{opacity:.9}
  button.sec{background:var(--card2);color:var(--tx);border:1px solid var(--bd)}
  .msg{font-size:12px;margin-top:8px;padding:8px;display:none}
  .msg.ok{background:#123a2a;color:var(--brand);display:block}
  .msg.err{background:#2a1416;color:#ff5c5c;display:block}
  .mono{font-family:'JetBrains Mono',Consolas,monospace}
  .dim{color:var(--dim);font-size:12px}
  .lnk{font-size:12px}

  /* ── AUTH ── */
  .authwrap{max-width:380px;margin:60px auto;padding:0 20px}
  .authcard{background:var(--card);border:1px solid var(--bd);padding:28px}
  .authcard h1{font-size:22px;font-weight:800;margin-bottom:4px}
  .authcard .sub{color:var(--dim);font-size:13px;margin-bottom:20px}
  .tabs{display:flex;margin-bottom:16px;border:1px solid var(--bd)}
  .tabs div{flex:1;text-align:center;padding:10px;font-size:13px;cursor:pointer;color:var(--dim)}
  .tabs div.active{background:var(--brand);color:var(--brandink);font-weight:700}

  /* ── SHELL ── */
  #appview{display:flex;min-height:100vh}
  .sidebar{width:230px;flex-shrink:0;background:var(--side);border-right:1px solid var(--bd);display:flex;flex-direction:column;position:fixed;top:0;bottom:0;left:0;z-index:40;transition:width .16s}
  .side-top{display:flex;align-items:center;justify-content:space-between;height:60px;padding:0 16px;border-bottom:1px solid var(--bd)}
  .logo{font-weight:800;font-size:18px;color:var(--tx);display:flex;align-items:center;gap:8px;white-space:nowrap;overflow:hidden}
  .logo .mark{background:var(--brand);color:var(--brandink);width:26px;height:26px;min-width:26px;display:inline-flex;align-items:center;justify-content:center}
  .collapse{background:none;border:1px solid var(--bd);color:var(--dim);width:auto;margin:0;padding:4px 8px;font-size:14px}
  .snav{flex:1;overflow-y:auto;padding:10px 0}
  .snav .grp{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--dim);padding:12px 18px 4px;white-space:nowrap;overflow:hidden}
  .navi{display:flex;align-items:center;gap:12px;padding:11px 18px;color:var(--dim);cursor:pointer;font-size:14px;border-left:3px solid transparent;white-space:nowrap;overflow:hidden}
  .navi:hover{color:var(--tx);background:var(--card)}
  .navi.active{color:var(--tx);background:var(--card);border-left-color:var(--brand);font-weight:600}
  .navi .ic{font-size:17px;width:20px;min-width:20px;text-align:center}
  .side-bot{border-top:1px solid var(--bd);padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:8px;white-space:nowrap;overflow:hidden}
  .side-bot .who{display:flex;align-items:center;gap:10px;overflow:hidden}
  .side-bot .av{width:30px;height:30px;min-width:30px;background:var(--brand);color:var(--brandink);display:flex;align-items:center;justify-content:center;font-weight:800}
  .side-bot .lo{color:#ff5c5c;cursor:pointer;font-size:16px}
  /* collapsed */
  body.col .sidebar{width:64px}
  body.col .logo span:last-child,body.col .snav .grp,body.col .navi .lbl,body.col .side-bot .txt{display:none}
  body.col .navi{justify-content:center;padding:11px 0;gap:0}
  body.col .side-top{padding:0 8px;justify-content:center}
  body.col .side-top .logo{display:none}
  body.col .side-bot{justify-content:center;padding:12px 8px}
  body.col .side-bot .who{gap:0}

  .content{flex:1;margin-left:230px;min-width:0;transition:margin .16s}
  body.col .content{margin-left:64px}
  .topbar{height:60px;border-bottom:1px solid var(--bd);background:var(--card);display:flex;align-items:center;gap:14px;padding:0 22px;position:sticky;top:0;z-index:20}
  .topbar .ptitle{font-size:16px;font-weight:700}
  .topbar .burger{display:none;background:none;border:1px solid var(--bd);color:var(--tx);width:auto;margin:0;padding:5px 10px}
  .live{font-size:11px;color:var(--dim);display:flex;align-items:center;gap:6px;margin-left:auto}
  .livedot{width:8px;height:8px;background:var(--brand);display:inline-block;box-shadow:0 0 6px var(--brand);animation:bl 1.5s infinite}
  @keyframes bl{50%{opacity:.35}}
  .page{padding:22px;max-width:1000px}
  .view{display:none}
  .view.on{display:block}

  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px}
  .stat{background:var(--card);border:1px solid var(--bd);padding:14px}
  .stat .k{color:var(--dim);font-size:11px;text-transform:uppercase;letter-spacing:.05em}
  .stat .v{font-size:22px;font-weight:800;margin-top:2px}
  .stat .v.g{color:var(--brand)}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .panel{background:var(--card);border:1px solid var(--bd);padding:18px;margin-bottom:16px}
  .panel h2{font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:var(--dim);margin-bottom:12px}
  .res{margin-top:12px;padding:12px;background:var(--card2);border:1px solid var(--bd);display:none}
  .res.show{display:block}
  .res .amt{font-size:22px;font-weight:800}
  #qrcanvas{background:#fff;padding:8px;margin-top:8px;max-width:200px}
  #qrprev{max-width:120px;margin-top:8px;display:none;background:#fff;padding:4px}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th{text-align:left;color:var(--dim);font-weight:600;padding:8px;border-bottom:1px solid var(--bd);font-size:11px;text-transform:uppercase}
  td{padding:8px;border-bottom:1px solid var(--card2);vertical-align:top}
  tr:hover td{background:var(--card2)}
  .bd{padding:2px 8px;font-size:11px;font-weight:700;text-transform:uppercase}
  .pager{display:flex;align-items:center;gap:8px;justify-content:flex-end;margin-top:12px}
  .pager button{width:auto;margin:0;padding:6px 12px}
  .pager button:disabled{opacity:.4;cursor:default}
  .pager .pinfo{font-size:12px;color:var(--dim)}
  .cred{background:var(--card2);border:1px solid var(--bd);padding:10px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;gap:8px}
  .cred .l{font-size:11px;color:var(--dim);text-transform:uppercase}
  .cred .v{font-family:'JetBrains Mono',Consolas,monospace;font-size:12px;word-break:break-all}
  .cred button{width:auto;margin:0;padding:6px 10px;font-size:11px}
  .scrim{display:none}
  @media(max-width:820px){
    .stats{grid-template-columns:repeat(2,1fr)}.grid2{grid-template-columns:1fr}
    .sidebar{transform:translateX(-100%);transition:transform .18s;width:230px}
    body.col .sidebar{width:230px}
    body.mnav .sidebar{transform:translateX(0)}
    .content{margin-left:0!important}
    .topbar .burger{display:block}
    body.mnav .scrim{display:block;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:35}
  }
</style></head><body>

<!-- ══ AUTH ══ -->
<div id="authview">
  <div class="authwrap"><div class="authcard">
    <h1><span style="background:var(--brand);color:var(--brandink);padding:0 8px">G</span> GatePay</h1>
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
      <div class="navi" data-view="order" onclick="go('order')"><span class="ic">➕</span><span class="lbl">Buat Order</span></div>
      <div class="navi" data-view="qris" onclick="go('qris')"><span class="ic">📷</span><span class="lbl">QRIS &amp; Fee</span></div>
      <div class="grp">Integrasi</div>
      <div class="navi" data-view="apk" onclick="go('apk')"><span class="ic">🔑</span><span class="lbl">Kredensial &amp; APK</span></div>
      <div class="navi" data-view="hook" onclick="go('hook')"><span class="ic">🔗</span><span class="lbl">Webhook</span></div>
      <div class="grp">Akun</div>
      <div class="navi" data-view="pw" onclick="go('pw')"><span class="ic">🔒</span><span class="lbl">Ganti Password</span></div>
      <div class="navi hidden" id="nav-events" data-view="events" onclick="go('events')"><span class="ic">📡</span><span class="lbl">Events Device</span></div>
      <div class="navi hidden" id="nav-admin" data-view="admin" onclick="go('admin')"><span class="ic">👑</span><span class="lbl">Admin</span></div>
    </nav>
    <div class="side-bot">
      <div class="who"><span class="av" id="avatar">?</span><span class="txt" id="whoami"></span></div>
      <span class="lo txt" onclick="logout()" title="Keluar">⎋</span>
    </div>
  </aside>

  <div class="content">
    <div class="topbar">
      <button class="burger" onclick="toggleMnav(true)">☰</button>
      <div class="ptitle" id="ptitle">Dashboard</div>
      <div class="live"><span class="livedot"></span>Live · 3s</div>
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
          <h2>Orders</h2>
          <table><thead><tr><th>ID</th><th>Nominal</th><th>Status</th><th>Ref</th><th>Checkout</th><th>Waktu</th></tr></thead>
          <tbody id="otbody"><tr><td colspan=6 class=dim style="text-align:center;padding:20px">Belum ada order</td></tr></tbody></table>
          <div class="pager">
            <span class="pinfo" id="opinfo"></span>
            <button class="sec" id="oprev" onclick="pageOrders(-1)">‹ Prev</button>
            <button class="sec" id="onext" onclick="pageOrders(1)">Next ›</button>
          </div>
        </div>
      </section>

      <!-- BUAT ORDER -->
      <section class="view" id="v-order">
        <div class="panel" style="max-width:520px">
          <h2>Buat Order + QR</h2>
          <label>Nominal (Rp)</label>
          <input id="amt" type="number" placeholder="10000">
          <label>Reference (opsional)</label>
          <input id="ref" type="text" placeholder="INV-001">
          <button onclick="createOrder()">Buat Order + QR</button>
          <div class="msg" id="omsg"></div>
          <div class="res" id="ores">
            <div class="dim" id="rbreak" style="font-size:12px;margin-bottom:8px;font-family:'JetBrains Mono',Consolas,monospace;white-space:pre-line"></div>
            <div class="dim">Bayar persis</div>
            <div class="amt" id="ramt"></div>
            <canvas id="qrcanvas"></canvas>
            <div style="margin-top:8px"><a class="lnk" id="rlink" target="_blank">Buka halaman checkout ↗</a></div>
          </div>
        </div>
      </section>

      <!-- QRIS & FEE -->
      <section class="view" id="v-qris">
        <div class="panel" style="max-width:560px">
          <h2>Setup QRIS Statis</h2>
          <div class="dim" style="margin-bottom:8px">Upload foto QRIS statis DANA Bisnis kamu → Decode → Simpan.</div>
          <label>Upload QR (foto/gambar)</label>
          <input type="file" id="qrfile" accept="image/*">
          <button class="sec" onclick="decodeQr()">🔍 Decode QR</button>
          <img id="qrprev">
          <label>Hasil QRIS String</label>
          <textarea id="qris" placeholder="hasil decode (atau paste manual)"></textarea>
          <button onclick="uploadQris()">Simpan QRIS</button>
          <div class="msg" id="qmsg"></div>
        </div>
        <div class="panel" style="max-width:560px">
          <h2>Fee &amp; Kode Unik</h2>
          <div class="dim" style="margin-bottom:8px">Fee ditambah di atas nominal, lalu kode unik disisipkan di digit terakhir buat matching otomatis.</div>
          <div style="display:flex;gap:10px">
            <div style="flex:1"><label>Fee (%)</label><input id="fee" type="number" step="0.1" placeholder="7"></div>
            <div style="flex:1"><label>Digit kode</label><input id="digits" type="number" min="1" max="3" placeholder="2"></div>
          </div>
          <button onclick="saveSettings()">Simpan Fee</button>
          <div class="msg" id="smsg"></div>
        </div>
      </section>

      <!-- KREDENSIAL & APK -->
      <section class="view" id="v-apk">
        <div class="panel" style="max-width:640px">
          <h2>Kredensial &amp; APK Penangkap Notif</h2>
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
          <h2>Webhook (Callback)</h2>
          <div class="dim" style="margin-bottom:10px">Opsional. GatePay nembak POST ke URL ini tiap ada order <b>PAID</b>, jadi sistem kamu (toko/bot/invoice) tau otomatis tanpa polling. Kosongkan kalau cuma pakai dashboard.</div>
          <label>Notify URL</label>
          <input id="notify" type="url" placeholder="https://sistem-kamu.com/webhook/gatepay">
          <button onclick="saveHook()">Simpan Webhook</button>
          <div class="msg" id="hmsg"></div>
          <div class="cred" style="margin-top:14px"><div><div class="l">Callback Secret (buat verifikasi HMAC)</div><div class="v" id="c-cbsec">-</div></div><button class="sec" onclick="cp('c-cbsec')">Copy</button></div>
          <div class="dim" style="font-size:11px;margin-top:8px;white-space:pre-line">Payload contoh:
{"event":"order.paid","order_id":"ord_xxx","reference":"INV-001","unique_amount":10237,"paid_at":1784...}
Header <b>x-signature</b> = HMAC-SHA256(body, callback_secret). Verifikasi di sisi kamu. Detail di <a href="/docs#callback">Docs</a>.</div>
        </div>
      </section>

      <!-- GANTI PASSWORD -->
      <section class="view" id="v-pw">
        <div class="panel" style="max-width:420px">
          <h2>Ganti Password</h2>
          <label>Password Lama</label><input id="oldpw" type="password" placeholder="password sekarang">
          <label>Password Baru</label><input id="newpw" type="password" placeholder="minimal 6 karakter">
          <button onclick="changePw()">Ganti Password</button>
          <div class="msg" id="pwmsg"></div>
        </div>
      </section>

      <!-- EVENTS (admin only) -->
      <section class="view" id="v-events">
        <div class="panel">
          <h2>Events dari Device</h2>
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
          <h2>Panel Admin</h2>
          <div class="dim" style="margin-bottom:8px">Kamu punya akses admin — kelola semua merchant, statistik global, & monitoring device.</div>
          <a href="/admin"><button>Buka Dashboard Admin →</button></a>
        </div>
      </section>

    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/qrious@4.0.2/dist/qrious.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js"></script>
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
  const TITLES={dash:'Dashboard',order:'Buat Order',qris:'QRIS & Fee',apk:'Kredensial & APK',hook:'Webhook',pw:'Ganti Password',events:'Events Device',admin:'Admin'};
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
      if(r.ok) msg('qmsg','ok','QRIS tersimpan: '+(j.merchant_name||'-')+' ('+(j.city||'-')+')');
      else msg('qmsg','err',j.error||'gagal');
    }catch(e){ msg('qmsg','err',String(e)); }
  }

  async function loadSettings(){
    try{ var r=await fetch('/api/merchant/settings',{headers:{'x-api-key':key()}}); var j=await r.json();
      if(r.ok){ $('fee').value=j.fee_percent??0; $('digits').value=j.unique_digits??2; $('notify').value=j.notify_url||''; $('c-cbsec').textContent=j.callback_secret||'-'; } }catch(e){}
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
  const bmap={paid:['#3ddc97','#04120b'],pending:['#f6c445','#241d02'],expired:['#6b7280','#0b0d11'],cancelled:['#ff5c5c','#1c0808'],matched:['#3ddc97','#04120b'],unmatched:['#6b7280','#0b0d11'],duplicate:['#7c6cff','#0b0b1c']};
  const bdg=s=>{const[bg,fg]=bmap[s]||['#6b7280','#0b0d11'];return '<span class="bd" style="background:'+bg+';color:'+fg+'">'+escj(s)+'</span>';};
  // status tampilan: order pending yg udah lewat expires_at ditampilin expired (jaga2 kalau server telat)
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

  async function tick(){
    if(!key()) return;
    try{
      var r=await fetch('/dashboard/data',{headers:{'x-api-key':key()},cache:'no-store'});
      if(r.status===401){ logout(); return; }
      var d=await r.json();
      $('s-total').textContent=d.stats?.total||0; $('s-paid').textContent=d.stats?.paid||0;
      $('s-pending').textContent=d.stats?.pending||0; $('s-rev').textContent=idr(d.stats?.revenue);
      allOrders=d.orders||[]; allEvents=d.events||[];
      renderOrders(); renderEvents();
    }catch(e){}
  }

  // init
  if(sess()) showApp();
</script>
</body></html>`;
}
