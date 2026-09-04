import type { ReactNode } from "react";
import Image from "next/image";
import { Logo } from "@/components/brand/logo";

/**
 * Clerk appearance mapping the built-in <SignIn/> <SignUp/> widgets onto the
 * MIH GEMS "Cinematic Noir & Gold" system. Authentication stays 100% Clerk —
 * this only restyles it (charcoal primary button with champagne-gold label,
 * ivory surface, gold accents) and hides Clerk's own header so the shell can
 * supply the "Welcome Back" heading. Google/social login appears only if it is
 * configured in the Clerk dashboard; nothing here fabricates auth.
 */
export const authAppearance = {
  layout: {
    socialButtonsPlacement: "bottom" as const,
    socialButtonsVariant: "blockButton" as const,
  },
  variables: {
    colorPrimary: "#0a0a0a",
    colorText: "#17171a",
    colorTextSecondary: "#6b6b6b",
    colorBackground: "transparent",
    colorInputBackground: "#ffffff",
    colorInputText: "#17171a",
    colorDanger: "#b3261e",
    borderRadius: "2px",
    fontFamily: "var(--font-montserrat), sans-serif",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none border-0",
    card: "bg-transparent shadow-none border-0 p-0 gap-5",
    header: "hidden",
    footer: "bg-transparent",
    formButtonPrimary:
      "!bg-noir !text-gold !uppercase !tracking-[0.14em] !text-sm !font-semibold !py-3.5 !shadow-none hover:!bg-charcoal-high",
    socialButtonsBlockButton: "!py-3 !border-black/15 !text-noir",
    footerActionLink: "!text-metallic hover:!text-gold !font-semibold",
    formFieldLabel: "!text-noir !font-semibold",
    formFieldInput: "!py-3 !bg-white !border-black/15 !text-noir",
  },
} as const;


type AuthShellProps = {
  heading: string;
  subheading: string;
  children: ReactNode;
};

export function AuthShell({ heading, subheading, children }: AuthShellProps) {
  return (
    <div className="min-h-screen w-full bg-ivory md:grid md:grid-cols-[2fr_3fr] lg:grid-cols-2">
      {/* Left — brand panel with supplied gemstone photography (hidden on mobile) */}
      <div className="relative hidden overflow-hidden bg-noir-deep md:flex md:flex-col md:justify-between md:p-10 lg:p-14">
        <Image
          src="/hero-2.png"
          alt=""
          fill
          priority
          quality={85}
          sizes="(max-width: 1024px) 40vw, 50vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-noir-deep via-noir-deep/70 to-noir-deep/40" />

        <div className="relative">
          <Logo href="/" imgClassName="h-14 w-auto lg:h-16" priority />
        </div>

        <div className="relative max-w-md">
          <span className="block h-px w-12 bg-gold/70" />
          <p className="eyebrow mt-6">Timeless Beauty, Naturally Rare</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-ivory lg:text-5xl">
            Discover
            <span className="block text-gold">the Rare</span>
          </h2>
          <span className="mt-6 block h-px w-12 bg-gold/70" />
          <p className="mt-6 text-sm leading-relaxed text-ivory/80">
            Explore exceptional natural gemstones and fine jewellery,
            thoughtfully selected for those who value beauty, rarity and
            craftsmanship.
          </p>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-[440px]">
          {/* Mobile-only logo (the left panel carries it on md+), centered with
              transparent background so it reads cleanly on the ivory panel. */}
          <div className="mb-8 flex justify-center md:hidden">
            <Logo href="/" imgClassName="h-12 w-auto" />
          </div>

          <h1 className="text-center font-serif text-3xl text-noir sm:text-4xl">
            {heading}
          </h1>
          <span
            aria-hidden
            className="mt-4 flex items-center gap-3 text-gold"
          >
            <span className="h-px flex-1 bg-gold/40" />
            <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
            <span className="h-px flex-1 bg-gold/40" />
          </span>
          <p className="mt-4 text-center text-sm leading-relaxed text-noir">
            {subheading}
          </p>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
