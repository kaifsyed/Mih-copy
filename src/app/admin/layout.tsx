import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { isAdmin } from "@/lib/admin";
import { AdminShell } from "@/components/admin/admin-shell";

// Admin data is always live; never statically cached.
export const dynamic = "force-dynamic";

// Admin is private — keep it out of search engines.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Central gate + chrome for every /admin route. Unauthenticated visitors are
 * sent to sign-in; signed-in non-admins get an explicit "access denied" card
 * and the page below is never rendered (so its server queries never run).
 */
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/admin");
  }

  if (!isAdmin(userId)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-noir px-6 text-ivory">
        <div className="card-luxe w-full max-w-lg p-8">
          <p className="eyebrow">Access denied</p>
          <h1 className="mt-4 font-serif text-3xl text-ivory">
            You&rsquo;re signed in, but not as the MIH GEMS admin.
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-muted">
            The signed-in account doesn&rsquo;t match the admin account
            configured for this project.
          </p>
          <div className="mt-6 border border-gold/15 bg-noir-deep p-4">
            <p className="text-[0.62rem] uppercase tracking-[0.18em] text-muted">
              Current Clerk User ID
            </p>
            <p className="mt-2 break-all font-mono text-sm text-gold">
              {userId}
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <SignOutButton redirectUrl="/sign-in">
              <button type="button" className="btn btn-gold btn-sm">
                Sign out
              </button>
            </SignOutButton>
            <Link href="/" className="btn btn-ghost btn-sm">
              Back to website
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
