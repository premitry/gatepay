package com.gatepay.catcher;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

/**
 * Klien HTTP kecil untuk login akun web -> ambil device_id + device_secret.
 * Memanggil endpoint /api/login yang sudah ada (username + password + totp opsional).
 * Tidak menyimpan password; hanya kredensial device yang dikembalikan server.
 */
public final class Api {
    private Api() {}

    public static class Result {
        public int code;
        public boolean ok;
        public boolean needs2fa;
        public String error;
        public String deviceId;
        public String deviceSecret;
        public String username;
        public String merchantName;
    }

    /** Login sinkron (panggil dari background thread). */
    public static Result login(String serverUrl, String username, String password, String totp) {
        Result r = new Result();
        HttpURLConnection conn = null;
        try {
            String url = serverUrl == null ? "" : serverUrl.trim();
            if (url.isEmpty()) url = "https://gatepay.biz.id";
            if (!url.startsWith("http")) url = "https://" + url;
            if (url.endsWith("/")) url = url.substring(0, url.length() - 1);

            String body = "{\"username\":\"" + esc(username) + "\",\"password\":\"" + esc(password) + "\""
                + (totp != null && !totp.trim().isEmpty() ? ",\"totp\":\"" + esc(totp.trim()) + "\"" : "")
                + "}";

            conn = (HttpURLConnection) new URL(url + "/api/login").openConnection();
            conn.setRequestMethod("POST");
            conn.setConnectTimeout(12000);
            conn.setReadTimeout(15000);
            conn.setDoOutput(true);
            conn.setRequestProperty("Content-Type", "application/json");
            OutputStream os = conn.getOutputStream();
            os.write(body.getBytes(StandardCharsets.UTF_8));
            os.close();

            r.code = conn.getResponseCode();
            String resp = read(r.code >= 200 && r.code < 300 ? conn.getInputStream() : conn.getErrorStream());

            r.ok = resp.contains("\"ok\":true");
            r.needs2fa = resp.contains("\"needs_2fa\":true");
            r.deviceId = str(resp, "\"device_id\":\"");
            r.deviceSecret = str(resp, "\"device_secret\":\"");
            r.username = str(resp, "\"username\":\"");
            r.merchantName = str(resp, "\"merchant_name\":\"");
            r.error = str(resp, "\"error\":\"");
            return r;
        } catch (Exception e) {
            r.error = "Koneksi gagal: " + e.getMessage();
            return r;
        } finally {
            if (conn != null) conn.disconnect();
        }
    }

    private static String read(InputStream in) {
        if (in == null) return "";
        StringBuilder sb = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8))) {
            String l;
            while ((l = br.readLine()) != null) sb.append(l);
        } catch (Exception ignored) {}
        return sb.toString();
    }

    private static String str(String json, String key) {
        int i = json.indexOf(key);
        if (i < 0) return "";
        i += key.length();
        StringBuilder o = new StringBuilder();
        for (int j = i; j < json.length(); j++) {
            char ch = json.charAt(j);
            if (ch == '\\' && j + 1 < json.length()) { o.append(json.charAt(++j)); continue; }
            if (ch == '"') break;
            o.append(ch);
        }
        return o.toString();
    }

    private static String esc(String s) {
        if (s == null) return "";
        StringBuilder o = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '"': o.append("\\\""); break;
                case '\\': o.append("\\\\"); break;
                case '\n': case '\r': case '\t': break;
                default: o.append(c);
            }
        }
        return o.toString();
    }
}
