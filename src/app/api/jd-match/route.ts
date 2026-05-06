import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const PROJECT_CONTEXT = `
KaryaAI | 2026 | Shipped
Task manager with JWT auth, MongoDB syncing, and AI-powered task sorting.
Tech: React, Node.js, MongoDB, Express, Tailwind CSS
Domains: MERN Stack, Productivity, Full-stack, REST APIs, Authentication, AI

CrumbCraft | 2026 | Shipped
Two AI dev tools in one. Crumb compresses messy conversations into structured docs. Craft engineers precise prompts with guided templates.
Tech: Next.js, React, Tailwind CSS, Gemini 2.5, Framer Motion
Domains: Full-stack, AI/LLM, Developer Tools, Prompt Engineering, Productivity

WatchThis!AI | 2026 | In Progress
AI-powered movie and TV show recommender.
Tech: Next.js, FastAPI, PostgreSQL, Docker
Domains: Full-stack, AI, Recommendation Systems, Python, REST APIs, Docker

VectorVance | 2025 | Shipped
Raspberry Pi autonomous car with lane-following PID controller, SSD MobileNet obstacle and traffic-sign detection, colour-coded fork navigation, and a live Flask web dashboard with MJPEG stream.
Tech: Python, OpenCV, Flask, SSD MobileNet v2, NumPy, lgpio, gpiozero
Domains: Computer Vision, Robotics, Embedded Systems, Python, Real-time Systems, Hardware, PID Control

GridNavigator | 2025 | Shipped
Interactive visualizer for pathfinding algorithms (A*, Dijkstra, BFS, DFS) on live grids.
Tech: TypeScript, React, Vite
Domains: Algorithms, Data Structures, Visualization, TypeScript, Frontend

TickTickFocus | 2025 | Shipped
Minimal Pomodoro timer PWA. Fully offline-capable, no distractions.
Tech: React, Tailwind CSS, PWA, Service Workers
Domains: Frontend, PWA, Offline-first, Productivity

Quotex | 2024 | Shipped
Random quote generator with theme switching and smooth animations.
Tech: JavaScript, React, Tailwind CSS
Domains: Frontend, API Integration, UI/UX, Animations
`.trim();

export async function POST(req: Request) {
  try {
    const { jd } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ error: "Not configured" }, { status: 500 });
    }
    if (!jd || typeof jd !== "string" || jd.trim().length < 30) {
      return Response.json({ error: "JD too short" }, { status: 400 });
    }

    const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      maxRetries: 0,
      prompt: `You are analyzing a job description to match it against a developer's portfolio projects.

DEVELOPER: Bibek Pathak, Full-Stack Engineer focused on AI and data.
Core skills: React, Next.js, TypeScript, Python, FastAPI, MongoDB, Tailwind CSS, REST APIs.

HIS PROJECTS:
${PROJECT_CONTEXT}

JOB DESCRIPTION:
${jd.slice(0, 5000)}

Instructions:
- Score each project 0 to 100 for how relevant it is to this specific job description
- Extract up to 3 short phrases (2 to 6 words each) that appear verbatim or near-verbatim in the JD and are satisfied by that project
- Be honest: if a project is irrelevant, score it 0 to 15 with empty matchedRequirements
- overallMatch is a holistic score of how well Bibek's full portfolio fits the role
- All text should sound like Bibek speaking in first person (direct, confident, no hype words)
- NEVER use em-dashes (—) or en-dashes (–) in any output text. Use periods, commas, colons, or parentheses instead.

Return ONLY raw JSON, no markdown fences, no explanation, just the object:
{
  "overallMatch": <integer 0-100>,
  "summary": "<one punchy sentence in first person as Bibek about the overall fit>",
  "rankedProjects": [
    {
      "name": "<exact name: KaryaAI | CrumbCraft | WatchThis!AI | VectorVance | GridNavigator | TickTickFocus | Quotex>",
      "score": <integer 0-100>,
      "matchedRequirements": ["<short phrase from JD>"],
      "whyItMatters": "<one sentence in first person explaining why this project is evidence for this role>"
    }
  ]
}
Include all 7 projects, sorted by score descending.`,
    });

    const clean = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim();

    const result = JSON.parse(clean);

    // Validate shape minimally
    if (
      typeof result.overallMatch !== "number" ||
      !Array.isArray(result.rankedProjects)
    ) {
      throw new Error("Invalid response shape");
    }

    // Defense in depth: strip em/en dashes from any model-generated copy.
    const stripDashes = (s: unknown) =>
      typeof s === "string" ? s.replace(/[—–]/g, ",") : s;
    if (typeof result.summary === "string") result.summary = stripDashes(result.summary);
    if (Array.isArray(result.rankedProjects)) {
      for (const p of result.rankedProjects) {
        p.whyItMatters = stripDashes(p.whyItMatters);
        if (Array.isArray(p.matchedRequirements)) {
          p.matchedRequirements = p.matchedRequirements.map(stripDashes);
        }
      }
    }

    return Response.json(result);
  } catch (err) {
    console.error("JD match error:", err);
    return Response.json({ error: "Analysis failed" }, { status: 500 });
  }
}
