"use client";

import { usePathname } from "next/navigation";
import { WhatsappIcon } from "@/components/ui/icons";
import { SITE_URL } from "@/lib/site";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

const DEFAULT_MESSAGE =
  "Hi MIH GEMS! \u{1F44B} I'm interested in your gemstones and jewellery. I'd like to know more.";

function buildLink(message: string) {
  const base = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}

function isChromelessPath(pathname: string | null | undefined) {
  if (!pathname) return false;
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up")
  );
}

function getProductSlug(pathname: string | null | undefined): string | null {
  if (!pathname) return null;
  const match = pathname.match(/^\/shop\/([^/]+)\/?$/);
  return match ? match[1] : null;
}

function productMessage(slug: string) {
  const url = `${SITE_URL}/shop/${slug}`;
  return `Hi MIH GEMS! \u{1F44B} I'm interested in this piece. Could you please share more details?\n\n${url}`;
}

/**
 * Lightweight, dependency-free floating WhatsApp contact button. Rendered once
 * in the root layout, hidden on chromeless routes (/admin, /sign-in, /sign-up)
 * so the storefront stays uncluttered and the admin console isn't disturbed.
 *
 * Rendering is intentionally synchronous (no `useHydrated` gate) so the button
 * is visible in the initial paint — there is no behavior that depends on the
 * client store, and the prior hydration gate caused a visible layout flash on
 * slow connections.
 */
export function FloatingWhatsapp() {
  const pathname = usePathname();

  if (isChromelessPath(pathname)) return null;

  const slug = getProductSlug(pathname);
  const message = slug ? productMessage(slug) : DEFAULT_MESSAGE;

  return (
    <a
      href={buildLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with MIH GEMS on WhatsApp"
      title="Chat with MIH GEMS on WhatsApp"
      className="floating-whatsapp group fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-[#05240f] shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-transform duration-200 ease-out hover:scale-105 hover:bg-[#1fb457] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25d366] focus-visible:ring-offset-2 focus-visible:ring-offset-noir sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
    >
      <WhatsappIcon className="h-7 w-7 sm:h-8 sm:w-8" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full border border-outline/20 bg-noir-deep/95 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-ivory opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 md:block">
        Chat on WhatsApp
      </span>
    </a>
  );
}
