import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { type Enquiry } from "@/lib/enquiries";
import { EnquiriesManager } from "@/components/admin/enquiries-manager";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  // Defense in depth alongside the layout gate.
  const { userId } = await auth();
  if (!isAdmin(userId)) return null;

  const { data, error } = await supabaseAdmin
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  const enquiries = (data ?? []) as Enquiry[];

  return (
    <div>
      <div>
        <p className="eyebrow">Customer enquiries</p>
        <h1 className="mt-3 font-serif text-4xl text-ivory sm:text-5xl">
          Enquiries
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
          Review enquiries from the website and reply by WhatsApp or email.
        </p>
      </div>

      {error ? (
        <div className="mt-8 border border-danger/40 bg-danger/10 px-5 py-4 text-sm text-danger">
          Could not load enquiries. If the database migration hasn&rsquo;t been
          run yet, run{" "}
          <span className="font-mono">0001_pricing_and_enquiries.sql</span> in
          Supabase and refresh this page.
        </div>
      ) : (
        <EnquiriesManager enquiries={enquiries} />
      )}
    </div>
  );
}
