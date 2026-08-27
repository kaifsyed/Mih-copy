import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import PoliciesTabs, {
  type PolicySection,
} from "@/components/policies/policies-tabs";

export const metadata: Metadata = {
  title: "Policies & FAQ",
  description:
    "How ordering, enquiries, delivery, authenticity and privacy work at MIH GEMS, plus answers to common questions.",
};

// Deliberately generic: MIH GEMS is enquiry-based (no online checkout), so
// specific timelines, fees and lab names are confirmed per order rather than
// stated as blanket commitments here.
const SECTIONS: PolicySection[] = [
  {
    id: "ordering",
    label: "Enquiries & ordering",
    heading: "Enquiries & ordering",
    intro:
      "MIH GEMS is an enquiry-based boutique — there is no online checkout. This keeps every purchase personal and lets us confirm the details that matter with you directly.",
    blocks: [
      {
        heading: "How it works",
        bullets: [
          "Browse the collection and send an enquiry on any piece, by form or WhatsApp.",
          "We confirm availability, current pricing and any certification.",
          "Once you're happy, we arrange payment and delivery with you personally.",
        ],
      },
      {
        heading: "Pricing",
        body: "Some pieces show a set price or a price range; others are marked “Price on Enquiry”. Final pricing and any customisation are always confirmed with you before you commit.",
      },
    ],
  },
  {
    id: "delivery",
    label: "Shipping & delivery",
    heading: "Shipping & delivery",
    blocks: [
      {
        heading: "Insured, tracked dispatch",
        body: "Orders are sent using insured, trackable couriers. We confirm the delivery method, timeline and any charges with you at the time of purchase, based on the piece and your destination.",
      },
      {
        heading: "Made-to-order pieces",
        body: "Custom and bespoke commissions are crafted after your approval, so they take longer than in-stock pieces. We'll give you a realistic timeline before work begins.",
      },
    ],
  },
  {
    id: "returns",
    label: "Returns & care",
    heading: "Returns & care",
    blocks: [
      {
        heading: "Returns & exchanges",
        body: "Because natural gemstones are unique and many pieces are made or sourced to order, returns and exchanges are handled case by case. We'll explain what applies to your specific piece at the time of purchase — just ask before you buy.",
      },
      {
        heading: "Caring for your jewellery",
        bullets: [
          "Store pieces separately in a soft pouch or lined box to avoid scratches.",
          "Keep gemstones away from harsh chemicals, heat and abrasion.",
          "Clean gently with a soft cloth; ask us about professional cleaning when needed.",
        ],
      },
    ],
  },
  {
    id: "authenticity",
    label: "Authenticity",
    heading: "Authenticity & certification",
    blocks: [
      {
        heading: "Natural gemstones",
        body: "The gemstones we offer are natural and hand-selected. We're always happy to talk you through a stone's characteristics before you buy.",
      },
      {
        heading: "Certification",
        body: "Independent laboratory certification can be arranged on request for eligible gemstones. Let us know when you enquire and we'll confirm what's available for the piece you're interested in.",
      },
    ],
  },
  {
    id: "privacy",
    label: "Privacy",
    heading: "Privacy",
    blocks: [
      {
        heading: "What we collect",
        body: "When you send an enquiry we collect the details you provide — such as your name, contact details and message — so we can respond to you.",
      },
      {
        heading: "How we use it",
        body: "We use your information only to reply to your enquiry and provide the service you've asked about. We don't sell your details, and we don't share them except where it's necessary to fulfil your order (for example, with a courier).",
      },
      {
        heading: "Your choices",
        body: "You can ask us to update or delete the details you've shared at any time — just get in touch.",
      },
    ],
  },
  {
    id: "faq",
    label: "FAQ",
    heading: "Frequently asked questions",
    faqs: [
      {
        q: "Are your gemstones natural?",
        a: "Yes. We deal in natural, hand-selected gemstones and are happy to discuss any stone's characteristics with you.",
      },
      {
        q: "Can I get a certificate for my gemstone?",
        a: "Independent laboratory certification can be arranged on request for eligible stones. Mention it when you enquire and we'll confirm the options.",
      },
      {
        q: "Do you make custom or bespoke pieces?",
        a: "Absolutely. Share your idea on the Custom Jewellery page and we'll guide you from first sketch to finished piece.",
      },
      {
        q: "How do I buy a piece?",
        a: "Send an enquiry on the piece, by form or WhatsApp. We'll confirm availability, pricing and certification, then arrange payment and delivery with you directly.",
      },
      {
        q: "Do you offer wholesale?",
        a: "Yes — we supply jewellers, designers and retailers. Tell us about your business on the Wholesale page and we'll be in touch.",
      },
    ],
  },
];

export default function PoliciesPage() {
  return (
    <div className="container-luxe section-gap">
      <SectionHeading
        as="h1"
        eyebrow="Client services"
        title="Policies & FAQ"
        description="Everything you need to know about enquiring, ordering, delivery, authenticity and privacy at MIH GEMS."
      />
      <PoliciesTabs sections={SECTIONS} />

      <p className="mt-12 text-center text-sm text-muted">
        Still have a question?{" "}
        <Link href="/contact" className="text-gold hover:underline">
          Get in touch
        </Link>
        .
      </p>
    </div>
  );
}
