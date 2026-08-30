import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";

// Role decision must run on every request, never cached.
export const dynamic = "force-dynamic";

// Transient post-auth hop — keep it out of search engines.
export const metadata: Metadata = {
  title: "Signing in…",
  robots: { index: false, follow: false },
};

/**
 * Post-sign-in landing hop. Clerk sends a freshly authenticated user here (via
 * NEXT_PUBLIC_CLERK_SIGN_IN/UP_FALLBACK_REDIRECT_URL) whenever no explicit
 * `redirect_url` was requested. It routes by role:
 *   - admin    → /admin
 *   - customer → /account
 *
 * This is a UX convenience ONLY. It is NOT the security boundary: /admin and
 * every /api/admin route still enforce isAdmin() server-side, so a customer who
 * reaches /admin by any means is still denied. The admin allowlist stays in the
 * ADMIN_USER_IDS environment variable — no user id is hardcoded here.
 */
export default async function AfterSignInPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  redirect(isAdmin(userId) ? "/admin" : "/account");
}
