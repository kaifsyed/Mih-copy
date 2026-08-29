-- ============================================================================
-- MIH GEMS — add the fourth pricing mode: 'enquiry'
-- ============================================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- It is idempotent: safe to run more than once.
--
-- Background:
--   Migration 0001 introduced three pricing modes (fixed / range / negotiable)
--   and a CHECK constraint that rejects anything else. The product now supports
--   four distinct modes, mirrored by src/lib/pricing.ts:
--     enquiry     → "Enquire for Price"      (no numbers)
--     negotiable  → "Negotiable"             (no numbers)
--     fixed       → `price`
--     range       → `price_min` .. `price_max`
--
--   Without this migration, inserting/updating a product with
--   pricing_type = 'enquiry' fails the old constraint.
--
-- What it does:
--   1. Makes 'enquiry' the new default (the most conservative mode — we never
--      publish a price we don't have).
--   2. Widens the CHECK constraint to allow all four modes.
--
-- IMPORTANT: existing 'negotiable' rows are left untouched. They are a
-- legitimate, distinct mode ("Negotiable") and must NOT be backfilled to
-- 'enquiry'.
-- ============================================================================

alter table public.products
  alter column pricing_type set default 'enquiry';

alter table public.products
  drop constraint if exists products_pricing_type_check;

alter table public.products
  add constraint products_pricing_type_check
  check (pricing_type in ('enquiry', 'negotiable', 'fixed', 'range'));
