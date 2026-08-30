"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Show } from "@clerk/nextjs";
import { Logo } from "@/components/brand/logo";
import {
  BagIcon,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
  WhatsappIcon,
} from "@/components/ui/icons";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";
import { useHydrated } from "@/lib/use-hydrated";
import { whatsappLink } from "@/lib/whatsapp";
import { isActivePath, isChromeless, PRIMARY_NAV } from "@/components/layout/chrome";

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-2 -top-2 flex h-4.5 min-w-4.5 items-center justify-center bg-gold px-1 text-[0.6rem] font-semibold leading-none text-noir">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { items: wishlistItems } = useWishlist();
  const { count: cartCount } = useCart();

  const hydrated = useHydrated();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Close overlays on navigation. Comparing the previous pathname in state (the
  // React "adjust state during render" pattern) avoids a setState-in-effect and
  // stays compatible with the React Compiler.
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    if (menuOpen) setMenuOpen(false);
    if (searchOpen) setSearchOpen(false);
  }

  // Lock body scroll while an overlay is open + Escape to close.
  useEffect(() => {
    const open = menuOpen || searchOpen;
    document.body.style.overflow = open ? "hidden" : "";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  if (isChromeless(pathname)) return null;

  const wishlistCount = hydrated ? wishlistItems.length : 0;
  const cartBadge = hydrated ? cartCount : 0;

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gold/12 smoked-glass">
      {/* Slim brand strip */}
      <div className="hidden border-b border-gold/10 md:block">
        <div className="container-luxe flex items-center justify-between py-2">
          <p className="text-[0.62rem] uppercase tracking-[0.28em] text-muted">
            Natural Gemstones · Enquiry-Based Fine Jewellery
          </p>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.28em] text-muted transition-colors hover:text-gold"
          >
            <WhatsappIcon className="h-3.5 w-3.5" />
            Enquire on WhatsApp
          </a>
        </div>
      </div>

      {/* Main bar */}
      <div className="container-luxe flex items-center justify-between gap-4 py-4">
        {/* Left: mobile menu + logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="inline-flex h-10 w-9 items-center justify-center text-ivory transition-colors hover:text-gold sm:w-10 lg:hidden"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <Logo priority imgClassName="h-8 w-auto sm:h-12 md:h-16" />
        </div>

        {/* Center: primary nav */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-active={isActivePath(pathname, item.href)}
              className="link-nav"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Search"
            aria-expanded={searchOpen}
            className="inline-flex h-10 w-9 items-center justify-center text-ivory transition-colors hover:text-gold sm:w-10"
          >
            <SearchIcon className="h-5 w-5" />
          </button>

          <Link
            href="/wishlist"
            aria-label={`Wishlist${wishlistCount ? ` (${wishlistCount})` : ""}`}
            className="relative inline-flex h-10 w-9 items-center justify-center text-ivory transition-colors hover:text-gold sm:w-10"
          >
            <HeartIcon className="h-5 w-5" />
            <CountBadge count={wishlistCount} />
          </Link>

          <Link
            href="/cart"
            aria-label={`Enquiry cart${cartBadge ? ` (${cartBadge})` : ""}`}
            className="relative inline-flex h-10 w-9 items-center justify-center text-ivory transition-colors hover:text-gold sm:w-10"
          >
            <BagIcon className="h-5 w-5" />
            <CountBadge count={cartBadge} />
          </Link>

          <Show when="signed-in">
            <Link
              href="/account"
              aria-label="Account"
              className="inline-flex h-10 w-9 items-center justify-center text-ivory transition-colors hover:text-gold sm:w-10"
            >
              <UserIcon className="h-5 w-5" />
            </Link>
          </Show>
          <Show when="signed-out">
            <Link
              href="/sign-in"
              aria-label="Sign in"
              className="inline-flex h-10 w-9 items-center justify-center text-ivory transition-colors hover:text-gold sm:w-10"
            >
              <UserIcon className="h-5 w-5" />
            </Link>
          </Show>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen ? (
        <div className="border-t border-gold/12 smoked-glass">
          <form onSubmit={submitSearch} className="container-luxe flex items-center gap-3 py-4">
            <SearchIcon className="h-5 w-5 shrink-0 text-gold" />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search gemstones, rings, categories…"
              className="input-luxe border-0 border-b border-outline/40 bg-transparent px-0 focus:shadow-none"
              aria-label="Search products"
            />
            <button type="submit" className="btn btn-gold btn-sm">
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="inline-flex h-9 w-9 items-center justify-center text-muted hover:text-gold"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      ) : null}

      {/* Mobile drawer */}
      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-noir-deep/70 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-0 flex h-full max-h-dvh w-[86%] max-w-sm flex-col border-l border-gold/15 bg-noir">
            <div className="flex shrink-0 items-center justify-between border-b border-gold/12 px-5 py-3">
              <Logo href={null} imgClassName="h-8 w-auto" />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center text-ivory hover:text-gold"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Primary nav scrolls internally on short viewports so the bottom
                actions always stay reachable without clipping. */}
            <nav
              className="flex flex-1 flex-col overflow-y-auto px-5 py-1"
              aria-label="Mobile"
            >
              {PRIMARY_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  data-active={isActivePath(pathname, item.href)}
                  className="border-b border-outline/15 py-3 font-serif text-lg text-ivory data-[active=true]:text-gold"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 flex-col gap-2 border-t border-gold/12 px-5 py-4">
              <div className="flex gap-2">
                <Link href="/wishlist" className="btn btn-ghost btn-sm flex-1">
                  <HeartIcon className="h-4 w-4" />
                  Wishlist{wishlistCount ? ` (${wishlistCount})` : ""}
                </Link>
                <Link href="/cart" className="btn btn-ghost btn-sm flex-1">
                  <BagIcon className="h-4 w-4" />
                  Cart{cartBadge ? ` (${cartBadge})` : ""}
                </Link>
              </div>
              <Show when="signed-in">
                <Link href="/account" className="btn btn-ghost btn-sm btn-block">
                  <UserIcon className="h-4 w-4" />
                  My Account
                </Link>
              </Show>
              <Show when="signed-out">
                <Link href="/sign-in" className="btn btn-ghost btn-sm btn-block">
                  <UserIcon className="h-4 w-4" />
                  Sign In
                </Link>
              </Show>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-sm btn-block"
              >
                <WhatsappIcon className="h-4 w-4" />
                Enquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
