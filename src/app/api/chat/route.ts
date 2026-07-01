import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { z } from "zod";
import { getContent } from "@/lib/storage";
import { isSameOrigin } from "@/lib/http";
import { publicRateLimit } from "@/lib/rate-limit";
import type { Project, Certificate } from "@/lib/content/types";

// Bound the request: reject oversized/abusive payloads before they reach Gemini.
const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().max(4000),
      })
    )
    .min(1)
    .max(40),
});

// Plain-text helper so throttle/validation replies keep the client's parsing
// contract (it reads text + the trailing [[FOLLOWUPS: ...]] line).
function textResponse(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// KNOWLEDGE BASE — built from Vercel Blob storage, falls back to defaults
// ══════════════════════════════════════════════════════════════════════════════

type KBProject = { tag: string; description: string; stack: string; live?: string; github?: string; year: number; status: string };
type KBCert = { title: string; issuer: string; year: number; skills: string[]; url: string };

function buildProjectsKB(projects: Project[]): Record<string, KBProject> {
  return Object.fromEntries(
    projects.map((p) => [
      p.id,
      {
        tag: p.tag,
        description: p.description,
        stack: p.tech.join(", "),
        ...(p.live ? { live: p.live.replace(/^https?:\/\//, "") } : {}),
        ...(p.github ? { github: p.github.replace(/^https?:\/\//, "") } : {}),
        year: p.year,
        status: p.status === "In progress" ? "In progress" : "Shipped",
      },
    ])
  );
}

function buildCertsKB(certificates: Certificate[]): KBCert[] {
  return certificates.map((c) => ({
    title: c.title,
    issuer: c.issuer,
    year: c.year,
    skills: c.skills,
    url: c.url.replace(/^https?:\/\//, ""),
  }));
}

// Mutable KB — refreshed from storage on every POST request
let PROJECTS: Record<string, KBProject> = {};
let CERTIFICATES: KBCert[] = [];

async function refreshKB() {
  const content = await getContent();
  PROJECTS = buildProjectsKB(content.projects);
  CERTIFICATES = buildCertsKB(content.certificates);
  DISPLAY_NAMES = Object.fromEntries(content.projects.map((p) => [p.id, p.name]));
  REPO_KEY_BY_NAME = Object.fromEntries(
    content.projects
      .filter((p) => Boolean(p.github))
      .map((p) => [normalize((p.github ?? "").split("/").pop() ?? ""), p.id])
  );
}

const PROJECT_ALIASES: Record<string, string> = {
  karya: "karyaai", "karya ai": "karyaai", karyaai: "karyaai",
  crumb: "crumbcraft", craft: "crumbcraft", crumbcraft: "crumbcraft",
  revveal: "revveal", "car deal": "revveal", "car-deal": "revveal",
  vector: "vectorvance", vectorvance: "vectorvance", "autonomous car": "vectorvance",
  buzz: "buzzboard", buzzboard: "buzzboard", "buzz board": "buzzboard", messageboard: "buzzboard", "message board": "buzzboard", "topic stats": "buzzboard",
};

// Repos whose GitHub name differs from the public app name but that are NOT separate
// curated projects. The "PaisaPilot" repo IS DollarPilot — my HackLions 2026 winner —
// so the bot must never present the repo and the app as two different projects.
const REPO_APP_NAME: Record<string, string> = {
  paisapilot: "DollarPilot",
};

function appNameForRepo(repoName: string): string | null {
  return REPO_APP_NAME[normalize(repoName)] ?? null;
}

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
    !/project|built|karya|crumb|revveal|vector|buzz|message\s*board/i.test(lower);
}

function detectContactQuery(text: string): boolean {
  return /\b(email|hire|contact|reach|linkedin|resume|cv|available|availability|apply|recruiter|salary)\b/i.test(text);
}

function detectAllProjectsQuery(text: string): boolean {
  return /\ball\s+project|show.*project|list.*project|what.*built|what.*shipped|portfolio|everything|all.*work/i.test(text);
}

// ── Local response builders ───────────────────────────────────────────────────

// Canonical display names (the app name, which can differ from the GitHub repo name —
// e.g. the "car-deal" repo is the Revveal app).
// DISPLAY_NAMES is rebuilt from storage in refreshKB(); fall back to title-casing the id.
let DISPLAY_NAMES: Record<string, string> = {};

function displayName(key: string): string {
  return DISPLAY_NAMES[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
}

function buildProjectCard(key: string): string {
  const p = PROJECTS[key];
  if (!p) return "";
  const name = displayName(key);

  const links = [
    p.live ? `Live: https://${p.live}` : null,
    p.github ? `Source: https://${p.github}` : null,
  ].filter(Boolean).join("  ·  ") || "Ask me about the implementation details.";
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
    const mappedKey = repoKeyFor(r.name);
    const bits = [
      r.language,
      r.stargazers_count ? `★${r.stargazers_count}` : null,
      r.description ? `"${r.description}"` : null,
      monthYear(r.pushed_at) ? `last push ${monthYear(r.pushed_at)}` : null,
      mappedKey
        ? `(this repo IS my ${displayName(mappedKey)} project — same thing, not a separate project)`
        : null,
    ].filter(Boolean);
    return `- ${r.name}${bits.length ? ` — ${bits.join(", ")}` : ""}`;
  });
  return `\n\n═══ LIVE GITHUB REPOS (github.com/${GH_USER}) ═══\nThese are fetched live. Talk about any of them naturally if asked.\n${lines.join("\n")}`;
}

// Normalize for repo-name matching ("VectorVance" -> "vectorvance")
function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Rebuilt from PROJECTS after each refreshKB() call.
let REPO_KEY_BY_NAME: Record<string, string> = {};

function repoKeyFor(repoName: string): string | null {
  return REPO_KEY_BY_NAME[normalize(repoName)] ?? null;
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
    const mappedKey = repoKeyFor(r.name);
    const label = mappedKey ? displayName(mappedKey) : r.name;
    const repoNote =
      mappedKey && normalize(label) !== normalize(r.name) ? ` (repo: ${r.name})` : "";
    const desc = mappedKey
      ? ` — ${PROJECTS[mappedKey].description}`
      : r.description ? ` — ${r.description}` : "";
    return `- **${label}**${r.language ? ` (${r.language})` : ""}${repoNote}${desc}`;
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
${Object.entries(PROJECTS).map(([key, p]) => {
  const repo = p.github?.split("/").pop() ?? "";
  const repoNote = repo && normalize(repo) !== normalize(key) ? ` [GitHub repo: ${repo}]` : "";
  return `- ${displayName(key)} (${p.tag})${repoNote}: ${p.description} Stack: ${p.stack}. Status: ${p.status}.`;
}).join("\n")}

NAMING: some of my repos are named differently from the app. The "car-deal" repo on GitHub IS my Revveal project — same thing, one project. Likewise the "SmartTodo" repo is KaryaAI, and the "crumb" repo is CrumbCraft. Never describe a repo and its app as two separate projects, and always prefer the app name (Revveal, KaryaAI, CrumbCraft).

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
    // Same-origin only — the chatbot is invoked from our own pages. Cheap CSRF-style
    // layer; the real abuse defense is the per-IP rate limit below.
    if (!isSameOrigin(req)) {
      return textResponse("Forbidden", 403);
    }

    // Throttle per IP — each Gemini call costs money. 20 requests / minute.
    if (!(await publicRateLimit(req, "chat", 20, 60))) {
      return textResponse(
        "You're going a bit fast — give it a minute and try again.\n[[FOLLOWUPS: see projects | contact | certificates]]",
        429
      );
    }

    // Refresh KB from Vercel Blob (60 s cache — effectively free)
    await refreshKB();

    const parsed = chatRequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return textResponse("Invalid request.", 400);
    }
    const { messages } = parsed.data;
    const lastUserMsg: string = messages.findLast((m) => m.role === "user")?.content ?? "";

    const mentionsGitHub = /\b(github|repo|repositor)/i.test(lastUserMsg);

    // ── 1. Live GitHub lookups — fetched fresh, no Gemini needed ────────────
    if (detectGitHubListQuery(lastUserMsg)) {
      const repos = await getRepos();
      return new Response(buildRepoListResponse(repos), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }

    // "cruze from github", or any message naming a live repo
    if (!detectAllProjectsQuery(lastUserMsg)) {
      const repos = await getRepos();
      const repo = matchRepoByName(lastUserMsg, repos);
      if (repo) {
        // If this repo is actually one of my curated projects (the repo name may differ
        // from the app name, e.g. car-deal -> Revveal), always answer with the rich curated
        // card so the bot never treats the repo and the app as two different projects.
        const mappedKey = repoKeyFor(repo.name);
        if (mappedKey) {
          return new Response(buildProjectCard(mappedKey), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
        }
        // Otherwise it's a non-curated repo — surface it only if they pointed at GitHub
        // or didn't name a curated project.
        if (mentionsGitHub || !detectProjectQuery(lastUserMsg)) {
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
