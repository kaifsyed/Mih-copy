import type { EnquiryType } from "@/lib/enquiries";

/**
 * Declarative field configs that drive the shared <EnquiryForm>. Kept as plain
 * data so pages stay thin and the three forms share one renderer.
 *
 * `core` maps a field onto a top-level enquiry column (name/email/phone/
 * subject/message). Everything else is stored under its `label` in the
 * `details` JSON, which the admin view renders verbatim.
 */

export type EnquiryFieldOption = { value: string; label: string };

export type EnquiryFieldKind =
  | "text"
  | "email"
  | "tel"
  | "textarea"
  | "select"
  | "chips";

export type EnquiryField = {
  name: string;
  label: string;
  kind: EnquiryFieldKind;
  core?: "name" | "email" | "phone" | "subject" | "message";
  required?: boolean;
  placeholder?: string;
  options?: EnquiryFieldOption[];
  rows?: number;
  /** Span both columns of the responsive grid. */
  full?: boolean;
  help?: string;
};

export type EnquiryFormConfig = {
  type: EnquiryType;
  fields: EnquiryField[];
  submitLabel: string;
};

const opt = (label: string, value = label): EnquiryFieldOption => ({ value, label });

export const CONTACT_FORM: EnquiryFormConfig = {
  type: "contact",
  submitLabel: "Send message",
  fields: [
    {
      name: "name",
      label: "Full name",
      kind: "text",
      core: "name",
      required: true,
      full: true,
      placeholder: "Your name",
    },
    {
      name: "email",
      label: "Email address",
      kind: "email",
      core: "email",
      required: true,
      placeholder: "you@example.com",
    },
    {
      name: "phone",
      label: "Phone / WhatsApp",
      kind: "tel",
      core: "phone",
      placeholder: "Optional",
    },
    {
      name: "subject",
      label: "Enquiry type",
      kind: "select",
      core: "subject",
      required: true,
      options: [
        opt("General enquiry"),
        opt("Product information"),
        opt("Request an appointment"),
        opt("Custom jewellery"),
        opt("Wholesale"),
      ],
    },
    {
      name: "message",
      label: "Your message",
      kind: "textarea",
      core: "message",
      required: true,
      rows: 5,
      full: true,
      placeholder: "How can we help?",
    },
  ],
};

export const CUSTOM_FORM: EnquiryFormConfig = {
  type: "custom",
  submitLabel: "Send design enquiry",
  fields: [
    {
      name: "name",
      label: "Full name",
      kind: "text",
      core: "name",
      required: true,
      full: true,
      placeholder: "Your name",
    },
    {
      name: "email",
      label: "Email address",
      kind: "email",
      core: "email",
      required: true,
      placeholder: "you@example.com",
    },
    {
      name: "phone",
      label: "Phone / WhatsApp",
      kind: "tel",
      core: "phone",
      placeholder: "Optional",
    },
    {
      name: "jewellery_type",
      label: "Jewellery type",
      kind: "select",
      required: true,
      full: true,
      placeholder: "Select jewellery type",
      options: [
        opt("Ring"),
        opt("Pendant"),
        opt("Necklace"),
        opt("Earrings"),
        opt("Bracelet"),
        opt("Other"),
      ],
    },
    {
      name: "metal",
      label: "Preferred metal",
      kind: "select",
      options: [
        opt("18K Yellow Gold"),
        opt("18K White Gold"),
        opt("18K Rose Gold"),
        opt("Platinum"),
        opt("Sterling Silver"),
        opt("Undecided"),
      ],
    },
    {
      name: "gemstone",
      label: "Primary gemstone",
      kind: "text",
      placeholder: "e.g. Blue Sapphire, Emerald",
    },
    {
      name: "budget",
      label: "Estimated budget (₹)",
      kind: "text",
      placeholder: "e.g. ₹50,000",
    },
    {
      name: "ring_size",
      label: "Ring size (if applicable)",
      kind: "text",
      placeholder: "Optional",
    },
    {
      name: "message",
      label: "Describe your vision",
      kind: "textarea",
      core: "message",
      required: true,
      rows: 5,
      full: true,
      placeholder: "Motifs, inspirations or specific requirements…",
      help: "You can share reference images over WhatsApp once you've sent your enquiry.",
    },
  ],
};

export const WHOLESALE_FORM: EnquiryFormConfig = {
  type: "wholesale",
  submitLabel: "Submit enquiry",
  fields: [
    {
      name: "businessName",
      label: "Business name",
      kind: "text",
      required: true,
    },
    {
      name: "name",
      label: "Contact person",
      kind: "text",
      core: "name",
      required: true,
    },
    {
      name: "email",
      label: "Email address",
      kind: "email",
      core: "email",
      required: true,
      placeholder: "you@example.com",
    },
    {
      name: "phone",
      label: "Phone / WhatsApp",
      kind: "tel",
      core: "phone",
      required: true,
    },
    {
      name: "country",
      label: "Country of operation",
      kind: "text",
      required: true,
      full: true,
    },
    {
      name: "product_interest",
      label: "Primary interest",
      kind: "select",
      options: [
        opt("Rough gemstones"),
        opt("Cut & polished stones"),
        opt("Silver jewellery"),
        opt("Custom manufacturing"),
      ],
    },
    {
      name: "volume",
      label: "Estimated monthly volume",
      kind: "select",
      options: [
        opt("Under 50 pieces / under 1kg rough", "small"),
        opt("50–200 pieces / 1–5kg rough", "medium"),
        opt("200+ pieces / 5kg+ rough", "large"),
      ],
    },
    {
      name: "message",
      label: "Additional details",
      kind: "textarea",
      core: "message",
      rows: 4,
      full: true,
      placeholder: "Tell us about your business and what you're looking for.",
    },
  ],
};
