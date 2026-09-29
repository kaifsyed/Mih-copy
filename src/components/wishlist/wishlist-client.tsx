"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/lib/wishlist";
import { useHydrated } from "@/lib/use-hydrated";
import { formatPrice, isEnquiryOnly } from "@/lib/pricing";
import { gemstoneGradient } from "@/lib/gemstone";
import { whatsappLink, cartEnquiryMessage } from "@/lib/whatsapp";
import { PriceTag } from "@/components/product/price-tag";
import { StatusChip } from "@/components/product/status-chip";
import { EnquireButton } from "@/components/product/enquire-button";
import { EmptyState } from "@/components/ui/states";
import { HeartIcon, TrashIcon, WhatsappIcon } from "@/components/ui/icons";

export default function WishlistClient() {
  const { items, remove } = useWishlist();
  const hydrated = useHydrated();

  if (!hydrated) {
    return <div className="min-h-[40vh]" aria-hidden />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<HeartIcon className="h-6 w-6" />}
        title="Your wishlist is empty"
        message="Tap the heart on any piece to save it here. Your wishlist is kept on this device."
        action={
          <Link href="/shop" className="btn btn-gold">
            Browse the Collection
          </Link>
        }
      />
    );
  }

  const bulkHref = whatsappLink(
    cartEnquiryMessage(
      items.map((item) => ({
        name: item.name ?? "Gemstone",
        qty: 1,
        priceText: isEnquiryOnly(item) ? undefined : formatPrice(item),
      })),
    ),
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 border-b border-outline/15 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">
          {items.length} {items.length === 1 ? "piece" : "pieces"} saved
        </p>
        <a
          href={bulkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp btn-sm"
        >
          <WhatsappIcon className="h-4 w-4" />
          Enquire About All
        </a>
      </div>

      {/* Two columns on mobile, matching the Home/Shop product-card density.
          `sm:` and `lg:` restore the original column counts. */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.slug}
            className="card-luxe group relative flex h-full flex-col"
          >
            <button
              type="button"
              onClick={() => remove(item.slug)}
              aria-label={`Remove ${item.name ?? "item"} from wishlist`}
              className="absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center border border-silver/25 bg-noir/60 text-ivory backdrop-blur-sm transition hover:border-danger/60 hover:text-danger sm:right-3 sm:top-3 sm:h-10 sm:w-10"
            >
              <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <Link href={`/shop/${item.slug}`} className="flex flex-1 flex-col">
              <div className="relative aspect-square overflow-hidden">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.name ?? "Saved gemstone photograph"}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    quality={85}
                    className="object-contain p-2.5 transition-transform duration-700 group-hover:scale-105 sm:object-cover sm:p-0"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center"
                    style={{ backgroundImage: gemstoneGradient(item.color) }}
                  >
                    <span className="font-serif text-2xl text-ivory/70">
                      MIH
                    </span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
                  <StatusChip status={item.status} />
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-5">
                {item.category ? (
                  <span className="eyebrow text-[0.55rem] sm:text-[0.62rem]">
                    {item.category}
                  </span>
                ) : null}
                <h2 className="font-serif text-sm leading-snug text-ivory transition-colors group-hover:text-gold sm:text-lg clamp-2">
                  {item.name ?? "Untitled piece"}
                </h2>
                {item.carat ? (
                  <p className="text-[0.6rem] uppercase tracking-widest text-muted sm:text-xs">
                    {item.carat}
                  </p>
                ) : null}
                <div className="mt-auto pt-2 sm:pt-3">
                  <PriceTag product={item} size="card" />
                </div>
              </div>
            </Link>

            <div className="p-3 pt-0 sm:p-5 sm:pt-0">
              <EnquireButton
                product={item}
                className="btn-sm btn-block"
                label="Enquire"
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
