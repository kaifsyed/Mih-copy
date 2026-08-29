import { supabase } from "@/lib/supabase";

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

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  detail: string | null;
  carat: string | null;
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

/**
 * All products, newest first. Returns an empty array rather than throwing so a
 * database outage degrades to an empty-state page instead of a crash.
 */
export async function getProducts(): Promise<Product[]> {
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

/** A single product by slug, or null when it does not exist. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
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

/**
 * Other products in the same category, for the "related" strip on a product
 * page. Falls back to the newest products when the category has nothing else,
 * so the section is either genuinely relevant or genuinely empty.
 */
export async function getRelatedProducts(
  product: Pick<Product, "id" | "category">,
  limit = 4,
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

/** Distinct categories present in a product list, alphabetically sorted. */
export function getCategories(products: readonly Product[]): string[] {
  return Array.from(new Set(products.map((p) => p.category))).sort((a, b) =>
    a.localeCompare(b),
  );
}
