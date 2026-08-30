"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { PRODUCT_CATEGORIES, JEWELLERY_SUBCATEGORIES } from "@/lib/products";
import { sortPriceValue } from "@/lib/pricing";
import { whatsappLink } from "@/lib/whatsapp";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { EmptyState } from "@/components/ui/states";
import {
  FilterIcon,
  SearchIcon,
  DiamondIcon,
  WhatsappIcon,
} from "@/components/ui/icons";

const PAGE_SIZE = 9;

type Availability = "All" | "Available" | "Enquire";
type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest Arrivals" },
];

type ShopClientProps = {
  products: Product[];
  initialCategory?: string;
  initialQuery?: string;
};

export default function ShopClient({
  products,
  initialCategory = "All",
  initialQuery = "",
}: ShopClientProps) {
  // Exactly two customer-facing categories, plus "All". Fixed rather than
  // derived from the catalogue so the filter is stable even when a legacy row
  // carries some other category value (such rows simply appear under "All").
  const categories = ["All", ...PRODUCT_CATEGORIES];

  const availabilityCounts = useMemo(
    () => ({
      Available: products.filter((p) => p.status === "Available").length,
      Enquire: products.filter((p) => p.status === "Enquire").length,
    }),
    [products],
  );

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(
    categories.includes(initialCategory) ? initialCategory : "All",
  );
  // Secondary filter, only meaningful when category === "Jewellery".
  const [subcategory, setSubcategory] = useState<string>("All");
  const [availability, setAvailability] = useState<Availability>("All");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = priceMin.trim() === "" ? null : Number(priceMin);
    const max = priceMax.trim() === "" ? null : Number(priceMax);
    const hasMin = min !== null && Number.isFinite(min);
    const hasMax = max !== null && Number.isFinite(max);

    let list = products.filter((p) => {
      if (q) {
        const haystack = [p.name, p.category, p.detail]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (category !== "All" && p.category !== category) return false;
      // Jewellery sub-type filter only applies within the Jewellery category.
      if (
        category === "Jewellery" &&
        subcategory !== "All" &&
        p.subcategory !== subcategory
      ) {
        return false;
      }
      if (availability !== "All" && p.status !== availability) return false;

      if (hasMin || hasMax) {
        const value = sortPriceValue(p);
        if (value === null) return false; // enquiry-only excluded when filtering by price
        if (hasMin && value < (min as number)) return false;
        if (hasMax && value > (max as number)) return false;
      }
      return true;
    });

    const byPrice = (a: Product, b: Product, dir: 1 | -1) => {
      const av = sortPriceValue(a);
      const bv = sortPriceValue(b);
      if (av === null && bv === null) return 0;
      if (av === null) return 1; // enquiry-only always last
      if (bv === null) return -1;
      return (av - bv) * dir;
    };

    list = [...list];
    if (sort === "price-asc") list.sort((a, b) => byPrice(a, b, 1));
    else if (sort === "price-desc") list.sort((a, b) => byPrice(a, b, -1));
    else if (sort === "newest")
      list.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    else
      // featured: in-stock first, otherwise preserve source order
      list.sort(
        (a, b) =>
          (a.status === "Available" ? 0 : 1) -
          (b.status === "Available" ? 0 : 1),
      );

    return list;
  }, [products, query, category, subcategory, availability, priceMin, priceMax, sort]);

  // Reset pagination whenever the result set changes. Comparing the previous
  // value in state (the React "adjust state during render" pattern) avoids a
  // setState-in-effect while staying compatible with the React Compiler.
  const filterSig = `${query}|${category}|${subcategory}|${availability}|${priceMin}|${priceMax}|${sort}`;
  const [prevSig, setPrevSig] = useState(filterSig);
  if (prevSig !== filterSig) {
    setPrevSig(filterSig);
    setVisible(PAGE_SIZE);
  }

  const shown = filtered.slice(0, visible);
  const hasActiveFilters =
    query.trim() !== "" ||
    category !== "All" ||
    subcategory !== "All" ||
    availability !== "All" ||
    priceMin.trim() !== "" ||
    priceMax.trim() !== "";

  const resetFilters = () => {
    setQuery("");
    setCategory("All");
    setSubcategory("All");
    setAvailability("All");
    setPriceMin("");
    setPriceMax("");
  };

  // Selecting a primary category resets the Jewellery sub-type so a stale
  // "Rings" selection can't silently hide products after switching category.
  const selectCategory = (next: string) => {
    setCategory(next);
    setSubcategory("All");
  };

  return (
    <div className="container-luxe section-gap">
      <SectionHeading
        as="h1"
        align="left"
        eyebrow="MIH GEMS Collection"
        title="Curated gemstones"
        description="Explore natural gemstones selected for quality, character and beauty. Filter by category, availability and price — then enquire on the pieces that speak to you."
      />

      <div className="mt-12 flex flex-col gap-8 lg:flex-row">
        {/* ------------------------------------------------------- Filters */}
        <aside className="lg:w-72 lg:shrink-0">
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className="btn btn-ghost btn-block lg:hidden"
            aria-expanded={showFilters}
          >
            <FilterIcon className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Filters"}
          </button>

          <div
            className={`${showFilters ? "block" : "hidden"} mt-4 flex flex-col gap-8 lg:mt-0 lg:block lg:space-y-8`}
          >
            {/* Search */}
            <div>
              <label htmlFor="shop-search" className="field-label">
                Search
              </label>
              <div className="relative">
                <input
                  id="shop-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Sapphire, emerald…"
                  className="input-luxe pr-10"
                />
                <SearchIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              </div>
            </div>

            {/* Categories */}
            <fieldset>
              <legend className="field-label">Category</legend>
              <div className="flex flex-col">
                {categories.map((c) => {
                  const active = category === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => selectCategory(c)}
                      aria-pressed={active}
                      className={`flex items-center justify-between border-b border-outline/15 py-2.5 text-left text-sm transition-colors last:border-b-0 ${
                        active ? "text-gold" : "text-muted hover:text-ivory"
                      }`}
                    >
                      <span>{c === "All" ? "All Products" : c}</span>
                      {active ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Jewellery sub-type — only shown while Jewellery is selected, as a
                natural secondary filter under the primary categories. */}
            {category === "Jewellery" ? (
              <fieldset>
                <legend className="field-label">Jewellery type</legend>
                <div className="flex flex-col">
                  {["All", ...JEWELLERY_SUBCATEGORIES].map((s) => {
                    const active = subcategory === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSubcategory(s)}
                        aria-pressed={active}
                        className={`flex items-center justify-between border-b border-outline/15 py-2.5 text-left text-sm transition-colors last:border-b-0 ${
                          active ? "text-gold" : "text-muted hover:text-ivory"
                        }`}
                      >
                        <span>{s === "All" ? "All Jewellery" : s}</span>
                        {active ? (
                          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ) : null}

            {/* Availability */}
            <fieldset>
              <legend className="field-label">Availability</legend>
              <div className="flex flex-col gap-2">
                {(
                  [
                    { key: "All", label: "All" },
                    {
                      key: "Available",
                      label: `In Stock (${availabilityCounts.Available})`,
                    },
                    {
                      key: "Enquire",
                      label: `Enquire (${availabilityCounts.Enquire})`,
                    },
                  ] as { key: Availability; label: string }[]
                ).map((opt) => (
                  <label
                    key={opt.key}
                    className="flex cursor-pointer items-center gap-3 text-sm text-muted"
                  >
                    <input
                      type="radio"
                      name="availability"
                      checked={availability === opt.key}
                      onChange={() => setAvailability(opt.key)}
                      className="h-3.5 w-3.5 accent-gold"
                    />
                    <span
                      className={
                        availability === opt.key ? "text-ivory" : undefined
                      }
                    >
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Price range */}
            <fieldset>
              <legend className="field-label">Price range (₹)</legend>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  placeholder="Min"
                  className="input-luxe"
                  aria-label="Minimum price"
                />
                <span className="text-muted">–</span>
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  placeholder="Max"
                  className="input-luxe"
                  aria-label="Maximum price"
                />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted/80">
                Enquiry-only pieces are hidden while a price range is set.
              </p>
            </fieldset>

            {hasActiveFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-gold"
              >
                Clear all filters
              </button>
            ) : null}
          </div>
        </aside>

        {/* -------------------------------------------------------- Results */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline/15 pb-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">
              {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
            </p>
            <div className="flex items-center gap-3">
              <label
                htmlFor="shop-sort"
                className="text-xs uppercase tracking-[0.18em] text-muted"
              >
                Sort
              </label>
              <select
                id="shop-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="input-luxe w-auto py-2 text-sm"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {shown.length > 0 ? (
            <>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {shown.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priority={i < 3}
                  />
                ))}
              </div>

              {visible < filtered.length ? (
                <div className="mt-12 flex flex-col items-center gap-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">
                    Showing {shown.length} of {filtered.length}
                  </p>
                  <button
                    type="button"
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="btn btn-ghost"
                  >
                    Load More
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="mt-8">
              <EmptyState
                icon={<DiamondIcon className="h-6 w-6" />}
                title="No pieces match your filters"
                message={
                  products.length === 0
                    ? "Our collection is being curated. Send us a message and we'll share what's currently available."
                    : "Try adjusting or clearing your filters to see more of the collection."
                }
                action={
                  products.length === 0 ? (
                    <a
                      href={whatsappLink(
                        "Hi MIH GEMS, I'd like to know what gemstones are currently available.",
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp"
                    >
                      <WhatsappIcon className="h-4 w-4" />
                      Enquire on WhatsApp
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="btn btn-gold"
                    >
                      Clear Filters
                    </button>
                  )
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
