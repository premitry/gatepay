package com.gatepay.catcher;

import android.app.Notification;
import android.os.Bundle;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.util.Log;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

/** Tangkap notifikasi DANA, parse nominal, kirim ke Worker. */
public class NotifCatcherService extends NotificationListenerService {
    private static final String TAG = "PayGateCatcher";

    @Override
    public void onListenerConnected() {
        Log.i(TAG, "listener connected");
        // drain antrian yang tertunda saat service nyambung
        Sender.drain(getApplicationContext());
    }

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        try {
            String pkg = sbn.getPackageName();
            if (!isTarget(pkg)) return;

            Notification n = sbn.getNotification();
            if (n == null) return;
            Bundle ex = n.extras;
            if (ex == null) return;

            String title = str(ex.getCharSequence(Notification.EXTRA_TITLE));
            String text = str(ex.getCharSequence(Notification.EXTRA_TEXT));
            String big = str(ex.getCharSequence(Notification.EXTRA_BIG_TEXT));
            String body = (big != null && big.length() > 0) ? big : text;

            String full = (title == null ? "" : title) + " | " + (body == null ? "" : body);

            if (!AmountParser.looksLikeIncoming(title, body)) {
                Log.d(TAG, "skip (bukan uang masuk): " + full);
                return;
            }
            long amount = AmountParser.parse(body != null ? body : title);
            if (amount <= 0) {
                Log.d(TAG, "skip (no amount): " + full);
                return;
            }

            long postTime = sbn.getPostTime();
            String eventId = eventId(pkg, full, postTime, amount);
            String json = buildJson(eventId, amount, title, body, postTime);

            Log.i(TAG, "CATCH Rp" + amount + " :: " + full);
            Sender.send(getApplicationContext(), json);
        } catch (Exception e) {
            Log.w(TAG, "onNotificationPosted err: " + e.getMessage());
        }
    }

    private boolean isTarget(String pkg) {
        String[] targets = Config.targetPackages(getApplicationContext()).split(",");
        for (String t : targets) {
            if (t.trim().equalsIgnoreCase(pkg)) return true;
        }
        return false;
    }

    private static String str(CharSequence cs) {
        return cs == null ? null : cs.toString();
    }

    /** event_id deterministik = hash(pkg + amount + postTime + text) buat dedup. */
    private static String eventId(String pkg, String text, long postTime, long amount) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            String seed = pkg + "|" + amount + "|" + postTime + "|" + text;
            byte[] h = md.digest(seed.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 12; i++) {
                sb.append(Character.forDigit((h[i] >> 4) & 0xF, 16));
                sb.append(Character.forDigit(h[i] & 0xF, 16));
            }
            return "ntf_" + sb;
        } catch (Exception e) {
            return "ntf_" + postTime + "_" + amount;
        }
    }

    private static String buildJson(String eventId, long amount, String title, String body, long postTime) {
        StringBuilder sb = new StringBuilder();
        sb.append('{');
        sb.append("\"event_id\":\"").append(esc(eventId)).append("\",");
        sb.append("\"source\":\"notification\",");
        sb.append("\"amount\":").append(amount).append(',');
        sb.append("\"sender\":").append(title == null ? "null" : "\"" + esc(title) + "\"").append(',');
        sb.append("\"raw_text\":\"").append(esc((title == null ? "" : title) + " " + (body == null ? "" : body))).append("\",");
        sb.append("\"received_at\":").append(postTime / 1000L);
        sb.append('}');
        return sb.toString();
    }

    private static String esc(String s) {
        if (s == null) return "";
        StringBuilder o = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '"': o.append("\\\""); break;
                case '\\': o.append("\\\\"); break;
                case '\n': o.append(' '); break;
                case '\r': break;
                case '\t': o.append(' '); break;
                default:
                    if (c < 0x20) o.append(' '); else o.append(c);
            }
        }
        return o.toString();
    }
}
