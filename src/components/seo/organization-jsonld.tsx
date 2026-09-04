import { SITE_URL, SOCIAL_LINKS } from "@/lib/site";
import { CONTACT } from "@/lib/contact";

/**
 * Site-wide Organization JSON-LD (Schema.org). Only includes properties that
 * are actually supported by the real business information in the project
 * (src/lib/site.ts, src/lib/contact.ts). Address, phone, opening hours and
 * review/award fields are deliberately omitted when not configured — fabricating
 * them would violate Google Search Central guidelines.
 */
export function OrganizationJsonLd() {
  const sameAs = SOCIAL_LINKS.map((s) => s.href);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MIH GEMS",
    url: SITE_URL,
    logo: `${SITE_URL}/logo-header.png`,
    description:
      "MIH GEMS is a third-generation family gemstone business and part of the MIH GROUP, curating natural coloured gemstones, birthstones, precious and semi-precious stones, and sterling silver jewellery.",
  };

  if (CONTACT.email) data.email = CONTACT.email;
  if (CONTACT.phone) data.telephone = CONTACT.phone;
  if (sameAs.length > 0) data.sameAs = sameAs;

  return (
    <script
      type="application/ld+json"
      // The data is built from statically-known env values + project constants.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
