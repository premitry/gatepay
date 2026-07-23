package com.gatepay.catcher;

import android.content.Context;
import android.util.Log;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

/** Kirim event ke Worker: HMAC sign + POST + retry queue file-based. */
public class Sender {
    private static final String TAG = "PayGateSender";
    private static final ExecutorService POOL = Executors.newSingleThreadExecutor();
    private static final Object LOCK = new Object();

    public static void send(final Context ctx, final String jsonBody) {
        POOL.execute(new Runnable() {
            public void run() {
                int code = post(ctx, jsonBody);
                boolean ok = code >= 200 && code < 300;
                boolean handled = ok || code == 400 || code == 401;
                if (!handled) enqueue(ctx, jsonBody);
                // catat aktivitas lokal buat tampilan Status/Riwayat
                EventLog.record(ctx, jsonBody, code);
                // coba drain antrian tiap kali ada kesempatan
                drain(ctx);
            }
        });
    }

    /** Coba kirim ulang semua yang ngantri. */
    public static void drain(final Context ctx) {
        POOL.execute(new Runnable() {
            public void run() {
                synchronized (LOCK) {
                    File q = queueFile(ctx);
                    if (!q.exists()) return;
                    List<String> lines = readLines(q);
                    List<String> remain = new ArrayList<>();
                    for (String line : lines) {
                        if (line.trim().isEmpty()) continue;
                        int code = post(ctx, line);
                        boolean handled = (code >= 200 && code < 300) || code == 400 || code == 401;
                        if (!handled) remain.add(line);
                    }
                    writeLines(q, remain);
                }
            }
        });
    }

    /** @return http code (2xx sukses; 400/401 = drop, jangan retry; -1 = gagal jaringan). */
    private static int post(Context ctx, String jsonBody) {
        HttpURLConnection conn = null;
        try {
            String url = Config.serverUrl(ctx);
            if (url.endsWith("/")) url = url.substring(0, url.length() - 1);
            String sig = hmacHex(Config.deviceSecret(ctx), jsonBody);

            conn = (HttpURLConnection) new URL(url + "/ingest/event").openConnection();
            conn.setRequestMethod("POST");
            conn.setConnectTimeout(10000);
            conn.setReadTimeout(15000);
            conn.setDoOutput(true);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("X-Device-Id", Config.deviceId(ctx));
            conn.setRequestProperty("X-Signature", sig);

            byte[] out = jsonBody.getBytes(StandardCharsets.UTF_8);
            OutputStream os = conn.getOutputStream();
            os.write(out);
            os.close();

            int code = conn.getResponseCode();
            Log.i(TAG, "POST /ingest/event -> " + code);
            if (code == 400 || code == 401) Log.w(TAG, "drop event (client error " + code + ")");
            return code;
        } catch (Exception e) {
            Log.w(TAG, "post failed: " + e.getMessage());
            return -1;
        } finally {
            if (conn != null) conn.disconnect();
        }
    }

    /** Uji koneksi ke server (buat tombol UJI SERVER). @return http code atau -1. */
    public static int ping(Context ctx) {
        HttpURLConnection conn = null;
        try {
            String url = Config.serverUrl(ctx);
            if (url.endsWith("/")) url = url.substring(0, url.length() - 1);
            conn = (HttpURLConnection) new URL(url + "/health").openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(8000);
            conn.setReadTimeout(10000);
            return conn.getResponseCode();
        } catch (Exception e) {
            return -1;
        } finally {
            if (conn != null) conn.disconnect();
        }
    }

    private static void enqueue(Context ctx, String jsonBody) {
        synchronized (LOCK) {
            try (FileWriter w = new FileWriter(queueFile(ctx), true)) {
                w.write(jsonBody.replace("\n", " ") + "\n");
            } catch (Exception e) {
                Log.w(TAG, "enqueue failed: " + e.getMessage());
            }
        }
    }

    private static File queueFile(Context ctx) {
        return new File(ctx.getFilesDir(), "queue.jsonl");
    }

    private static List<String> readLines(File f) {
        List<String> out = new ArrayList<>();
        try (BufferedReader r = new BufferedReader(new FileReader(f))) {
            String l;
            while ((l = r.readLine()) != null) out.add(l);
        } catch (Exception ignored) {}
        return out;
    }

    private static void writeLines(File f, List<String> lines) {
        try (FileWriter w = new FileWriter(f, false)) {
            for (String l : lines) w.write(l + "\n");
        } catch (Exception ignored) {}
    }

    public static String hmacHex(String secret, String message) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        byte[] raw = mac.doFinal(message.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder(raw.length * 2);
        for (byte b : raw) {
            sb.append(Character.forDigit((b >> 4) & 0xF, 16));
            sb.append(Character.forDigit(b & 0xF, 16));
        }
        return sb.toString();
    }
}
