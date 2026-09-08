-- DIESEL CONNECT - RemotePay 2026/012562/07 - R41.2M escrow structure
-- Run in Supabase SQL Editor

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_no text unique not null,
  escrow_ref text unique, -- SB-XXXX

  -- Buyer/Supplier
  buyer_id uuid,
  supplier_id uuid,
  volume_litres integer not null,
  grade text default 'Diesel 50ppm',
  total_amount numeric not null,
  platform_fee_buyer numeric default 0,
  platform_fee_supplier numeric default 0,

  -- Status flow: quoted -> escrow_pending -> escrow_secured -> dispatched -> delivered -> released / frozen
  status text default 'quoted',
  escrow_status text default 'pending', -- pending, secured, released, frozen

  -- 6 POD PHOTOS - REQUIRED FOR RELEASE
  pod_meter_start_photo text,
  pod_meter_end_photo text,
  pod_dip_before_photo text,
  pod_dip_after_photo text,
  pod_signature_photo text,
  pod_sample_qr text,

  -- Compliance
  sans_coa_url text,
  dispute_reason text,

  -- Timestamps
  created_at timestamptz default now(),
  delivered_at timestamptz,
  released_at timestamptz
);

-- Index for escrow lookup
create index if not exists idx_orders_escrow_ref on orders(escrow_ref);
create index if not exists idx_orders_status on orders(status);
