import Link from "next/link";
import type { Metadata } from "next";
import { DiamondIcon, HomeIcon, ArrowRightIcon } from "@/components/ui/icons";

// 404s should never be indexed, and we don't want crawlers to chase dead links.
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="container-luxe flex min-h-[70vh] flex-col items-center justify-center gap-8 text-center">
      <span className="eyebrow">Error 404</span>
      <h1 className="font-serif text-5xl leading-tight text-ivory sm:text-6xl">
        Page not found
      </h1>
      <p className="max-w-md text-sm leading-relaxed text-muted">
        The piece or page you&apos;re looking for isn&apos;t here. It may have
        been moved, or the link may be incomplete. Browse the collection or
        return home to keep exploring MIH GEMS.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn btn-ghost btn-sm">
          <HomeIcon className="h-4 w-4" />
          Return Home
        </Link>
        <Link href="/shop" className="btn btn-gold btn-sm">
          <DiamondIcon className="h-4 w-4" />
          Browse the Collection
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}