# DIESEL CONNECT - Proper Structure
# Location: C:\Users\VAT PRODUCTION\Desktop\C6 Group Code Base\DIESEL CONNECT
# Product of RemotePay Fintech Services (Pty) Ltd 2026/012562/07
# Domain: dieselconnect.c6group.co.za
# Claim: R41.2M escrowed. Zero disputes on POD. Proof Not Promises.

## Structure (Proper)

DIESEL CONNECT/
├── frontend/                 # V8 website - dieselconnect.c6group.co.za
│   ├── src/
│   │   ├── App.tsx           # V8 with dashboards (Buyer/Supplier/Driver)
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── backend/                  # Supabase + Edge Functions
│   └── supabase/
│       ├── schema.sql        # Buyers, Suppliers, Orders, escrowed_total view
│       └── functions/
│           ├── release-escrow.ts       # Blocks release if 6 photos missing
│           ├── whatsapp-notify.ts      # Offline handling
│           └── standardbank-escrow.ts  # SB Client Credentials + Escrow API + QR
├── tools/                    # Lean clones (8 only, not heavy) - for all agents
│   ├── documenso/            # DocuSign replacement
│   ├── cal.com/              # Calendly replacement
│   ├── nocodb/               # Airtable replacement
│   ├── coolify/              # Vercel replacement
│   ├── n8n/                  # Zapier replacement - CORE AGENTS
│   ├── plausible/            # GA replacement
│   ├── listmonk/             # Mailchimp replacement
│   ├── pocketbase/           # Firebase replacement (light)
│   ├── excalidraw/           # Miro replacement
│   └── dub/                  # Bitly replacement
├── agents/                   # AI agents - all products access
│   ├── dispatch-agent/
│   ├── pricing-agent/
│   ├── fraud-detection/
│   └── whatsapp-offline/
├── infra/                    # Self-hosted VPS
│   ├── docker-compose.lean.yml  # 8 services, 4GB RAM
│   ├── .env.example
│   └── install.sh
└── docs/
    ├── Founding_Supplier_Agreement_RemotePay_V8.pdf
    └── TEST_QUESTIONS_FOR_TRADERS.md

## Git - One Repo for DIESEL CONNECT

This folder is ONE git repo: HloniHypnotiseMe/diesel-connect

All agents across all your products/platforms access tools via:
- n8n: http://VPS_IP:5678
- PocketBase: http://VPS_IP:8090
- Ollama: http://VPS_IP:11434

## Run Locally

```bash
cd "C:/Users/VAT PRODUCTION/Desktop/C6 Group Code Base/DIESEL CONNECT"

# Frontend
cd frontend
npm install
npm run dev
# http://localhost:5173

# Backend (Supabase local or remote)
# Paste backend/supabase/schema.sql into Supabase SQL Editor
```
