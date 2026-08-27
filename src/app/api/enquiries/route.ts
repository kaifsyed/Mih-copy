import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  generateReference,
  sanitizeEnquiryInput,
  type EnquiryInput,
} from "@/lib/enquiries";

export const runtime = "nodejs";

/**
 * Public enquiry intake. The browser never talks to Supabase directly for
 * enquiries — it POSTs here, we validate, then insert with the service-role
 * client (RLS on `enquiries` blocks anon access entirely). We attach the
 * Clerk user id when the sender is signed in so /account can show it back.
 */
export async function POST(request: Request) {
  let body: (EnquiryInput & { company?: unknown }) | null = null;
  try {
    body = (await request.json()) as EnquiryInput & { company?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never see or fill `company`. If a bot did, pretend
  // it worked (so it doesn't retry) but persist nothing.
  const honeypot = typeof body.company === "string" ? body.company.trim() : "";
  if (honeypot.length > 0) {
    return NextResponse.json({ ok: true, reference: generateReference() });
  }

  const result = sanitizeEnquiryInput(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const enquiry = result.value;

  // Associate with the signed-in customer when there is one (nullable).
  let userId: string | null = null;
  try {
    const session = await auth();
    userId = session.userId ?? null;
  } catch {
    userId = null;
  }

  // Resolve a product reference for product enquiries (denormalize the name so
  // the enquiry survives the product being deleted). Never trust a client id.
  let productId: string | null = null;
  let productName: string | null = enquiry.productName;
  if (enquiry.productSlug) {
    const { data } = await supabaseAdmin
      .from("products")
      .select("id, name")
      .eq("slug", enquiry.productSlug)
      .maybeSingle();
    if (data) {
      productId = data.id as string;
      productName = (data.name as string) ?? productName;
    }
  }

  const baseRow = {
    type: enquiry.type,
    name: enquiry.name,
    email: enquiry.email,
    phone: enquiry.phone,
    subject: enquiry.subject,
    message: enquiry.message,
    details: enquiry.details,
    product_id: productId,
    product_name: productName,
    user_id: userId,
  };

  // Retry a few times in case the random reference collides with the unique
  // constraint (Postgres 23505). Practically never happens.
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const reference = generateReference();
    const { data, error } = await supabaseAdmin
      .from("enquiries")
      .insert({ ...baseRow, reference })
      .select("reference")
      .single();

    if (!error && data) {
      return NextResponse.json(
        { ok: true, reference: data.reference },
        { status: 201 },
      );
    }

    if (error && error.code !== "23505") {
      console.error("Create enquiry error:", error);
      return NextResponse.json(
        { error: "We couldn't send your enquiry. Please try again or use WhatsApp." },
        { status: 500 },
      );
    }
    // else: duplicate reference — loop and try a new one
  }

  return NextResponse.json(
    { error: "We couldn't send your enquiry. Please try again or use WhatsApp." },
    { status: 500 },
  );
}

/** Admin-only: list all enquiries, newest first. */
export async function GET() {
  const { userId } = await auth();
  if (!isAdmin(userId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Load enquiries error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
