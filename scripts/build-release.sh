#!/bin/zsh

set -euo pipefail

ROOT_DIR="${0:A:h:h}"
DIST_DIR="$ROOT_DIR/dist"
WINDOWS_DIR="$DIST_DIR/LabGraph-Windows"
MAC_APP="$DIST_DIR/LabGraph.app"

rm -rf "$DIST_DIR"
mkdir -p "$WINDOWS_DIR"

cp "$ROOT_DIR/index.html" "$ROOT_DIR/styles.css" "$ROOT_DIR/app.js" \
  "$ROOT_DIR/windows_server.ps1" "$ROOT_DIR/Start LabGraph on Windows.cmd" \
  "$ROOT_DIR/README.md" "$ROOT_DIR/LICENSE" "$WINDOWS_DIR/"

(
  cd "$DIST_DIR"
  COPYFILE_DISABLE=1 /usr/bin/zip -q -r -X LabGraph-Windows.zip LabGraph-Windows
)

if [[ "$(uname -s)" != "Darwin" ]]; then
  print "Windows archive created. The macOS app can only be built on macOS."
  exit 0
fi

/usr/bin/osacompile -o "$MAC_APP" "$ROOT_DIR/mac_launcher.applescript"
/usr/bin/xcrun clang -std=c11 -Os "$ROOT_DIR/mac_server.c" -o "$MAC_APP/Contents/MacOS/labgraph-server"
mkdir -p "$MAC_APP/Contents/Resources/site"
cp "$ROOT_DIR/mac_app_launcher.sh" "$MAC_APP/Contents/Resources/launch.sh"
cp "$ROOT_DIR/index.html" "$ROOT_DIR/styles.css" "$ROOT_DIR/app.js" "$MAC_APP/Contents/Resources/site/"
chmod +x "$MAC_APP/Contents/Resources/launch.sh" "$MAC_APP/Contents/MacOS/labgraph-server"

/usr/libexec/PlistBuddy -c 'Set :CFBundleName LabGraph' "$MAC_APP/Contents/Info.plist"
/usr/libexec/PlistBuddy -c 'Add :CFBundleIdentifier string io.github.labgraph.app' "$MAC_APP/Contents/Info.plist" 2>/dev/null || \
  /usr/libexec/PlistBuddy -c 'Set :CFBundleIdentifier io.github.labgraph.app' "$MAC_APP/Contents/Info.plist"
/usr/bin/codesign --force --deep --sign - "$MAC_APP"
/usr/bin/codesign --verify --deep --strict "$MAC_APP"
(
  cd "$DIST_DIR"
  COPYFILE_DISABLE=1 /usr/bin/zip -q -r -X LabGraph-macOS.zip LabGraph.app
)

print "Release archives created in $DIST_DIR"
