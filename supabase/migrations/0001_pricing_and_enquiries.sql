-- ============================================================================
-- MIH GEMS — pricing columns + enquiries backend
-- ============================================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- It is idempotent: safe to run more than once.
--
-- What it does:
--   1. Adds the three-mode pricing columns to `products`.
--   2. Creates the `enquiries` table used by the contact / custom-jewellery /
--      wholesale / product enquiry forms.
--   3. Locks `enquiries` down with Row Level Security: NO anon/authenticated
--      policies are created, so the table is unreachable from the browser.
--      All reads/writes happen server-side through the service-role key
--      (see src/lib/supabase-admin.ts), which bypasses RLS. This is why the
--      public site talks to /api/enquiries instead of Supabase directly.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. Pricing columns on products
-- ----------------------------------------------------------------------------
-- Three admin-controlled modes, mirrored by src/lib/pricing.ts:
--   fixed      → `price`                     (e.g. ₹5,500)
--   range      → `price_min` .. `price_max`  (e.g. ₹3,500 – ₹4,300)
--   negotiable → no numbers                  ("Price on Enquiry")
-- Existing rows default to 'negotiable' so nothing breaks before prices are set.

alter table public.products
  add column if not exists pricing_type text not null default 'negotiable';

alter table public.products
  add column if not exists price      numeric(12, 2);

alter table public.products
  add column if not exists price_min  numeric(12, 2);

alter table public.products
  add column if not exists price_max  numeric(12, 2);

-- Guard rails (app layer validates fully via validatePricing; these stop
-- obviously-bad data at the DB). Added defensively so re-runs don't error.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'products_pricing_type_check'
  ) then
    alter table public.products
      add constraint products_pricing_type_check
      check (pricing_type in ('fixed', 'range', 'negotiable'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'products_price_nonneg_check'
  ) then
    alter table public.products
      add constraint products_price_nonneg_check
      check (
        (price     is null or price     >= 0) and
        (price_min is null or price_min >= 0) and
        (price_max is null or price_max >= 0)
      );
  end if;
end $$;


-- ----------------------------------------------------------------------------
-- 2. Enquiries table
-- ----------------------------------------------------------------------------
create table if not exists public.enquiries (
  id            uuid primary key default gen_random_uuid(),
  reference     text not null unique,                 -- customer-facing, e.g. MG-8492-XQ
  type          text not null default 'contact',      -- contact | product | custom | wholesale
  status        text not null default 'new',          -- new | read | responded | archived

  -- Core contact fields (kept top-level so admin lists stay simple)
  name          text not null,
  email         text,
  phone         text,
  subject       text,
  message       text,

  -- Type-specific fields as { "Human Label": "Value" } — rendered as-is in admin
  details       jsonb not null default '{}'::jsonb,

  -- Optional link to a product (product enquiries). product_name is denormalized
  -- so the enquiry is still readable if the product is later deleted.
  product_id    uuid references public.products(id) on delete set null,
  product_name  text,

  -- Clerk user id when the enquiry was submitted while signed in (nullable).
  -- Lets /account show a customer their own enquiries.
  user_id       text,

  created_at    timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'enquiries_type_check'
  ) then
    alter table public.enquiries
      add constraint enquiries_type_check
      check (type in ('contact', 'product', 'custom', 'wholesale'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'enquiries_status_check'
  ) then
    alter table public.enquiries
      add constraint enquiries_status_check
      check (status in ('new', 'read', 'responded', 'archived'));
  end if;
end $$;

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_status_idx     on public.enquiries (status);
create index if not exists enquiries_user_id_idx    on public.enquiries (user_id);


-- ----------------------------------------------------------------------------
-- 3. Row Level Security — enabled, with NO public policies
-- ----------------------------------------------------------------------------
-- With RLS enabled and no policies, the anon & authenticated roles get zero
-- rows and cannot insert. Only the service-role key (server-side only) can
-- touch this table. Do NOT add an anon INSERT policy — that would let anyone
-- write directly to the table and bypass the API's validation + honeypot.

alter table public.enquiries enable row level security;
