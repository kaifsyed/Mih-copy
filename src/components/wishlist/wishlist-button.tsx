"use client";

import { useEffect, useState } from "react";
import { useWishlist, type WishlistItem } from "@/lib/wishlist";
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
  // Avoid a hydration mismatch: localStorage-derived state only after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const active = mounted && isInWishlist(product.slug);

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={() => toggle(product)}
        aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={active}
        className={`inline-flex h-10 w-10 items-center justify-center border backdrop-blur-sm transition ${
          active
            ? "border-gold/60 bg-noir/70 text-gold"
            : "border-silver/25 bg-noir/50 text-ivory hover:border-gold/60 hover:text-gold"
        } ${className}`}
      >
        <HeartIcon className="h-5 w-5" filled={active} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggle(product)}
      aria-pressed={active}
      className={`btn ${active ? "btn-gold" : "btn-ghost"} ${className}`}
    >
      <HeartIcon className="h-4 w-4" filled={active} />
      {active ? "In Wishlist" : "Add to Wishlist"}
    </button>
  );
}
