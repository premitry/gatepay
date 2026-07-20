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
// amount = rupiah integer (mis. 1210). reference opsional (masuk tag 62 sub-05).
export function makeDynamic(staticPayload, amount, reference) {
  const p = staticPayload.trim();
  // buang CRC lama
  const idx = p.lastIndexOf('6304');
  const body = idx >= 0 ? p.substring(0, idx) : p;

  const tlv = parseTLV(body);
  // susun ulang: cuma sisipkan nominal (tag 54). Tag lain (26/51/62/dst) DIBIARKAN utuh.
  const map = new Map();
  for (const { tag, value } of tlv) map.set(tag, value);

  // PENTING #1: JANGAN ubah POI ke '12' (dynamic).
  // QR dinamis (POI 12) itu harusnya digenerate sistem acquirer sendiri dgn transaksi
  // terdaftar di backend mereka. Kalau kita paksa 12, app bayar (GoPay/SeaBank/dll) kirim
  // ke acquirer, acquirer nyari transaksi yg match → gak ketemu → DITOLAK
  // ("service not available" / "QR gak bisa dipakai"). Cukup pertahanin POI statis '11'
  // lalu suntik nominal (tag 54) → jadi "statis + nominal preset", diterima semua e-wallet.
  if (!map.has('01')) map.set('01', '11');
  map.set('54', String(Math.round(amount))); // transaction amount (tanpa desimal)

  // PENTING #2: JANGAN utak-atik tag 62 (Additional Data / reference).
  // Matching pembayaran pakai NOMINAL UNIK, bukan baca reference dari QR — jadi reference
  // di QR nggak diperlukan. Nyisipin sub-tag 05 bikin urutan sub-tag kebalik (07 lalu 05)
  // dan sebagian acquirer strict nolak QR-nya. Biarin tag 62 persis kayak QRIS statis.
  // (param `reference` sengaja diabaikan.)

  // urutkan tag ascending (QRIS harus urut), tag 63 (CRC) di akhir
  const order = [...map.keys()].filter((t) => t !== '63').sort();
  let out = '';
  for (const tag of order) out += field(tag, map.get(tag));

  // hitung CRC atas out + "6304"
  out += '6304';
  out += crc16(out);
  return out;
}
