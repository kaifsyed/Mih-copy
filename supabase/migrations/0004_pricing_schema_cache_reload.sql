-- ============================================================================
-- MIH GEMS — reconcile the products pricing columns + reload PostgREST cache
-- ============================================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- It is idempotent: safe to run more than once.
--
-- WHY THIS EXISTS
--   Creating a product from /admin/products failed with:
--       PGRST204 — Could not find the 'price' column of 'products'
--                  in the schema cache
--
--   The admin API (src/app/api/admin/products/route.ts) always sends the four
--   pricing fields — pricing_type, price, price_min, price_max — because it
--   spreads the result of validatePricing() (src/lib/pricing.ts) into the
--   insert. Those columns are defined in migration 0001, but 0001–0003 are
--   applied BY HAND in the SQL Editor (the base `products` table was created in
--   the dashboard — see 0002's header). On this database that means either:
--     (a) 0001 was never applied, so the columns are genuinely absent, or
--     (b) the columns exist but PostgREST's schema cache is stale and has not
--         picked them up (the literal "schema cache" in the error).
--
--   This migration fixes BOTH cases without touching the earlier migrations:
--   it re-asserts every pricing column (a no-op when they already exist) and
--   forces PostgREST to reload its schema cache.
--
-- This does NOT change the four-mode pricing architecture, does not modify old
-- migrations, does not touch data, and invents no prices.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. Ensure the four pricing columns exist (mirrors migration 0001)
-- ----------------------------------------------------------------------------
-- Four admin-controlled modes, mirrored by src/lib/pricing.ts:
--   enquiry     → "Enquire for Price"      (no numbers)
--   negotiable  → "Negotiable"             (no numbers)
--   fixed       → `price`
--   range       → `price_min` .. `price_max`
-- 'enquiry' is the safest default (we never publish a price we don't have).

alter table public.products
  add column if not exists pricing_type text not null default 'enquiry';

alter table public.products
  add column if not exists price      numeric(12, 2);

alter table public.products
  add column if not exists price_min  numeric(12, 2);

alter table public.products
  add column if not exists price_max  numeric(12, 2);


-- ----------------------------------------------------------------------------
-- 2. Ensure the four-mode CHECK constraint (mirrors migration 0003)
-- ----------------------------------------------------------------------------
-- Re-created defensively so a database that missed 0003 still accepts all four
-- modes. Dropping-if-exists then re-adding keeps this reproducible.

alter table public.products
  drop constraint if exists products_pricing_type_check;

alter table public.products
  add constraint products_pricing_type_check
  check (pricing_type in ('enquiry', 'negotiable', 'fixed', 'range'));

do $$
begin
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
-- 3. Reload the PostgREST schema cache
-- ----------------------------------------------------------------------------
-- This is what clears a stale "schema cache" so the newly-present columns are
-- recognised immediately, without waiting for the periodic refresh.

notify pgrst, 'reload schema';
