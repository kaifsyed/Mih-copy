"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/lib/products";

const STORAGE_KEY = "mih-gems-wishlist";
const UPDATE_EVENT = "mih-gems-wishlist-updated";

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
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to read wishlist:", error);
    return [];
  }
}

function writeWishlist(items: WishlistItem[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

  // Notify listeners in the SAME tab (the native "storage" event
  // only fires in OTHER tabs), so every component using this hook
  // stays in sync on one page.
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

/**
 * Wishlist is intentionally browser-storage only, for both guests
 * and signed-in customers. It does not sync across devices.
 */
export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    setItems(readWishlist());

    function handleUpdate() {
      setItems(readWishlist());
    }

    window.addEventListener(UPDATE_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(UPDATE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

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
