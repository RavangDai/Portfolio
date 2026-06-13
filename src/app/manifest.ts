import type { MetadataRoute } from "next";
import { SITE_NAME, DEFAULT_DESCRIPTION } from "@/lib/seo";

// PWA / browser manifest — reinforces the brand name in the install prompt and
// browser UI, and is another place Google reads the site's name from.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "BibekTech",
    description: DEFAULT_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f2",
    theme_color: "#2e5bff",
    icons: [
      { src: "/brand/badge.png", sizes: "any", type: "image/png", purpose: "any" },
      { src: "/brand/mark.png", sizes: "any", type: "image/png", purpose: "maskable" },
    ],
  };
}
