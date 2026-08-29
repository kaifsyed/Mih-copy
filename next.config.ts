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
};

export default nextConfig;
