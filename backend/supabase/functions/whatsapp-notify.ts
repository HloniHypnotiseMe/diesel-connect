// Supabase Edge Function: whatsapp-notify
// Deploy: supabase functions deploy whatsapp-notify
// Purpose: Business continues even when buyer/supplier/driver offline
// Uses WhatsApp Business API to notify when dashboard not checked

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { order_id, event } = await req.json() // event: quote, escrow_secured, dispatched, delivered, released, disputed
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: order } = await supabase
    .from('orders')
    .select('*, buyers(*), suppliers(*)')
    .eq('id', order_id)
    .single()

  if (!order) return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 })

  const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_TOKEN')
  const WHATSAPP_PHONE_ID = Deno.env.get('WHATSAPP_PHONE_ID')

  async function sendWhatsApp(to: string, message: string) {
    // Replace with your WhatsApp Business API provider: Meta Cloud API, Twilio, Clickatell, 360Dialog
    const url = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to, // format: 27XXXXXXXXX (SA number without 0)
        type: 'text',
        text: { body: message }
      })
    })
    return await res.json()
  }

  let messages = []

  // Event-based messages - works offline
  if (event === 'quote') {
    // Notify suppliers about new RFQ even if offline
    const msg = `🚛 DieselConnect: New RFQ ${order.order_no} - ${order.volume_litres}L ${order.grade} to ${order.delivery_address}. Funds will be escrowed. Reply YES to accept or view at dieselconnect.c6group.co.za/app`
    // Send to all verified suppliers in area - loop in real implementation
    messages.push({ to: order.suppliers.phone, body: msg })
  }

  if (event === 'escrow_secured') {
    // Critical: Supplier offline but funds secured - tell him to dispatch
    const supplierMsg = `✅ FUNDS SECURED ${order.escrow_ref} - Order ${order.order_no} - R${order.total_amount} in Standard Bank FBO (RemotePay 2026/012562/07). Ozow verified. Please dispatch. GPS link: ${order.gps_tracking_link || 'Will be generated'} - View: dieselconnect.c6group.co.za/app`
    const buyerMsg = `✅ DieselConnect: Your funds R${order.total_amount} secured in Standard Bank Escrow ${order.escrow_ref}. Supplier ${order.suppliers.company_name} has been notified to dispatch. Track at dieselconnect.c6group.co.za/app`
    messages.push({ to: order.suppliers.phone, body: supplierMsg })
    messages.push({ to: order.buyers.phone, body: buyerMsg })
  }

  if (event === 'dispatched') {
    const buyerMsg = `🚚 DISPATCHED Order ${order.order_no} - ${order.suppliers.company_name} on the way. Bowser: ${order.volume_litres}L. Track live: ${order.gps_tracking_link} - Driver will upload POD photos via /driver (works offline)`
    messages.push({ to: order.buyers.phone, body: buyerMsg })
  }

  if (event === 'delivered') {
    // Buyer offline but delivered - need signature
    const buyerMsg = `📦 DELIVERED Order ${order.order_no} - Please confirm POD: Check meter photos, dip readings, SANS COA, sample QR at dieselconnect.c6group.co.za/app - Reply CONFIRM to release escrow or DISPUTE if issue`
    messages.push({ to: order.buyers.phone, body: buyerMsg })
  }

  if (event === 'released') {
    const supplierMsg = `💰 RELEASED Order ${order.order_no} - R${order.total_amount - order.platform_fee_supplier} transferred to your account (Fee R${order.platform_fee_supplier} to RemotePay). Thank you.`
    const buyerMsg = `✅ COMPLETE Order ${order.order_no} - Escrow released. Invoices available at dieselconnect.c6group.co.za/app - R${order.total_amount} total paper trail secured.`
    messages.push({ to: order.suppliers.phone, body: supplierMsg })
    messages.push({ to: order.buyers.phone, body: buyerMsg })
  }

  // Send all messages
  const results = []
  for (const m of messages) {
    try {
      // Clean SA number: 0821234567 -> 27821234567
      let to = m.to.replace(/\s/g, '').replace(/^0/, '27')
      const res = await sendWhatsApp(to, m.body)
      results.push({ to, success: true, res })
    } catch (e) {
      results.push({ to: m.to, success: false, error: e.message })
    }
  }

  return new Response(JSON.stringify({ success: true, event, results }), { status: 200 })
})
