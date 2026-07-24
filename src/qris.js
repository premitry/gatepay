// QRIS engine — parse static QRIS + generate dynamic QRIS (EMVCo MPM / QRIS standard).
//
// Format QRIS = TLV (Tag-Length-Value): tiap field = 2 digit tag + 2 digit length + value.
// Static QRIS: tag 01 = "11" (reusable), tanpa nominal (tag 54).
// Dynamic QRIS: tag 01 = "12" (one-time), ada nominal (tag 54), CRC (tag 63) dihitung ulang.

// ── CRC16-CCITT-FALSE (poly 0x1021, init 0xFFFF) — sesuai spesifikasi QRIS ──
export function crc16(str) {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

// ── Parse TLV jadi array {tag, value} (top-level saja) ──
export function parseTLV(payload) {
  const out = [];
  let i = 0;
  while (i + 4 <= payload.length) {
    const tag = payload.substr(i, 2);
    const len = parseInt(payload.substr(i + 2, 2), 10);
    if (Number.isNaN(len)) break;
    const value = payload.substr(i + 4, len);
    out.push({ tag, value });
    i += 4 + len;
  }
  return out;
}

// ── Build 1 field TLV ──
function field(tag, value) {
  const len = value.length.toString().padStart(2, '0');
  return `${tag}${len}${value}`;
}

// ── Validasi: apakah string ini QRIS yang valid? (cek tag 00 + CRC) ──
export function isValidQris(payload) {
  if (!payload || typeof payload !== 'string') return false;
  const p = payload.trim();
  if (!p.startsWith('000201') && !p.startsWith('00020101')) return false;
  // CRC ada di 4 char terakhir, dihitung atas semua kecuali 4 char itu (termasuk "6304")
  const idx = p.lastIndexOf('6304');
  if (idx < 0 || idx + 8 !== p.length) return false;
  const expected = crc16(p.substring(0, idx + 4));
  return expected === p.substring(idx + 4).toUpperCase();
}

// ── Deteksi penerbit/PJSP QRIS dari kode acquirer ASPI (936009xx) di merchant PAN ──
// Jauh lebih akurat daripada nebak keyword nama. Kode ada di tag 26–51 sub-01 (PAN).
const QRIS_ACQUIRERS = {
  '93600914': { issuer: 'gopay', name: 'GoPay' },
  '93600915': { issuer: 'dana', name: 'DANA' },
  '93600918': { issuer: 'shopeepay', name: 'ShopeePay' },
  '93600911': { issuer: 'linkaja', name: 'LinkAja' },
  '93600110': { issuer: 'ovo', name: 'OVO' },
};

export function detectQrisIssuer(payload) {
  const out = { issuer: null, name: null, acquirer: null, nmid: null, merchantName: null };
  if (!payload || typeof payload !== 'string') return out;
  const tlv = parseTLV(payload);
  const get = (t) => (tlv.find((x) => x.tag === t) || {}).value || null;
  out.merchantName = get('59');
  // scan SEMUA tag merchant account info (26..51) → kumpulin PAN (sub-01) + NMID (sub-02).
  // Jangan berhenti di tag pertama: issuer bisa di template acquirer (tag 26),
  // sedangkan NMID nasional ("ID"+angka) ada di template QRIS nasional (tag 51).
  for (let n = 26; n <= 51; n++) {
    const v = get(String(n).padStart(2, '0'));
    if (!v) continue;
    const sub = parseTLV(v);
    const pan = (sub.find((s) => s.tag === '01') || {}).value || '';
    const nmid = (sub.find((s) => s.tag === '02') || {}).value || '';
    if (nmid && /^ID\d{6,}/i.test(nmid)) out.nmid = nmid;        // NMID nasional (utamakan)
    else if (nmid && !out.nmid) out.nmid = nmid;                 // cadangan
    if (!out.issuer) {
      for (const code in QRIS_ACQUIRERS) {
        if (pan.indexOf(code) >= 0) { const a = QRIS_ACQUIRERS[code]; out.issuer = a.issuer; out.name = a.name; out.acquirer = code; break; }
      }
    }
  }
  // fallback: scan seluruh payload untuk kode acquirer
  if (!out.issuer) {
    for (const code in QRIS_ACQUIRERS) {
      if (payload.indexOf(code) >= 0) { const a = QRIS_ACQUIRERS[code]; out.issuer = a.issuer; out.name = a.name; out.acquirer = code; break; }
    }
  }
  // fallback terakhir: keyword nama
  if (!out.issuer) {
    if (/GOPAY|GOJEK|GOTOPAY/i.test(payload)) { out.issuer = 'gopay'; out.name = 'GoPay'; }
    else if (/SHOPEE/i.test(payload)) { out.issuer = 'shopeepay'; out.name = 'ShopeePay'; }
    else if (/\bDANA\b/i.test(payload)) { out.issuer = 'dana'; out.name = 'DANA'; }
  }
  return out;
}

// ── Ambil info dari QRIS (nama merchant, kota, dll) buat ditampilin ──
export function qrisInfo(payload) {
  const tlv = parseTLV(payload);
  const get = (t) => (tlv.find((x) => x.tag === t) || {}).value || null;
  return {
    poi: get('01') === '12' ? 'dynamic' : 'static',
    merchantName: get('59'),
    merchantCity: get('60'),
    currency: get('53'),
    countryCode: get('58'),
    amount: get('54') ? Number(get('54')) : null,
  };
}

// ── CORE: static QRIS → dynamic QRIS dengan nominal ──
// amount = rupiah integer (mis. 1210). reference = kode order (opsional).
// embedRef = true → sisipin kode order ke tag 62 sub-01 (Bill Number) buat matching-by-kode
//            saat nominal unik dimatikan. Default false = perilaku lama (matching by nominal).
export function makeDynamic(staticPayload, amount, reference, embedRef = false) {
  const p = staticPayload.trim();
  // buang CRC lama
  const idx = p.lastIndexOf('6304');
  const body = idx >= 0 ? p.substring(0, idx) : p;

  const tlv = parseTLV(body);
  // susun ulang: cuma sisipkan nominal (tag 54). Tag lain (26/51/62/dst) DIBIARKAN utuh.
  const map = new Map();
  for (const { tag, value } of tlv) map.set(tag, value);

  // PENTING: JANGAN ubah POI ke '12' (dynamic).
  // QR dinamis (POI 12) itu harusnya digenerate sistem acquirer sendiri dgn transaksi
  // terdaftar di backend mereka. Kalau kita paksa 12, app bayar (GoPay/SeaBank/dll) kirim
  // ke acquirer, acquirer nyari transaksi yg match → gak ketemu → DITOLAK.
  // Cukup pertahanin POI statis '11' lalu suntik nominal (tag 54).
  if (!map.has('01')) map.set('01', '11');
  map.set('54', String(Math.round(amount))); // transaction amount (tanpa desimal)

  // Kode order ke tag 62 sub-tag 01 (Bill Number) — HANYA kalau diminta.
  // Dipakai saat nominal unik OFF (mis. mode aman GoPay) supaya order tetap bisa
  // dibedakan lewat kode, bukan lewat sen unik. Sub-tag diurut ascending (01 di depan)
  // biar tetap valid buat acquirer yang strict.
  if (embedRef && reference) {
    const ref = String(reference).replace(/[^A-Za-z0-9]/g, '').slice(0, 20);
    if (ref) {
      const sub = new Map();
      if (map.has('62')) for (const s of parseTLV(map.get('62'))) sub.set(s.tag, s.value);
      sub.set('01', ref);
      const subOrder = [...sub.keys()].sort();
      let subOut = '';
      for (const t of subOrder) subOut += field(t, sub.get(t));
      map.set('62', subOut);
    }
  }

  // urutkan tag ascending (QRIS harus urut), tag 63 (CRC) di akhir
  const order = [...map.keys()].filter((t) => t !== '63').sort();
  let out = '';
  for (const tag of order) out += field(tag, map.get(tag));

  // hitung CRC atas out + "6304"
  out += '6304';
  out += crc16(out);
  return out;
}
