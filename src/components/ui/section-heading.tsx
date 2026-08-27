import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
};

/**
 * Editorial section header: tracked-out gold eyebrow, Playfair headline and an
 * optional supporting line. Used to open every major section consistently.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
  as = "h2",
}: SectionHeadingProps) {
  const Heading = as;
  const alignment =
    align === "center" ? "items-center text-center mx-auto" : "items-start text-left";

  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignment} ${className}`}>
      {eyebrow ? (
        <span className="eyebrow inline-flex items-center gap-3">
          {align === "center" ? (
            <span className="h-px w-8 bg-gold/50" aria-hidden />
          ) : null}
          {eyebrow}
          {align === "center" ? (
            <span className="h-px w-8 bg-gold/50" aria-hidden />
          ) : null}
        </span>
      ) : null}
      <Heading className="font-serif text-3xl leading-tight md:text-4xl lg:text-[2.75rem]">
        {title}
      </Heading>
      {description ? (
        <p className="text-sm leading-relaxed text-muted md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
