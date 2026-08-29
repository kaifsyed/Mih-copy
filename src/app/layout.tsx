import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
  },
  twitter: {
    card: "summary_large_image",
    title: "MIH GEMS — Natural Gemstones & Fine Jewellery",
    description:
      "Natural, hand-selected coloured gemstones and bespoke fine jewellery, offered by personal enquiry.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          {/* SiteHeader/SiteFooter hide themselves on chromeless routes (admin,
              auth, and the self-contained homepage) — see chrome.ts. */}
          <SiteHeader />
          <div className="flex flex-1 flex-col">{children}</div>
          <SiteFooter />
        </ClerkProvider>
      </body>
    </html>
  );
}