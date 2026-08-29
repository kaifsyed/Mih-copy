"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useHydrated } from "@/lib/use-hydrated";
import { formatPrice, isEnquiryOnly } from "@/lib/pricing";
import { gemstoneGradient } from "@/lib/gemstone";
import { whatsappLink, cartEnquiryMessage } from "@/lib/whatsapp";
import { PriceTag } from "@/components/product/price-tag";
import { EmptyState } from "@/components/ui/states";
import {
  BagIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  WhatsappIcon,
} from "@/components/ui/icons";

export default function CartClient() {
  const { items, count, setQty, remove, clear } = useCart();
  const hydrated = useHydrated();

  if (!hydrated) {
    // Avoid hydration mismatch while localStorage is read on the client.
    return <div className="min-h-[40vh]" aria-hidden />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<BagIcon className="h-6 w-6" />}
        title="Your enquiry cart is empty"
        message="Add the pieces you're interested in and send them to us as a single WhatsApp enquiry — we'll reply with availability, certification and pricing."
        action={
          <Link href="/shop" className="btn btn-gold">
            Browse the Collection
          </Link>
        }
      />
    );
  }

  const enquiryLines = items.map((item) => ({
    name: item.name ?? "Gemstone",
    qty: item.qty,
    priceText: isEnquiryOnly(item) ? undefined : formatPrice(item),
  }));
  const whatsappHref = whatsappLink(cartEnquiryMessage(enquiryLines));

  return (
    <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
      {/* Line items */}
      <ul className="flex flex-col divide-y divide-outline/15 border border-outline/20">
        {items.map((item) => (
          <li key={item.slug} className="flex gap-4 p-4 sm:gap-6 sm:p-6">
            <Link
              href={`/shop/${item.slug}`}
              className="relative h-24 w-24 shrink-0 overflow-hidden border border-outline/20 sm:h-28 sm:w-28"
            >
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.name ?? "Gemstone"}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              ) : (
                <span
                  className="flex h-full w-full items-center justify-center font-serif text-sm text-ivory/60"
                  style={{ backgroundImage: gemstoneGradient(item.color) }}
                >
                  MIH
                </span>
              )}
            </Link>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {item.category ? (
                    <span className="eyebrow text-[0.6rem]">
                      {item.category}
                    </span>
                  ) : null}
                  <Link
                    href={`/shop/${item.slug}`}
                    className="mt-1 block truncate font-serif text-lg text-ivory transition-colors hover:text-gold"
                  >
                    {item.name ?? "Untitled piece"}
                  </Link>
                  {item.carat ? (
                    <p className="mt-1 text-xs uppercase tracking-widest text-muted">
                      {item.carat}
                    </p>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => remove(item.slug)}
                  aria-label={`Remove ${item.name ?? "item"} from enquiry cart`}
                  className="shrink-0 text-muted transition-colors hover:text-danger"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                {/* Quantity stepper */}
                <div className="inline-flex items-center border border-outline/30">
                  <button
                    type="button"
                    onClick={() => setQty(item.slug, item.qty - 1)}
                    aria-label="Decrease quantity"
                    className="inline-flex h-9 w-9 items-center justify-center text-ivory transition-colors hover:text-gold"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="min-w-9 text-center text-sm tabular-nums text-ivory">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(item.slug, item.qty + 1)}
                    aria-label="Increase quantity"
                    className="inline-flex h-9 w-9 items-center justify-center text-ivory transition-colors hover:text-gold"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>

                <PriceTag product={item} size="sm" />
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Enquiry summary */}
      <aside className="border border-gold/25 bg-charcoal/40 p-6 lg:sticky lg:top-28">
        <h2 className="font-serif text-2xl text-ivory">Enquiry Summary</h2>
        <div className="mt-5 flex items-center justify-between border-b border-outline/15 pb-4 text-sm">
          <span className="text-muted">Pieces</span>
          <span className="tabular-nums text-ivory">{count}</span>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-muted">
          This is an enquiry, not an order — there is no online payment. Send
          your selection and we&apos;ll respond personally with availability,
          certification and final pricing.
        </p>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp btn-block mt-6"
        >
          <WhatsappIcon className="h-4 w-4" />
          Send Enquiry on WhatsApp
        </a>

        <Link href="/shop" className="btn btn-ghost btn-block mt-3">
          Continue Browsing
        </Link>

        <button
          type="button"
          onClick={clear}
          className="mt-4 w-full text-center text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-danger"
        >
          Clear enquiry cart
        </button>
      </aside>
    </div>
  );
}
