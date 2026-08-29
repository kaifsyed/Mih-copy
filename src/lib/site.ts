/**
 * Canonical public origin for the site, used by metadata, the sitemap and
 * robots. Set NEXT_PUBLIC_SITE_URL in the deployment environment; falls back to
 * localhost for development. Any trailing slash is stripped so callers can
 * safely template `${SITE_URL}/path`.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

/**
 * Official MIH GEMS social profiles. These are public brand destinations (not
 * secrets and not fabricated) supplied by the business, so they are safe to
 * ship as constants. No tracking parameters are appended.
 */
export const SOCIAL_LINKS = [
  {
    key: "instagram",
    label: "MIH GEMS on Instagram (@mih_gems_)",
    handle: "@mih_gems_",
    href: "https://www.instagram.com/mih_gems_/",
  },
  {
    key: "facebook",
    label: "MIH GEMS on Facebook",
    handle: "MIH GEMS",
    href: "https://www.facebook.com/people/MIHgems/61575802950126/",
  },
] as const;
