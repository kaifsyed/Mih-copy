"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import {
  WhatsappIcon,
  ArrowRightIcon,
  InstagramIcon,
  FacebookIcon,
} from "@/components/ui/icons";
import { whatsappLink } from "@/lib/whatsapp";
import { SOCIAL_LINKS } from "@/lib/site";
import { isChromeless } from "@/components/layout/chrome";

const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
} as const;

// Approved footer navigation — one shared source for every device. Only the
// layout changes responsively; the content is identical on desktop/tablet/mobile.
// "Help & FAQs" points at the real FAQ tab on /policies (no dedicated /help or
// /faq route exists — we reuse the existing destination rather than inventing one).
const FOOTER_NAV = [
  {
    title: "Explore",
    links: [
      { href: "/shop", label: "Shop" },
      { href: "/custom-jewellery", label: "Custom Jewellery" },
      { href: "/wholesale", label: "Wholesale" },
    ],
  },
  {
    title: "Information",
    links: [
      { href: "/policies#faq", label: "Help & FAQs" },
      { href: "/about", label: "About MIH GEMS" },
      { href: "/policies", label: "Policies" },
    ],
  },
  {
    title: "My Account",
    links: [
      { href: "/account", label: "My Account" },
      { href: "/cart", label: "Enquiry Cart" },
    ],
  },
] as const;

export function SiteFooter() {
  const pathname = usePathname();
  if (isChromeless(pathname)) return null;

  const year = 2026; // Rendered statically; avoids hydration drift from new Date().

  return (
    <footer className="mt-auto border-t border-gold/12 bg-noir-deep">
      <div className="container-luxe grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
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

          {/* Social profiles */}
          <div className="flex items-center gap-3 pt-1">
            {SOCIAL_LINKS.map((social) => {
              const Icon = SOCIAL_ICONS[social.key];
              return (
                <a
                  key={social.key}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="inline-flex h-11 w-11 items-center justify-center border border-gold/25 text-muted transition-colors hover:border-gold/60 hover:text-gold"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Navigation groups — Explore · Information · My Account */}
        {FOOTER_NAV.map((group) => (
          <nav key={group.title} aria-label={group.title} className="flex flex-col gap-4">
            <h4 className="eyebrow">{group.title}</h4>
            <ul className="flex flex-col gap-3">
              {group.links.map((item) => (
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
        ))}
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
