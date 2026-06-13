import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Lists the public, indexable routes for crawlers. Admin/API are intentionally absent.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1.0, freq: "weekly" },
    { path: "/projects", priority: 0.9, freq: "weekly" },
    { path: "/certificates", priority: 0.7, freq: "monthly" },
    { path: "/achievements", priority: 0.7, freq: "monthly" },
    { path: "/contact", priority: 0.6, freq: "monthly" },
  ];

  return routes.map(({ path, priority, freq }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  }));
}
