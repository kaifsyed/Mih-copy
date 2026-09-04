import Link from "next/link";
import type { Metadata } from "next";

// 404s should never be indexed, and we don't want crawlers to chase dead links.
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="container-luxe flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <span className="eyebrow">Error 404</span>
      <h1 className="font-serif text-4xl md:text-5xl">Page not found</h1>
      <p className="max-w-md text-sm leading-relaxed text-muted">
        The piece or page you&apos;re looking for isn&apos;t here. It may have
        been moved, or the link may be incomplete.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/shop" className="btn btn-gold">
          Browse the Collection
        </Link>
        <Link href="/" className="btn btn-ghost">
          Return Home
        </Link>
      </div>
    </div>
  );
}
