import { SITE_URL } from "@/lib/site";

/**
 * Site-wide WebSite JSON-LD (Schema.org). Complements the Organization block
 * in organization-jsonld.tsx. Google uses this to identify the site as a
 * distinct brand entity and to power the `site:` search box in SERPs.
 *
 * alternateName is the most common casing variant of the brand ("MIH Gems"
 * vs "MIH GEMS"). It is included because Google's query understanding treats
 * casing variants as the same entity, and providing the alias explicitly gives
 * the crawler a direct match point. It is a factual alias, not a
 * keyword-stuffing tactic.
 *
 * No searchAction is included here — it is opt-in and requires separate
 * approval.
 */
export function WebsiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MIH GEMS",
    url: SITE_URL,
    alternateName: "MIH Gems",
    description:
      "MIH GEMS is a private atelier for natural, hand-selected coloured gemstones and bespoke sterling silver jewellery — certified on request and offered by personal WhatsApp enquiry.",
    inLanguage: "en-IN",
    publisher: {
      "@type": "Organization",
      name: "MIH GEMS",
      url: SITE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}