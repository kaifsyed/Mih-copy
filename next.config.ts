import type { NextConfig } from "next";

/**
 * Allowlist the Supabase Storage host for next/image.
 *
 * Product photos are served from Supabase Storage, and next/image refuses any
 * remote host that is not explicitly allowed — without this, every card that
 * renders a product image throws at runtime.
 *
 * The hostname is derived from NEXT_PUBLIC_SUPABASE_URL rather than hardcoded,
 * so the same config works across environments and nothing is committed. If the
 * variable is missing or malformed we allow nothing: an image that fails to
 * load is a far better outcome than an open image proxy.
 */
function imageConfig(): NonNullable<NextConfig["images"]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return { remotePatterns: [] };

  try {
    const { protocol, hostname } = new URL(url);
    if (protocol !== "https:") return { remotePatterns: [] };

    return {
      // Next 16 added an SSRF guard that refuses to optimize any upstream image
      // whose hostname resolves to a "local/private" IP and returns 400. On
      // networks that use DNS64/NAT64 (and split-horizon DNS generally) the
      // Supabase Storage host resolves to 64:ff9b::/96 IPv6 addresses, which the
      // guard treats as private — so every product photo silently 400s even
      // though the object is public and reachable. Re-enabling optimization for
      // such addresses is the documented remedy (see the Next 16 upgrade guide,
      // "Local IP Restriction"). The SSRF surface stays tightly bounded: the
      // remotePatterns allowlist below still restricts the optimizer to this one
      // Supabase host and the public storage path only. This does not touch any
      // Supabase Storage policy or expose any key.
      dangerouslyAllowLocalIP: true,
      remotePatterns: [
        {
          protocol: "https",
          hostname,
          pathname: "/storage/v1/object/public/**",
        },
      ],
    };
  } catch {
    return { remotePatterns: [] };
  }
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: imageConfig(),
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // The site serves only real stylesheets, scripts, images and JSON.
          // Telling the browser not to sniff a response into one of those
          // types closes MIME-confusion attacks. This cannot affect Clerk,
          // Supabase or Google OAuth: it changes how *our* responses are
          // interpreted, and Vercel already labels them correctly.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // "strict-origin-when-cross-origin" is already the default in current
          // Chrome, so this is a floor for older browsers rather than a change
          // in behaviour. Cross-origin requests (Clerk, Supabase) send the
          // origin only; same-origin requests send the full URL, so Clerk's own
          // session handling is unaffected.
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Clickjacking protection. MIH GEMS is never legitimately embedded in
          // a third-party frame, and the sign-in / Google OAuth flows navigate
          // the top-level window rather than rendering inside an iframe, so
          // denying framing is safe. Both forms are sent: `frame-ancestors` is
          // the modern control, `X-Frame-Options` the legacy fallback.
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
