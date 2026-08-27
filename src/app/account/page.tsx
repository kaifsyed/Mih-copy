import { auth, currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ENQUIRY_TYPE_LABELS, type Enquiry } from "@/lib/enquiries";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  HeartIcon,
  BagIcon,
  DiamondIcon,
  SparkleIcon,
  ArrowRightIcon,
} from "@/components/ui/icons";

export const dynamic = "force-dynamic";

// Private, per-user page — keep it out of search engines.
export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

const QUICK_LINKS = [
  {
    href: "/wishlist" as const,
    label: "Wishlist",
    hint: "Your saved gemstones",
    icon: HeartIcon,
  },
  {
    href: "/cart" as const,
    label: "Enquiry list",
    hint: "Pieces you're enquiring about",
    icon: BagIcon,
  },
  {
    href: "/shop" as const,
    label: "Shop",
    hint: "Browse the full collection",
    icon: DiamondIcon,
  },
  {
    href: "/custom-jewellery" as const,
    label: "Custom jewellery",
    hint: "Commission a bespoke piece",
    icon: SparkleIcon,
  },
];

export default async function AccountPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/account");

  const user = await currentUser();
  const displayName = user?.firstName || user?.fullName || "there";
  const email = user?.primaryEmailAddress?.emailAddress ?? null;

  // Enquiries this signed-in customer has submitted. Gracefully degrades to an
  // empty list if the enquiries table doesn't exist yet (migration not run).
  const { data } = await supabaseAdmin
    .from("enquiries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  const enquiries = (data ?? []) as Enquiry[];
  const openCount = enquiries.filter((e) => e.status !== "archived").length;

  return (
    <div className="container-luxe section-gap">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">My account</p>
          <h1 className="mt-3 font-serif text-4xl text-ivory sm:text-5xl">
            Welcome back, {displayName}
          </h1>
          {email ? <p className="mt-3 text-sm text-muted">{email}</p> : null}
        </div>
        <SignOutButton redirectUrl="/">
          <button type="button" className="btn btn-ghost btn-sm self-start">
            Sign out
          </button>
        </SignOutButton>
      </div>

      <div className="divider-gold mt-8" />

      {/* Quick links */}
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="card-luxe group flex flex-col gap-4 p-6 transition-colors hover:border-gold/40"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center border border-gold/30 text-gold">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-serif text-lg text-ivory transition-colors group-hover:text-gold">
                  {link.label}
                </h2>
                <p className="mt-1 text-xs text-muted">{link.hint}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Enquiries */}
      <section className="mt-14">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-serif text-2xl text-ivory sm:text-3xl">
            Your enquiries
          </h2>
          {openCount > 0 ? (
            <span className="text-xs uppercase tracking-[0.14em] text-muted">
              {openCount} open
            </span>
          ) : null}
        </div>
        <div className="divider-gold mt-4" />

        {enquiries.length === 0 ? (
          <div className="mt-8 border border-gold/12 px-6 py-16 text-center">
            <p className="font-serif text-xl text-ivory">No enquiries yet</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
              When you enquire about a gemstone or request a custom piece,
              you&rsquo;ll be able to track it here.
            </p>
            <Link href="/shop" className="btn btn-gold btn-sm mt-6">
              Browse the collection
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <ul className="mt-8 flex flex-col gap-4">
            {enquiries.map((enq) => (
              <li key={enq.id} className="card-luxe p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-sm text-gold">
                        {enq.reference}
                      </span>
                      <span className="text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                        {ENQUIRY_TYPE_LABELS[enq.type] ?? enq.type}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-ivory">
                      {enq.subject || enq.product_name || "General enquiry"}
                    </p>
                    <p className="mt-1 text-xs text-outline">
                      {formatDate(enq.created_at)}
                    </p>
                  </div>
                  <StatusBadge status={enq.status} variant="customer" />
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-6 text-xs leading-relaxed text-outline">
          We&rsquo;ll reply to your enquiries by WhatsApp or email. Need help
          now?{" "}
          <Link href="/contact" className="text-gold hover:underline">
            Contact us
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
