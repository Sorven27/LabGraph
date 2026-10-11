#!/bin/zsh

set -e

SITE_DIR="$1"
SERVER_BIN="$2"
PORT=8765

is_labgraph_running() {
  /usr/bin/curl -fsS "http://localhost:$1/__labgraph/status" 2>/dev/null | /usr/bin/grep -q '"app":"LabGraph"'
}

for candidate in {8765..8790}; do
  if is_labgraph_running "$candidate"; then
    /usr/bin/open "http://localhost:$candidate/"
    exit 0
  fi
done

while /usr/sbin/lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; do
  PORT=$((PORT + 1))
done

TOKEN="$(/usr/bin/uuidgen | /usr/bin/tr -d '-')"
/usr/bin/nohup "$SERVER_BIN" "$PORT" "$SITE_DIR" "$TOKEN" >"/tmp/labgraph-server-$PORT.log" 2>&1 &

for _ in {1..30}; do
  if is_labgraph_running "$PORT"; then
    /usr/bin/open "http://localhost:$PORT/"
    exit 0
  fi
  /bin/sleep 0.1
done

/usr/bin/open -a Safari "$SITE_DIR/index.html"
