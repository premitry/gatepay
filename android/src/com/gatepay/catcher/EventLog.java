package com.gatepay.catcher;

import android.content.Context;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

/**
 * Catatan aktivitas lokal (aditif, hanya untuk tampilan).
 * Menyimpan tiap event yang diproses catcher ke events.jsonl di filesDir,
 * dipakai halaman Status (statistik hari ini + log) dan Riwayat.
 * Tidak mengubah endpoint, permission, atau logic pengiriman.
 */
public final class EventLog {
    private EventLog() {}

    private static final Object LOCK = new Object();
    private static final int CAP = 400; // simpan maksimal N event terakhir

    public static class Ev {
        public long t;        // epoch detik
        public String src;    // sumber (nama paket / "TEST")
        public long amt;      // nominal
        public int code;      // http code (200 dst, -1 = gagal jaringan)
        public String eid;    // event_id
        public boolean sent() { return code >= 200 && code < 300; }
        public boolean pending() { return code == 0; }
    }

    /** Catat hasil dari body JSON event + http code. */
    public static void record(Context ctx, String jsonBody, int code) {
        try {
            long amt = num(jsonBody, "\"amount\":");
            long recv = num(jsonBody, "\"received_at\":");
            String src = str(jsonBody, "\"source\":\"");
            String eid = str(jsonBody, "\"event_id\":\"");
            long t = recv > 0 ? recv : System.currentTimeMillis() / 1000L;
            String line = t + "\t" + safe(src) + "\t" + amt + "\t" + code + "\t" + safe(eid);
            append(ctx, line);
        } catch (Exception ignored) {}
    }

    private static void append(Context ctx, String line) {
        synchronized (LOCK) {
            List<String> lines = readRaw(ctx);
            lines.add(line);
            while (lines.size() > CAP) lines.remove(0);
            try (FileWriter w = new FileWriter(file(ctx), false)) {
                for (String l : lines) w.write(l + "\n");
            } catch (Exception ignored) {}
        }
    }

    /** N event terbaru (terbaru dulu). */
    public static List<Ev> recent(Context ctx, int n) {
        List<Ev> all = new ArrayList<>();
        synchronized (LOCK) {
            List<String> lines = readRaw(ctx);
            for (String l : lines) {
                Ev e = parse(l);
                if (e != null) all.add(e);
            }
        }
        List<Ev> out = new ArrayList<>();
        for (int i = all.size() - 1; i >= 0 && out.size() < n; i--) out.add(all.get(i));
        return out;
    }

    public static class Stats {
        public int count;   // jumlah pembayaran hari ini
        public long total;  // total nominal hari ini
        public int sent;    // webhook berhasil
        public int failed;  // webhook gagal
        public long lastAt; // waktu event terakhir (0 = belum ada)
        public String lastSrc;
    }

    /** Statistik untuk hari ini (waktu lokal). */
    public static Stats today(Context ctx) {
        Stats s = new Stats();
        long start = startOfToday();
        List<Ev> recent = recent(ctx, CAP);
        if (!recent.isEmpty()) { s.lastAt = recent.get(0).t; s.lastSrc = recent.get(0).src; }
        for (Ev e : recent) {
            if (e.t < start) continue;
            s.count++;
            s.total += e.amt;
            if (e.sent()) s.sent++; else if (!e.pending()) s.failed++;
        }
        return s;
    }

    private static long startOfToday() {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTimeInMillis() / 1000L;
    }

    private static File file(Context ctx) {
        return new File(ctx.getFilesDir(), "events.jsonl");
    }

    private static List<String> readRaw(Context ctx) {
        List<String> out = new ArrayList<>();
        File f = file(ctx);
        if (!f.exists()) return out;
        try (BufferedReader r = new BufferedReader(new FileReader(f))) {
            String l;
            while ((l = r.readLine()) != null) if (!l.trim().isEmpty()) out.add(l);
        } catch (Exception ignored) {}
        return out;
    }

    private static Ev parse(String line) {
        try {
            String[] p = line.split("\t", -1);
            if (p.length < 4) return null;
            Ev e = new Ev();
            e.t = Long.parseLong(p[0]);
            e.src = p[1];
            e.amt = Long.parseLong(p[2]);
            e.code = Integer.parseInt(p[3]);
            e.eid = p.length > 4 ? p[4] : "";
            return e;
        } catch (Exception ex) {
            return null;
        }
    }

    // ── parsing sederhana dari body JSON (tanpa lib) ──
    private static long num(String json, String key) {
        int i = json.indexOf(key);
        if (i < 0) return 0;
        i += key.length();
        int j = i;
        while (j < json.length()) {
            char ch = json.charAt(j);
            if ((ch >= '0' && ch <= '9') || ch == '-') j++; else break;
        }
        if (j == i) return 0;
        try { return Long.parseLong(json.substring(i, j)); } catch (Exception e) { return 0; }
    }

    private static String str(String json, String key) {
        int i = json.indexOf(key);
        if (i < 0) return "";
        i += key.length();
        int j = json.indexOf('"', i);
        if (j < 0) return "";
        return json.substring(i, j);
    }

    private static String safe(String s) {
        if (s == null) return "";
        return s.replace('\t', ' ').replace('\n', ' ');
    }
}
