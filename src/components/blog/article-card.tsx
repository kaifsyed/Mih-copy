"use client";

import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/articles";
import { formatArticleDate } from "@/lib/articles";
import { ArrowRightIcon } from "@/components/ui/icons";

type ArticleCardProps = {
  article: Article;
  priority?: boolean;
};

export function ArticleCard({ article, priority = false }: ArticleCardProps) {
  return (
    <article className="card-luxe flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1">
      {article.featuredImage ? (
        <Link href={`/blog/${article.slug}`} className="relative aspect-[16/10] overflow-hidden group">
            <Image
              src={article.featuredImage}
              alt={`Cover image for "${article.title}"`}
              fill
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : undefined}
              quality={85}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
        </Link>
      ) : (
        <Link
          href={`/blog/${article.slug}`}
          className="relative aspect-[16/10] overflow-hidden bg-charcoal"
        >
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-serif text-2xl tracking-[0.1em] text-ivory/40">
              MIH GEMS Journal
            </span>
          </div>
        </Link>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-col gap-3">
          <span className="chip-gold text-xs self-start">{article.category}</span>
          <Link href={`/blog/${article.slug}`} className="group">
            <h3 className="font-serif text-xl leading-tight text-ivory group-hover:text-gold transition-colors line-clamp-2">
              {article.title}
            </h3>
          </Link>
          <p className="text-sm leading-relaxed text-muted line-clamp-3 flex-1">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-outline/10">
            <time dateTime={article.date} className="text-[0.68rem] uppercase tracking-[0.14em] text-muted">
              {formatArticleDate(article.date)}
            </time>
            <span className="text-[0.68rem] uppercase tracking-[0.14em] text-muted">
              {article.readingTime}
            </span>
          </div>
        </div>
        {/* The visible CTA keeps the existing short "Read More" label so the
            card design is unchanged, but the link's accessible name is built
            from the article title so screen readers and link audits get a
            destination-specific description instead of a generic one. The
            title is not repeated visually — it already appears as the card
            heading directly above. */}
        <Link
          href={`/blog/${article.slug}`}
          aria-label={`Read the full article: ${article.title}`}
          className="mt-4 group inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gold transition-colors hover:text-champagne"
        >
          Read More
          <span className="sr-only"> — {article.title}</span>
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}