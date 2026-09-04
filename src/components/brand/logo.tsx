import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** Pass null to render the mark without wrapping it in a link. */
  href?: "/" | null;
};

/**
 * Official MIH GEMS logo (public/logo-header.png). The asset is the horizontal
 * silver "MH" monogram + gold diamond lockup with the "MIH GEMS · Gems &
 * Jewellery" wordmark, exported with a TRANSPARENT background so it sits
 * cleanly on the noir surface (the older public/logo.png had a baked-in black
 * background that showed as a dark box on lighter panels).
 */
export function Logo({
  className = "",
  imgClassName = "h-12 w-auto md:h-16",
  priority = false,
  href = "/",
}: LogoProps) {
  const img = (
    <Image
      src="/logo-header.png"
      alt="MIH GEMS — Gems & Jewellery"
      width={1821}
      height={864}
      priority={priority}
      quality={90}
      sizes="(max-width: 768px) 200px, 320px"
      className={`w-auto object-contain ${imgClassName}`}
    />
  );

  if (href === null) {
    return <span className={`inline-flex items-center ${className}`}>{img}</span>;
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
