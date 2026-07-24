package com.gatepay.catcher;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.os.Build;
import android.content.SharedPreferences;
import android.graphics.Typeface;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.StateListDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.content.pm.ResolveInfo;
import android.graphics.drawable.Drawable;
import android.provider.Settings;
import android.text.InputType;
import android.text.SpannableStringBuilder;
import android.text.Spannable;
import android.text.style.ForegroundColorSpan;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;

/** UI GatePay Catcher - tema Y2K retro desktop. 3 tab + taskbar. */
public class MainActivity extends Activity {

    private LinearLayout contentHost;
    private TextView[] tabBtns = new TextView[3];
    private TextView taskStatus;
    private int currentTab = 0;
    private Dialog wizard;
    private Dialog curDialog;
    private int histFilter = 0; // 0=semua 1=sent 2=failed
    private String histQuery = "";

    private static final String[] TAB_LABELS = { "STATUS", "RIWAYAT", "SETELAN" };

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        applyIntentConfig(getIntent());

        // Gerbang login: blokir semua sampai tersambung ke akun
        if (!isLoggedIn()) {
            setContentView(buildLoginGate());
            return;
        }

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackground(Ui.desktop());
        root.setFitsSystemWindows(true);

        ScrollView sv = new ScrollView(this);
        sv.setLayoutParams(new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f));
        contentHost = new LinearLayout(this);
        contentHost.setOrientation(LinearLayout.VERTICAL);
        int p = dp(12);
        contentHost.setPadding(p, p, p, p);
        sv.addView(contentHost);
        root.addView(sv);

        root.addView(buildTaskbar());

        setContentView(root);
        showTab(0);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (!isLoggedIn() || contentHost == null) return;
        if (wizard != null && isNlsGranted()) { wizard.dismiss(); wizard = null; }
        showTab(currentTab);
    }

    private boolean isLoggedIn() {
        return !Config.deviceId(this).trim().isEmpty()
            && !Config.deviceSecret(this).trim().isEmpty();
    }

    // ================= TASKBAR =================
    private LinearLayout buildTaskbar() {
        LinearLayout bar = new LinearLayout(this);
        bar.setOrientation(LinearLayout.VERTICAL);
        bar.setBackground(Ui.raised(this, Ui.CREAM2));

        LinearLayout tabs = new LinearLayout(this);
        tabs.setOrientation(LinearLayout.HORIZONTAL);
        int pad = dp(6);
        tabs.setPadding(pad, pad, pad, pad);
        for (int i = 0; i < 3; i++) {
            final int idx = i;
            TextView t = new TextView(this);
            t.setText(TAB_LABELS[i]);
            t.setGravity(Gravity.CENTER);
            t.setTypeface(Ui.BODY, Typeface.BOLD);
            t.setTextSize(13);
            t.setTextColor(Ui.NAVY);
            t.setPadding(dp(8), dp(10), dp(8), dp(10));
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(0,
                ViewGroup.LayoutParams.WRAP_CONTENT, 1f);
            lp.leftMargin = i == 0 ? 0 : dp(4);
            t.setLayoutParams(lp);
            t.setOnClickListener(new View.OnClickListener() {
                public void onClick(View v) { showTab(idx); }
            });
            tabBtns[i] = t;
            tabs.addView(t);
        }
        bar.addView(tabs);

        taskStatus = new TextView(this);
        taskStatus.setTypeface(Ui.MONO, Typeface.BOLD);
        taskStatus.setTextSize(11);
        taskStatus.setPadding(dp(12), dp(4), dp(12), dp(8));
        bar.addView(taskStatus);

        return bar;
    }

    private void refreshTaskbar() {
        for (int i = 0; i < 3; i++) {
            boolean active = i == currentTab;
            tabBtns[i].setBackground(active ? Ui.sunken(this, Ui.CREAM)
                                            : Ui.raised(this, Ui.CREAM2));
            tabBtns[i].setTextColor(active ? Ui.ROYAL : Ui.NAVY);
        }
        boolean on = isNlsGranted();
        String clock = new SimpleDateFormat("HH:mm", Locale.US).format(new Date());
        taskStatus.setText((on ? "* ONLINE" : "o OFFLINE") + "        " + clock);
        taskStatus.setTextColor(on ? 0xFF0E7C5A : Ui.RED);
    }

    // ================= TAB SWITCH =================
    private void showTab(int i) {
        currentTab = i;
        contentHost.removeAllViews();
        if (i == 0) buildStatus();
        else if (i == 1) buildHistory();
        else buildSettings();
        refreshTaskbar();
    }

    private TextView maintLog;

    // ================= TAB: STATUS =================
    private void buildStatus() {
        Button keluar = smallBtn("KELUAR", new View.OnClickListener() {
            public void onClick(View v) { confirmExit(); }
        });
        Ui.Win head = Ui.window(this, "GATEPAY_CATCHER.EXE", keluar);
        head.body.addView(Ui.mono(this, "NOTIFICATION PAYMENT BRIDGE", Ui.DIM, 11.5f));
        head.body.addView(Ui.mono(this, "VERSION " + appVersion(), Ui.DIM, 11.5f));
        final TextView acct = Ui.mono(this, accountLine(), Ui.NAVY, 12);
        acct.setTypeface(Ui.MONO, Typeface.BOLD);
        acct.setPadding(0, dp(4), 0, 0);
        head.body.addView(acct);
        addWin(head);

        final boolean granted = isNlsGranted();
        View bar = Ui.statusBar(this, granted, new View.OnClickListener() {
            public void onClick(View v) { openWizard(); }
        });
        addView(bar, 10);

        final LinearLayout alertHost = new LinearLayout(this);
        alertHost.setOrientation(LinearLayout.VERTICAL);
        addView(alertHost, 0);
        checkDeviceStatus(acct, alertHost);

        EventLog.Stats st = EventLog.today(this);
        Ui.Win today = Ui.window(this, "TODAY.DAT");
        today.body.addView(Ui.label(this, "PEMBAYARAN TERDETEKSI"));
        TextView big = Ui.mono(this, Integer.toString(st.count), Ui.NAVY, 34);
        big.setTypeface(Ui.MONO, Typeface.BOLD);
        big.setPadding(0, dp(2), 0, dp(6));
        today.body.addView(big);
        if (st.count > 0) {
            String block = "TOTAL    : " + rupiah(st.total) + "\n"
                         + "WEBHOOK  : " + st.sent + " SENT\n"
                         + "FAILED   : " + st.failed;
            today.body.addView(Ui.mono(this, block, Ui.TXT, 12.5f));
        }
        TextView lastTv = Ui.mono(this, "LAST SENT : "
            + (st.lastAt > 0 ? hhmmss(st.lastAt) : "BELUM ADA"), Ui.DIM, 12);
        lastTv.setPadding(0, dp(8), 0, 0);
        today.body.addView(lastTv);
        addWin(today);

        Ui.Win tgt = Ui.window(this, "TARGET_APPS.CFG");
        tgt.body.addView(Ui.text(this, "Pilih aplikasi yang notifikasinya akan dipantau.", Ui.DIM, 12.5f));
        HorizontalScrollView hs = new HorizontalScrollView(this);
        hs.setHorizontalScrollBarEnabled(false);
        Ui.marginTop(hs, this, 10);
        LinearLayout chips = new LinearLayout(this);
        chips.setOrientation(LinearLayout.HORIZONTAL);
        addChips(chips);
        hs.addView(chips);
        tgt.body.addView(hs);
        Button add = Ui.normal(this, "+ PILIH APLIKASI", new View.OnClickListener() {
            public void onClick(View v) { openPicker(); }
        });
        Ui.marginTop(add, this, 10);
        tgt.body.addView(add);
        addWin(tgt);

        Ui.Win mnt = Ui.window(this, "MAINTENANCE.EXE");
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        Button uk = Ui.primary(this, "UJI KIRIM", new View.OnClickListener() {
            public void onClick(View v) { doTestEvent(); }
        });
        uk.setLayoutParams(new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        Button us = Ui.normal(this, "UJI SERVER", new View.OnClickListener() {
            public void onClick(View v) { doPingServer(); }
        });
        LinearLayout.LayoutParams usp = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f);
        usp.leftMargin = dp(8);
        us.setLayoutParams(usp);
        row.addView(uk);
        row.addView(us);
        mnt.body.addView(row);
        Button dash = Ui.normal(this, "DASHBOARD", new View.OnClickListener() {
            public void onClick(View v) { openDashboard(); }
        });
        Ui.marginTop(dash, this, 8);
        mnt.body.addView(dash);
        maintLog = Ui.logArea(this);
        maintLog.setText("> READY");
        Ui.marginTop(maintLog, this, 10);
        mnt.body.addView(maintLog);
        addWin(mnt);

        TextView seeAll = Ui.titleAction(this, "LIHAT SEMUA", new View.OnClickListener() {
            public void onClick(View v) { showTab(1); }
        });
        Ui.Win act = Ui.window(this, "ACTIVITY.LOG", seeAll);
        TextView log = Ui.logArea(this);
        log.setText(buildActivitySpannable(granted));
        act.body.addView(log);
        addWin(act);

        Ui.Win sec = Ui.window(this, "SECURITY.TXT");
        sec.body.addView(Ui.text(this,
            "GatePay Catcher hanya membaca notifikasi dari aplikasi yang Anda pilih. "
            + "Aplikasi tidak membaca SMS, OTP, atau membuka isi aplikasi lain.",
            Ui.TXT, 12.5f));
        addWin(sec);
    }

    private CharSequence buildActivitySpannable(boolean granted) {
        List<EventLog.Ev> evs = EventLog.recent(this, 6);
        if (evs.isEmpty()) {
            SpannableStringBuilder sb = new SpannableStringBuilder();
            append(sb, "> Waiting for payment events...\n", Ui.TERM_TX);
            append(sb, granted ? "> Notification listener READY"
                               : "> Notification listener NOT READY", granted ? Ui.TERM_OK : Ui.TERM_WARN);
            return sb;
        }
        SpannableStringBuilder sb = new SpannableStringBuilder();
        for (int i = 0; i < evs.size(); i++) {
            EventLog.Ev e = evs.get(i);
            if (i > 0) sb.append("\n");
            append(sb, hhmmss(e.t) + "  " + labelFor(e.src) + "\n", Ui.TERM_TX);
            append(sb, "AMOUNT    " + rupiah(e.amt) + "\n", Ui.TERM_TX);
            if (e.sent()) append(sb, "WEBHOOK   SENT [" + e.code + "]\n", Ui.TERM_OK);
            else if (e.pending()) append(sb, "WEBHOOK   PENDING\n", Ui.TERM_WARN);
            else append(sb, "WEBHOOK   FAILED\n", Ui.TERM_BAD);
        }
        return sb;
    }

    private void append(SpannableStringBuilder sb, String s, int color) {
        int start = sb.length();
        sb.append(s);
        sb.setSpan(new ForegroundColorSpan(color), start, sb.length(), Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
    }

    // ---- target apps ----
    private String labelFor(String pkg) {
        if (pkg == null || pkg.isEmpty()) return "";
        if (pkg.equals("TEST")) return "UJI KIRIM";
        if (pkg.equals("notification")) return "NOTIFIKASI";
        try {
            android.content.pm.PackageManager pm = getPackageManager();
            return pm.getApplicationLabel(pm.getApplicationInfo(pkg, 0)).toString();
        } catch (Exception e) {
            return pkg;
        }
    }

    private List<String> targetList() {
        List<String> out = new ArrayList<>();
        for (String s : Config.targetPackages(this).split(",")) {
            String t = s.trim();
            if (!t.isEmpty() && !out.contains(t)) out.add(t);
        }
        return out;
    }

    private void saveTargets(List<String> pkgs) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < pkgs.size(); i++) { if (i > 0) sb.append(','); sb.append(pkgs.get(i)); }
        Config.save(this, Config.serverUrl(this), Config.deviceId(this),
            Config.deviceSecret(this), sb.toString());
    }

    private void addChips(LinearLayout container) {
        final List<String> pkgs = targetList();
        if (pkgs.isEmpty()) {
            container.addView(Ui.text(this, "(belum ada aplikasi)", Ui.DIM, 12.5f));
            return;
        }
        for (int i = 0; i < pkgs.size(); i++) {
            final String pkg = pkgs.get(i);
            LinearLayout chip = Ui.chip(this, labelFor(pkg), new View.OnClickListener() {
                public void onClick(View v) {
                    List<String> cur = targetList();
                    cur.remove(pkg);
                    saveTargets(cur);
                    showTab(0);
                }
            });
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            lp.rightMargin = dp(8);
            chip.setLayoutParams(lp);
            container.addView(chip);
        }
    }

    // ---- maintenance actions ----
    private void doTestEvent() {
        long amt = 1000 + (long) (Math.random() * 9000);
        long ts = System.currentTimeMillis() / 1000;
        String eid = "test_" + System.currentTimeMillis();
        String json = "{\"event_id\":\"" + eid + "\",\"source\":\"TEST\",\"amount\":"
            + amt + ",\"sender\":\"TEST\",\"raw_text\":\"Test event Rp" + amt
            + "\",\"received_at\":" + ts + "}";
        Sender.send(this, json);
        if (maintLog != null) maintLog.setText("> TEST WEBHOOK...\n> event Rp" + amt + " dikirim (cek ACTIVITY.LOG)");
    }

    private void doPingServer() {
        if (maintLog != null) maintLog.setText("> PING " + Config.serverUrl(this) + "/health ...");
        new Thread(new Runnable() {
            public void run() {
                final int code = Sender.ping(MainActivity.this);
                runOnUiThread(new Runnable() {
                    public void run() {
                        if (maintLog != null)
                            maintLog.setText("> SERVER RESPONSE: "
                                + (code > 0 ? code + (code >= 200 && code < 400 ? " OK" : "") : "GAGAL / OFFLINE"));
                    }
                });
            }
        }).start();
    }

    private void openDashboard() {
        try {
            String url = Config.serverUrl(this);
            if (url.endsWith("/")) url = url.substring(0, url.length() - 1);
            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url + "/dashboard")));
        } catch (Exception e) { toast("Tidak bisa membuka dashboard"); }
    }

    private void confirmExit() {
        new AlertDialog.Builder(this)
            .setTitle("Keluar aplikasi?")
            .setMessage("Layanan penangkap notifikasi tetap berjalan di latar belakang.")
            .setPositiveButton("KELUAR", new android.content.DialogInterface.OnClickListener() {
                public void onClick(android.content.DialogInterface d, int w) { finish(); }
            })
            .setNegativeButton("BATAL", null)
            .show();
    }

    private Button smallBtn(String text, View.OnClickListener cl) {
        Button b = new Button(this);
        b.setAllCaps(false);
        b.setText(text);
        b.setTextSize(11);
        b.setTypeface(Ui.BODY, Typeface.BOLD);
        b.setTextColor(Ui.TXT);
        b.setStateListAnimator(null);
        StateListDrawable sld = new StateListDrawable();
        sld.addState(new int[]{android.R.attr.state_pressed}, Ui.sunken(this, Ui.CREAM));
        sld.addState(new int[]{}, Ui.raised(this, Ui.CREAM));
        b.setBackground(sld);
        b.setPadding(dp(10), dp(5), dp(10), dp(5));
        b.setMinHeight(0);
        b.setMinimumHeight(0);
        if (cl != null) b.setOnClickListener(cl);
        return b;
    }

    // ---- dialog generik bertema window ----
    private Dialog showDialog(String title, View content, View[] buttons, boolean closable) {
        final Dialog d = new Dialog(this);
        curDialog = d;
        if (d.getWindow() != null) d.getWindow().setBackgroundDrawable(new ColorDrawable(0));

        ScrollView scroll = new ScrollView(this);
        LinearLayout pad = new LinearLayout(this);
        pad.setOrientation(LinearLayout.VERTICAL);
        int m = dp(14);
        pad.setPadding(m, m, m, m);
        scroll.addView(pad);

        View closeX = null;
        if (closable) {
            closeX = Ui.titleAction(this, "[x]", new View.OnClickListener() {
                public void onClick(View v) { d.dismiss(); }
            });
        }
        Ui.Win w = Ui.window(this, title, closeX);
        if (content != null) w.body.addView(content);
        if (buttons != null) {
            for (View b : buttons) {
                Ui.marginTop(b, this, 8);
                w.body.addView(b);
            }
        }
        pad.addView(w.outer);
        d.setContentView(scroll);
        d.show();
        return d;
    }

    // ================= DIALOG: WIZARD IZIN =================
    private void openWizard() {
        if (isNlsGranted()) { toast("Akses notifikasi sudah aktif"); return; }
        LinearLayout body = new LinearLayout(this);
        body.setOrientation(LinearLayout.VERTICAL);

        TextView h = Ui.text(this, "AKTIFKAN AKSES NOTIFIKASI", Ui.NAVY, 15);
        h.setTypeface(Ui.BODY, Typeface.BOLD);
        body.addView(h);
        TextView intro = Ui.text(this,
            "GatePay Catcher memerlukan izin Notification Access agar dapat membaca pembayaran masuk.",
            Ui.TXT, 13);
        Ui.marginTop(intro, this, 8);
        body.addView(intro);

        TextView note = Ui.text(this,
            "Jika muncul \"Restricted setting\" / \"Pengaturan dibatasi\":", Ui.TXT, 13);
        Ui.marginTop(note, this, 10);
        body.addView(note);
        String[] steps = {
            "1. Buka INFO APLIKASI.",
            "2. Buka menu titik-tiga di kanan atas.",
            "3. Pilih \"Izinkan setelan dibatasi\".",
            "4. Kembali ke aplikasi.",
            "5. Tekan AKSES NOTIFIKASI."
        };
        for (String s : steps) {
            TextView t = Ui.text(this, s, Ui.TXT, 13);
            Ui.marginTop(t, this, 6);
            body.addView(t);
        }
        TextView tail = Ui.text(this,
            "Catatan: letak menu dapat berbeda pada tiap merek HP.", Ui.DIM, 12);
        Ui.marginTop(tail, this, 10);
        body.addView(tail);

        View[] btns = {
            Ui.primary(this, "AKSES NOTIFIKASI", new View.OnClickListener() {
                public void onClick(View v) {
                    try { startActivity(new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)); }
                    catch (Exception e) { toast("Buka Setelan > Akses notifikasi"); }
                }
            }),
            Ui.normal(this, "INFO APLIKASI", new View.OnClickListener() {
                public void onClick(View v) {
                    try {
                        Intent it = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                            Uri.parse("package:" + getPackageName()));
                        startActivity(it);
                    } catch (Exception e) { toast("Tidak bisa membuka info aplikasi"); }
                }
            }),
            Ui.normal(this, "TUTUP", new View.OnClickListener() {
                public void onClick(View v) { if (wizard != null) wizard.dismiss(); }
            })
        };
        wizard = showDialog("NOTIFICATION_SETUP.EXE", body, btns, true);
    }

    // ================= DIALOG: PILIH APLIKASI (baca app terpasang) =================
    private void openPicker() {
        final List<String> cur = targetList();
        final android.content.pm.PackageManager pm = getPackageManager();

        // baca aplikasi yang punya launcher (yang dilihat user), dedup per paket
        final LinkedHashMap<String, String> labelOf = new LinkedHashMap<>();
        Intent q = new Intent(Intent.ACTION_MAIN);
        q.addCategory(Intent.CATEGORY_LAUNCHER);
        for (ResolveInfo ri : pm.queryIntentActivities(q, 0)) {
            String pkg = ri.activityInfo != null ? ri.activityInfo.packageName : null;
            if (pkg == null || pkg.equals(getPackageName()) || labelOf.containsKey(pkg)) continue;
            labelOf.put(pkg, ri.loadLabel(pm).toString());
        }
        final List<String> pkgs = new ArrayList<>(labelOf.keySet());
        Collections.sort(pkgs, new Comparator<String>() {
            public int compare(String a, String b) {
                return labelOf.get(a).compareToIgnoreCase(labelOf.get(b));
            }
        });
        final boolean[] sel = new boolean[pkgs.size()];
        for (int i = 0; i < pkgs.size(); i++) sel[i] = cur.contains(pkgs.get(i));

        LinearLayout body = new LinearLayout(this);
        body.setOrientation(LinearLayout.VERTICAL);
        body.addView(Ui.text(this, "Pilih aplikasi yang notifikasinya dipantau:", Ui.DIM, 12.5f));
        for (int i = 0; i < pkgs.size(); i++) {
            final int idx = i;
            final String pkg = pkgs.get(i);
            Drawable icon = null;
            try { icon = pm.getApplicationIcon(pkg); } catch (Exception ignored) {}
            LinearLayout row = appRow(labelOf.get(pkg), pkg, icon, sel[i], new Ui.CheckListener() {
                public void onChanged(boolean c) { sel[idx] = c; }
            });
            Ui.marginTop(row, this, 2);
            body.addView(row);
        }

        View[] btns = {
            Ui.primary(this, "SIMPAN", new View.OnClickListener() {
                public void onClick(View v) {
                    List<String> out = new ArrayList<>();
                    for (int i = 0; i < sel.length; i++) if (sel[i]) out.add(pkgs.get(i));
                    // pertahankan paket manual lama yang tidak muncul di daftar launcher
                    for (String p : cur) if (!pkgs.contains(p) && !out.contains(p)) out.add(p);
                    saveTargets(out);
                    if (curDialog != null) curDialog.dismiss();
                    showTab(0);
                }
            }),
            Ui.normal(this, "BATAL", new View.OnClickListener() {
                public void onClick(View v) { if (curDialog != null) curDialog.dismiss(); }
            })
        };
        showDialog("PILIH_APLIKASI.CFG", body, btns, true);
    }

    /** Baris pilih aplikasi: checkbox + ikon + nama + package. */
    private LinearLayout appRow(String label, String pkg, Drawable icon, boolean checked,
                                final Ui.CheckListener cl) {
        final boolean[] state = { checked };
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.CENTER_VERTICAL);
        row.setPadding(0, dp(7), 0, dp(7));

        final TextView box = new TextView(this);
        box.setGravity(Gravity.CENTER);
        box.setTypeface(Ui.MONO, Typeface.BOLD);
        box.setTextSize(13);
        box.setTextColor(Ui.NAVY);
        int s = dp(22);
        box.setWidth(s);
        box.setHeight(s);
        box.setBackground(Ui.sunken(this, Ui.WHITE));
        box.setText(checked ? "✓" : "");
        row.addView(box);

        if (icon != null) {
            ImageView iv = new ImageView(this);
            iv.setImageDrawable(icon);
            int is = dp(30);
            LinearLayout.LayoutParams il = new LinearLayout.LayoutParams(is, is);
            il.leftMargin = dp(10);
            iv.setLayoutParams(il);
            row.addView(iv);
        }

        LinearLayout col = new LinearLayout(this);
        col.setOrientation(LinearLayout.VERTICAL);
        LinearLayout.LayoutParams cl2 = new LinearLayout.LayoutParams(0,
            ViewGroup.LayoutParams.WRAP_CONTENT, 1f);
        cl2.leftMargin = dp(10);
        col.setLayoutParams(cl2);
        TextView tt = new TextView(this);
        tt.setText(label);
        tt.setTextColor(Ui.TXT);
        tt.setTypeface(Ui.BODY, Typeface.BOLD);
        tt.setTextSize(13.5f);
        tt.setSingleLine(true);
        col.addView(tt);
        TextView pk = new TextView(this);
        pk.setText(pkg);
        pk.setTextColor(Ui.DIM);
        pk.setTypeface(Ui.MONO);
        pk.setTextSize(10.5f);
        pk.setSingleLine(true);
        col.addView(pk);
        row.addView(col);

        row.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                state[0] = !state[0];
                box.setText(state[0] ? "✓" : "");
                if (cl != null) cl.onChanged(state[0]);
            }
        });
        return row;
    }
    // ================= TAB: RIWAYAT =================
    private void buildHistory() {
        Ui.Win w = Ui.window(this, "HISTORY.LOG");

        LinearLayout fr = new LinearLayout(this);
        fr.setOrientation(LinearLayout.HORIZONTAL);
        final String[] names = { "SEMUA", "SENT", "FAILED" };
        Button fbtn = Ui.normal(this, "FILTER: " + names[histFilter], new View.OnClickListener() {
            public void onClick(View v) { histFilter = (histFilter + 1) % 3; showTab(1); }
        });
        fbtn.setLayoutParams(new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        fr.addView(fbtn);
        w.body.addView(fr);

        final EditText search = new EditText(this);
        search.setText(histQuery);
        search.setHint("Cari nominal / aplikasi");
        search.setHintTextColor(0xFF9AA0AA);
        search.setTextColor(Ui.TXT);
        search.setTextSize(13);
        search.setSingleLine(true);
        search.setBackground(Ui.sunken(this, Ui.WHITE));
        search.setPadding(dp(10), dp(9), dp(10), dp(9));
        Ui.marginTop(search, this, 8);
        search.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            public boolean onEditorAction(TextView v, int a, android.view.KeyEvent ev) {
                histQuery = v.getText().toString().trim();
                showTab(1);
                return true;
            }
        });
        w.body.addView(search);

        List<EventLog.Ev> evs = EventLog.recent(this, 200);
        int shown = 0;
        String q = histQuery.toLowerCase(Locale.US);
        for (EventLog.Ev e : evs) {
            if (histFilter == 1 && !e.sent()) continue;
            if (histFilter == 2 && (e.sent() || e.pending())) continue;
            if (!q.isEmpty()) {
                String hay = (labelFor(e.src) + " " + rupiah(e.amt)).toLowerCase(Locale.US);
                if (!hay.contains(q)) continue;
            }
            View rowv = historyRow(e);
            Ui.marginTop(rowv, this, 8);
            w.body.addView(rowv);
            shown++;
        }
        if (shown == 0) {
            TextView empty = Ui.text(this, "(belum ada transaksi)", Ui.DIM, 12.5f);
            Ui.marginTop(empty, this, 10);
            w.body.addView(empty);
        }
        addWin(w);
    }

    /** Baris riwayat dengan detail lengkap langsung inline (tanpa popup). */
    private View historyRow(final EventLog.Ev e) {
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.VERTICAL);
        row.setBackground(Ui.raised(this, Ui.CREAM));
        row.setPadding(dp(12), dp(10), dp(12), dp(10));

        String tag = e.sent() ? "SENT" : (e.pending() ? "PENDING" : "FAILED");
        int tagColor = e.sent() ? Ui.GREEN : (e.pending() ? Ui.ORANGE : Ui.RED);

        // baris atas: waktu + sumber ........ nominal
        LinearLayout top = new LinearLayout(this);
        top.setOrientation(LinearLayout.HORIZONTAL);
        TextView left = Ui.mono(this, hhmmss(e.t) + "  " + labelFor(e.src), Ui.TXT, 13);
        left.setTypeface(Ui.MONO, Typeface.BOLD);
        left.setLayoutParams(new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        top.addView(left);
        TextView amt = Ui.mono(this, rupiah(e.amt), Ui.NAVY, 14);
        amt.setTypeface(Ui.MONO, Typeface.BOLD);
        top.addView(amt);
        row.addView(top);

        // detail inline
        LinearLayout detail = new LinearLayout(this);
        detail.setOrientation(LinearLayout.VERTICAL);
        detail.setBackground(Ui.sunken(this, 0xFFF4F2E7));
        detail.setPadding(dp(10), dp(8), dp(10), dp(8));
        Ui.marginTop(detail, this, 8);
        detail.addView(kv("Sumber", labelFor(e.src)));
        detail.addView(kv("Nominal", rupiah(e.amt)));
        TextView wh = kv("Webhook", "[" + tag + "]" + (e.sent() ? " " + e.code : ""));
        detail.addView(wh);
        detail.addView(kv("Waktu", hhmmss(e.t)));
        detail.addView(kv("Event", e.eid));
        row.addView(detail);

        Button resend = smallBtn("KIRIM ULANG", new View.OnClickListener() {
            public void onClick(View v) {
                String src = e.src == null ? "notification" : e.src;
                String json = "{\"event_id\":\"" + e.eid + "\",\"source\":\"" + src
                    + "\",\"amount\":" + e.amt + ",\"received_at\":" + e.t + "}";
                Sender.send(MainActivity.this, json);
                toast("Dikirim ulang");
            }
        });
        LinearLayout.LayoutParams rl = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        rl.topMargin = dp(8);
        resend.setLayoutParams(rl);
        row.addView(resend);
        return row;
    }

    /** Baris "key : value" mono untuk detail. */
    private TextView kv(String k, String v) {
        TextView t = new TextView(this);
        t.setTypeface(Ui.MONO);
        t.setTextSize(12);
        SpannableStringBuilder sb = new SpannableStringBuilder();
        int a = sb.length();
        sb.append(padRight(k, 8) + ": ");
        sb.setSpan(new ForegroundColorSpan(Ui.DIM), a, sb.length(), Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
        int b = sb.length();
        sb.append(v == null ? "" : v);
        sb.setSpan(new ForegroundColorSpan(Ui.TXT), b, sb.length(), Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
        t.setText(sb);
        return t;
    }

    private String padRight(String s, int n) {
        StringBuilder b = new StringBuilder(s);
        while (b.length() < n) b.append(' ');
        return b.toString();
    }

    // ================= TAB: SETELAN =================
    private void buildSettings() {
        Ui.Win n = Ui.window(this, "SETTINGS.INI  [NOTIFICATION]");
        n.body.addView(Ui.checkbox(this, "Baca notifikasi", "Memantau notifikasi aplikasi target.",
            pref("opt_read", true), new Ui.CheckListener() {
                public void onChanged(boolean c) { setPref("opt_read", c); }
            }));
        n.body.addView(Ui.checkbox(this, "Getar saat pembayaran", "Umpan balik saat transaksi terdeteksi.",
            pref("opt_vibrate", false), new Ui.CheckListener() {
                public void onChanged(boolean c) { setPref("opt_vibrate", c); }
            }));
        n.body.addView(Ui.checkbox(this, "Tampilkan status permanen", "Menjaga service tetap aktif.",
            pref("opt_persistent", true), new Ui.CheckListener() {
                public void onChanged(boolean c) { setPref("opt_persistent", c); }
            }));
        Button openN = Ui.normal(this, "BUKA AKSES NOTIFIKASI", new View.OnClickListener() {
            public void onClick(View v) {
                try { startActivity(new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)); }
                catch (Exception e) { toast("Buka Setelan > Akses notifikasi"); }
            }
        });
        Ui.marginTop(openN, this, 10);
        n.body.addView(openN);
        addWin(n);

        Ui.Win sv = Ui.window(this, "SETTINGS.INI  [SERVER]");
        sv.body.addView(Ui.label(this, "SERVER URL"));
        final EditText eUrl = settingField(Config.serverUrl(this), "https://gatepay.biz.id");
        sv.body.addView(eUrl);
        Button test = Ui.normal(this, "TEST CONNECTION", new View.OnClickListener() {
            public void onClick(View v) {
                toast("Menghubungi server...");
                new Thread(new Runnable() {
                    public void run() {
                        final int code = Sender.ping(MainActivity.this);
                        runOnUiThread(new Runnable() {
                            public void run() {
                                toast(code > 0 ? "SERVER: " + code + (code < 400 ? " OK" : "") : "GAGAL / OFFLINE");
                            }
                        });
                    }
                }).start();
            }
        });
        Ui.marginTop(test, this, 10);
        sv.body.addView(test);
        addWin(sv);

        Ui.Win ac = Ui.window(this, "SETTINGS.INI  [ACCOUNT]");
        ac.body.addView(Ui.text(this, "Terisi otomatis dari login. Ubah manual hanya bila perlu.", Ui.DIM, 12f));
        TextView lid = Ui.label(this, "DEVICE ID");
        Ui.marginTop(lid, this, 10);
        ac.body.addView(lid);
        final EditText eId = settingField(Config.deviceId(this), "copy dari dashboard");
        ac.body.addView(eId);
        TextView ls = Ui.label(this, "DEVICE SECRET");
        Ui.marginTop(ls, this, 8);
        ac.body.addView(ls);
        final EditText eSec = settingField(Config.deviceSecret(this), "copy dari dashboard");
        ac.body.addView(eSec);
        Button save = Ui.primary(this, "SIMPAN KONFIGURASI", new View.OnClickListener() {
            public void onClick(View v) {
                Config.save(MainActivity.this,
                    eUrl.getText().toString().trim(),
                    eId.getText().toString().trim(),
                    eSec.getText().toString().trim(),
                    Config.targetPackages(MainActivity.this));
                toast("Konfigurasi tersimpan");
            }
        });
        Ui.marginTop(save, this, 12);
        ac.body.addView(save);
        Button logout = Ui.danger(this, "KELUAR DARI AKUN", new View.OnClickListener() {
            public void onClick(View v) { confirmLogout(); }
        });
        Ui.marginTop(logout, this, 8);
        ac.body.addView(logout);
        addWin(ac);

        Ui.Win sys = Ui.window(this, "SETTINGS.INI  [SYSTEM]");
        sys.body.addView(Ui.checkbox(this, "Jalankan di latar belakang", "Mencegah catcher berhenti saat aplikasi ditutup.",
            pref("opt_background", true), new Ui.CheckListener() {
                public void onChanged(boolean c) { setPref("opt_background", c); }
            }));
        Button batt = Ui.normal(this, "NONAKTIFKAN OPTIMASI BATERAI", new View.OnClickListener() {
            public void onClick(View v) {
                try { startActivity(new Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS)); }
                catch (Exception e) { toast("Buka Setelan baterai secara manual"); }
            }
        });
        Ui.marginTop(batt, this, 10);
        sys.body.addView(batt);
        addWin(sys);
    }

    private EditText settingField(String val, String hint) {
        EditText e = new EditText(this);
        e.setText(val);
        e.setHint(hint);
        e.setHintTextColor(0xFF9AA0AA);
        e.setTextColor(Ui.TXT);
        e.setTextSize(14);
        e.setSingleLine(true);
        e.setBackground(Ui.sunken(this, Ui.WHITE));
        e.setPadding(dp(10), dp(10), dp(10), dp(10));
        Ui.marginTop(e, this, 4);
        return e;
    }

    // ================= GERBANG LOGIN (full-screen) =================
    private View buildLoginGate() {
        ScrollView sv = new ScrollView(this);
        sv.setBackground(Ui.desktop());
        sv.setFitsSystemWindows(true);
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setGravity(Gravity.CENTER_HORIZONTAL);
        root.setPadding(dp(24), dp(48), dp(24), dp(24));
        sv.addView(root);

        TextView mark = new TextView(this);
        mark.setText("G");
        mark.setTextColor(Ui.WHITE);
        mark.setTypeface(Ui.HEAD, Typeface.BOLD);
        mark.setTextSize(28);
        mark.setGravity(Gravity.CENTER);
        mark.setBackground(Ui.raised(this, Ui.ORANGE));
        int ms = dp(58);
        root.addView(mark, new LinearLayout.LayoutParams(ms, ms));

        TextView title = new TextView(this);
        title.setText("GatePay Catcher");
        title.setTextColor(0xFF12235C);
        title.setTypeface(Ui.HEAD, Typeface.BOLD);
        title.setTextSize(24);
        title.setPadding(0, dp(12), 0, 0);
        title.setLayoutParams(new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        root.addView(title);

        TextView badge = new TextView(this);
        badge.setText("● LIVE");
        badge.setTextColor(0xFF0E7C5A);
        badge.setTypeface(Ui.MONO, Typeface.BOLD);
        badge.setTextSize(11);
        badge.setBackground(Ui.raised(this, Ui.CREAM));
        badge.setPadding(dp(12), dp(4), dp(12), dp(4));
        LinearLayout.LayoutParams bl = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        bl.topMargin = dp(8);
        badge.setLayoutParams(bl);
        root.addView(badge);

        Ui.Win w = Ui.window(this, "LOGIN.EXE");
        w.body.addView(Ui.text(this,
            "Masuk dengan akun GatePay-mu untuk mengaktifkan catcher.", Ui.DIM, 12.5f));

        TextView l1 = Ui.label(this, "USERNAME");
        Ui.marginTop(l1, this, 12);
        w.body.addView(l1);
        final EditText user = settingField("", "username akun web");
        w.body.addView(user);

        TextView l2 = Ui.label(this, "PASSWORD");
        Ui.marginTop(l2, this, 10);
        w.body.addView(l2);
        LinearLayout prow = new LinearLayout(this);
        prow.setOrientation(LinearLayout.HORIZONTAL);
        Ui.marginTop(prow, this, 4);
        final EditText pass = new EditText(this);
        pass.setHint("password");
        pass.setHintTextColor(0xFF9AA0AA);
        pass.setTextColor(Ui.TXT);
        pass.setTextSize(14);
        pass.setSingleLine(true);
        pass.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
        pass.setBackground(Ui.sunken(this, Ui.WHITE));
        pass.setPadding(dp(10), dp(10), dp(10), dp(10));
        pass.setLayoutParams(new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        prow.addView(pass);
        final TextView eye = new TextView(this);
        eye.setText("LIHAT");
        eye.setGravity(Gravity.CENTER);
        eye.setTypeface(Ui.MONO, Typeface.BOLD);
        eye.setTextSize(11);
        eye.setTextColor(Ui.NAVY);
        eye.setBackground(Ui.raised(this, Ui.CREAM));
        eye.setPadding(dp(10), dp(10), dp(10), dp(10));
        LinearLayout.LayoutParams el = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.MATCH_PARENT);
        el.leftMargin = dp(6);
        eye.setLayoutParams(el);
        eye.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                boolean hidden = (pass.getInputType() & InputType.TYPE_TEXT_VARIATION_PASSWORD) != 0;
                pass.setInputType(InputType.TYPE_CLASS_TEXT | (hidden
                    ? InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD
                    : InputType.TYPE_TEXT_VARIATION_PASSWORD));
                eye.setText(hidden ? "SEMBUNYI" : "LIHAT");
                pass.setSelection(pass.getText().length());
            }
        });
        prow.addView(eye);
        w.body.addView(prow);

        final TextView l3 = Ui.label(this, "KODE 2FA");
        Ui.marginTop(l3, this, 10);
        l3.setVisibility(View.GONE);
        w.body.addView(l3);
        final EditText otp = settingField("", "6 digit");
        otp.setInputType(InputType.TYPE_CLASS_NUMBER);
        otp.setVisibility(View.GONE);
        w.body.addView(otp);

        final TextView msg = Ui.mono(this, "", Ui.RED, 12);
        Ui.marginTop(msg, this, 8);
        w.body.addView(msg);

        final Button masuk = Ui.primary(this, "MASUK", null);
        Ui.marginTop(masuk, this, 14);
        masuk.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                final String u = user.getText().toString().trim();
                final String p = pass.getText().toString();
                final String o = otp.getVisibility() == View.VISIBLE ? otp.getText().toString().trim() : null;
                if (u.isEmpty() || p.isEmpty()) {
                    msg.setTextColor(Ui.RED);
                    msg.setText("Username & password wajib diisi");
                    return;
                }
                masuk.setEnabled(false);
                msg.setTextColor(Ui.DIM);
                msg.setText("Menghubungkan...");
                final String su = Config.serverUrl(MainActivity.this);
                new Thread(new Runnable() {
                    public void run() {
                        final Api.Result r = Api.login(su, u, p, o);
                        runOnUiThread(new Runnable() {
                            public void run() {
                                masuk.setEnabled(true);
                                if (r.ok && r.deviceId != null && !r.deviceId.isEmpty()) {
                                    Config.save(MainActivity.this, su, r.deviceId, r.deviceSecret,
                                        Config.targetPackages(MainActivity.this));
                                    Config.prefs(MainActivity.this).edit()
                                        .putString("username", r.username == null ? "" : r.username)
                                        .putString("merchant_name", r.merchantName == null ? "" : r.merchantName)
                                        .apply();
                                    toast("Tersambung" + (r.merchantName != null && !r.merchantName.isEmpty()
                                        ? " - " + r.merchantName : ""));
                                    recreate();
                                } else if (r.needs2fa) {
                                    l3.setVisibility(View.VISIBLE);
                                    otp.setVisibility(View.VISIBLE);
                                    msg.setTextColor(Ui.ORANGE);
                                    msg.setText("Akun pakai 2FA - masukkan kode lalu MASUK lagi");
                                } else {
                                    msg.setTextColor(Ui.RED);
                                    msg.setText(r.error != null && !r.error.isEmpty()
                                        ? r.error : ("Login gagal (" + r.code + ")"));
                                }
                            }
                        });
                    }
                }).start();
            }
        });
        w.body.addView(masuk);

        Ui.marginTop(w.outer, this, 22);
        root.addView(w.outer);

        TextView foot = Ui.mono(this, "(c) GatePay Catcher", 0xFF1C2B4D, 11);
        foot.setPadding(0, dp(18), 0, 0);
        root.addView(foot);

        return sv;
    }

    // ================= DIALOG: LOGIN AKUN WEB (dipakai ulang bila perlu) =================
    private void openLogin() {
        LinearLayout body = new LinearLayout(this);
        body.setOrientation(LinearLayout.VERTICAL);
        body.addView(Ui.text(this,
            "Masuk dengan akun GatePay-mu. Device ID & Secret akan terisi otomatis.", Ui.DIM, 12.5f));

        TextView lu = Ui.label(this, "SERVER URL");
        Ui.marginTop(lu, this, 10);
        body.addView(lu);
        final EditText url = settingField(Config.serverUrl(this), "https://gatepay.biz.id");
        body.addView(url);

        TextView l1 = Ui.label(this, "USERNAME");
        Ui.marginTop(l1, this, 8);
        body.addView(l1);
        final EditText user = settingField("", "username akun web");
        body.addView(user);

        TextView l2 = Ui.label(this, "PASSWORD");
        Ui.marginTop(l2, this, 8);
        body.addView(l2);
        final EditText pass = settingField("", "password");
        pass.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
        body.addView(pass);

        final TextView l3 = Ui.label(this, "KODE 2FA");
        Ui.marginTop(l3, this, 8);
        l3.setVisibility(View.GONE);
        body.addView(l3);
        final EditText otp = settingField("", "6 digit");
        otp.setInputType(InputType.TYPE_CLASS_NUMBER);
        otp.setVisibility(View.GONE);
        body.addView(otp);

        final TextView msg = Ui.mono(this, "", Ui.RED, 12);
        Ui.marginTop(msg, this, 8);
        body.addView(msg);

        final Button masuk = Ui.primary(this, "MASUK", null);
        Ui.marginTop(masuk, this, 12);
        masuk.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                final String su = url.getText().toString().trim();
                final String u = user.getText().toString().trim();
                final String p = pass.getText().toString();
                final String o = otp.getVisibility() == View.VISIBLE ? otp.getText().toString().trim() : null;
                if (u.isEmpty() || p.isEmpty()) {
                    msg.setTextColor(Ui.RED);
                    msg.setText("Username & password wajib diisi");
                    return;
                }
                masuk.setEnabled(false);
                msg.setTextColor(Ui.DIM);
                msg.setText("Menghubungkan...");
                new Thread(new Runnable() {
                    public void run() {
                        final Api.Result r = Api.login(su, u, p, o);
                        runOnUiThread(new Runnable() {
                            public void run() {
                                masuk.setEnabled(true);
                                if (r.ok && r.deviceId != null && !r.deviceId.isEmpty()) {
                                    Config.save(MainActivity.this,
                                        su.isEmpty() ? Config.serverUrl(MainActivity.this) : su,
                                        r.deviceId, r.deviceSecret,
                                        Config.targetPackages(MainActivity.this));
                                    toast("Tersambung" + (r.merchantName != null && !r.merchantName.isEmpty()
                                        ? " - " + r.merchantName : ""));
                                    if (curDialog != null) curDialog.dismiss();
                                    showTab(0);
                                } else if (r.needs2fa) {
                                    l3.setVisibility(View.VISIBLE);
                                    otp.setVisibility(View.VISIBLE);
                                    msg.setTextColor(Ui.ORANGE);
                                    msg.setText("Akun pakai 2FA - masukkan kode lalu MASUK lagi");
                                } else {
                                    msg.setTextColor(Ui.RED);
                                    msg.setText(r.error != null && !r.error.isEmpty()
                                        ? r.error : ("Login gagal (" + r.code + ")"));
                                }
                            }
                        });
                    }
                }).start();
            }
        });
        body.addView(masuk);

        View[] btns = {
            Ui.normal(this, "TUTUP", new View.OnClickListener() {
                public void onClick(View v) { if (curDialog != null) curDialog.dismiss(); }
            })
        };
        showDialog("LOGIN.EXE", body, btns, true);
    }

    private void confirmLogout() {
        new AlertDialog.Builder(this)
            .setTitle("Keluar dari akun?")
            .setMessage("Device ID & Secret akan dihapus dari perangkat ini. Catcher berhenti mengirim sampai diisi lagi.")
            .setPositiveButton("KELUAR", new android.content.DialogInterface.OnClickListener() {
                public void onClick(android.content.DialogInterface d, int w) {
                    Config.save(MainActivity.this, Config.serverUrl(MainActivity.this), "", "",
                        Config.targetPackages(MainActivity.this));
                    toast("Akun dikeluarkan");
                    recreate();
                }
            })
            .setNegativeButton("BATAL", null)
            .show();
    }

    // ================= HELPERS =================
    private void addWin(Ui.Win w) {
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.bottomMargin = dp(10);
        w.outer.setLayoutParams(lp);
        contentHost.addView(w.outer);
    }

    private void addView(View v, int bottom) {
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.bottomMargin = dp(bottom);
        v.setLayoutParams(lp);
        contentHost.addView(v);
    }

    private boolean isNlsGranted() {
        String flat = Settings.Secure.getString(getContentResolver(), "enabled_notification_listeners");
        return flat != null && flat.contains(getPackageName());
    }

    private boolean pref(String key, boolean def) {
        return Config.prefs(this).getBoolean(key, def);
    }
    private void setPref(String key, boolean val) {
        Config.prefs(this).edit().putBoolean(key, val).apply();
    }

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

    private int dp(int v) {
        return Math.round(v * getResources().getDisplayMetrics().density);
    }

    static String rupiah(long n) {
        String s = Long.toString(Math.abs(n));
        StringBuilder sb = new StringBuilder();
        int c = 0;
        for (int i = s.length() - 1; i >= 0; i--) {
            sb.append(s.charAt(i));
            if (++c % 3 == 0 && i > 0) sb.append('.');
        }
        return "Rp" + (n < 0 ? "-" : "") + sb.reverse().toString();
    }

    private String appVersion() {
        try {
            return getPackageManager().getPackageInfo(getPackageName(), 0).versionName;
        } catch (Exception e) { return "1.0"; }
    }

    private String hhmmss(long epochSec) {
        return new SimpleDateFormat("HH:mm:ss", Locale.US).format(new Date(epochSec * 1000L));
    }

    // ── Akun aktif + status/alert dari server ──
    private String accountLine() {
        String u = Config.prefs(this).getString("username", "");
        String mn = Config.prefs(this).getString("merchant_name", "");
        if (u == null || u.isEmpty()) return "AKUN: (device manual)";
        return "AKUN: " + u.toUpperCase(Locale.US) + (mn != null && !mn.isEmpty() ? " · " + mn : "");
    }

    private void checkDeviceStatus(final TextView acct, final LinearLayout alertHost) {
        final String su = Config.serverUrl(this), did = Config.deviceId(this), sec = Config.deviceSecret(this);
        if (did.isEmpty() || sec.isEmpty()) return;
        new Thread(new Runnable() {
            public void run() {
                final Api.Status st = Api.deviceStatus(su, did, sec);
                runOnUiThread(new Runnable() {
                    public void run() {
                        if (st.username != null && !st.username.isEmpty()) {
                            Config.prefs(MainActivity.this).edit()
                                .putString("username", st.username)
                                .putString("merchant_name", st.merchantName == null ? "" : st.merchantName)
                                .apply();
                            if (acct != null) acct.setText(accountLine());
                        }
                        if (alertHost != null) {
                            alertHost.removeAllViews();
                            if (st.alerts != null && !st.alerts.isEmpty()) {
                                for (String a : st.alerts) {
                                    View b = alertBar(a);
                                    Ui.marginTop(b, MainActivity.this, 0);
                                    ((LinearLayout.LayoutParams) b.getLayoutParams()).bottomMargin = dp(8);
                                    alertHost.addView(b);
                                }
                                notifyAlert(st.alerts.get(0));
                            } else {
                                Config.prefs(MainActivity.this).edit().remove("last_alert").apply();
                            }
                        }
                    }
                });
            }
        }).start();
    }

    private View alertBar(String msg) {
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setBackground(new Ui.Bevel(Ui.WARN_BG, Ui.WHITE, Ui.ORANGE, dp(2), false));
        int p = dp(12);
        row.setPadding(p, p, p, p);
        TextView ic = new TextView(this);
        ic.setText("⚠");
        ic.setTextColor(Ui.ORANGE);
        ic.setTextSize(18);
        ic.setPadding(0, 0, dp(10), 0);
        row.addView(ic);
        TextView t = new TextView(this);
        t.setText(msg);
        t.setTextColor(0xFF8A4A00);
        t.setTextSize(12.5f);
        row.addView(t);
        return row;
    }

    private void notifyAlert(String msg) {
        try {
            String last = Config.prefs(this).getString("last_alert", "");
            if (msg.equals(last)) return; // hindari notif berulang
            Config.prefs(this).edit().putString("last_alert", msg).apply();
            NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            if (nm == null) return;
            String ch = "gatepay_alert";
            if (Build.VERSION.SDK_INT >= 26) {
                NotificationChannel c = new NotificationChannel(ch, "GatePay Alert", NotificationManager.IMPORTANCE_HIGH);
                nm.createNotificationChannel(c);
            }
            Notification.Builder b = (Build.VERSION.SDK_INT >= 26)
                ? new Notification.Builder(this, ch) : new Notification.Builder(this);
            b.setSmallIcon(android.R.drawable.stat_sys_warning)
                .setContentTitle("GatePay — Perbarui Token")
                .setContentText(msg)
                .setStyle(new Notification.BigTextStyle().bigText(msg))
                .setAutoCancel(true);
            Intent it = new Intent(this, MainActivity.class);
            int flag = PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 23 ? PendingIntent.FLAG_IMMUTABLE : 0);
            b.setContentIntent(PendingIntent.getActivity(this, 0, it, flag));
            nm.notify(1001, b.build());
        } catch (Exception e) {}
    }
}
