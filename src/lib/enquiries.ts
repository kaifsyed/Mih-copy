/**
 * Enquiries — shared types, validation and reference-number generation.
 *
 * This module is server-safe (no React, no browser APIs beyond Web Crypto,
 * which exists on the Node runtime too). It is the single source of truth for
 * what a valid enquiry payload looks like, used by the public POST route and
 * the admin views.
 *
 * Security notes:
 *   - The public site never writes to Supabase directly. It POSTs to
 *     /api/enquiries, which validates here and inserts via the service-role
 *     client. The enquiries table has RLS enabled with no anon policies.
 *   - Enquiries never carry internal database IDs into customer-facing
 *     surfaces; the customer only ever sees the friendly `reference`.
 */

export type EnquiryType = "contact" | "product" | "custom" | "wholesale";
export type EnquiryStatus = "new" | "read" | "responded" | "archived";

export const ENQUIRY_TYPES: EnquiryType[] = [
  "contact",
  "product",
  "custom",
  "wholesale",
];

export const ENQUIRY_STATUSES: EnquiryStatus[] = [
  "new",
  "read",
  "responded",
  "archived",
];

/** Human labels for enquiry types (admin + account surfaces). */
export const ENQUIRY_TYPE_LABELS: Record<EnquiryType, string> = {
  contact: "General",
  product: "Product",
  custom: "Custom",
  wholesale: "Wholesale",
};

/** Human labels for the internal status (admin surface). */
export const ENQUIRY_STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  read: "Read",
  responded: "Responded",
  archived: "Archived",
};

/**
 * Customer-facing status wording. "read" is an internal state; to the customer
 * it simply means we've seen their enquiry and are looking into it.
 */
export const CUSTOMER_STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "Received",
  read: "In review",
  responded: "Responded",
  archived: "Closed",
};

/** A persisted enquiry row (as returned to admin views). */
export type Enquiry = {
  id: string;
  reference: string;
  type: EnquiryType;
  status: EnquiryStatus;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string | null;
  details: Record<string, string>;
  product_id: string | null;
  product_name: string | null;
  user_id: string | null;
  created_at: string;
};

/** The raw shape accepted from the client (all optional / untrusted). */
export type EnquiryInput = {
  type?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  subject?: unknown;
  message?: unknown;
  details?: unknown;
  productName?: unknown;
  productSlug?: unknown;
};

/** The validated, normalized enquiry ready to persist. */
export type NormalizedEnquiry = {
  type: EnquiryType;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string | null;
  details: Record<string, string>;
  productName: string | null;
  productSlug: string | null;
};

export type EnquiryValidation =
  | { ok: true; value: NormalizedEnquiry }
  | { ok: false; error: string };

const LIMITS = {
  name: 120,
  email: 200,
  phone: 40,
  subject: 160,
  message: 5000,
  detailKeys: 40,
  detailKey: 60,
  detailValue: 800,
  slug: 200,
  productName: 200,
} as const;

// Deliberately permissive — just enough to reject obvious garbage without
// bouncing legitimate international addresses.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function clamp(value: string, max: number): string {
  return value.length > max ? value.slice(0, max) : value;
}

function normalizeDetails(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<string, string> = {};
  let count = 0;
  for (const [rawKey, rawVal] of Object.entries(value as Record<string, unknown>)) {
    if (count >= LIMITS.detailKeys) break;
    const key = clamp(str(rawKey), LIMITS.detailKey);
    const val = clamp(str(rawVal), LIMITS.detailValue);
    if (!key || !val) continue;
    out[key] = val;
    count += 1;
  }
  return out;
}

/**
 * Validates and normalizes an untrusted enquiry payload. Enforces: a valid
 * type; a name; at least one contact channel (email or phone); a well-formed
 * email when provided; and length caps on everything. Returns nulls for empty
 * optional fields so the DB stays clean.
 */
export function sanitizeEnquiryInput(raw: EnquiryInput): EnquiryValidation {
  const typeRaw = str(raw.type) || "contact";
  if (!ENQUIRY_TYPES.includes(typeRaw as EnquiryType)) {
    return { ok: false, error: "Unknown enquiry type." };
  }
  const type = typeRaw as EnquiryType;

  const name = clamp(str(raw.name), LIMITS.name);
  if (!name) {
    return { ok: false, error: "Please tell us your name." };
  }

  const email = clamp(str(raw.email), LIMITS.email);
  if (email && !EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const phone = clamp(str(raw.phone), LIMITS.phone);

  if (!email && !phone) {
    return {
      ok: false,
      error: "Please leave an email or phone number so we can reply.",
    };
  }

  const subject = clamp(str(raw.subject), LIMITS.subject);
  const message = clamp(str(raw.message), LIMITS.message);
  const details = normalizeDetails(raw.details);

  const productName = clamp(str(raw.productName), LIMITS.productName);
  const productSlug = clamp(str(raw.productSlug), LIMITS.slug);

  return {
    ok: true,
    value: {
      type,
      name,
      email: email || null,
      phone: phone || null,
      subject: subject || null,
      message: message || null,
      details,
      productName: productName || null,
      productSlug: productSlug || null,
    },
  };
}

// Unambiguous alphabet (no 0/O, 1/I) for the human-readable suffix.
const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/**
 * Generates a customer-facing reference like "MG-8492-XQ". Not a secret and
 * not guaranteed unique on its own — the DB has a unique constraint and the
 * route retries on the rare collision.
 */
export function generateReference(): string {
  const rand = new Uint32Array(3);
  crypto.getRandomValues(rand);
  const num = 1000 + (rand[0] % 9000); // 1000–9999
  const c1 = REF_ALPHABET[rand[1] % REF_ALPHABET.length];
  const c2 = REF_ALPHABET[rand[2] % REF_ALPHABET.length];
  return `MG-${num}-${c1}${c2}`;
}
