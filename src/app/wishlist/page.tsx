import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import WishlistClient from "@/components/wishlist/wishlist-client";

export const metadata: Metadata = {
  title: "Your Wishlist",
  description:
    "Gemstones and jewellery you've saved from MIH GEMS, kept on this device. Enquire on the pieces you love over WhatsApp.",
};

export default function WishlistPage() {
  return (
    <div className="container-luxe section-gap">
      <SectionHeading
        as="h1"
        align="left"
        eyebrow="MIH GEMS"
        title="Your wishlist"
        description="Saved pieces, kept on this device. Send them to us as a single enquiry whenever you're ready."
        className="mb-12"
      />
      <WishlistClient />
    </div>
  );
}
