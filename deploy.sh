#!/bin/bash
# Deploy trực tiếp lên VPS (không qua GitHub Actions)
set -e

VPS_USER="ubuntu"
VPS_HOST="160.191.85.127"
VPS_PASS="Tien@123"
VPS_DIR="/opt/ielts-hub"

echo "📦 Syncing files to VPS..."
sshpass -p "$VPS_PASS" rsync -az --exclude='.git' --exclude='node_modules' \
  --exclude='.env' --exclude='dist' --exclude='*.log' \
  "$(dirname "$0")/" "$VPS_USER@$VPS_HOST:$VPS_DIR/"

echo "🔨 Building & restarting containers..."
sshpass -p "$VPS_PASS" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" "
  cd $VPS_DIR
  sudo docker compose --env-file .env build --no-cache
  sudo docker compose --env-file .env up -d --force-recreate
  sleep 5
  sudo docker compose --env-file .env ps
"

echo "✅ Deploy xong! Truy cập: http://$VPS_HOST"
