import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import CartClient from "@/components/cart/cart-client";

export const metadata: Metadata = {
  title: "Enquiry Cart",
  description:
    "Review the gemstones and jewellery you're interested in and send them to MIH GEMS as a single WhatsApp enquiry. No online payment. Pricing and availability are confirmed personally.",
  // Cart contents are stored per device and have no search value.
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="container-luxe section-gap">
      <SectionHeading
        as="h1"
        align="left"
        eyebrow="MIH GEMS"
        title="Your enquiry cart"
        description="Collect the pieces you'd like to ask about, then send them to us in one WhatsApp message. This is an enquiry. There's no online payment."
        className="mb-12"
      />
      <CartClient />
    </div>
  );
}
