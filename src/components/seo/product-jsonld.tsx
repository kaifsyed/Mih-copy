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
    `${product.name} — a natural ${product.category.toLowerCase()}${
      product.detail ? `, ${product.detail}` : ""
    } from MIH GEMS. Enquire for availability, certification and pricing.`;

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

  // Material / gemstone type — the `detail` field is the free-text gemstone
  // identity (e.g. "Natural Zambian Emerald"). Only emit it when the row
  // actually carries a value; never fabricate a gemstone type.
  if (product.detail) {
    data.material = product.detail;
  }

  // Colour — only the three values the data model supports (blue/red/green).
  // Emitted as a plain string so it pairs naturally with `material`.
  if (product.color) {
    data.color = product.color.charAt(0).toUpperCase() + product.color.slice(1);
  }

  // Category — the customer-facing classification (Gemstones / Jewellery).
  // When a sub-type is present (Rings, Bracelets, Necklaces, Earrings) it is
  // added as a second-level category so the hierarchy is preserved.
  if (product.category) {
    data.category = product.subcategory
      ? `${product.category} · ${product.subcategory}`
      : product.category;
  }

  // Carat / size — a real measurement when the row carries one. Gemstones may
  // store a carat; jewellery never does (the data model forces null), so this
  // is safe to emit conditionally.
  if (product.carat) {
    data.weight = {
      "@type": "QuantitativeValue",
      value: product.carat,
      unitCode: "CT",
      unitText: "carat",
    };
  }

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
