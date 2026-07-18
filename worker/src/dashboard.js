// Dashboard HTML renderer (server-side, no framework)

const rupiah = (n) =>
  'Rp ' + (Number(n) || 0).toLocaleString('id-ID');

const ago = (ts) => {
  if (!ts) return '-';
  const d = Math.max(0, Math.floor(Date.now() / 1000) - ts);
  if (d < 60) return d + 's lalu';
  if (d < 3600) return Math.floor(d / 60) + 'm lalu';
  if (d < 86400) return Math.floor(d / 3600) + 'j lalu';
  return Math.floor(d / 86400) + 'h lalu';
};

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]),
  );

const statusBadge = (s) => {
  const map = {
    paid: ['#22c55e', '#052e16'],
    pending: ['#f59e0b', '#451a03'],
    expired: ['#6b7280', '#111827'],
    cancelled: ['#ef4444', '#450a0a'],
    matched: ['#22c55e', '#052e16'],
    unmatched: ['#6b7280', '#111827'],
    duplicate: ['#818cf8', '#1e1b4b'],
  };
  const [bg, fg] = map[s] || ['#6b7280', '#111827'];
  return `<span class="badge" style="background:${bg};color:${fg}">${esc(s)}</span>`;
};

export function renderDashboard({ orders, events, stats }) {
  const orderRows = orders
    .map(
      (o) => `<tr>
        <td class="mono">${esc(o.id.slice(0, 12))}</td>
        <td>${esc(o.merchant_name || o.merchant_id)}</td>
        <td class="mono">${rupiah(o.unique_amount)}<br><span class="dim">base ${rupiah(o.base_amount)}</span></td>
        <td>${statusBadge(o.status)}</td>
        <td class="dim">${esc(o.reference || '-')}</td>
        <td class="dim">${ago(o.created_at)}</td>
      </tr>`,
    )
    .join('');

  const eventRows = events
    .map(
      (e) => `<tr>
        <td class="mono">${esc((e.id || '').slice(0, 14))}</td>
        <td>${esc(e.source)}</td>
        <td class="mono">${e.amount != null ? rupiah(e.amount) : '-'}</td>
        <td>${statusBadge(e.status)}</td>
        <td class="dim">${esc((e.raw_text || '').slice(0, 40))}</td>
        <td class="dim">${ago(e.created_at)}</td>
      </tr>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="id"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>PayGate Dashboard</title>
<style>
  :root{--bg:#0b0d12;--panel:#12151d;--panel2:#171b26;--border:#232837;--text:#e5e7ef;--dim:#8b93a7;--indigo:#6366f1;--indigo2:#818cf8}
  *{box-sizing:border-box}
  body{margin:0;font-family:'Inter',-apple-system,'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.5}
  .wrap{max-width:1100px;margin:0 auto;padding:28px 20px}
  h1{font-size:20px;margin:0 0 4px;display:flex;align-items:center;gap:10px}
  h1::before{content:'';width:8px;height:22px;background:linear-gradient(180deg,var(--indigo),var(--indigo2));border-radius:4px}
  .sub{color:var(--dim);font-size:13px;margin-bottom:22px}
  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px}
  .stat{background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:16px}
  .stat .k{color:var(--dim);font-size:12px;text-transform:uppercase;letter-spacing:.05em}
  .stat .v{font-size:24px;font-weight:700;margin-top:4px}
  .stat .v.green{color:#22c55e}
  .panel{background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:18px;margin-bottom:18px}
  .panel h2{font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:var(--dim);margin:0 0 12px}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th{text-align:left;color:var(--dim);font-weight:600;padding:8px 10px;border-bottom:1px solid var(--border);font-size:11px;text-transform:uppercase;letter-spacing:.04em}
  td{padding:9px 10px;border-bottom:1px solid var(--panel2);vertical-align:top}
  tr:hover td{background:var(--panel2)}
  .mono{font-family:'JetBrains Mono','SF Mono',Consolas,monospace}
  .dim{color:var(--dim);font-size:12px}
  .badge{padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700;text-transform:uppercase}
  .live{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:var(--dim);text-transform:uppercase}
  .dot{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 6px #22c55e;animation:b 1.5s infinite}
  @keyframes b{50%{opacity:.4}}
  .empty{color:var(--dim);text-align:center;padding:24px;font-size:13px}
</style></head><body>
<div class="wrap">
  <h1>PayGate Dashboard</h1>
  <div class="sub">DANA payment gateway · <span class="live"><span class="dot"></span>auto-refresh 3s</span></div>

  <div class="stats">
    <div class="stat"><div class="k">Total Order</div><div class="v" id="s-total">${stats?.total || 0}</div></div>
    <div class="stat"><div class="k">Paid</div><div class="v green" id="s-paid">${stats?.paid || 0}</div></div>
    <div class="stat"><div class="k">Pending</div><div class="v" id="s-pending">${stats?.pending || 0}</div></div>
    <div class="stat"><div class="k">Revenue</div><div class="v" id="s-rev">${rupiah(stats?.revenue)}</div></div>
  </div>

  <div class="panel">
    <h2>Orders (50 terakhir)</h2>
    <table><thead><tr><th>ID</th><th>Merchant</th><th>Nominal</th><th>Status</th><th>Ref</th><th>Waktu</th></tr></thead>
    <tbody id="orders">${orderRows || '<tr><td colspan=6 class=empty>Belum ada order</td></tr>'}</tbody></table>
  </div>

  <div class="panel">
    <h2>Events dari Device (50 terakhir)</h2>
    <table><thead><tr><th>Event ID</th><th>Source</th><th>Nominal</th><th>Status</th><th>Raw</th><th>Waktu</th></tr></thead>
    <tbody id="events">${eventRows || '<tr><td colspan=6 class=empty>Belum ada event</td></tr>'}</tbody></table>
  </div>
</div>
<script>
const rupiah=n=>'Rp '+(Number(n)||0).toLocaleString('id-ID');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ago=ts=>{if(!ts)return'-';let d=Math.max(0,Math.floor(Date.now()/1000)-ts);if(d<60)return d+'s lalu';if(d<3600)return Math.floor(d/60)+'m lalu';if(d<86400)return Math.floor(d/3600)+'j lalu';return Math.floor(d/86400)+'h lalu'};
const bmap={paid:['#22c55e','#052e16'],pending:['#f59e0b','#451a03'],expired:['#6b7280','#111827'],cancelled:['#ef4444','#450a0a'],matched:['#22c55e','#052e16'],unmatched:['#6b7280','#111827'],duplicate:['#818cf8','#1e1b4b']};
const badge=s=>{const[bg,fg]=bmap[s]||['#6b7280','#111827'];return '<span class="badge" style="background:'+bg+';color:'+fg+'">'+esc(s)+'</span>'};
async function tick(){
  try{
    const r=await fetch('/dashboard/data?_='+Date.now(),{cache:'no-store'});
    const d=await r.json();
    document.getElementById('s-total').textContent=d.stats?.total||0;
    document.getElementById('s-paid').textContent=d.stats?.paid||0;
    document.getElementById('s-pending').textContent=d.stats?.pending||0;
    document.getElementById('s-rev').textContent=rupiah(d.stats?.revenue);
    document.getElementById('orders').innerHTML=(d.orders||[]).map(o=>
      '<tr><td class=mono>'+esc(o.id.slice(0,12))+'</td><td>'+esc(o.merchant_name||o.merchant_id)+'</td><td class=mono>'+rupiah(o.unique_amount)+'<br><span class=dim>base '+rupiah(o.base_amount)+'</span></td><td>'+badge(o.status)+'</td><td class=dim>'+esc(o.reference||'-')+'</td><td class=dim>'+ago(o.created_at)+'</td></tr>'
    ).join('')||'<tr><td colspan=6 class=empty>Belum ada order</td></tr>';
    document.getElementById('events').innerHTML=(d.events||[]).map(e=>
      '<tr><td class=mono>'+esc((e.id||'').slice(0,14))+'</td><td>'+esc(e.source)+'</td><td class=mono>'+(e.amount!=null?rupiah(e.amount):'-')+'</td><td>'+badge(e.status)+'</td><td class=dim>'+esc((e.raw_text||'').slice(0,40))+'</td><td class=dim>'+ago(e.created_at)+'</td></tr>'
    ).join('')||'<tr><td colspan=6 class=empty>Belum ada event</td></tr>';
  }catch(e){}
}
setInterval(tick,3000);
</script>
</body></html>`;
}
