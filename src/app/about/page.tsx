import type { Metadata } from "next";
import Image from "next/image";
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

// Milestones paraphrased strictly from the verified MIH GEMS story above —
// no dates, claims or history are invented.
const JOURNEY = [
  {
    year: "1998",
    title: "Where it all began",
    body: "MIH GEMS began as an offline gemstone business built on trust, personal relationships and a genuine passion for natural stones.",
  },
  {
    year: "Through the generations",
    title: "A family passion, passed down",
    body: "As part of the MIH GROUP, the business grew into a third-generation family venture, carrying the same care for authenticity from one generation to the next.",
  },
  {
    year: "2023",
    title: "A new chapter, online",
    body: "MIH GEMS expanded its presence online, serving customers through both our offline and online channels.",
  },
  {
    year: "Today",
    title: "A curated collection",
    body: "We curate natural coloured gemstones, birthstones, precious and semi-precious stones, and sterling silver jewellery, each selected for authenticity, character and quality.",
  },
] as const;

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
              Established in <strong>1998</strong>, MIH GEMS is a
              <strong> third-generation family gemstone business</strong> and a
              part of the <strong>MIH GROUP</strong>. What began as an offline
              business built on trust, personal relationships, and a passion
              for gemstones has grown through generations.
            </p>

            <p>
              In <strong>2023</strong>, we expanded our presence online, allowing
              MIH GEMS to serve customers through both our
              <strong> offline and online channels</strong>. Today, we curate
              <strong> natural coloured gemstones, birthstones, precious and
              semi-precious gemstones, and sterling silver jewellery</strong>,
              carefully selected for authenticity, character, and quality.
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

        {/* Editorial image — natural gemstones on a jeweller's bench */}
        <div className="order-1 lg:order-2">
          <div className="relative aspect-[4/5] overflow-hidden border border-gold/15">
            <Image
              src="/about-our-story.webp"
              alt="Natural coloured gemstones and fine jewellery arranged on a jeweller's workbench"
              fill
              priority
              quality={85}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <span className="absolute bottom-6 left-6 font-serif text-lg tracking-[0.2em] text-ivory/70">
              MIH GEMS
            </span>
          </div>
        </div>
      </section>

      {/* Our journey — editorial timeline built only from verified MIH GEMS facts */}
      <section className="section-gap border-t border-outline/12 pt-16">
        <div className="max-w-2xl">
          <span className="eyebrow">Our journey</span>
          <h2 className="mt-4 font-serif text-3xl text-ivory lg:text-4xl">
            Where it all began
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
            A family story of gemstones, carried forward through generations,
            from a trusted offline business to the curated collection we share
            today.
          </p>
        </div>

        <ol className="relative mt-14 border-l border-gold/25 pl-8 sm:pl-10">
          {JOURNEY.map((milestone) => (
            <li key={milestone.year} className="relative pb-12 last:pb-0">
              <span
                aria-hidden
                className="absolute -left-[calc(2rem+7px)] top-1.5 h-3 w-3 rotate-45 border border-gold bg-noir sm:-left-[calc(2.5rem+7px)]"
              />
              <span className="eyebrow">{milestone.year}</span>
              <h3 className="mt-2 font-serif text-2xl text-ivory">
                {milestone.title}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                {milestone.body}
              </p>
            </li>
          ))}
        </ol>
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
              it or design it from scratch.
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
