// Dashboard merchant — upload QRIS, buat order, pantau. Gaya kotak siku.

const rupiah = (n) => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');
const ago = (ts) => {
  if (!ts) return '-';
  const d = Math.max(0, Math.floor(Date.now() / 1000) - ts);
  if (d < 60) return d + 's';
  if (d < 3600) return Math.floor(d / 60) + 'm';
  if (d < 86400) return Math.floor(d / 3600) + 'j';
  return Math.floor(d / 86400) + 'h';
};
const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const badge = (s) => {
  const m = {
    paid: ['#3ddc97', '#04120b'], pending: ['#f6c445', '#241d02'],
    expired: ['#6b7280', '#0b0d11'], cancelled: ['#ff5c5c', '#1c0808'],
    matched: ['#3ddc97', '#04120b'], unmatched: ['#6b7280', '#0b0d11'],
    duplicate: ['#7c6cff', '#0b0b1c'],
  };
  const [bg, fg] = m[s] || ['#6b7280', '#0b0d11'];
  return `<span class="bd" style="background:${bg};color:${fg}">${esc(s)}</span>`;
};

export function renderDashboard({ orders, events, stats }) {
  const orderRows = orders.map((o) => `<tr>
    <td class="mono">${esc(o.id.slice(0, 12))}</td>
    <td class="mono">${rupiah(o.unique_amount)}<br><span class="dim">base ${rupiah(o.base_amount)}</span></td>
    <td>${badge(o.status)}</td>
    <td class="dim">${esc(o.reference || '-')}</td>
    <td><a class="lnk" href="/pay/${esc(o.id)}" target="_blank">checkout ↗</a></td>
    <td class="dim">${ago(o.created_at)}</td>
  </tr>`).join('');

  const eventRows = events.map((e) => `<tr>
    <td class="mono">${esc((e.id || '').slice(0, 14))}</td>
    <td class="mono">${e.amount != null ? rupiah(e.amount) : '-'}</td>
    <td>${badge(e.status)}</td>
    <td class="dim">${esc((e.raw_text || '').slice(0, 44))}</td>
    <td class="dim">${ago(e.created_at)}</td>
  </tr>`).join('');

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
  .navlinks a{color:var(--dim);font-size:14px;margin-left:16px}
  .wrap{max-width:1080px;margin:0 auto;padding:24px 20px}
  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
  .stat{background:var(--card);border:1px solid var(--bd);padding:14px}
  .stat .k{color:var(--dim);font-size:11px;text-transform:uppercase;letter-spacing:.05em}
  .stat .v{font-size:22px;font-weight:800;margin-top:2px}
  .stat .v.g{color:var(--brand)}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
  .panel{background:var(--card);border:1px solid var(--bd);padding:16px}
  .panel h2{font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:var(--dim);margin-bottom:12px}
  label{display:block;font-size:12px;color:var(--dim);margin:8px 0 4px}
  input,textarea{width:100%;background:var(--card2);border:1px solid var(--bd);color:var(--tx);padding:9px 10px;font-family:inherit;font-size:13px}
  textarea{resize:vertical;min-height:64px;font-family:'JetBrains Mono',Consolas,monospace}
  button{background:var(--brand);color:var(--brandink);border:0;padding:10px 16px;font-weight:700;font-size:13px;cursor:pointer;margin-top:10px}
  button:hover{opacity:.9}
  button.sec{background:var(--card2);color:var(--tx);border:1px solid var(--bd)}
  .msg{font-size:12px;margin-top:8px;padding:8px;display:none}
  .msg.ok{background:#123a2a;color:var(--brand);display:block}
  .msg.err{background:#2a1416;color:#ff5c5c;display:block}
  .res{margin-top:12px;padding:12px;background:var(--card2);border:1px solid var(--bd);display:none}
  .res.show{display:block}
  .res .amt{font-size:22px;font-weight:800}
  #qrcanvas{background:#fff;padding:8px;margin-top:8px;max-width:180px}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th{text-align:left;color:var(--dim);font-weight:600;padding:8px;border-bottom:1px solid var(--bd);font-size:11px;text-transform:uppercase}
  td{padding:8px;border-bottom:1px solid var(--card2);vertical-align:top}
  tr:hover td{background:var(--card2)}
  .mono{font-family:'JetBrains Mono',Consolas,monospace}
  .dim{color:var(--dim);font-size:12px}
  .lnk{font-size:12px}
  .bd{padding:2px 8px;font-size:11px;font-weight:700;text-transform:uppercase}
  .apibar{background:var(--card);border:1px solid var(--bd);padding:12px 16px;margin-bottom:16px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}
  .apibar input{flex:1;min-width:200px}
  .apibar .lbl{font-size:12px;color:var(--dim);white-space:nowrap}
  .full{grid-column:1/-1}
  @media(max-width:760px){.stats{grid-template-columns:repeat(2,1fr)}.grid{grid-template-columns:1fr}}
</style></head><body>
<nav><div class="in">
  <a class="logo" href="/"><span class="mark">G</span>GatePay</a>
  <div class="navlinks"><a href="/">Home</a><a href="/docs">Docs</a></div>
</div></nav>
<div class="wrap">

  <div class="apibar">
    <span class="lbl">🔑 API Key</span>
    <input id="apikey" type="password" placeholder="sk_live_... (disimpan di browser ini)">
    <button class="sec" onclick="saveKey()">Simpan</button>
  </div>

  <div class="stats">
    <div class="stat"><div class="k">Total Order</div><div class="v">${stats?.total || 0}</div></div>
    <div class="stat"><div class="k">Paid</div><div class="v g">${stats?.paid || 0}</div></div>
    <div class="stat"><div class="k">Pending</div><div class="v">${stats?.pending || 0}</div></div>
    <div class="stat"><div class="k">Revenue</div><div class="v">${rupiah(stats?.revenue)}</div></div>
  </div>

  <div class="grid">
    <div class="panel">
      <h2>Setup QRIS Statis</h2>
      <div class="dim" style="font-size:12px;margin-bottom:4px">Tempel teks QRIS statis (hasil decode QR DANA Bisnis kamu). Sekali aja.</div>
      <label>QRIS String</label>
      <textarea id="qris" placeholder="00020101021126...6304ABCD"></textarea>
      <button onclick="uploadQris()">Simpan QRIS</button>
      <div class="msg" id="qmsg"></div>
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
        <div class="dim">Bayar persis</div>
        <div class="amt" id="ramt"></div>
        <canvas id="qrcanvas"></canvas>
        <div style="margin-top:8px"><a class="lnk" id="rlink" target="_blank">Buka halaman checkout ↗</a></div>
      </div>
    </div>
  </div>

  <div class="panel full" style="margin-bottom:16px">
    <h2>Orders (50 terakhir)</h2>
    <table><thead><tr><th>ID</th><th>Nominal</th><th>Status</th><th>Ref</th><th>Checkout</th><th>Waktu</th></tr></thead>
    <tbody>${orderRows || '<tr><td colspan=6 class=dim style="text-align:center;padding:20px">Belum ada order</td></tr>'}</tbody></table>
  </div>

  <div class="panel full">
    <h2>Events dari Device (50 terakhir)</h2>
    <table><thead><tr><th>Event</th><th>Nominal</th><th>Status</th><th>Raw</th><th>Waktu</th></tr></thead>
    <tbody>${eventRows || '<tr><td colspan=5 class=dim style="text-align:center;padding:20px">Belum ada event</td></tr>'}</tbody></table>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/qrious@4.0.2/dist/qrious.min.js"></script>
<script>
  const $ = id => document.getElementById(id);
  $('apikey').value = localStorage.getItem('gp_apikey') || '';
  function saveKey(){ localStorage.setItem('gp_apikey', $('apikey').value.trim()); msg('qmsg','ok','API key disimpan'); }
  function key(){ return $('apikey').value.trim() || localStorage.getItem('gp_apikey') || ''; }
  function msg(id,cls,t){ var e=$(id); e.className='msg '+cls; e.textContent=t; }

  async function uploadQris(){
    if(!key()) return msg('qmsg','err','Isi API key dulu');
    try{
      var r = await fetch('/api/merchant/qris',{method:'POST',headers:{'x-api-key':key(),'content-type':'application/json'},body:JSON.stringify({qris:$('qris').value.trim()})});
      var j = await r.json();
      if(r.ok) msg('qmsg','ok','QRIS tersimpan: '+(j.merchant_name||'-')+' ('+(j.city||'-')+')');
      else msg('qmsg','err',j.error||'gagal');
    }catch(e){ msg('qmsg','err',String(e)); }
  }

  async function createOrder(){
    if(!key()) return msg('omsg','err','Isi API key dulu');
    var amt = parseInt($('amt').value,10);
    if(!amt||amt<=0) return msg('omsg','err','Nominal harus > 0');
    try{
      var r = await fetch('/api/orders',{method:'POST',headers:{'x-api-key':key(),'content-type':'application/json'},body:JSON.stringify({base_amount:amt,reference:$('ref').value.trim()||undefined})});
      var j = await r.json();
      if(!r.ok) return msg('omsg','err',j.error||'gagal');
      msg('omsg','ok','Order dibuat: '+j.id);
      $('ramt').textContent = 'Rp '+Number(j.unique_amount).toLocaleString('id-ID');
      $('rlink').href = j.checkout_url;
      $('ores').classList.add('show');
      if(j.qris){ new QRious({element:$('qrcanvas'),value:j.qris,size:360,level:'M'}); }
      else { msg('omsg','err','Order dibuat tapi QRIS belum ada — upload QRIS statis dulu.'); }
    }catch(e){ msg('omsg','err',String(e)); }
  }
</script>
</body></html>`;
}
