import { formatPrice, hasNumericPrice, type Priceable } from "@/lib/pricing";

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
 * every surface (cards, detail, cart, wishlist) is consistent. Pieces without a
 * concrete price ("Enquire for Price" / "Negotiable") are shown muted, real
 * prices in gold.
 */
export function PriceTag({ product, size = "md", className = "" }: PriceTagProps) {
  const text = formatPrice(product);
  const muted = !hasNumericPrice(product);

  return (
    <span
      className={`font-sans font-semibold tracking-tight ${sizeClasses[size]} ${
        muted ? "text-muted" : "text-gold"
      } ${className}`}
    >
      {text}
    </span>
  );
}
