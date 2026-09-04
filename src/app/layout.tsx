import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingWhatsapp } from "@/components/layout/floating-whatsapp";
import { SITE_URL } from "@/lib/site";
import { OrganizationJsonLd } from "@/components/seo/organization-jsonld";

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
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
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
          <SiteFooter />
          <FloatingWhatsapp />
          <OrganizationJsonLd />
        </ClerkProvider>
      </body>
    </html>
  );
}