"use client";

import { useState, useCallback } from "react";
import { GlobeIcon, CheckIcon } from "@/components/ui/icons";
import { SITE_URL } from "@/lib/site";

type ShareButtonProps = {
  productName: string;
  productSlug: string;
  className?: string;
};

const SHARE_TEXT = "MIH GEMS — Natural gemstones & bespoke fine jewellery.";

export function ShareButton({
  productName,
  productSlug,
  className = "",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url = `${SITE_URL}/shop/${productSlug}`;
    const text = `${productName} — ${SHARE_TEXT}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: productName, text, url });
        return;
      } catch {
        // User cancelled or share failed — fall through to copy.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — silent fail.
    }
  }, [productName, productSlug]);

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={copied ? "Link copied" : "Share product"}
      className={`btn btn-ghost btn-sm ${className}`}
    >
      {copied ? (
        <>
          <CheckIcon className="h-4 w-4" />
          Link copied
        </>
      ) : (
        <>
          <GlobeIcon className="h-4 w-4" />
          Share
        </>
      )}
    </button>
  );
}
