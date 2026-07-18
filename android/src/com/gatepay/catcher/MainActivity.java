package com.gatepay.catcher;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.provider.Settings;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

/** UI konfigurasi minimal (programmatic, tanpa layout XML). */
public class MainActivity extends Activity {
    private EditText eUrl, eDevId, eSecret, ePkgs;

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);

        ScrollView sv = new ScrollView(this);
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        int pad = dp(20);
        root.setPadding(pad, pad, pad, pad);
        sv.addView(root);

        addTitle(root, "GatePay Catcher");
        addLabel(root, "Server URL (Worker)");
        eUrl = addInput(root, Config.serverUrl(this));
        addLabel(root, "Device ID");
        eDevId = addInput(root, Config.deviceId(this));
        addLabel(root, "Device Secret");
        eSecret = addInput(root, Config.deviceSecret(this));
        addLabel(root, "Target Packages (comma)");
        ePkgs = addInput(root, Config.targetPackages(this));

        Button save = new Button(this);
        save.setText("Simpan Konfigurasi");
        save.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Config.save(MainActivity.this,
                    eUrl.getText().toString().trim(),
                    eDevId.getText().toString().trim(),
                    eSecret.getText().toString().trim(),
                    ePkgs.getText().toString().trim());
                Toast.makeText(MainActivity.this, "Tersimpan", Toast.LENGTH_SHORT).show();
            }
        });
        root.addView(save);

        Button access = new Button(this);
        access.setText("Buka Setelan Notification Access");
        access.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                startActivity(new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS));
            }
        });
        root.addView(access);

        Button test = new Button(this);
        test.setText("Kirim Test Event");
        test.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Config.save(MainActivity.this,
                    eUrl.getText().toString().trim(),
                    eDevId.getText().toString().trim(),
                    eSecret.getText().toString().trim(),
                    ePkgs.getText().toString().trim());
                long amt = 1000 + (long) (Math.random() * 9000);
                long ts = System.currentTimeMillis() / 1000;
                String eid = "test_" + System.currentTimeMillis();
                String json = "{\"event_id\":\"" + eid + "\",\"source\":\"notification\",\"amount\":"
                    + amt + ",\"sender\":\"TEST\",\"raw_text\":\"Test event Rp" + amt
                    + "\",\"received_at\":" + ts + "}";
                Sender.send(MainActivity.this, json);
                Toast.makeText(MainActivity.this, "Test event Rp" + amt + " dikirim", Toast.LENGTH_SHORT).show();
            }
        });
        root.addView(test);

        addLabel(root, "1. Isi config + Simpan\n2. Buka Notification Access, aktifkan 'GatePay Catcher'\n3. Test Event buat cek koneksi\n4. Notif DANA masuk = auto tertangkap");

        setContentView(sv);
    }

    private void addTitle(LinearLayout p, String s) {
        TextView t = new TextView(this);
        t.setText(s);
        t.setTextSize(22);
        t.setTextColor(Color.BLACK);
        t.setPadding(0, 0, 0, dp(16));
        p.addView(t);
    }

    private void addLabel(LinearLayout p, String s) {
        TextView t = new TextView(this);
        t.setText(s);
        t.setTextSize(13);
        t.setTextColor(Color.DKGRAY);
        t.setPadding(0, dp(12), 0, dp(4));
        p.addView(t);
    }

    private EditText addInput(LinearLayout p, String val) {
        EditText e = new EditText(this);
        e.setText(val);
        e.setTextSize(14);
        e.setSingleLine(true);
        p.addView(e);
        return e;
    }

    private int dp(int v) {
        return (int) (v * getResources().getDisplayMetrics().density);
    }
}
