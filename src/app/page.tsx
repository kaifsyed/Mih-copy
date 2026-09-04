import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/products";
import type { Product } from "@/lib/products";
import { ProductCard } from "@/components/product/product-card";
import { whatsappLink } from "@/lib/whatsapp";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { StarField } from "@/components/home/star-field";
import {
  ArrowRightIcon,
  WhatsappIcon,
  ShieldIcon,
  DiamondIcon,
  GlobeIcon,
  SparkleIcon,
  CheckIcon,
  HeartIcon,
} from "@/components/ui/icons";

export const metadata: Metadata = {
  description:
    "MIH GEMS — natural, hand-selected coloured gemstones and bespoke fine jewellery. Discover genuine gemstones, silver rings and custom creations, offered by personal enquiry.",
};

// The homepage surfaces the live catalogue, so render per request.
export const dynamic = "force-dynamic";

const TRUST = [
  { Icon: ShieldIcon, title: "100% Genuine", text: "Natural, hand-selected stones — certified on request." },
  { Icon: DiamondIcon, title: "Premium Quality", text: "Chosen for colour, character and craftsmanship." },
  { Icon: SparkleIcon, title: "Retail & Custom", text: "Ready pieces or jewellery designed around your stone." },
  { Icon: GlobeIcon, title: "Worldwide Shipping", text: "Serving gemstone clients across India and beyond." },
];

// "The Smart Choice" — four concise, brand-focused benefits.
const SMART_CHOICE = [
  {
    Icon: SparkleIcon,
    title: "Authentic Brilliance",
    text: "Natural, hand-selected gemstones chosen for colour, character and life — never imitations, never shortcuts.",
  },
  {
    Icon: DiamondIcon,
    title: "Premium Quality",
    text: "Every piece is curated and inspected for craftsmanship, finish and the details that make fine jewellery feel timeless.",
  },
  {
    Icon: HeartIcon,
    title: "Luxury Within Reach",
    text: "Honest, personal pricing — premium gemstones and fine jewellery offered directly, without retail mark-ups.",
  },
  {
    Icon: CheckIcon,
    title: "Made to Be Remembered",
    text: "From a first ring to a one-of-one commission, every MIH GEMS piece is meant to last a lifetime of moments.",
  },
];

// "Trusted Excellence" — three balanced trust pillars. Pillars use the same
// serif / ivory / gold / eyebrow language as the rest of the homepage so the
// section feels native to the design system.
const TRUST_PILLARS = [
  {
    Icon: HeartIcon,
    eyebrow: "Beautiful stories",
    metric: "50K+",
    title: "50K+ Beautiful Stories",
    text: "Chosen for moments that deserve to shine.",
  },
  {
    Icon: ShieldIcon,
    eyebrow: "Quality assured",
    metric: "100%",
    title: "100% Quality Assured",
    text: "Quality you can trust, from carefully selected gemstones to beautifully finished jewellery.",
  },
  {
    Icon: WhatsappIcon,
    eyebrow: "Always here",
    metric: "24/7",
    title: "24/7 WhatsApp Support",
    text: "We\u2019re here whenever you need us \u2014 before, during and after your purchase.",
  },
];

const FEATURED_LIMIT = 4;

/**
 * A curated, mixed featured selection: interleave Gemstones and Jewellery so
 * both categories surface when both exist, then top up with anything remaining
 * (including legacy-category rows), preserving the newest-first order the query
 * already returns. Degrades naturally to a single category, or to an empty
 * array when there are no products.
 */
function pickFeatured(products: Product[]): Product[] {
  const gems = products.filter((p) => p.category === "Gemstones");
  const jewellery = products.filter((p) => p.category === "Jewellery");

  const mixed: Product[] = [];
  const rounds = Math.max(gems.length, jewellery.length);
  for (let i = 0; i < rounds; i++) {
    if (gems[i]) mixed.push(gems[i]);
    if (jewellery[i]) mixed.push(jewellery[i]);
  }

  const chosen = new Set(mixed.map((p) => p.id));
  const rest = products.filter((p) => !chosen.has(p.id));
  return [...mixed, ...rest].slice(0, FEATURED_LIMIT);
}

export default async function Home() {
  const products = await getProducts();
  const featured = pickFeatured(products);

  return (
    <main className="relative isolate flex flex-col">
      {/* Homepage-only decorative reflected-light layer (behind content) */}
      <StarField />
      {/* Hero — premium multi-slide carousel */}
      <HeroCarousel />

      {/* Trust badges */}
      <section className="border-b border-outline/12 bg-charcoal/40">
        <div className="container-luxe grid grid-cols-2 gap-px py-0 lg:grid-cols-4">
          {TRUST.map(({ Icon, title, text }) => (
            <div key={title} className="flex flex-col gap-2 px-2 py-8 text-center sm:px-6">
              <Icon className="mx-auto h-6 w-6 text-gold" />
              <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-ivory">
                {title}
              </p>
              <p className="text-xs leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products — live Supabase catalogue */}
      {featured.length > 0 ? (
        <section className="section-gap container-luxe">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Featured collection</p>
              <h2 className="mt-3 font-serif text-4xl text-ivory lg:text-5xl">
                Gems &amp; fine jewellery
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
                A curated selection of natural gems and fine jewellery, chosen
                for those who appreciate something truly distinctive.
              </p>
            </div>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gold transition-colors hover:text-champagne"
            >
              Explore the Collection
              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((item, i) => (
              <ProductCard key={item.id} product={item} priority={i < 4} />
            ))}
          </div>
        </section>
      ) : null}

      {/* The Smart Choice — Why Choose MIH GEMS? */}
      <section className="border-y border-outline/12 bg-charcoal/40">
        <div className="container-luxe section-gap">
          <div className="max-w-2xl">
            <p className="eyebrow">The smart choice</p>
            <h2 className="mt-3 font-serif text-4xl text-ivory lg:text-5xl">
              Why choose MIH GEMS?
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              Premium gemstones and fine jewellery, offered the way a private
              atelier should — personal, considered and built to be remembered.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4">
            {SMART_CHOICE.map(({ Icon, title, text }) => (
              <article
                key={title}
                className="flex flex-col gap-3 border border-outline/10 bg-noir/40 p-7 text-center transition-colors hover:border-gold/30"
              >
                <span className="mx-auto inline-flex h-12 w-12 items-center justify-center border border-gold/30 text-gold">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-1 font-serif text-lg text-ivory">{title}</h3>
                <p className="text-xs leading-relaxed text-muted sm:text-sm">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Excellence — Why Clients Trust MIH GEMS? */}
      <section className="container-luxe section-gap">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Trusted excellence</p>
            <h2 className="mt-3 font-serif text-4xl text-ivory lg:text-5xl">
              Why clients trust MIH GEMS?
            </h2>
          </div>
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gold transition-colors hover:text-champagne"
          >
            Our story
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Three balanced trust pillars. The 50K+ Stories pillar remains the
            emotional hero point but no longer dominates the section. No
            fabricated reviews or third-party ratings — the phrasing is brand-
            led and the data points are presented as MIH GEMS milestones. */}
        <div className="mt-12 grid grid-cols-1 gap-px border border-outline/10 bg-outline/10 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST_PILLARS.map(({ Icon, eyebrow, metric, title, text }) => (
            <article
              key={title}
              className="flex flex-col items-center gap-3 bg-noir/40 p-8 text-center transition-colors hover:bg-noir/60"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center border border-gold/30 text-gold">
                <Icon className="h-6 w-6" />
              </span>
              <p className="eyebrow">{eyebrow}</p>
              <p className="font-serif text-4xl leading-none text-gold sm:text-5xl">
                {metric}
              </p>
              <h3 className="font-serif text-lg text-ivory">{title}</h3>
              <p className="max-w-xs text-sm italic leading-relaxed text-muted">
                {text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Custom jewellery split CTA — text left, supplied image right on
          desktop; on mobile the text stacks above the image (DOM order). */}
      <section className="container-luxe section-gap">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Jewellery, your way</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-ivory lg:text-5xl">
              Start with a stone.
              <span className="block text-gold">Finish with something yours.</span>
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">
              Have a gemstone already, or a particular design in mind? Tell us
              what you&apos;re looking for and we&apos;ll help shape it into a
              piece that feels personal.
            </p>
            <Link href="/custom-jewellery" className="btn btn-gold mt-8 self-start">
              Discuss a Custom Piece
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative aspect-[5/4] overflow-hidden border border-gold/15 bg-charcoal glow-gold">
            <Image
              src="/jewellery-your-way.png"
              alt="Bespoke jewellery crafted around a natural gemstone."
              fill
              quality={85}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Consultation CTA */}
      <section className="noir-deep border-t border-gold/12">
        <div className="container-luxe section-gap text-center">
          <p className="eyebrow">Personal consultation</p>
          <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl leading-tight text-ivory lg:text-5xl">
            Looking for something specific?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted">
            Tell us the gemstone, colour, size, budget or jewellery style you
            have in mind. We&apos;ll help you find the right option.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              <WhatsappIcon className="h-4 w-4" />
              Enquire on WhatsApp
            </a>
            <Link href="/contact" className="btn btn-ghost">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
