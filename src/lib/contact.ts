/**
 * Public-facing contact details, sourced from NEXT_PUBLIC_* env vars so nothing
 * is fabricated. Only the values that are actually configured are rendered;
 * WhatsApp is handled separately via src/lib/whatsapp.ts. These are public
 * business details (not secrets).
 */
export const CONTACT = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null,
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || null,
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS?.trim() || null,
  hours: process.env.NEXT_PUBLIC_CONTACT_HOURS?.trim() || null,
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() || null,
} as const;
