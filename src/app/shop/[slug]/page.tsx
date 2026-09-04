import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { gemstoneGradient } from "@/lib/gemstone";
import { PriceTag } from "@/components/product/price-tag";
import { StatusChip } from "@/components/product/status-chip";
import { EnquireButton } from "@/components/product/enquire-button";
import AddToCartButton from "@/components/product/add-to-cart-button";
import WishlistButton from "@/components/wishlist/wishlist-button";
import { ProductCard } from "@/components/product/product-card";
import { ProductJsonLd } from "@/components/seo/product-jsonld";
import { ArrowRightIcon } from "@/components/ui/icons";
import { SITE_URL } from "@/lib/site";

// Product data is admin-managed; render per request so edits show immediately.
export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

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
        <div className="relative aspect-square overflow-hidden border border-outline/20">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ backgroundImage: gemstoneGradient(product.color) }}
            >
              <span className="font-serif text-4xl tracking-[0.2em] text-ivory/70">
                MIH GEMS
              </span>
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
          <h1 className="mt-4 font-serif text-4xl leading-tight text-ivory lg:text-5xl">
            {product.name}
          </h1>

          {product.detail ? (
            <p className="mt-4 text-sm uppercase tracking-[0.18em] text-muted">
              {product.detail}
            </p>
          ) : null}
          {product.category !== "Jewellery" && product.carat ? (
            <p className="mt-2 text-base text-ivory/80">{product.carat}</p>
          ) : null}

          <div className="mt-6">
            <PriceTag product={product} size="lg" />
          </div>

          {product.description ? (
            <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              {product.description}
            </p>
          ) : null}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <EnquireButton product={product} />
            <AddToCartButton product={product} />
          </div>
          <div className="mt-3">
            <WishlistButton product={product} variant="button" />
          </div>

          <div className="mt-10 grid gap-4 border-t border-outline/12 pt-8 sm:grid-cols-3">
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.2em] text-muted">
                Quality
              </p>
              <p className="mt-1 text-sm text-ivory/80">Hand-selected</p>
            </div>
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.2em] text-muted">
                Certification
              </p>
              <p className="mt-1 text-sm text-ivory/80">On request</p>
            </div>
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.2em] text-muted">
                Shipping
              </p>
              <p className="mt-1 text-sm text-ivory/80">Worldwide</p>
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
