"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { whatsappLink } from "@/lib/whatsapp";
import { ChevronRightIcon, WhatsappIcon } from "@/components/ui/icons";

type Cta = { label: string; href: string; whatsapp?: boolean };

type Slide = {
  key: string;
  eyebrow: string;
  title: string;
  accent: string;
  copy: string;
  primary: Cta;
  secondary?: Cta;
  motif: string;
};

const INTERVAL = 6500;

const SLIDES: Slide[] = [
  {
    key: "signature",
    eyebrow: "MIH GEMS · Signature Gemstones",
    title: "Discover the beauty of",
    accent: "genuine gems.",
    copy: "Natural, hand-selected coloured gemstones — chosen for colour, character and craftsmanship, and offered by personal enquiry.",
    primary: { label: "Shop Collection", href: "/shop" },
    secondary: { label: "Custom Jewellery", href: "/custom-jewellery" },
    motif: "from-silver/30 via-gold/15 to-noir-deep",
  },
  {
    key: "birthstones",
    eyebrow: "Personal Gems",
    title: "Find the stone that is",
    accent: "truly yours.",
    copy: "From sapphires to emeralds, explore natural gemstones and personal birthstones — enquire for availability, certification and pricing.",
    primary: { label: "Explore Gemstones", href: "/shop" },
    secondary: { label: "Enquire on WhatsApp", href: whatsappLink(), whatsapp: true },
    motif: "from-gold/25 via-metallic/15 to-noir-deep",
  },
  {
    key: "custom",
    eyebrow: "Jewellery, your way",
    title: "Start with a stone.",
    accent: "Finish with something yours.",
    copy: "Have a gemstone already, or a particular design in mind? We'll help shape it into a piece that feels personal.",
    primary: { label: "Discuss a Custom Piece", href: "/custom-jewellery" },
    motif: "from-champagne/20 via-gold/10 to-noir-deep",
  },
  {
    key: "wholesale",
    eyebrow: "Trade & Wholesale",
    title: "Sourcing gemstones",
    accent: "at scale.",
    copy: "For retailers and jewellers — enquire about wholesale gemstone sourcing tailored to your requirements.",
    primary: { label: "Wholesale Enquiries", href: "/wholesale" },
    motif: "from-silver/25 via-outline/15 to-noir-deep",
  },
];

function CtaLink({ cta, gold }: { cta: Cta; gold: boolean }) {
  const className = `btn ${gold ? "btn-gold" : "btn-ghost"}`;
  if (cta.whatsapp) {
    return (
      <a href={cta.href} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
        <WhatsappIcon className="h-4 w-4" />
        {cta.label}
      </a>
    );
  }
  return (
    <Link href={cta.href} className={className}>
      {cta.label}
      {gold ? <ChevronRightIcon className="h-4 w-4" /> : null}
    </Link>
  );
}

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = SLIDES.length;

  // Autoplay, honouring prefers-reduced-motion and pausing on interaction.
  // setState runs in the timer callback (not synchronously in the effect body),
  // so this stays compatible with the React Compiler.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % count),
      INTERVAL,
    );
    return () => window.clearInterval(id);
  }, [paused, count]);

  return (
    <section
      className="noir-deep relative overflow-hidden border-b border-gold/12"
      aria-roledescription="carousel"
      aria-label="MIH GEMS featured highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative min-h-[72vh] lg:min-h-[80vh]">
        {SLIDES.map((slide, i) => {
          const active = i === index;
          return (
            <div
              key={slide.key}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!active}
              className={`absolute inset-0 transition-opacity duration-[900ms] ease-out motion-reduce:transition-none ${active ? "opacity-100" : "pointer-events-none opacity-0"}`}
            >
              <div className="container-luxe relative grid h-full min-h-[72vh] items-center gap-12 py-20 lg:min-h-[80vh] lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
                <div className={`transition-all duration-700 motion-reduce:transition-none ${active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                  <p className="eyebrow">{slide.eyebrow}</p>
                  <h1 className="mt-6 font-serif text-5xl leading-[1.05] text-ivory sm:text-6xl lg:text-7xl">
                    {slide.title}
                    <span className="block text-gold">{slide.accent}</span>
                  </h1>
                  <p className="mt-7 max-w-xl text-base leading-relaxed text-muted">
                    {slide.copy}
                  </p>
                  <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                    <CtaLink cta={slide.primary} gold />
                    {slide.secondary ? (
                      <CtaLink cta={slide.secondary} gold={false} />
                    ) : null}
                  </div>
                </div>

                <div className="relative mx-auto hidden aspect-[4/5] w-full max-w-md lg:block">
                  <div className="absolute inset-0 glow-gold" />
                  <div className="relative flex h-full w-full items-center justify-center overflow-hidden border border-gold/20 bg-charcoal">
                    <div className={`h-48 w-48 rotate-45 border border-gold/50 bg-gradient-to-br ${slide.motif}`} />
                    <span className="absolute inset-x-0 bottom-8 flex justify-center">
                      <Logo href={null} imgClassName="h-12 w-auto opacity-80" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Prev / next controls */}
        <button
          type="button"
          onClick={() => setIndex((i) => (i - 1 + count) % count)}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-gold/25 bg-noir/50 text-ivory backdrop-blur-sm transition hover:border-gold/60 hover:text-gold sm:inline-flex"
        >
          <ChevronRightIcon className="h-5 w-5 rotate-180" />
        </button>
        <button
          type="button"
          onClick={() => setIndex((i) => (i + 1) % count)}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-gold/25 bg-noir/50 text-ivory backdrop-blur-sm transition hover:border-gold/60 hover:text-gold sm:inline-flex"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>

        {/* Slide indicators */}
        <div
          role="tablist"
          aria-label="Choose a slide to display"
          className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2.5"
        >
          {SLIDES.map((slide, i) => (
            <button
              key={slide.key}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show slide ${i + 1}: ${slide.eyebrow}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${i === index ? "w-8 bg-gold" : "w-2 bg-ivory/30 hover:bg-ivory/60"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
