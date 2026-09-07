# WhatsApp Offline Agent
# Handles YES/CONFIRM/DISPUTE replies via WhatsApp when buyer/supplier offline

Flow:
- Supplier receives WhatsApp: New RFQ DC-0847 20kL Randburg
- Replies YES -> Webhook -> n8n -> Marks order accepted -> Creates escrow SB-XXXX -> Calls standardbank-escrow generate_qr
- Buyer receives QR via WhatsApp, pays via EFT
- n8n polls SB API verify_payment -> If secured -> WhatsApp supplier "Dispatch"
- Driver uploads 6 photos via /driver PWA offline
- Buyer receives WhatsApp "Delivered - Reply CONFIRM"
- Buyer replies CONFIRM -> n8n calls release-escrow (checks 6 photos) -> Calls standardbank-escrow release -> EFT to supplier
- If DISPUTE -> Freeze escrow, notify admin
