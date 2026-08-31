import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import EnquiryForm from "@/components/enquiry/enquiry-form";
import { CUSTOM_FORM } from "@/components/enquiry/enquiry-fields";
import { CheckIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Custom Jewellery",
  description:
    "Commission a bespoke piece with MIH GEMS — from an engagement ring to a signature pendant. Share your vision and we'll guide you from first sketch to finished jewellery.",
};

const STEPS = [
  {
    n: "01",
    title: "Consultation",
    body: "Share your ideas below. We'll reach out to discuss the design, stones and budget in detail.",
  },
  {
    n: "02",
    title: "Design & approval",
    body: "We prepare sketches or 3D renderings for your approval before any metal is cast.",
  },
  {
    n: "03",
    title: "Creation",
    body: "Our artisans handcraft your piece and keep you updated right through to delivery.",
  },
];

const REASSURANCE = [
  "Natural, hand-selected gemstones",
  "Independent certification available on request",
  "Sketches and renderings before we begin",
  "No online payment, details confirmed personally",
];

export default function CustomJewelleryPage() {
  return (
    <div className="container-luxe section-gap">
      <SectionHeading
        as="h1"
        eyebrow="Bespoke"
        title="Your vision, our creation"
        description="Commission a one-of-a-kind piece, an engagement ring, a signature pendant, or a reimagined heirloom. Tell us what you have in mind and we'll take it from first sketch to finished jewellery."
      />

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <EnquiryForm config={CUSTOM_FORM} />
        </div>

        <aside className="flex flex-col gap-8 lg:col-span-5">
          <div className="card-luxe p-8">
            <h2 className="font-serif text-2xl text-ivory">The process</h2>
            <div className="divider-gold mt-4" />
            <ol className="mt-6 flex flex-col gap-6">
              {STEPS.map((step) => (
                <li key={step.n} className="flex gap-4">
                  <span className="font-serif text-xl leading-none text-gold">
                    {step.n}
                  </span>
                  <div>
                    <p className="font-medium text-ivory">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="card-luxe p-8">
            <h2 className="font-serif text-xl text-ivory">Good to know</h2>
            <ul className="mt-5 flex flex-col gap-3 text-sm text-muted">
              {REASSURANCE.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
