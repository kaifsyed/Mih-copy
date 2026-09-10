"use client";

import { useState, useCallback } from "react";
import { GlobeIcon, CheckIcon } from "@/components/ui/icons";
import { SITE_URL } from "@/lib/site";

type ArticleShareButtonProps = {
  articleTitle: string;
  articleSlug: string;
};

const SHARE_TEXT = "MIH GEMS — Natural gemstones & bespoke fine jewellery.";

export function ArticleShareButton({
  articleTitle,
  articleSlug,
}: ArticleShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url = `${SITE_URL}/blog/${articleSlug}`;
    const text = `${articleTitle} — ${SHARE_TEXT}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: articleTitle, text, url });
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
  }, [articleTitle, articleSlug]);

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={copied ? "Link copied" : "Share article"}
      className="btn btn-ghost btn-sm"
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