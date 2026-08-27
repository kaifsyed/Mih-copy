import {
  ENQUIRY_STATUS_LABELS,
  CUSTOMER_STATUS_LABELS,
  type EnquiryStatus,
} from "@/lib/enquiries";

// Server-safe (no client hooks) so it can render in both server pages and
// client islands. Sharp, hairline badges per the design system.
const STYLES: Record<EnquiryStatus, string> = {
  new: "border-gold/40 bg-gold/10 text-gold",
  read: "border-silver/40 bg-silver/10 text-silver",
  responded: "border-whatsapp/40 bg-whatsapp/10 text-whatsapp",
  archived: "border-outline/40 bg-outline/10 text-muted",
};

export function StatusBadge({
  status,
  variant = "admin",
}: {
  status: EnquiryStatus;
  variant?: "admin" | "customer";
}) {
  const labels =
    variant === "customer" ? CUSTOMER_STATUS_LABELS : ENQUIRY_STATUS_LABELS;
  return (
    <span
      className={`inline-flex items-center border px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.14em] ${
        STYLES[status] ?? STYLES.archived
      }`}
    >
      {labels[status] ?? status}
    </span>
  );
}
