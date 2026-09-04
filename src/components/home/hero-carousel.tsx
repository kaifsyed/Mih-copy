"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { whatsappLink } from "@/lib/whatsapp";
import { ChevronRightIcon, WhatsappIcon } from "@/components/ui/icons";

type Cta = { label: string; href: string; whatsapp?: boolean };

type Slide = {
  key: string;
  eyebrow: string;
  title: string;
  accent: string;
  copy: string;
  image: string;
  primary: Cta;
  secondary?: Cta;
};

const INTERVAL = 5000;

// Slides pair the supplied MIH GEMS photography (public/hero-*.png) with copy.
// Each image has its subject on the right, so the legibility scrim + text sit
// on the left. No fabricated prices, product data or business claims.
const SLIDES: Slide[] = [
  {
    key: "signature",
    eyebrow: "MIH GEMS · Signature Collection",
    title: "Discover the beauty of",
    accent: "genuine gems.",
    copy: "Natural, hand-selected coloured gemstones and fine jewellery, chosen for colour, character and craftsmanship, and offered by personal enquiry.",
    image: "/hero-1.png",
    primary: { label: "Shop Collection", href: "/shop" },
    secondary: { label: "Custom Jewellery", href: "/custom-jewellery" },
  },
  {
    key: "birthstones",
    eyebrow: "Personal Gems & Birthstones",
    title: "Find the stone that is",
    accent: "truly yours.",
    copy: "From sapphires to emeralds, explore natural gemstones and personal birthstones. Enquire for availability, certification and pricing.",
    image: "/hero-2.png",
    primary: { label: "Explore Gemstones", href: "/shop" },
    secondary: { label: "Enquire on WhatsApp", href: whatsappLink(), whatsapp: true },
  },
  {
    key: "custom",
    eyebrow: "Jewellery, your way",
    title: "Start with a stone.",
    accent: "Finish with something yours.",
    copy: "Have a gemstone already, or a particular design in mind? We'll help shape it into a bespoke piece that feels personal.",
    image: "/hero-3.png",
    primary: { label: "Discuss a Custom Piece", href: "/custom-jewellery" },
    secondary: { label: "View the Collection", href: "/shop" },
  },
  {
    key: "wholesale",
    eyebrow: "Trade & Wholesale",
    title: "Sourcing gemstones",
    accent: "at scale.",
    copy: "For retailers and jewellers — enquire about wholesale gemstone sourcing tailored to your requirements.",
    image: "/hero-4.png",
    primary: { label: "Wholesale Enquiries", href: "/wholesale" },
    secondary: { label: "About MIH GEMS", href: "/about" },
  },
];


function CtaLink({ cta, gold }: { cta: Cta; gold: boolean }) {
  if (cta.whatsapp) {
    return (
      <a
        href={cta.href}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-whatsapp"
      >
        <WhatsappIcon className="h-4 w-4" />
        {cta.label}
      </a>
    );
  }
  return (
    <Link href={cta.href} className={`btn ${gold ? "btn-gold" : "btn-ghost"}`}>
      {cta.label}
      {gold ? <ChevronRightIcon className="h-4 w-4" /> : null}
    </Link>
  );
}

// Horizontal travel (px) required before a touch gesture counts as a swipe.
const SWIPE_THRESHOLD = 40;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = SLIDES.length;

  const next = () => setIndex((i) => (i + 1) % count);
  const prev = () => setIndex((i) => (i - 1 + count) % count);

  // Autoplay, honouring prefers-reduced-motion and pausing on interaction.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % count),
      INTERVAL,
    );
    return () => window.clearInterval(id);
  }, [paused, count]);

  // Touch swipe: track the start point and act on release. Only a
  // predominantly-horizontal drag past the threshold changes slides, so
  // vertical page scrolling and taps on the CTA buttons are unaffected. No
  // preventDefault, so the page never blocks native scroll or causes overflow.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }
  function onTouchEnd(e: React.TouchEvent) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) <= Math.abs(dy)) return;
    if (dx < 0) next();
    else prev();
  }

  return (
    <section
      className="relative touch-pan-y overflow-hidden border-b border-gold/12 bg-noir-deep"
      aria-roledescription="carousel"
      aria-label="MIH GEMS featured highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Fixed min-heights + centred content with generous padding guarantee
          the eyebrow, heading, copy and CTAs always sit inside the hero and
          never clip into the following section at any breakpoint. */}
      <div className="relative min-h-[34rem] sm:min-h-[36rem] lg:min-h-[44rem]">
        {SLIDES.map((slide, i) => {
          const active = i === index;
          // Render the photography only for the active slide and its immediate
          // neighbours so the optimizer isn't asked to transcode all four
          // ~2 MB PNGs up front. The slide slot itself stays in the DOM at the
          // same coordinates, so opacity transitions and the legibility scrims
          // remain visually continuous. A tonal placeholder covers any slide
          // whose image has not yet been mounted, so transitions never flash
          // onto a transparent layer.
          const prevIndex = (index - 1 + count) % count;
          const nextIndex = (index + 1) % count;
          const mountImage = active || i === prevIndex || i === nextIndex;
          return (
            <div
              key={slide.key}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!active}
              className={`absolute inset-0 transition-opacity duration-[900ms] ease-out motion-reduce:transition-none ${active ? "opacity-100" : "pointer-events-none opacity-0"}`}
            >
              {/* Tonal placeholder — sits behind the photo so slides without a
                  mounted image still render as a dark luxe surface rather
                  than transparent black. */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-noir-deep via-noir to-charcoal-high"
              />
              {mountImage ? (
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  priority={i === 0}
                  loading={i === 0 ? undefined : "lazy"}
                  quality={85}
                  sizes="100vw"
                  className="object-cover object-right"
                />
              ) : null}
              {/* Legibility scrims — darken the left where copy sits */}
              <div className="absolute inset-0 bg-gradient-to-r from-noir-deep via-noir-deep/85 to-noir-deep/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-noir-deep/85 via-transparent to-noir-deep/40" />

              {/* Content */}
              <div className="container-luxe relative flex h-full min-h-[34rem] flex-col justify-center py-16 sm:min-h-[36rem] sm:py-20 lg:min-h-[44rem] lg:py-28">
                <div
                  className={`max-w-xl transition-all duration-700 motion-reduce:transition-none ${active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                >
                  <p className="eyebrow">{slide.eyebrow}</p>
                  <h1 className="mt-5 font-serif text-4xl leading-[1.08] text-ivory sm:text-5xl lg:text-6xl">
                    {slide.title}
                    <span className="block text-gold">{slide.accent}</span>
                  </h1>
                  <p className="mt-6 max-w-lg text-sm leading-relaxed text-ivory/80 sm:text-base">
                    {slide.copy}
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                    <CtaLink cta={slide.primary} gold />
                    {slide.secondary ? (
                      <CtaLink cta={slide.secondary} gold={false} />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {/* Prev / next controls */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-gold/25 bg-noir/50 text-ivory backdrop-blur-sm transition hover:border-gold/60 hover:text-gold sm:inline-flex"
        >
          <ChevronRightIcon className="h-5 w-5 rotate-180" />
        </button>
        <button
          type="button"
          onClick={next}
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
              className={`h-2 rounded-full transition-all ${i === index ? "w-8 bg-gold" : "w-2 bg-ivory/40 hover:bg-ivory/70"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

