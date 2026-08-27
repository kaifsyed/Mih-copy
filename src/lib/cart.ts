"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Product } from "@/lib/products";

const STORAGE_KEY = "mih-gems-cart";
const UPDATE_EVENT = "mih-gems-cart-updated";

/**
 * The cart is an ENQUIRY cart, not a payment checkout. It collects the items
 * a customer wants to ask about; the enquiry is completed over WhatsApp.
 * Stored in the browser only (guests + signed-in customers alike).
 */
export type CartItem = Pick<
  Product,
  | "slug"
  | "name"
  | "category"
  | "carat"
  | "status"
  | "color"
  | "image_url"
  | "pricing_type"
  | "price"
  | "price_min"
  | "price_max"
> & { qty: number };

// Cached snapshot so useSyncExternalStore receives a referentially stable value
// while the stored string is unchanged. Returning a fresh array on every read
// would loop forever.
const EMPTY: CartItem[] = [];
let cachedRaw: string | null = null;
let cachedItems: CartItem[] = EMPTY;

function parseCart(raw: string | null): CartItem[] {
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed
      .filter((item) => item && typeof item.slug === "string")
      .map((item) => ({ ...item, qty: Math.max(1, Number(item.qty) || 1) }));
  } catch (error) {
    console.error("Failed to read cart:", error);
    return EMPTY;
  }
}

function readCart(): CartItem[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;
  cachedItems = parseCart(raw);
  return cachedItems;
}

function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  // Same-tab sync (the native "storage" event only fires in other tabs).
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

function getServerSnapshot(): CartItem[] {
  return EMPTY;
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, readCart, getServerSnapshot);

  const isInCart = useCallback(
    (slug: string) => items.some((item) => item.slug === slug),
    [items],
  );

  const add = useCallback((product: Omit<CartItem, "qty">, qty = 1) => {
    const current = readCart();
    const existing = current.find((item) => item.slug === product.slug);
    const next = existing
      ? current.map((item) =>
          item.slug === product.slug
            ? { ...item, qty: item.qty + qty }
            : item,
        )
      : [...current, { ...product, qty: Math.max(1, qty) }];
    writeCart(next);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    const current = readCart();
    if (qty <= 0) {
      writeCart(current.filter((item) => item.slug !== slug));
      return;
    }
    writeCart(
      current.map((item) => (item.slug === slug ? { ...item, qty } : item)),
    );
  }, []);

  const remove = useCallback((slug: string) => {
    writeCart(readCart().filter((item) => item.slug !== slug));
  }, []);

  const clear = useCallback(() => writeCart([]), []);

  const count = items.reduce((sum, item) => sum + item.qty, 0);

  return { items, count, isInCart, add, setQty, remove, clear };
}
