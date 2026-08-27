import { notFound } from "next/navigation";
import { products } from "@/lib/products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = products.find(
    (item) => item.slug === slug
  );

  if (!product) {
    notFound();
  }

  const whatsappMessage = `Hi MIH GEMS, I'm interested in the ${product.name}. Please share the details and price.`;

  return (
    <main className="min-h-screen bg-[#0b0a09] text-[#f5efe5]">
      <header className="border-b border-[#c9a45c]/20">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <a
            href="/"
            className="text-xl font-semibold tracking-[0.25em]"
          >
            MIH GEMS
          </a>

          <div className="hidden items-center gap-8 text-sm text-[#d8d0c4] md:flex">
            <a href="/" className="hover:text-[#d7b56d]">
              Home
            </a>

            <a href="/shop" className="text-[#d7b56d]">
              Shop
            </a>

            <a href="/wishlist" className="hover:text-[#d7b56d]">
              Wishlist ♡
            </a>

            <a href="/account" className="hover:text-[#d7b56d]">
              Account
            </a>
          </div>

          <a
            href={`https://wa.me/919663140305?text=${encodeURIComponent(
              whatsappMessage
            )}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[#c9a45c]/50 px-4 py-2 text-xs font-medium text-[#e4c887] transition hover:bg-[#c9a45c] hover:text-[#0b0a09]"
          >
            WhatsApp
          </a>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <a
          href="/shop"
          className="text-sm text-[#9f9689] hover:text-[#d7b56d]"
        >
          ← Back to Shop
        </a>

        <div className="mt-10 grid gap-14 lg:grid-cols-2 lg:items-center">
          <div className="flex aspect-square items-center justify-center rounded-[2rem] border border-[#c9a45c]/15 bg-gradient-to-br from-[#1b1814] to-[#090807]">
            <div
              className={`h-48 w-48 rotate-45 rounded-[2.5rem] border border-[#d7b56d]/40 shadow-[0_0_100px_rgba(201,164,92,0.12)] ${
                product.color === "blue"
                  ? "bg-gradient-to-br from-[#466c8d] via-[#20384b] to-[#0b141c]"
                  : product.color === "red"
                    ? "bg-gradient-to-br from-[#73363d] via-[#39151c] to-[#14090b]"
                    : "bg-gradient-to-br from-[#55705d] via-[#243c2b] to-[#0b140d]"
              }`}
            />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#d7b56d]">
              {product.category}
            </p>

            <h1 className="mt-4 text-4xl font-light tracking-tight sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-5 text-sm uppercase tracking-[0.18em] text-[#82796c]">
              {product.detail}
            </p>

            <p className="mt-4 text-lg text-[#c8beb0]">
              {product.carat}
            </p>

            <div className="mt-8 h-px bg-[#c9a45c]/15" />

            <p className="mt-8 max-w-xl text-base leading-8 text-[#a9a093]">
              {product.description}
            </p>

            <div className="mt-8 rounded-2xl border border-[#c9a45c]/15 bg-[#100f0d] p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-[#756d62]">
                Availability
              </p>

              <p className="mt-2 text-sm text-[#d8d0c4]">
                {product.status === "Available"
                  ? "Currently available"
                  : "Available on enquiry"}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={`https://wa.me/919663140305?text=${encodeURIComponent(
                  whatsappMessage
                )}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#d7b56d] px-7 py-3.5 text-center text-sm font-semibold text-[#0b0a09] transition hover:bg-[#e5cd96]"
              >
                Enquire on WhatsApp
              </a>

              <a
                href="/wishlist"
                className="rounded-full border border-[#c9a45c]/30 px-7 py-3.5 text-center text-sm text-[#eee5d8] transition hover:border-[#d7b56d] hover:text-[#d7b56d]"
              >
                ♡ Add to Wishlist
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#756d62]">
                  Quality
                </p>
                <p className="mt-1 text-sm text-[#c8beb0]">
                  Carefully selected
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-[#756d62]">
                  Service
                </p>
                <p className="mt-1 text-sm text-[#c8beb0]">
                  Personal guidance
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-[#756d62]">
                  Shipping
                </p>
                <p className="mt-1 text-sm text-[#c8beb0]">
                  Worldwide
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#c9a45c]/10 bg-[#070706]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-[#756d62] sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p className="tracking-[0.2em] text-[#b7aa96]">
            MIH GEMS
          </p>

          <p>Natural gemstones - Custom jewellery</p>

          <p>© {new Date().getFullYear()} MIH GEMS</p>
        </div>
      </footer>
    </main>
  );
}