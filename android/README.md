# GatePay Catcher (Android)

NotificationListenerService yang nangkep notif DANA, parse nominal, dan kirim ke Worker (HMAC-signed) dengan antrian retry offline.

APK siap pakai ada di [`../releases/gatepay-catcher.apk`](../releases/gatepay-catcher.apk).

## Build sendiri (tanpa Gradle)

Butuh Android SDK (build-tools 33.0.2 + platform android-33) + JDK 17.

```bash
export ANDROID_HOME=/path/to/android-sdk
bash build.sh
# → paygate-catcher.apk
```

`build.sh` pakai `aapt2` → `javac` → `d8` → `apksigner` langsung (nggak butuh Gradle/AndroidX).

## Komponen

| File | Fungsi |
|------|--------|
| `NotifCatcherService.java` | Tangkap notif dari paket target, parse, kirim |
| `AmountParser.java` | Ekstrak nominal rupiah + filter "uang masuk" |
| `Sender.java` | HMAC-SHA256 sign + POST + antrian retry (file-based) |
| `Config.java` | Simpan konfigurasi (URL, device id/secret, target packages) |
| `MainActivity.java` | UI konfigurasi + tombol test |
| `BootReceiver.java` | Drain antrian saat boot |

## Konfigurasi runtime

Diisi lewat UI app (disimpan di SharedPreferences):
- **server_url** — URL Worker
- **device_id** / **device_secret** — kredensial HMAC (harus match DB Worker)
- **target_packages** — paket yang ditangkap, default `id.dana,id.danabisnis,id.dana.bisnis`

## Format event yang dikirim

`POST {server_url}/ingest/event` dengan header `X-Device-Id`, `X-Signature` (HMAC-SHA256 hex dari raw body):

```json
{
  "event_id": "ntf_<hash>",
  "source": "notification",
  "amount": 10237,
  "sender": "BUDI SANTOSO",
  "raw_text": "Anda menerima Rp10.237 dari BUDI SANTOSO",
  "received_at": 1784351000
}
```

`event_id` deterministik (hash pkg+amount+postTime+text) → dedup otomatis di server.
