import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // If Resend is configured, send an email
    if (resend) {
      await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: "bibekg2029@gmail.com", // your inbox
        reply_to: email,
        subject: `New message from portfolio: ${subject}`,
        text: `Name: ${name}
Email: ${email}

${message}`,
      });
    } else {
      // Fallback: just log on the server
      console.log("Contact form submission:", {
        name,
        email,
        subject,
        message,
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
