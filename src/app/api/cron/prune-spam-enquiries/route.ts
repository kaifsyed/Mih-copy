import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Scheduled server-side deletion of spam enquiries whose retention period has
 * expired.
 *
 * AUTHENTICATION — Vercel Cron's documented mechanism
 * ---------------------------------------------------
 * Vercel Cron invokes this endpoint with `Authorization: Bearer <CRON_SECRET>`.
 * We compare the incoming bearer token against the CRON_SECRET environment
 * variable. This is the mechanism Vercel documents and sends automatically; no
 * custom header is required. CRON_SECRET is never exposed to the browser — it
 * is only ever read server-side, and the token is never echoed in responses or
 * logs.
 *
 * If CRON_SECRET is not configured, the endpoint refuses to run (fail-closed).
 * This is deliberate: a missing secret means the job is not ready, not that the
 * job should silently do nothing.
 *
 * IDEMPOTENCY
 * -----------
 * The sweep deletes only rows where is_spam = true AND spam_delete_at IS NOT
 * NULL AND spam_delete_at <= now(). Re-running the job is therefore safe: rows
 * already deleted do not exist, and rows whose timer has not yet fired are
 * left alone. The query is batched so a large backlog cannot OOM the function.
 *
 * PII
 * ---
 * No customer data is logged. The response and console output contain only
 * counts, timestamps, and a correlation id — never names, emails, phones, or
 * messages.
 */

const CRON_SECRET = process.env.CRON_SECRET;
const BATCH_SIZE = 1000;

export async function GET(request: Request) {
  // Fail closed: refuse to run unless a secret is configured.
  if (!CRON_SECRET) {
    return NextResponse.json(
      {
        error: "Cron not configured.",
        detail: "CRON_SECRET is not set in the environment.",
      },
      { status: 503 },
    );
  }

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token || token !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = new Date().toISOString();
  const correlationId = startedAt.replace(/[-:.]/g, "").slice(0, 14);

  // PostgREST/Supabase queries are capped client-side, but the actual row
  // limit is enforced server-side by the batch loop below. We delete in
  // bounded chunks so a large backlog cannot exhaust memory or connections.
  let totalDeleted = 0;
  let batches = 0;

while (true) {
    // Select only the ids of rows that are spam AND whose retention period has
    // expired. The server-side delete then targets exactly those ids.
    const { data: rows, error: selectError } = await supabaseAdmin
      .from("enquiries")
      .select("id")
      .eq("is_spam", true)
      .not("spam_delete_at", "is", null)
      .lte("spam_delete_at", new Date().toISOString())
      .limit(BATCH_SIZE);

    if (selectError) {
      console.error(
        `[cron prune-spam-enquiries ${correlationId}] select batch ${batches + 1} failed`,
        selectError,
      );
      return NextResponse.json(
        {
          error: "Deletion sweep failed during selection.",
          correlationId,
          deleted: totalDeleted,
          batches,
        },
        { status: 500 },
      );
    }

    if (!rows || rows.length === 0) {
      break;
    }

    const ids = rows.map((row) => row.id);

    const { count, error: deleteError } = await supabaseAdmin
      .from("enquiries")
      .delete({ count: "exact" })
      .in("id", ids);

    if (deleteError) {
      console.error(
        `[cron prune-spam-enquiries ${correlationId}] delete batch ${batches + 1} failed`,
        deleteError,
      );
      return NextResponse.json(
        {
          error: "Deletion sweep failed during deletion.",
          correlationId,
          deleted: totalDeleted,
          batches,
        },
        { status: 500 },
      );
    }

    // Verify the delete actually removed the expected rows. A mismatch means
    // the row set changed underneath us (e.g. restored between select and
    // delete); we only credit what was confirmed deleted and stop to avoid an
    // infinite loop on a row that refuses to be removed.
    const deleted = count ?? ids.length;
    totalDeleted += deleted;
    batches += 1;

    if (deleted < ids.length) {
      console.warn(
        `[cron prune-spam-enquiries ${correlationId}] batch ${batches} requested ${ids.length} deletions but confirmed ${deleted}; stopping to avoid a retry loop`,
      );
      break;
    }

    // Fewer rows than the batch size means we have drained the eligible set.
    if (rows.length < BATCH_SIZE) {
      break;
    }
  }

  console.log(
    `[cron prune-spam-enquiries ${correlationId}] deleted ${totalDeleted} spam enquiries in ${batches} batch(es) started=${startedAt} finished=${new Date().toISOString()}`,
  );

  return NextResponse.json({
    ok: true,
    deleted: totalDeleted,
    batches,
    correlationId,
    startedAt,
    finishedAt: new Date().toISOString(),
  });
}
