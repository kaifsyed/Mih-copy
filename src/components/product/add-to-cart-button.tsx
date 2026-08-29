"use client";

import Link from "next/link";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useHydrated } from "@/lib/use-hydrated";
import { BagIcon, CheckIcon } from "@/components/ui/icons";

type AddToCartButtonProps = {
  product: Product;
  className?: string;
};

/**
 * Adds a product to the browser-side ENQUIRY cart (no payment). Once the item
 * is in the cart the control becomes a link through to the enquiry cart so the
 * customer can review and send their enquiry over WhatsApp.
 */
export default function AddToCartButton({
  product,
  className = "",
}: AddToCartButtonProps) {
  const { isInCart, add } = useCart();
  const hydrated = useHydrated();

  const inCart = hydrated && isInCart(product.slug);

  if (inCart) {
    return (
      <Link href="/cart" className={`btn btn-ghost ${className}`}>
        <CheckIcon className="h-4 w-4" />
        In Enquiry Cart
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() =>
        add({
          slug: product.slug,
          name: product.name,
          category: product.category,
          carat: product.carat,
          status: product.status,
          color: product.color,
          image_url: product.image_url,
          pricing_type: product.pricing_type,
          price: product.price,
          price_min: product.price_min,
          price_max: product.price_max,
        })
      }
      className={`btn btn-gold ${className}`}
    >
      <BagIcon className="h-4 w-4" />
      Add to Enquiry Cart
    </button>
  );
}
