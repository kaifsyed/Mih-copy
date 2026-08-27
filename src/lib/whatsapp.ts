const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

/**
 * Builds a wa.me link, optionally prefilled with a message.
 * Falls back to a plain wa.me link (no number) if
 * NEXT_PUBLIC_WHATSAPP_NUMBER isn't configured, so the app
 * never silently hard-codes a business phone number.
 */
export function whatsappLink(message?: string) {
  const base = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}`
    : "https://wa.me/";

  if (!message) {
    return base;
  }

  return `${base}?text=${encodeURIComponent(message)}`;
}

/** True when a WhatsApp number is configured; used to gate CTAs gracefully. */
export function hasWhatsapp() {
  return WHATSAPP_NUMBER.length > 0;
}

/**
 * Builds a wa.me link addressed to a SPECIFIC number — used by the admin to
 * reply to a customer's enquiry (not our own business number). Strips all
 * non-digits; returns null when there aren't enough digits to dial, so callers
 * can hide the button instead of producing a broken link.
 */
export function whatsappTo(
  phone: string | null | undefined,
  message?: string,
): string | null {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (digits.length < 7) return null;
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Product enquiry message. Includes the display price when known, but NEVER
 * exposes internal database IDs — only the customer-facing name and price.
 */
export function productEnquiryMessage(productName: string, priceText?: string) {
  const name = productName?.trim() || "this piece";
  const priceLine =
    priceText && priceText.trim().length > 0 ? ` (${priceText.trim()})` : "";
  return `Hi MIH GEMS, I'm interested in the ${name}${priceLine}. Please share the details and availability.`;
}

export type CartEnquiryLine = {
  name: string;
  qty: number;
  priceText?: string;
};

/**
 * Enquiry-cart message. Lists the pieces the customer wants to ask about with
 * quantity and display price. No IDs, no fabricated totals.
 */
export function cartEnquiryMessage(lines: CartEnquiryLine[]) {
  if (!lines.length) {
    return "Hi MIH GEMS, I'd like to make an enquiry.";
  }

  const body = lines
    .map((line, index) => {
      const name = line.name?.trim() || "Item";
      const qty = line.qty > 1 ? ` × ${line.qty}` : "";
      const price = line.priceText ? ` — ${line.priceText}` : "";
      return `${index + 1}. ${name}${qty}${price}`;
    })
    .join("\n");

  return `Hi MIH GEMS, I'd like to enquire about the following:\n\n${body}\n\nPlease share availability and pricing.`;
}

const ENQUIRY_INTRO: Record<string, string> = {
  contact: "Hi MIH GEMS, I'd like to get in touch.",
  product: "Hi MIH GEMS, I'd like to enquire about a piece.",
  custom: "Hi MIH GEMS, I'd like to design a custom piece.",
  wholesale: "Hi MIH GEMS, I'd like to discuss a wholesale partnership.",
};

export type EnquiryWhatsappInput = {
  type: "contact" | "product" | "custom" | "wholesale";
  name?: string;
  subject?: string;
  message?: string;
  /** Type-specific fields as { "Human Label": "Value" }. */
  details?: Record<string, string>;
};

/**
 * Builds a WhatsApp message from an enquiry form's current values — the
 * always-available alternative to submitting the form. Never includes IDs.
 */
export function enquiryWhatsappMessage(input: EnquiryWhatsappInput): string {
  const intro = ENQUIRY_INTRO[input.type] ?? ENQUIRY_INTRO.contact;
  const lines: string[] = [intro, ""];

  if (input.name?.trim()) lines.push(`Name: ${input.name.trim()}`);
  if (input.subject?.trim()) lines.push(`Regarding: ${input.subject.trim()}`);

  for (const [label, value] of Object.entries(input.details ?? {})) {
    if (value?.trim()) lines.push(`${label}: ${value.trim()}`);
  }

  if (input.message?.trim()) {
    lines.push("", input.message.trim());
  }

  return lines.join("\n").trim();
}
