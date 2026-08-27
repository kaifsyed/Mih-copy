"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { DiamondIcon, MailIcon, GridIcon } from "@/components/ui/icons";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: GridIcon, exact: true },
  { href: "/admin/products", label: "Products", icon: DiamondIcon, exact: false },
  { href: "/admin/enquiries", label: "Enquiries", icon: MailIcon, exact: false },
] as const;

/**
 * The admin chrome — a fixed sidebar on desktop, a top bar on mobile. Admin
 * routes are chromeless to the public SiteHeader/SiteFooter (see chrome.ts), so
 * this provides their navigation. Only real, implemented routes appear here.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-noir text-ivory">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-gold/12 bg-noir-deep lg:flex">
        <div className="border-b border-gold/10 px-6 py-6">
          <Link
            href="/"
            className="font-serif text-lg tracking-[0.2em] text-ivory transition-colors hover:text-gold"
          >
            MIH GEMS
          </Link>
          <p className="eyebrow mt-2">Admin Suite</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-6" aria-label="Admin">
          {NAV.map((item) => {
            const on = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={on ? "page" : undefined}
                className={`flex items-center gap-3 border-l-2 px-4 py-3 text-sm transition-colors ${
                  on
                    ? "border-gold bg-gold/5 text-gold"
                    : "border-transparent text-muted hover:text-ivory"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-3 border-t border-gold/10 px-6 py-6">
          <Link
            href="/"
            className="text-sm text-muted transition-colors hover:text-gold"
          >
            View website
          </Link>
          <SignOutButton redirectUrl="/sign-in">
            <button
              type="button"
              className="text-left text-sm text-muted transition-colors hover:text-danger"
            >
              Sign out
            </button>
          </SignOutButton>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 border-b border-gold/12 smoked-glass lg:hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="font-serif text-base tracking-[0.2em] text-ivory"
          >
            MIH GEMS <span className="text-gold">Admin</span>
          </Link>
          <SignOutButton redirectUrl="/sign-in">
            <button
              type="button"
              className="text-[0.68rem] uppercase tracking-[0.18em] text-muted transition-colors hover:text-gold"
            >
              Sign out
            </button>
          </SignOutButton>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2" aria-label="Admin">
          {NAV.map((item) => {
            const on = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={on ? "page" : undefined}
                className={`shrink-0 whitespace-nowrap border-b-2 px-4 py-2 text-sm transition-colors ${
                  on
                    ? "border-gold text-gold"
                    : "border-transparent text-muted hover:text-ivory"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Content */}
      <div className="lg:pl-60">
        <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
          {children}
        </main>
      </div>
    </div>
  );
}
