// Dashboard Admin — manajemen merchant, statistik global, monitoring device, log.
// Login pakai akun is_admin. Gaya kotak siku.

export function renderAdmin() {
  return `<!DOCTYPE html>
<html lang="id"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Admin · GatePay</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Michroma&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
  :root{
    --desk-a:#7fc6c9;--desk-b:#8ea8dc;--desk-c:#6f87c8;--grid:rgba(255,255,255,.34);
    --chrome:#eceade;--chrome-2:#e0ded1;--hi:#ffffff;--edge:#8f8b7e;--edge-dark:#54514a;
    --title-a:#26379d;--title-b:#3f7fc4;--text:#23262e;--dim:#5b5f66;--link:#3843b8;
    --accent:#c26107;--term-bg:#141f5c;--term-text:#dfe6ff;--term-ok:#8fe3f7;
    --ok:#0e7c66;--red:#b0362a;--amber:#c26107;
  }
  *{box-sizing:border-box;border-radius:0!important;margin:0;padding:0}
  body{font-family:Verdana,Tahoma,Geneva,sans-serif;color:var(--text);font-size:14px;line-height:1.65;
    background:repeating-linear-gradient(0deg,var(--grid) 0 1px,transparent 1px 44px),repeating-linear-gradient(90deg,var(--grid) 0 1px,transparent 1px 44px),linear-gradient(135deg,var(--desk-a),var(--desk-b) 52%,var(--desk-c));background-attachment:fixed;min-height:100vh}
  a{color:var(--link);text-decoration:none}a:hover{text-decoration:underline}
  h1,.logo,.panel h2{font-family:'Michroma',sans-serif;font-weight:400}
  .mono{font-family:'Share Tech Mono',Consolas,monospace}
  nav{background:linear-gradient(180deg,var(--chrome),var(--chrome-2));border-bottom:2px solid var(--edge-dark);box-shadow:0 2px 0 var(--edge)}
  nav .in{max-width:1160px;margin:0 auto;padding:0 20px;display:flex;align-items:center;justify-content:space-between;height:56px}
  .logo{font-size:16px;color:var(--text);display:flex;align-items:center;gap:8px}
  .logo .mark{background:var(--accent);color:#fff;width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi)}
  .navlinks{display:flex;gap:16px;align-items:center}
  .navlinks a,.navlinks span{color:var(--text);font-size:13px;cursor:pointer}
  .wrap{max-width:1240px;margin:0 auto;padding:24px 28px}
  .stats{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:18px}
  .stat{background:var(--chrome);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:1px 1px 0 var(--edge);padding:12px 14px}
  .stat .k{color:var(--dim);font-size:10px;text-transform:uppercase;letter-spacing:.05em}
  .stat .v{font-size:24px;font-weight:700;margin-top:3px;font-family:'Share Tech Mono',monospace}
  .stat .v.g{color:var(--ok)}
  .panel{background:var(--chrome);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:2px 2px 0 var(--edge);padding:0 18px 18px;margin-bottom:16px}
  .panel h2{font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#fff;margin:0 -18px 16px;padding:9px 16px;background:linear-gradient(90deg,var(--title-a),var(--title-b));border-bottom:2px solid var(--edge-dark)}
  table{width:100%;border-collapse:collapse;font-size:12px}
  th{text-align:left;color:#fff;font-weight:700;padding:7px 8px;font-size:10px;text-transform:uppercase;background:linear-gradient(180deg,#3f7fc4,#26379d)}
  td{padding:7px 8px;border-bottom:1px solid var(--edge);vertical-align:middle}
  tr:nth-child(even) td{background:rgba(255,255,255,.4)}
  tr:hover td{background:#fff6d9}
  .dim{color:var(--dim);font-size:12px}
  .bd{padding:2px 8px;font-size:10px;font-weight:700;text-transform:uppercase;border:1px solid rgba(0,0,0,.35)}
  .online{color:var(--ok)} .offline{color:var(--red)}
  .dot{width:8px;height:8px;display:inline-block;margin-right:5px;border:1px solid rgba(0,0,0,.3)}
  .dot.on{background:var(--ok)} .dot.off{background:var(--red)}
  button{background:linear-gradient(180deg,var(--chrome),var(--chrome-2));color:var(--text);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);padding:5px 9px;font-size:11px;font-weight:700;cursor:pointer;margin:2px}
  button:active{border-color:var(--edge-dark) var(--hi) var(--hi) var(--edge-dark)}
  button.red{color:var(--red)}
  button.amber{color:var(--accent)}
  input{width:100%;background:#fff;border:2px solid;border-color:var(--edge-dark) var(--hi) var(--hi) var(--edge-dark);color:var(--text);padding:10px 11px;font-size:14px}
  .msg{font-size:12px;margin-top:8px;padding:8px;display:none;border:2px solid}
  .msg.ok{background:#dff3ea;color:var(--ok);border-color:var(--ok);display:block}
  .msg.err{background:#f7dcd9;color:var(--red);border-color:var(--red);display:block}
  .authwrap{max-width:380px;margin:70px auto;padding:0 20px}
  .authcard{background:var(--chrome);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:2px 2px 0 var(--edge);padding:26px}
  .authcard h1{font-size:20px;margin-bottom:4px}
  .authcard .sub{color:var(--dim);font-size:12px;margin-bottom:18px}
  .authcard label{display:block;font-size:11px;color:var(--dim);margin:10px 0 4px;text-transform:uppercase}
  .authcard button{width:100%;background:linear-gradient(180deg,#d97a2a,#c26107);color:#fff;border:2px solid;border-color:#e8a869 #7a3d04 #7a3d04 #e8a869;padding:11px;font-weight:700;font-size:14px;margin-top:16px}
  .hidden{display:none!important}
  .sub-tabs{display:flex;gap:0;margin-bottom:16px}
  .sub-tabs div{padding:9px 16px;font-size:12px;cursor:pointer;color:var(--text);background:linear-gradient(180deg,var(--chrome),var(--chrome-2));border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi)}
  .sub-tabs div.active{background:linear-gradient(180deg,#d97a2a,#c26107);color:#fff;font-weight:700;border-color:#7a3d04 #e8a869 #e8a869 #7a3d04}
  .modal{display:none;position:fixed;inset:0;background:rgba(20,31,92,.5);z-index:100;align-items:center;justify-content:center;padding:16px}
  .modal.on{display:flex}
  .modal .box{background:var(--chrome);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:3px 3px 0 var(--edge);width:100%;max-width:440px}
  .modal .tt{background:linear-gradient(90deg,var(--title-a),var(--title-b));color:#fff;font-family:'Michroma';font-size:11px;padding:8px 12px;display:flex;justify-content:space-between;align-items:center}
  .modal .tt .x{cursor:pointer;font-family:Verdana,sans-serif}
  .modal .bd2{padding:18px}
  .modal .val{width:100%;background:var(--term-bg);color:var(--term-ok);border:2px solid;border-color:var(--edge-dark) #2b3a7a #2b3a7a var(--edge-dark);padding:12px;font-family:'Share Tech Mono',monospace;font-size:15px;word-break:break-all}
  .clipbtn{display:inline-flex;align-items:center;justify-content:center;cursor:pointer;background:linear-gradient(180deg,var(--chrome),var(--chrome-2));border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);color:var(--text);font-size:17px;padding:0 12px;min-width:44px}
  .clipbtn:active{border-color:var(--edge-dark) var(--hi) var(--hi) var(--edge-dark)}
  @media(max-width:820px){
    .stats{grid-template-columns:repeat(2,1fr)}table{font-size:12px}
    .wrap{padding:14px}
    .sub-tabs{flex-wrap:wrap}
    .sub-tabs div{flex:1;text-align:center}
    #setgrid{grid-template-columns:1fr!important}
    nav .in{padding:0 14px}
  }
</style></head><body>

<div id="authview">
  <div class="authwrap"><div class="authcard">
    <h1><span style="background:var(--amber);color:#241d02;padding:0 8px">G</span> Admin</h1>
    <div class="sub">Login akun admin GatePay.</div>
    <label>Username</label><input id="u" type="text" placeholder="admin username">
    <label>Password</label><input id="p" type="password" placeholder="password">
    <div id="fa2-wrap" class="hidden"><label>Kode 2FA</label><input id="fa2" inputmode="numeric" maxlength="6" placeholder="123456"></div>
    <button onclick="login()">Masuk Admin</button>
    <div class="msg" id="amsg"></div>
    <div class="dim" style="font-size:11px;margin-top:14px"><a href="/dashboard">← Dashboard merchant biasa</a></div>
  </div></div>
</div>

<div id="appview" class="hidden">
<nav><div class="in">
  <a class="logo" href="/"><span class="mark">G</span>GatePay Admin</a>
  <div class="navlinks"><a href="/dashboard">Dashboard</a><span id="whoami"></span><span onclick="logout()" style="color:var(--red)">Keluar</span></div>
</div></nav>
<div class="wrap">
  <div class="stats">
    <div class="stat"><div class="k">Merchant</div><div class="v" id="s-merch">0</div></div>
    <div class="stat"><div class="k">Aktif</div><div class="v g" id="s-active">0</div></div>
    <div class="stat"><div class="k">Total Order</div><div class="v" id="s-orders">0</div></div>
    <div class="stat"><div class="k">Paid</div><div class="v g" id="s-paid">0</div></div>
    <div class="stat"><div class="k">Revenue</div><div class="v" id="s-rev">Rp 0</div></div>
  </div>

  <div class="sub-tabs">
    <div id="t-merch" class="active" onclick="showTab('merch')">Merchant &amp; Device</div>
    <div id="t-tiket" onclick="showTab('tiket')" style="position:relative">Tiket <span id="tk-tabdot" style="display:none;position:absolute;top:3px;right:3px;width:10px;height:10px;background:#b0362a;border:1px solid #fff"></span></div>
    <div id="t-log" onclick="showTab('log')">Log Global</div>
    <div id="t-set" onclick="showTab('set')">Pengaturan Web</div>
  </div>

  <div id="view-merch">
    <div class="panel">
      <h2>Merchant &amp; Monitoring Device</h2>
      <div class="dim" style="margin-bottom:8px;font-size:12px">Klik baris user buat lihat rekap &amp; aksi.</div>
      <div style="overflow-x:auto"><table><thead><tr>
        <th>User</th><th>Device</th><th>QRIS</th><th>Fee</th><th>Order</th><th>Revenue</th><th>Status</th>
      </tr></thead><tbody id="mtbody"><tr><td colspan=7 class=dim style="text-align:center;padding:20px">Loading…</td></tr></tbody></table></div>
      <div class="msg" id="mmsg"></div>
    </div>
  </div>

  <div id="view-log" class="hidden">
    <div class="panel">
      <h2>Orders Global (100 terakhir)</h2>
      <div style="overflow-x:auto"><table><thead><tr><th>ID</th><th>User</th><th>Nominal</th><th>Status</th><th>Waktu</th></tr></thead>
      <tbody id="ologbody"></tbody></table></div>
    </div>
    <div class="panel">
      <h2>Events Global (100 terakhir)</h2>
      <div style="overflow-x:auto"><table><thead><tr><th>Event</th><th>User</th><th>Nominal</th><th>Status</th><th>Waktu</th></tr></thead>
      <tbody id="elogbody"></tbody></table></div>
    </div>
  </div>

  <div id="view-tiket" class="hidden">
    <div class="panel">
      <h2>Tiket Support Masuk</h2>
      <div style="overflow-x:auto"><table><thead><tr><th>User</th><th>Subjek</th><th>Pesan</th><th>Update</th><th>Status</th><th>Aksi</th></tr></thead>
      <tbody id="tktbody"><tr><td colspan=6 class=dim style="text-align:center;padding:20px">Loading…</td></tr></tbody></table></div>
    </div>
    <div class="panel" id="atk-detail" style="display:none;position:relative">
      <button onclick="closeAdminTicket()" title="Tutup" style="position:absolute;top:5px;right:6px;z-index:2;width:auto;margin:0;padding:2px 10px;font-size:14px;background:transparent;border:0;color:#fff">✕</button>
      <h2 id="atk-dtitle">THREAD</h2>
      <div id="atk-thread" style="max-height:360px;overflow-y:auto;margin-bottom:12px"></div>
      <div style="display:flex;gap:8px;align-items:stretch">
        <textarea id="atk-reply" placeholder="balasan admin..." style="flex:1;min-height:60px;background:#fff;border:2px solid;border-color:var(--edge-dark) var(--hi) var(--hi) var(--edge-dark);padding:9px;font-family:inherit;font-size:14px"></textarea>
        <label class="clipbtn" title="Lampirkan gambar (maks 1.5MB)">📎<input type="file" id="atk-rfile" accept="image/*" onchange="pickAImg(this)" hidden></label>
      </div>
      <img id="atk-rprev" style="max-width:90px;margin-top:6px;display:none;border:2px solid var(--edge)">
      <button onclick="replyAdminTicket()" style="width:auto;margin-top:8px;display:block">Kirim Balasan</button>
    </div>
  </div>

  <div id="view-set" class="hidden">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:900px" id="setgrid">
      <div class="panel">
        <h2>IDENTITAS_WEB.CFG</h2>
        <label>Nama Situs</label><input id="set-site_name" placeholder="GatePay">
        <label>Deskripsi (meta)</label><input id="set-description" placeholder="Payment gateway QRIS otomatis">
        <label>Warna Tema (hex)</label>
        <div style="display:flex;gap:8px;align-items:center"><input id="set-theme_color" placeholder="#26379d" style="flex:1" oninput="setPrev()"><span id="clr" style="width:34px;height:34px;border:2px solid var(--edge-dark);display:inline-block"></span></div>
        <button onclick="saveSet()">Simpan Pengaturan</button>
        <div class="msg" id="setmsg"></div>
      </div>
      <div class="panel">
        <h2>FAVICON.ICO</h2>
        <div class="dim" style="margin-bottom:8px">Isi 1 emoji (mis. 💳 🟢 ⚡ 🏦) atau URL gambar (https://...). Kepakai jadi favicon + icon app.</div>
        <label>Favicon (emoji / URL)</label>
        <div style="display:flex;gap:10px;align-items:center">
          <input id="set-favicon" placeholder="💳" style="flex:1" oninput="setPrev()">
          <span id="favprev" style="font-size:30px;width:44px;height:44px;display:inline-flex;align-items:center;justify-content:center;background:#fff;border:2px solid var(--edge-dark)"></span>
        </div>
        <div style="border-top:1px solid var(--edge);margin:14px 0;padding-top:8px"></div>
        <h2 style="margin-left:-16px;margin-right:-16px">WEB_APP.PWA</h2>
        <label style="display:flex;align-items:center;gap:8px;text-transform:none"><input type="checkbox" id="set-pwa_enabled" style="width:auto"> Aktifkan Web App (PWA — bisa "Add to Home Screen")</label>
        <label>Nama App</label><input id="set-pwa_name" placeholder="GatePay">
        <label>Nama Pendek (icon)</label><input id="set-pwa_short_name" placeholder="GatePay">
        <button onclick="saveSet()">Simpan Pengaturan</button>
        <div class="msg" id="setmsg2"></div>
      </div>

      <div class="panel" style="grid-column:1/-1">
        <h2>CHAT_SUPPORT.CFG</h2>
        <div class="dim" style="margin-bottom:8px">Tombol chat melayang di pojok kanan bawah semua halaman. Aktifkan WhatsApp dan/atau Telegram.</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div>
            <label style="display:flex;align-items:center;gap:8px;text-transform:none"><input type="checkbox" id="set-wa_enabled" style="width:auto"> Aktifkan WhatsApp</label>
            <label>Nomor WA (62xxx)</label><input id="set-wa_number" placeholder="628123456789">
            <label>Teks pembuka WA</label><input id="set-wa_text" placeholder="Halo, saya butuh bantuan">
          </div>
          <div>
            <label style="display:flex;align-items:center;gap:8px;text-transform:none"><input type="checkbox" id="set-tg_enabled" style="width:auto"> Aktifkan Telegram</label>
            <label>Username Telegram (tanpa @)</label><input id="set-tg_username" placeholder="gatepaysupport">
          </div>
        </div>
        <button onclick="saveSet()">Simpan Pengaturan</button>
        <div class="msg" id="setmsg3"></div>
      </div>
    </div>
  </div>
</div>
</div>

<div class="modal" id="mmodal" onclick="if(event.target===this)closeMModal()">
  <div class="box" style="max-width:480px">
    <div class="tt"><span id="mm-title">MERCHANT</span><span class="x" onclick="closeMModal()">✕</span></div>
    <div class="bd2">
      <div id="mm-recap"></div>
      <div id="mm-actions" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:14px"></div>
    </div>
  </div>
</div>

<div class="modal" id="modal" onclick="if(event.target===this)closeModal()">
  <div class="box">
    <div class="tt"><span id="mtt">RESULT</span><span class="x" onclick="closeModal()">✕</span></div>
    <div class="bd2">
      <div class="dim" id="msub" style="margin-bottom:8px"></div>
      <input class="val" id="mval" readonly onclick="this.select()">
      <button onclick="copyResult()" id="mcopy">📋 Copy</button>
      <div class="dim" style="font-size:11px;margin-top:8px">Klik field buat select semua, atau tekan Copy. Simpan sebelum tutup — nggak ditampilkan lagi.</div>
    </div>
  </div>
</div>

<script>
  const $=id=>document.getElementById(id);
  const idr=n=>'Rp '+(Number(n)||0).toLocaleString('id-ID');
  const escj=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const agoj=ts=>{ if(!ts)return'-'; try{ var p={}; new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Jakarta',day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date(ts*1000)).forEach(x=>p[x.type]=x.value); return p.day+'/'+p.month+'/'+p.year+' '+p.hour+':'+p.minute; }catch(e){ return '-'; } };
  const bmap={paid:['#0e7c66','#fff'],pending:['#ffc266','#3a2a00'],expired:['#9aa0a8','#fff'],cancelled:['#b0362a','#fff'],matched:['#0e7c66','#fff'],unmatched:['#9aa0a8','#fff'],duplicate:['#3843b8','#fff']};
  const bdg=s=>{const[bg,fg]=bmap[s]||['#6b7280','#0b0d11'];return '<span class="bd" style="background:'+bg+';color:'+fg+'">'+escj(s)+'</span>';};
  function msg(id,cls,t){ var e=$(id); e.className='msg '+cls; e.textContent=t; }

  let meIsOwner=false, allMerchants=[];
  function sess(){ try{ return JSON.parse(localStorage.getItem('gp_admin')||'null'); }catch(e){ return null; } }
  function key(){ var s=sess(); return s?s.api_key:''; }
  function hdr(){ return {'x-api-key':key(),'content-type':'application/json'}; }

  async function login(){
    var u=$('u').value.trim().toLowerCase(), p=$('p').value;
    if(!u||!p) return msg('amsg','err','Isi username & password');
    var payload={username:u,password:p};
    if(!$('fa2-wrap').classList.contains('hidden')) payload.totp=$('fa2').value.trim();
    try{
      var r=await fetch('/api/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
      var j=await r.json();
      if(!r.ok){ if(j.needs_2fa){ $('fa2-wrap').classList.remove('hidden'); $('fa2').focus(); return msg('amsg','err',j.error||'Masukin kode 2FA'); } return msg('amsg','err',j.error||'gagal'); }
      if(!j.is_admin) return msg('amsg','err','Akun ini bukan admin');
      localStorage.setItem('gp_admin',JSON.stringify(j)); showApp();
    }catch(e){ msg('amsg','err',String(e)); }
  }
  function logout(){ localStorage.removeItem('gp_admin'); location.reload(); }

  function showApp(){
    var s=sess(); if(!s) return;
    $('authview').classList.add('hidden'); $('appview').classList.remove('hidden');
    $('whoami').textContent='@'+s.username+' (admin)';
    load(); setInterval(load, 5000);
  }
  let tab='merch';
  function showTab(t){ tab=t;
    ['merch','tiket','log','set'].forEach(k=>{ $('t-'+k).className=t===k?'active':''; $('view-'+k).classList.toggle('hidden',t!==k); });
    if(t==='set') loadSet(); else if(t==='tiket') loadAdminTickets(); else load(); }

  // ── tiket admin ──
  let curTk=null;
  const TKB={active:['#ffc266','#3a2a00'],proses:['#3f7fc4','#fff'],close:['#9aa0a8','#fff']};
  function tkbadge(s){var b=TKB[s]||['#9aa0a8','#fff'];return '<span class="bd" style="background:'+b[0]+';color:'+b[1]+'">'+escj(s)+'</span>';}
  async function loadAdminTickets(){
    try{ var j=await (await fetch('/api/admin/tickets',{headers:hdr()})).json();
      var unc=(j.tickets||[]).filter(t=>t.admin_unread).length; if($('tk-tabdot')) $('tk-tabdot').style.display=unc>0?'block':'none';
      $('tktbody').innerHTML=(j.tickets||[]).map(t=>{
        var opts=['active','proses','close'].map(s=>'<option value="'+s+'"'+(t.status===s?' selected':'')+'>'+s+'</option>').join('');
        var dot=t.admin_unread?' <span title="baru dari user" style="display:inline-block;width:9px;height:9px;background:#b0362a;border:1px solid #fff;vertical-align:middle"></span>':'';
        return '<tr><td><b>@'+escj(t.username||'-')+'</b></td><td>'+escj((t.subject||'').slice(0,40))+dot+'</td><td class=dim>'+(t.msg_count||0)+' pesan</td><td class=dim>'+agoj(t.updated_at)+'</td>'+
          '<td><select onchange="changeTicketStatus(\\''+t.id+'\\',this.value)" style="width:auto;padding:4px">'+opts+'</select></td>'+
          '<td><button onclick="openAdminTicket(\\''+t.id+'\\')">Lihat</button></td></tr>';
      }).join('')||'<tr><td colspan=6 class=dim style="text-align:center;padding:20px">Belum ada tiket</td></tr>';
    }catch(e){}
  }
  async function changeTicketStatus(id,st){ await fetch('/api/admin/tickets/'+id+'/status',{method:'POST',headers:hdr(),body:JSON.stringify({status:st})}); loadAdminTickets(); if(curTk===id) openAdminTicket(id); }
  var atkImg=null;
  function pickAImg(input){
    var f=input.files[0]; if(!f){atkImg=null;return;}
    if(f.size>1572864){ alert('Gambar maksimal 1.5MB'); input.value=''; atkImg=null; return; }
    var im=new Image(); im.onload=function(){ var mx=1280,sc=Math.min(1,mx/Math.max(im.width,im.height)); var w=Math.round(im.width*sc),h=Math.round(im.height*sc); var cv=document.createElement('canvas'); cv.width=w;cv.height=h; cv.getContext('2d').drawImage(im,0,0,w,h); atkImg=cv.toDataURL('image/jpeg',0.82); if($('atk-rprev')){$('atk-rprev').src=atkImg;$('atk-rprev').style.display='block';} };
    im.onerror=function(){ alert('File bukan gambar'); input.value=''; atkImg=null; }; im.src=URL.createObjectURL(f);
  }
  function closeAdminTicket(){ $('atk-detail').style.display='none'; curTk=null; }
  async function openAdminTicket(id){
    curTk=id;
    try{ var j=await (await fetch('/api/tickets/'+id,{headers:hdr()})).json(); if(!j.ticket) return;
      $('atk-detail').style.display='block';
      $('atk-dtitle').innerHTML=escj(j.ticket.subject)+' &nbsp;'+tkbadge(j.ticket.status);
      $('atk-thread').innerHTML=(j.messages||[]).map(mm=>{
        var role=mm.sender_role||(mm.sender==='admin'?'admin':'user'); var staff=role!=='user'; var name=mm.sender_name||'';
        var lbl=role==='user'?('User'+(name?' ('+name+')':'')):(role.charAt(0).toUpperCase()+role.slice(1)+(name?' ('+name+')':''));
        var img=mm.image?'<img src="'+mm.image+'" style="max-width:200px;display:block;margin-top:6px;border:2px solid var(--edge);cursor:pointer" onclick="window.open(this.src)">':'';
        return '<div style="margin-bottom:8px;text-align:'+(staff?'right':'left')+'"><div style="display:inline-block;max-width:82%;padding:8px 10px;border:2px solid var(--edge);background:'+(staff?'#dbe7fb':'#fff6d9')+';text-align:left"><div class=dim style="font-size:10px;margin-bottom:2px">'+escj(lbl)+' · '+agoj(mm.created_at)+' lalu</div>'+escj(mm.body)+img+'</div></div>';
      }).join('')||'<div class=dim>kosong</div>';
      $('atk-thread').scrollTop=$('atk-thread').scrollHeight;
      $('atk-detail').scrollIntoView({behavior:'smooth',block:'nearest'});
      loadAdminTickets();
    }catch(e){}
  }
  async function replyAdminTicket(){
    if(!curTk) return; var b=$('atk-reply').value.trim(); if(!b&&!atkImg) return;
    var r=await fetch('/api/tickets/'+curTk+'/reply',{method:'POST',headers:hdr(),body:JSON.stringify({body:b,image:atkImg||undefined})});
    if(r.ok){ $('atk-reply').value=''; if($('atk-rfile'))$('atk-rfile').value=''; if($('atk-rprev'))$('atk-rprev').style.display='none'; atkImg=null; openAdminTicket(curTk); loadAdminTickets(); }
  }

  const SET_KEYS=['site_name','description','theme_color','favicon','pwa_name','pwa_short_name','wa_number','wa_text','tg_username'];
  const SET_BOOLS=['pwa_enabled','wa_enabled','tg_enabled'];
  async function loadSet(){
    try{ var j=await (await fetch('/api/admin/settings',{headers:hdr()})).json();
      SET_KEYS.forEach(k=>{ if($('set-'+k)) $('set-'+k).value=j[k]||''; });
      SET_BOOLS.forEach(k=>{ if($('set-'+k)) $('set-'+k).checked = (j[k]==='1'||j[k]===1); });
      setPrev();
    }catch(e){}
  }
  function setPrev(){
    var f=$('set-favicon').value.trim();
    $('favprev').textContent = /^https?:\\/\\//i.test(f) ? '🖼' : (f||'💳');
    $('clr').style.background=$('set-theme_color').value.trim()||'#26379d';
  }
  async function saveSet(){
    var payload={};
    SET_BOOLS.forEach(k=>{ payload[k]=$('set-'+k).checked?1:0; });
    SET_KEYS.forEach(k=>{ payload[k]=$('set-'+k).value.trim(); });
    try{ var r=await fetch('/api/admin/settings',{method:'POST',headers:hdr(),body:JSON.stringify(payload)});
      var j=await r.json();
      if(r.ok){ msg('setmsg','ok','Pengaturan tersimpan ✓ (refresh halaman buat lihat favicon baru)'); msg('setmsg2','ok','Tersimpan ✓'); setPrev(); }
      else { msg('setmsg','err',j.error||'gagal'); }
    }catch(e){ msg('setmsg','err',String(e)); }
  }

  async function load(){
    if(!key()) return;
    try{
      var st=await (await fetch('/api/admin/stats',{headers:hdr()})).json();
      $('s-merch').textContent=st.merchants?.n||0; $('s-active').textContent=st.merchants?.active||0;
      $('s-orders').textContent=st.orders?.total||0; $('s-paid').textContent=st.orders?.paid||0;
      $('s-rev').textContent=idr(st.orders?.revenue);
      if($('tk-tabdot')) $('tk-tabdot').style.display=(st.tickets_unread>0)?'block':'none';
      if(tab==='merch'){
        var d=await (await fetch('/api/admin/merchants',{headers:hdr()})).json();
        meIsOwner=!!d.me_is_owner; allMerchants=d.merchants||[];
        $('mtbody').innerHTML=allMerchants.map(m=>{
          var on = m.last_seen && (Math.floor(Date.now()/1000)-m.last_seen < 300);
          var dev = m.device_id ? '<span class="'+(on?'online':'offline')+'"><span class="dot '+(on?'on':'off')+'"></span>'+(on?'online':(m.last_seen?agoj(m.last_seen):'belum pernah'))+'</span>' : '<span class=dim>-</span>';
          var st = m.active?'<span class="bd" style="background:#0e7c66;color:#fff">aktif</span>':'<span class="bd" style="background:#b0362a;color:#fff">suspend</span>';
          var role = m.is_owner?' <span class="bd" style="background:#c26107;color:#fff">OWNER</span>':(m.is_admin?' <span class="bd" style="background:#26379d;color:#fff">ADMIN</span>':'');
          return '<tr onclick="openMerchant(\\''+m.id+'\\')" style="cursor:pointer"><td><b>@'+escj(m.username||'-')+'</b>'+role+'<br><span class=dim>'+escj((m.name||'').slice(0,18))+'</span></td>'+
            '<td class=dim>'+dev+'</td>'+
            '<td>'+(m.has_qris?'✓':'<span class=dim>-</span>')+'</td>'+
            '<td class=dim>'+(m.fee_percent||0)+'%</td>'+
            '<td class=dim>'+m.paid_orders+'/'+m.total_orders+'</td>'+
            '<td class=mono>'+idr(m.revenue)+'</td>'+
            '<td>'+st+'</td></tr>';
        }).join('')||'<tr><td colspan=7 class=dim style="text-align:center;padding:20px">Belum ada merchant</td></tr>';
      } else {
        var lg=await (await fetch('/api/admin/log',{headers:hdr()})).json();
        $('ologbody').innerHTML=(lg.orders||[]).map(o=>'<tr><td class=mono>'+escj(o.id.slice(0,12))+'</td><td class=dim>@'+escj(o.username||'-')+'</td><td class=mono>'+idr(o.unique_amount)+'</td><td>'+bdg(o.status)+'</td><td class=dim>'+agoj(o.created_at)+'</td></tr>').join('')||'<tr><td colspan=5 class=dim style="text-align:center;padding:16px">kosong</td></tr>';
        $('elogbody').innerHTML=(lg.events||[]).map(e=>'<tr><td class=mono>'+escj((e.id||'').slice(0,12))+'</td><td class=dim>@'+escj(e.username||'-')+'</td><td class=mono>'+(e.amount!=null?idr(e.amount):'-')+'</td><td>'+bdg(e.status)+'</td><td class=dim>'+agoj(e.created_at)+'</td></tr>').join('')||'<tr><td colspan=5 class=dim style="text-align:center;padding:16px">kosong</td></tr>';
      }
    }catch(e){}
  }

  // ── modal hasil (bisa di-copy) ──
  function showResult(title,sub,val){ $('mtt').textContent=title; $('msub').textContent=sub; $('mval').value=val; $('mcopy').textContent='📋 Copy'; $('modal').classList.add('on'); setTimeout(function(){ $('mval').focus(); $('mval').select(); },50); }
  function closeModal(){ $('modal').classList.remove('on'); }
  function copyResult(){ var v=$('mval').value; if(navigator.clipboard){ navigator.clipboard.writeText(v).then(function(){ $('mcopy').textContent='✓ Tersalin'; }); } $('mval').select(); }
  document.addEventListener('keydown',function(e){ if(e.key==='Escape')closeModal(); });

  async function setAdmin(id,v){ if(!confirm(v?'Jadikan user ini admin?':'Cabut akses admin user ini?'))return; var r=await fetch('/api/admin/merchants/'+id+'/set-admin',{method:'POST',headers:hdr(),body:JSON.stringify({admin:v})}); var j=await r.json(); if(!r.ok)alert(j.error||'gagal'); reopenAfter(id); }
  // ── popup rekap merchant + aksi (text) ──
  function mmRow(k,v){ return '<div style="display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px solid var(--edge)"><span class=dim>'+k+'</span><span style="font-weight:600;text-align:right">'+v+'</span></div>'; }
  function mmBtn(cls,label,onc){ return '<button class="'+cls+'" onclick="'+onc+'">'+label+'</button>'; }
  function openMerchant(id){
    var m=allMerchants.find(x=>x.id===id); if(!m) return;
    var on=m.last_seen && (Math.floor(Date.now()/1000)-m.last_seen<300);
    var role=m.is_owner?'👑 Owner':(m.is_admin?'🛡 Admin':'Merchant');
    var u=escj(m.username||'');
    $('mm-title').textContent='@'+(m.username||'-');
    $('mm-recap').innerHTML=
      mmRow('Nama', escj(m.name||'-'))+
      mmRow('Role', role)+
      mmRow('Status', m.active?'<span style="color:var(--ok)">Aktif</span>':'<span style="color:var(--red)">Suspend</span>')+
      mmRow('Device', m.device_id?(on?'<span style="color:var(--ok)">online</span>':(m.last_seen?agoj(m.last_seen):'belum pernah')):'-')+
      mmRow('QRIS', m.has_qris?'✓ ada':'belum ada')+
      mmRow('Fee', (m.fee_percent||0)+'% · kode '+(m.unique_digits||2)+' digit')+
      mmRow('Order', m.paid_orders+' / '+m.total_orders+' paid')+
      mmRow('Revenue', idr(m.revenue))+
      mmRow('2FA', m.totp_enabled?'<span style="color:var(--ok)">aktif</span>':'nonaktif')+
      mmRow('Gabung', agoj(m.created_at));
    var a=[];
    a.push(m.active?mmBtn('amber','Suspend',"setActive('"+m.id+"',0)"):mmBtn('','Aktifkan',"setActive('"+m.id+"',1)"));
    a.push(mmBtn('','Reset Password',"resetPw('"+m.id+"','"+u+"')"));
    if(m.totp_enabled) a.push(mmBtn('amber','Reset 2FA',"reset2fa('"+m.id+"','"+u+"')"));
    if(meIsOwner && !m.is_owner) a.push(m.is_admin?mmBtn('amber','Cabut Admin',"setAdmin('"+m.id+"',0)"):mmBtn('','Jadikan Admin',"setAdmin('"+m.id+"',1)"));
    if(!m.is_owner) a.push(mmBtn('red','Hapus',"delMerch('"+m.id+"','"+u+"')"));
    $('mm-actions').innerHTML=a.join('');
    $('mmodal').classList.add('on');
  }
  function closeMModal(){ $('mmodal').classList.remove('on'); }
  async function reopenAfter(id){ await load(); if($('mmodal').classList.contains('on')) openMerchant(id); }

  async function reset2fa(id,u){ if(!confirm('Reset/matikan 2FA untuk @'+u+'? Dia bisa login tanpa kode lagi & set ulang authenticator.'))return; var r=await fetch('/api/admin/merchants/'+id+'/reset-2fa',{method:'POST',headers:hdr()}); if(r.ok){ alert('2FA @'+u+' udah di-reset'); reopenAfter(id); } else alert('gagal'); }
  async function setActive(id,a){ await fetch('/api/admin/merchants/'+id+'/active',{method:'POST',headers:hdr(),body:JSON.stringify({active:a})}); reopenAfter(id); }
  async function delMerch(id,u){ if(!confirm('Hapus merchant @'+u+'? Semua ordernya ikut hilang.'))return; await fetch('/api/admin/merchants/'+id+'/delete',{method:'POST',headers:hdr()}); closeMModal(); load(); }
  async function resetPw(id,u){ var r=await (await fetch('/api/admin/merchants/'+id+'/reset-password',{method:'POST',headers:hdr()})).json(); if(r.new_password) showResult('PASSWORD_BARU.KEY','Password baru untuk @'+u+':',r.new_password); }
  async function regenKey(id){ var r=await (await fetch('/api/admin/merchants/'+id+'/regenerate-key',{method:'POST',headers:hdr()})).json(); if(r.api_key) showResult('API_KEY_BARU.KEY','API Key baru (sk_live):',r.api_key); }

  if(sess()) showApp();
</script>
</body></html>`;
}
