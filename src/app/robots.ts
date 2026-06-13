import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Allow crawling of everything public; keep the admin panel and API out of the index.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
