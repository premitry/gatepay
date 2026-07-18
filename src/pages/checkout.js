// Halaman checkout publik — customer scan QRIS di sini. Gaya kotak siku.

const rupiah = (n) => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');
const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function renderCheckout({ order, qris }) {
  const paid = order.status === 'paid';
  const expired = order.status === 'expired' || order.status === 'cancelled';
  const merchant = esc(order.qris_merchant_name || order.merchant_name || 'Merchant');

  return `<!DOCTYPE html>
<html lang="id"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bayar ${rupiah(order.unique_amount)} · GatePay</title>
<style>
  :root{--bg:#0f1115;--card:#171a21;--card2:#1e222b;--bd:#2b3038;--tx:#eef0f4;--dim:#9aa3b2;--brand:#3ddc97;--brandink:#04120b;--warn:#f6c445;--red:#ff5c5c}
  *{box-sizing:border-box;border-radius:0!important}
  body{margin:0;font-family:'Inter',-apple-system,'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--tx);display:flex;min-height:100vh;align-items:center;justify-content:center;padding:16px}
  .card{width:100%;max-width:420px;background:var(--card);border:1px solid var(--bd)}
  .top{background:var(--brand);color:var(--brandink);padding:16px 20px;display:flex;justify-content:space-between;align-items:center;font-weight:800}
  .top .logo{font-size:18px;letter-spacing:-.5px}
  .top .amt{font-size:15px}
  .body{padding:22px 20px}
  .merch{font-size:13px;color:var(--dim);text-transform:uppercase;letter-spacing:.08em;margin-bottom:2px}
  .mname{font-size:18px;font-weight:700;margin-bottom:18px}
  .amount{font-size:34px;font-weight:800;letter-spacing:-1px;margin-bottom:2px}
  .amount small{font-size:14px;color:var(--dim);font-weight:500}
  .note{font-size:12px;color:var(--warn);margin:6px 0 18px;background:#2a2410;border:1px solid #43391a;padding:8px 10px}
  .qrbox{background:#fff;padding:16px;display:flex;justify-content:center;margin-bottom:16px}
  #qr{width:100%;max-width:280px;aspect-ratio:1}
  .steps{font-size:13px;color:var(--dim);line-height:1.9;margin-bottom:16px}
  .steps b{color:var(--tx)}
  .timer{text-align:center;font-size:13px;color:var(--dim);padding:10px;border:1px dashed var(--bd);margin-bottom:14px}
  .timer span{color:var(--warn);font-weight:700;font-variant-numeric:tabular-nums}
  .status{padding:16px;text-align:center;font-weight:700;font-size:16px}
  .status.paid{background:var(--brand);color:var(--brandink)}
  .status.wait{background:var(--card2);color:var(--dim);font-weight:500;font-size:13px}
  .status.dead{background:#2a1416;color:var(--red)}
  .spin{display:inline-block;width:12px;height:12px;border:2px solid rgba(154,163,178,.35);border-top-color:var(--brand);animation:s .8s linear infinite;margin-right:8px;vertical-align:-1px}
  @keyframes s{to{transform:rotate(360deg)}}
  .dl{display:block;text-align:center;font-size:12px;color:var(--dim);text-decoration:none;padding:12px;border-top:1px solid var(--bd)}
  .foot{text-align:center;font-size:11px;color:var(--dim);padding:10px}
  .checkwrap{text-align:center;padding:20px}
  .bigcheck{width:64px;height:64px;background:var(--brand);color:var(--brandink);display:inline-flex;align-items:center;justify-content:center;font-size:34px;font-weight:900;margin-bottom:10px}
</style></head><body>
<div class="card">
  <div class="top"><span class="logo">GatePay</span><span class="amt">QRIS</span></div>
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
      if(j.status === 'paid'){ clearInterval(poll); location.reload(); }
      if(j.status === 'expired' || j.status === 'cancelled'){ clearInterval(poll); location.reload(); }
    }catch(e){}
  }, 3000);
</script>` : ''}
</body></html>`;
}
