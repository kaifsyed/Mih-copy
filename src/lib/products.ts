import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";

/**
 * Public product catalogue cache — wraps the anon SELECTs so the homepage, shop
 * listing and sitemap can serve cached results between admin writes.
 *
 * Only public catalogue data goes through this cache (anon client, RLS-bound).
 * Admin mutations invalidate the same tag (see `lib/products-cache.ts`) so
 * freshly added/edited/deleted products appear within the next request after
 * the write succeeds.
 */
const PRODUCT_CACHE_TAG = "products";
const PRODUCT_CACHE_REVALIDATE_SECONDS = 60;

/**
 * MIH GEMS product model — the single source of truth for the shape of a
 * product row and for reading products out of Supabase.
 *
 * Reads go through the ANON client on purpose: the storefront should only ever
 * see what a public visitor is allowed to see under RLS. Writes never happen
 * here — they belong to the service-role admin API routes under
 * /api/admin/products.
 *
 * Rows are normalized defensively because several product columns are plain
 * `text` in Postgres with no CHECK constraint, so the database can legitimately
 * hold values outside our TypeScript unions. We never invent data: anything
 * missing stays null and the UI degrades (no price → "Price on Enquiry",
 * no image → gemstone gradient).
 */

export type PricingType = "enquiry" | "negotiable" | "fixed" | "range";
export type ProductStatus = "Available" | "Enquire";
export type ProductColor = "blue" | "red" | "green";

/**
 * The two customer-facing product categories. This is the single source of
 * truth shared by the admin form (selector), the admin API (server-side
 * validation) and the shop filter, so the three can never drift apart.
 * Existing rows may hold other/legacy category values — those are left intact
 * and simply fall outside these two filters until an admin re-categorizes them.
 */
export const PRODUCT_CATEGORIES = ["Gemstones", "Jewellery"] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export function isProductCategory(value: unknown): value is ProductCategory {
  return (
    typeof value === "string" &&
    (PRODUCT_CATEGORIES as readonly string[]).includes(value)
  );
}

/**
 * Jewellery sub-types. Single source of truth shared by the admin form, the
 * admin API validation and the shop's secondary filter — the same reason the
 * categories above are centralized. Only meaningful when category is
 * "Jewellery"; gemstones always carry a null subcategory.
 */
export const JEWELLERY_SUBCATEGORIES = [
  "Rings",
  "Bracelets",
  "Necklaces",
  "Earrings",
] as const;
export type JewellerySubcategory = (typeof JEWELLERY_SUBCATEGORIES)[number];

export function isJewellerySubcategory(
  value: unknown,
): value is JewellerySubcategory {
  return (
    typeof value === "string" &&
    (JEWELLERY_SUBCATEGORIES as readonly string[]).includes(value)
  );
}

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  detail: string | null;
  carat: string | null;
  /** Jewellery sub-type; null for gemstones and for un-categorized rows. */
  subcategory: JewellerySubcategory | null;
  status: ProductStatus;
  description: string | null;
  color: ProductColor | null;
  image_url: string | null;
  image_path: string | null;
  /** null when the pricing migration has not been applied to this row yet. */
  pricing_type: PricingType | null;
  price: number | null;
  price_min: number | null;
  price_max: number | null;
  created_at: string;
};

const PRICING_TYPES: readonly PricingType[] = [
  "enquiry",
  "negotiable",
  "fixed",
  "range",
];
const PRODUCT_COLORS: readonly ProductColor[] = ["blue", "red", "green"];

function asTrimmedString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function asNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function asPricingType(value: unknown): PricingType | null {
  return PRICING_TYPES.find((type) => type === value) ?? null;
}

function asProductColor(value: unknown): ProductColor | null {
  const normalized = asTrimmedString(value)?.toLowerCase();
  return PRODUCT_COLORS.find((color) => color === normalized) ?? null;
}

/** Only the four known jewellery sub-types survive; everything else is null. */
function asJewellerySubcategory(value: unknown): JewellerySubcategory | null {
  const trimmed = asTrimmedString(value);
  return isJewellerySubcategory(trimmed) ? trimmed : null;
}

/** Anything that is not an explicit "Available" is treated as enquiry-only. */
function asProductStatus(value: unknown): ProductStatus {
  return asTrimmedString(value)?.toLowerCase() === "available"
    ? "Available"
    : "Enquire";
}

/**
 * Turns a raw Supabase row into a `Product`, or returns null when the row is
 * unusable (no id, slug or name — without those it cannot be linked or shown).
 */
function normalizeProduct(row: unknown): Product | null {
  if (!row || typeof row !== "object") return null;
  const raw = row as Record<string, unknown>;

  const id = asTrimmedString(raw.id);
  const slug = asTrimmedString(raw.slug);
  const name = asTrimmedString(raw.name);
  if (!id || !slug || !name) return null;

  return {
    id,
    slug,
    name,
    category: asTrimmedString(raw.category) ?? "Gemstone",
    detail: asTrimmedString(raw.detail),
    carat: asTrimmedString(raw.carat),
    subcategory: asJewellerySubcategory(raw.subcategory),
    status: asProductStatus(raw.status),
    description: asTrimmedString(raw.description),
    color: asProductColor(raw.color),
    image_url: asTrimmedString(raw.image_url),
    image_path: asTrimmedString(raw.image_path),
    pricing_type: asPricingType(raw.pricing_type),
    price: asNumber(raw.price),
    price_min: asNumber(raw.price_min),
    price_max: asNumber(raw.price_max),
    created_at: asTrimmedString(raw.created_at) ?? new Date(0).toISOString(),
  };
}

/**
 * Normalizes an unknown array of rows (e.g. a JSON response from the admin API)
 * into `Product`s, dropping any row that cannot be identified. Exported so the
 * admin screens coerce rows through exactly the same rules as the storefront.
 */
export function normalizeProducts(rows: unknown): Product[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .map(normalizeProduct)
    .filter((product): product is Product => product !== null);
}

async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getProducts failed:", error.message);
    return [];
  }

  return normalizeProducts(data);
}

const getProductsCached = unstable_cache(
  async () => fetchProducts(),
  ["public-products-list"],
  { tags: [PRODUCT_CACHE_TAG], revalidate: PRODUCT_CACHE_REVALIDATE_SECONDS },
);

/**
 * All products, newest first. Returns an empty array rather than throwing so a
 * database outage degrades to an empty-state page instead of a crash.
 *
 * Reads the public catalogue through a short-lived cache so the homepage and
 * shop listing don't hit Supabase on every request. Admin mutations invalidate
 * the cache via the same tag.
 */
export async function getProducts(): Promise<Product[]> {
  return getProductsCached();
}

async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const trimmed = slug?.trim();
  if (!trimmed) return null;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", trimmed)
    .maybeSingle();

  if (error) {
    console.error("getProductBySlug failed:", error.message);
    return null;
  }

  return normalizeProduct(data);
}

const getProductBySlugCached = unstable_cache(
  async (slug: string) => fetchProductBySlug(slug),
  ["public-product-by-slug"],
  { tags: [PRODUCT_CACHE_TAG], revalidate: PRODUCT_CACHE_REVALIDATE_SECONDS },
);

/** A single product by slug, or null when it does not exist. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  return getProductBySlugCached(slug);
}

async function fetchRelatedProducts(
  product: Pick<Product, "id" | "category">,
  limit: number,
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("id", product.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRelatedProducts failed:", error.message);
    return [];
  }

  return normalizeProducts(data);
}

const getRelatedProductsCached = unstable_cache(
  async (id: string, category: string, limit: number) =>
    fetchRelatedProducts({ id, category }, limit),
  ["public-related-products"],
  { tags: [PRODUCT_CACHE_TAG], revalidate: PRODUCT_CACHE_REVALIDATE_SECONDS },
);

/**
 * Other products in the same category, for the "related" strip on a product
 * page. Falls back to the newest products when the category has nothing else,
 * so the section is either genuinely relevant or genuinely empty.
 */
export async function getRelatedProducts(
  product: Pick<Product, "id" | "category">,
  limit = 4,
): Promise<Product[]> {
  return getRelatedProductsCached(product.id, product.category, limit);
}

/** Distinct categories present in a product list, alphabetically sorted. */
export function getCategories(products: readonly Product[]): string[] {
  return Array.from(new Set(products.map((p) => p.category))).sort((a, b) =>
    a.localeCompare(b),
  );
}

// ---------------------------------------------------------------------------
// Categorization validation — shared by the admin API routes and the admin
// form, mirroring how pricing validation is single-sourced in lib/pricing.ts.
// ---------------------------------------------------------------------------

export type NormalizedCategorization = {
  category: ProductCategory;
  subcategory: JewellerySubcategory | null;
  carat: string | null;
};

export type CategorizationValidation =
  | { ok: true; value: NormalizedCategorization }
  | { ok: false; error: string };

/**
 * Validates category + jewellery subcategory + carat together and returns the
 * normalized fields to persist. The rules the customer-facing UI relies on:
 *   - Gemstones: no subcategory (forced null); carat optional.
 *   - Jewellery: a required subcategory from JEWELLERY_SUBCATEGORIES; carat is
 *     never stored (forced null).
 * Stale/irrelevant values are dropped here rather than trusted from the client,
 * so a Gemstone can never keep a subcategory and Jewellery can never keep carat.
 */
export function validateCategorization(raw: {
  category?: unknown;
  subcategory?: unknown;
  carat?: unknown;
}): CategorizationValidation {
  const category =
    typeof raw.category === "string" ? raw.category.trim() : "";

  if (!isProductCategory(category)) {
    return {
      ok: false,
      error: "Category must be either Gemstones or Jewellery.",
    };
  }

  const carat = typeof raw.carat === "string" ? raw.carat.trim() : "";
  const subcategory =
    typeof raw.subcategory === "string" ? raw.subcategory.trim() : "";

  if (category === "Jewellery") {
    if (!isJewellerySubcategory(subcategory)) {
      return {
        ok: false,
        error:
          "Jewellery type must be one of Rings, Bracelets, Necklaces or Earrings.",
      };
    }
    // Jewellery never carries carat/size.
    return {
      ok: true,
      value: { category, subcategory, carat: null },
    };
  }

  // Gemstones: carat optional, never a subcategory.
  return {
    ok: true,
    value: { category, subcategory: null, carat: carat || null },
  };
}
