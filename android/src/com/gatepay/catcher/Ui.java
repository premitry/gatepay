package com.gatepay.catcher;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.ColorFilter;
import android.graphics.Paint;
import android.graphics.PixelFormat;
import android.graphics.Rect;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;
import android.graphics.drawable.LayerDrawable;
import android.graphics.drawable.StateListDrawable;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

/**
 * Theme Y2K / retro desktop Windows 98–2000 untuk GatePay Catcher.
 * Kumpulan helper UI programmatic: bevel klasik, window bertitle-bar, tombol,
 * chip kotak, checkbox kotak, area log terminal, warning bar, taskbar.
 * Hanya presentasi — tidak menyentuh logic/permission/endpoint.
 */
public final class Ui {
    private Ui() {}

    // ── Palet (samain dgn website GatePay) ──
    public static final int CREAM   = 0xFFECEADE;
    public static final int CREAM2  = 0xFFE0DED1;
    public static final int NAVY    = 0xFF142767;
    public static final int NAVY2   = 0xFF10245F;
    public static final int ROYAL   = 0xFF26379D;
    public static final int TITLE_A = 0xFF26379D;
    public static final int TITLE_B = 0xFF3579BE;
    public static final int ORANGE  = 0xFFC26107;
    public static final int CYAN    = 0xFF30DDEB;
    public static final int GREEN   = 0xFF16A36A;
    public static final int WARN_BG = 0xFFFFF1D6;
    public static final int RED     = 0xFFC44735;
    public static final int DARK    = 0xFF555555;
    public static final int WHITE   = 0xFFFFFFFF;
    public static final int TXT     = 0xFF23262E;
    public static final int DIM     = 0xFF5B5F66;
    public static final int TERM_BG = 0xFF10204F;
    public static final int TERM_TX = 0xFFDFE6FF;
    public static final int TERM_OK = 0xFF8FE3F7;
    public static final int TERM_WIN= 0xFF7DFFB0;
    public static final int TERM_WARN=0xFFFFC46B;
    public static final int TERM_BAD =0xFFFF9B8F;

    // Font: Michroma/Share Tech Mono tidak bisa dibundel tanpa assets di build.sh,
    // jadi pakai padanan sistem — nuansa retro dari bevel & warna.
    public static final Typeface MONO = Typeface.MONOSPACE;
    public static final Typeface HEAD = Typeface.create("sans-serif-condensed", Typeface.BOLD);
    public static final Typeface BODY = Typeface.SANS_SERIF;

    public static int dp(Context c, int v) {
        return Math.round(v * c.getResources().getDisplayMetrics().density);
    }

    // ── Bevel drawable klasik (terang kiri-atas, gelap kanan-bawah) ──
    public static class Bevel extends Drawable {
        private final int fill, light, dark, t;
        private final boolean sunken;
        private final Paint p = new Paint();
        public Bevel(int fill, int light, int dark, int thickness, boolean sunken) {
            this.fill = fill; this.light = light; this.dark = dark;
            this.t = Math.max(1, thickness); this.sunken = sunken;
        }
        @Override public void draw(Canvas c) {
            Rect b = getBounds();
            p.setStyle(Paint.Style.FILL);
            p.setColor(fill); c.drawRect(b, p);
            int tl = sunken ? dark : light;
            int br = sunken ? light : dark;
            p.setColor(tl);
            c.drawRect(b.left, b.top, b.right, b.top + t, p);           // atas
            c.drawRect(b.left, b.top, b.left + t, b.bottom, p);         // kiri
            p.setColor(br);
            c.drawRect(b.left, b.bottom - t, b.right, b.bottom, p);     // bawah
            c.drawRect(b.right - t, b.top, b.right, b.bottom, p);       // kanan
        }
        @Override public void setAlpha(int a) {}
        @Override public void setColorFilter(ColorFilter cf) {}
        @Override public int getOpacity() { return PixelFormat.OPAQUE; }
    }

    public static Drawable raised(Context c, int fill) {
        return new Bevel(fill, WHITE, DARK, dp(c, 2), false);
    }
    public static Drawable sunken(Context c, int fill) {
        return new Bevel(fill, WHITE, DARK, dp(c, 2), true);
    }

    // ── Wallpaper desktop: gradient biru-toska + grid tipis ──
    public static class GridDrawable extends Drawable {
        private final Paint p = new Paint();
        private final int step;
        public GridDrawable(int stepPx) {
            this.step = Math.max(8, stepPx);
            p.setColor(0x30FFFFFF);
            p.setStrokeWidth(1f);
        }
        @Override public void draw(Canvas c) {
            Rect b = getBounds();
            for (int x = b.left; x <= b.right; x += step) c.drawLine(x, b.top, x, b.bottom, p);
            for (int y = b.top; y <= b.bottom; y += step) c.drawLine(b.left, y, b.right, y, p);
        }
        @Override public void setAlpha(int a) {}
        @Override public void setColorFilter(ColorFilter cf) {}
        @Override public int getOpacity() { return PixelFormat.TRANSLUCENT; }
    }

    public static Drawable desktop() {
        GradientDrawable g = new GradientDrawable(
            GradientDrawable.Orientation.TL_BR,
            new int[]{0xFF7FC6C9, 0xFF8EA8DC, 0xFF6F87C8});
        g.setCornerRadius(0f);
        return new LayerDrawable(new Drawable[]{ g, new GridDrawable(44) });
    }

    // ── Window bertitle-bar ──
    public static class Win {
        public LinearLayout outer;  // tambahkan ke parent
        public LinearLayout body;   // isi konten di sini
    }

    public static Win window(Context c, String title) { return window(c, title, null); }

    public static Win window(Context c, String title, View rightView) {
        LinearLayout outer = new LinearLayout(c);
        outer.setOrientation(LinearLayout.VERTICAL);
        outer.setBackground(raised(c, CREAM));

        LinearLayout tb = new LinearLayout(c);
        tb.setOrientation(LinearLayout.HORIZONTAL);
        tb.setGravity(Gravity.CENTER_VERTICAL);
        GradientDrawable g = new GradientDrawable(
            GradientDrawable.Orientation.LEFT_RIGHT, new int[]{TITLE_A, TITLE_B});
        g.setCornerRadius(0f);
        tb.setBackground(g);
        int px = dp(c, 10), py = dp(c, 7);
        tb.setPadding(px, py, dp(c, 6), py);

        TextView t = new TextView(c);
        t.setText(title);
        t.setTextColor(WHITE);
        t.setTypeface(MONO, Typeface.BOLD);
        t.setTextSize(12);
        t.setLetterSpacing(0.02f);
        t.setSingleLine(true);
        t.setLayoutParams(new LinearLayout.LayoutParams(0,
            ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        tb.addView(t);
        if (rightView != null) tb.addView(rightView);
        outer.addView(tb);

        LinearLayout body = new LinearLayout(c);
        body.setOrientation(LinearLayout.VERTICAL);
        int bp = dp(c, 14);
        body.setPadding(bp, bp, bp, bp);
        outer.addView(body);

        Win w = new Win();
        w.outer = outer;
        w.body = body;
        return w;
    }

    /** Teks aksi kecil di title bar (mis. "LIHAT SEMUA"). */
    public static TextView titleAction(Context c, String text, View.OnClickListener cl) {
        TextView a = new TextView(c);
        a.setText(text);
        a.setTextColor(0xFFCFE0FF);
        a.setTypeface(MONO, Typeface.BOLD);
        a.setTextSize(10.5f);
        a.setPadding(dp(c, 8), dp(c, 4), dp(c, 6), dp(c, 4));
        if (cl != null) a.setOnClickListener(cl);
        return a;
    }

    // ── Tombol bevel (raised → pressed sunken) ──
    public static Button btn(Context c, String text, int fill, int textColor, View.OnClickListener cl) {
        Button b = new Button(c);
        b.setAllCaps(false);
        b.setText(text);
        b.setTextColor(textColor);
        b.setTextSize(14);
        b.setTypeface(BODY, Typeface.BOLD);
        b.setStateListAnimator(null);
        StateListDrawable sld = new StateListDrawable();
        sld.addState(new int[]{android.R.attr.state_pressed}, sunken(c, shade(fill, 0.92f)));
        sld.addState(new int[]{}, raised(c, fill));
        b.setBackground(sld);
        int px = dp(c, 12), py = dp(c, 11);
        b.setPadding(px, py, px, py);
        b.setMinHeight(dp(c, 44));
        b.setMinimumHeight(dp(c, 44));
        if (cl != null) b.setOnClickListener(cl);
        return b;
    }

    public static Button primary(Context c, String text, View.OnClickListener cl) {
        return btn(c, text, ROYAL, WHITE, cl);
    }
    public static Button normal(Context c, String text, View.OnClickListener cl) {
        return btn(c, text, CREAM, TXT, cl);
    }
    public static Button success(Context c, String text, View.OnClickListener cl) {
        return btn(c, text, GREEN, WHITE, cl);
    }
    public static Button danger(Context c, String text, View.OnClickListener cl) {
        return btn(c, text, RED, WHITE, cl);
    }

    private static int shade(int color, float f) {
        int r = Math.round(Color.red(color) * f);
        int g = Math.round(Color.green(color) * f);
        int b = Math.round(Color.blue(color) * f);
        return Color.argb(Color.alpha(color), clamp(r), clamp(g), clamp(b));
    }
    private static int clamp(int v) { return v < 0 ? 0 : (v > 255 ? 255 : v); }

    // ── Label & teks ──
    public static TextView label(Context c, String text) {
        TextView t = new TextView(c);
        t.setText(text);
        t.setTextColor(DIM);
        t.setTypeface(MONO, Typeface.BOLD);
        t.setTextSize(11);
        t.setLetterSpacing(0.04f);
        return t;
    }
    public static TextView text(Context c, String s, int color, float size) {
        TextView t = new TextView(c);
        t.setText(s);
        t.setTextColor(color);
        t.setTextSize(size);
        t.setLineSpacing(dp(c, 2), 1f);
        return t;
    }
    public static TextView mono(Context c, String s, int color, float size) {
        TextView t = text(c, s, color, size);
        t.setTypeface(MONO);
        return t;
    }

    // ── Warning / status bar (dpt ditekan) ──
    public static LinearLayout statusBar(Context c, boolean granted, View.OnClickListener onTap) {
        LinearLayout row = new LinearLayout(c);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.CENTER_VERTICAL);
        int fill = granted ? 0xFFE4F6EC : WARN_BG;
        int edge = granted ? GREEN : ORANGE;
        row.setBackground(new Bevel(fill, WHITE, edge, dp(c, 2), false));
        int p = dp(c, 12);
        row.setPadding(p, p, p, p);

        TextView ic = new TextView(c);
        ic.setText(granted ? "●" : "⚠");
        ic.setTextColor(edge);
        ic.setTextSize(18);
        ic.setPadding(0, 0, dp(c, 10), 0);
        row.addView(ic);

        LinearLayout col = new LinearLayout(c);
        col.setOrientation(LinearLayout.VERTICAL);
        col.setLayoutParams(new LinearLayout.LayoutParams(0,
            ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        TextView main = new TextView(c);
        main.setTypeface(MONO, Typeface.BOLD);
        main.setTextSize(13);
        if (granted) {
            main.setText("NOTIFICATION LISTENER ACTIVE");
            main.setTextColor(0xFF0E7C5A);
        } else {
            main.setText("AKSES NOTIFIKASI BELUM AKTIF");
            main.setTextColor(0xFF8A4A00);
        }
        col.addView(main);
        TextView sub = new TextView(c);
        sub.setTypeface(MONO);
        sub.setTextSize(11);
        sub.setTextColor(granted ? 0xFF3B7A63 : 0xFF9A6A2A);
        sub.setText(granted ? "SYSTEM READY" : "SYSTEM REQUIREMENT · ketuk untuk mengaktifkan");
        col.addView(sub);
        row.addView(col);

        if (!granted && onTap != null) row.setOnClickListener(onTap);
        return row;
    }

    // ── Chip kotak (label + tombol hapus ×) ──
    public static LinearLayout chip(Context c, String label, View.OnClickListener onRemove) {
        LinearLayout chip = new LinearLayout(c);
        chip.setOrientation(LinearLayout.HORIZONTAL);
        chip.setGravity(Gravity.CENTER_VERTICAL);
        chip.setBackground(raised(c, CREAM));
        chip.setPadding(dp(c, 10), dp(c, 6), dp(c, 6), dp(c, 6));

        TextView t = new TextView(c);
        t.setText(label);
        t.setTextColor(TXT);
        t.setTypeface(BODY, Typeface.BOLD);
        t.setTextSize(12.5f);
        chip.addView(t);

        TextView x = new TextView(c);
        x.setText(" ✕");
        x.setTextColor(RED);
        x.setTypeface(BODY, Typeface.BOLD);
        x.setTextSize(13);
        x.setPadding(dp(c, 6), 0, dp(c, 2), 0);
        if (onRemove != null) x.setOnClickListener(onRemove);
        chip.addView(x);
        return chip;
    }

    // ── Checkbox kotak klasik ──
    public static LinearLayout checkbox(final Context c, String title, String sub,
                                        boolean checked, final CheckListener cl) {
        final boolean[] state = { checked };
        LinearLayout row = new LinearLayout(c);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setPadding(0, dp(c, 8), 0, dp(c, 8));

        final TextView box = new TextView(c);
        box.setGravity(Gravity.CENTER);
        box.setTypeface(MONO, Typeface.BOLD);
        box.setTextSize(13);
        box.setTextColor(NAVY);
        int s = dp(c, 22);
        box.setWidth(s); box.setHeight(s);
        box.setBackground(sunken(c, WHITE));
        box.setText(checked ? "✓" : "");
        row.addView(box);

        LinearLayout col = new LinearLayout(c);
        col.setOrientation(LinearLayout.VERTICAL);
        col.setPadding(dp(c, 10), 0, 0, 0);
        TextView tt = new TextView(c);
        tt.setText(title);
        tt.setTextColor(TXT);
        tt.setTypeface(BODY, Typeface.BOLD);
        tt.setTextSize(13.5f);
        col.addView(tt);
        if (sub != null) {
            TextView st = new TextView(c);
            st.setText(sub);
            st.setTextColor(DIM);
            st.setTextSize(11.5f);
            col.addView(st);
        }
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

    public interface CheckListener { void onChanged(boolean checked); }

    // ── Area log terminal ──
    public static TextView logArea(Context c) {
        TextView t = new TextView(c);
        t.setTypeface(MONO);
        t.setTextSize(12);
        t.setTextColor(TERM_TX);
        t.setBackground(sunken(c, TERM_BG));
        int p = dp(c, 11);
        t.setPadding(p, p, p, p);
        t.setLineSpacing(dp(c, 3), 1f);
        return t;
    }

    public static View spacer(Context c, int h) {
        View v = new View(c);
        v.setLayoutParams(new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, dp(c, h)));
        return v;
    }

    public static LinearLayout.LayoutParams weight(float w) {
        return new LinearLayout.LayoutParams(0,
            ViewGroup.LayoutParams.WRAP_CONTENT, w);
    }
    public static LinearLayout.LayoutParams mw() {
        return new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT);
    }
    public static void marginTop(View v, Context c, int t) {
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(c, t);
        v.setLayoutParams(lp);
    }
}
