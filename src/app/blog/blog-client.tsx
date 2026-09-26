"use client";

import { useState, useEffect } from "react";
import { getArticles, getCategories } from "@/lib/articles";
import { ArticleCard } from "@/components/blog/article-card";

const VALID_CATEGORIES = [
  "Buying Guides",
  "Care & Maintenance",
  "Education",
  "Gifting",
] as const;

export default function BlogPageClient() {
  const [articles, setArticles] = useState<Awaited<ReturnType<typeof getArticles>>>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      const data = await getArticles();
      setArticles(data);
      setCategories(getCategories(data));
      setLoading(false);
    }
    loadArticles();
  }, []);

  const filteredArticles = activeCategory === "All"
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  const displayCategories = ["All", ...VALID_CATEGORIES.filter((c) => categories.includes(c))];

  if (loading) {
    return (
      <div className="container-luxe section-gap">
        <header className="max-w-3xl">
          <p className="eyebrow">The MIH GEMS Journal</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-ivory lg:text-5xl">
            Discover gemstone stories, jewellery guides, styling inspiration and
            everything worth knowing before you choose something that shines.
          </h1>
        </header>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <article key={i} className="card-luxe flex flex-col overflow-hidden animate-pulse">
              <div className="aspect-[16/10] bg-charcoal" />
              <div className="flex flex-1 flex-col p-5 space-y-3">
                <div className="h-5 bg-charcoal-high rounded w-1/4" />
                <div className="h-6 bg-charcoal-high rounded w-3/4" />
                <div className="h-6 bg-charcoal-high rounded w-1/2" />
                <div className="h-4 bg-charcoal-high rounded w-full" />
                <div className="h-4 bg-charcoal-high rounded w-2/3" />
                <div className="h-4 bg-charcoal-high rounded w-1/2" />
                <div className="flex items-center justify-between gap-4 pt-2 border-t border-outline/10">
                  <div className="h-3 bg-charcoal-high rounded w-1/4" />
                  <div className="h-3 bg-charcoal-high rounded w-1/4" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container-luxe section-gap">
      <header className="max-w-3xl">
        <p className="eyebrow">The MIH GEMS Journal</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-ivory lg:text-5xl">
          Discover gemstone stories, jewellery guides, styling inspiration and
          everything worth knowing before you choose something that shines.
        </h1>
      </header>

      {displayCategories.length > 1 && (
        <nav className="mt-10 flex flex-wrap gap-2" aria-label="Article categories">
          {displayCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`text-xs transition-colors ${
                activeCategory === cat
                  ? "chip-gold"
                  : "chip-silver"
              }`}
              aria-pressed={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </nav>
      )}

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article, i) => (
          <ArticleCard key={article.slug} article={article} priority={i === 0} />
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="mt-16 text-center text-muted">
          <p className="font-serif text-2xl">No articles in this category.</p>
          <p className="mt-2">Select another category to explore.</p>
        </div>
      )}
    </div>
  );
}