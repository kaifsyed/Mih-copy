"use client";

import { useState } from "react";
import { MinusIcon, PlusIcon } from "@/components/ui/icons";

type QuantitySelectorProps = {
  value?: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
};

export function QuantitySelector({
  value = 1,
  onChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps) {
  const [qty, setQty] = useState(value);

  const clamp = (next: number) => Math.max(min, Math.min(max, next));

  const handleDecrease = () => {
    const next = clamp(qty - 1);
    setQty(next);
    onChange(next);
  };

  const handleIncrease = () => {
    const next = clamp(qty + 1);
    setQty(next);
    onChange(next);
  };

  return (
    <div className="inline-flex items-center border border-outline/30 w-fit">
      <button
        type="button"
        onClick={handleDecrease}
        disabled={qty <= min}
        aria-label="Decrease quantity"
        className="inline-flex h-10 w-10 items-center justify-center text-ivory transition-colors hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <span className="w-8 text-center text-sm tabular-nums text-ivory">
        {qty}
      </span>
      <button
        type="button"
        onClick={handleIncrease}
        disabled={qty >= max}
        aria-label="Increase quantity"
        className="inline-flex h-10 w-10 items-center justify-center text-ivory transition-colors hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
