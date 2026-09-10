export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Buying Guides" | "Care & Maintenance" | "Education" | "Gifting";
  date: string;
  featuredImage: string;
  readingTime: string;
  content: string;
};

const articlesData: Article[] = [
  {
    slug: "how-to-choose-the-right-gemstone-for-you",
    title: "How to Choose the Right Gemstone for You",
    excerpt:
      "Selecting a gemstone is a personal journey. This guide walks you through colour, clarity, origin and meaning so you can choose a stone that resonates with your story.",
    category: "Buying Guides",
    date: "2026-01-15",
    featuredImage: "/images/blog/gemstone-buying-guide.webp.png",
    readingTime: "6 min read",
    content: `
      <p>Choosing a gemstone is one of the most rewarding decisions you can make — whether for yourself or as a gift for someone dear. A gemstone is more than its colour or carat weight; it carries history, symbolism and a quiet presence that grows with time.</p>

      <h2>Start with Colour</h2>
      <p>Colour is the first thing the eye registers and often the most personal criterion. Blue sapphires speak of depth and serenity; rubies carry warmth and vitality; emeralds offer a connection to nature and renewal. Consider which hues you are drawn to in daily life — your wardrobe, your surroundings, the landscapes you love.</p>

      <h2>Understand Clarity and Character</h2>
      <p>Natural gemstones almost always contain inclusions — tiny internal features formed during their growth deep within the earth. These are not flaws; they are fingerprints of authenticity. A stone with visible character often has more soul than a flawless synthetic. Ask to see the stone under magnification and decide what level of character feels right to you.</p>

      <h2>Origin Matters, But Isn't Everything</h2>
      <p>Certain origins — Kashmir sapphires, Burmese rubies, Colombian emeralds — carry historical prestige. However, beautiful stones come from many sources. A well-cut, vivid stone from a lesser-known origin can outshine a poorly cut stone from a famous mine. Focus on the individual stone's beauty first.</p>

      <h2>Consider the Setting and Wear</h2>
      <p>Hardness affects durability. Sapphires and rubies (corundum, 9 on the Mohs scale) are excellent for daily wear rings. Emeralds (7.5–8) and softer stones like opal or pearl need more protective settings and mindful wear. Think about how and where the piece will live.</p>

      <h2>Trust Your Instinct</h2>
      <p>After the technical considerations, the final decision is emotional. Hold the stone. See it in different light. The right gemstone often feels like recognition — a quiet yes. That moment is what MIH GEMS is here to help you find.</p>

      <p><em>Ready to begin? <a href="/contact" className="text-gold underline">Contact us</a> for a personal consultation, or browse our <a href="/shop" className="text-gold underline">current collection</a> of hand-selected natural gemstones.</em></p>
    `,
  },
  {
    slug: "natural-vs-lab-grown-gemstones-what-you-should-know",
    title: "Natural vs Lab-Grown Gemstones: What You Should Know",
    excerpt:
      "Lab-grown gemstones offer an alternative at a different price point. Here we outline the factual differences — origin, value, disclosure and durability — so you can make an informed choice.",
    category: "Education",
    date: "2026-02-10",
    featuredImage: "/images/blog/gemstone-authenticity.webp.png",
    readingTime: "5 min read",
    content: `
      <p>The conversation around natural and lab-grown gemstones has grown significantly in recent years. Both have a place in the market, but they are fundamentally different in origin, value trajectory and meaning. Understanding the facts helps you choose what aligns with your priorities.</p>

      <h2>Origin: Earth vs Laboratory</h2>
      <p>Natural gemstones form over millions of years under specific geological conditions. Each stone's journey from deep within the earth to your hand is unique. Lab-grown gemstones are created in controlled environments over weeks or months, replicating the same crystal structure and chemical composition.</p>

      <h2>Visual and Physical Properties</h2>
      <p>To the naked eye — and often under standard magnification — high-quality lab-grown stones can appear identical to their natural counterparts. They share the same hardness, refractive index and chemical makeup. Specialised gemmological equipment is required to distinguish them reliably.</p>

      <h2>Value and Rarity</h2>
      <p>Natural gemstones are finite. Their rarity, especially in fine qualities, underpins long-term value. Lab-grown stones can be produced in larger quantities as technology advances, which generally means their market price trends downward over time. If long-term value retention matters to you, this is a key distinction.</p>

      <h2>Disclosure and Ethics</h2>
      <p>Reputable sellers always disclose origin. At MIH GEMS, we work exclusively with natural, hand-selected gemstones. We believe in transparency — every stone we offer is natural unless explicitly stated otherwise, and certification is available on request.</p>

      <h2>Making Your Choice</h2>
      <p>If you value the romance of a stone shaped by geological time, the uniqueness of natural inclusions, and the prospect of long-term value, a natural gemstone is the traditional choice. If your priority is visual beauty at a lower initial cost, and long-term value is less of a concern, lab-grown may suit you. Neither is "better" — they serve different purposes.</p>

      <p><em>We invite you to experience natural gemstones in person. <a href="/shop" className="text-gold underline">Browse our collection</a> or <a href="/contact" className="text-gold underline">enquire about a specific stone</a>.</em></p>
    `,
  },
  {
    slug: "how-to-care-for-your-gemstone-jewellery",
    title: "How to Care for Your Gemstone Jewellery",
    excerpt:
      "Proper care keeps your gemstone jewellery brilliant for generations. Learn the dos and don'ts for cleaning, storage and daily wear — tailored to different gemstone types.",
    category: "Care & Maintenance",
    date: "2026-03-05",
    featuredImage: "/images/blog/gemstone-care-guide.webp.png",
    readingTime: "4 min read",
    content: `
      <p>Fine gemstone jewellery is made to be worn and enjoyed. With mindful care, it retains its brilliance and structural integrity for decades — even generations. The care routine depends on the gemstone, the setting and how you live with the piece.</p>

      <h2>Daily Habits</h2>
      <p>Put jewellery on after applying perfume, hairspray or lotion. Remove rings before household cleaning, gardening, exercise or swimming. Chlorine and harsh chemicals can damage both metal and certain gemstones. A soft pouch or lined box prevents scratches when pieces are not being worn.</p>

      <h2>Cleaning at Home</h2>
      <p>For most durable stones (sapphire, ruby, diamond, spinel): warm water, a drop of mild dish soap and a soft toothbrush. Rinse thoroughly and pat dry with a lint-free cloth. For softer or treated stones (emerald, opal, pearl, turquoise): wipe gently with a damp cloth only — no soaking, no brushes, no ultrasonic cleaners.</p>

      <h2>Professional Maintenance</h2>
      <p>Have prongs, bezels and clasps checked annually. A loose setting risks stone loss. Professional ultrasonic cleaning is safe for many stones but can damage fracture-filled emeralds, opals and other sensitive materials — always tell your jeweller what the stone is.</p>

      <h2>Storage Wisdom</h2>
      <p>Store pieces separately. Harder stones scratch softer ones; diamonds scratch everything. Individual soft pouches or compartmentalised boxes are ideal. For sterling silver, anti-tarnish strips help maintain the metal's lustre.</p>

      <h2>Stone-Specific Notes</h2>
      <ul>
        <li><strong>Emeralds:</strong> Often oil-treated. Avoid heat, ultrasonic and steam cleaning.</li>
        <li><strong>Opals:</strong> Contain water. Avoid extreme dryness or rapid temperature changes.</li>
        <li><strong>Pearls:</strong> Organic. Wipe after each wear. Restring periodically.</li>
        <li><strong>Sapphires & Rubies:</strong> Very durable. Safe for most cleaning methods.</li>
      </ul>

      <p><em>Have a piece that needs attention? <a href="/contact" className="text-gold underline">Get in touch</a> — we can advise on the best care approach for your specific jewellery.</em></p>
    `,
  },
  {
    slug: "beginners-guide-to-understanding-gemstone-cuts",
    title: "A Beginner's Guide to Understanding Gemstone Cuts",
    excerpt:
      "The cut determines how a gemstone interacts with light. This guide explains the major cut styles — faceted, cabochon, mixed — and how each affects brilliance, colour and character.",
    category: "Education",
    date: "2026-03-28",
    featuredImage: "/images/blog/gemstone-cuts-shapes.webp.png",
    readingTime: "5 min read",
    content: `
      <p>The cut is the human contribution to a gemstone's beauty. A rough crystal holds potential; the cutter's decisions — proportions, symmetry, facet arrangement — release that potential as light return, colour saturation and visual character.</p>

      <h2>Faceted Cuts: Light and Brilliance</h2>
      <p>Faceted cuts use geometrically arranged flat planes to reflect and refract light. The round brilliant is the most famous, maximising return for diamonds. For coloured stones, oval, cushion, emerald and pear shapes are common — each balances colour retention with sparkle differently. A well-cut coloured stone shows even colour distribution, minimal windowing (see-through areas) and lively scintillation.</p>

      <h2>Cabochon Cuts: Colour and Phenomena</h2>
      <p>A cabochon is a smooth, domed shape with no facets. It is the traditional cut for opaque stones (turquoise, lapis, malachite) and for stones displaying phenomena — star sapphires, cat's eye chrysoberyl, moonstone adularescence. The domed surface acts as a lens, concentrating colour and revealing optical effects that faceting would disrupt.</p>

      <h2>Mixed and Specialty Cuts</h2>
      <p>Mixed cuts combine faceted crowns with cabochon pavilions, or use unconventional facet patterns. Rose cuts (flat base, domed faceted crown) offer a subtle, antique glow. Checkerboard and concave faceting create distinctive light play. Custom cuts can be designed to optimise a specific rough crystal's shape and colour zoning.</p>

      <h2>What to Look For</h2>
      <ul>
        <li><strong>Symmetry:</strong> Balanced proportions, aligned facets.</li>
        <li><strong>Polish:</strong> Smooth, scratch-free facet surfaces.</li>
        <li><strong>Colour evenness:</strong> No dark or washed-out zones when tilted.</li>
        <li><strong>Appropriate depth:</strong> Not so shallow that light leaks, not so deep that the stone looks smaller than its carat weight.</li>
      </ul>

      <h2>The Cutter's Art</h2>
      <p>Every natural crystal presents different constraints — inclusions, colour zoning, shape. A skilled cutter works with these, not against them. The best cuts honour the material while maximising beauty. At MIH GEMS, we select stones where the cutting quality respects the gemstone's natural character.</p>

      <p><em>Explore our <a href="/shop" className="text-gold underline">current selection</a> to see a variety of cuts in person, or <a href="/contact" className="text-gold underline">ask us about a specific shape</a> you have in mind.</em></p>
    `,
  },
  {
    slug: "how-to-choose-jewellery-for-a-meaningful-gift",
    title: "How to Choose Jewellery for a Meaningful Gift",
    excerpt:
      "A piece of jewellery given with thought becomes a keepsake. Consider the recipient's style, the occasion, gemstone symbolism and the story you want the piece to tell.",
    category: "Gifting",
    date: "2026-04-12",
    featuredImage: "/images/blog/gemstone-gifting-guide.webp.png",
    readingTime: "4 min read",
    content: `
      <p>Jewellery given as a gift carries weight — it marks a moment, a relationship, a milestone. The most memorable pieces are chosen with the recipient in mind, not just the occasion. Here is a framework for choosing something that will be treasured.</p>

      <h2>Observe Their Style</h2>
      <p>Notice what they already wear. Yellow gold or white metal? Minimal or statement? Vintage-inspired or contemporary? Do they favour rings, necklaces, earrings or bracelets? The piece should feel like a natural extension of their existing jewellery language.</p>

      <h2>Consider the Occasion</h2>
      <p>A birthday might call for their birthstone. An anniversary could reference a shared memory — the colour of a place you visited, a stone from a meaningful year. A "just because" gift has the freedom to be purely aesthetic. Let the occasion guide, but not dictate, the choice.</p>

      <h2>Gemstone Meaning (Lightly Held)</h2>
      <p>Many cultures associate gemstones with qualities — sapphire with wisdom, ruby with passion, emerald with renewal. These associations can add a layer of intention, but they need not be rigid. Choose a stone whose story resonates with <em>your</em> reason for giving.</p>

      <h2>Quality Over Size</h2>
      <p>A smaller, well-cut, vivid stone in a thoughtful setting carries more presence than a larger, lifeless one. Fine jewellery is about longevity — a piece that stays beautiful and wearable for decades. Prioritise craftsmanship and stone quality.</p>

      <h2>Personalisation</h2>
      <p>Engraving a date, initials or a short phrase on the inside of a band or the back of a pendant transforms a beautiful object into a private heirloom. Custom design — starting with a stone they love — creates something truly singular.</p>

      <p><em>Need help selecting? <a href="/contact" className="text-gold underline">We offer personal gifting consultations</a> — tell us about the recipient and the occasion, and we will curate options for you.</em></p>
    `,
  },
  {
    slug: "gemstone-buying-guide-what-to-look-for-before-you-buy",
    title: "Gemstone Buying Guide: What to Look For Before You Buy",
    excerpt:
      "An informed buyer asks the right questions. This checklist covers colour, clarity, cut, carat, treatments, certification and seller transparency — so you can purchase with confidence.",
    category: "Buying Guides",
    date: "2026-05-20",
    featuredImage: "/images/blog/custom-jewellery-journey.webp.png",
    readingTime: "7 min read",
    content: `
      <p>Buying a fine gemstone is a significant decision. The market ranges from exceptional to misrepresented. Knowing what to evaluate — and what to ask — protects your investment and ensures you acquire something you will love for a lifetime.</p>

      <h2>The Four Cs (Adapted for Coloured Stones)</h2>
      <ul>
        <li><strong>Colour:</strong> Hue, tone and saturation. The most valuable stones show pure, vivid hue with medium-dark tone and strong saturation. Even distribution matters more than perfection.</li>
        <li><strong>Clarity:</strong> Inclusions are expected in natural coloured stones. Eye-clean is a high standard; minor inclusions visible under magnification are normal and do not detract from beauty.</li>
        <li><strong>Cut:</strong> Proportions should maximise colour and brilliance. Windowing (see-through areas) and extinction (dark areas) indicate poor cutting.</li>
        <li><strong>Carat:</strong> Price per carat increases non-linearly at certain thresholds. A 0.95 ct stone can offer nearly the visual presence of 1.00 ct at a meaningful saving.</li>
      </ul>

      <h2>Treatments: Know What Is Normal</h2>
      <p>Most coloured gemstones undergo some treatment. Heat treatment for sapphire and ruby is standard, stable and widely accepted. Oiling emeralds is traditional. Diffusion, fracture filling, dyeing or irradiation are less stable and must be disclosed. Always ask: "Has this stone been treated, and how?"</p>

      <h2>Certification</h2>
      <p>Reputable independent laboratories (GIA, GRS, Gübelin, SSEF, AGL, etc.) provide reports detailing species, variety, origin (when determinable), treatments and measurements. A certificate is not a guarantee of beauty — it is a record of facts. Ask to see the report before purchase.</p>

      <h2>Seller Transparency</h2>
      <p>A trustworthy seller welcomes questions, provides clear images and video, discloses treatments, offers a return window and stands behind authenticity. At MIH GEMS, every stone is hand-selected, natural, and certification is available on request. We operate on enquiry because coloured gemstones deserve conversation, not a checkout button.</p>

      <h2>Your Checklist</h2>
      <ol>
        <li>Is the stone natural? (Ask explicitly.)</li>
        <li>What treatments, if any, has it undergone?</li>
        <li>Is a lab report available from a recognised laboratory?</li>
        <li>Can you see the stone in multiple lighting conditions (daylight, incandescent, video)?</li>
        <li>Is the setting appropriate for the stone's durability?</li>
        <li>What is the return or exchange policy?</li>
      </ol>

      <p><em>Begin your search with confidence. <a href="/shop" className="text-gold underline">View our current collection</a> or <a href="/contact" className="text-gold underline">start an enquiry</a> for a specific requirement.</em></p>
    `,
  },
];

export async function getArticles(): Promise<Article[]> {
  return articlesData.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getArticles();
  return articles.find((a) => a.slug === slug) ?? null;
}

export async function getLatestArticles(limit = 3): Promise<Article[]> {
  const articles = await getArticles();
  return articles.slice(0, limit);
}

export function getCategories(articles: readonly Article[]): string[] {
  return Array.from(new Set(articles.map((a) => a.category))).sort((a, b) =>
    a.localeCompare(b)
  );
}