import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private, authenticated or API surfaces should not be crawled.
      disallow: [
        "/admin",
        "/account",
        "/api/",
        "/sign-in",
        "/sign-up",
        // Filter / search / sort variants of the shop listing consolidate to
        // the canonical /shop URL via metadata, so don't waste crawl budget
        // on them.
        "/shop?",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
