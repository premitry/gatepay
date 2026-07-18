package com.gatepay.catcher;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Parse nominal rupiah dari teks notifikasi DANA. */
public class AmountParser {

    // Match "Rp10.000", "Rp 10.000", "Rp10.000,00", "RP 1.234.567"
    private static final Pattern RP = Pattern.compile(
        "(?i)rp\\s*([0-9]{1,3}(?:[.\\s][0-9]{3})*(?:,[0-9]{1,2})?|[0-9]+(?:,[0-9]{1,2})?)");

    /** Return nominal dalam rupiah (integer), atau -1 kalau tidak ketemu. */
    public static long parse(String text) {
        if (text == null) return -1;
        Matcher m = RP.matcher(text);
        if (!m.find()) return -1;
        String num = m.group(1);
        if (num == null) return -1;
        // buang pemisah ribuan (titik/spasi), potong desimal (,xx)
        int comma = num.indexOf(',');
        if (comma >= 0) num = num.substring(0, comma);
        num = num.replace(".", "").replace(" ", "").trim();
        if (num.isEmpty()) return -1;
        try {
            return Long.parseLong(num);
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    /** Apakah teks kelihatan seperti notif "uang masuk" (bukan promo/keluar). */
    public static boolean looksLikeIncoming(String title, String text) {
        String s = ((title == null ? "" : title) + " " + (text == null ? "" : text)).toLowerCase();
        // kata kunci uang masuk
        boolean incoming = s.contains("menerima") || s.contains("masuk")
            || s.contains("diterima") || s.contains("berhasil")
            || s.contains("pembayaran") || s.contains("terima")
            || s.contains("received") || s.contains("credited")
            || s.contains("saldo masuk") || s.contains("transaksi masuk");
        // exclude yang jelas keluar / promo
        boolean outgoing = s.contains("mengirim") || s.contains("terkirim")
            || s.contains("keluar") || s.contains("pengeluaran")
            || s.contains("cashback") || s.contains("promo")
            || s.contains("voucher") || s.contains("diskon");
        return incoming && !outgoing;
    }
}
