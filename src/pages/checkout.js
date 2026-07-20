// Halaman checkout publik — customer scan QRIS di sini. Gaya kotak siku.

const rupiah = (n) => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');
const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function renderCheckout({ order, qris, embed }) {
  const paid = order.status === 'paid';
  const expired = order.status === 'expired' || order.status === 'cancelled';
  const merchant = esc(order.qris_merchant_name || order.merchant_name || 'Merchant');

  return `<!DOCTYPE html>
<html lang="id"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bayar ${rupiah(order.unique_amount)} · GatePay</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Michroma&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
  :root{
    --desk-a:#7fc6c9;--desk-b:#8ea8dc;--desk-c:#6f87c8;--grid:rgba(255,255,255,.34);
    --chrome:#eceade;--chrome-2:#e0ded1;--hi:#ffffff;--edge:#8f8b7e;--edge-dark:#54514a;
    --title-a:#26379d;--title-b:#3f7fc4;--text:#23262e;--dim:#5b5f66;
    --accent:#c26107;--term-bg:#141f5c;--term-text:#dfe6ff;--ok:#0e7c66;--warn:#a05a00;--red:#b0362a;
  }
  *{box-sizing:border-box;border-radius:0!important}
  body{margin:0;font-family:Verdana,Tahoma,Geneva,sans-serif;color:var(--text);font-size:14px;
    background:repeating-linear-gradient(0deg,var(--grid) 0 1px,transparent 1px 44px),repeating-linear-gradient(90deg,var(--grid) 0 1px,transparent 1px 44px),linear-gradient(135deg,var(--desk-a),var(--desk-b) 52%,var(--desk-c));background-attachment:fixed;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:16px}
  .card{width:100%;max-width:420px;background:var(--chrome);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:3px 3px 0 var(--edge)}
  .top{background:linear-gradient(90deg,var(--title-a),var(--title-b));color:#fff;padding:9px 14px;display:flex;justify-content:space-between;align-items:center;font-weight:700;border-bottom:2px solid var(--edge-dark)}
  .top .logo{font-size:14px;font-family:'Michroma',sans-serif}
  .top .amt{font-size:11px;font-family:'Share Tech Mono',monospace;letter-spacing:.05em}
  .body{padding:22px 20px}
  .merch{font-size:11px;color:var(--dim);text-transform:uppercase;letter-spacing:.08em;margin-bottom:2px}
  .mname{font-size:18px;font-weight:700;margin-bottom:18px}
  .amount{font-size:32px;font-weight:700;margin-bottom:2px;font-family:'Share Tech Mono',monospace;color:var(--accent)}
  .amount small{font-size:13px;color:var(--dim);font-weight:400}
  .note{font-size:12px;color:#3a2a00;margin:6px 0 18px;background:#fff6d9;border:2px solid var(--accent);padding:8px 10px}
  .qrbox{background:#fff;padding:16px;display:flex;justify-content:center;margin-bottom:16px;border:2px solid;border-color:var(--edge-dark) var(--hi) var(--hi) var(--edge-dark)}
  #qr{width:100%;max-width:280px;aspect-ratio:1}
  .steps{font-size:13px;color:var(--dim);line-height:1.9;margin-bottom:16px}
  .steps b{color:var(--text)}
  .timer{text-align:center;font-size:12px;color:var(--dim);padding:10px;background:var(--term-bg);color:var(--term-text);margin-bottom:14px;font-family:'Share Tech Mono',monospace}
  .timer span{color:#ffc266;font-weight:700;font-variant-numeric:tabular-nums}
  .status{padding:14px;text-align:center;font-weight:700;font-size:15px;border:2px solid}
  .status.paid{background:var(--ok);color:#fff;border-color:#0a5c4c}
  .status.wait{background:var(--chrome-2);color:var(--dim);font-weight:400;font-size:13px;border-color:var(--edge)}
  .status.dead{background:#f7dcd9;color:var(--red);border-color:var(--red)}
  .spin{display:inline-block;width:12px;height:12px;border:2px solid rgba(84,81,74,.35);border-top-color:var(--title-a);animation:s .8s linear infinite;margin-right:8px;vertical-align:-1px}
  @keyframes s{to{transform:rotate(360deg)}}
  .foot{text-align:center;font-size:11px;color:var(--dim);padding:10px;font-family:'Share Tech Mono',monospace}
  .checkwrap{text-align:center;padding:20px}
  .bigcheck{width:64px;height:64px;background:var(--ok);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:34px;font-weight:900;margin-bottom:10px;border:3px solid;border-color:var(--hi) #0a5c4c #0a5c4c var(--hi)}
  body.embed{background:var(--chrome);padding:0;display:block}
  body.embed .card{max-width:none;width:100%;min-height:100vh;box-shadow:none;border:0}
  .xbtn{background:transparent;border:0;color:#fff;font-family:'Share Tech Mono',monospace;font-size:15px;font-weight:700;cursor:pointer;line-height:1;padding:2px 4px}
  .xbtn:hover{background:rgba(255,255,255,.2)}
</style></head><body${embed ? ' class="embed"' : ''}>
<div class="card">
  <div class="top"><span class="logo">GatePay</span>${embed ? `<button class="xbtn" onclick="parent.postMessage({gatepay:1,type:'close'},'*')" title="Tutup">✕</button>` : `<span class="amt">QRIS</span>`}</div>
  <div class="body">
    ${paid ? `
      <div class="checkwrap">
        <div class="bigcheck">✓</div>
        <div style="font-size:20px;font-weight:800">Pembayaran Berhasil</div>
        <div style="color:var(--dim);font-size:14px;margin-top:4px">${rupiah(order.unique_amount)} · ${merchant}</div>
      </div>` : expired ? `
      <div class="merch">Merchant</div><div class="mname">${merchant}</div>
      <div class="status dead">Order ${esc(order.status)} — silakan buat order baru</div>
    ` : `
      <div class="merch">Bayar ke</div>
      <div class="mname">${merchant}</div>
      <div class="amount">${rupiah(order.unique_amount)}</div>
      <div class="amount"><small>Order ${esc(order.id.slice(0, 12))}</small></div>
      <div class="note">⚠️ Bayar PERSIS ${rupiah(order.unique_amount)} (nominal unik) — jangan dibulatkan.</div>
      ${qris ? `
        <div class="qrbox"><canvas id="qr"></canvas></div>
        <div class="steps">
          <b>1.</b> Buka DANA / e-wallet / m-banking<br>
          <b>2.</b> Scan QRIS di atas<br>
          <b>3.</b> Nominal udah otomatis ${rupiah(order.unique_amount)} — konfirmasi bayar
        </div>` : `
        <div class="note">Merchant belum upload QRIS. Hubungi merchant.</div>`}
      <div class="timer">Berlaku <span id="cd">--:--</span></div>
      <div class="status wait" id="st"><span class="spin"></span>Nunggu pembayaran…</div>
    `}
  </div>
  <div class="foot">Diproses aman oleh GatePay</div>
</div>
${embed ? `<script>
  (function(){
    function send(status){
      try{ parent.postMessage({ gatepay:1, type:'status', status:status,
        order:{ id:${JSON.stringify(order.id)}, unique_amount:${order.unique_amount}, status:status } }, '*'); }catch(e){}
    }
    window.__gpSend = send;
    send(${JSON.stringify(order.status)});
  })();
</script>` : ''}
${!paid && !expired && qris ? `
<script src="https://cdn.jsdelivr.net/npm/qrious@4.0.2/dist/qrious.min.js"></script>
<script>
  new QRious({ element: document.getElementById('qr'), value: ${JSON.stringify(qris)}, size: 560, level: 'M' });
  // countdown
  var exp = ${order.expires_at} * 1000;
  function tick(){
    var d = Math.max(0, Math.floor((exp - Date.now())/1000));
    var m = String(Math.floor(d/60)).padStart(2,'0'), s = String(d%60).padStart(2,'0');
    var el = document.getElementById('cd'); if(el) el.textContent = m+':'+s;
    if(d<=0){ location.reload(); }
  }
  tick(); setInterval(tick, 1000);
  // poll status
  var poll = setInterval(async function(){
    try{
      var r = await fetch('/pay/${esc(order.id)}/status?_='+Date.now(),{cache:'no-store'});
      var j = await r.json();
      if(j.status === 'paid'){ clearInterval(poll); if(window.__gpSend) window.__gpSend('paid'); location.reload(); }
      if(j.status === 'expired' || j.status === 'cancelled'){ clearInterval(poll); if(window.__gpSend) window.__gpSend(j.status); location.reload(); }
    }catch(e){}
  }, 3000);
</script>` : ''}
</body></html>`;
}
