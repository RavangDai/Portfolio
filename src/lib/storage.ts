import { put, list } from "@vercel/blob";
import type { SiteContent } from "./content/types";
import { siteContentSchema } from "./content/schema";
import { DEFAULT_CONTENT } from "./content/defaults";

const CONTENT_PATH = "portfolio/content.json";

export async function getContent(): Promise<SiteContent> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return DEFAULT_CONTENT;
  try {
    const { blobs } = await list({ prefix: CONTENT_PATH, limit: 1 });
    if (!blobs.length) return DEFAULT_CONTENT;
    const res = await fetch(blobs[0].url, { next: { revalidate: 60 } });
    if (!res.ok) return DEFAULT_CONTENT;
    const raw = await res.json();
    const parsed = siteContentSchema.safeParse(raw);
    return parsed.success ? parsed.data : DEFAULT_CONTENT;
  } catch {
    return DEFAULT_CONTENT;
  }
}

export async function putContent(data: SiteContent): Promise<void> {
  const validated = siteContentSchema.parse({
    ...data,
    updatedAt: new Date().toISOString(),
  });
  await put(CONTENT_PATH, JSON.stringify(validated, null, 2), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
}

export async function uploadFile(file: File, path: string): Promise<string> {
  const blob = await put(path, file, { access: "public", addRandomSuffix: true });
  return blob.url;
}
