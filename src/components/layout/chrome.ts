/**
 * Storefront chrome (header + footer) is hidden on the admin console, the
 * Clerk auth screens, and the homepage — each provides its own self-contained
 * layout. Every other storefront route relies on the shared SiteHeader /
 * SiteFooter mounted in the root layout.
 */
export function isChromeless(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname === "/" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up")
  );
}

export const PRIMARY_NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/custom-jewellery", label: "Custom Jewellery" },
  { href: "/wholesale", label: "Wholesale" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function isActivePath(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
