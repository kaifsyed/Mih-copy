-- ============================================================================
-- MIH GEMS — spam lifecycle for enquiries.
-- ============================================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- It is idempotent: safe to run more than once.
--
-- WHY THIS EXISTS
--   The existing `status` column is a workflow enum (new | read | responded |
--   archived). Spam is a different lifecycle: an admin flags a piece of spam, it
--   is hidden from the active list but retained for 30 days for auditing, then
--   permanently removed by a scheduled server-side job. None of the existing
--   statuses express that, so spam gets its own columns rather than being
--   shoehorned into the enum (which would also require widening the CHECK
--   constraint and re-labeling every status badge).
--
-- WHAT THIS DOES
--   1. `is_spam`            — boolean, NOT NULL DEFAULT false. Existing rows stay
--                             false; no enquiry is classified as spam by default.
--   2. `spam_marked_at`     — timestamptz of when an admin marked it spam.
--                             The 30-day countdown starts here, never from
--                             created_at.
--   3. `spam_delete_at`     — timestamptz = spam_marked_at + 30 days, computed
--                             at mark time so the cron sweep uses a plain range
--                             query with no arithmetic at deletion time.
--   4. An index on (is_spam, spam_delete_at) for the spam section filter and the
--      cron sweep.
--   5. PostgREST cache reload so the API sees the columns immediately.
--
-- This does NOT modify earlier migrations, does not touch existing rows, and
-- invents no spam flags. Restoring an enquiry sets is_spam = false and nulls
-- both timestamps (handled by the application layer).
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. Columns
-- ----------------------------------------------------------------------------
alter table public.enquiries
  add column if not exists is_spam boolean not null default false;

alter table public.enquiries
  add column if not exists spam_marked_at timestamptz;

alter table public.enquiries
  add column if not exists spam_delete_at timestamptz;


-- ----------------------------------------------------------------------------
-- 2. Index for the spam filter + cron sweep
-- ----------------------------------------------------------------------------
create index if not exists enquiries_spam_idx
  on public.enquiries (is_spam, spam_delete_at);


-- ----------------------------------------------------------------------------
-- 3. Reload the PostgREST schema cache
-- ----------------------------------------------------------------------------
notify pgrst, 'reload schema';
