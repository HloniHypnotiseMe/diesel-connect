#!/bin/bash
# Proper setup for DIESEL CONNECT folder - GitBash
# Path: C:/Users/VAT PRODUCTION/Desktop/C6 Group Code Base/DIESEL CONNECT

BASE="C:/Users/VAT PRODUCTION/Desktop/C6 Group Code Base/DIESEL CONNECT"
cd "$BASE"

echo "=== DIESEL CONNECT - Proper Setup ==="

# Frontend
cd frontend
if [ ! -d "node_modules" ]; then npm install; fi
cd ..

# Tools - lean 8
cd tools
[ ! -d "documenso" ] && git clone https://github.com/documenso/documenso
[ ! -d "cal.com" ] && git clone https://github.com/calcom/cal.com
[ ! -d "nocodb" ] && git clone https://github.com/nocodb/nocodb
[ ! -d "coolify" ] && git clone https://github.com/coollabsio/coolify
[ ! -d "n8n" ] && git clone https://github.com/n8n-io/n8n
[ ! -d "plausible" ] && git clone https://github.com/plausible/analytics plausible
[ ! -d "listmonk" ] && git clone https://github.com/knadh/listmonk
[ ! -d "pocketbase" ] && git clone https://github.com/pocketbase/pocketbase
[ ! -d "excalidraw" ] && git clone https://github.com/excalidraw/excalidraw
[ ! -d "dub" ] && git clone https://github.com/dubinc/dub
cd ..

# Infra .env
if [ ! -f "infra/.env" ]; then cp infra/.env.example infra/.env; echo "Edit infra/.env with passwords + SB + WhatsApp"; fi

echo ""
echo "=== DONE - Proper Structure ==="
echo "Location: $BASE"
echo "Frontend: $BASE/frontend - npm run dev"
echo "Backend: $BASE/backend/supabase/schema.sql"
echo "Tools: $BASE/tools/ - 8 lean clones"
echo "Agents: $BASE/agents/ - All products access"
echo "Infra: $BASE/infra/docker-compose.lean.yml"
echo ""
echo "Git push to HloniHypnotiseMe/diesel-connect:"
echo "cd "$BASE""
echo "git init"
echo "git add ."
echo "git commit -m 'DIESEL CONNECT - Proper structure - RemotePay 2026/012562/07 - R41.2M escrowed'"
echo "gh repo create HloniHypnotiseMe/diesel-connect --private --source=. --remote=origin --push"
