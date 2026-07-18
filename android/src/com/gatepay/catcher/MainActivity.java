package com.gatepay.catcher;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.provider.Settings;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

/** UI konfigurasi — gaya GatePay (dark + hijau + kotak siku), programmatic. */
public class MainActivity extends Activity {
    private EditText eUrl, eDevId, eSecret, ePkgs;
    private TextView statusView;

    // palet (samain sama web)
    static final int BG = 0xFF0F1115;
    static final int CARD = 0xFF171A21;
    static final int CARD2 = 0xFF1E222B;
    static final int BD = 0xFF2B3038;
    static final int GREEN = 0xFF3DDC97;
    static final int GREENINK = 0xFF04120B;
    static final int TX = 0xFFEEF0F4;
    static final int DIM = 0xFF9AA3B2;

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        getWindow().getDecorView().setBackgroundColor(BG);

        // Config via ADB intent extras (zero-typing):
        // adb shell am start -n com.gatepay.catcher/.MainActivity \
        //   --es url <..> --es devid <..> --es secret <..> --es pkgs <..>
        applyIntentConfig(getIntent());

        ScrollView sv = new ScrollView(this);
        sv.setBackgroundColor(BG);
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        int pad = dp(20);
        root.setPadding(pad, pad, pad, pad);
        sv.addView(root);

        // ── Header ──
        LinearLayout header = new LinearLayout(this);
        header.setOrientation(LinearLayout.HORIZONTAL);
        header.setGravity(Gravity.CENTER_VERTICAL);
        header.setPadding(0, dp(4), 0, dp(4));
        TextView mark = new TextView(this);
        mark.setText("G");
        mark.setTextColor(GREENINK);
        mark.setTextSize(18);
        mark.setTypeface(mark.getTypeface(), android.graphics.Typeface.BOLD);
        mark.setGravity(Gravity.CENTER);
        mark.setBackgroundColor(GREEN);
        int m = dp(34);
        mark.setWidth(m);
        mark.setHeight(m);
        header.addView(mark);
        TextView title = new TextView(this);
        title.setText("  GatePay Catcher");
        title.setTextColor(TX);
        title.setTextSize(20);
        title.setTypeface(title.getTypeface(), android.graphics.Typeface.BOLD);
        header.addView(title);
        root.addView(header);

        TextView subtitle = new TextView(this);
        subtitle.setText("Penangkap notifikasi pembayaran");
        subtitle.setTextColor(DIM);
        subtitle.setTextSize(13);
        subtitle.setPadding(0, dp(2), 0, dp(16));
        root.addView(subtitle);

        // ── Status card ──
        statusView = new TextView(this);
        statusView.setTextSize(13);
        statusView.setPadding(dp(14), dp(12), dp(14), dp(12));
        root.addView(statusView);
        spacer(root, 16);

        // ── Fields ──
        eUrl = field(root, "Server URL", Config.serverUrl(this));
        eDevId = field(root, "Device ID", Config.deviceId(this));
        eDevId.setHint("copy dari dashboard kamu");
        eDevId.setHintTextColor(0xFF5A6472);
        eSecret = field(root, "Device Secret", Config.deviceSecret(this));
        eSecret.setHint("copy dari dashboard kamu");
        eSecret.setHintTextColor(0xFF5A6472);
        ePkgs = field(root, "Target Packages (pisah koma)", Config.targetPackages(this));
        ePkgs.setHint("id.dana,ovo.id,com.gojek.app");
        ePkgs.setHintTextColor(0xFF5A6472);

        spacer(root, 8);

        // ── Buttons ──
        root.addView(primaryBtn("Simpan Konfigurasi", new View.OnClickListener() {
            public void onClick(View v) { save(); toast("Konfigurasi tersimpan"); refreshStatus(); }
        }));
        spacer(root, 8);
        root.addView(outlineBtn("Buka Notification Access", new View.OnClickListener() {
            public void onClick(View v) { startActivity(new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)); }
        }));
        spacer(root, 8);
        root.addView(outlineBtn("Kirim Test Event", new View.OnClickListener() {
            public void onClick(View v) {
                save();
                long amt = 1000 + (long) (Math.random() * 9000);
                long ts = System.currentTimeMillis() / 1000;
                String eid = "test_" + System.currentTimeMillis();
                String json = "{\"event_id\":\"" + eid + "\",\"source\":\"notification\",\"amount\":"
                    + amt + ",\"sender\":\"TEST\",\"raw_text\":\"Test event Rp" + amt
                    + "\",\"received_at\":" + ts + "}";
                Sender.send(MainActivity.this, json);
                toast("Test event Rp" + amt + " dikirim");
            }
        }));

        spacer(root, 18);
        TextView help = new TextView(this);
        help.setText("Notif dari aplikasi target (mis. DANA) otomatis tertangkap & dikirim ke server. Bisa lebih dari satu aplikasi — pisahkan dengan koma.");
        help.setTextColor(DIM);
        help.setTextSize(12);
        root.addView(help);

        setContentView(sv);
        refreshStatus();
    }

    @Override
    protected void onResume() {
        super.onResume();
        refreshStatus();
    }

    private void refreshStatus() {
        boolean granted = isNlsGranted();
        GradientDrawable bg = box(granted ? 0xFF123A2A : 0xFF2A1416, granted ? GREEN : 0xFFFF5C5C);
        statusView.setBackground(bg);
        statusView.setTextColor(granted ? GREEN : 0xFFFF5C5C);
        statusView.setText(granted
            ? "● Notification Access AKTIF — siap nangkep notif"
            : "○ Notification Access BELUM aktif — tekan tombol di bawah");
    }

    private boolean isNlsGranted() {
        String flat = Settings.Secure.getString(getContentResolver(), "enabled_notification_listeners");
        return flat != null && flat.contains(getPackageName());
    }

    private void save() {
        Config.save(this,
            eUrl.getText().toString().trim(),
            eDevId.getText().toString().trim(),
            eSecret.getText().toString().trim(),
            ePkgs.getText().toString().trim());
    }

    /** Terapkan config dari intent extras kalau ada (buat setup via ADB). */
    private void applyIntentConfig(Intent it) {
        if (it == null) return;
        String url = it.getStringExtra("url");
        String devid = it.getStringExtra("devid");
        String secret = it.getStringExtra("secret");
        String pkgs = it.getStringExtra("pkgs");
        if (url == null && devid == null && secret == null && pkgs == null) return;
        Config.save(this,
            url != null ? url : Config.serverUrl(this),
            devid != null ? devid : Config.deviceId(this),
            secret != null ? secret : Config.deviceSecret(this),
            pkgs != null ? pkgs : Config.targetPackages(this));
    }

    private void toast(String s) { Toast.makeText(this, s, Toast.LENGTH_SHORT).show(); }

    // ── UI helpers ──
    private EditText field(LinearLayout p, String label, String val) {
        TextView l = new TextView(this);
        l.setText(label);
        l.setTextColor(DIM);
        l.setTextSize(12);
        l.setPadding(0, dp(12), 0, dp(4));
        p.addView(l);

        EditText e = new EditText(this);
        e.setText(val);
        e.setTextColor(TX);
        e.setTextSize(14);
        e.setSingleLine(true);
        e.setPadding(dp(12), dp(10), dp(12), dp(10));
        e.setBackground(box(CARD2, BD));
        p.addView(e);
        return e;
    }

    private Button primaryBtn(String txt, View.OnClickListener cl) {
        Button b = new Button(this);
        b.setText(txt);
        b.setAllCaps(false);
        b.setTextColor(GREENINK);
        b.setTextSize(15);
        b.setTypeface(b.getTypeface(), android.graphics.Typeface.BOLD);
        b.setBackground(box(GREEN, GREEN));
        b.setPadding(0, dp(14), 0, dp(14));
        b.setOnClickListener(cl);
        return b;
    }

    private Button outlineBtn(String txt, View.OnClickListener cl) {
        Button b = new Button(this);
        b.setText(txt);
        b.setAllCaps(false);
        b.setTextColor(TX);
        b.setTextSize(14);
        b.setBackground(box(CARD2, BD));
        b.setPadding(0, dp(13), 0, dp(13));
        b.setOnClickListener(cl);
        return b;
    }

    private GradientDrawable box(int fill, int stroke) {
        GradientDrawable g = new GradientDrawable();
        g.setColor(fill);
        g.setStroke(dp(1), stroke);
        g.setCornerRadius(0f); // kotak siku
        return g;
    }

    private void spacer(LinearLayout p, int h) {
        View v = new View(this);
        v.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, dp(h)));
        p.addView(v);
    }

    private int dp(int v) {
        return (int) (v * getResources().getDisplayMetrics().density);
    }
}
