// Supabase Edge Function: standardbank-escrow
// Deploy: supabase functions deploy standardbank-escrow
// Integrates with Standard Bank Escrow API using RemotePay credentials
// RemotePay is payment facilitation platform - onboard sub-merchants, PCI DSS, KYC compliant

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { order_id, action } = await req.json() // action: create_escrow, verify_payment, release, refund, generate_qr
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const SB_CLIENT_ID = Deno.env.get('STANDARD_BANK_CLIENT_ID') // From Developer portal - Client Application Credentials View
  const SB_CLIENT_SECRET = Deno.env.get('STANDARD_BANK_CLIENT_SECRET')
  const SB_API_URL = Deno.env.get('STANDARD_BANK_API_URL') || 'https://api.standardbank.co.za' // Update with actual escrow API endpoint

  const { data: order } = await supabase.from('orders').select('*, buyers(*), suppliers(*)').eq('id', order_id).single()
  if (!order) return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 })

  async function getSBToken() {
    // OAuth2 client credentials flow - Standard Bank
    const res = await fetch(`${SB_API_URL}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${SB_CLIENT_ID}&client_secret=${SB_CLIENT_SECRET}&scope=escrow_api`
    })
    const json = await res.json()
    return json.access_token
  }

  if (action === 'create_escrow') {
    const token = await getSBToken()
    // Create escrow transaction in Standard Bank FBO account
    const payload = {
      reference: order.order_no,
      amount: order.total_amount,
      currency: 'ZAR',
      payer: {
        name: order.buyers.company_name,
        account: 'BUYER_ACCOUNT', // Will be EFT from buyer
        email: order.buyers.email
      },
      payee: {
        name: order.suppliers.company_name,
        account: 'SUPPLIER_ACCOUNT', // Supplier bank from suppliers table
        email: order.suppliers.email
      },
      facilitator: {
        name: 'RemotePay Fintech Services (Pty) Ltd',
        reg_no: '2026/012562/07',
        fee_amount: order.platform_fee_buyer + order.platform_fee_supplier,
        fbo_account: Deno.env.get('STANDARD_BANK_FBO_ACCOUNT')
      },
      metadata: {
        order_no: order.order_no,
        volume: order.volume_litres,
        grade: order.grade,
        product: 'DieselConnect - dieselconnect.c6group.co.za'
      }
    }

    const sbRes = await fetch(`${SB_API_URL}/escrow/v1/transactions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const sbData = await sbRes.json()

    // Save escrow ref SB-XXXX to order
    await supabase.from('orders').update({ escrow_ref: sbData.escrow_reference || `SB-${order.order_no}`, escrow_status: 'pending' }).eq('id', order_id)

    return new Response(JSON.stringify({ success: true, escrow: sbData }), { status: 200 })
  }

  if (action === 'verify_payment') {
    // Check if buyer EFT received in FBO account
    const token = await getSBToken()
    const sbRes = await fetch(`${SB_API_URL}/escrow/v1/transactions/${order.escrow_ref}/status`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const sbData = await sbRes.json()
    
    if (sbData.status === 'funds_secured') {
      await supabase.from('orders').update({ escrow_status: 'secured', status: 'escrow_secured' }).eq('id', order_id)
      // Trigger WhatsApp notification
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/whatsapp-notify`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id, event: 'escrow_secured' })
      })
    }

    return new Response(JSON.stringify({ success: true, status: sbData }), { status: 200 })
  }

  if (action === 'generate_qr') {
    // Generate QR code for EFT payment - Standard Bank QR API
    const token = await getSBToken()
    const qrPayload = {
      amount: order.total_amount,
      reference: order.escrow_ref || order.order_no,
      beneficiary: 'RemotePay Fintech Services (Pty) Ltd - FBO',
      account: Deno.env.get('STANDARD_BANK_FBO_ACCOUNT'),
      description: `Diesel ${order.order_no} ${order.volume_litres}L`
    }
    const qrRes = await fetch(`${SB_API_URL}/qr/v1/generate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(qrPayload)
    })
    const qrData = await qrRes.json()
    
    // qrData.qr_image_base64 or qrData.qr_url - save to order
    await supabase.from('orders').update({ qr_code_url: qrData.qr_url }).eq('id', order_id)

    return new Response(JSON.stringify({ success: true, qr: qrData }), { status: 200 })
  }

  if (action === 'release') {
    // Called after POD verification via release-escrow function
    const token = await getSBToken()
    const releaseRes = await fetch(`${SB_API_URL}/escrow/v1/transactions/${order.escrow_ref}/release`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        amount_to_payee: order.total_amount - order.platform_fee_supplier,
        fee_to_facilitator: order.platform_fee_supplier + order.platform_fee_buyer
      })
    })
    const releaseData = await releaseRes.json()
    return new Response(JSON.stringify({ success: true, release: releaseData }), { status: 200 })
  }

  return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 })
})
