import { type NextRequest, NextResponse } from "next/server";
import { uploadFile, sanitizeFilename } from "@/lib/storage";
import { isSameOrigin } from "@/lib/http";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file");
  const type = form.get("type") as string | null; // "resume" | "image"

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File exceeds 10 MB limit" }, { status: 413 });
  }

  const isResume = type === "resume";
  const allowed = isResume ? ["application/pdf"] : ALLOWED_IMAGE_TYPES;
  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type. Allowed: ${allowed.join(", ")}` },
      { status: 415 }
    );
  }

  const folder = isResume ? "portfolio/resume" : "portfolio/images";
  const url = await uploadFile(file, `${folder}/${sanitizeFilename(file.name)}`);
  return NextResponse.json({ url });
}
