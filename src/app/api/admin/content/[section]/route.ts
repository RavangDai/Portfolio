import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getContent, putContent } from "@/lib/storage";
import { SECTION_SCHEMAS, isSectionKey } from "@/lib/content/schema";

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

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
    return NextResponse.json(
      { error: "Validation failed", details: result.error.flatten() },
      { status: 422 }
    );
  }

  const content = await getContent();
  await putContent({ ...content, [section]: result.data });

  // Invalidate the relevant public pages so visitors see the new content immediately
  revalidatePath("/projects");
  revalidatePath("/certificates");
  revalidatePath("/achievements");
  revalidatePath("/");

  return NextResponse.json(result.data);
}
