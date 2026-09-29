import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  className?: string;
  imgClassName?: string;
  preload?: boolean;
  /** Pass null to render the mark without wrapping it in a link. */
  href?: "/" | null;
};

/**
 * Official MIH GEMS logo (public/logo-header.png). The asset is the horizontal
 * silver "MH" monogram + gold diamond lockup with the "MIH GEMS · Gems &
 * Jewellery" wordmark, exported with a TRANSPARENT background so it sits
 * cleanly on the noir surface (the older public/logo.png had a baked-in black
 * background that showed as a dark box on lighter panels).
 *
 * The rendered height comes from `imgClassName` (e.g. h-12, h-16) and the
 * rendered width follows from `w-auto`, which preserves the asset's intrinsic
 * 1821:864 aspect ratio — the image is never stretched or cropped.
 *
 * CLS prevention does NOT require an inline width. Next/Image already reserves
 * the logo's box from the intrinsic `width`/`height` props (1821×864) under its
 * default "intrinsic" layout, so the header/footer layout is stable before the
 * wordmark decodes. The previous implementation parsed a single `h-N` token
 * out of `imgClassName` and pinned the container to that fixed pixel width —
 * because the regex matched the mobile-first `h-8` in
 * `h-8 w-auto sm:h-12 md:h-16`, the container (and therefore the logo) was
 * locked at ~17 px on every breakpoint, which is what made the logo render
 * tiny. Removing the inline width lets the responsive `h-*` classes control
 * the size at each breakpoint while the intrinsic props keep the layout
 * shift-free.
 *
 * `sizes` matters here. The lockup is 1821:864 (≈2.11:1), so the mark renders
 * far narrower than it is tall: the header mark is at most ~135 CSS px wide
 * (h-16) and the footer mark ~101 px (h-12). A `sizes` of 200/320 px made the
 * browser pick a 256w candidate for a 76 px box — several times more pixels
 * than are ever painted. The values below describe the real rendered widths
 * per breakpoint so the optimizer serves the smallest adequate candidate
 * without changing the mark's size, aspect ratio or crispness.
 */
export function Logo({
  className = "",
  imgClassName = "h-12 w-auto md:h-16",
  preload = false,
  href = "/",
}: LogoProps) {
  const img = (
    <Image
      src="/logo-header.png"
      alt="MIH GEMS — Gems & Jewellery"
      width={1821}
      height={864}
      loading={preload ? "eager" : "lazy"}
      fetchPriority={preload ? "high" : undefined}
      quality={90}
      sizes="(max-width: 360px) 68px, (max-width: 430px) 76px, (max-width: 640px) 88px, (max-width: 768px) 102px, 136px"
      className={`w-auto object-contain ${imgClassName}`}
    />
  );

  if (href === null) {
    return (
      <span className={`inline-flex items-center ${className}`}>{img}</span>
    );
  }

  return (
    <Link
      href={href}
      aria-label="MIH GEMS — home"
      className={`inline-flex items-center ${className}`}
    >
      {img}
    </Link>
  );
}