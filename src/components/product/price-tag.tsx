import { ENQUIRY_LABEL, formatPrice, type Priceable } from "@/lib/pricing";

type PriceTagProps = {
  product: Priceable | null | undefined;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses: Record<NonNullable<PriceTagProps["size"]>, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl md:text-3xl",
};

/**
 * Renders a product's price using the shared {@link formatPrice} helper so
 * every surface (cards, detail, cart, wishlist) is consistent. Enquiry-only
 * prices are shown muted, real prices in gold.
 */
export function PriceTag({ product, size = "md", className = "" }: PriceTagProps) {
  const text = formatPrice(product);
  const enquiry = text === ENQUIRY_LABEL;

  return (
    <span
      className={`font-sans font-semibold tracking-tight ${sizeClasses[size]} ${
        enquiry ? "text-muted" : "text-gold"
      } ${className}`}
    >
      {text}
    </span>
  );
}
