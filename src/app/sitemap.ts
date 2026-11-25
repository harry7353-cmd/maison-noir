import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://maisonnoir.com";

  // Static routes
  const staticRoutes = [
    "",
    "/collections",
    "/collections/men",
    "/collections/women",
    "/collections/streetwear",
    "/collections/accessories",
    "/about",
    "/contact",
    "/size-guide",
    "/track-order",
    "/faq",
    "/shipping",
    "/returns",
    "/privacy",
    "/terms",
    "/careers",
    "/press",
    "/sustainability",
    "/cookies",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic products
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });

    productRoutes = products.map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));
  } catch (e) {
    console.error("Sitemap product fetch error:", e);
  }

  // Dynamic collections
  let collectionRoutes: MetadataRoute.Sitemap = [];
  try {
    const collections = await prisma.collection.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    collectionRoutes = collections.map((c) => ({
      url: `${baseUrl}/collections/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));
  } catch (e) {
    console.error("Sitemap collection fetch error:", e);
  }

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
