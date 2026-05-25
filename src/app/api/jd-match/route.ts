import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

// ── Project knowledge base ────────────────────────────────────────────────────

type Profile = {
  name: string;
  tech: string[];     // exact tool/library names — weight 3
  domains: string[];  // concept/domain terms   — weight 2
  keywords: string[]; // descriptive phrases     — weight 1
};

const PROFILES: Profile[] = [
  {
    name: "KaryaAI",
    tech: ["react", "node.js", "mongodb", "express", "tailwind", "jwt", "typescript", "javascript"],
    domains: ["full-stack", "mern", "rest api", "authentication", "ai", "productivity"],
    keywords: ["task manager", "task management", "crud", "database", "web app", "sync"],
  },
  {
    name: "CrumbCraft",
    tech: ["next.js", "react", "tailwind", "gemini", "typescript", "javascript"],
    domains: ["full-stack", "ai", "llm", "generative ai", "developer tools", "prompt engineering", "saas"],
    keywords: ["ai tools", "document generation", "template", "workflow", "developer productivity"],
  },
  {
    name: "Revveal",
    tech: ["fastapi", "python", "react", "typescript", "postgresql", "celery", "redis", "docker", "sqlalchemy"],
    domains: ["full-stack", "ai", "machine learning", "rest api", "devops", "web scraping", "async", "background jobs", "authentication"],
    keywords: ["used cars", "price prediction", "marketplace", "scraping", "task queue", "jwt", "rate limiting", "data pipeline"],
  },
  {
    name: "VectorVance",
    tech: ["python", "opencv", "flask", "numpy", "raspberry pi", "mobilenet", "tensorflow"],
    domains: ["computer vision", "robotics", "embedded systems", "machine learning", "deep learning", "real-time systems", "iot", "autonomous systems"],
    keywords: ["lane detection", "obstacle detection", "object detection", "autonomous driving", "sensor", "gpio", "edge computing", "hardware"],
  },
  {
    name: "GridNavigator",
    tech: ["typescript", "react", "vite", "javascript"],
    domains: ["algorithms", "data structures", "visualization", "frontend"],
    keywords: ["pathfinding", "graph algorithms", "a*", "dijkstra", "bfs", "dfs", "interactive ui"],
  },
  {
    name: "TickTickFocus",
    tech: ["react", "tailwind", "javascript", "pwa"],
    domains: ["frontend", "progressive web app", "offline-first", "productivity"],
    keywords: ["pomodoro", "timer", "focus", "service worker", "lightweight"],
  },
  {
    name: "Quotex",
    tech: ["javascript", "react", "tailwind"],
    domains: ["frontend", "api integration", "ui design", "animations"],
    keywords: ["quote", "theme switching", "responsive design"],
  },
];

// Display names for matched terms shown in the UI
const DISPLAY: Record<string, string> = {
  "react": "React", "next.js": "Next.js", "typescript": "TypeScript",
  "python": "Python", "node.js": "Node.js", "fastapi": "FastAPI",
  "postgresql": "PostgreSQL", "mongodb": "MongoDB", "docker": "Docker",
  "opencv": "OpenCV", "flask": "Flask", "tensorflow": "TensorFlow",
  "numpy": "NumPy", "express": "Express", "tailwind": "Tailwind CSS",
  "vite": "Vite", "jwt": "JWT", "pwa": "PWA", "gemini": "Gemini AI",
  "celery": "Celery", "redis": "Redis", "sqlalchemy": "SQLAlchemy",
  "web scraping": "web scraping", "background jobs": "background jobs",
  "async": "async", "authentication": "authentication",
  "raspberry pi": "Raspberry Pi", "mobilenet": "MobileNet",
  "full-stack": "full-stack", "mern": "MERN stack", "rest api": "REST API",
  "machine learning": "machine learning", "deep learning": "deep learning",
  "computer vision": "computer vision", "ai": "AI", "llm": "LLM",
  "generative ai": "Generative AI", "developer tools": "developer tooling",
  "prompt engineering": "prompt engineering", "saas": "SaaS",
  "recommendation system": "recommendation systems", "devops": "DevOps",
  "robotics": "robotics", "embedded systems": "embedded systems",
  "real-time systems": "real-time systems", "iot": "IoT",
  "autonomous systems": "autonomous systems", "algorithms": "algorithms",
  "data structures": "data structures", "visualization": "visualization",
  "progressive web app": "PWA",
};

function displayTerm(term: string): string {
  return DISPLAY[term] ?? term
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ── Stop words ────────────────────────────────────────────────────────────────

const STOP = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with",
  "by","from","as","is","are","was","were","be","been","being","have","has",
  "had","do","does","did","will","would","could","should","may","might","you",
  "we","our","your","they","their","this","that","these","those","it","its",
  "not","no","so","up","out","if","about","who","which","what","when","where",
  "how","all","also","just","than","then","into","through","including","work",
  "working","strong","good","excellent","well","experience","experienced",
  "years","year","team","role","position","candidate","required","requirements",
  "preferred","plus","ability","skills","skill","knowledge","understanding",
  "familiarity","looking","seeking","join","help","build","building","create",
  "using","use","used","new","within","across","both","any","each","every",
  "some","other","another","more","most","many","much","very","highly",
]);

// ── Matching logic ────────────────────────────────────────────────────────────

function termHitsJD(term: string, jdLower: string): boolean {
  const esc = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Multi-word phrases: substring match is sufficient
  if (term.includes(" ")) return jdLower.includes(term);
  // Single tokens: require word boundaries so "react" doesn't match "reactive"
  return new RegExp(`\\b${esc}\\b`).test(jdLower);
}

function scoreProject(
  profile: Profile,
  jdLower: string
): { score: number; matched: string[] } {
  const matched: string[] = [];
  let raw = 0;
  let maxRaw = 0;

  for (const t of profile.tech) {
    maxRaw += 3;
    if (termHitsJD(t, jdLower)) { raw += 3; matched.push(t); }
  }
  for (const d of profile.domains) {
    maxRaw += 2;
    if (termHitsJD(d, jdLower)) { raw += 2; matched.push(d); }
  }
  for (const k of profile.keywords) {
    maxRaw += 1;
    if (termHitsJD(k, jdLower)) { raw += 1; matched.push(k); }
  }

  const score = maxRaw === 0 ? 0 : Math.min(100, Math.round((raw / maxRaw) * 100));
  return { score, matched };
}

function computeOverall(scores: number[]): number {
  if (scores.every((s) => s === 0)) return 8;
  // Weight top projects more heavily: top 45%, 2nd 28%, 3rd 15%, rest split
  const sorted = [...scores].sort((a, b) => b - a);
  const weights = [0.45, 0.28, 0.15, 0.08, 0.04, 0, 0];
  const weighted = sorted.reduce((sum, v, i) => sum + v * (weights[i] ?? 0), 0);
  return Math.min(95, Math.round(weighted));
}

// ── Route ─────────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const { jd } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ error: "Not configured" }, { status: 500 });
    }
    if (!jd || typeof jd !== "string" || jd.trim().length < 30) {
      return Response.json({ error: "JD too short" }, { status: 400 });
    }

    const jdLower = jd.toLowerCase();

    // ── Our own scoring — no AI involved ──────────────────────────────────────
    const scored = PROFILES.map((profile) => {
      const { score, matched } = scoreProject(profile, jdLower);
      return { name: profile.name, score, matched };
    });

    const overallMatch = computeOverall(scored.map((p) => p.score));
    const ranked = [...scored].sort((a, b) => b.score - a.score);

    // ── Gemini writes prose only — scores are locked ──────────────────────────
    const matchSummary = ranked
      .map((p) => `${p.name}: score=${p.score}/100, matched=[${p.matched.map(displayTerm).join(", ")}]`)
      .join("\n");

    const stripDashes = (s: unknown) =>
      typeof s === "string" ? s.replace(/[—–]/g, ",") : s;

    let prose: { summary?: string; whyItMatters?: Record<string, string> } = {};

    try {
      const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
      const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        maxRetries: 0,
        prompt: `You are writing copy for Bibek Pathak's portfolio JD matcher.

DEVELOPER: Bibek Pathak, Full-Stack Engineer. Core skills: React, Next.js, TypeScript, Python, FastAPI, AI/ML.

JOB DESCRIPTION (excerpt):
${jd.slice(0, 1500)}

PRE-COMPUTED SCORES (do not change — these are final):
Overall fit: ${overallMatch}/100
${matchSummary}

Write ONLY the human-readable copy based on the data above.
Rules:
- summary: one direct first-person sentence about overall fit, max 18 words
- whyItMatters per project: one direct first-person sentence, max 18 words. If score < 20, be honest and brief.
- Never use em-dashes or en-dashes. Use commas or periods instead.
- Voice: Bibek speaking, direct and confident, no filler words or hype.

Return ONLY raw JSON, no markdown:
{
  "summary": "...",
  "whyItMatters": {
    "KaryaAI": "...",
    "CrumbCraft": "...",
    "Revveal": "...",
    "VectorVance": "...",
    "GridNavigator": "...",
    "TickTickFocus": "...",
    "Quotex": "..."
  }
}`,
      });

      const clean = text
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```\s*$/i, "")
        .trim();
      prose = JSON.parse(clean);
    } catch (proseErr) {
      console.error("Gemini prose generation failed, using fallbacks:", proseErr);
    }

    const rankedProjects = ranked.map((p) => ({
      name: p.name,
      score: p.score,
      matchedRequirements: p.matched.map(displayTerm).slice(0, 3),
      whyItMatters: stripDashes(
        prose.whyItMatters?.[p.name] ??
          (p.score >= 20
            ? `This project directly demonstrates skills relevant to this role.`
            : `This project shows breadth but is less central to this role.`)
      ) as string,
    }));

    return Response.json({
      overallMatch,
      summary: stripDashes(
        prose.summary ?? `My portfolio matches ${overallMatch}% of this role based on tech and domain overlap.`
      ),
      rankedProjects,
    });
  } catch (err) {
    console.error("JD match error:", err);
    return Response.json({ error: "Analysis failed" }, { status: 500 });
  }
}
