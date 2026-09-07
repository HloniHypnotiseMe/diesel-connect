-- DieselConnect Production Schema - RemotePay Fintech Services 2026/012562/07
-- Run this in Supabase SQL Editor

-- Enable UUID
create extension if not exists "uuid-ossp";

-- Buyers
create table buyers (
  id uuid primary key default uuid_generate_v4(),
  company_name text not null,
  reg_no text,
  vat_no text,
  contact_name text not null,
  phone text not null,
  email text not null unique,
  delivery_address text,
  cipc_verified boolean default false,
  kyc_status text default 'pending', -- pending, verified, rejected
  created_at timestamp default now()
);

-- Suppliers
create table suppliers (
  id uuid primary key default uuid_generate_v4(),
  company_name text not null,
  reg_no text,
  wsl_license text not null unique,
  wsl_expiry date not null,
  insurance_expiry date,
  meter_calibration_expiry date,
  contact_name text not null,
  phone text not null,
  email text not null unique,
  depot_location text, -- Alrode, Randfontein etc
  fleet_size_litres int,
  founding_slot int, -- 1-10, null for standard
  fee_percent numeric default 3.5, -- 2.0 for founding
  verified boolean default false,
  rating numeric default 5.0,
  total_deliveries int default 0,
  created_at timestamp default now()
);

-- Orders - The escrow ledger
create table orders (
  id uuid primary key default uuid_generate_v4(),
  order_no text unique not null, -- DC-2026-0001
  buyer_id uuid references buyers(id),
  supplier_id uuid references suppliers(id),
  volume_litres int not null,
  grade text not null, -- 50ppm, 500ppm
  price_per_litre numeric not null,
  total_amount numeric not null,
  platform_fee_buyer numeric not null, -- 3.5%
  platform_fee_supplier numeric not null, -- 2.0 or 3.5%
  escrow_ref text, -- SB-99821 Standard Bank
  escrow_status text default 'pending', -- pending, secured, released, refunded
  ozow_verified boolean default false,
  status text default 'quote', -- quote, escrow_secured, dispatched, delivered, released, disputed
  delivery_address text not null,
  gps_tracking_link text,
  pod_meter_start_photo text, -- storage URL
  pod_meter_end_photo text,
  pod_dip_before_photo text,
  pod_dip_after_photo text,
  pod_signature_photo text,
  pod_sample_qr text,
  sans_coa_url text,
  dual_invoice_buyer_url text,
  dual_invoice_platform_url text,
  dispute_reason text,
  created_at timestamp default now(),
  delivered_at timestamp,
  released_at timestamp
);

-- Storage buckets (create in Supabase Dashboard > Storage)
-- Create buckets: pod-photos, sans-coa, invoices - all private

-- RLS policies - enable after testing
-- alter table buyers enable row level security;
-- alter table suppliers enable row level security;
-- alter table orders enable row level security;

-- View for live escrowed total for homepage claim
create or replace view escrowed_total as
select sum(total_amount) as total_escrowed, count(*) as total_orders, count(*) filter (where status='released' and dispute_reason is null) as zero_disputes_count from orders where escrow_status in ('secured','released');

-- Function to generate order number
create or replace function generate_order_no() returns trigger as $$
begin
  NEW.order_no := 'DC-' || to_char(now(),'YYYY') || '-' || lpad(nextval('order_seq')::text, 4, '0');
  return NEW;
end;
$$ language plpgsql;

create sequence if not exists order_seq;
create trigger order_no_trigger before insert on orders for each row execute function generate_order_no();

-- Insert founding supplier slot 1 (your guy)
-- insert into suppliers (company_name, wsl_license, wsl_expiry, fee_percent, founding_slot, verified) values ('Your Launch Partner Co', 'WSL-2024-XXXX', '2026-12-31', 2.0, 1, true);
