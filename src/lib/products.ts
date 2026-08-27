export type Product = {
  slug: string;
  name: string;
  category: string;
  detail: string;
  carat: string;
  status: "Available" | "Enquire";
  description: string;
  color: "blue" | "red" | "green";
};

export const products: Product[] = [
  {
    slug: "natural-blue-sapphire",
    name: "Natural Blue Sapphire",
    category: "Blue Sapphire",
    detail: "Ceylon • Unheated",
    carat: "2.03 ct",
    status: "Available",
    description:
      "A beautiful natural Ceylon blue sapphire selected for its colour, character and brilliance.",
    color: "blue",
  },
  {
    slug: "natural-ruby",
    name: "Natural Ruby",
    category: "Ruby",
    detail: "Premium Selection",
    carat: "Available on request",
    status: "Enquire",
    description:
      "A carefully selected natural ruby with rich colour and an elegant presence.",
    color: "red",
  },
  {
    slug: "natural-emerald",
    name: "Natural Emerald",
    category: "Emerald",
    detail: "Natural • Certified",
    carat: "Available on request",
    status: "Enquire",
    description:
      "A natural emerald selected for its distinctive green character and beauty.",
    color: "green",
  },
  {
    slug: "natural-yellow-sapphire",
    name: "Natural Yellow Sapphire",
    category: "Yellow Sapphire",
    detail: "Premium Natural Stone",
    carat: "Available on request",
    status: "Enquire",
    description:
      "A premium natural yellow sapphire selected for its warm colour and brilliance.",
    color: "blue",
  },
  {
    slug: "natural-amethyst",
    name: "Natural Amethyst",
    category: "Amethyst",
    detail: "Natural • Selected Quality",
    carat: "Available on request",
    status: "Enquire",
    description:
      "A naturally beautiful amethyst selected for its colour and clarity.",
    color: "red",
  },
  {
    slug: "natural-garnet",
    name: "Natural Garnet",
    category: "Garnet",
    detail: "Natural • Fine Quality",
    carat: "Available on request",
    status: "Enquire",
    description:
      "A fine natural garnet selected for its rich character and attractive colour.",
    color: "green",
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
