import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { SITE_URL } from "@/lib/site";
import ShopClient from "@/app/shop/shop-client";

export const metadata: Metadata = {
  title: "Shop Natural Gemstones",
  description:
    "Browse MIH GEMS' curated collection of natural coloured gemstones and fine jewellery. Filter by category, availability and price, then enquire on the pieces you love.",
  // Filter / search / sort variants of /shop consolidate to the canonical
  // listing URL so they never compete for the same query in search.
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Shop Natural Gemstones & Jewellery — MIH GEMS",
    description:
      "Browse MIH GEMS' curated collection of natural coloured gemstones and fine jewellery, offered by personal enquiry.",
    type: "website",
    url: `${SITE_URL}/shop`,
    images: [
      {
        url: "/logo-header.png",
        width: 1821,
        height: 864,
        alt: "MIH GEMS — Gems & Jewellery",
      },
    ],
  },
};

// The catalogue is admin-managed and changes over time, so render per request
// rather than freezing it at build time.
export const dynamic = "force-dynamic";

type ShopPageProps = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { q, category } = await searchParams;
  const products = await getProducts();

  return (
    <ShopClient
      products={products}
      initialQuery={typeof q === "string" ? q : ""}
      initialCategory={typeof category === "string" ? category : "All"}
    />
  );
}
