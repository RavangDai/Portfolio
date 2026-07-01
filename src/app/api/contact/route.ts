import nodemailer from "nodemailer";
import { isSameOrigin } from "@/lib/http";
import { publicRateLimit } from "@/lib/rate-limit";

// Basic email shape check — not exhaustive, just enough to reject obvious junk.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Strip CR/LF and cap length. Used on values that end up in mail headers
// (replyTo / the `From:` line), so newlines could otherwise inject extra headers
// (e.g. a "\nBCC: attacker@evil.com" payload smuggled through the name field).
function sanitizeHeaderValue(s: string, max = 200): string {
  return s.replace(/[\r\n]+/g, " ").slice(0, max);
}

export async function POST(req: Request) {
  try {
    // Same-origin only — the form lives on our own contact page.
    if (!isSameOrigin(req)) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Throttle per IP — this route sends real email. 5 messages / 10 minutes.
    if (!(await publicRateLimit(req, "contact", 5, 600))) {
      return Response.json(
        { error: "Too many messages. Please try again in a few minutes." },
        { status: 429 },
      );
    }

    const { name, email, subject, message } = await req.json();

    // ── Validate ──────────────────────────────────────────────────────────────
    const cleanName    = typeof name === "string" ? sanitizeHeaderValue(name.trim()) : "";
    const cleanEmail   = typeof email === "string" ? email.trim().slice(0, 200) : "";
    const cleanSubject = typeof subject === "string" ? sanitizeHeaderValue(subject.trim()) : "";
    const cleanMessage = typeof message === "string" ? message.trim() : "";

    if (!cleanName || !cleanEmail || !cleanMessage) {
      return Response.json({ error: "Name, email, and message are required." }, { status: 400 });
    }
    if (!EMAIL_RE.test(cleanEmail)) {
      return Response.json({ error: "That email address doesn't look valid." }, { status: 400 });
    }
    if (cleanMessage.length > 5000) {
      return Response.json({ error: "Message is too long." }, { status: 400 });
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO, CONTACT_FROM } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO || !CONTACT_FROM) {
      console.error("Contact form: SMTP env vars are not configured.");
      return Response.json(
        { error: "Email isn't configured right now. Please reach me directly at drbibekg2029@gmail.com." },
        { status: 500 },
      );
    }

    const port = Number(SMTP_PORT) || 587;

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465, // true for 465, false for 587/STARTTLS
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const safeSubject = cleanSubject || "New message from portfolio";

    await transporter.sendMail({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      replyTo: `${cleanName} <${cleanEmail}>`,
      subject: `[Portfolio] ${safeSubject}`,
      text: `From: ${cleanName} <${cleanEmail}>\n\n${cleanMessage}`,
      html: `
        <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#111">
          <p style="margin:0 0 4px"><strong>From:</strong> ${escapeHtml(cleanName)} &lt;${escapeHtml(cleanEmail)}&gt;</p>
          <p style="margin:0 0 16px"><strong>Subject:</strong> ${escapeHtml(safeSubject)}</p>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:0 0 16px" />
          <p style="white-space:pre-wrap;margin:0">${escapeHtml(cleanMessage)}</p>
        </div>
      `,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return Response.json(
      { error: "Couldn't send the message. Please email me directly at drbibekg2029@gmail.com." },
      { status: 500 },
    );
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
