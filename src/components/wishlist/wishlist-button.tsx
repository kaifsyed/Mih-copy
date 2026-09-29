"use client";

import { useWishlist, type WishlistItem } from "@/lib/wishlist";
import { useHydrated } from "@/lib/use-hydrated";
import { useToast } from "@/components/ui/toast";
import { HeartIcon } from "@/components/ui/icons";

type WishlistButtonProps = {
  product: WishlistItem;
  className?: string;
  /** "button" = labelled pill (detail page); "icon" = compact heart (cards). */
  variant?: "button" | "icon";
};

export default function WishlistButton({
  product,
  className = "",
  variant = "button",
}: WishlistButtonProps) {
  const { isInWishlist, toggle } = useWishlist();
  const hydrated = useHydrated();
  const toast = useToast();
  const active = hydrated && isInWishlist(product.slug);

  const handleToggle = (e: React.MouseEvent | React.TouchEvent) => {
    // Stop propagation so the click never leaks to a parent product-card link.
    e.stopPropagation();
    const wasActive = active;
    toggle(product);
    if (wasActive) {
      toast(`${product.name ?? "Item"} removed from wishlist`, "info");
    } else {
      toast(`${product.name ?? "Item"} added to wishlist`, "success");
    }
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        data-wishlist-button
        onClick={handleToggle}
        aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={active}
        className={`inline-flex h-8 w-8 items-center justify-center border backdrop-blur-sm transition sm:h-10 sm:w-10 ${
          active
            ? "border-gold/60 bg-noir/70 text-gold"
            : "border-silver/25 bg-noir/50 text-ivory hover:border-gold/60 hover:text-gold"
        } ${className}`}
      >
        <HeartIcon className="h-4 w-4 sm:h-5 sm:w-5" filled={active} />
      </button>
    );
  }

  return (
    <button
      type="button"
      data-wishlist-button
      onClick={handleToggle}
      aria-pressed={active}
      className={`btn ${active ? "btn-gold" : "btn-ghost"} ${className}`}
    >
      <HeartIcon className="h-4 w-4" filled={active} />
      {active ? "In Wishlist" : "Add to Wishlist"}
    </button>
  );
}