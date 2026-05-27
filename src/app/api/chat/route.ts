import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

// ══════════════════════════════════════════════════════════════════════════════
// KNOWLEDGE BASE — answers common questions locally, no Gemini call needed
// ══════════════════════════════════════════════════════════════════════════════

const PROJECTS: Record<string, {
  tag: string; description: string; stack: string; live?: string;
  github: string; year: number; status: string;
}> = {
  karyaai: {
    tag: "MERN Stack · Productivity",
    description: "Task manager with JWT auth, MongoDB syncing, and AI-powered task sorting.",
    stack: "React, Node.js, MongoDB, Express, Tailwind",
    live: "karyaai.vercel.app",
    github: "github.com/RavangDai/SmartTodo",
    year: 2026, status: "Shipped",
  },
  crumbcraft: {
    tag: "Full-stack · AI · Productivity",
    description: "Two AI dev tools in one. Crumb compresses messy conversations into structured docs; Craft engineers precise prompts.",
    stack: "Next.js, React, Tailwind, Gemini 2.5, Framer Motion",
    live: "crumbcrraft.vercel.app",
    github: "github.com/RavangDai/crumb",
    year: 2026, status: "Shipped",
  },
  revveal: {
    tag: "Full-stack · AI · Data",
    description: "Finds underpriced used cars before everyone else. Async Celery + Redis pipeline scrapes marketplaces, predicts fair market price, ranks by discount. JWT auth, rate-limited APIs.",
    stack: "FastAPI, React, PostgreSQL, Celery, Redis, Docker",
    github: "github.com/RavangDai/car-deal",
    year: 2026, status: "In progress — core works, real scraper and ML pricing still building",
  },
  vectorvance: {
    tag: "Raspberry Pi · Computer Vision · Robotics",
    description: "Autonomous car on Raspberry Pi. Follows lanes, detects obstacles and traffic signs with SSD MobileNet, navigates colour-coded forks, streams live telemetry to a web dashboard.",
    stack: "Python, OpenCV, Flask, Raspberry Pi, SSD MobileNet, PID control, NumPy, lgpio",
    github: "github.com/RavangDai/VectorVance",
    year: 2025, status: "Shipped",
  },
  gridnavigator: {
    tag: "Algorithms · Visualization",
    description: "Interactive visualizer for pathfinding — A*, Dijkstra, BFS, DFS — on live grids.",
    stack: "TypeScript, React, Vite",
    live: "grid-navigator-mu.vercel.app",
    github: "github.com/RavangDai/GridNavigator",
    year: 2025, status: "Shipped",
  },
  ticktickfocus: {
    tag: "Productivity · PWA",
    description: "Minimal Pomodoro timer PWA. Fully offline-capable, zero distractions.",
    stack: "React, Tailwind, PWA",
    live: "tick-tick-focus.vercel.app",
    github: "github.com/RavangDai/TickTickFocus",
    year: 2025, status: "Shipped",
  },
  quotex: {
    tag: "Frontend · API",
    description: "Quote generator with theme switching and smooth animations.",
    stack: "JavaScript, React, Tailwind",
    live: "quotex-five.vercel.app",
    github: "github.com/RavangDai/Quotex",
    year: 2024, status: "Shipped",
  },
};

const CERTIFICATES = [
  {
    title: "Software Engineer Certificate",
    issuer: "HackerRank",
    year: 2025,
    skills: ["Problem Solving", "REST API Design", "Full-stack Architecture", "Data Structures"],
    url: "hackerrank.com/certificates/iframe/1ec7df9efdd8",
  },
  {
    title: "SQL (Advanced) Certificate",
    issuer: "HackerRank",
    year: 2025,
    skills: ["Complex Queries", "Joins & Subqueries", "Indexing", "Performance Tuning"],
    url: "hackerrank.com/certificates/a0f6fb1fb4af",
  },
  {
    title: "Excel Fundamentals - Finance",
    issuer: "Corporate Finance Institute",
    year: 2024,
    skills: ["Financial Modeling", "Pivot Tables", "Data Analysis", "Excel Formulas"],
    url: "credentials.corporatefinanceinstitute.com/88b6efc3-2491-4e1d-9e12-433819361baa",
  },
];

const PROJECT_ALIASES: Record<string, string> = {
  karya: "karyaai", "karya ai": "karyaai", karyaai: "karyaai",
  crumb: "crumbcraft", craft: "crumbcraft", crumbcraft: "crumbcraft",
  revveal: "revveal", "car deal": "revveal", "car-deal": "revveal",
  vector: "vectorvance", vectorvance: "vectorvance", "autonomous car": "vectorvance",
  grid: "gridnavigator", gridnavigator: "gridnavigator", pathfinding: "gridnavigator",
  "ticktick": "ticktickfocus", pomodoro: "ticktickfocus", ticktickfocus: "ticktickfocus",
  quotex: "quotex", quote: "quotex",
};

// ── Local intent detection ────────────────────────────────────────────────────

function detectProjectQuery(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [alias, key] of Object.entries(PROJECT_ALIASES)) {
    if (lower.includes(alias)) return key;
  }
  return null;
}

function detectCertQuery(text: string): boolean {
  const lower = text.toLowerCase();
  return /cert|credential|hackerrank|sql advanced|excel|finance institute|verified|qualification/i.test(lower);
}

function detectStackQuery(text: string): boolean {
  const lower = text.toLowerCase();
  return /\bstack\b|tech.*use|what.*build with|language|framework|tool|skill/i.test(lower) &&
    !/project|built|karya|crumb|revveal|vector|grid|tick|quotex/i.test(lower);
}

function detectContactQuery(text: string): boolean {
  return /\b(email|hire|contact|reach|linkedin|resume|cv|available|availability|apply|recruiter|salary)\b/i.test(text);
}

function detectAllProjectsQuery(text: string): boolean {
  return /\ball\s+project|show.*project|list.*project|what.*built|what.*shipped|portfolio|everything|all.*work/i.test(text);
}

// ── Local response builders ───────────────────────────────────────────────────

function buildProjectCard(key: string): string {
  const p = PROJECTS[key];
  if (!p) return "";
  const name = key === "karyaai" ? "KaryaAI"
    : key === "crumbcraft" ? "CrumbCraft"
    : key === "vectorvance" ? "VectorVance"
    : key === "gridnavigator" ? "GridNavigator"
    : key === "ticktickfocus" ? "TickTickFocus"
    : key.charAt(0).toUpperCase() + key.slice(1);

  const links = [
    p.live ? `Live: https://${p.live}` : null,
    `Source: https://${p.github}`,
  ].filter(Boolean).join("  ·  ");
  const lines = [
    `Project: ${name}`,
    `Impact: ${p.description}`,
    `Stack: ${p.stack}`,
    `Tags: ${p.tag}`,
    `Status: ${p.status}`,
    `Prompt: ${links}`,
  ];
  const followup = `[[FOLLOWUPS: how did you build it | what's the stack | ask me anything]]`;
  return lines.join("\n") + "\n" + followup;
}

function buildAllProjectsResponse(): string {
  const cards = Object.keys(PROJECTS)
    .map((key) => buildProjectCard(key).split("\n[[FOLLOWUPS")[0])
    .join("\n\n");
  return cards + "\n[[FOLLOWUPS: best for hiring | tell me your story | download resume]]";
}

function buildCertResponse(): string {
  const lines = CERTIFICATES.map((c) =>
    `**${c.title}** — ${c.issuer} (${c.year})\nSkills: ${c.skills.join(", ")}\nVerify: https://${c.url}`
  );
  return (
    `Here's what I've got verified:\n\n` +
    lines.join("\n\n") +
    `\n\nAll independently issued, all verifiable.\n[[FOLLOWUPS: see my projects | what's your stack | are you available]]`
  );
}

function buildStackResponse(): string {
  return (
    `I ship with React, Next.js, TypeScript, Python, FastAPI. Solid on Node, MongoDB, PostgreSQL, Docker. ` +
    `Tailwind for styling, Framer Motion when animation matters.\n\n` +
    `Currently leveling up on RAG systems, vector databases, and LLM fine-tuning.\n` +
    `[[FOLLOWUPS: show a project | how do you use AI | see certifications]]`
  );
}

function buildContactResponse(): string {
  return (
    `Best way to reach me: drbibekg2029@gmail.com. ` +
    `Also on LinkedIn at https://linkedin.com/in/bibek-pathak-10398a301 ` +
    `and GitHub at https://github.com/RavangDai.\n\n` +
    `Resume is on the site — hit "Download Resume" on the hero. I'm open to remote or onsite roles right now.\n` +
    `[[FOLLOWUPS: see my projects | what's your availability | download resume]]`
  );
}

// ── GitHub live data (cached in module scope, refreshes every 10 min) ─────────

const GH_USER = "RavangDai";

type GHRepo = {
  name: string;
  stargazers_count: number;
  language: string | null;
  pushed_at: string;
  description: string | null;
  html_url: string;
  fork: boolean;
};

let ghCache: { data: GHRepo[]; fetchedAt: number } | null = null;
const GH_TTL = 10 * 60 * 1000; // 10 minutes

// Repos that are not worth surfacing (profile readme, throwaway class/test repos)
const GH_HIDE = new Set([GH_USER.toLowerCase(), "testme", "mongotestpub", "mongorender"]);

async function getRepos(): Promise<GHRepo[]> {
  const now = Date.now();
  if (ghCache && now - ghCache.fetchedAt < GH_TTL) return ghCache.data;
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "portfolio-chatbot",
    };
    // Authenticated requests get 5000 req/hr instead of 60 req/hr (per IP)
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const res = await fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`, {
      headers,
      signal: AbortSignal.timeout(3500),
    });
    if (!res.ok) return ghCache?.data ?? [];
    const repos: GHRepo[] = await res.json();
    ghCache = { data: repos, fetchedAt: now };
    return repos;
  } catch {
    return ghCache?.data ?? [];
  }
}

// Real repos worth showing: skip forks and hidden/throwaway repos
function meaningfulRepos(repos: GHRepo[]): GHRepo[] {
  return repos.filter((r) => !r.fork && !GH_HIDE.has(r.name.toLowerCase()));
}

function monthYear(iso: string): string {
  return iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "";
}

// Live-data context injected into Gemini's system prompt
function formatGHReposForPrompt(repos: GHRepo[]): string {
  const list = meaningfulRepos(repos);
  if (!list.length) return "";
  const lines = list.slice(0, 20).map((r) => {
    const bits = [
      r.language,
      r.stargazers_count ? `★${r.stargazers_count}` : null,
      r.description ? `"${r.description}"` : null,
      monthYear(r.pushed_at) ? `last push ${monthYear(r.pushed_at)}` : null,
    ].filter(Boolean);
    return `- ${r.name}${bits.length ? ` — ${bits.join(", ")}` : ""}`;
  });
  return `\n\n═══ LIVE GITHUB REPOS (github.com/${GH_USER}) ═══\nThese are fetched live. Talk about any of them naturally if asked.\n${lines.join("\n")}`;
}

// Normalize for repo-name matching ("VectorVance" -> "vectorvance")
function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Find a repo the user referenced by name (e.g. "cruze from github")
function matchRepoByName(query: string, repos: GHRepo[]): GHRepo | null {
  const q = normalize(query);
  // Longest repo names first so "vectorvance" wins over a short partial
  const sorted = [...meaningfulRepos(repos)].sort((a, b) => b.name.length - a.name.length);
  for (const r of sorted) {
    const n = normalize(r.name);
    if (n.length >= 4 && q.includes(n)) return r;
  }
  return null;
}

// Build a project-style card from a LIVE GitHub repo
function buildRepoCard(r: GHRepo): string {
  const lines = [
    `Project: ${r.name}`,
    `Impact: ${r.description || "A project I have up on GitHub."}`,
    `Stack: ${r.language || "Mixed"}`,
    `Tags: GitHub${r.stargazers_count ? ` · ★${r.stargazers_count}` : ""}`,
    `Status: ${monthYear(r.pushed_at) ? `last pushed ${monthYear(r.pushed_at)}` : "On GitHub"}`,
    `Prompt: Want the link? ${r.html_url}`,
  ];
  return lines.join("\n") + "\n[[FOLLOWUPS: see the code | what else is on github | ask me anything]]";
}

// List the live repos when asked "what's on your github"
function buildRepoListResponse(repos: GHRepo[]): string {
  const list = meaningfulRepos(repos);
  if (!list.length) {
    return "GitHub's not responding right now, try in a sec. Meanwhile, ask me about my main projects.\n[[FOLLOWUPS: show projects | what's your stack | try again]]";
  }
  const lines = list.slice(0, 12).map((r) => {
    const desc = r.description ? ` — ${r.description}` : "";
    return `- **${r.name}**${r.language ? ` (${r.language})` : ""}${desc}`;
  });
  return (
    `Here's what's live on my GitHub right now (github.com/${GH_USER}):\n\n` +
    lines.join("\n") +
    `\n\nAsk me about any one of them.\n[[FOLLOWUPS: tell me about cruze | best project | what's your stack]]`
  );
}

function detectGitHubListQuery(text: string): boolean {
  const lower = text.toLowerCase();
  return /\b(github|repos?|repositor)/i.test(lower) &&
    /\b(all|list|show|what|every|your|on)\b/i.test(lower);
}

// ══════════════════════════════════════════════════════════════════════════════
// SYSTEM PROMPT (Gemini fallback for conversational queries)
// ══════════════════════════════════════════════════════════════════════════════

function buildSystemPrompt(ghContext: string): string {
  const certBlock = CERTIFICATES.map((c) =>
    `- ${c.title} | ${c.issuer} | ${c.year} | Skills: ${c.skills.join(", ")}`
  ).join("\n");

  return `
You are Bibek Pathak. You ARE me, in first person, talking directly to whoever opened my portfolio.

═══════════════ VOICE ═══════════════
- First person always: "I", "my", "I built". Never refer to "Bibek" in third person.
- Short natural sentences, the way a developer texts. Not a resume.
- Direct and grounded. Specifics over adjectives. No hype words ("amazing", "passionate", "incredible").
- No em dashes (-- or —). Use commas, periods, or just reword.
- Confidence comes from what I shipped, not how I describe it.
- Self-deprecating beats eager. "the early version was rough" wins over "I worked really hard".

═══════════════ NO ROBOT FALLBACKS (FORBIDDEN) ═══════════════
NEVER say: "I don't have information on that", "Based on the context provided", "As an AI",
"I'm not able to provide", "Unfortunately, I don't", "I cannot", "I'm unable to".

When I don't know something: "honestly, never touched it" / "outside my lane, sorry" /
"no idea, but ask me about [adjacent topic]" / deflect with dry humor and pivot to my work.

═══════════════ ABOUT ME ═══════════════
- Full-Stack Engineer focused on AI and data
- Studying Computer Science at Southeastern Louisiana University (SELU)
- Looking for internships and engineering roles, remote or onsite
- Email: drbibekg2029@gmail.com
- LinkedIn: linkedin.com/in/bibek-pathak-10398a301
- GitHub: github.com/RavangDai
- Won 1st place at HackLions 2026 with DollarPilot (built in 6 hours, devpost.com/software/dollarpilot)

═══════════════ MY STACK ═══════════════
Ship with: React, Next.js, TypeScript, Python, FastAPI, MongoDB, Tailwind, Framer Motion
Solid: Node.js, Express, REST API design, PostgreSQL, SQL, Git, Docker, Vercel
Learning: LLM fine-tuning, vector databases, RAG systems

═══════════════ MY PROJECTS ═══════════════
${Object.entries(PROJECTS).map(([, p]) => `- ${p.tag}: ${p.description} Stack: ${p.stack}. Status: ${p.status}.`).join("\n")}

═══════════════ MY CERTIFICATES ═══════════════
${certBlock}

═══════════════ MY TAKES ═══════════════
- Tailwind beats CSS-in-JS for most cases. DX wins.
- TypeScript saves more time than it costs, even solo.
- I'd rather ship ugly than ship late.
- RAG beats fine-tuning for most use cases.
- MongoDB for prototypes. Postgres for anything serious.
- Framer Motion is worth the bundle size for portfolios, not products.
${ghContext}

═══════════════ THINKING RULES ═══════════════
- Calibrated uncertainty: "pretty sure", "from memory", "don't quote me".
- Have opinions. Don't just list facts.
- Anticipate the next question.
- Stories over lists.

═══════════════ PROJECT CARD FORMAT ═══════════════
When asked about a SPECIFIC project, use EXACTLY this structure:

Project: [Name]
Impact: [first-person sentence]
Stack: [tools]
Tags: [tags]
Status: [Shipped / In progress]
Prompt: [follow-up hook]

═══════════════ FOLLOWUP CHIPS (REQUIRED ON EVERY REPLY) ═══════════════
At the END of every response, on its own line:
[[FOLLOWUPS: chip 1 | chip 2 | chip 3]]

Rules: 2-3 chips. Max 4 words each. Lowercase. Pipe-separated. Context-specific.

═══════════════ LENGTH ═══════════════
Under 120 words unless explicitly asked for more.
`.trim();
}

// ══════════════════════════════════════════════════════════════════════════════
// ROUTE
// ══════════════════════════════════════════════════════════════════════════════

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserMsg: string = messages.findLast((m: { role: string; content: string }) => m.role === "user")?.content ?? "";

    const mentionsGitHub = /\b(github|repo|repositor)/i.test(lastUserMsg);

    // ── 1. Live GitHub lookups — fetched fresh, no Gemini needed ────────────
    if (detectGitHubListQuery(lastUserMsg)) {
      const repos = await getRepos();
      return new Response(buildRepoListResponse(repos), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }

    // "cruze from github", or any message naming a live repo
    {
      const repos = await getRepos();
      const repo = matchRepoByName(lastUserMsg, repos);
      // Only short-circuit to a live repo card if it's not one of the 7 curated
      // projects (those have richer hand-written copy) or the user explicitly said "github"
      if (repo && (mentionsGitHub || !PROJECTS[normalize(repo.name)])) {
        const curatedKey = detectProjectQuery(lastUserMsg);
        if (!curatedKey || mentionsGitHub) {
          return new Response(buildRepoCard(repo), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
        }
      }
    }

    // ── 2. Local knowledge base — no Gemini needed ──────────────────────────
    const projectKey = detectProjectQuery(lastUserMsg);
    if (projectKey && !detectAllProjectsQuery(lastUserMsg)) {
      const response = buildProjectCard(projectKey);
      return new Response(response, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }

    if (detectAllProjectsQuery(lastUserMsg)) {
      return new Response(buildAllProjectsResponse(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }

    if (detectCertQuery(lastUserMsg)) {
      return new Response(buildCertResponse(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }

    if (detectStackQuery(lastUserMsg)) {
      return new Response(buildStackResponse(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }

    if (detectContactQuery(lastUserMsg)) {
      return new Response(buildContactResponse(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }

    // ── 3. Gemini for conversational queries ─────────────────────────────────
    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        "AI is not configured. Reach out directly at drbibekg2029@gmail.com\n[[FOLLOWUPS: see projects | contact | certificates]]",
        { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } }
      );
    }

    // Inject live GitHub repos into Gemini's context
    const ghContext = formatGHReposForPrompt(await getRepos());

    const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: buildSystemPrompt(ghContext),
      messages,
      maxRetries: 0,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.textStream) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch (error: unknown) {
          const errStr = String(error);
          const isQuota = errStr.includes("429") || errStr.includes("quota") || errStr.includes("RESOURCE_EXHAUSTED");
          const fallback = isQuota
            ? "Hit a rate limit — try again in a minute, or use the contact form below.\n[[FOLLOWUPS: try again | open contact | see projects]]"
            : "Something glitched. Try again in a moment.\n[[FOLLOWUPS: try again | see projects | how to reach me]]";
          controller.enqueue(encoder.encode(fallback));
          controller.close();
        }
      },
    });

    return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch (error: unknown) {
    console.error("Chat error:", error);
    return new Response(
      "Something went wrong. Please try again.\n[[FOLLOWUPS: try again | see projects]]",
      { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }
}
