// Dashboard Admin — manajemen merchant, statistik global, monitoring device, log.
// Login pakai akun is_admin. Gaya kotak siku.

export function renderAdmin() {
  return `<!DOCTYPE html>
<html lang="id"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Admin · GatePay</title>
<style>
  :root{--bg:#0f1115;--card:#171a21;--card2:#1e222b;--bd:#2b3038;--tx:#eef0f4;--dim:#9aa3b2;--brand:#3ddc97;--brandink:#04120b;--red:#ff5c5c;--amber:#f6c445}
  *{box-sizing:border-box;border-radius:0!important;margin:0;padding:0}
  body{font-family:'Inter',-apple-system,'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--tx);line-height:1.5}
  a{color:var(--brand);text-decoration:none}
  nav{border-bottom:1px solid var(--bd);background:var(--card)}
  nav .in{max-width:1160px;margin:0 auto;padding:0 20px;display:flex;align-items:center;justify-content:space-between;height:60px}
  .logo{font-weight:800;font-size:19px;color:var(--tx);display:flex;align-items:center;gap:8px}
  .logo .mark{background:var(--amber);color:#241d02;width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center}
  .navlinks{display:flex;gap:16px;align-items:center}
  .navlinks a,.navlinks span{color:var(--dim);font-size:14px;cursor:pointer}
  .wrap{max-width:1160px;margin:0 auto;padding:24px 20px}
  .stats{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:20px}
  .stat{background:var(--card);border:1px solid var(--bd);padding:14px}
  .stat .k{color:var(--dim);font-size:11px;text-transform:uppercase;letter-spacing:.05em}
  .stat .v{font-size:22px;font-weight:800;margin-top:2px}
  .stat .v.g{color:var(--brand)}
  .panel{background:var(--card);border:1px solid var(--bd);padding:16px;margin-bottom:16px}
  .panel h2{font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:var(--dim);margin-bottom:12px}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th{text-align:left;color:var(--dim);font-weight:600;padding:8px;border-bottom:1px solid var(--bd);font-size:11px;text-transform:uppercase}
  td{padding:8px;border-bottom:1px solid var(--card2);vertical-align:middle}
  tr:hover td{background:var(--card2)}
  .mono{font-family:'JetBrains Mono',Consolas,monospace}
  .dim{color:var(--dim);font-size:12px}
  .bd{padding:2px 8px;font-size:11px;font-weight:700;text-transform:uppercase}
  .online{color:var(--brand)} .offline{color:var(--red)}
  .dot{width:8px;height:8px;display:inline-block;margin-right:5px}
  .dot.on{background:var(--brand)} .dot.off{background:var(--red)}
  button{background:var(--card2);color:var(--tx);border:1px solid var(--bd);padding:5px 9px;font-size:11px;font-weight:600;cursor:pointer;margin:2px}
  button:hover{opacity:.85}
  button.red{border-color:var(--red);color:var(--red)}
  button.amber{border-color:var(--amber);color:var(--amber)}
  input{width:100%;background:var(--card2);border:1px solid var(--bd);color:var(--tx);padding:9px 10px;font-size:13px}
  .msg{font-size:12px;margin-top:8px;padding:8px;display:none}
  .msg.ok{background:#123a2a;color:var(--brand);display:block}
  .msg.err{background:#2a1416;color:var(--red);display:block}
  .authwrap{max-width:360px;margin:70px auto;padding:0 20px}
  .authcard{background:var(--card);border:1px solid var(--bd);padding:28px}
  .authcard h1{font-size:22px;font-weight:800;margin-bottom:4px}
  .authcard .sub{color:var(--dim);font-size:13px;margin-bottom:20px}
  .authcard label{display:block;font-size:12px;color:var(--dim);margin:10px 0 4px}
  .authcard button{width:100%;background:var(--amber);color:#241d02;border:0;padding:11px;font-weight:700;font-size:14px;margin-top:16px}
  .hidden{display:none!important}
  .sub-tabs{display:flex;gap:0;border:1px solid var(--bd);margin-bottom:16px}
  .sub-tabs div{padding:10px 16px;font-size:13px;cursor:pointer;color:var(--dim);border-right:1px solid var(--bd)}
  .sub-tabs div.active{background:var(--amber);color:#241d02;font-weight:700}
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
  const bmap={paid:['#3ddc97','#04120b'],pending:['#f6c445','#241d02'],expired:['#6b7280','#0b0d11'],cancelled:['#ff5c5c','#1c0808'],matched:['#3ddc97','#04120b'],unmatched:['#6b7280','#0b0d11'],duplicate:['#7c6cff','#0b0b1c']};
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
          var st = m.active?'<span class="bd" style="background:#3ddc97;color:#04120b">aktif</span>':'<span class="bd" style="background:#ff5c5c;color:#1c0808">suspend</span>';
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
