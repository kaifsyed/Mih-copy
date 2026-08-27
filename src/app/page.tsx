const whatsappNumber = "919663140305";

const categories = [
  {
    title: "Natural Gemstones",
    subtitle: "Rare stones. Natural character.",
    href: "#featured",
    icon: "✦",
  },
  {
    title: "Fine Jewellery",
    subtitle: "Designed around your stone.",
    href: "#jewellery",
    icon: "◇",
  },
  {
    title: "Birthstones",
    subtitle: "A stone with meaning.",
    href: "#birthstones",
    icon: "◈",
  },
  {
    title: "Custom Jewellery",
    subtitle: "Made uniquely for you.",
    href: "#contact",
    icon: "♢",
  },
];

const featuredGems = [
  {
    name: "Natural Blue Sapphire",
    type: "Ceylon • Unheated",
    carat: "2.03 ct",
    accent: "sapphire",
  },
  {
    name: "Natural Ruby",
    type: "Premium Selection",
    carat: "Available on request",
    accent: "ruby",
  },
  {
    name: "Natural Emerald",
    type: "Natural • Certified",
    carat: "Available on request",
    accent: "emerald",
  },
];

const trustPoints = [
  {
    number: "01",
    title: "Natural Selection",
    text: "Carefully sourced gemstones selected for beauty, character and quality.",
  },
  {
    number: "02",
    title: "Personal Guidance",
    text: "Talk directly with us and get help choosing the right stone for you.",
  },
  {
    number: "03",
    title: "Worldwide Shipping",
    text: "We serve gemstone and jewellery clients across India and internationally.",
  },
];

function whatsappLink(product?: string) {
  const message = product
    ? `Hi MIH GEMS, I'm interested in the ${product}. Please share the details and price.`
    : "Hi MIH GEMS, I'd like to enquire about your gemstones and jewellery.";

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#090807] text-[#f4eee3] selection:bg-[#c9a45c] selection:text-[#090807]">
      {/* Announcement */}
      <div className="border-b border-[#c9a45c]/10 bg-[#0d0c0a] px-4 py-2 text-center text-[10px] uppercase tracking-[0.28em] text-[#a89d8b]">
        Natural gemstones • Custom jewellery • Worldwide enquiries
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#c9a45c]/10 bg-[#090807]/95 backdrop-blur-xl">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="/" className="group">
            <div className="text-lg font-semibold tracking-[0.3em] text-[#f5efe5] transition group-hover:text-[#d7b56d]">
              MIH
            </div>
            <div className="-mt-1 text-[8px] tracking-[0.5em] text-[#a99572]">
              GEMS
            </div>
          </a>

          <div className="hidden items-center gap-8 text-xs uppercase tracking-[0.16em] text-[#b9b0a3] lg:flex">
            <a className="transition hover:text-[#d7b56d]" href="#collections">
              Shop
            </a>
            <a className="transition hover:text-[#d7b56d]" href="#featured">
              Gemstones
            </a>
            <a className="transition hover:text-[#d7b56d]" href="#jewellery">
              Jewellery
            </a>
            <a className="transition hover:text-[#d7b56d]" href="#birthstones">
              Birthstones
            </a>
            <a className="transition hover:text-[#d7b56d]" href="#about">
              Our Story
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              aria-label="Search"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#c9a45c]/10 text-[#b9b0a3] transition hover:border-[#c9a45c]/40 hover:text-[#d7b56d] sm:flex"
            >
              ⌕
            </button>

            <button
              aria-label="Wishlist"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#c9a45c]/10 text-[#b9b0a3] transition hover:border-[#c9a45c]/40 hover:text-[#d7b56d] sm:flex"
            >
              ♡
            </button>

            <a
              href="/sign-in"
              className="hidden text-xs uppercase tracking-[0.14em] text-[#b9b0a3] transition hover:text-[#d7b56d] sm:block"
            >
              Account
            </a>

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#d7b56d] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#090807] transition hover:bg-[#ead69f]"
            >
              Enquire
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#c9a45c]/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,rgba(201,164,92,0.14),transparent_30%),radial-gradient(circle_at_15%_80%,rgba(42,61,76,0.14),transparent_28%)]" />

        <div className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-16 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div>
            <p className="mb-7 text-[10px] font-medium uppercase tracking-[0.42em] text-[#d7b56d]">
              MIH GEMS • EST. FOR THE LOVE OF GEMSTONES
            </p>

            <h1 className="max-w-4xl text-5xl font-light leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[78px]">
              Rare beauty,
              <span className="block text-[#d7b56d]">naturally yours.</span>
            </h1>

            <p className="mt-8 max-w-xl text-sm leading-7 text-[#a9a093] sm:text-base">
              Discover carefully selected natural gemstones and customised
              jewellery, chosen with an eye for colour, character and
              craftsmanship.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="/shop"
                className="rounded-full bg-[#d7b56d] px-7 py-4 text-center text-xs font-semibold uppercase tracking-[0.12em] text-[#090807] transition hover:bg-[#ead69f]"
              >
                Explore Collection
              </a>

              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#c9a45c]/30 px-7 py-4 text-center text-xs font-medium uppercase tracking-[0.12em] text-[#eee5d8] transition hover:border-[#d7b56d] hover:text-[#d7b56d]"
              >
                Talk to an Expert
              </a>
            </div>

            <div className="mt-12 grid max-w-lg grid-cols-3 border-t border-[#c9a45c]/15 pt-7">
              <div>
                <p className="text-lg font-light text-[#eee5d8]">Natural</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#756d62]">
                  Selection
                </p>
              </div>
              <div className="border-l border-[#c9a45c]/15 pl-5">
                <p className="text-lg font-light text-[#eee5d8]">Custom</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#756d62]">
                  Jewellery
                </p>
              </div>
              <div className="border-l border-[#c9a45c]/15 pl-5">
                <p className="text-lg font-light text-[#eee5d8]">Worldwide</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#756d62]">
                  Shipping
                </p>
              </div>
            </div>
          </div>

          {/* Hero gemstone visual */}
          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="absolute -inset-10 rounded-full bg-[#c9a45c]/5 blur-3xl" />

            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-[#c9a45c]/20 bg-gradient-to-br from-[#211d17] via-[#0e0d0b] to-[#17130e] p-4 shadow-2xl">
              <div className="absolute inset-4 overflow-hidden rounded-[1.5rem] border border-[#c9a45c]/10 bg-[#0b0b0a]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(72,104,132,0.2),transparent_24%)]" />

                <div className="absolute left-1/2 top-[39%] -translate-x-1/2 -translate-y-1/2">
                  <div className="h-44 w-44 rotate-45 rounded-[2rem] border border-[#d7b56d]/50 bg-gradient-to-br from-[#5b7890] via-[#20384c] to-[#08131c] shadow-[0_0_100px_rgba(74,111,140,0.32)] sm:h-52 sm:w-52" />
                  <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-xl bg-[#9cb8ca]/10 blur-xl" />
                </div>

                <div className="absolute bottom-12 left-0 right-0 text-center">
                  <p className="text-[9px] uppercase tracking-[0.4em] text-[#82796c]">
                    The beauty of nature
                  </p>
                  <p className="mt-3 text-2xl font-light text-[#eee5d8]">
                    Curated with care
                  </p>
                  <p className="mt-2 text-xs text-[#756d62]">
                    Natural Blue Sapphire • 2.03 ct
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category navigation */}
      <section id="collections" className="border-b border-[#c9a45c]/10 bg-[#0d0c0a]">
        <div className="mx-auto max-w-7xl px-5 py-7 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {categories.map((category, index) => (
              <a
                key={category.title}
                href={category.href}
                className={`group px-5 py-5 transition hover:bg-[#15130f] ${
                  index > 0 ? "border-l border-[#c9a45c]/10" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-light text-[#d7b56d]">
                    {category.icon}
                  </span>
                  <span className="text-[#655e54] transition group-hover:text-[#d7b56d]">
                    →
                  </span>
                </div>

                <h2 className="mt-5 text-sm text-[#eee5d8]">
                  {category.title}
                </h2>

                <p className="mt-1 text-[10px] leading-5 text-[#756d62]">
                  {category.subtitle}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured gemstones */}
      <section id="featured" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.38em] text-[#d7b56d]">
              Featured collection
            </p>
            <h2 className="mt-3 text-4xl font-light tracking-tight sm:text-5xl">
              Selected gemstones
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#81786c]">
              A glimpse into the kind of stones we source. Availability and
              specifications can be confirmed directly with our team.
            </p>
          </div>

          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            className="text-xs uppercase tracking-[0.15em] text-[#d7b56d] transition hover:text-[#f0dca9]"
          >
            Request latest collection →
          </a>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {featuredGems.map((gem, index) => (
            <article
              key={gem.name}
              className="group overflow-hidden rounded-[1.4rem] border border-[#c9a45c]/12 bg-[#0e0d0b]"
            >
              <div className="relative flex aspect-[4/4.5] items-center justify-center overflow-hidden bg-gradient-to-br from-[#181612] to-[#090807]">
                <div className="absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_50%,rgba(201,164,92,0.09),transparent_45%)]" />

                <div
                  className={`relative h-32 w-32 rotate-45 rounded-[1.5rem] border border-[#d7b56d]/35 shadow-2xl transition duration-700 group-hover:scale-110 sm:h-36 sm:w-36 ${
                    gem.accent === "sapphire"
                      ? "bg-gradient-to-br from-[#466c8d] via-[#20384b] to-[#09141d]"
                      : gem.accent === "ruby"
                        ? "bg-gradient-to-br from-[#843d47] via-[#421720] to-[#16080b]"
                        : "bg-gradient-to-br from-[#5b7965] via-[#263e2c] to-[#0a150d]"
                  }`}
                />

                <span className="absolute bottom-5 left-5 text-[9px] uppercase tracking-[0.22em] text-[#655e54]">
                  View details
                </span>
              </div>

              <div className="p-6">
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#81786c]">
                  {gem.type}
                </p>

                <h3 className="mt-2 text-lg font-light text-[#eee5d8]">
                  {gem.name}
                </h3>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-[#a59b8d]">{gem.carat}</p>
                  <button
                    aria-label={`Add ${gem.name} to wishlist`}
                    className="text-xl text-[#756d62] transition hover:text-[#d7b56d]"
                  >
                    ♡
                  </button>
                </div>

                <a
                  href={whatsappLink(gem.name)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 block rounded-full border border-[#c9a45c]/20 px-5 py-3 text-center text-[10px] font-medium uppercase tracking-[0.15em] text-[#d7b56d] transition hover:border-[#d7b56d] hover:bg-[#d7b56d] hover:text-[#090807]"
                >
                  Enquire about this stone
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="border-y border-[#c9a45c]/10 bg-[#0d0c0a]">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="mb-12">
            <p className="text-[10px] uppercase tracking-[0.38em] text-[#d7b56d]">
              The MIH GEMS difference
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-light sm:text-4xl">
              A more personal way to discover gemstones.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {trustPoints.map((point) => (
              <div
                key={point.number}
                className="border-t border-[#c9a45c]/15 pt-6"
              >
                <span className="text-[10px] tracking-[0.2em] text-[#8b7b5d]">
                  {point.number}
                </span>

                <h3 className="mt-5 text-lg font-light text-[#eee5d8]">
                  {point.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#81786c]">
                  {point.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jewellery */}
      <section id="jewellery" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-[#c9a45c]/15 bg-gradient-to-br from-[#221b15] via-[#0e0d0b] to-[#15110d]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(201,164,92,0.15),transparent_35%)]" />

            <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d7b56d]/30 shadow-[0_0_80px_rgba(201,164,92,0.08)]" />

            <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[1.2rem] border border-[#d7b56d]/50 bg-gradient-to-br from-[#b5c2cb] via-[#697d89] to-[#29343a] shadow-[0_0_60px_rgba(200,210,215,0.18)]" />

            <div className="absolute bottom-8 left-8">
              <p className="text-[9px] uppercase tracking-[0.35em] text-[#8f8678]">
                Custom jewellery
              </p>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.38em] text-[#d7b56d]">
              Jewellery, your way
            </p>

            <h2 className="mt-4 text-4xl font-light leading-tight sm:text-5xl">
              Start with a stone.
              <span className="block text-[#d7b56d]">
                Finish with something yours.
              </span>
            </h2>

            <p className="mt-7 max-w-xl text-sm leading-7 text-[#968c7f]">
              Have a gemstone already? Looking for a particular design?
              Tell us what you have in mind and we can help shape it into a
              piece that feels personal.
            </p>

            <a
              href={whatsappLink("custom jewellery")}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex rounded-full bg-[#d7b56d] px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#090807] transition hover:bg-[#ead69f]"
            >
              Discuss a Custom Piece
            </a>
          </div>
        </div>
      </section>

      {/* Birthstones */}
      <section id="birthstones" className="border-y border-[#c9a45c]/10 bg-[#f0e9df] text-[#171411]">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.38em] text-[#96743c]">
              Find your stone
            </p>

            <h2 className="mt-4 text-4xl font-light leading-tight sm:text-5xl">
              A gemstone with meaning.
            </h2>

            <p className="mt-5 text-sm leading-7 text-[#625a50]">
              Explore birthstones and discover the colour, symbolism and
              character behind each one.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              "Garnet",
              "Amethyst",
              "Aquamarine",
              "Diamond",
              "Emerald",
              "Ruby",
            ].map((stone) => (
              <a
                key={stone}
                href={whatsappLink(stone)}
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border border-[#8d7652]/15 bg-[#f6f0e7] p-5 transition hover:-translate-y-1 hover:border-[#96743c]/40"
              >
                <div className="flex h-20 items-center justify-center">
                  <div className="h-10 w-10 rotate-45 rounded-lg border border-[#96743c]/30 bg-[#d5c1a0]/20 transition group-hover:scale-110" />
                </div>

                <p className="mt-4 text-center text-xs font-medium">
                  {stone}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.38em] text-[#d7b56d]">
            About MIH GEMS
          </p>

          <h2 className="mt-4 text-4xl font-light leading-tight sm:text-5xl">
            Gemstones chosen for people who appreciate the details.
          </h2>

          <p className="mt-7 text-sm leading-8 text-[#968c7f]">
            MIH GEMS brings together natural gemstones and customised
            jewellery with a focus on quality, transparency and personal
            service. Whether you are searching for a special stone or
            creating a piece from scratch, our goal is simple: help you find
            something that feels truly yours.
          </p>
        </div>
      </section>

      {/* Consultation CTA */}
      <section id="contact" className="border-y border-[#c9a45c]/10 bg-[#0d0c0a]">
        <div className="mx-auto max-w-4xl px-5 py-24 text-center lg:px-8">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#d7b56d]">
            Personal consultation
          </p>

          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-light leading-tight sm:text-6xl">
            Looking for something specific?
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#81786c]">
            Tell us the gemstone, colour, size, budget or jewellery style you
            have in mind. We&apos;ll help you find the right option.
          </p>

          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            className="mt-9 inline-flex rounded-full bg-[#d7b56d] px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#090807] transition hover:bg-[#ead69f]"
          >
            Start a WhatsApp Enquiry
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#070706]">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="grid gap-10 border-b border-[#c9a45c]/10 pb-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-lg font-semibold tracking-[0.3em]">
                MIH
              </p>
              <p className="mt-1 text-[8px] tracking-[0.5em] text-[#a99572]">
                GEMS
              </p>
              <p className="mt-5 max-w-xs text-xs leading-6 text-[#756d62]">
                Natural gemstones and customised jewellery, selected with
                care.
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#b7aa96]">
                Explore
              </p>
              <div className="mt-4 space-y-3 text-xs text-[#756d62]">
                <a className="block hover:text-[#d7b56d]" href="#featured">
                  Gemstones
                </a>
                <a className="block hover:text-[#d7b56d]" href="#jewellery">
                  Jewellery
                </a>
                <a className="block hover:text-[#d7b56d]" href="#birthstones">
                  Birthstones
                </a>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#b7aa96]">
                Customer
              </p>
              <div className="mt-4 space-y-3 text-xs text-[#756d62]">
                <a className="block hover:text-[#d7b56d]" href="/sign-in">
                  My Account
                </a>
                <a className="block hover:text-[#d7b56d]" href="#contact">
                  Contact Us
                </a>
                <a
                  className="block hover:text-[#d7b56d]"
                  href={whatsappLink()}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#b7aa96]">
                MIH GEMS
              </p>
              <p className="mt-4 text-xs leading-6 text-[#756d62]">
                Natural stones
                <br />
                Custom jewellery
                <br />
                Worldwide shipping
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-3 pt-7 text-[10px] uppercase tracking-[0.12em] text-[#514c45] sm:flex-row">
            <p>© {new Date().getFullYear()} MIH GEMS. All rights reserved.</p>
            <p>Natural gemstones • Custom jewellery</p>
          </div>
        </div>
      </footer>
    </main>
  );
}