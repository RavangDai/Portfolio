import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// The public site is a single scrolling page now (sections live at #projects, #certificates,
// etc.), so the sitemap lists just the one canonical URL. Admin/API stay out of the index.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
