#!/bin/bash
# Build APK tanpa Gradle, pakai SDK build-tools langsung.
# Jalankan di VPS. Output: paygate-catcher.apk
set -e

export ANDROID_HOME=/opt/android-sdk
BT=$ANDROID_HOME/build-tools/33.0.2
ANDROID_JAR=$ANDROID_HOME/platforms/android-33/android.jar
export PATH=$PATH:$BT

cd "$(dirname "$0")"
echo "=== Clean ==="
rm -rf build gen classes *.apk *.dex
mkdir -p build gen classes

echo "=== 1. aapt2 link (manifest -> base apk + R.java) ==="
$BT/aapt2 link \
  -o build/base.apk \
  -I "$ANDROID_JAR" \
  --manifest AndroidManifest.xml \
  --min-sdk-version 24 \
  --target-sdk-version 30 \
  --java gen \
  --auto-add-overlay

echo "=== 2. javac ==="
find src gen -name "*.java" > build/sources.txt
javac -d classes -classpath "$ANDROID_JAR" \
  -source 8 -target 8 \
  -encoding UTF-8 \
  @build/sources.txt
echo "compiled $(find classes -name '*.class' | wc -l) classes"

echo "=== 3. d8 (dex) ==="
CLASSES=$(find classes -name "*.class")
$BT/d8 --lib "$ANDROID_JAR" --min-api 24 --output build/ $CLASSES
ls -la build/classes.dex

echo "=== 4. masukin classes.dex ke apk ==="
cd build
cp base.apk ../paygate-catcher-unsigned.apk
cd ..
# tambah classes.dex ke apk (via aapt2 nggak bisa, pakai zip)
cd build
zip -j ../paygate-catcher-unsigned.apk classes.dex
cd ..

echo "=== 5. zipalign ==="
$BT/zipalign -f 4 paygate-catcher-unsigned.apk paygate-catcher-aligned.apk

echo "=== 6. bikin debug keystore (kalau belum ada) ==="
KS=/root/paygate-debug.keystore
if [ ! -f "$KS" ]; then
  keytool -genkeypair -v -keystore "$KS" \
    -alias paygate -keyalg RSA -keysize 2048 -validity 10000 \
    -storepass paygate123 -keypass paygate123 \
    -dname "CN=PayGate, OU=Dev, O=PayGate, L=ID, ST=ID, C=ID"
fi

echo "=== 7. apksigner sign ==="
$BT/apksigner sign \
  --ks "$KS" \
  --ks-key-alias paygate \
  --ks-pass pass:paygate123 \
  --key-pass pass:paygate123 \
  --out paygate-catcher.apk \
  paygate-catcher-aligned.apk

echo "=== 8. verify ==="
$BT/apksigner verify --print-certs paygate-catcher.apk | head -5
ls -lh paygate-catcher.apk
echo ""
echo "BUILD OK -> paygate-catcher.apk"
