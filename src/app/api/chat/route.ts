import { google } from "@ai-sdk/google";
import { streamText } from "ai";

// 1. TEACH THE AI
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

    const result = streamText({
      model: google("gemini-1.5-flash"), 
      system: PORTFOLIO_CONTEXT,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI Error:", error);
    return new Response("Error processing request", { status: 500 });
  }
}