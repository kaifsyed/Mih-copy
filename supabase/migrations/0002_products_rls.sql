-- ============================================================================
-- MIH GEMS — lock down `products` with Row Level Security
-- ============================================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- It is idempotent: safe to run more than once.
--
-- WHY THIS EXISTS (critical security fix)
--   The publishable/anon key is shipped to every visitor's browser — that is
--   what it is for. It is only safe because RLS decides what that key may do.
--   Until this migration ran, `public.products` had NO RLS and NO policies, so
--   the anon role kept its table-level grants: anyone could read the key out of
--   the JS bundle and INSERT, UPDATE or DELETE the entire catalogue.
--
-- WHAT THIS DOES
--   1. Adds the columns the admin API writes but which were never in a
--      migration (the base table was created by hand in the dashboard).
--   2. Enables RLS on `products`.
--   3. Creates exactly ONE policy: public SELECT. No INSERT/UPDATE/DELETE
--      policy is created, so writes are impossible with the anon key.
--   4. Revokes leftover write grants from anon/authenticated.
--
--   Writes continue to work through /api/admin/products, which authenticates
--   with Clerk, authorizes against ADMIN_USER_IDS, and then uses the
--   service-role key (see src/lib/supabase-admin.ts). The service-role key
--   bypasses RLS by design, so admin CRUD is unaffected by this migration.
--
-- AFTER RUNNING THIS
--   Storage still needs configuring by hand — see the checklist at the bottom.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. Columns the application expects
-- ----------------------------------------------------------------------------
-- `image_path` is written by the admin API (src/app/api/admin/products) so that
-- replacing or deleting a product can also clean up its Storage object. If the
-- column is missing, every admin write fails.

alter table public.products
  add column if not exists image_url  text;

alter table public.products
  add column if not exists image_path text;

-- `slug` must be unique — it is the public URL key for /shop/[slug].
-- This will fail loudly if duplicates already exist; that is intentional.
-- Resolve duplicates first, then re-run:
--   select slug, count(*) from public.products group by slug having count(*) > 1;
do $$
begin
  if not exists (
    select 1 from pg_indexes
    where schemaname = 'public' and indexname = 'products_slug_key'
  ) then
    create unique index products_slug_key on public.products (slug);
  end if;
end $$;

-- Newest-first listing is the default sort on the shop and the admin table.
create index if not exists products_created_at_idx
  on public.products (created_at desc);

create index if not exists products_category_idx
  on public.products (category);


-- ----------------------------------------------------------------------------
-- 2. Enable Row Level Security
-- ----------------------------------------------------------------------------

alter table public.products enable row level security;

-- Force RLS to apply to the table owner too, so a future dashboard query or
-- owner-privileged connection cannot silently sidestep these rules.
-- (The service-role key still bypasses RLS — that is a separate mechanism.)
alter table public.products force row level security;


-- ----------------------------------------------------------------------------
-- 3. Read-only public access
-- ----------------------------------------------------------------------------
-- The storefront reads products with the anon key via src/lib/products.ts.
-- SELECT is the ONLY thing the browser is permitted to do.

drop policy if exists "Public can read products" on public.products;

create policy "Public can read products"
  on public.products
  for select
  to anon, authenticated
  using (true);

-- Deliberately NOT created: any insert/update/delete policy. With RLS enabled
-- and no such policy, writes from anon/authenticated are denied by default.
-- Do not add one. Route admin writes through /api/admin/products instead.


-- ----------------------------------------------------------------------------
-- 4. Revoke leftover table-level write grants
-- ----------------------------------------------------------------------------
-- RLS already blocks these, but removing the grants means an accidental
-- `enable row level security` rollback cannot re-open write access.

revoke insert, update, delete, truncate on public.products from anon;
revoke insert, update, delete, truncate on public.products from authenticated;

grant select on public.products to anon, authenticated;


-- ----------------------------------------------------------------------------
-- 5. Verify
-- ----------------------------------------------------------------------------
-- Expect relrowsecurity = true and exactly one policy named
-- "Public can read products" with cmd = 'SELECT'.
--
--   select relname, relrowsecurity, relforcerowsecurity
--     from pg_class where relname = 'products';
--
--   select policyname, cmd, roles
--     from pg_policies where tablename = 'products';


-- ============================================================================
-- MANUAL STORAGE CHECKLIST (cannot be done in SQL — use the Dashboard)
-- ============================================================================
-- Bucket name in code is `Product-images` (capital P, hyphen) — match exactly.
--
--   Dashboard → Storage → Product-images → Settings:
--     • Public bucket: ON   (product photos are public; getPublicUrl is used)
--     • Allowed MIME types: image/jpeg, image/png, image/webp
--     • File size limit:    5 MB
--
--   Dashboard → Storage → Policies, on storage.objects for this bucket:
--     • Allow SELECT to anon + authenticated  (so photos load)
--     • Do NOT create INSERT / UPDATE / DELETE policies for anon or
--       authenticated. Uploads go through /api/admin/products with the
--       service-role key, which bypasses these policies.
--
-- If a policy currently grants anon INSERT/UPDATE/DELETE on this bucket,
-- delete it — that is an open file-upload endpoint.
-- ============================================================================
