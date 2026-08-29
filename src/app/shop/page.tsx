import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import ShopClient from "@/app/shop/shop-client";

export const metadata: Metadata = {
  title: "Shop Natural Gemstones",
  description:
    "Browse MIH GEMS' curated collection of natural coloured gemstones and fine jewellery. Filter by category, availability and price, then enquire on the pieces you love.",
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
