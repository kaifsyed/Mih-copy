import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { gemstoneGradient } from "@/lib/gemstone";
import { PriceTag } from "@/components/product/price-tag";
import { StatusChip } from "@/components/product/status-chip";
import { ProductCard } from "@/components/product/product-card";
import { ProductJsonLd } from "@/components/seo/product-jsonld";
import { ArrowRightIcon, DiamondIcon, ShieldIcon, GlobeIcon } from "@/components/ui/icons";
import { ProductActions } from "@/components/product/product-actions";
import { Accordion } from "@/components/ui/accordion";
import { ZoomableImage } from "@/components/product/zoomable-image";
import { SITE_URL } from "@/lib/site";

// Product data is admin-managed; render per request so edits show immediately.
export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

function toBullets(text: string | null | undefined): string[] {
  if (!text) return [];
  const lines = text.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  if (lines.length > 1) return lines;
  return text
    .split(/\.\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function labeliseColor(color: string | null | undefined): string | null {
  if (!color) return null;
  const map: Record<string, string> = {
    blue: "Blue",
    red: "Red",
    green: "Green",
  };
  return map[color] ?? null;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  const description =
    product.description?.trim() ||
    `${product.name} — a natural ${product.category.toLowerCase()} from MIH GEMS. Enquire for availability, certification and pricing.`;

  return {
    title: product.name,
    description,
    alternates: {
      canonical: `/shop/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description,
      type: "website",
      url: `${SITE_URL}/shop/${product.slug}`,
      images: product.image_url ? [{ url: product.image_url }] : undefined,
    },
    twitter: {
      card: product.image_url ? "summary_large_image" : "summary",
      title: product.name,
      description,
      images: product.image_url ? [product.image_url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product);

  return (
    <div className="container-luxe section-gap">
      <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.18em] text-muted">
        <Link href="/shop" className="transition-colors hover:text-gold">
          Shop
        </Link>
        <span className="mx-2 text-outline">/</span>
        <span className="text-ivory">{product.name}</span>
      </nav>

      <ProductJsonLd product={product} />

      <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Image */}
        <div className="relative px-4 sm:px-0">
          {product.image_url ? (
            <ZoomableImage
              src={product.image_url}
              alt={product.name}
              priority
            />
          ) : (
            <div className="relative aspect-square overflow-hidden border border-outline/20 max-w-[90vw] mx-auto sm:max-w-full">
              <div
                className="flex h-full w-full items-center justify-center"
                style={{ backgroundImage: gemstoneGradient(product.color) }}
              >
                <span className="font-serif text-4xl tracking-[0.2em] text-ivory/70">
                  MIH GEMS
                </span>
              </div>
            </div>
          )}
          <div className="absolute left-4 top-4">
            <StatusChip status={product.status} />
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <span className="eyebrow">
            {product.subcategory
              ? `${product.category} · ${product.subcategory}`
              : product.category}
          </span>
          <h1 className="mt-4 font-serif text-3xl leading-tight text-ivory sm:text-4xl lg:text-5xl">
            {product.name}
          </h1>

          <div className="mt-6">
            <PriceTag product={product} size="lg" />
          </div>

          <div className="mt-10">
            <ProductActions product={product} />
          </div>

          {/* Description / Product Details Accordion */}
          <Accordion title="Description / Product Details" className="mt-10">
            <div className="space-y-6">
              {/* Product Details */}
              <div>
                <h4 className="text-xs uppercase tracking-[0.18em] text-muted mb-3">
                  Product Details
                </h4>
                <ul className="grid gap-2 text-sm text-ivory/80 sm:grid-cols-2">
                  {product.detail ? (
                    <li>
                      <span className="text-muted">Gemstone:</span> {product.detail}
                    </li>
                  ) : null}
                  {product.category ? (
                    <li>
                      <span className="text-muted">Type:</span> {product.category}
                    </li>
                  ) : null}
                  {product.subcategory ? (
                    <li>
                      <span className="text-muted">Jewellery Type:</span>{" "}
                      {product.subcategory}
                    </li>
                  ) : null}
                  {labeliseColor(product.color) ? (
                    <li>
                      <span className="text-muted">Colour:</span>{" "}
                      {labeliseColor(product.color)}
                    </li>
                  ) : null}
                  {product.carat ? (
                    <li>
                      <span className="text-muted">Carat / Size:</span> {product.carat}
                    </li>
                  ) : null}
                </ul>
              </div>

              {/* Description */}
              {toBullets(product.description).length > 0 ? (
                <div className="border-t border-outline/12 pt-6">
                  <h4 className="text-xs uppercase tracking-[0.18em] text-muted mb-3">
                    Description
                  </h4>
                  <ul className="max-w-xl list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted sm:text-base">
                    {toBullets(product.description).map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </Accordion>

          <div className="mt-10 grid gap-4 border-t border-outline/12 pt-8 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center gap-2">
              <DiamondIcon className="h-5 w-5 text-gold" />
              <p className="text-[0.62rem] uppercase tracking-[0.2em] text-muted">
                Quality
              </p>
              <p className="text-sm text-ivory/80">Hand-selected</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <ShieldIcon className="h-5 w-5 text-gold" />
              <p className="text-[0.62rem] uppercase tracking-[0.2em] text-muted">
                Certification
              </p>
              <p className="text-sm text-ivory/80">On request</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <GlobeIcon className="h-5 w-5 text-gold" />
              <p className="text-[0.62rem] uppercase tracking-[0.2em] text-muted">
                Shipping
              </p>
              <p className="text-sm text-ivory/80">Worldwide</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 ? (
        <section className="section-gap border-t border-outline/12 pt-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-2xl text-ivory lg:text-3xl">
              You may also like
            </h2>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-gold"
            >
              View all
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
