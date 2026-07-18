package com.gatepay.catcher;

import android.content.Context;
import android.content.SharedPreferences;

/** Konfigurasi tersimpan: URL Worker, device id, device secret, paket target. */
public class Config {
    private static final String PREF = "paygate_cfg";

    public static SharedPreferences prefs(Context c) {
        return c.getSharedPreferences(PREF, Context.MODE_PRIVATE);
    }

    public static String serverUrl(Context c) {
        return prefs(c).getString("server_url", "https://gatepay.biz.id");
    }

    public static String deviceId(Context c) {
        return prefs(c).getString("device_id", "");
    }

    public static String deviceSecret(Context c) {
        return prefs(c).getString("device_secret", "");
    }

    /** Paket yang notifikasinya ditangkap (comma separated). */
    public static String targetPackages(Context c) {
        return prefs(c).getString("target_packages", "id.dana,id.danabisnis,id.dana.bisnis");
    }

    public static void save(Context c, String url, String devId, String secret, String pkgs) {
        prefs(c).edit()
            .putString("server_url", url)
            .putString("device_id", devId)
            .putString("device_secret", secret)
            .putString("target_packages", pkgs)
            .apply();
    }
}
