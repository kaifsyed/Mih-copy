import type { ReactNode } from "react";

/**
 * Presentational state components (server-safe). Interactive retry logic lives
 * in the caller (e.g. the app-level error boundary) so these stay usable from
 * both server and client components.
 */

export function EmptyState({
  icon,
  title,
  message,
  action,
  className = "",
}: {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-5 border border-outline/25 bg-charcoal/40 px-6 py-16 text-center ${className}`}
    >
      {icon ? (
        <div className="flex h-14 w-14 items-center justify-center border border-gold/30 text-gold">
          {icon}
        </div>
      ) : null}
      <div className="flex flex-col gap-2">
        <h3 className="font-serif text-2xl text-ivory">{title}</h3>
        {message ? (
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
            {message}
          </p>
        ) : null}
      </div>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export function Spinner({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-gold/25 border-t-gold ${className}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card-luxe animate-pulse">
      <div className="aspect-square bg-charcoal-3/60" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-2.5 w-20 bg-charcoal-3/60" />
        <div className="h-4 w-3/4 bg-charcoal-3/60" />
        <div className="h-4 w-1/3 bg-charcoal-3/60" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
