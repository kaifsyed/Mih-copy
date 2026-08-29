import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Routes that require a signed-in Clerk session, enforced at the edge before
 * any page or route handler runs.
 *
 * This is the OUTER gate only — it proves "someone is signed in". It does not
 * prove "this person is the admin". Admin authorization stays where it can be
 * trusted: `isAdmin()` inside src/app/admin/layout.tsx and inside every
 * /api/admin route handler. Both layers are required.
 */
const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/admin(.*)",
  "/account(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    // Redirects browsers to sign-in; returns an error for API requests.
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
