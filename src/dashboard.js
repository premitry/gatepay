// Dashboard merchant — login/register, kelola QRIS+fee, buat order, kredensial APK.
// Data di-load client-side (butuh api key hasil login). Gaya kotak siku.

export function renderDashboard() {
  return `<!DOCTYPE html>
<html lang="id"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dashboard · GatePay</title>
<style>
  :root{--bg:#0f1115;--card:#171a21;--card2:#1e222b;--bd:#2b3038;--tx:#eef0f4;--dim:#9aa3b2;--brand:#3ddc97;--brandink:#04120b}
  *{box-sizing:border-box;border-radius:0!important;margin:0;padding:0}
  body{font-family:'Inter',-apple-system,'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--tx);line-height:1.5}
  a{color:var(--brand);text-decoration:none}
  nav{border-bottom:1px solid var(--bd);background:var(--card)}
  nav .in{max-width:1080px;margin:0 auto;padding:0 20px;display:flex;align-items:center;justify-content:space-between;height:60px}
  .logo{font-weight:800;font-size:19px;color:var(--tx);display:flex;align-items:center;gap:8px}
  .logo .mark{background:var(--brand);color:var(--brandink);width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center}
  .navlinks{display:flex;align-items:center;gap:16px}
  .navlinks a,.navlinks span{color:var(--dim);font-size:14px;cursor:pointer}
  .wrap{max-width:1080px;margin:0 auto;padding:24px 20px}
  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:8px}
  .stat{background:var(--card);border:1px solid var(--bd);padding:14px}
  .stat .k{color:var(--dim);font-size:11px;text-transform:uppercase;letter-spacing:.05em}
  .stat .v{font-size:22px;font-weight:800;margin-top:2px}
  .stat .v.g{color:var(--brand)}
  .live{font-size:11px;color:var(--dim);display:flex;align-items:center;gap:6px;margin:0 0 16px}
  .livedot{width:8px;height:8px;background:var(--brand);display:inline-block;box-shadow:0 0 6px var(--brand);animation:bl 1.5s infinite}
  @keyframes bl{50%{opacity:.35}}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
  .panel{background:var(--card);border:1px solid var(--bd);padding:16px}
  .panel h2{font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:var(--dim);margin-bottom:12px}
  label{display:block;font-size:12px;color:var(--dim);margin:8px 0 4px}
  input,textarea{width:100%;background:var(--card2);border:1px solid var(--bd);color:var(--tx);padding:9px 10px;font-family:inherit;font-size:13px}
  textarea{resize:vertical;min-height:60px;font-family:'JetBrains Mono',Consolas,monospace}
  button{background:var(--brand);color:var(--brandink);border:0;padding:10px 16px;font-weight:700;font-size:13px;cursor:pointer;margin-top:10px;width:100%}
  button:hover{opacity:.9}
  button.sec{background:var(--card2);color:var(--tx);border:1px solid var(--bd)}
  .msg{font-size:12px;margin-top:8px;padding:8px;display:none}
  .msg.ok{background:#123a2a;color:var(--brand);display:block}
  .msg.err{background:#2a1416;color:#ff5c5c;display:block}
  .res{margin-top:12px;padding:12px;background:var(--card2);border:1px solid var(--bd);display:none}
  .res.show{display:block}
  .res .amt{font-size:22px;font-weight:800}
  #qrcanvas{background:#fff;padding:8px;margin-top:8px;max-width:180px}
  #qrprev{max-width:120px;margin-top:8px;display:none;background:#fff;padding:4px}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th{text-align:left;color:var(--dim);font-weight:600;padding:8px;border-bottom:1px solid var(--bd);font-size:11px;text-transform:uppercase}
  td{padding:8px;border-bottom:1px solid var(--card2);vertical-align:top}
  tr:hover td{background:var(--card2)}
  .mono{font-family:'JetBrains Mono',Consolas,monospace}
  .dim{color:var(--dim);font-size:12px}
  .lnk{font-size:12px}
  .bd{padding:2px 8px;font-size:11px;font-weight:700;text-transform:uppercase}
  .full{grid-column:1/-1}
  .cred{background:var(--card2);border:1px solid var(--bd);padding:10px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;gap:8px}
  .cred .l{font-size:11px;color:var(--dim);text-transform:uppercase}
  .cred .v{font-family:'JetBrains Mono',Consolas,monospace;font-size:12px;word-break:break-all}
  .cred button{width:auto;margin:0;padding:6px 10px;font-size:11px}
  /* auth */
  .authwrap{max-width:380px;margin:60px auto;padding:0 20px}
  .authcard{background:var(--card);border:1px solid var(--bd);padding:28px}
  .authcard h1{font-size:22px;font-weight:800;margin-bottom:4px}
  .authcard .sub{color:var(--dim);font-size:13px;margin-bottom:20px}
  .tabs{display:flex;margin-bottom:16px;border:1px solid var(--bd)}
  .tabs div{flex:1;text-align:center;padding:10px;font-size:13px;cursor:pointer;color:var(--dim)}
  .tabs div.active{background:var(--brand);color:var(--brandink);font-weight:700}
  .hidden{display:none!important}
  @media(max-width:760px){.stats{grid-template-columns:repeat(2,1fr)}.grid{grid-template-columns:1fr}}
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
<nav><div class="in">
  <a class="logo" href="/"><span class="mark">G</span>GatePay</a>
  <div class="navlinks">
    <a href="/docs">Docs</a>
    <span id="whoami"></span>
    <span onclick="logout()" style="color:#ff5c5c">Keluar</span>
  </div>
</div></nav>
<div class="wrap">
  <div class="stats">
    <div class="stat"><div class="k">Total Order</div><div class="v" id="s-total">0</div></div>
    <div class="stat"><div class="k">Paid</div><div class="v g" id="s-paid">0</div></div>
    <div class="stat"><div class="k">Pending</div><div class="v" id="s-pending">0</div></div>
    <div class="stat"><div class="k">Revenue</div><div class="v" id="s-rev">Rp 0</div></div>
  </div>
  <div class="live"><span class="livedot"></span>Live · auto-refresh 3s</div>

  <div class="grid">
    <div class="panel">
      <h2>Setup QRIS + Fee</h2>
      <div class="dim" style="font-size:12px;margin-bottom:8px">Upload foto QRIS statis DANA Bisnis kamu → Decode → Simpan.</div>
      <label>Upload QR (foto/gambar)</label>
      <input type="file" id="qrfile" accept="image/*">
      <button class="sec" onclick="decodeQr()">🔍 Decode QR</button>
      <img id="qrprev">
      <label>Hasil QRIS String</label>
      <textarea id="qris" placeholder="hasil decode (atau paste manual)"></textarea>
      <button onclick="uploadQris()">Simpan QRIS</button>
      <div class="msg" id="qmsg"></div>
      <div style="display:flex;gap:10px;margin-top:14px">
        <div style="flex:1"><label>Fee (%)</label><input id="fee" type="number" step="0.1" placeholder="7"></div>
        <div style="flex:1"><label>Digit kode</label><input id="digits" type="number" min="1" max="3" placeholder="2"></div>
      </div>
      <button class="sec" onclick="saveSettings()">Simpan Fee</button>
      <div class="msg" id="smsg"></div>
    </div>

    <div class="panel">
      <h2>Buat Order</h2>
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
  </div>

  <div class="panel full" style="margin-bottom:16px">
    <h2>Kredensial &amp; APK</h2>
    <div class="dim" style="font-size:12px;margin-bottom:10px">Buat integrasi + setup HP penangkap notif. Rahasiakan.</div>
    <div class="cred"><div><div class="l">API Key (sk_live)</div><div class="v" id="c-api">-</div></div><button class="sec" onclick="cp('c-api')">Copy</button></div>
    <div class="cred"><div><div class="l">Device ID (APK)</div><div class="v" id="c-devid">-</div></div><button class="sec" onclick="cp('c-devid')">Copy</button></div>
    <div class="cred"><div><div class="l">Device Secret (APK)</div><div class="v" id="c-devsec">-</div></div><button class="sec" onclick="cp('c-devsec')">Copy</button></div>
    <a href="/gatepay-catcher.apk" download><button>⬇ Download APK Catcher</button></a>
    <div class="dim" style="font-size:11px;margin-top:8px">Install APK di HP → isi Server URL, Device ID, Device Secret di atas → aktifkan Notification Access.</div>
  </div>

  <div class="grid">
    <div class="panel">
      <h2>Ganti Password</h2>
      <label>Password Lama</label><input id="oldpw" type="password" placeholder="password sekarang">
      <label>Password Baru</label><input id="newpw" type="password" placeholder="minimal 6 karakter">
      <button onclick="changePw()">Ganti Password</button>
      <div class="msg" id="pwmsg"></div>
    </div>
    <div class="panel" id="adminpanel" style="display:none">
      <h2>Admin</h2>
      <div class="dim" style="font-size:12px;margin-bottom:8px">Kamu punya akses admin.</div>
      <a href="/admin"><button>Buka Dashboard Admin →</button></a>
    </div>
  </div>

  <div class="panel full" style="margin-bottom:16px">
    <h2>Orders (50 terakhir)</h2>
    <table><thead><tr><th>ID</th><th>Nominal</th><th>Status</th><th>Ref</th><th>Checkout</th><th>Waktu</th></tr></thead>
    <tbody id="otbody"><tr><td colspan=6 class=dim style="text-align:center;padding:20px">Belum ada order</td></tr></tbody></table>
  </div>

  <div class="panel full">
    <h2>Events dari Device (50 terakhir)</h2>
    <table><thead><tr><th>Event</th><th>Nominal</th><th>Status</th><th>Raw</th><th>Waktu</th></tr></thead>
    <tbody id="etbody"><tr><td colspan=5 class=dim style="text-align:center;padding:20px">Belum ada event</td></tr></tbody></table>
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
      // register balikin creds tanpa merchant_name; login balikin lengkap
      localStorage.setItem('gp_sess', JSON.stringify(j));
      showApp();
    }catch(e){ msg('amsg','err',String(e)); }
  }
  function logout(){ localStorage.removeItem('gp_sess'); location.reload(); }

  function showApp(){
    var s=sess(); if(!s) return;
    $('authview').classList.add('hidden'); $('appview').classList.remove('hidden');
    $('whoami').textContent='@'+(s.username||'');
    $('c-api').textContent=s.api_key||'-';
    $('c-devid').textContent=s.device_id||'-';
    $('c-devsec').textContent=s.device_secret||'-';
    if(s.fee_percent!=null) $('fee').value=s.fee_percent;
    if(s.unique_digits!=null) $('digits').value=s.unique_digits;
    if(s.is_admin) $('adminpanel').style.display='block';
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
      if(r.ok){ $('fee').value=j.fee_percent??0; $('digits').value=j.unique_digits??2; } }catch(e){}
  }
  async function saveSettings(){
    try{ var r=await fetch('/api/merchant/settings',{method:'POST',headers:{'x-api-key':key(),'content-type':'application/json'},body:JSON.stringify({fee_percent:parseFloat($('fee').value)||0,unique_digits:parseInt($('digits').value,10)||2})});
      var j=await r.json(); if(r.ok) msg('smsg','ok','Fee '+j.fee_percent+'% · kode '+j.unique_digits+' digit tersimpan'); else msg('smsg','err',j.error||'gagal');
    }catch(e){ msg('smsg','err',String(e)); }
  }

  async function createOrder(){
    var amt=parseInt($('amt').value,10); if(!amt||amt<=0) return msg('omsg','err','Nominal harus > 0');
    try{
      var r=await fetch('/api/orders',{method:'POST',headers:{'x-api-key':key(),'content-type':'application/json'},body:JSON.stringify({base_amount:amt,reference:$('ref').value.trim()||undefined})});
      var j=await r.json(); if(!r.ok) return msg('omsg','err',j.error||'gagal');
      msg('omsg','ok','Order dibuat: '+j.id);
      $('rbreak').textContent='base      : '+idr(j.base_amount)+'\\nfee '+(j.fee_percent||0)+'%    : '+idr(j.fee_amount||0)+'\\nkode unik : '+(j.unique_code||0)+'\\n─────────────────\\nTOTAL     : '+idr(j.unique_amount);
      $('ramt').textContent=idr(j.unique_amount); $('rlink').href=j.checkout_url; $('ores').classList.add('show');
      if(j.qris){ new QRious({element:$('qrcanvas'),value:j.qris,size:360,level:'M'}); }
      else msg('omsg','err','Order dibuat tapi QRIS belum ada — upload QRIS dulu.');
      setTimeout(tick,800);
    }catch(e){ msg('omsg','err',String(e)); }
  }

  // ── real-time tables ──
  const escj=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const agoj=ts=>{ if(!ts)return'-'; let d=Math.max(0,Math.floor(Date.now()/1000)-ts); if(d<60)return d+'s'; if(d<3600)return Math.floor(d/60)+'m'; if(d<86400)return Math.floor(d/3600)+'j'; return Math.floor(d/86400)+'h'; };
  const bmap={paid:['#3ddc97','#04120b'],pending:['#f6c445','#241d02'],expired:['#6b7280','#0b0d11'],cancelled:['#ff5c5c','#1c0808'],matched:['#3ddc97','#04120b'],unmatched:['#6b7280','#0b0d11'],duplicate:['#7c6cff','#0b0b1c']};
  const bdg=s=>{const[bg,fg]=bmap[s]||['#6b7280','#0b0d11'];return '<span class="bd" style="background:'+bg+';color:'+fg+'">'+escj(s)+'</span>';};
  async function tick(){
    if(!key()) return;
    try{
      var r=await fetch('/dashboard/data',{headers:{'x-api-key':key()},cache:'no-store'});
      if(r.status===401){ logout(); return; }
      var d=await r.json();
      $('s-total').textContent=d.stats?.total||0; $('s-paid').textContent=d.stats?.paid||0;
      $('s-pending').textContent=d.stats?.pending||0; $('s-rev').textContent=idr(d.stats?.revenue);
      $('otbody').innerHTML=(d.orders||[]).map(o=>'<tr><td class=mono>'+escj(o.id.slice(0,12))+'</td><td class=mono>'+idr(o.unique_amount)+'<br><span class=dim>base '+idr(o.base_amount)+'</span></td><td>'+bdg(o.status)+'</td><td class=dim>'+escj(o.reference||'-')+'</td><td><a class=lnk href="/pay/'+escj(o.id)+'" target=_blank>checkout ↗</a></td><td class=dim>'+agoj(o.created_at)+'</td></tr>').join('')||'<tr><td colspan=6 class=dim style="text-align:center;padding:20px">Belum ada order</td></tr>';
      $('etbody').innerHTML=(d.events||[]).map(e=>'<tr><td class=mono>'+escj((e.id||'').slice(0,14))+'</td><td class=mono>'+(e.amount!=null?idr(e.amount):'-')+'</td><td>'+bdg(e.status)+'</td><td class=dim>'+escj((e.raw_text||'').slice(0,44))+'</td><td class=dim>'+agoj(e.created_at)+'</td></tr>').join('')||'<tr><td colspan=5 class=dim style="text-align:center;padding:20px">Belum ada event</td></tr>';
    }catch(e){}
  }

  // init
  if(sess()) showApp();
</script>
</body></html>`;
}
