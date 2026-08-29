import type { PricingType, Product } from "@/lib/products";

/**
 * MIH GEMS pricing system — four admin-controlled modes:
 *   - enquiry     → "Enquire for Price"      (no numbers)
 *   - negotiable  → "Negotiable"             (no numbers)
 *   - fixed       → ₹5,500
 *   - range       → ₹3,500 – ₹4,300
 *
 * This module is the SINGLE source of truth for how a price is displayed
 * (shop cards, product detail, wishlist, cart, admin table, WhatsApp) and
 * how pricing input is validated (admin API + admin form). Whenever a valid
 * price cannot be produced we fall back to "Enquire for Price" rather than
 * inventing a number.
 */

/** Legacy alias kept for callers that compared against it. */
export const ENQUIRY_LABEL = "Enquire for Price";
export const ENQUIRE_LABEL = "Enquire for Price";
export const NEGOTIABLE_LABEL = "Negotiable";

export type Priceable = Pick<
  Product,
  "pricing_type" | "price" | "price_min" | "price_max"
>;

const inrFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

/** Formats a positive number as Indian Rupees, e.g. 5500 → "₹5,500". */
export function formatINR(value: number): string {
  return `₹${inrFormatter.format(Math.round(value))}`;
}

function toPositiveNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

/**
 * Returns the customer-facing price string for a product. Safe to call with
 * partially-populated rows (e.g. before the pricing migration has run) — it
 * degrades to {@link ENQUIRE_LABEL} whenever the data is missing or invalid.
 */
export function formatPrice(product: Priceable | null | undefined): string {
  if (!product) return ENQUIRE_LABEL;

  // Rows written before the pricing migration have a null pricing_type; treat
  // them as enquiry-only rather than inventing a number.
  const type: PricingType = product.pricing_type ?? "enquiry";

  if (type === "fixed") {
    const price = toPositiveNumber(product.price);
    return price !== null && price > 0 ? formatINR(price) : ENQUIRE_LABEL;
  }

  if (type === "range") {
    const min = toPositiveNumber(product.price_min);
    const max = toPositiveNumber(product.price_max);
    if (min !== null && min > 0 && max !== null && max >= min) {
      return max === min ? formatINR(min) : `${formatINR(min)} – ${formatINR(max)}`;
    }
    return ENQUIRE_LABEL;
  }

  if (type === "negotiable") return NEGOTIABLE_LABEL;

  // enquiry / anything unexpected
  return ENQUIRE_LABEL;
}

/**
 * True when a product carries a concrete numeric price (a valid fixed price or
 * range). Enquiry-only and negotiable pieces return false. This — not a string
 * comparison against a label — is the reliable test for "has a real price".
 */
export function hasNumericPrice(product: Priceable | null | undefined): boolean {
  if (!product) return false;
  const type: PricingType = product.pricing_type ?? "enquiry";
  if (type === "fixed") {
    const price = toPositiveNumber(product.price);
    return price !== null && price > 0;
  }
  if (type === "range") {
    const min = toPositiveNumber(product.price_min);
    const max = toPositiveNumber(product.price_max);
    return min !== null && min > 0 && max !== null && max >= min;
  }
  return false;
}

/**
 * True when a product has no concrete price and can only be enquired about.
 * Used to decide whether a WhatsApp message should carry a price — so both
 * "Enquire for Price" and "Negotiable" pieces send without a number.
 */
export function isEnquiryOnly(product: Priceable | null | undefined): boolean {
  return !hasNumericPrice(product);
}

/**
 * A numeric value usable for client-side "sort by price". Products without a
 * concrete price return null so callers can order them last.
 */
export function sortPriceValue(product: Priceable | null | undefined): number | null {
  if (!product) return null;
  const type: PricingType = product.pricing_type ?? "enquiry";
  if (type === "fixed") return toPositiveNumber(product.price);
  if (type === "range") return toPositiveNumber(product.price_min);
  return null;
}

// ---------------------------------------------------------------------------
// Validation — shared by the admin API route and the admin product form.
// ---------------------------------------------------------------------------

export type NormalizedPricing = {
  pricing_type: PricingType;
  price: number | null;
  price_min: number | null;
  price_max: number | null;
};

export type PricingValidation =
  | { ok: true; value: NormalizedPricing }
  | { ok: false; error: string };

/**
 * Validates and normalizes raw pricing input (strings from a form or JSON).
 * Enforces: fixed price > 0; range min > 0 and max >= min; enquiry & negotiable
 * carry no numbers. Rejects negative / non-numeric values.
 */
export function validatePricing(raw: {
  pricing_type?: unknown;
  price?: unknown;
  price_min?: unknown;
  price_max?: unknown;
}): PricingValidation {
  const type = raw.pricing_type;

  if (
    type !== "enquiry" &&
    type !== "negotiable" &&
    type !== "fixed" &&
    type !== "range"
  ) {
    return { ok: false, error: "Please choose a valid pricing type." };
  }

  if (type === "fixed") {
    const price = toPositiveNumber(raw.price);
    if (price === null || price <= 0) {
      return { ok: false, error: "Fixed price must be a number greater than 0." };
    }
    return {
      ok: true,
      value: { pricing_type: "fixed", price, price_min: null, price_max: null },
    };
  }

  if (type === "range") {
    const min = toPositiveNumber(raw.price_min);
    const max = toPositiveNumber(raw.price_max);
    if (min === null || min <= 0) {
      return { ok: false, error: "Minimum price must be a number greater than 0." };
    }
    if (max === null || max < min) {
      return {
        ok: false,
        error: "Maximum price must be greater than or equal to the minimum price.",
      };
    }
    return {
      ok: true,
      value: { pricing_type: "range", price: null, price_min: min, price_max: max },
    };
  }

  // enquiry / negotiable — no numbers stored
  return {
    ok: true,
    value: { pricing_type: type, price: null, price_min: null, price_max: null },
  };
}
