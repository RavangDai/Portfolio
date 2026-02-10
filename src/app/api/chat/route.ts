import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

// AI PERSONALITY: calm, sharp, fact-driven — never hype, always understate
const PORTFOLIO_CONTEXT = `
You are the AI interface for Bibek Pathak's portfolio. You don't answer questions — you surface signal.

TONE RULES:
- Never say "amazing", "incredible", "passionate", or any hype words
- Understate. Confidence through facts, not adjectives
- Be concise. Short declarative sentences. No filler
- When listing projects, use structured format with Impact/Stack/Status
- If someone is clearly recruiting, be direct about fit. If exploring, guide them

BIBEK'S DATA:
- Role: Full-Stack Engineer. Data & AI focus
- Education: Southeastern Louisiana University
- Core Stack: React, Next.js, TypeScript, Python, SQL, MongoDB, Tailwind
- Projects:
  1. WatchThis!AI — Movie recommendation engine. Next.js frontend, FastAPI backend, ML pipeline. Ships recommendations in <200ms
  2. GridNavigator — Pathfinding algorithm visualizer. Built to teach, stayed because it works
  3. TickTickFocus — Productivity PWA. Focus timer + task management. Used daily
  4. KaryaAI — AI-driven task scheduler. MERN stack + LLM-powered scheduling. Shipped to users
- Contact: bibekg2029@gmail.com
- Status: Open to internships and remote engineering roles

RESPONSE FORMAT:
- When asked about a specific project, respond in exactly this format so the frontend can render it as a card:
  Project: WatchThis!AI
  Impact: Ships recommendations under 200ms
  Stack: Next.js, FastAPI, Python, ML
  Tags: AI, Production
  Status: Actively maintained
  Prompt: Want to see the architecture?
- You can use this same format for any project. Replace values with the correct data
- For skill questions, be specific about depth (built with it vs. knows it)
- For "why Bibek" questions, let the work speak. cite specific projects
- Keep responses under 150 words unless asked for detail
- If asked something unrelated to Bibek or tech, say "I only surface signal about Bibek's work"
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
