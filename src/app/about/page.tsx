import type { Metadata } from "next";
import Link from "next/link";
import { whatsappLink } from "@/lib/whatsapp";
import {
  DiamondIcon,
  ShieldIcon,
  SparkleIcon,
  ArrowRightIcon,
  WhatsappIcon,
} from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "MIH GEMS curates natural coloured gemstones and sterling silver jewellery for people who value authenticity — with certification on request and a personal, no-pressure approach.",
};

const VALUES = [
  {
    icon: DiamondIcon,
    title: "Natural & hand-selected",
    body: "We source natural coloured gemstones and inspect every stone ourselves for colour, clarity and character.",
  },
  {
    icon: ShieldIcon,
    title: "Certified on request",
    body: "Independent laboratory certification is available for our gemstones, so you can buy with complete confidence.",
  },
  {
    icon: SparkleIcon,
    title: "Made personal",
    body: "From a single ring to a bespoke commission, we guide you at every step and confirm every detail before you commit.",
  },
];

const ABOUT_WHATSAPP =
  "Hi MIH GEMS, I'd like to know more about your gemstones and jewellery.";

export default function AboutPage() {
  return (
    <div className="container-luxe">
      {/* Hero */}
      <section className="section-gap grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <span className="eyebrow">Our story</span>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-ivory lg:text-6xl">
            Curators of rare,{" "}
            <span className="text-gradient-gold">natural gemstones</span>
          </h1>
          <div className="mt-8 flex flex-col gap-5 text-sm leading-relaxed text-muted sm:text-base">
            <p>
              MIH GEMS was founded on a simple belief: a natural gemstone,
              chosen with care and set with intention, becomes something you
              keep for life. We curate coloured gemstones and sterling silver
              jewellery for people who value authenticity over hype.
            </p>
            <p>
              Every piece we offer is natural and hand-selected. Whether
              you&rsquo;re looking for a certified sapphire, a bespoke
              commission, or a wholesale partnership, we work with you
              personally — no pressure, no fine print.
            </p>
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className="btn btn-gold">
              Explore the collection
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Talk to us
            </Link>
          </div>
        </div>

        {/* Decorative gem panel (no stock imagery) */}
        <div className="order-1 lg:order-2">
          <div className="bg-radial-gold relative flex aspect-[4/5] items-center justify-center overflow-hidden border border-gold/15">
            <div className="glow-gold rotate-45 text-gold/80">
              <DiamondIcon className="h-28 w-28 lg:h-40 lg:w-40" />
            </div>
            <span className="absolute bottom-6 left-6 font-serif text-lg tracking-[0.2em] text-ivory/70">
              MIH GEMS
            </span>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-gap border-t border-outline/12 pt-16">
        <div className="max-w-2xl">
          <span className="eyebrow">What sets us apart</span>
          <h2 className="mt-4 font-serif text-3xl text-ivory lg:text-4xl">
            The MIH GEMS difference
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {VALUES.map((value) => (
            <article key={value.title} className="card-luxe flex flex-col gap-4 p-8">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-gold/30 text-gold">
                <value.icon className="h-6 w-6" />
              </span>
              <h3 className="font-serif text-xl text-ivory">{value.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{value.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="section-gap">
        <div className="card-luxe flex flex-col items-start gap-6 p-10 lg:flex-row lg:items-center lg:justify-between lg:p-14">
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl text-ivory lg:text-4xl">
              Have a piece in mind?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Tell us what you&rsquo;re looking for and we&rsquo;ll help you find
              it — or design it from scratch.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappLink(ABOUT_WHATSAPP)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              <WhatsappIcon className="h-4 w-4" />
              Message on WhatsApp
            </a>
            <Link href="/custom-jewellery" className="btn btn-ghost">
              Start a custom piece
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
