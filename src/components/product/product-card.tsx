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
  /**
   * Responsive `sizes` for `next/image`. Defaults to the previous shared
   * value so existing call sites stay byte-identical; callers that render the
   * card in a tighter or wider grid can pass a more accurate value to avoid
   * over-fetching.
   */
  sizes?: string;
};

/**
 * The canonical product card used across the shop grid, homepage features,
 * related products and search results. The whole card links to the detail
 * page; the wishlist toggle sits above the link so it stays independently
 * clickable (no nested interactive elements).
 *
 * Mobile is the compact two-column case: the grid that hosts this card drops
 * from one column to two below `sm`, so the card's internal spacing, type
 * scale, overlay control sizes and image padding are all tightened there and
 * restored to the existing desktop treatment from `sm` up. The image area
 * stays a square at every width and switches to `object-contain` with inset
 * padding on mobile so small gems/jewellery are never cropped or crushed
 * against the card edge; it returns to `object-cover` at `sm` and above.
 */
export function ProductCard({
  product,
  priority = false,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw",
}: ProductCardProps) {
  const href = `/shop/${product.slug}` as const;

  return (
    <article className="card-luxe group relative flex h-full flex-col">
      <div className="absolute right-2 top-2 z-10 sm:right-3 sm:top-3">
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

      <Link
        href={href}
        className="flex flex-1 flex-col focus:outline-none"
      >
        <div className="relative aspect-square overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={
                product.name ??
                (product.detail
                  ? `${product.detail} gemstone`
                  : "MIH GEMS product photograph")
              }
              fill
              priority={priority}
              quality={85}
              sizes={sizes}
              className="object-contain p-2.5 transition-transform duration-700 ease-out group-hover:scale-105 sm:object-cover sm:p-0"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ backgroundImage: gemstoneGradient(product.color) }}
            >
              <span className="font-serif text-2xl text-ivory/70">MIH</span>
            </div>
          )}
          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
            <StatusChip status={product.status} />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-5">
          {product.category ? (
            <span className="eyebrow text-[0.55rem] sm:text-[0.62rem]">
              {product.subcategory
                ? `${product.category} · ${product.subcategory}`
                : product.category}
            </span>
          ) : null}
          <h3 className="font-serif text-sm leading-snug text-ivory transition-colors group-hover:text-gold sm:text-lg clamp-2">
            {product.name ?? "Untitled piece"}
          </h3>
          {product.category !== "Jewellery" && product.carat ? (
            <p className="text-[0.6rem] uppercase tracking-widest text-muted sm:text-xs">
              {product.carat}
            </p>
          ) : null}
          <div className="mt-auto pt-2 sm:pt-3">
            <PriceTag product={product} size="card" />
          </div>
        </div>
      </Link>
    </article>
  );
}
