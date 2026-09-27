import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  ENQUIRY_STATUSES,
  SPAM_RETENTION_DAYS,
  computeSpamDeleteAt,
  type EnquiryStatus,
} from "@/lib/enquiries";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * Admin-only: update an enquiry's workflow status OR its spam lifecycle.
 *
 * Two mutually exclusive actions, distinguished by the request body:
 *   { status }  — set the workflow status (new | read | responded | archived)
 *   { spam: true }  — mark as spam; records the mark timestamp and schedules
 *                      permanent deletion SPAM_RETENTION_DAYS later.
 *   { spam: false } — restore; clears spam status and the deletion schedule so
 *                      the enquiry returns to the active list and is excluded
 *                      from the cron sweep.
 *
 * Only one action is accepted per request. The three are kept in one route
 * because they all mutate the same row and share the same auth/validate/fetch
 * shape; keeping them together avoids duplicating the authorization gate.
 */
export async function PATCH(request: Request, { params }: RouteContext) {
  const { userId } = await auth();

  if (!isAdmin(userId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: {
    status?: unknown;
    spam?: unknown;
  } | null = null;
  try {
    body = (await request.json()) as { status?: unknown; spam?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Spam and status actions are mutually exclusive.
  const spamAction = body?.spam;
  const hasSpamAction = spamAction === true || spamAction === false;
  const hasStatusAction =
    typeof body?.status === "string" && body.status.trim().length > 0;

  if (hasSpamAction && hasStatusAction) {
    return NextResponse.json(
      { error: "Send either a status or a spam action, not both." },
      { status: 400 },
    );
  }

  if (!hasSpamAction && !hasStatusAction) {
    return NextResponse.json(
      { error: "No status or spam action was provided." },
      { status: 400 },
    );
  }

  // ---- Spam actions -------------------------------------------------------
  if (hasSpamAction) {
    const restore = spamAction === false;
    const patch = restore
      ? { is_spam: false, spam_marked_at: null, spam_delete_at: null }
      : {
          is_spam: true,
          spam_marked_at: new Date().toISOString(),
          spam_delete_at: computeSpamDeleteAt(),
        };

    const { data, error } = await supabaseAdmin
      .from("enquiries")
      .update(patch)
      .eq("id", id)
      .select(
        "id, is_spam, spam_marked_at, spam_delete_at",
      )
      .single();

    if (error || !data) {
      console.error(
        restore
          ? "Restore enquiry error:"
          : "Mark enquiry as spam error:",
        error,
      );
      return NextResponse.json(
        { error: "Could not update the enquiry." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      id: data.id,
      is_spam: data.is_spam,
      spam_marked_at: data.spam_marked_at,
      spam_delete_at: data.spam_delete_at,
      retentionDay: SPAM_RETENTION_DAYS,
      action: restore ? "restored" : "marked_spam",
    });
  }

  // ---- Status action ------------------------------------------------------
  const status = String(body?.status ?? "").trim() as EnquiryStatus;
  if (!ENQUIRY_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("enquiries")
    .update({ status })
    .eq("id", id)
    .select("id, status")
    .single();

  if (error || !data) {
    console.error("Update enquiry status error:", error);
    return NextResponse.json(
      { error: "Could not update the enquiry status." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, id: data.id, status: data.status });
}
