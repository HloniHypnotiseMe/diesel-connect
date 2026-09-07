#!/bin/bash
# Install lean stack on VPS - Hetzner CX32 R180/mo
apt update && apt install -y docker.io docker-compose-plugin git
systemctl enable --now docker
docker compose -f docker-compose.lean.yml up -d
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
echo "Open https://YOUR_VPS_IP:8000 for Coolify"
