// Supabase Edge Function: release-escrow
// Deploy: supabase functions deploy release-escrow
// This enforces PROOF NOT PROMISES - Zero disputes on POD
// No release if missing: meter START/END, dip before/after, signature, sample QR, SANS COA

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { order_id } = await req.json()
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Fetch order
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', order_id)
    .single()

  if (error || !order) return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 })

  // CHECK 1: POD Photos - All required
  const required = [
    'pod_meter_start_photo',
    'pod_meter_end_photo',
    'pod_dip_before_photo',
    'pod_dip_after_photo',
    'pod_signature_photo',
    'pod_sample_qr'
  ]
  
  const missing = required.filter(f => !order[f])
  if (missing.length > 0) {
    return new Response(JSON.stringify({ 
      error: 'POD incomplete - Zero disputes policy',
      missing: missing,
      message: `Cannot release escrow SB-${order.escrow_ref}. Missing: ${missing.join(', ')}. Driver must upload via /driver`
    }), { status: 400 })
  }

  // CHECK 2: SANS COA must exist
  if (!order.sans_coa_url) {
    return new Response(JSON.stringify({ error: 'SANS COA required for release' }), { status: 400 })
  }

  // CHECK 3: Order must be delivered
  if (order.status !== 'delivered') {
    return new Response(JSON.stringify({ error: 'Order must be marked delivered first' }), { status: 400 })
  }

  // CHECK 4: No dispute
  if (order.dispute_reason) {
    return new Response(JSON.stringify({ error: 'Order under dispute - escrow frozen' }), { status: 400 })
  }

  // All checks passed - Release escrow
  const { error: updateError } = await supabase
    .from('orders')
    .update({ 
      escrow_status: 'released',
      status: 'released',
      released_at: new Date().toISOString()
    })
    .eq('id', order_id)

  if (updateError) return new Response(JSON.stringify({ error: updateError.message }), { status: 500 })

  // TODO: Trigger Standard Bank EFT release to supplier (via Ozow/Stitch or manual)
  // TODO: Send WhatsApp via API: Buyer "Released", Supplier "Funds on way"

  return new Response(JSON.stringify({ 
    success: true, 
    order_no: order.order_no,
    escrow_ref: order.escrow_ref,
    message: `R${order.total_amount} released to supplier. Platform fee R${order.platform_fee_supplier} to RemotePay 2026/012562/07`,
    paper_trail: {
      meter_start: order.pod_meter_start_photo,
      meter_end: order.pod_meter_end_photo,
      dip_before: order.pod_dip_before_photo,
      dip_after: order.pod_dip_after_photo,
      signature: order.pod_signature_photo,
      sample_qr: order.pod_sample_qr,
      sans_coa: order.sans_coa_url
    }
  }), { status: 200 })
})
