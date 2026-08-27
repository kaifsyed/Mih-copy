/**
 * Canonical public origin for the site, used by metadata, the sitemap and
 * robots. Set NEXT_PUBLIC_SITE_URL in the deployment environment; falls back to
 * localhost for development. Any trailing slash is stripped so callers can
 * safely template `${SITE_URL}/path`.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");
