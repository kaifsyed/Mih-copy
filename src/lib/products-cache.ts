import "server-only";

import { revalidateTag } from "next/cache";

/**
 * Server-only entry point for invalidating the public product catalogue cache.
 * Lives in its own module so `lib/products.ts` (which is also imported by
 * client components) can stay free of `next/cache` server APIs.
 */
export function invalidateProductCache(): void {
  revalidateTag("products", "max");
}