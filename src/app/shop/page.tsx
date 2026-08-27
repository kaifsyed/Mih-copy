"use client";

import { useState } from "react";
import Link from "next/link";
import { products } from "@/lib/products";

const whatsappNumber = "919663140305";

const categories = [
  "All",
  "Blue Sapphire",
  "Ruby",
  "Emerald",
  "Yellow Sapphire",
  "Amethyst",
  "Garnet",
];

function whatsappLink(productName: string) {
  const message = `Hi MIH GEMS, I'm interested in the ${productName}. Please share the details and price.`;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function gemstoneGradient(color: string) {
  if (color === "blue") {
    return "bg-gradient-to-br from-[#466c8d] via-[#20384b] to-[#0b141c]";
  }

  if (color === "red") {
    return "bg-gradient-to-br from-[#73363d] via-[#39151c] to-[#14090b]";
  }

  return "bg-gradient-to-br from-[#55705d] via-[#243c2b] to-[#0b140d]";
}

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [wishlist, setWishlist] = useState<string[]>([]);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) => product.category === selectedCategory
        );

  function toggleWishlist(slug: string) {
    setWishlist((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug]
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0a09] text-[#f5efe5]">
      {/* Navigation */}
      <header className="border-b border-[#c9a45c]/20 bg-[#0b0a09]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link
            href="/"
            className="text-xl font-semibold tracking-[0.25em]"
          >
            MIH GEMS
          </Link>

          <div className="hidden items-center gap-8 text-sm text-[#d8d0c4] md:flex">
            <Link href="/" className="transition hover:text-[#d7b56d]">
              Home
            </Link>

            <Link
              href="/shop"
              className="text-[#d7b56d]"
            >
              Shop
            </Link>

            <Link
              href="/wishlist"
              className="transition hover:text-[#d7b56d]"
            >
              Wishlist ♡
            </Link>

            <Link
              href="/account"
              className="transition hover:text-[#d7b56d]"
            >
              Account
            </Link>
          </div>

          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[#c9a45c]/50 px-4 py-2 text-xs font-medium text-[#e4c887] transition hover:bg-[#c9a45c] hover:text-[#0b0a09]"
          >
            WhatsApp
          </a>
        </nav>
      </header>

      {/* Shop Header */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.35em] text-[#d7b56d]">
            MIH GEMS COLLECTION
          </p>

          <h1 className="mt-4 text-5xl font-light tracking-tight sm:text-6xl">
            Explore our gemstones
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[#a9a093]">
            Discover natural gemstones carefully selected for quality,
            character and beauty. Contact us directly for availability,
            certification and pricing.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mt-12 flex flex-wrap gap-3">
          {categories.map((category) => {
            const active = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full border px-5 py-2.5 text-xs transition ${
                  active
                    ? "border-[#d7b56d] bg-[#d7b56d] text-[#0b0a09]"
                    : "border-[#c9a45c]/20 text-[#c9a45c] hover:border-[#d7b56d] hover:bg-[#d7b56d] hover:text-[#0b0a09]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Product Count */}
        <div className="mt-8 text-xs uppercase tracking-[0.18em] text-[#756d62]">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "stone" : "stones"}
        </div>

        {/* Products */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.slug);

            return (
              <article
                key={product.slug}
                className="group overflow-hidden rounded-2xl border border-[#c9a45c]/15 bg-[#100f0d]"
              >
                {/* Product Image Area */}
                <Link
                  href={`/shop/${product.slug}`}
                  className="block"
                >
                  <div className="flex aspect-[4/5] items-center justify-center bg-gradient-to-br from-[#1b1814] to-[#090807]">
                    <div
                      className={`h-32 w-32 rotate-45 rounded-[1.5rem] border border-[#d7b56d]/40 shadow-2xl transition duration-500 group-hover:scale-110 ${gemstoneGradient(
                        product.color
                      )}`}
                    />
                  </div>
                </Link>

                {/* Product Information */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <Link
                      href={`/shop/${product.slug}`}
                      className="min-w-0"
                    >
                      <p className="text-xs uppercase tracking-[0.18em] text-[#82796c]">
                        {product.category}
                      </p>

                      <h2 className="mt-2 text-xl font-light text-[#eee5d8] transition hover:text-[#d7b56d]">
                        {product.name}
                      </h2>
                    </Link>

                    {/* Wishlist */}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.slug)}
                      aria-label={
                        isWishlisted
                          ? `Remove ${product.name} from wishlist`
                          : `Add ${product.name} to wishlist`
                      }
                      className={`shrink-0 text-2xl transition ${
                        isWishlisted
                          ? "text-[#d7b56d]"
                          : "text-[#82796c] hover:text-[#d7b56d]"
                      }`}
                    >
                      {isWishlisted ? "♥" : "♡"}
                    </button>
                  </div>

                  <p className="mt-3 text-sm text-[#a59b8d]">
                    {product.detail}
                  </p>

                  <p className="mt-1 text-sm text-[#a59b8d]">
                    {product.carat}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <span className="text-xs uppercase tracking-wider text-[#756d62]">
                      {product.status}
                    </span>

                    <div className="flex items-center gap-4">
                      <Link
                        href={`/shop/${product.slug}`}
                        className="text-sm text-[#a59b8d] transition hover:text-[#eee5d8]"
                      >
                        View
                      </Link>

                      <a
                        href={whatsappLink(product.name)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-[#d7b56d] transition hover:text-[#f0dca9]"
                      >
                        Enquire →
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-lg text-[#a9a093]">
              No gemstones found in this collection.
            </p>

            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className="mt-5 text-sm text-[#d7b56d] hover:text-[#f0dca9]"
            >
              View all gemstones →
            </button>
          </div>
        )}
      </section>
    </main>
  );
}