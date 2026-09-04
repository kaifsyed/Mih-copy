import type { Product } from "@/lib/products";
import { hasNumericPrice, sortPriceValue } from "@/lib/pricing";
import { SITE_URL } from "@/lib/site";

/**
 * Product + BreadcrumbList JSON-LD for a single product page. Only includes
 * Schema.org properties that are actually backed by real product data — no
 * fabricated reviews, ratings, GTIN, MPN, SKU, or certification claims.
 *
 * Offer is emitted only when the product carries a concrete numeric price
 * (fixed or range). Enquiry-only and "Negotiable" products would otherwise
 * produce an invalid `price: 0` Offer, which Google may treat as a soft error.
 */
export function ProductJsonLd({ product }: { product: Product }) {
  const url = `${SITE_URL}/shop/${product.slug}`;
  const image = product.image_url ?? undefined;
  const description =
    product.description?.trim() ||
    `${product.name} — ${product.category.toLowerCase()} from MIH GEMS. Enquire for availability, certification and pricing.`;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description,
    url,
    image,
    brand: {
      "@type": "Brand",
      name: "MIH GEMS",
    },
  };

  if (hasNumericPrice(product)) {
    const lowPrice = sortPriceValue(product) ?? 0;
    data.offers = {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: lowPrice,
      availability:
        product.status === "Available"
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
      seller: {
        "@type": "Organization",
        name: "MIH GEMS",
      },
    };
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: `${SITE_URL}/shop`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
