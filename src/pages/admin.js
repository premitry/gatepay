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
  body{font-family:Verdana,Tahoma,Geneva,sans-serif;color:var(--text);font-size:13px;line-height:1.6;
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
  .wrap{max-width:1160px;margin:0 auto;padding:22px 20px}
  .stats{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:18px}
  .stat{background:var(--chrome);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:1px 1px 0 var(--edge);padding:12px 14px}
  .stat .k{color:var(--dim);font-size:10px;text-transform:uppercase;letter-spacing:.05em}
  .stat .v{font-size:20px;font-weight:700;margin-top:3px;font-family:'Share Tech Mono',monospace}
  .stat .v.g{color:var(--ok)}
  .panel{background:var(--chrome);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:2px 2px 0 var(--edge);padding:0 16px 16px;margin-bottom:16px}
  .panel h2{font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#fff;margin:0 -16px 14px;padding:7px 14px;background:linear-gradient(90deg,var(--title-a),var(--title-b));border-bottom:2px solid var(--edge-dark)}
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
  input{width:100%;background:#fff;border:2px solid;border-color:var(--edge-dark) var(--hi) var(--hi) var(--edge-dark);color:var(--text);padding:8px 10px;font-size:13px}
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
  @media(max-width:820px){.stats{grid-template-columns:repeat(2,1fr)}table{font-size:12px}}
</style></head><body>

<div id="authview">
  <div class="authwrap"><div class="authcard">
    <h1><span style="background:var(--amber);color:#241d02;padding:0 8px">G</span> Admin</h1>
    <div class="sub">Login akun admin GatePay.</div>
    <label>Username</label><input id="u" type="text" placeholder="admin username">
    <label>Password</label><input id="p" type="password" placeholder="password">
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
    <div id="t-log" onclick="showTab('log')">Log Global</div>
  </div>

  <div id="view-merch">
    <div class="panel">
      <h2>Merchant &amp; Monitoring Device</h2>
      <div style="overflow-x:auto"><table><thead><tr>
        <th>User</th><th>Device</th><th>QRIS</th><th>Fee</th><th>Order</th><th>Revenue</th><th>Status</th><th>Aksi</th>
      </tr></thead><tbody id="mtbody"><tr><td colspan=8 class=dim style="text-align:center;padding:20px">Loading…</td></tr></tbody></table></div>
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
</div>
</div>

<script>
  const $=id=>document.getElementById(id);
  const idr=n=>'Rp '+(Number(n)||0).toLocaleString('id-ID');
  const escj=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const agoj=ts=>{ if(!ts)return'-'; let d=Math.max(0,Math.floor(Date.now()/1000)-ts); if(d<60)return d+'s'; if(d<3600)return Math.floor(d/60)+'m'; if(d<86400)return Math.floor(d/3600)+'j'; return Math.floor(d/86400)+'h'; };
  const bmap={paid:['#0e7c66','#fff'],pending:['#ffc266','#3a2a00'],expired:['#9aa0a8','#fff'],cancelled:['#b0362a','#fff'],matched:['#0e7c66','#fff'],unmatched:['#9aa0a8','#fff'],duplicate:['#3843b8','#fff']};
  const bdg=s=>{const[bg,fg]=bmap[s]||['#6b7280','#0b0d11'];return '<span class="bd" style="background:'+bg+';color:'+fg+'">'+escj(s)+'</span>';};
  function msg(id,cls,t){ var e=$(id); e.className='msg '+cls; e.textContent=t; }

  function sess(){ try{ return JSON.parse(localStorage.getItem('gp_admin')||'null'); }catch(e){ return null; } }
  function key(){ var s=sess(); return s?s.api_key:''; }
  function hdr(){ return {'x-api-key':key(),'content-type':'application/json'}; }

  async function login(){
    var u=$('u').value.trim().toLowerCase(), p=$('p').value;
    if(!u||!p) return msg('amsg','err','Isi username & password');
    try{
      var r=await fetch('/api/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({username:u,password:p})});
      var j=await r.json();
      if(!r.ok) return msg('amsg','err',j.error||'gagal');
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
  function showTab(t){ tab=t; $('t-merch').className=t==='merch'?'active':''; $('t-log').className=t==='log'?'active':'';
    $('view-merch').classList.toggle('hidden',t!=='merch'); $('view-log').classList.toggle('hidden',t!=='log'); load(); }

  async function load(){
    if(!key()) return;
    try{
      var st=await (await fetch('/api/admin/stats',{headers:hdr()})).json();
      $('s-merch').textContent=st.merchants?.n||0; $('s-active').textContent=st.merchants?.active||0;
      $('s-orders').textContent=st.orders?.total||0; $('s-paid').textContent=st.orders?.paid||0;
      $('s-rev').textContent=idr(st.orders?.revenue);
      if(tab==='merch'){
        var d=await (await fetch('/api/admin/merchants',{headers:hdr()})).json();
        $('mtbody').innerHTML=(d.merchants||[]).map(m=>{
          var on = m.last_seen && (Math.floor(Date.now()/1000)-m.last_seen < 300);
          var dev = m.device_id ? '<span class="'+(on?'online':'offline')+'"><span class="dot '+(on?'on':'off')+'"></span>'+(on?'online':(m.last_seen?agoj(m.last_seen)+' lalu':'belum pernah'))+'</span>' : '<span class=dim>-</span>';
          var st = m.active?'<span class="bd" style="background:#0e7c66;color:#fff">aktif</span>':'<span class="bd" style="background:#b0362a;color:#fff">suspend</span>';
          var adm = m.is_admin?' 👑':'';
          return '<tr><td><b>@'+escj(m.username||'-')+'</b>'+adm+'<br><span class=dim>'+escj((m.name||'').slice(0,18))+'</span></td>'+
            '<td class=dim>'+dev+'</td>'+
            '<td>'+(m.has_qris?'✓':'<span class=dim>-</span>')+'</td>'+
            '<td class=dim>'+(m.fee_percent||0)+'%</td>'+
            '<td class=dim>'+m.paid_orders+'/'+m.total_orders+'</td>'+
            '<td class=mono>'+idr(m.revenue)+'</td>'+
            '<td>'+st+'</td>'+
            '<td style="white-space:nowrap">'+
              (m.active?'<button class="amber" onclick="setActive(\\''+m.id+'\\',0)">Suspend</button>':'<button onclick="setActive(\\''+m.id+'\\',1)">Aktifkan</button>')+
              '<button onclick="resetPw(\\''+m.id+'\\',\\''+escj(m.username)+'\\')">Reset PW</button>'+
              '<button onclick="regenKey(\\''+m.id+'\\')">New Key</button>'+
              (m.is_admin?'':'<button class="red" onclick="delMerch(\\''+m.id+'\\',\\''+escj(m.username)+'\\')">Hapus</button>')+
            '</td></tr>';
        }).join('')||'<tr><td colspan=8 class=dim style="text-align:center;padding:20px">Belum ada merchant</td></tr>';
      } else {
        var lg=await (await fetch('/api/admin/log',{headers:hdr()})).json();
        $('ologbody').innerHTML=(lg.orders||[]).map(o=>'<tr><td class=mono>'+escj(o.id.slice(0,12))+'</td><td class=dim>@'+escj(o.username||'-')+'</td><td class=mono>'+idr(o.unique_amount)+'</td><td>'+bdg(o.status)+'</td><td class=dim>'+agoj(o.created_at)+'</td></tr>').join('')||'<tr><td colspan=5 class=dim style="text-align:center;padding:16px">kosong</td></tr>';
        $('elogbody').innerHTML=(lg.events||[]).map(e=>'<tr><td class=mono>'+escj((e.id||'').slice(0,12))+'</td><td class=dim>@'+escj(e.username||'-')+'</td><td class=mono>'+(e.amount!=null?idr(e.amount):'-')+'</td><td>'+bdg(e.status)+'</td><td class=dim>'+agoj(e.created_at)+'</td></tr>').join('')||'<tr><td colspan=5 class=dim style="text-align:center;padding:16px">kosong</td></tr>';
      }
    }catch(e){}
  }

  async function setActive(id,a){ await fetch('/api/admin/merchants/'+id+'/active',{method:'POST',headers:hdr(),body:JSON.stringify({active:a})}); load(); }
  async function delMerch(id,u){ if(!confirm('Hapus merchant @'+u+'? Semua ordernya ikut hilang.'))return; await fetch('/api/admin/merchants/'+id+'/delete',{method:'POST',headers:hdr()}); load(); }
  async function resetPw(id,u){ var r=await (await fetch('/api/admin/merchants/'+id+'/reset-password',{method:'POST',headers:hdr()})).json(); if(r.new_password) alert('Password baru @'+u+':\\n'+r.new_password); }
  async function regenKey(id){ var r=await (await fetch('/api/admin/merchants/'+id+'/regenerate-key',{method:'POST',headers:hdr()})).json(); if(r.api_key) alert('API Key baru:\\n'+r.api_key); }

  if(sess()) showApp();
</script>
</body></html>`;
}
