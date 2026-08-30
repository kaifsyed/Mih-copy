-- ============================================================================
-- MIH GEMS — add the jewellery `subcategory` column + reload PostgREST cache
-- ============================================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- It is idempotent: safe to run more than once.
--
-- WHY THIS EXISTS
--   The catalogue now has two primary categories (Gemstones, Jewellery). A
--   Jewellery product additionally carries a sub-type — one of Rings,
--   Bracelets, Necklaces, Earrings — used by the admin form, the admin API
--   validation and the shop's secondary filter. That value needs a column.
--
-- WHAT THIS DOES
--   1. Adds `subcategory text` if it is not already present. New/existing rows
--      default to NULL, so no product data changes and nothing is invented.
--   2. Constrains the VALUE DOMAIN only: subcategory must be NULL or one of the
--      four known jewellery types. It deliberately does NOT enforce the
--      cross-column rule "Jewellery requires a subcategory / Gemstones must not
--      have one" — doing so would reject existing rows and force us to invent
--      subcategories for products created before this feature. That rule is
--      enforced at the application layer (validateCategorization in
--      src/lib/products.ts) for new writes instead.
--   3. Reloads the PostgREST schema cache so the admin API sees the column
--      immediately (same PGRST204 class of issue handled in 0004).
--
-- This does not modify earlier migrations, delete products, or change data.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. Column
-- ----------------------------------------------------------------------------

alter table public.products
  add column if not exists subcategory text;


-- ----------------------------------------------------------------------------
-- 2. Value-domain CHECK (NULL allowed; otherwise one of the four known types)
-- ----------------------------------------------------------------------------
-- Drop-then-add keeps this reproducible. Existing rows have subcategory = NULL,
-- which satisfies the constraint, so this cannot fail on current data.

alter table public.products
  drop constraint if exists products_subcategory_check;

alter table public.products
  add constraint products_subcategory_check
  check (
    subcategory is null
    or subcategory in ('Rings', 'Bracelets', 'Necklaces', 'Earrings')
  );

-- Speeds up the shop's "Jewellery → Rings" style filtering.
create index if not exists products_subcategory_idx
  on public.products (subcategory);


-- ----------------------------------------------------------------------------
-- 3. Reload the PostgREST schema cache
-- ----------------------------------------------------------------------------

notify pgrst, 'reload schema';
