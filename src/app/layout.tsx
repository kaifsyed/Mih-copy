import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingWhatsapp } from "@/components/layout/floating-whatsapp";
import { SITE_URL } from "@/lib/site";
import { OrganizationJsonLd } from "@/components/seo/organization-jsonld";
import { WebsiteJsonLd } from "@/components/seo/website-jsonld";
import { ToastProvider } from "@/components/ui/toast";

// Playfair Display — editorial serif headlines. Montserrat — UI/body.
// Repository audit confirmed no `font-bold` / `font-extrabold` usage;
// Playfair 500/600 covers every Playfair Display reference. One fewer
// woff2 file in the initial font payload.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Explicit absolute canonical for the homepage (and any route that does
  // not declare its own). Child routes that set their own alternates.canonical
  // (shop, shop/[slug], blog/[slug]) replace this value during metadata merge,
  // so they are unaffected. SITE_URL is production-aware and never hardcodes
  // the preview domain.
  alternates: {
    canonical: SITE_URL,
  },
  title: {
    default: "MIH GEMS — Natural Gemstones & Fine Jewellery",
    template: "%s · MIH GEMS",
  },
  description:
    "MIH GEMS is a private atelier for natural, hand-selected coloured gemstones and bespoke sterling silver jewellery — certified on request and offered by personal WhatsApp enquiry.",
  keywords: [
    "natural gemstones",
    "blue sapphire",
    "ruby",
    "emerald",
    "fine jewellery",
    "custom jewellery",
    "MIH GEMS",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-64.png", sizes: "64x64", type: "image/png" },
    ],
    apple: [{ url: "/favicon-180.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        url: "/favicon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/favicon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: "MIH GEMS",
    title: "MIH GEMS — Natural Gemstones & Fine Jewellery",
    description:
      "Natural, hand-selected coloured gemstones and bespoke fine jewellery, offered by personal enquiry.",
    url: SITE_URL,
    locale: "en_IN",
    images: [
      {
        url: "/logo-header.png",
        width: 1821,
        height: 864,
        alt: "MIH GEMS — Gems & Jewellery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MIH GEMS — Natural Gemstones & Fine Jewellery",
    description:
      "Natural, hand-selected coloured gemstones and bespoke fine jewellery, offered by personal enquiry.",
    images: ["/logo-header.png"],
  },
};

// Viewport must be exported separately from `metadata` since Next.js 14
// (deprecated in the metadata object). The default `width=device-width,
// initial-scale=1` viewport tag is added by Next.js automatically.
export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Resolved here, on the server, and handed to the footer as a plain number.
  // The footer is a client component, so calling `new Date().getFullYear()`
  // inside it would evaluate once in the server's timezone and again in the
  // visitor's. Around New Year those two disagree for anyone east or west of
  // the server, which is a hydration mismatch (React error #418) and a visible
  // year flip. A prop cannot disagree with itself. UTC is used so the value is
  // also independent of the server's own locale.
  const year = new Date().getUTCFullYear();

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <ToastProvider>
            {/* Keyboard/screen-reader skip link — first focusable element. */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-noir"
            >
              Skip to content
            </a>
            {/* SiteHeader/SiteFooter hide themselves on chromeless routes (admin,
                auth, and the self-contained homepage) — see chrome.ts. */}
            <SiteHeader />
            <div id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
              {children}
            </div>
            <SiteFooter year={year} />
            <FloatingWhatsapp />
            <OrganizationJsonLd />
            <WebsiteJsonLd />
          </ToastProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}