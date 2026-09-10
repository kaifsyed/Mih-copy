import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";
import { getArticles } from "@/lib/articles";
import { SITE_URL } from "@/lib/site";

// The catalogue changes over time, so regenerate per request rather than
// freezing the sitemap at build time.
export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  "",
  "/shop",
  "/custom-jewellery",
  "/wholesale",
  "/about",
  "/contact",
  "/policies",
  "/blog",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts();
    productEntries = products.map((product) => ({
      url: `${SITE_URL}/shop/${product.slug}`,
      lastModified: product.created_at
        ? new Date(product.created_at)
        : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // If the catalogue can't be loaded, still return the static routes rather
    // than failing the whole sitemap.
  }

  let articleEntries: MetadataRoute.Sitemap = [];
  try {
    const articles = await getArticles();
    articleEntries = articles.map((article) => ({
      url: `${SITE_URL}/blog/${article.slug}`,
      lastModified: article.date ? new Date(article.date) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));
  } catch {
    // If articles can't be loaded, still return the static routes.
  }

  return [...staticEntries, ...productEntries, ...articleEntries];
}
