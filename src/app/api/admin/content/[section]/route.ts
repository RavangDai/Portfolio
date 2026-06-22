import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getContent, getContentResult, putContent } from "@/lib/storage";
import { SECTION_SCHEMAS, isSectionKey } from "@/lib/content/schema";
import { isSameOrigin } from "@/lib/http";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;
  if (!isSectionKey(section)) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  }
  const content = await getContent();
  return NextResponse.json(content[section]);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { section } = await params;
  if (!isSectionKey(section)) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const schema = SECTION_SCHEMAS[section];
  const result = schema.safeParse(body);
  if (!result.success) {
    // Surface which field(s) failed so the editor can show something actionable
    // instead of a bare "Validation failed".
    const summary = result.error.issues
      .slice(0, 4)
      .map((i) => `${i.path.join(".") || "value"}: ${i.message}`)
      .join("; ");
    return NextResponse.json(
      { error: summary ? `Validation failed — ${summary}` : "Validation failed", details: result.error.flatten() },
      { status: 422 }
    );
  }

  // Read the current document, but only proceed if the read genuinely succeeded.
  // A transient blob read failure must NOT cause us to merge onto DEFAULT_CONTENT and
  // overwrite every other section.
  const current = await getContentResult();
  if (!current.ok) {
    return NextResponse.json(
      { error: "Could not read current content; not saving to avoid data loss." },
      { status: 503 }
    );
  }

  await putContent({ ...current.data, [section]: result.data });

  // Invalidate the relevant public pages so visitors see the new content immediately,
  // plus the admin dashboard so its counts / "Last saved" reflect this write.
  revalidatePath("/projects");
  revalidatePath("/certificates");
  revalidatePath("/achievements");
  revalidatePath("/");
  revalidatePath("/admin");

  return NextResponse.json(result.data);
}
