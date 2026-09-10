"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { QuantitySelector } from "@/components/product/quantity-selector";
import { ShareButton } from "@/components/product/share-button";
import AddToCartButton from "./add-to-cart-button";
import { EnquireButton } from "./enquire-button";
import WishlistButton from "@/components/wishlist/wishlist-button";

type ProductActionsProps = {
  product: Product;
};

export function ProductActions({ product }: ProductActionsProps) {
  const [qty, setQty] = useState(1);

  return (
    <div className="flex flex-col gap-3">
      <QuantitySelector value={qty} onChange={setQty} />
      <div className="flex gap-3">
        <AddToCartButton product={product} quantity={qty} className="flex-1" />
        <EnquireButton product={product} className="flex-1" />
      </div>
      <div className="flex gap-3">
        <ShareButton productName={product.name} productSlug={product.slug} />
        <WishlistButton product={product} variant="button" />
      </div>
    </div>
  );
}
