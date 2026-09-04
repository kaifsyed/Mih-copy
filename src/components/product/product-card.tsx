import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { gemstoneGradient } from "@/lib/gemstone";
import { PriceTag } from "@/components/product/price-tag";
import { StatusChip } from "@/components/product/status-chip";
import WishlistButton from "@/components/wishlist/wishlist-button";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

/**
 * The canonical product card used across the shop grid, homepage features,
 * related products and search results. The whole card links to the detail
 * page; the wishlist toggle sits above the link so it stays independently
 * clickable (no nested interactive elements).
 */
export function ProductCard({ product, priority = false }: ProductCardProps) {
  const href = `/shop/${product.slug}` as const;

  return (
    <article className="card-luxe group relative flex flex-col">
      <div className="absolute right-3 top-3 z-10">
        <WishlistButton
          variant="icon"
          product={{
            slug: product.slug,
            name: product.name,
            category: product.category,
            detail: product.detail,
            carat: product.carat,
            status: product.status,
            color: product.color,
            image_url: product.image_url,
            pricing_type: product.pricing_type,
            price: product.price,
            price_min: product.price_min,
            price_max: product.price_max,
          }}
        />
      </div>

      <Link href={href} className="flex flex-1 flex-col focus:outline-none">
        <div className="relative aspect-square overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name ?? "Product photograph"}
              fill
              priority={priority}
              quality={85}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ backgroundImage: gemstoneGradient(product.color) }}
            >
              <span className="font-serif text-2xl text-ivory/70">MIH</span>
            </div>
          )}
          <div className="absolute bottom-3 left-3">
            <StatusChip status={product.status} />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5">
          {product.category ? (
            <span className="eyebrow text-[0.62rem]">
              {product.subcategory
                ? `${product.category} · ${product.subcategory}`
                : product.category}
            </span>
          ) : null}
          <h3 className="font-serif text-lg leading-snug text-ivory transition-colors group-hover:text-gold clamp-2">
            {product.name ?? "Untitled piece"}
          </h3>
          {product.category !== "Jewellery" && product.carat ? (
            <p className="text-xs uppercase tracking-widest text-muted">
              {product.carat}
            </p>
          ) : null}
          <div className="mt-auto pt-3">
            <PriceTag product={product} size="md" />
          </div>
        </div>
      </Link>
    </article>
  );
}
