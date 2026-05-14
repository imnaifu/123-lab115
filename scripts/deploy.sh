#!/bin/bash
set -e

COOLIFY_TOKEN="$1"
COOLIFY_URL="$2"
COOLIFY_PROJECT="$3"
COOLIFY_SERVER="$4"

B64=$(printf '%s' 'services:
  web:
    image: ghcr.io/imnaifu/123-lab115:latest
    restart: unless-stopped
    ports:
      - "80"
    labels:
      - traefik.enable=true
      - traefik.http.middlewares.gzip.compress=true
      - traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https
      - traefik.http.routers.http-0-123.entryPoints=http
      - traefik.http.routers.http-0-123.middlewares=redirect-to-https
      - traefik.http.routers.http-0-123.rule=Host(`123.lab115.com`) && PathPrefix(`/`)
      - traefik.http.routers.http-0-123.service=http-0-123
      - traefik.http.routers.https-0-123.entryPoints=https
      - traefik.http.routers.https-0-123.middlewares=gzip
      - traefik.http.routers.https-0-123.rule=Host(`123.lab115.com`) && PathPrefix(`/`)
      - traefik.http.routers.https-0-123.tls=true
      - traefik.http.routers.https-0-123.tls.certresolver=letsencrypt
      - traefik.http.services.http-0-123.loadbalancer.server.port=80' | base64 -w0)

LIST=$(curl -s -H "Authorization: Bearer $COOLIFY_TOKEN" \
  "$COOLIFY_URL/api/v1/services")

UUID=$(echo "$LIST" | python3 -c "
import sys, json
try:
    services = json.load(sys.stdin)
    for s in services:
        if s.get('name') == '123-lab115-website':
            print(s['uuid'])
            break
except: pass
")

if [ -z "$UUID" ]; then
  echo "==> Creating new service..."
  RESPONSE=$(curl -s -X POST -H "Authorization: Bearer $COOLIFY_TOKEN" \
    -H "Content-Type: application/json" \
    "$COOLIFY_URL/api/v1/services" \
    -d "{
      \"project_uuid\": \"$COOLIFY_PROJECT\",
      \"server_uuid\": \"$COOLIFY_SERVER\",
      \"environment_name\": \"production\",
      \"docker_compose_raw\": \"$B64\",
      \"name\": \"123-lab115-website\"
    }")
  echo "Response: $RESPONSE"
  UUID=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin).get('uuid',''))")
  echo "New service UUID: $UUID"
  sleep 5
else
  echo "==> Service exists, deploying: $UUID"
fi

echo "==> Deploying..."
curl -s -X POST -H "Authorization: Bearer $COOLIFY_TOKEN" \
  "$COOLIFY_URL/api/v1/deploy?uuid=$UUID"

echo ""
echo "==> Done! Check https://123.lab115.com"
