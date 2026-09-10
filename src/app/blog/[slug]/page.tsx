import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles } from "@/lib/articles";
import { ArticleShareButton } from "@/components/blog/article-share-button";
import { ArticleCard } from "@/components/blog/article-card";
import { ArrowRightIcon } from "@/components/ui/icons";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article not found" };
  }

  const description = article.excerpt;
  const url = `${SITE_URL}/blog/${article.slug}`;
  const imageUrl = article.featuredImage
    ? `${SITE_URL}${article.featuredImage}`
    : `${SITE_URL}/logo-header.png`;

  return {
    title: article.title,
    description,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      title: article.title,
      description,
      type: "article",
      url,
      publishedTime: article.date,
      authors: ["MIH GEMS"],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 675,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: article.featuredImage ? "summary_large_image" : "summary",
      title: article.title,
      description,
      images: article.featuredImage ? [imageUrl] : [imageUrl],
    },
    other: {
      "article:published_time": article.date,
      "article:author": "MIH GEMS",
      "article:section": article.category,
      "article:tag": article.category,
    },
  };
}

function ArticleJsonLd({ article }: { article: Awaited<ReturnType<typeof getArticleBySlug>> }) {
  if (!article) return null;

  const url = `${SITE_URL}/blog/${article.slug}`;
  const imageUrl = article.featuredImage
    ? `${SITE_URL}${article.featuredImage}`
    : `${SITE_URL}/logo-header.png`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: imageUrl,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@type": "Organization",
      name: "MIH GEMS",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo-header.png`,
      },
    },
    publisher: {
      "@type": "Organization",
      name: "MIH GEMS",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo-header.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = await getArticles();
  const related = allArticles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  return (
    <article className="container-luxe section-gap">
      <ArticleJsonLd article={article} />

      <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.18em] text-muted">
        <Link href="/blog" className="transition-colors hover:text-gold">
          Journal
        </Link>
        <span className="mx-2 text-outline">/</span>
        <span className="text-ivory">{article.category}</span>
        <span className="mx-2 text-outline">/</span>
        <span className="text-ivory">{article.title}</span>
      </nav>

      <header className="mt-10 max-w-4xl mx-auto">
        <span className="chip-gold">{article.category}</span>
        <h1 className="mt-6 font-serif text-4xl leading-tight text-ivory lg:text-5xl xl:text-6xl">
          {article.title}
        </h1>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted">
          <time dateTime={article.date}>
            {new Date(article.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          <span aria-hidden="true">·</span>
          <span>{article.readingTime}</span>
        </div>
      </header>

      {article.featuredImage && (
        <div className="mt-10 relative aspect-[16/9] overflow-hidden border border-outline/20 max-w-4xl mx-auto">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              priority
              quality={85}
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
        </div>
      )}

      <div className="mt-10 max-w-4xl mx-auto">
        <div
          className="prose prose-invert max-w-none text-ivory/80"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <div className="mt-12 flex items-center gap-4 pt-8 border-t border-outline/12">
          <ArticleShareButton
            articleTitle={article.title}
            articleSlug={article.slug}
          />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 border-t border-outline/12 pt-16">
          <h2 className="font-serif text-2xl text-ivory lg:text-3xl">
            You may also like
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, i) => (
              <ArticleCard key={item.slug} article={item} priority={i === 0} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-16 text-center">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gold transition-colors hover:text-champagne"
        >
          Back to Journal
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}