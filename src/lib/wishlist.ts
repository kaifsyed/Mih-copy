"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Product } from "@/lib/products";

const STORAGE_KEY = "mih-gems-wishlist";
const UPDATE_EVENT = "mih-gems-wishlist-updated";

// Cached snapshot so useSyncExternalStore receives a referentially stable value
// while the stored string is unchanged (a fresh array each read would loop).
const EMPTY: WishlistItem[] = [];
let cachedRaw: string | null = null;
let cachedItems: WishlistItem[] = EMPTY;

export type WishlistItem = Pick<
  Product,
  | "slug"
  | "name"
  | "category"
  | "detail"
  | "carat"
  | "status"
  | "color"
  | "image_url"
  // Pricing travels with the saved item so the wishlist can show a price via
  // the shared pricing helper (final pricing is always confirmed on enquiry).
  | "pricing_type"
  | "price"
  | "price_min"
  | "price_max"
>;

function readWishlist(): WishlistItem[] {
  if (typeof window === "undefined") {
    return EMPTY;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;

  try {
    const parsed = raw ? JSON.parse(raw) : [];
    cachedItems = Array.isArray(parsed) ? parsed : EMPTY;
  } catch (error) {
    console.error("Failed to read wishlist:", error);
    cachedItems = EMPTY;
  }
  return cachedItems;
}

function writeWishlist(items: WishlistItem[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

  // Notify listeners in the SAME tab (the native "storage" event
  // only fires in OTHER tabs), so every component using this hook
  // stays in sync on one page.
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(UPDATE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(UPDATE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getServerSnapshot(): WishlistItem[] {
  return EMPTY;
}

/**
 * Wishlist is intentionally browser-storage only, for both guests
 * and signed-in customers. It does not sync across devices.
 */
export function useWishlist() {
  const items = useSyncExternalStore(
    subscribe,
    readWishlist,
    getServerSnapshot,
  );

  const isInWishlist = useCallback(
    (slug: string) => items.some((item) => item.slug === slug),
    [items]
  );

  const toggle = useCallback((product: WishlistItem) => {
    const current = readWishlist();
    const exists = current.some((item) => item.slug === product.slug);

    const next = exists
      ? current.filter((item) => item.slug !== product.slug)
      : [...current, product];

    writeWishlist(next);
  }, []);

  const remove = useCallback((slug: string) => {
    const current = readWishlist();
    writeWishlist(current.filter((item) => item.slug !== slug));
  }, []);

  return { items, isInWishlist, toggle, remove };
}
