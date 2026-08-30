import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProducts, getCategories } from "@/lib/products";
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
  const categories = getCategories(products).slice(0, 5);

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

      {/* Shop by category */}
      {categories.length > 0 ? (
        <section className="border-y border-outline/12 bg-charcoal/40">
          <div className="container-luxe section-gap">
            <p className="eyebrow">Explore</p>
            <h2 className="mt-3 font-serif text-3xl text-ivory lg:text-4xl">
              Shop by category
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/shop?category=${encodeURIComponent(category)}`}
                  className="card-luxe group flex items-center justify-between gap-2 px-5 py-6"
                >
                  <span className="font-serif text-lg text-ivory transition-colors group-hover:text-gold">
                    {category}
                  </span>
                  <ArrowRightIcon className="h-4 w-4 text-muted transition-colors group-hover:text-gold" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

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
              alt="Bespoke MIH GEMS jewellery crafted around a natural gemstone."
              fill
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
            have in mind — we&apos;ll help you find the right option.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              <WhatsappIcon className="h-4 w-4" />
              Start a WhatsApp Enquiry
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
