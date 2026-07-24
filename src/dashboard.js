// Dashboard merchant — tema Y2K / retro-desktop.
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
    /* alias supaya inline style lama tetap jalan */
    --card:#eceade;--card2:#e0ded1;--bd:#8f8b7e;--tx:#23262e;--brand:#26379d;--brandink:#fff;
  }
  *{box-sizing:border-box;border-radius:0!important;margin:0;padding:0}
  body{
    font-family:Verdana,Tahoma,Geneva,sans-serif;color:var(--text);font-size:14px;line-height:1.65;
    background:
      repeating-linear-gradient(0deg,var(--grid) 0 1px,transparent 1px 44px),
      repeating-linear-gradient(90deg,var(--grid) 0 1px,transparent 1px 44px),
      linear-gradient(135deg,var(--desk-a),var(--desk-b) 52%,var(--desk-c));
    background-attachment:scroll;min-height:100vh;
  }
  a{color:var(--link);text-decoration:none}
  a:hover{text-decoration:underline}
  .hidden{display:none!important}
  h1,h2,.logo,.ptitle,.mark,.av{font-family:'Michroma',sans-serif}
  .mono,textarea,.cred .v,#rbreak{font-family:'Share Tech Mono',Consolas,monospace}

  /* bevel helpers */
  .out{border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:1px 1px 0 var(--edge)}
  .in{border:2px solid;border-color:var(--edge-dark) var(--hi) var(--hi) var(--edge-dark)}

  input,textarea{width:100%;background:#fff;border:2px solid;border-color:var(--edge-dark) var(--hi) var(--hi) var(--edge-dark);color:var(--text);padding:10px 11px;font-family:inherit;font-size:14px}
  textarea{resize:vertical;min-height:60px}
  label{display:block;font-size:12px;color:var(--dim);margin:11px 0 5px;text-transform:uppercase;letter-spacing:.04em}

  button{background:linear-gradient(180deg,#4a86c8,#26379d);color:#fff;border:2px solid;border-color:#7fb0e0 #141f5c #141f5c #7fb0e0;padding:11px 18px;font-weight:700;font-size:13px;cursor:pointer;margin-top:12px;width:100%;letter-spacing:.02em}
  button:hover{filter:brightness(1.06)}
  button:active{border-color:#141f5c #7fb0e0 #7fb0e0 #141f5c}
  button.sec{background:linear-gradient(180deg,var(--chrome),var(--chrome-2));color:var(--text);border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi)}
  button.sec:active{border-color:var(--edge-dark) var(--hi) var(--hi) var(--edge-dark)}

  .msg{font-size:12px;margin-top:8px;padding:8px;display:none;border:2px solid}
  .msg.ok{background:#dff3ea;color:var(--ok);border-color:var(--ok);display:block}
  .msg.err{background:#f7dcd9;color:var(--bad);border-color:var(--bad);display:block}
  .msg:empty{display:none!important}
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
  .page{padding:24px 28px;max-width:1240px;margin:0 auto}
  .view{display:none}
  .view.on{display:block}

  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px}
  .stat{background:var(--chrome);padding:12px 14px;border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:1px 1px 0 var(--edge)}
  .stat .k{color:var(--dim);font-size:10px;text-transform:uppercase;letter-spacing:.05em}
  .stat .v{font-size:24px;font-weight:700;margin-top:3px;font-family:'Share Tech Mono',monospace}
  .stat .v.g{color:var(--ok)}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .dualconn{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}
  .dualconn>.panel{margin-bottom:0}
  .dualconn .panel input,.dualconn .panel textarea{width:100%;font-size:13px;padding:6px 8px}
  .dualconn .panel input[type=email],.dualconn .panel input[type=password]{height:34px}
  .dualconn .panel textarea{height:44px;min-height:44px}
  .dualconn .panel label{font-size:11px;color:var(--dim);margin-top:6px;margin-bottom:2px;display:block;text-transform:uppercase;letter-spacing:.05em}
  .dualconn .panel button{width:100%;margin-top:8px}
  @media(max-width:720px){.dualconn{grid-template-columns:1fr}}

  /* panel = window */
  .panel{background:var(--chrome);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:2px 2px 0 var(--edge);padding:0 18px 18px;margin-bottom:16px}
  .panel h2{font-family:'Michroma';font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#fff;margin:0 -18px 16px;padding:9px 16px;background:linear-gradient(90deg,var(--title-a),var(--title-b));border-bottom:2px solid var(--edge-dark)}
  .tut{font-size:13px;line-height:1.65;color:var(--text)}
  .tut p{margin:0 0 8px}
  .tut ol,.tut ul{margin:6px 0 8px;padding-left:22px}
  .tut li{margin-bottom:5px}
  .tut code,.faq code{background:#e7e7d8;border:1px solid var(--edge);padding:1px 4px;font-family:'Share Tech Mono',monospace;font-size:12px}
  .faq details{border:2px solid;border-color:var(--edge-dark) var(--hi) var(--hi) var(--edge-dark);margin-bottom:8px;background:#fff}
  .faq summary{cursor:pointer;padding:9px 12px;font-weight:700;font-size:13px;background:var(--chrome-2);list-style:none}
  .faq summary::-webkit-details-marker{display:none}
  .faq summary:before{content:'▸ ';color:var(--title-a)}
  .faq details[open] summary:before{content:'▾ '}
  .faq details>div{padding:10px 12px;font-size:13px;line-height:1.6;border-top:1px solid var(--edge)}
  .prereq{background:#fff6d9;border:2px solid var(--accent);padding:10px 12px;font-size:13px;line-height:1.6;color:#3a2a00}
  .stepcard{display:flex;gap:14px;align-items:flex-start;padding:14px 0;border-top:1px solid var(--edge)}
  .stepcard:first-of-type{border-top:0;padding-top:2px}
  .stepnum{flex:0 0 auto;width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg,var(--title-b),var(--title-a));color:#fff;font-family:'Share Tech Mono',monospace;font-weight:700;font-size:15px;border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi)}
  .stepbody{flex:1;font-size:13px;line-height:1.65}
  .stepbody h4{margin:2px 0 6px;font-size:14px;color:var(--title-a)}
  .stepbody p{margin:0 0 8px}
  .stepbody .sec{margin-top:4px}
  .tipbox{background:#dff3ea;border:2px solid var(--ok);color:#0a5c4c;padding:8px 10px;font-size:12px;line-height:1.55;margin:8px 0}
  .warnbox{background:#fff6d9;border:2px solid var(--accent);color:#3a2a00;padding:8px 10px;font-size:12px;line-height:1.55;margin:8px 0}
  .spstat{font-size:12px;padding:8px 10px;border:2px solid}
  /* hero tutorial */
  .thero{display:grid;grid-template-columns:1.3fr .7fr;gap:16px;margin-bottom:16px;background:linear-gradient(135deg,var(--term-bg,#141f5c),var(--title-a) 120%);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:3px 3px 0 var(--edge);padding:20px}
  .thero-kick{display:inline-block;font-size:10px;font-weight:700;letter-spacing:.1em;color:#ffc266;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);padding:4px 8px;margin-bottom:12px}
  .thero-h1{font-family:'Michroma',sans-serif;font-size:20px;line-height:1.2;color:#fff;margin-bottom:10px}
  .thero-p{font-size:13px;line-height:1.6;color:#dfe6ff;max-width:520px}
  .thero-card{background:rgba(0,0,0,.28);border:2px solid rgba(255,255,255,.25);padding:12px}
  .thero-clabel{font-size:10px;font-weight:700;letter-spacing:.1em;color:#ffc266;margin-bottom:8px}
  .thero-row{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 0;border-top:1px solid rgba(255,255,255,.12);color:#fff;font-size:12px;font-weight:700}
  .thero-row span{display:flex;flex-direction:column}
  .thero-row small{color:#aeb8e0;font-weight:400;font-size:10px}
  .thero-row b{font-size:9px;padding:3px 6px;white-space:nowrap}
  .thero-row .req{background:#c26107;color:#fff}.thero-row .ready{background:#0e7c66;color:#fff}.thero-row .opt{background:#3f7fc4;color:#fff}
  /* provider cards */
  .provs{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
  .prov{display:flex;align-items:center;gap:10px;background:#fff;border:2px solid;border-color:var(--edge-dark) var(--hi) var(--hi) var(--edge-dark);padding:12px;text-decoration:none;color:var(--text)}
  .prov:hover{box-shadow:2px 2px 0 var(--edge);text-decoration:none}
  .prov-ic{width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;flex:0 0 auto;color:#fff}
  .prov-t{flex:1;display:flex;flex-direction:column}
  .prov-t b{font-size:13px}.prov-t small{font-size:11px;color:var(--dim)}
  .prov-ar{color:var(--accent);font-weight:700}
  /* flow diagram */
  .tflow{display:flex;align-items:stretch;gap:8px;flex-wrap:wrap}
  .tnode{flex:1;min-width:96px;text-align:center;background:var(--chrome-2);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);padding:10px 6px;font-size:12px;font-weight:700}
  .tnode small{display:block;font-weight:400;color:var(--dim);font-size:10px;margin-top:2px}
  .tnode.done{background:var(--ok);color:#fff}.tnode.done small{color:#cdeee2}
  .tnode-ic{font-size:22px;margin-bottom:4px}
  .tarr{display:flex;align-items:center;color:var(--dim);font-size:18px;font-weight:700}
  @media(max-width:640px){.thero{grid-template-columns:1fr}.provs{grid-template-columns:1fr}.tflow{flex-direction:column}.tarr{transform:rotate(90deg);justify-content:center}}
  .spstat.ok{background:#dff3ea;border-color:var(--ok);color:var(--ok);font-weight:700}
  .spstat.dead{background:#f7dcd9;border-color:var(--red);color:var(--red);font-weight:700}
  .spstat.off{background:var(--chrome-2);border-color:var(--edge);color:var(--dim)}
  /* Group Box metode konfirmasi */
  .mthbox{background:var(--chrome);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:1px 1px 0 var(--edge);margin-bottom:10px}
  .mthbox .mth-tt{background:linear-gradient(90deg,var(--title-a),var(--title-b));color:#fff;font-family:'Michroma',sans-serif;font-size:11px;padding:6px 10px;display:flex;justify-content:space-between;align-items:center;gap:8px;border-bottom:2px solid var(--edge-dark)}
  .mthbox .mth-bd{padding:10px 12px}
  .mthbox .mth-act{display:flex;align-items:center;gap:7px;font-size:13.5px;font-weight:700;color:var(--text);cursor:pointer;text-transform:none;letter-spacing:0;margin:0}
  .mthbox .mth-desc{font-size:11.5px;color:var(--dim);margin:4px 0 0 25px}
  .mthbox .mth-opts{display:flex;gap:18px;margin:9px 0 0 25px}
  .mthbox .mth-opts label{display:inline-flex;align-items:center;gap:6px;margin:0;text-transform:none;letter-spacing:0;color:var(--text);font-size:12px;cursor:pointer}
  .mthbox input[type=checkbox]{width:auto;min-width:0;margin:0}
  .mth-badge{font-family:'Share Tech Mono',Consolas,monospace;font-size:10px;padding:2px 7px;border:1px solid;white-space:nowrap}
  .mth-badge.ok{background:#dff3ea;border-color:var(--ok);color:var(--ok)}
  .mth-badge.dim{background:var(--chrome-2);border-color:var(--edge);color:var(--dim)}
  .mth-badge.warn{background:#fff1d6;border-color:var(--accent);color:var(--accent)}

  .res{margin-top:12px;padding:12px;background:#fff;border:2px solid;border-color:var(--edge-dark) var(--hi) var(--hi) var(--edge-dark)}
  .res{display:none}.res.show{display:block}
  .res .amt{font-size:32px;font-weight:700;font-family:'Share Tech Mono',monospace;color:var(--accent);line-height:1.1}
  #qrcanvas{background:#fff;padding:8px;margin-top:8px;max-width:210px;border:2px solid var(--edge-dark)}
  #qrprev{max-width:120px;margin-top:8px;display:none;background:#fff;padding:4px;border:2px solid var(--edge-dark)}
  #rbreak{white-space:pre-line}

  table{width:100%;border-collapse:collapse;font-size:12px}
  th{text-align:left;color:#fff;font-weight:700;padding:7px 8px;font-size:10px;text-transform:uppercase;background:linear-gradient(180deg,#3f7fc4,#26379d)}
  td{padding:7px 8px;border-bottom:1px solid var(--edge);vertical-align:middle}
  tr:nth-child(even) td{background:rgba(255,255,255,.4)}
  tr:hover td{background:#fff6d9}
  .bd{padding:2px 8px;font-size:10px;font-weight:700;text-transform:uppercase;border:1px solid rgba(0,0,0,.35)}
  .pager{display:flex;align-items:center;gap:8px;justify-content:flex-end;margin-top:12px}
  .pager button{width:auto;margin:0;padding:5px 12px}
  .pager button:disabled{opacity:.4;cursor:default}
  .pager .pinfo{font-size:11px;color:var(--dim);font-family:'Share Tech Mono',monospace}
  .fchip{width:auto;margin:0;padding:5px 12px;font-size:11px;background:linear-gradient(180deg,var(--chrome),var(--chrome-2));color:var(--text);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi)}
  .fchip.active{background:linear-gradient(180deg,#4a86c8,#26379d);color:#fff;border-color:#141f5c #7fb0e0 #7fb0e0 #141f5c}
  .btncancel{width:auto;margin:0;padding:4px 10px;font-size:10px;background:linear-gradient(180deg,var(--chrome),var(--chrome-2));color:var(--bad,#b0362a);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi)}
  .expmenu{display:none;position:absolute;right:0;top:calc(100% + 4px);background:var(--chrome);border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);box-shadow:2px 2px 0 var(--edge);z-index:30;min-width:160px}
  .expmenu.on{display:block}
  .expitem{padding:9px 12px;font-size:13px;cursor:pointer;border-bottom:1px solid var(--edge)}
  .expitem:last-child{border-bottom:0}
  .expitem:hover{background:#fff6d9}
  .clipbtn{display:inline-flex;align-items:center;justify-content:center;gap:6px;cursor:pointer;background:linear-gradient(180deg,var(--chrome),var(--chrome-2));border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi);color:var(--text);font-size:17px;padding:0 12px;min-width:44px;font-family:Verdana,sans-serif}
  .clipbtn:hover{filter:brightness(1.04)}
  .clipbtn:active{border-color:var(--edge-dark) var(--hi) var(--hi) var(--edge-dark)}

  /* kredensial = terminal navy */
  .cred{background:var(--term-bg);border:2px solid;border-color:var(--edge-dark) #2b3a7a #2b3a7a var(--edge-dark);padding:9px 10px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;gap:8px}
  .cred .l{font-size:10px;color:#8fa0d8;text-transform:uppercase;letter-spacing:.04em}
  .cred .v{font-size:12px;word-break:break-all;color:var(--term-ok)}
  .cred button{width:auto;margin:0;padding:5px 10px;font-size:10px}

  .doc h3{font-size:13px;margin:14px 0 5px;font-weight:700}
  .doc p{font-size:13px;color:var(--text);margin-bottom:6px}
  .doc pre{background:var(--term-bg);color:var(--term-text);border:2px solid;border-color:var(--edge-dark) #2b3a7a #2b3a7a var(--edge-dark);padding:12px;overflow-x:auto;font-family:'Share Tech Mono',monospace;font-size:12px;line-height:1.55;margin:8px 0;white-space:pre}
  .doc code{background:#fff;border:1px solid var(--edge);padding:1px 5px;font-family:'Share Tech Mono',monospace;font-size:12px;color:var(--accent)}
  .doc .mth{display:inline-block;font-size:10px;font-weight:700;padding:2px 7px;margin-right:6px;font-family:'Share Tech Mono',monospace;border:1px solid rgba(0,0,0,.3);color:#fff}
  .doc .mth.p{background:var(--ok)} .doc .mth.g{background:var(--title-a)}
  .scrim{display:none}
  @media(max-width:820px){
    .stats{grid-template-columns:repeat(2,1fr)}.grid2{grid-template-columns:1fr}
    .sidebar{transform:translateX(-100%);transition:transform .18s;width:232px}
    body.col .sidebar{width:232px}
    body.mnav .sidebar{transform:translateX(0)}
    .content{margin-left:0!important}
    .topbar .burger{display:block}
    body.mnav .scrim{display:block;position:fixed;inset:0;background:rgba(20,31,92,.45);z-index:35}
    .page{padding:14px}
    table{display:block;overflow-x:auto;-webkit-overflow-scrolling:touch;white-space:nowrap}
    thead,tbody{display:table;width:100%;min-width:540px}
    #qrcanvas{max-width:100%}
    .cred{flex-wrap:wrap}
  }
</style></head><body>

<!-- ══ AUTH ══ -->
<div id="authview">
  <div class="authwrap"><div class="authcard out">
    <div class="tt"><span class="mark" style="background:var(--accent);color:#fff;width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;font-size:11px">G</span> GATEPAY.EXE</div>
    <div class="bd2">
      <h1>GatePay</h1>
      <div class="sub">Masuk atau daftar untuk mengelola payment gateway Anda.</div>
      <div class="tabs">
        <div id="tab-login" class="active" onclick="switchTab('login')">Masuk</div>
        <div id="tab-reg" onclick="switchTab('reg')">Daftar</div>
      </div>
      <label>Username</label>
      <input id="u" type="text" placeholder="username" autocomplete="username">
      <label>Password</label>
      <input id="p" type="password" placeholder="password" autocomplete="current-password">
      <div id="fa2-wrap" class="hidden"><label>Kode 2FA (authenticator)</label><input id="fa2" inputmode="numeric" maxlength="6" placeholder="123456" autocomplete="one-time-code"></div>
      <label id="tos-wrap" class="hidden" style="display:none;flex-direction:row;align-items:flex-start;gap:8px;font-size:12px;color:var(--dim);margin-top:10px;text-transform:none;letter-spacing:0;font-weight:400;cursor:pointer">
        <input id="tos" type="checkbox" style="width:auto;margin:2px 0 0;flex:0 0 auto">
        <span>Dengan mendaftar, saya menyetujui <a href="/privasi" target="_blank">Ketentuan Layanan &amp; Kebijakan Privasi</a>, termasuk risiko integrasi opsional (ShopeePay/GoPay).</span>
      </label>
      <button id="authbtn" onclick="doAuth()">Masuk</button>
      <div class="msg" id="amsg"></div>
      <div class="dim" style="font-size:11px;margin-top:14px" id="reghint"></div>
    </div>
  </div></div>
</div>

<!-- ══ APP ══ -->
<div id="appview" class="hidden">
  <div id="fpw-modal" style="display:none;position:fixed;inset:0;z-index:200;background:rgba(20,31,92,.55);align-items:center;justify-content:center;padding:16px">
    <div class="panel" style="max-width:400px;width:100%;margin:0">
      <div style="font-family:'Michroma',sans-serif;color:#12235c;font-size:15px;margin-bottom:4px">🔒 GANTI PASSWORD</div>
      <div class="dim" style="font-size:12px;margin-bottom:14px">Password akun Anda baru saja diatur ulang oleh admin. Demi keamanan, Anda perlu membuat password baru terlebih dahulu sebelum melanjutkan.</div>
      <label class="dim" style="font-size:11px">Password baru (minimal 6 karakter)</label>
      <input id="fpw-new" type="password" placeholder="password baru" style="margin-bottom:8px">
      <label class="dim" style="font-size:11px">Ulangi password baru</label>
      <input id="fpw-conf" type="password" placeholder="ulangi password" style="margin-bottom:10px">
      <div id="fpw-msg" style="font-size:12px;margin-bottom:8px"></div>
      <button onclick="submitForcedPw()" style="width:100%">Simpan & Lanjutkan</button>
    </div>
  </div>
  <div id="gpwhy-modal" style="display:none;position:fixed;inset:0;z-index:200;background:rgba(20,31,92,.55);align-items:center;justify-content:center;padding:16px">
    <div class="out" style="max-width:440px;width:100%;background:var(--chrome)">
      <div style="background:linear-gradient(90deg,var(--title-a),var(--title-b));color:#fff;font-family:'Michroma',sans-serif;font-size:11px;padding:7px 12px;border-bottom:2px solid var(--edge-dark);display:flex;justify-content:space-between;align-items:center;gap:8px">
        <span>🟠 GOPAY_RECOMMENDATION.TXT</span>
        <span onclick="gopayWhyClose()" style="cursor:pointer;font-weight:700;font-family:Verdana">✕</span>
      </div>
      <div style="padding:14px 16px">
        <div style="font-size:13px;margin-bottom:10px">Nominal Unik dan Fee dinonaktifkan secara default untuk GoPay. Alasannya:</div>
        <ul style="font-size:12.5px;margin:0 0 14px 18px;line-height:1.75;color:var(--text)">
          <li>Mengurangi pola transaksi yang mudah dikenali sebagai otomatis.</li>
          <li>Membantu mengurangi risiko pembatasan akun merchant.</li>
          <li>Order tetap dibedakan lewat <b>kode order</b> pada QRIS (bukan sen unik).</li>
          <li>Anda tetap dapat mengaktifkannya apabila memang diperlukan.</li>
        </ul>
        <button onclick="gopayWhyClose()" style="width:100%">Mengerti</button>
      </div>
    </div>
  </div>
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
      <div class="navi" data-view="hook" onclick="go('hook')"><span class="ic">📖</span><span class="lbl">Docs &amp; Webhook</span></div>
      <div class="grp">Bantuan</div>
      <div class="navi" data-view="tutor" onclick="go('tutor')"><span class="ic">📚</span><span class="lbl">Tutorial</span></div>
      <div class="navi" data-view="tiket" onclick="go('tiket')" style="position:relative"><span class="ic">🎫</span><span class="lbl">Tiket Support</span><span id="tk-dot" style="display:none;position:absolute;top:6px;right:8px;width:9px;height:9px;background:#b0362a;border:1px solid #fff"></span></div>
      <div class="grp hidden" id="grp-akun">Admin</div>
      <div class="navi" data-view="events" onclick="go('events')"><span class="ic">📋</span><span class="lbl">Logs</span></div>
      <div class="navi hidden" id="nav-admin" data-view="admin" onclick="go('admin')"><span class="ic">👑</span><span class="lbl">Admin</span></div>
    </nav>
    <div class="side-bot">
      <div class="who" onclick="go('profile')" style="cursor:pointer" title="Profil"><span class="av" id="avatar">?</span><span class="txt mono" id="whoami"></span></div>
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
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px">
            <input id="osearch" type="text" placeholder="🔍 Cari kode / order id / ref / nominal..." style="flex:1;min-width:180px;width:auto" oninput="setSearch(this.value)">
            <div style="position:relative">
              <button class="sec" onclick="toggleExport(event)" style="width:auto;margin:0">⬇ Export ▼</button>
              <div class="expmenu" id="expmenu">
                <div class="expitem" onclick="exportOrders('csv')">📄 Export CSV</div>
                <div class="expitem" onclick="exportOrders('json')">🗂 Export JSON</div>
                <div class="expitem" onclick="exportOrders('html')">🌐 Export HTML</div>
                <div class="expitem" onclick="exportOrders('pdf')">🖨 Export PDF</div>
              </div>
            </div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px" id="ofilter">
            <button class="fchip active" data-f="all" onclick="setFilter('all')">Semua</button>
            <button class="fchip" data-f="pending" onclick="setFilter('pending')">Pending</button>
            <button class="fchip" data-f="paid" onclick="setFilter('paid')">Paid</button>
            <button class="fchip" data-f="expired" onclick="setFilter('expired')">Expired</button>
            <button class="fchip" data-f="cancelled" onclick="setFilter('cancelled')">Cancelled</button>
          </div>
          <table><thead><tr><th>ID</th><th>Nominal</th><th>Status</th><th>Ref</th><th>Checkout</th><th>Waktu</th><th>Aksi</th></tr></thead>
          <tbody id="otbody"><tr><td colspan=7 class=dim style="text-align:center;padding:20px">Belum ada order</td></tr></tbody></table>
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
            <div class="dim" style="margin-bottom:8px">Wajib dilakukan terlebih dahulu. Unggah foto QRIS statis Anda → otomatis ter-decode → Simpan. Order tidak dapat dibuat sebelum QRIS diatur.</div>
            <label>Upload QR (foto/gambar) — otomatis ter-decode</label>
            <input type="file" id="qrfile" accept="image/*" onchange="decodeQr()">
            <img id="qrprev">
            <label>Hasil QRIS String</label>
            <textarea id="qris" placeholder="hasil decode (atau tempel manual)"></textarea>
            <button onclick="uploadQris()">Simpan QRIS</button>
            <button class="sec" id="clearqrisbtn" onclick="clearQris()" style="display:none">🗑 Hapus QRIS Tersimpan</button>
            <div class="msg" id="qmsg"></div>
            <div id="qstat" class="dim" style="margin-top:10px;font-family:'Share Tech Mono',monospace"></div>
            <div style="display:flex;gap:10px;margin-top:12px;border-top:1px solid var(--edge);padding-top:12px">
              <div style="flex:1"><label>Fee (%)</label><input id="fee" type="number" step="0.1" placeholder="7"></div>
              <div style="flex:1"><label>Digit kode</label><input id="digits" type="number" min="1" max="3" placeholder="2"></div>
              <div style="flex:1"><label>Aktif (menit)</label><input id="ttlmin" type="number" min="1" max="1440" placeholder="15"></div>
            </div>
            <div class="dim" style="font-size:11px;margin-top:4px">Fee ditambah di atas nominal, kode unik disisipkan di digit terakhir. Masa aktif = berapa lama QRIS/order berlaku sebelum expired (1-1440 menit).</div>
            <label style="margin-top:8px">Redirect URL default setelah bayar (opsional)</label>
            <input id="defredir" type="text" placeholder="https://toko-anda.com/terima-kasih">
            <div class="dim" style="font-size:11px;margin-top:2px">Dipakai untuk semua order yang tidak menyebutkan redirect sendiri.</div>
            <button class="sec" onclick="saveSettings()" style="margin-top:8px">Simpan Pengaturan</button>
            <div class="msg" id="smsg"></div>
          </div>

          <div class="panel" style="display:flex;flex-direction:column">
            <h2>NEW_ORDER.EXE · Langkah 2</h2>
            <div id="noqris" class="dim" style="margin-bottom:10px;padding:8px;background:#fff6d9;border:2px solid var(--accent);color:#3a2a00;display:none">⚠ Atur QRIS statis terlebih dahulu di panel kiri sebelum membuat order.</div>
            <label>Nominal (Rp)</label>
            <input id="amt" type="number" placeholder="10000" oninput="estOrder()">
            <label>Reference (opsional)</label>
            <input id="ref" type="text" placeholder="INV-001">
            <button onclick="createOrder()" style="margin-top:8px">Buat Order + QR</button>
            <div class="msg" id="omsg"></div>
            <div class="res show" id="ores" style="flex:1;display:flex;flex-direction:column">
              <div class="dim" id="rbreak" style="font-size:14px;line-height:1.75;margin-bottom:10px"></div>
              <div class="dim" style="font-size:14px">Bayar persis</div>
              <div class="amt" id="ramt">Rp 0</div>
              <div style="margin-top:8px;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center">
                <div id="qrph" style="width:200px;max-width:100%;aspect-ratio:1;background:#fff;border:2px dashed var(--edge);display:flex;align-items:center;justify-content:center;text-align:center;color:var(--dim);font-size:12px;padding:12px">QR muncul otomatis<br>setelah menekan "Buat Order + QR"</div>
                <canvas id="qrcanvas" style="display:none"></canvas>
              </div>
              <div id="rlinkwrap" style="margin-top:8px;display:none"><a class="lnk" id="rlink" target="_blank">Buka halaman checkout ↗</a></div>
            </div>
          </div>
        </div>

        <div class="dualconn" style="margin-top:14px">
          <div class="panel">
            <h2>SHOPEEPAY PARTNER</h2>
            <div class="dim" style="margin-bottom:8px">Konfirmasi pembayaran ShopeePay <b>tanpa HP</b>. Default: APK catcher.</div>
            <div id="sp-status" class="spstat" style="margin-bottom:10px"></div>
            <div id="sp-inputwrap">
              <a class="lnk" onclick="goTutorShopee()" style="cursor:pointer;display:inline-block;margin-bottom:8px">📚 Cara mengambil token → buka Tutorial</a>
              <label>Cookie token (diawali "eyJ")</label>
              <textarea id="sp-token" placeholder="eyJhbGciOi…" rows="2" style="height:46px;min-height:46px;resize:vertical"></textarea>
              <div style="margin-top:6px"><button onclick="saveShopee()">Simpan Token</button></div>
            </div>
            <button class="sec" id="sp-clearbtn" onclick="clearShopee()" style="display:none">🗑 Hapus Token</button>
            <div class="msg" id="sp-msg"></div>
            <div class="dim" style="font-size:11px;margin-top:6px">⚠ Token dapat expired. Jika mati, APK catcher otomatis mengambil alih. Token dienkripsi AES-GCM. <a href="/privasi" target="_blank">Baca risiko selengkapnya ↗</a></div>
          </div>

          <div class="panel">
            <h2>GOPAY MERCHANT</h2>
            <div class="dim" style="margin-bottom:8px">Konfirmasi pembayaran GoPay <b>tanpa HP</b>. Default: APK catcher.</div>
            <div id="gp-status" class="spstat" style="margin-bottom:10px"></div>
            <div id="gp-inputwrap">
              <a class="lnk" onclick="goTutorGopay()" style="cursor:pointer;display:inline-block;margin-bottom:8px">📚 Cara setup akun GoPay Merchant → buka Tutorial</a>
              <div id="gp-chooser" style="display:flex;gap:6px;margin:2px 0 8px">
                <button type="button" id="gp-mode-pw" onclick="gpMode('pw')" style="flex:1">Login Password</button>
                <button type="button" id="gp-mode-otp" onclick="gpMode('otp')" style="flex:1">Login OTP</button>
              </div>
              <div id="gp-form-pw" style="display:none">
                <a class="lnk" onclick="gpBack()" style="cursor:pointer;display:inline-block;margin-bottom:6px">← Kembali pilih metode</a>
                <label>Email GoPay Merchant</label>
                <input id="gp-email" type="email" placeholder="[email protected]" autocomplete="off">
                <label>Password</label>
                <input id="gp-pass" type="password" placeholder="••••••••" autocomplete="new-password">
                <div style="margin-top:6px"><button onclick="saveGopay()">Simpan &amp; Hubungkan</button></div>
              </div>
              <div id="gp-form-otp" style="display:none">
                <a class="lnk" onclick="gpBack()" style="cursor:pointer;display:inline-block;margin-bottom:6px">← Kembali pilih metode</a>
                <div id="gp-otp-step1">
                  <label>Nomor HP GoPay Merchant</label>
                  <input id="gp-phone" type="tel" placeholder="08xxxxxxxxxx" autocomplete="off">
                  <div style="margin-top:6px"><button onclick="gpOtpRequest()" id="gp-otp-sendbtn">Kirim OTP</button></div>
                </div>
                <div id="gp-otp-step2" style="display:none">
                  <label>Kode OTP (dikirim ke <span id="gp-otp-phone"></span>)</label>
                  <input id="gp-otp" type="number" inputmode="numeric" placeholder="123456" autocomplete="one-time-code">
                  <div style="display:flex;gap:6px;margin-top:6px">
                    <button onclick="gpOtpVerify()" style="flex:1">Verifikasi &amp; Hubungkan</button>
                    <button class="sec" onclick="gpOtpReset()" style="flex:0 0 auto;width:auto">← Ganti</button>
                  </div>
                </div>
              </div>
            </div>
            <button class="sec" id="gp-clearbtn" onclick="clearGopay()" style="display:none">🗑 Putuskan</button>
            <div class="msg" id="gp-msg"></div>
            <div class="dim" style="font-size:11px;margin-top:6px">⚠ Kredensial dienkripsi AES-GCM. GatePay auto-refresh token secara berkala. Jika password akun berubah, silakan hubungkan ulang. <a href="/privasi" target="_blank">Baca risiko selengkapnya ↗</a></div>
          </div>
        </div>

        <div class="panel" style="margin-top:16px">
          <h2>METODE KONFIRMASI &amp; KEAMANAN</h2>
          <div class="dim" style="margin-bottom:12px">Pilih metode konfirmasi pembayaran. Setiap metode punya karakteristik berbeda. Rekomendasi bawaan sudah disesuaikan dengan penerbit QRIS Anda untuk membantu keamanan akun merchant.</div>
          <div id="mth-wrap"></div>
          <div class="msg" id="mth-msg"></div>
          <div class="dim" style="font-size:11px;margin-top:8px">Aturan: nominal unik/fee dipakai hanya bila <b>semua metode aktif</b> mengizinkan (yang paling aman menang).</div>
          <div style="margin-top:12px;border-top:1px solid rgba(128,128,128,.18);padding-top:10px">
            <div class="dim" style="font-size:11px;margin-bottom:6px">🔧 Debug — lihat isi transaksi mentah dari provider (buat cek apakah kode order muncul di riwayat).</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              <button class="sec" style="width:auto" onclick="viewRaw('gopay')">Transaksi GoPay</button>
              <button class="sec" style="width:auto" onclick="viewRaw('shopee')">Transaksi ShopeePay</button>
            </div>
            <pre id="raw-out" style="display:none;white-space:pre-wrap;word-break:break-word;font-size:11px;background:rgba(0,0,0,.25);padding:10px;margin-top:8px;max-height:320px;overflow:auto"></pre>
          </div>
        </div>
      </section>

      <!-- KREDENSIAL & APK -->
      <section class="view" id="v-apk">
        <div class="panel" style="max-width:640px">
          <h2>CREDENTIALS.SYS</h2>
          <div class="dim" style="margin-bottom:10px">Untuk integrasi API + setup HP penangkap notifikasi pembayaran. Rahasiakan.</div>
          <div class="cred"><div><div class="l">API Key (sk_live)</div><div class="v" id="c-api">-</div></div><div style="display:flex;gap:4px"><button class="sec" onclick="cp('c-api')">Copy</button><button class="sec" onclick="regenApiKey()" title="Ganti API key baru">↻ Baru</button></div></div>
          <div class="msg" id="keymsg" style="margin-bottom:8px"></div>
          <div class="cred"><div><div class="l">Device ID (APK)</div><div class="v" id="c-devid">-</div></div><button class="sec" onclick="cp('c-devid')">Copy</button></div>
          <div class="cred"><div><div class="l">Device Secret (APK)</div><div class="v" id="c-devsec">-</div></div><button class="sec" onclick="cp('c-devsec')">Copy</button></div>
          <div class="cred"><div><div class="l">Server URL (APK)</div><div class="v">https://gatepay.biz.id</div></div><button class="sec" onclick="cpTxt('https://gatepay.biz.id')">Copy</button></div>
          <a href="/gatepay-catcher.apk" download><button>⬇ Download APK Catcher</button></a>
          <div class="dim" style="font-size:11px;margin-top:8px">Instal APK di HP → isi Server URL, Device ID, Device Secret di atas → aktifkan Notification Access.</div>
        </div>
      </section>

      <!-- WEBHOOK -->
      <section class="view" id="v-hook">
        <div class="panel" style="max-width:640px">
          <h2>WEBHOOK.CFG</h2>
          <div class="dim" style="margin-bottom:10px">Opsional. GatePay mengirim POST ke URL ini setiap ada order <b>PAID</b>, sehingga sistem Anda (toko/bot/invoice) mengetahui otomatis tanpa polling. Kosongkan jika hanya menggunakan dashboard.</div>
          <label>Notify URL</label>
          <input id="notify" type="url" placeholder="https://sistem-anda.com/webhook/gatepay">
          <button onclick="saveHook()">Simpan Webhook</button>
          <button class="sec" onclick="clearHook()">🗑 Hapus Webhook</button>
          <div class="msg" id="hmsg"></div>
          <div class="cred" style="margin-top:14px"><div><div class="l">Callback Secret (verifikasi HMAC)</div><div class="v" id="c-cbsec">-</div></div><button class="sec" onclick="cp('c-cbsec')">Copy</button></div>
          <div class="dim" style="font-size:11px;margin-top:8px;white-space:pre-line">Payload contoh:
{"event":"order.paid","order_id":"ord_xxx","reference":"INV-001","unique_amount":10237,"paid_at":1784...}
Header <b>x-signature</b> = HMAC-SHA256(body, callback_secret).</div>
        </div>

        <div class="panel doc" style="max-width:720px">
          <h2>API_DOCS.TXT</h2>
          <p>Base URL semua endpoint: <code>https://gatepay.biz.id</code></p>
          <h3>Autentikasi</h3>
          <p>Semua endpoint merchant membutuhkan header API key Anda (ada di menu <b>Kredensial &amp; APK</b>):</p>
          <pre>x-api-key: sk_live_xxxxxxxxxxxx</pre>

          <h3><span class="mth p">POST</span> /api/merchant/qris — Setup QRIS Statis</h3>
          <p>Cukup sekali. Isi string QRIS statis (dapat juga melalui menu QRIS &amp; Order dengan mengunggah foto).</p>
          <pre>curl -X POST https://gatepay.biz.id/api/merchant/qris \\
  -H "x-api-key: sk_live_xxx" \\
  -H "content-type: application/json" \\
  -d '{"qris":"00020101021126...6304ABCD"}'</pre>

          <h3><span class="mth p">POST</span> /api/merchant/settings — Fee, Digit, Webhook</h3>
          <table><thead><tr><th>Field</th><th>Tipe</th><th>Ket</th></tr></thead><tbody>
            <tr><td class=mono>fee_percent</td><td>number</td><td>Persen fee (0-100).</td></tr>
            <tr><td class=mono>unique_digits</td><td>number</td><td>Digit kode unik (1-3).</td></tr>
            <tr><td class=mono>notify_url</td><td>string</td><td>URL webhook (lihat panel atas).</td></tr>
            <tr><td class=mono>order_ttl</td><td>number</td><td>Masa aktif order default (detik, 60-86400).</td></tr>
          </tbody></table>

          <h3><span class="mth p">POST</span> /api/orders — Buat Order</h3>
          <table><thead><tr><th>Field</th><th>Tipe</th><th>Ket</th></tr></thead><tbody>
            <tr><td class=mono>base_amount</td><td>number</td><td>Harga asli (Rp). Wajib.</td></tr>
            <tr><td class=mono>reference</td><td>string</td><td>No invoice Anda. Opsional.</td></tr>
            <tr><td class=mono>ttl_seconds</td><td>number</td><td>Masa berlaku order ini (detik). Default = setting Masa Aktif merchant.</td></tr>
          </tbody></table>
          <pre>curl -X POST https://gatepay.biz.id/api/orders \\
  -H "x-api-key: sk_live_xxx" \\
  -H "content-type: application/json" \\
  -d '{"base_amount":10000,"reference":"INV-001"}'</pre>
          <p>Response berisi <code>unique_amount</code> (nominal yang harus dibayar), <code>qris</code> (string QRIS dinamis), dan <code>checkout_url</code> (halaman bayar siap digunakan).</p>

          <h3><span class="mth g">GET</span> /api/orders/:id — Periksa Status</h3>
          <pre>curl https://gatepay.biz.id/api/orders/ord_xxx \\
  -H "x-api-key: sk_live_xxx"</pre>
          <p>Status: <code>pending</code> · <code>paid</code> · <code>expired</code> · <code>cancelled</code>.</p>

          <h3><span class="mth p">POST</span> /api/orders/:id/cancel — Batalkan Order</h3>
          <p>Batalkan order yang masih <code>pending</code> agar berhenti menunggu pembayaran.</p>

          <h3>Alur Lengkap</h3>
          <pre>1. (sekali) Upload QRIS statis di menu QRIS & Order
2. Buat order   -> POST /api/orders  -> dapat qris + checkout_url
3. Tampilkan QR / arahkan customer ke checkout_url
4. Customer scan & bayar (nominal terkunci)
5. Notifikasi terbaca -> order menjadi PAID
6. Webhook ke notify_url Anda (lihat panel atas) + periksa via GET status</pre>
          <p class="dim" style="font-size:12px">Versi lengkap dengan contoh verifikasi webhook: <a href="/docs" target="_blank">buka /docs ↗</a></p>
        </div>
      </section>

      <!-- TUTORIAL -->
      <section class="view" id="v-tutor">
        <div class="thero">
          <div class="thero-in">
            <div class="thero-kick">📚 PANDUAN OPERATOR</div>
            <div class="thero-h1">Dari QRIS statis sampai order otomatis PAID.</div>
            <div class="thero-p">Ikuti panduan singkat ini: setup QRIS, HP catcher / token, membuat order, dan konfirmasi pembayaran otomatis — tanpa menebak-nebak.</div>
          </div>
          <div class="thero-card">
            <div class="thero-clabel">CHECKLIST SETUP</div>
            <div class="thero-row"><span>QRIS statis<small>dari PSP / bank</small></span><b class="req">WAJIB</b></div>
            <div class="thero-row"><span>HP Catcher (APK)<small>deteksi default</small></span><b class="ready">SIAP</b></div>
            <div class="thero-row"><span>Token ShopeePay<small>opsional, tanpa HP</small></span><b class="opt">OPSIONAL</b></div>
          </div>
        </div>

        <div class="panel">
          <h2>Sebelum Mulai · Harus Punya QRIS Statis</h2>
          <div class="tut"><p>GatePay <b>tidak</b> membuat akun QRIS dari nol. Sistem ini <b>mengubah QRIS statis</b> yang sudah Anda miliki menjadi QRIS dinamis (nominal unik) + deteksi pembayaran otomatis. Belum punya? Daftar merchant di salah satu penyedia berikut:</p></div>
          <div class="provs">
            <a class="prov" href="https://dana.id/bisnis" target="_blank" rel="noopener"><span class="prov-ic" style="background:linear-gradient(135deg,#0057d9,#1498ff)">💙</span><span class="prov-t"><b>DANA Bisnis</b><small>Akun bisnis untuk menerima QRIS</small></span><span class="prov-ar">↗</span></a>
            <a class="prov" href="https://shopee.co.id/m/shopeepay" target="_blank" rel="noopener"><span class="prov-ic" style="background:linear-gradient(135deg,#ee4d2d,#ff7337)">🛍</span><span class="prov-t"><b>ShopeePay Partner</b><small>Merchant QRIS ShopeePay</small></span><span class="prov-ar">↗</span></a>
            <a class="prov" href="https://www.gojek.com/gobiz/" target="_blank" rel="noopener"><span class="prov-ic" style="background:linear-gradient(135deg,#00aa13,#1ed760)">🟢</span><span class="prov-t"><b>GoPay Merchant</b><small>Daftar lewat GoBiz</small></span><span class="prov-ar">↗</span></a>
            <a class="prov" href="https://www.bi.go.id/QRIS/default.aspx" target="_blank" rel="noopener"><span class="prov-ic" style="background:linear-gradient(135deg,#0f172a,#475569)">🏦</span><span class="prov-t"><b>Bank / PSP lain</b><small>Ajukan QRIS via bank terdaftar</small></span><span class="prov-ar">↗</span></a>
          </div>
        </div>

        <div class="panel">
          <h2>Alur Singkat</h2>
          <div class="tflow">
            <div class="tnode"><div class="tnode-ic">📤</div><b>Upload QRIS</b><small>sekali saja</small></div>
            <div class="tarr">›</div>
            <div class="tnode"><div class="tnode-ic">🧾</div><b>Buat Order</b><small>isi nominal</small></div>
            <div class="tarr">›</div>
            <div class="tnode"><div class="tnode-ic">📱</div><b>Pelanggan Bayar</b><small>scan QR</small></div>
            <div class="tarr">›</div>
            <div class="tnode"><div class="tnode-ic">📡</div><b>Catcher / Token</b><small>deteksi</small></div>
            <div class="tarr">›</div>
            <div class="tnode done"><div class="tnode-ic">✓</div><b>PAID</b><small>otomatis</small></div>
          </div>
        </div>

        <div class="panel">
          <h2>Bagian 1 · Setup Wajib</h2>
          <div class="stepcard">
            <div class="stepnum">1</div>
            <div class="stepbody">
              <h4>📤 Upload QRIS Statis</h4>
              <p>Di menu <b>QRIS &amp; Order</b>: upload foto QRIS statis → <b>Decode QR</b> (atau paste teksnya yang diawali <code>00020101...</code>) → <b>Simpan QRIS</b>. Nama merchant muncul = berhasil. Atur juga Fee %, digit kode unik, dan masa aktif order.</p>
              <div class="tipbox">💡 <b>Tips:</b> pastikan yang diunggah adalah QRIS <b>statis</b> (bukan QR sekali pakai). Foto harus jelas / tidak buram.</div>
              <button class="sec" onclick="go('qris')">Buka QRIS &amp; Order →</button>
            </div>
          </div>
          <div class="stepcard">
            <div class="stepnum">2</div>
            <div class="stepbody">
              <h4>📱 Setup HP Catcher (APK)</h4>
              <p>Cara default deteksi pembayaran: aplikasi Android menangkap notifikasi "uang masuk" lalu mengirimkannya ke GatePay. Di menu <b>Kredensial &amp; APK</b>: Unduh APK → instal → Login menggunakan akun GatePay → aktifkan <b>Akses Notifikasi</b> → tab Status → <b>Pilih Aplikasi</b> target (DANA/ShopeePay/dan lain-lain).</p>
              <div class="tipbox">💡 <b>Agar tidak mati sendiri:</b> aktifkan <b>Autostart</b> + atur baterai ke "tanpa batasan" (khususnya HP Xiaomi/MIUI).</div>
              <div class="warnbox">⚠ HP harus tetap menyala &amp; online agar catcher berjalan.</div>
              <button class="sec" onclick="go('apk')">Buka Kredensial &amp; APK →</button>
            </div>
          </div>
          <div class="stepcard">
            <div class="stepnum">3</div>
            <div class="stepbody">
              <h4>🧾 Buat Order &amp; Terima Bayar</h4>
              <p>Di menu <b>QRIS &amp; Order</b>: isi nominal → <b>Buat Order + QR</b>. Bagikan link checkout / QR ke pelanggan. Pelanggan membayar <b>persis nominal unik</b> → order otomatis menjadi <b>PAID</b>.</p>
              <div class="tipbox">💡 Kode unik (angka kecil di ekor nominal) membuat setiap order berbeda, sehingga sistem dapat mencocokkan pembayaran otomatis.</div>
              <button class="sec" onclick="go('qris')">Buat Order →</button>
            </div>
          </div>
        </div>

        <div class="panel">
          <h2>Bagian 2 · Opsional</h2>
          <div class="stepcard" id="tut-shopee">
            <div class="stepnum">A</div>
            <div class="stepbody">
              <h4>🛍 Token ShopeePay Partner <span class="dim" style="font-size:11px">(tanpa HP)</span></h4>
              <p>Khusus <b>ShopeePay Partner</b>. Dengan token cookie, pembayaran ShopeePay dikonfirmasi <b>server-side</b> tanpa HP. Cara mengambil:</p>
              <ol>
                <li>Buka portal <a href="https://partner.shopee.co.id/" target="_blank" rel="noopener">partner.shopee.co.id ↗</a> lalu login.</li>
                <li>Tekan <b>F12</b> → tab <b>Application</b> → <b>Cookies</b> → pilih <code>https://partner.shopee.co.id</code>.</li>
                <li>Salin <b>Value</b> dari cookie <code>__shopee_partner_website_x_token_live</code> (diawali <code>eyJ</code>).</li>
                <li>Tempel di panel <b>ShopeePay Partner</b> (menu QRIS &amp; Order) → <b>Simpan Token</b>.</li>
              </ol>
              <div class="warnbox">⚠ Token tidak resmi &amp; dapat expired. Jika mati, catcher HP otomatis mengambil alih. Ada risiko ToS akun ShopeePay.</div>
              <button class="sec" onclick="go('qris')">Buka panel ShopeePay →</button>
            </div>
          </div>
          <div class="stepcard" id="tut-gopay">
            <div class="stepnum">B</div>
            <div class="stepbody">
              <h4>🟢 GoPay Merchant <span class="dim" style="font-size:11px">(tanpa HP)</span></h4>
              <p>Khusus <b>GoPay Merchant</b> (GoBiz). Masukkan <b>email &amp; password</b> akun GoPay Merchant Anda — GatePay login otomatis ke portal GoBiz, mengambil mutasi, lalu mencocokkan dengan order. Sistem <b>auto-refresh</b> token secara berkala, jadi hands-off.</p>
              <ol>
                <li>Pastikan Anda memiliki akun <b>GoPay Merchant</b>. Login/daftar di <a href="https://portal.gofoodmerchant.co.id/" target="_blank" rel="noopener">portal.gofoodmerchant.co.id ↗</a> atau <a href="https://gobiz.co.id/" target="_blank" rel="noopener">gobiz.co.id ↗</a>.</li>
                <li>Buka menu <b>QRIS &amp; Order</b> → panel <b>GoPay Merchant</b>.</li>
                <li>Masukkan email &amp; password → <b>Simpan &amp; Hubungkan</b>. GatePay validasi live &amp; ambil nama merchant.</li>
              </ol>
              <div class="warnbox">⚠ Menggunakan API internal GoBiz (tidak resmi). Kredensial dienkripsi AES-GCM. Ada risiko ToS akun GoPay. Jika koneksi gagal, catcher HP otomatis mengambil alih.</div>
              <button class="sec" onclick="go('qris')">Buka panel GoPay →</button>
            </div>
          </div>
          <div class="stepcard">
            <div class="stepnum">C</div>
            <div class="stepbody">
              <h4>🔔 Webhook</h4>
              <p>Jika memiliki sistem/toko sendiri: isi Webhook URL di menu <b>Docs &amp; Webhook</b>. GatePay mengirim POST ke sana setiap order PAID (menggunakan HMAC untuk verifikasi).</p>
              <button class="sec" onclick="go('hook')">Docs &amp; Webhook →</button>
            </div>
          </div>
          <div class="stepcard">
            <div class="stepnum">D</div>
            <div class="stepbody">
              <h4>🔐 Keamanan (2FA)</h4>
              <p>Aktifkan <b>2FA</b> (Authenticator) di menu <b>Profil</b> untuk pengaman login. API Key dapat di-regenerate di Kredensial &amp; APK jika bocor.</p>
              <button class="sec" onclick="go('profile')">Buka Profil →</button>
            </div>
          </div>
        </div>

        <div class="panel">
          <h2>❓ Pertanyaan yang Sering Ditanya (FAQ)</h2>
          <div class="faq">
            <details><summary>Order tidak otomatis PAID padahal sudah membayar?</summary><div>Periksa: (1) HP catcher menyala &amp; Akses Notifikasi aktif, (2) aplikasi pembayaran sudah dipilih di target APK, (3) nominal dibayar <b>persis</b> nominal unik (jangan dibulatkan), (4) order belum expired. Periksa juga menu <b>Logs</b> — jika event masuk tetapi order tetap pending, kemungkinan nominal berbeda.</div></details>
            <details><summary>QRIS-nya tidak dapat dibayar / ditolak aplikasi e-wallet?</summary><div>Pastikan yang diunggah <b>QRIS statis</b> (bukan QR dinamis/sekali pakai). GatePay membuat ulang menjadi dinamis dengan nominal. Jika ShopeePay Partner, pastikan merchant aktif.</div></details>
            <details><summary>Harus selalu menggunakan HP? Bisa tanpa HP?</summary><div>Secara default membutuhkan HP (catcher). <b>ShopeePay</b> dapat tanpa HP jika menggunakan <b>token ShopeePay Partner</b>. DANA &amp; lainnya tetap membutuhkan HP.</div></details>
            <details><summary>Token ShopeePay statusnya "TOKEN MATI"?</summary><div>Token/cookie expired. Ambil cookie <b>__shopee_partner_website_x_token_live</b> yang baru dari partner.shopee.co.id (F12 → Application → Cookies), tempel ulang. Selama mati, catcher HP tetap menangkap ShopeePay.</div></details>
            <details><summary>Aplikasi catcher sering mati sendiri di HP Xiaomi?</summary><div>MIUI agresif mematikan aplikasi background. Aktifkan <b>Autostart</b> untuk GatePay Catcher + atur baterai ke "Tanpa batasan / No restriction" + kunci aplikasi di recent apps.</div></details>
            <details><summary>Bisa lebih dari 1 aplikasi pembayaran?</summary><div>Bisa. Di APK tab Status → <b>Pilih Aplikasi</b>, tambahkan beberapa (DANA, ShopeePay, dan lain-lain). Semua notifikasinya tertangkap.</div></details>
            <details><summary>Kode unik habis / "terlalu banyak order pending nominal sama"?</summary><div>Kode unik 1-99 per nominal. Jika banyak order pending bernominal dasar sama, tunggu sebagian expired atau perbesar digit kode unik di pengaturan.</div></details>
            <details><summary>Bagaimana cara memperbarui APK?</summary><div>Buka aplikasinya — jika ada versi baru akan muncul notifikasi "Update Tersedia" → Unduh via Browser → instal. Tidak perlu mengirim APK manual.</div></details>
          </div>
        </div>
      </section>

      <!-- TIKET SUPPORT -->
      <section class="view" id="v-tiket">
        <div class="grid2">
          <div class="panel">
            <h2>TIKET_BARU.MSG</h2>
            <div class="dim" style="margin-bottom:8px">Ada kendala? Kirim tiket, akan dibalas oleh admin.</div>
            <label>Subjek</label><input id="tk-subject" type="text" placeholder="mis. Pembayaran tidak terbaca">
            <label>Pesan</label>
            <div style="display:flex;gap:8px;align-items:stretch">
              <textarea id="tk-msg" placeholder="jelaskan masalahnya..." style="flex:1"></textarea>
              <label class="clipbtn" title="Lampirkan gambar (maks 1.5MB)">📎<input type="file" id="tk-file" accept="image/*" onchange="pickTkImg(this,'create')" hidden></label>
            </div>
            <img id="tk-prev" style="max-width:100px;margin-top:6px;display:none;border:2px solid var(--edge)">
            <button onclick="createTicket()">Kirim Tiket</button>
            <div class="msg" id="tkmsg"></div>
          </div>
          <div class="panel">
            <h2>TIKET_SAYA.LOG</h2>
            <div id="tklist" class="dim">Loading…</div>
          </div>
        </div>
        <div class="panel" id="tk-detail" style="display:none;position:relative">
          <button onclick="closeTicket()" title="Tutup" style="position:absolute;top:5px;right:6px;z-index:2;width:auto;margin:0;padding:2px 10px;font-size:14px;background:transparent;border:0;color:#fff;box-shadow:none">✕</button>
          <h2 id="tk-dtitle">THREAD</h2>
          <div id="tk-thread" style="max-height:340px;overflow-y:auto;margin-bottom:12px"></div>
          <label>Balasan</label>
          <div style="display:flex;gap:8px;align-items:stretch">
            <textarea id="tk-reply" placeholder="tulis balasan..." style="flex:1"></textarea>
            <label class="clipbtn" title="Lampirkan gambar (maks 1.5MB)">📎<input type="file" id="tk-rfile" accept="image/*" onchange="pickTkImg(this,'reply')" hidden></label>
          </div>
          <img id="tk-rprev" style="max-width:90px;margin-top:6px;display:none;border:2px solid var(--edge)">
          <button onclick="replyTicket()">Kirim Balasan</button>
          <div class="msg" id="tkrmsg"></div>
        </div>
      </section>

      <!-- PROFILE -->
      <section class="view" id="v-profile">
        <div class="grid2">
          <div class="panel">
            <h2>PROFILE.SYS</h2>
            <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
              <span class="av" id="p-avatar" style="width:52px;height:52px;min-width:52px;font-size:22px;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;border:2px solid;border-color:var(--hi) var(--edge-dark) var(--edge-dark) var(--hi)">?</span>
              <div>
                <div style="font-size:16px;font-weight:700" id="p-username" class="mono">@-</div>
                <div id="p-role"><span class="bd" style="background:var(--title-a);color:#fff">MERCHANT</span></div>
              </div>
            </div>
            <div class="cred"><div><div class="l">Nama QRIS / Merchant</div><div class="v" id="p-qris">-</div></div></div>
            <div class="cred"><div><div class="l">Status Akun</div><div class="v" id="p-status">-</div></div></div>
            <div class="cred"><div><div class="l">Tanggal Gabung</div><div class="v" id="p-joined">-</div></div></div>
            <label style="margin-top:12px">Nama Tampilan</label>
            <input id="p-name" type="text" placeholder="nama toko / usaha Anda">
            <button onclick="saveProfile()">Simpan Nama</button>
            <div class="msg" id="promsg"></div>
            <button class="sec" onclick="logout()" style="margin-top:14px">⎋ Keluar dari Akun</button>
          </div>

          <div class="panel">
            <h2>PASSWORD.SYS</h2>
            <div class="dim" style="margin-bottom:8px">Ganti password login Anda.</div>
            <label>Password Lama</label><input id="oldpw" type="password" placeholder="password sekarang">
            <label>Password Baru</label><input id="newpw" type="password" placeholder="minimal 6 karakter">
            <button onclick="changePw()">Ganti Password</button>
            <div class="msg" id="pwmsg"></div>

            <div style="border-top:2px solid var(--edge);margin:16px 0 0"></div>
            <h2 style="margin-left:-18px;margin-right:-18px;margin-top:16px">AUTH_2FA.SYS</h2>
            <div class="dim" style="margin-bottom:8px">Autentikator (Google Authenticator / Authy) — kode 6 digit setiap login. Agar akun lebih aman.</div>
            <div id="fa-status" class="mono dim" style="margin-bottom:8px">memeriksa status…</div>
            <div id="fa-off" style="display:none"><button onclick="fa2Setup()">🔐 Aktifkan 2FA</button></div>
            <div id="fa-setup" style="display:none">
              <div class="dim">1. Scan QR ini di app authenticator:</div>
              <canvas id="fa-qr" style="background:#fff;padding:8px;margin:8px 0;max-width:180px;border:2px solid var(--edge-dark)"></canvas>
              <div class="cred"><div><div class="l">Atau kode manual</div><div class="v" id="fa-secret">-</div></div><button class="sec" onclick="cp('fa-secret')">Copy</button></div>
              <label>2. Masukkan 6 digit dari aplikasi</label>
              <input id="fa-code" inputmode="numeric" maxlength="6" placeholder="123456">
              <button onclick="fa2Verify()">Verifikasi &amp; Aktifkan</button>
              <div class="msg" id="fa-msg"></div>
            </div>
            <div id="fa-on" style="display:none">
              <div class="msg ok" style="display:block">✓ 2FA aktif — login membutuhkan kode authenticator</div>
              <label>Nonaktifkan — masukkan kode terlebih dahulu</label>
              <input id="fa-dcode" inputmode="numeric" maxlength="6" placeholder="123456">
              <button class="sec" onclick="fa2Disable()">Nonaktifkan 2FA</button>
              <div class="msg" id="fa-dmsg"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- EVENTS (admin only) -->
      <section class="view" id="v-events">
        <div class="panel">
          <h2>DEVICE_EVENTS.LOG</h2>
          <div class="dim" style="margin-bottom:10px">Semua notifikasi yang tertangkap perangkat Anda (termasuk hasil <b>Uji Kirim</b> dari APK). Hanya log milik akun Anda sendiri.</div>
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
          <div class="dim" style="margin-bottom:8px">Anda memiliki akses admin — kelola semua merchant, statistik global, & monitoring device.</div>
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
    $('authbtn').textContent=m==='login'?'Masuk':'Daftar'; $('reghint').textContent=m==='reg'?'Username 3-20 karakter (huruf/angka/_). Password min 6.':'';
    var tw=$('tos-wrap'); if(tw){ tw.classList.toggle('hidden', m!=='reg'); tw.style.display=(m==='reg')?'flex':'none'; if(m!=='reg'){ var t=$('tos'); if(t) t.checked=false; } } }

  async function doAuth(){
    var u=$('u').value.trim().toLowerCase(), p=$('p').value;
    if(!u||!p) return msg('amsg','err','Isi username & password');
    if(mode==='reg' && !$('tos').checked) return msg('amsg','err','Anda harus menyetujui Ketentuan Layanan & Kebijakan Privasi');
    var payload={username:u,password:p};
    if(mode==='login' && !$('fa2-wrap').classList.contains('hidden')) payload.totp=$('fa2').value.trim();
    try{
      var r=await fetch('/api/'+(mode==='login'?'login':'register'),{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
      var j=await r.json();
      if(!r.ok){
        if(j.needs_2fa){ $('fa2-wrap').classList.remove('hidden'); $('fa2').focus(); return msg('amsg','err',j.error||'Masukkan kode 2FA'); }
        return msg('amsg','err',j.error||'gagal');
      }
      localStorage.setItem('gp_sess', JSON.stringify(j));
      showApp();
    }catch(e){ msg('amsg','err',String(e)); }
  }
  function logout(){ localStorage.removeItem('gp_sess'); location.reload(); }

  // ── shell / navigation ──
  const TITLES={dash:'Dashboard',qris:'QRIS & Order',apk:'Kredensial & APK',hook:'Docs & Webhook',tutor:'Tutorial',tiket:'Tiket Support',profile:'Profil',events:'Logs',admin:'Admin'};
  function navTo(v){
    if(!TITLES[v]) v='dash';
    var s=sess(); if(v==='admin' && !(s&&s.is_admin)) v='dash';
    document.querySelectorAll('.view').forEach(el=>el.classList.remove('on'));
    var el=$('v-'+v); if(el) el.classList.add('on');
    document.querySelectorAll('.navi').forEach(x=>x.classList.toggle('active',x.dataset.view===v));
    $('ptitle').textContent=TITLES[v]||'';
    curView=v;
    if(v==='tiket'){ closeTicket(); loadTickets(); } // selalu balik ke list pas masuk menu tiket
    if(v==="qris"){ loadShopee(); loadGopay(); loadMethods(); }
    if(v==='profile') fa2Load();
    toggleMnav(false);
  }
  // ── 2FA ──
  function fa2Render(en){ $('fa-status').textContent=en?'Status: AKTIF ●':'Status: nonaktif'; $('fa-status').style.color=en?'var(--ok)':'var(--dim)'; $('fa-off').style.display=en?'none':'block'; $('fa-on').style.display=en?'block':'none'; $('fa-setup').style.display='none'; }
  async function fa2Load(){ try{ var j=await (await fetch('/api/merchant/2fa',{headers:{'x-api-key':key()}})).json(); fa2Render(!!j.enabled); }catch(e){} }
  async function fa2Setup(){ try{ var r=await fetch('/api/merchant/2fa/setup',{method:'POST',headers:{'x-api-key':key()}}); var j=await r.json(); if(!r.ok) return alert(j.error||'gagal'); $('fa-secret').textContent=j.secret; $('fa-off').style.display='none'; $('fa-setup').style.display='block'; new QRious({element:$('fa-qr'),value:j.otpauth,size:300,level:'M'}); }catch(e){ alert(String(e)); } }
  async function fa2Verify(){ var code=$('fa-code').value.trim(); try{ var r=await fetch('/api/merchant/2fa/verify',{method:'POST',headers:{'x-api-key':key(),'content-type':'application/json'},body:JSON.stringify({code:code})}); var j=await r.json(); if(r.ok){ msg('fa-msg','ok','2FA aktif ✓'); fa2Render(true); } else msg('fa-msg','err',j.error||'gagal'); }catch(e){ msg('fa-msg','err',String(e)); } }
  async function fa2Disable(){ var code=$('fa-dcode').value.trim(); try{ var r=await fetch('/api/merchant/2fa/disable',{method:'POST',headers:{'x-api-key':key(),'content-type':'application/json'},body:JSON.stringify({code:code})}); var j=await r.json(); if(r.ok){ msg('fa-dmsg','ok','2FA dinonaktifkan'); fa2Render(false); } else msg('fa-dmsg','err',j.error||'gagal'); }catch(e){ msg('fa-dmsg','err',String(e)); } }
  function go(v){ if(location.hash==='#'+v) navTo(v); else location.hash='#'+v; }
  window.addEventListener('hashchange',function(){ navTo((location.hash||'').replace('#','')); });
  function setColArrow(){ var b=document.querySelector('.collapse'); if(b) b.textContent=document.body.classList.contains('col')?'›':'‹'; }
  function toggleCollapse(){ document.body.classList.toggle('col'); localStorage.setItem('gp_col',document.body.classList.contains('col')?'1':''); setColArrow(); }
  function toggleMnav(on){ document.body.classList.toggle('mnav',on); }

  function showApp(){
    var s=sess(); if(!s) return;
    if(localStorage.getItem('gp_col')) document.body.classList.add('col');
    setColArrow();
    $('authview').classList.add('hidden'); $('appview').classList.remove('hidden');
    $('whoami').textContent=(s.username||'');
    $('avatar').textContent=(s.username||'?').slice(0,1).toUpperCase();
    $('p-avatar').textContent=(s.username||'?').slice(0,1).toUpperCase();
    $('p-username').textContent=(s.username||'-');
    $('c-api').textContent=s.api_key||'-';
    $('c-devid').textContent=s.device_id||'-';
    $('c-devsec').textContent=s.device_secret||'-';
    if(s.fee_percent!=null) $('fee').value=s.fee_percent;
    if(s.unique_digits!=null) $('digits').value=s.unique_digits;
    if(s.is_admin){ var na=$('nav-admin'); if(na) na.classList.remove('hidden'); var ga=$('grp-akun'); if(ga) ga.classList.remove('hidden'); var pr=$('p-role'); if(pr) pr.innerHTML='<span class="bd" style="background:var(--accent);color:#fff">ADMIN 👑</span>'; }
    loadSettings();
    tick(); setInterval(tick,3000);
    navTo((location.hash||'').replace('#','')||'dash');
    if(s.must_change_pw) $('fpw-modal').style.display='flex'; // paksa ganti PW habis reset admin
  }
  async function submitForcedPw(){
    var n=$('fpw-new').value, c2=$('fpw-conf').value;
    if(!n||n.length<6) return msg('fpw-msg','err','Password baru minimal 6 karakter');
    if(n!==c2) return msg('fpw-msg','err','Password tidak sama');
    try{
      var r=await fetch('/api/merchant/change-password',{method:'POST',headers:{'x-api-key':key(),'content-type':'application/json'},body:JSON.stringify({new_password:n})});
      var j=await r.json();
      if(r.ok){
        var s=sess()||{}; delete s.must_change_pw; localStorage.setItem('gp_sess',JSON.stringify(s));
        $('fpw-modal').style.display='none'; $('fpw-new').value=''; $('fpw-conf').value='';
        alert('Password berhasil diganti.');
      } else msg('fpw-msg','err',j.error||'gagal');
    }catch(e){ msg('fpw-msg','err',String(e)); }
  }

  async function regenApiKey(){
    if(!confirm('Ganti API key baru? API key lama langsung tidak berlaku — integrasi yang menggunakan key lama harus di-update.')) return;
    try{
      var r=await fetch('/api/merchant/regenerate-key',{method:'POST',headers:{'x-api-key':key()}});
      var j=await r.json();
      if(r.ok && j.api_key){ var s=sess()||{}; s.api_key=j.api_key; localStorage.setItem('gp_sess',JSON.stringify(s)); $('c-api').textContent=j.api_key; msg('keymsg','ok','API key baru dibuat ✓ — perbarui di integrasi Anda'); }
      else msg('keymsg','err',j.error||'gagal');
    }catch(e){ msg('keymsg','err',String(e)); }
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
    var f=$('qrfile').files[0]; if(!f) return msg('qmsg','err','Pilih file QR terlebih dahulu');
    var img=new Image();
    img.onload=function(){
      var scale=Math.min(1,1000/Math.max(img.width,img.height));
      var w=Math.round(img.width*scale),h=Math.round(img.height*scale);
      var cv=document.createElement('canvas'); cv.width=w; cv.height=h;
      var ctx=cv.getContext('2d'); ctx.drawImage(img,0,0,w,h);
      try{
        var d=ctx.getImageData(0,0,w,h);
        var code=jsQR(d.data,w,h,{inversionAttempts:'attemptBoth'});
        if(code&&code.data){ $('qris').value=code.data; msg('qmsg','ok','QR berhasil di-decode ✓ — periksa lalu Simpan'); }
        else msg('qmsg','err','QR tidak terbaca. Coba foto lebih jelas / crop.');
      }catch(e){ msg('qmsg','err','Gagal membaca gambar: '+e); }
    };
    img.onerror=function(){ msg('qmsg','err','File bukan gambar valid'); };
    img.src=URL.createObjectURL(f);
  }

  async function uploadQris(){
    try{
      var r=await fetch('/api/merchant/qris',{method:'POST',headers:{'x-api-key':key(),'content-type':'application/json'},body:JSON.stringify({qris:$('qris').value.trim()})});
      var j=await r.json();
      if(r.ok){ msg('qmsg','ok','QRIS tersimpan ✓'+(j.issuer_name?' — '+j.issuer_name+' terdeteksi, metode disetel otomatis':'')); loadSettings(); loadShopee(); loadGopay(); loadMethods(); setTimeout(function(){ var e=$('qmsg'); if(e) e.innerHTML=''; },4000); }
      else msg('qmsg','err',j.error||'gagal');
    }catch(e){ msg('qmsg','err',String(e)); }
  }

  const fmtDate=ts=>{ if(!ts) return '-'; var d=new Date(ts*1000); return d.toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}); };
  async function loadSettings(){
    try{ var r=await fetch('/api/merchant/settings',{headers:{'x-api-key':key()}}); var j=await r.json();
      if(r.ok){ $('fee').value=j.fee_percent??0; $('digits').value=j.unique_digits??2; $('notify').value=j.notify_url||''; $('c-cbsec').textContent=j.callback_secret||'-';
        if($('ttlmin')) $('ttlmin').value=Math.round((j.order_ttl||900)/60);
        if($('defredir')) $('defredir').value=j.default_redirect||'';
        estOrder();
        if(j.has_qris){ var pen=j.issuer_name?(' · '+j.issuer_name+(j.nmid?' ('+j.nmid+')':'')):' · penerbit tak terdeteksi'; $('qstat').textContent='✓ QRIS aktif: '+(j.merchant_name||'-')+pen; $('qstat').style.color='var(--ok)'; $('noqris').style.display='none'; $('clearqrisbtn').style.display='block'; }
        else { $('qstat').textContent='○ Belum ada QRIS statis (terputus)'; $('qstat').style.color='var(--bad,#b0362a)'; $('noqris').style.display='block'; $('clearqrisbtn').style.display='none'; }
        // profil
        $('p-qris').textContent=j.qris_name||'(QRIS belum diatur)';
        $('p-status').innerHTML=j.active?'<span style="color:var(--ok)">● Aktif</span>':'<span style="color:var(--bad,#b0362a)">○ Suspend</span>';
        $('p-joined').textContent=fmtDate(j.created_at);
        if($('p-name')&&!$('p-name').value) $('p-name').value=j.name||'';
      } }catch(e){}
  }
  async function saveProfile(){
    var n=$('p-name').value.trim(); if(!n) return msg('promsg','err','Nama tidak boleh kosong');
    try{ var r=await fetch('/api/merchant/profile',{method:'POST',headers:{'x-api-key':key(),'content-type':'application/json'},body:JSON.stringify({name:n})});
      var j=await r.json(); if(r.ok) msg('promsg','ok','Nama tampilan tersimpan ✓'); else msg('promsg','err',j.error||'gagal');
    }catch(e){ msg('promsg','err',String(e)); }
  }
  async function saveSettings(){
    var ttlMin=parseInt($('ttlmin').value,10)||15; var ttlSec=Math.min(86400,Math.max(60,ttlMin*60));
    try{ var r=await fetch('/api/merchant/settings',{method:'POST',headers:{'x-api-key':key(),'content-type':'application/json'},body:JSON.stringify({fee_percent:parseFloat($('fee').value)||0,unique_digits:parseInt($('digits').value,10)||2,order_ttl:ttlSec,default_redirect:($('defredir')?$('defredir').value.trim():'')})});
      var j=await r.json(); if(r.ok) msg('smsg','ok','Fee '+j.fee_percent+'% · kode '+j.unique_digits+' digit · aktif '+Math.round((j.order_ttl||900)/60)+' menit tersimpan'); else msg('smsg','err',j.error||'gagal');
    }catch(e){ msg('smsg','err',String(e)); }
  }
  async function clearQris(){
    if(!confirm('Hapus QRIS tersimpan? Order tidak dapat dibuat sampai QRIS diunggah lagi.')) return;
    try{ var r=await fetch('/api/merchant/qris/clear',{method:'POST',headers:{'x-api-key':key()}});
      if(r.ok){ $('qris').value=''; $('qrprev').style.display='none'; msg('qmsg','ok','QRIS dihapus — status terputus, aman dari tertimpa'); loadSettings(); loadShopee(); loadGopay(); }
      else msg('qmsg','err','gagal hapus');
    }catch(e){ msg('qmsg','err',String(e)); }
  }
  // ── Token ShopeePay (opsional) ──
  function goTutorShopee(){ go('tutor'); setTimeout(function(){ var d=$('tut-shopee'); if(d){ d.open=true; d.scrollIntoView({behavior:'smooth',block:'start'}); } },140); }
  async function loadShopee(){
    try{ var j=await (await fetch('/api/merchant/shopee',{headers:{'x-api-key':key()},cache:'no-store'})).json();
      var el=$('sp-status'); var cb=$('sp-clearbtn'); var iw=$('sp-inputwrap');
      if(j.enabled){
        var nm=j.merchant?escj(j.merchant):null;
        var note=(j.has_qris && !j.qris_is_shopee)?'<br><span style="font-weight:400;font-size:11px;color:var(--accent)">⚠ QRIS tersimpan bukan ShopeePay — pembayaran tetap via APK catcher.</span>':'';
        if(j.status==='dead'){ el.className='spstat dead'; el.innerHTML='● TOKEN MATI'+(nm?' ('+nm+')':'')+' — ambil cookie baru lalu simpan ulang.'; if(iw) iw.style.display='block'; }
        else { el.className='spstat ok'; el.innerHTML='✓ TERHUBUNG'+(nm?' — <b>'+nm+'</b>':'')+'<br><span style="font-weight:400;font-size:11px">Server-side, tanpa HP.</span>'+note; if(iw) iw.style.display='none'; }
        if(cb) cb.style.display='inline-block';
      } else { el.className='spstat off'; el.innerHTML='○ Status: APK Catcher (default). Tempel token untuk konfirmasi tanpa HP.'; if(cb) cb.style.display='none'; if(iw) iw.style.display='block'; }
    }catch(e){}
  }
  async function saveShopee(){
    var t=$('sp-token').value.trim();
    if(!t) return msg('sp-msg','err','Token kosong');
    try{ var r=await fetch('/api/merchant/shopee',{method:'POST',headers:{'x-api-key':key(),'content-type':'application/json'},body:JSON.stringify({token:t})});
      var j=await r.json(); if(r.ok){ msg('sp-msg','ok','Token tersimpan ✓'+(j.merchant?' — '+j.merchant:'')); $('sp-token').value=''; loadShopee(); setTimeout(function(){ var e=$('sp-msg'); if(e) e.innerHTML=''; },4500); } else msg('sp-msg','err',j.error||'Gagal');
    }catch(e){ msg('sp-msg','err',String(e)); }
  }
  async function clearShopee(){
    if(!confirm('Hapus token ShopeePay? ShopeePay kembali ke APK catcher (default).')) return;
    try{ var r=await fetch('/api/merchant/shopee/clear',{method:'POST',headers:{'x-api-key':key()}});
      if(r.ok){ msg('sp-msg','ok','Token dihapus — menggunakan APK catcher'); loadShopee(); } else msg('sp-msg','err','gagal hapus');
    }catch(e){ msg('sp-msg','err',String(e)); }
  }
  // ── GoPay Merchant (opsional) ──
  function goTutorGopay(){ go('tutor'); setTimeout(function(){ var d=$('tut-gopay'); if(d){ d.open=true; d.scrollIntoView({behavior:'smooth',block:'start'}); } },140); }
  async function loadGopay(){
    try{ var j=await (await fetch('/api/merchant/gopay',{headers:{'x-api-key':key()},cache:'no-store'})).json();
      var el=$('gp-status'); var cb=$('gp-clearbtn'); var iw=$('gp-inputwrap');
      gpBack();
      if(j.enabled){
        var nm=j.merchant?escj(j.merchant):null;
        var note=(j.has_qris && !j.qris_is_gopay)?'<br><span style="font-weight:400;font-size:11px;color:var(--accent)">⚠ QRIS tersimpan bukan GoPay — pembayaran tetap via APK catcher.</span>':'';
        if(j.status==='dead'){ el.className='spstat dead'; el.innerHTML='● KONEKSI GAGAL'+(nm?' ('+nm+')':'')+' — hubungkan ulang.'; if(iw) iw.style.display='block'; }
        else { el.className='spstat ok'; el.innerHTML='✓ TERHUBUNG'+(nm?' — <b>'+nm+'</b>':'')+'<br><span style="font-weight:400;font-size:11px">Server-side, tanpa HP. Akun: '+escj(j.email_preview||'-')+'</span>'+note; if(iw) iw.style.display='none'; }
        if(cb) cb.style.display='inline-block';
      } else { el.className='spstat off'; el.innerHTML='○ Status: APK Catcher (default). Tanpa HP? Pilih cara login.'; if(cb) cb.style.display='none'; if(iw) iw.style.display='block'; }
    }catch(e){}
  }
  async function saveGopay(){
    var em=$('gp-email').value.trim(), pw=$('gp-pass').value;
    if(!em||!pw) return msg('gp-msg','err','Email dan password wajib diisi');
    try{ var r=await fetch('/api/merchant/gopay',{method:'POST',headers:{'x-api-key':key(),'content-type':'application/json'},body:JSON.stringify({email:em,password:pw})});
      var j=await r.json(); if(r.ok){ msg('gp-msg','ok','Terhubung ✓'+(j.merchant?' — '+j.merchant:'')); $('gp-email').value=''; $('gp-pass').value=''; loadGopay(); setTimeout(function(){ var e=$('gp-msg'); if(e) e.innerHTML=''; },4500); } else msg('gp-msg','err',j.error||'Gagal');
    }catch(e){ msg('gp-msg','err',String(e)); }
  }
  async function clearGopay(){
    if(!confirm('Putuskan GoPay Merchant? GoPay kembali ke APK catcher (default).')) return;
    try{ var r=await fetch('/api/merchant/gopay/clear',{method:'POST',headers:{'x-api-key':key()}});
      if(r.ok){ msg('gp-msg','ok','GoPay diputus — menggunakan APK catcher'); loadGopay(); } else msg('gp-msg','err','gagal');
    }catch(e){ msg('gp-msg','err',String(e)); }
  }
  // ── GoPay login mode: swap tampilan (chooser ⇄ form), tidak menambah ke bawah ──
  function gpMode(m){
    var ch=$('gp-chooser'), pw=$('gp-form-pw'), otp=$('gp-form-otp');
    if(ch) ch.style.display='none';
    if(m==='otp'){ if(pw)pw.style.display='none'; if(otp)otp.style.display='block'; gpOtpReset(); }
    else { if(pw)pw.style.display='block'; if(otp)otp.style.display='none'; }
  }
  function gpBack(){
    var ch=$('gp-chooser'), pw=$('gp-form-pw'), otp=$('gp-form-otp');
    if(pw)pw.style.display='none'; if(otp)otp.style.display='none';
    if(ch) ch.style.display='flex'; gpOtpReset();
  }
  function gpOtpReset(){ var s1=$('gp-otp-step1'), s2=$('gp-otp-step2'); if(s1)s1.style.display='block'; if(s2)s2.style.display='none'; }
  async function gpOtpRequest(){
    var ph=$('gp-phone').value.trim();
    if(!ph) return msg('gp-msg','err','Nomor HP wajib diisi');
    var b=$('gp-otp-sendbtn'); if(b){ b.disabled=true; b.textContent='Mengirim...'; }
    try{ var r=await fetch('/api/merchant/gopay/otp/request',{method:'POST',headers:{'x-api-key':key(),'content-type':'application/json'},body:JSON.stringify({phone:ph})});
      var j=await r.json();
      if(r.ok){ $('gp-otp-phone').textContent=j.phone_preview||ph; $('gp-otp-step1').style.display='none'; $('gp-otp-step2').style.display='block'; msg('gp-msg','ok','OTP dikirim. Cek SMS/WhatsApp.'); }
      else msg('gp-msg','err',j.error||'Gagal kirim OTP');
    }catch(e){ msg('gp-msg','err',String(e)); }
    if(b){ b.disabled=false; b.textContent='Kirim OTP'; }
  }
  async function gpOtpVerify(){
    var otp=$('gp-otp').value.trim();
    if(!otp) return msg('gp-msg','err','Masukkan kode OTP');
    try{ var r=await fetch('/api/merchant/gopay/otp/verify',{method:'POST',headers:{'x-api-key':key(),'content-type':'application/json'},body:JSON.stringify({otp:otp})});
      var j=await r.json();
      if(r.ok){ msg('gp-msg','ok','Terhubung ✓'+(j.merchant?' — '+escj(j.merchant):'')); $('gp-otp').value=''; $('gp-phone').value=''; gpOtpReset(); loadGopay(); setTimeout(function(){ var e=$('gp-msg'); if(e) e.innerHTML=''; },4500); }
      else msg('gp-msg','err',j.error||'Verifikasi gagal');
    }catch(e){ msg('gp-msg','err',String(e)); }
  }
  // ── Toggle metode konfirmasi + nominal unik/fee ──
  async function loadMethods(){
    var w=$('mth-wrap'); if(!w) return;
    try{ var j=await (await fetch('/api/merchant/methods',{headers:{'x-api-key':key()},cache:'no-store'})).json();
      var iss=j.qris_issuer||null;
      function badge(k){
        if(k==='device') return '<span class="mth-badge dim">UNIVERSAL · CADANGAN</span>';
        if(k==='shopee') return iss==='shopeepay' ? '<span class="mth-badge ok">✓ SESUAI QRIS ANDA</span>' : (iss?'<span class="mth-badge dim">TIDAK SESUAI QRIS</span>':'<span class="mth-badge dim">SERVER-SIDE</span>');
        return iss==='gopay' ? '<span class="mth-badge ok">✓ SESUAI QRIS ANDA</span>' : (iss?'<span class="mth-badge warn">DEFAULT OFF · TIDAK SESUAI</span>':'<span class="mth-badge warn">DEFAULT OFF</span>');
      }
      function box(k,icon,title,desc,extra){
        var a=j['method_'+k], u=j[k+'_unique'], f=j[k+'_fee'];
        return '<div class="mthbox"><div class="mth-tt"><span>'+icon+' '+title+'</span>'+badge(k)+'</div><div class="mth-bd">'
          +'<label class="mth-act"><input type="checkbox" data-m="method_'+k+'"'+(a?' checked':'')+'> Aktifkan metode ini</label>'
          +'<div class="mth-desc">'+desc+'</div>'
          +'<div class="mth-opts"><label><input type="checkbox" data-m="'+k+'_unique"'+(u?' checked':'')+'> Nominal Unik</label>'
          +'<label><input type="checkbox" data-m="'+k+'_fee"'+(f?' checked':'')+'> Fee</label></div>'
          +(extra||'')+'</div></div>';
      }
      w.innerHTML =
        box('device','🔔','NOTIFIKASI HP','Membaca notifikasi "uang masuk" dari HP Android. Cocok untuk semua penerbit QRIS.','')
        + box('shopee','🛍','SHOPEEPAY PARTNER','Konfirmasi server-side melalui akun ShopeePay Partner (tanpa HP).','')
        + box('gopay','🟢','GOPAY MERCHANT','Konfirmasi server-side melalui akun GoPay Merchant (tanpa HP).','<div style="margin:9px 0 0 25px"><button class="sec" style="width:auto;font-size:11px" onclick="gopayWhyOff()">Kenapa Default OFF?</button></div>')
        + '<div style="margin-top:12px"><button onclick="saveMethods()">Simpan Pengaturan Metode</button></div>';
    }catch(e){}
  }
  function gopayWhyOff(){ var m=$('gpwhy-modal'); if(m) m.style.display='flex'; }
  function gopayWhyClose(){ var m=$('gpwhy-modal'); if(m) m.style.display='none'; }
  async function viewRaw(which){
    var out=$('raw-out'); if(!out) return;
    out.style.display='block'; out.textContent='memuat...';
    try{ var j=await (await fetch('/api/merchant/'+which+'/raw',{headers:{'x-api-key':key()},cache:'no-store'})).json();
      out.textContent=JSON.stringify(j,null,2);
    }catch(e){ out.textContent='gagal: '+String(e); }
  }
  async function saveMethods(){
    var w=$('mth-wrap'); if(!w) return; var payload={};
    w.querySelectorAll('input[data-m]').forEach(function(i){ payload[i.getAttribute('data-m')]=i.checked; });
    try{ var r=await fetch('/api/merchant/methods',{method:'POST',headers:{'x-api-key':key(),'content-type':'application/json'},body:JSON.stringify(payload)});
      var j=await r.json(); if(r.ok) msg('mth-msg','ok','Pengaturan metode disimpan ✓'); else msg('mth-msg','err',j.error||'gagal');
      setTimeout(function(){ var e=$('mth-msg'); if(e) e.innerHTML=''; },4000);
    }catch(e){ msg('mth-msg','err',String(e)); }
  }
  async function clearHook(){
    if(!confirm('Hapus webhook tersimpan?')) return;
    try{ var r=await fetch('/api/merchant/settings',{method:'POST',headers:{'x-api-key':key(),'content-type':'application/json'},body:JSON.stringify({notify_url:''})});
      var j=await r.json(); if(r.ok){ $('notify').value=''; msg('hmsg','ok','Webhook dihapus'); } else msg('hmsg','err',j.error||'gagal');
    }catch(e){ msg('hmsg','err',String(e)); }
  }
  async function saveHook(){
    try{ var r=await fetch('/api/merchant/settings',{method:'POST',headers:{'x-api-key':key(),'content-type':'application/json'},body:JSON.stringify({notify_url:$('notify').value.trim()})});
      var j=await r.json(); if(r.ok) msg('hmsg','ok', j.notify_url?('Webhook aktif → '+j.notify_url):'Webhook dikosongkan'); else msg('hmsg','err',j.error||'gagal');
    }catch(e){ msg('hmsg','err',String(e)); }
  }

  function estOrder(){
    // estimasi live selama belum dibuat; sekali order dibuat QR-nya yang tampil
    var base=parseInt($('amt').value,10)||0, fee=parseFloat($('fee').value)||0;
    var feeAmt=Math.round(base*fee/100), sub=base+feeAmt;
    if(base<=0){ $('rbreak').textContent='base      : Rp 0\\nfee '+fee+'%    : Rp 0\\nkode unik : -\\n─────────────────\\nTOTAL     : Rp 0'; $('ramt').textContent='Rp 0'; return; }
    $('rbreak').textContent='base      : '+idr(base)+'\\nfee '+fee+'%    : '+idr(feeAmt)+'\\nkode unik : +1 s/d +50\\n─────────────────\\nTOTAL     : '+idr(sub+1)+' – '+idr(sub+50);
    $('ramt').textContent='≈ '+idr(sub+1)+' – '+idr(sub+50);
  }
  async function createOrder(){
    var amt=parseInt($('amt').value,10); if(!amt||amt<=0) return msg('omsg','err','Nominal harus > 0');
    try{
      var r=await fetch('/api/orders',{method:'POST',headers:{'x-api-key':key(),'content-type':'application/json'},body:JSON.stringify({base_amount:amt,reference:$('ref').value.trim()||undefined})});
      var j=await r.json(); if(!r.ok) return msg('omsg','err',j.error||'gagal');
      msg('omsg','ok','Order dibuat: '+j.id);
      $('rbreak').textContent='base      : '+idr(j.base_amount)+'\\nfee '+(j.fee_percent||0)+'%    : '+idr(j.fee_amount||0)+'\\nkode unik : '+(j.unique_code||0)+'\\n─────────────────\\nTOTAL     : '+idr(j.unique_amount);
      $('ramt').textContent=idr(j.unique_amount); $('rlink').href=j.checkout_url; $('rlinkwrap').style.display='block';
      if(j.qris){ new QRious({element:$('qrcanvas'),value:j.qris,size:400,level:'M'}); $('qrcanvas').style.display='block'; $('qrph').style.display='none'; }
      else msg('omsg','err','Order dibuat tetapi QRIS belum ada — unggah QRIS terlebih dahulu di menu QRIS & Order.');
      setTimeout(tick,800);
    }catch(e){ msg('omsg','err',String(e)); }
  }

  // ── tiket support ──
  let curTicket=null; var tkImg={}; var curView='dash'; var tkSig='';
  const TKB={active:['#ffc266','#3a2a00'],proses:['#3f7fc4','#fff'],close:['#9aa0a8','#fff']};
  function tkbadge(s){var b=TKB[s]||['#9aa0a8','#fff'];return '<span class="bd" style="background:'+b[0]+';color:'+b[1]+'">'+escj(s)+'</span>';}
  function pickTkImg(input,slot){
    var f=input.files[0]; if(!f){tkImg[slot]=null;return;}
    if(f.size>1572864){ alert('Gambar maksimal 1.5MB'); input.value=''; tkImg[slot]=null; return; }
    var im=new Image(); im.onload=function(){ var mx=1280,sc=Math.min(1,mx/Math.max(im.width,im.height)); var w=Math.round(im.width*sc),h=Math.round(im.height*sc); var cv=document.createElement('canvas'); cv.width=w;cv.height=h; cv.getContext('2d').drawImage(im,0,0,w,h); tkImg[slot]=cv.toDataURL('image/jpeg',0.82); var pv=$(slot==='create'?'tk-prev':'tk-rprev'); if(pv){pv.src=tkImg[slot];pv.style.display='block';} };
    im.onerror=function(){ alert('File bukan gambar'); input.value=''; tkImg[slot]=null; }; im.src=URL.createObjectURL(f);
  }
  function msgLine(mm){
    var role=mm.sender_role||(mm.sender==='admin'?'admin':'user'); var mine=role==='user'; var name=mm.sender_name||'';
    var lbl=mine?'Anda':(role.charAt(0).toUpperCase()+role.slice(1)+(name?' ('+name+')':''));
    var img=mm.image?'<img src="'+mm.image+'" style="max-width:200px;display:block;margin-top:6px;border:2px solid var(--edge);cursor:pointer" onclick="window.open(this.src)">':'';
    return '<div style="margin-bottom:8px;text-align:'+(mine?'right':'left')+'"><div style="display:inline-block;max-width:82%;padding:8px 10px;border:2px solid var(--edge);background:'+(mine?'#dbe7fb':'#fff6d9')+';text-align:left"><div class=dim style="font-size:10px;margin-bottom:2px">'+escj(lbl)+' · '+agoj(mm.created_at)+'</div>'+escj(mm.body)+img+'</div></div>';
  }
  async function loadTickets(){
    if(!key()) return;
    try{ var j=await (await fetch('/api/tickets',{headers:{'x-api-key':key()},cache:'no-store'})).json();
      var list=j.tickets||[];
      $('tklist').innerHTML=list.length?list.map(t=>{ var dot=t.user_unread?' <span title="balasan baru" style="display:inline-block;width:9px;height:9px;background:#b0362a;border:1px solid #fff;vertical-align:middle"></span>':'';
        return '<div onclick="openTicket(\\''+t.id+'\\')" style="padding:9px 10px;border:2px solid;border-color:var(--edge-dark) var(--hi) var(--hi) var(--edge-dark);margin-bottom:6px;cursor:pointer;background:#fff"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><b>'+escj(t.subject)+dot+'</b>'+tkbadge(t.status)+'</div><div class=dim style="font-size:11px">update '+agoj(t.updated_at)+'</div></div>';}).join(''):'<div class=dim>Belum ada tiket</div>';
    }catch(e){}
  }
  async function createTicket(){
    var s=$('tk-subject').value.trim(), m=$('tk-msg').value.trim();
    if(!s||(!m&&!tkImg.create)) return msg('tkmsg','err','Isi subjek & pesan/gambar');
    try{ var r=await fetch('/api/tickets',{method:'POST',headers:{'x-api-key':key(),'content-type':'application/json'},body:JSON.stringify({subject:s,message:m,image:tkImg.create||undefined})});
      var j=await r.json(); if(r.ok){ msg('tkmsg','ok','Tiket terkirim ✓'); $('tk-subject').value=''; $('tk-msg').value=''; $('tk-file').value=''; $('tk-prev').style.display='none'; tkImg.create=null; loadTickets(); openTicket(j.id); } else msg('tkmsg','err',j.error||'gagal');
    }catch(e){ msg('tkmsg','err',String(e)); }
  }
  function closeTicket(){ $('tk-detail').style.display='none'; curTicket=null; tkSig=''; }
  async function openTicket(id,silent){
    curTicket=id;
    try{ var j=await (await fetch('/api/tickets/'+id,{headers:{'x-api-key':key()},cache:'no-store'})).json();
      if(!j.ticket) return;
      $('tk-detail').style.display='block';
      $('tk-dtitle').innerHTML=escj(j.ticket.subject)+' &nbsp;'+tkbadge(j.ticket.status);
      var msgs=j.messages||[];
      // hanya re-render kalau ada perubahan (supaya refresh live tidak buat flicker/scroll lompat)
      var sig=id+':'+msgs.length+':'+(msgs.length?msgs[msgs.length-1].created_at:'')+':'+j.ticket.status;
      if(sig!==tkSig){
        tkSig=sig;
        $('tk-thread').innerHTML=msgs.map(msgLine).join('')||'<div class=dim>kosong</div>';
        $('tk-thread').scrollTop=$('tk-thread').scrollHeight;
      }
      if(!silent){ $('tk-detail').scrollIntoView({behavior:'smooth',block:'nearest'}); loadTickets(); tick(); }
    }catch(e){}
  }
  async function replyTicket(){
    if(!curTicket) return; var b=$('tk-reply').value.trim(); if(!b&&!tkImg.reply) return msg('tkrmsg','err','Balasan/gambar kosong');
    try{ var r=await fetch('/api/tickets/'+curTicket+'/reply',{method:'POST',headers:{'x-api-key':key(),'content-type':'application/json'},body:JSON.stringify({body:b,image:tkImg.reply||undefined})});
      if(r.ok){ $('tk-reply').value=''; if($('tk-rfile'))$('tk-rfile').value=''; if($('tk-rprev'))$('tk-rprev').style.display='none'; tkImg.reply=null; openTicket(curTicket); loadTickets(); } else { var j=await r.json(); msg('tkrmsg','err',j.error||'gagal'); }
    }catch(e){ msg('tkrmsg','err',String(e)); }
  }

  // ── real-time data + pagination ──
  const PER=10;
  let allOrders=[], allEvents=[], oPage=0, ePage=0, oFilter='all', oSearch='';
  const escj=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const nows=()=>Math.floor(Date.now()/1000);
  const agoj=ts=>{ if(!ts)return'-'; try{ var p={}; new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Jakarta',day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date(ts*1000)).forEach(x=>p[x.type]=x.value); return p.day+'/'+p.month+'/'+p.year+' '+p.hour+':'+p.minute; }catch(e){ return '-'; } };
  const bmap={paid:['#0e7c66','#fff'],pending:['#ffc266','#3a2a00'],expired:['#9aa0a8','#fff'],cancelled:['#b0362a','#fff'],matched:['#0e7c66','#fff'],unmatched:['#9aa0a8','#fff'],duplicate:['#3843b8','#fff']};
  const bdg=s=>{const[bg,fg]=bmap[s]||['#9aa0a8','#fff'];return '<span class="bd" style="background:'+bg+';color:'+fg+'">'+escj(s)+'</span>';};
  const dispStatus=o=>(o.status==='pending'&&o.expires_at&&o.expires_at<=nows())?'expired':o.status;

  function pageOrders(d){ var mx=Math.max(0,Math.ceil(allOrders.length/PER)-1); oPage=Math.min(mx,Math.max(0,oPage+d)); renderOrders(); }
  function pageEvents(d){ var mx=Math.max(0,Math.ceil(allEvents.length/PER)-1); ePage=Math.min(mx,Math.max(0,ePage+d)); renderEvents(); }

  function setFilter(f){ oFilter=f; oPage=0; document.querySelectorAll('#ofilter .fchip').forEach(b=>b.classList.toggle('active',b.dataset.f===f)); renderOrders(); }
  function setSearch(v){ oSearch=String(v||'').trim().toLowerCase(); oPage=0; renderOrders(); }
  function filteredOrders(){
    var list=oFilter==='all'?allOrders:allOrders.filter(o=>dispStatus(o)===oFilter);
    if(oSearch) list=list.filter(o=>((o.id||'')+' '+(o.reference||'')+' '+(o.unique_amount||'')+' '+(o.base_amount||'')).toLowerCase().includes(oSearch));
    return list;
  }
  function toggleExport(e){ if(e)e.stopPropagation(); $('expmenu').classList.toggle('on'); }
  document.addEventListener('click',function(){ var m=$('expmenu'); if(m)m.classList.remove('on'); });
  function dl(name,text,mime){ var b=new Blob([text],{type:mime}); var u=URL.createObjectURL(b); var a=document.createElement('a'); a.href=u; a.download=name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){URL.revokeObjectURL(u);},2000); }
  function ordersRows(){ return filteredOrders().map(o=>({id:o.id,reference:o.reference||'',amount:o.unique_amount,base:o.base_amount,status:dispStatus(o),created_at:new Date((o.created_at||0)*1000).toLocaleString('id-ID')})); }
  function exportOrders(fmt){
    $('expmenu').classList.remove('on');
    var rows=ordersRows(); if(!rows.length){ alert('Tidak ada data untuk di-export'); return; }
    var keys=['id','reference','amount','base','status','created_at'];
    if(fmt==='json'){ dl('gatepay-orders.json',JSON.stringify(rows,null,2),'application/json'); return; }
    if(fmt==='csv'){ var ec=v=>'"'+String(v).replace(/"/g,'""')+'"';
      var csv=[keys.join(',')].concat(rows.map(r=>keys.map(k=>ec(r[k])).join(','))).join('\\n');
      dl('gatepay-orders.csv',csv,'text/csv'); return; }
    var th=keys.map(k=>'<th>'+k+'</th>').join('');
    var tr=rows.map(r=>'<tr>'+keys.map(k=>'<td>'+escj(r[k])+'</td>').join('')+'</tr>').join('');
    var doc='<!DOCTYPE html><html><head><meta charset=utf-8><title>GatePay Orders</title><style>body{font-family:Verdana,sans-serif;padding:20px;color:#23262e}h2{font-family:sans-serif}table{border-collapse:collapse;width:100%;font-size:12px}th,td{border:1px solid #999;padding:6px 8px;text-align:left}th{background:#26379d;color:#fff}</style></head><body><h2>GatePay — Orders ('+rows.length+')</h2><table><thead><tr>'+th+'</tr></thead><tbody>'+tr+'</tbody></table></body></html>';
    if(fmt==='html'){ dl('gatepay-orders.html',doc,'text/html'); return; }
    if(fmt==='pdf'){ var w=window.open('','_blank'); if(w){ w.document.write(doc); w.document.close(); setTimeout(function(){ w.focus(); w.print(); },350); } else alert('Popup diblokir — izinkan popup untuk export PDF'); }
  }
  async function cancelOrder(id){
    if(!confirm('Batalkan order ini? Nominal uniknya menjadi bebas digunakan order lain.')) return;
    try{ await fetch('/api/orders/'+id+'/cancel',{method:'POST',headers:{'x-api-key':key()}}); tick(); }catch(e){}
  }
  function renderOrders(){
    var list=filteredOrders();
    var tot=list.length, mx=Math.max(0,Math.ceil(tot/PER)-1); if(oPage>mx)oPage=mx;
    var slice=list.slice(oPage*PER,oPage*PER+PER);
    $('otbody').innerHTML=slice.map(o=>{var st=dispStatus(o);
      var aksi=st==='pending'?'<button class=btncancel onclick="cancelOrder(\\''+escj(o.id)+'\\')">Cancel</button>':'<span class=dim>-</span>';
      return '<tr><td class=mono>'+escj(o.id.slice(0,12))+'</td><td class=mono>'+idr(o.unique_amount)+'<br><span class=dim>base '+idr(o.base_amount)+'</span></td><td>'+bdg(st)+'</td><td class=dim>'+escj(o.reference||'-')+'</td><td><a class=lnk href="/pay/'+escj(o.id)+'" target=_blank>checkout ↗</a></td><td class=dim>'+agoj(o.created_at)+'</td><td>'+aksi+'</td></tr>';}).join('')||'<tr><td colspan=7 class=dim style="text-align:center;padding:20px">Tidak ada order '+(oFilter==='all'?'':escj(oFilter))+'</td></tr>';
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
      if($('tk-dot')) $('tk-dot').style.display=(d.tickets_unread>0)?'block':'none';
      // live refresh tiket kalau lagi buka menu tiket (list + percakapan yg kebuka)
      if(curView==='tiket'){ loadTickets(); if(curTicket) openTicket(curTicket,true); }
    }catch(e){}
  }

  // init
  if(sess()) showApp();
</script>
</body></html>`;
}
