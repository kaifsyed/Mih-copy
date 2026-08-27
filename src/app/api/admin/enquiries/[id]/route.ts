import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ENQUIRY_STATUSES, type EnquiryStatus } from "@/lib/enquiries";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/** Admin-only: update an enquiry's workflow status. */
export async function PATCH(request: Request, { params }: RouteContext) {
  const { userId } = await auth();

  if (!isAdmin(userId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: { status?: unknown } | null = null;
  try {
    body = (await request.json()) as { status?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const status = String(body?.status ?? "").trim();
  if (!ENQUIRY_STATUSES.includes(status as EnquiryStatus)) {
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
