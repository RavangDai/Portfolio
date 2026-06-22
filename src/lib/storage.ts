import { put, list } from "@vercel/blob";
import type { SiteContent } from "./content/types";
import { siteContentSchema } from "./content/schema";
import { DEFAULT_CONTENT } from "./content/defaults";

const CONTENT_PATH = "portfolio/content.json";

export interface GetContentOptions {
  /** Bypass the blob fetch cache (used by the admin dashboard so counts are live). */
  fresh?: boolean;
}

/**
 * Read result that distinguishes "no stored content yet, use defaults" (ok) from
 * "the read genuinely failed" (!ok). Callers that turn around and *write* the document
 * back must not treat a transient read failure as "empty" — that would persist defaults
 * over the real data for every section they aren't editing.
 */
export type ContentResult = { ok: true; data: SiteContent } | { ok: false };

export async function getContentResult(
  opts: GetContentOptions = {}
): Promise<ContentResult> {
  // No Blob configured → the site intentionally serves defaults read-only.
  if (!process.env.BLOB_READ_WRITE_TOKEN) return { ok: true, data: DEFAULT_CONTENT };
  try {
    const { blobs } = await list({ prefix: CONTENT_PATH, limit: 1 });
    if (!blobs.length) return { ok: true, data: DEFAULT_CONTENT }; // nothing saved yet
    const res = await fetch(
      blobs[0]!.url,
      opts.fresh ? { cache: "no-store" } : { next: { revalidate: 60 } }
    );
    if (!res.ok) return { ok: false };
    const raw = await res.json();
    const parsed = siteContentSchema.safeParse(raw);
    // A parse failure means stored data is corrupt — surface it rather than silently
    // overwriting the (possibly recoverable) blob with defaults on the next save.
    return parsed.success ? { ok: true, data: parsed.data } : { ok: false };
  } catch {
    return { ok: false };
  }
}

export async function getContent(opts: GetContentOptions = {}): Promise<SiteContent> {
  const result = await getContentResult(opts);
  return result.ok ? result.data : DEFAULT_CONTENT;
}

export async function putContent(data: SiteContent): Promise<void> {
  const validated = siteContentSchema.parse({
    ...data,
    updatedAt: new Date().toISOString(),
  });
  await put(CONTENT_PATH, JSON.stringify(validated, null, 2), {
    access: "public",
    addRandomSuffix: false,
    // The content doc lives at a single fixed key and is rewritten on every save;
    // @vercel/blob v2 requires opting into overwriting an existing key.
    allowOverwrite: true,
    contentType: "application/json",
  });
}

// Strip any path components and reduce to a safe, lowercase blob key segment.
// `addRandomSuffix` still guarantees uniqueness; this just keeps user-supplied
// filenames from injecting path separators or odd characters into the public URL.
export function sanitizeFilename(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "file";
  const cleaned = base
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
  return cleaned || "file";
}

export async function uploadFile(file: File, path: string): Promise<string> {
  const blob = await put(path, file, { access: "public", addRandomSuffix: true });
  return blob.url;
}
