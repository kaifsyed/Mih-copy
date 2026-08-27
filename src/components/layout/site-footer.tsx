"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { WhatsappIcon, ArrowRightIcon } from "@/components/ui/icons";
import { whatsappLink } from "@/lib/whatsapp";
import { isChromeless, PRIMARY_NAV } from "@/components/layout/chrome";

const CUSTOMER_LINKS = [
  { href: "/wishlist", label: "Wishlist" },
  { href: "/cart", label: "Enquiry Cart" },
  { href: "/account", label: "My Account" },
  { href: "/policies", label: "Policies" },
] as const;

export function SiteFooter() {
  const pathname = usePathname();
  if (isChromeless(pathname)) return null;

  const year = 2026; // Rendered statically; avoids hydration drift from new Date().

  return (
    <footer className="mt-auto border-t border-gold/12 bg-noir-deep">
      <div className="container-luxe grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        {/* Brand */}
        <div className="flex flex-col gap-5">
          <Logo href={null} imgClassName="h-12 w-auto" />
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            A private atelier for natural gemstones and bespoke fine jewellery.
            Every piece is offered by personal enquiry — hand-selected, certified
            on request, and crafted to order.
          </p>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-sm self-start"
          >
            <WhatsappIcon className="h-4 w-4" />
            Enquire on WhatsApp
          </a>
        </div>

        {/* Explore */}
        <nav aria-label="Explore" className="flex flex-col gap-4">
          <h4 className="eyebrow">Explore</h4>
          <ul className="flex flex-col gap-3">
            {PRIMARY_NAV.filter((item) => item.href !== "/").map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
                >
                  <ArrowRightIcon className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Customer */}
        <nav aria-label="Your account" className="flex flex-col gap-4">
          <h4 className="eyebrow">Customer Care</h4>
          <ul className="flex flex-col gap-3">
            {CUSTOMER_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
                >
                  <ArrowRightIcon className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-outline/12">
        <div className="container-luxe flex flex-col items-center justify-between gap-3 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs tracking-wide text-muted">
            © {year} MIH GEMS. All rights reserved.
          </p>
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-outline">
            Natural Gemstones · Fine Jewellery · By Enquiry
          </p>
        </div>
      </div>
    </footer>
  );
}
