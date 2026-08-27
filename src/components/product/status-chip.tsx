import type { Product } from "@/lib/products";

/**
 * Availability chip. "Available" reads as IN STOCK (gold); "Enquire" reads as
 * a silver ENQUIRE badge. Sharp-cornered, tracked-out — per the design system.
 */
export function StatusChip({
  status,
  className = "",
}: {
  status: Product["status"];
  className?: string;
}) {
  const available = status === "Available";
  return (
    <span
      className={`chip ${available ? "chip-gold" : "chip-silver"} ${className}`}
    >
      {available ? "In Stock" : "Enquire"}
    </span>
  );
}
