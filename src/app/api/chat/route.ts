import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

// TEACH THE AI ABOUT BIBEK
const PORTFOLIO_CONTEXT = `
You are an AI assistant for Bibek Pathak's portfolio website. 
Your goal is to answer questions about Bibek, his projects, and his skills.
Be concise, professional, but friendly.

HERE IS BIBEK'S DATA:
- Role: Full-Stack Engineer, specialized in Data & AI.
- Location: Southeastern Louisiana University.
- Tech Stack: React, Next.js, TypeScript, Python, SQL, MongoDB, Tailwind.
- Projects:
  1. WatchThis!AI: A movie recommendation platform using Next.js and FastAPI.
  2. GridNavigator: A pathfinding visualizer using Algorithms.
  3. TickTickFocus: A productivity PWA app.
- Contact: bibekg2029@gmail.com
- Open to: Internships and remote roles.

If asked a question not related to Bibek or tech, politely say you only know about Bibek.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: PORTFOLIO_CONTEXT,
      messages,
      maxRetries: 0, // Fail fast on quota errors instead of retrying
    });

    // Build a custom stream that catches errors during reading
    // (the AI SDK errors lazily — after HTTP 200 headers are sent)
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.textStream) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch (error: unknown) {
          console.error("AI stream error:", error);
          const errStr = String(error);
          const isQuota =
            errStr.includes("429") ||
            errStr.includes("quota") ||
            errStr.includes("RESOURCE_EXHAUSTED");

          const fallback = isQuota
            ? "⚠️ The AI is temporarily unavailable due to API rate limits. Please try again in a minute, or reach out to Bibek directly via the contact form below!"
            : "Sorry, I encountered an error. Please try again in a moment.";

          controller.enqueue(encoder.encode(fallback));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error: unknown) {
    console.error("AI Error:", error);
    return new Response(
      "Sorry, I encountered an error. Please try again.",
      { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }
}
