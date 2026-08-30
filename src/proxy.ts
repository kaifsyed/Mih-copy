import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Clerk session integration for every request.
 *
 * This wires up Clerk so `auth()` / `currentUser()` work in server components,
 * layouts and route handlers. It intentionally performs NO authorization here.
 *
 * Authorization lives with each protected resource, which is both the current
 * Clerk guidance and safer (middleware path-matching can diverge from how
 * Next.js actually routes a request and leave a resource reachable):
 *   - /admin/*            → src/app/admin/layout.tsx (auth() + isAdmin) and each
 *                            admin page re-checks isAdmin()
 *   - /api/admin/*        → every handler checks isAdmin() → 401
 *   - /api/enquiries GET  → isAdmin() → 401
 *   - /account            → src/app/account/page.tsx (auth() → sign-in)
 *   - /after-sign-in      → auth() → sign-in, then role redirect
 *
 * Note: Clerk's createRouteMatcher() + auth.protect() were removed here because
 * createRouteMatcher() is deprecated in @clerk/nextjs (logs a runtime warning)
 * and the resource-level checks above are the real security boundary.
 */
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
