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
 * Official MIH GEMS logo (public/logo.png). The asset is a silver "MH"
 * monogram + gold diamond on a near-black field, so it sits seamlessly on the
 * noir surface.
 */
export function Logo({
  className = "",
  imgClassName = "h-11 w-auto md:h-14",
  priority = false,
  href = "/",
}: LogoProps) {
  const img = (
    <Image
      src="/logo.png"
      alt="MIH GEMS — Gems & Jewellery"
      width={300}
      height={200}
      priority={priority}
      sizes="(max-width: 768px) 130px, 180px"
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
