"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface for observability; no user-facing detail leaked.
    console.error(error);
  }, [error]);

  return (
    <div className="container-luxe flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <span className="eyebrow">Something went wrong</span>
      <h1 className="font-serif text-3xl md:text-4xl">
        We hit an unexpected snag
      </h1>
      <p className="max-w-md text-sm leading-relaxed text-muted">
        The page couldn&apos;t be loaded just now. Please try again — if it keeps
        happening, reach out and we&apos;ll help you directly.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-gold">
          Try Again
        </button>
        <Link href="/" className="btn btn-ghost">
          Return Home
        </Link>
      </div>
    </div>
  );
}
