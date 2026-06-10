# CLAUDE.md

Context for Claude Code working in this repository. The Next.js app lives entirely in this `portfolio-next/` directory — run all commands from here.

## What this is

Bibek Pathak's personal portfolio: a single-person Next.js site with a public marketing front end, an AI chatbot that answers as Bibek, and a password-protected admin CMS that edits all site content at runtime (no redeploy).

## Commands

```bash
npm run dev      # next dev (localhost:3000)
npm run build    # next build
npm run start    # serve the production build
npm run lint     # eslint (flat config, eslint.config.mjs)
```

There is **no test suite** — verify changes by running `npm run dev` and checking the page, plus `npm run build` for type/build errors.

## Stack

- **Next.js 16** (App Router) + **React 19**, **TypeScript** (strict).
- **React Compiler is ON** (`reactCompiler: true` in `next.config.ts`) — do not hand-add `useMemo`/`useCallback` for things the compiler already handles; follow the Rules of React or it will bail out.
- **Tailwind CSS v4** (PostCSS plugin, no `tailwind.config.js`; theme tokens live in `src/app/globals.css` under `@theme inline`). `components.json` is shadcn-style; `cn()` is in `src/lib/utils.ts`.
- **Framer Motion** (forced on via `<MotionConfig reducedMotion="never">` — animations always play), **GSAP**, **three** + **cobe** (globe) for the hero.
- **Vercel** is the deploy + storage target (`@vercel/blob`).
- Path alias: `@/*` → `src/*`.

## Layout

```
src/
  app/                     # App Router routes
    page.tsx               # home — renders <HomeHero/> only
    projects|certificates|achievements|contact/page.tsx
    admin/                 # CMS dashboard (protected)
    api/
      chat/route.ts        # chatbot (see below)
      contact/route.ts     # SMTP contact form (nodemailer)
      auth/{login,logout}/ # admin JWT auth
      admin/{content/[section],upload}/  # CMS writes (protected)
  components/
    ui/                    # all public site components
    admin/                 # admin dashboard client components
  lib/
    content/               # types.ts, schema.ts (zod), defaults.ts, icons.ts
    storage.ts             # Vercel Blob read/write of the content doc
    auth.ts, rate-limit.ts # JWT + login throttling
    theme.ts, utils.ts
  middleware.ts            # protects /admin + /api/admin
```

## Content / CMS system (the core architecture)

All editable site data is **one JSON document** (`SiteContent`: projects, certificates, achievements, stats, site info) defined in `src/lib/content/types.ts` and validated by the Zod schema in `schema.ts`.

- `storage.ts` `getContent()` reads `portfolio/content.json` from Vercel Blob (60s revalidate). If `BLOB_READ_WRITE_TOKEN` is missing or the blob is absent/invalid, it falls back to `DEFAULT_CONTENT` in `defaults.ts`. `putContent()` re-validates and writes back.
- **Everything must round-trip through JSON** — that's why icons are stored as *string names* (resolved via `icons.ts`), not component references. Keep new fields serializable.
- The admin dashboard (`/admin/*`) edits this doc through `api/admin/content/[section]`; image/resume uploads go through `api/admin/upload` to Blob.

## Admin auth

- `middleware.ts` guards `/admin/:path*` and `/api/admin/:path*`. `/admin/login` is the only exempt path. Page routes redirect to login; API routes return 401 JSON.
- JWT via **jose** (HS256, 24h), stored in an httpOnly cookie `admin_session`. Helpers in `lib/auth.ts`.
- Login (`api/auth/login`) checks `ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH` (bcrypt), is same-origin only, and is rate-limited (`lib/rate-limit.ts`, 15-min lockout). Always runs `bcrypt.compare` even on email mismatch (timing-safe).

## Chatbot (`api/chat/route.ts`)

First-person "I am Bibek" assistant. Three tiers, checked in order, **before** falling back to the LLM:

1. **Live GitHub** — fetches `github.com/RavangDai` repos (10-min module cache) for "what's on your github" / repo-name lookups.
2. **Local knowledge base** — regex intent detection (`detectProjectQuery`, `detectCertQuery`, etc.) builds canned cards straight from the content doc. No LLM call.
3. **Gemini** — `gemini-2.5-flash` via `@ai-sdk/google` `streamText`, with a large first-person system prompt + live GitHub context injected. Streams plain text.

Conventions to preserve:
- Repo names differ from app names: `car-deal`→Revveal, `SmartTodo`→KaryaAI, `crumb`→CrumbCraft. The KB maps these so a repo and its app are never treated as two projects. Prefer the app name.
- Every reply ends with a `[[FOLLOWUPS: chip | chip | chip]]` line (2–3 lowercase chips) — the client parses these into quick-reply buttons.
- System-prompt voice rules are deliberate (first person, no em dashes, no "as an AI" fallbacks). Don't soften them.

## Theme / design — light neon brutalism

The site's identity is **light neon brutalism**: a paper surface (`#faf8f2`), hard black ink borders, hard **cobalt** offset shadows (`--cobalt: #2e5bff`), a faint blueprint/ink grid + grain, and chunky uppercase display type. The home hero is a **light brutalist blueprint** scene (`horizon-hero-section.tsx` — scroll-linked DOM/CSS + GSAP, not a 3D/Three.js scene). This brutalist look is the whole site, not a sub-section.

**It is route-aware** through `lib/theme.ts`:
- `BRUT_ROUTES` is the single source of truth for which routes render brutalism. It currently lists **every real route, including `/`** (home, projects, certificates, achievements, contact).
- Global chrome (navbar, footer, chatbot, scroll bar) and `SiteBackground` all read `useIsBrut()` so the look stays in sync. `/admin` suppresses global chrome entirely.
- `site-background.tsx` still contains a **dormant dark "aurora/cosmos" branch** for any non-brut route. Since `/` is in `BRUT_ROUTES`, that branch is effectively unused — **do not treat the site as dark.** The `<html class="dark">` in `layout.tsx` and `// cosmos hero` comments are leftovers from that retired iteration.

**Fonts (what's actually loaded):** **Inter** for body + all UI (`--font-inter` / `font-sans`, also aliased to `--font-brut-mono`) and **Sora** for big display titles (`--font-brut-display`). The `"Space Grotesk"` / `"JetBrains Mono"` names that appear in `globals.css` are **CSS fallback strings only — not loaded webfonts**; the loaded faces are Inter + Sora. The `--font-brut-*` variable names are kept for continuity. Trust the loaded fonts over the names.

`globals.css` also carries shadcn-style oklch tokens (`:root` + `.dark`) used by some primitives, plus the hand-written `.brut-*` / `.bp-*` (blueprint) classes that define the actual brutalist surfaces, buttons, and hero.

## Environment variables

Local secrets live in `.env.local` (gitignored). Used across the app:

- `JWT_SECRET` — signs/verifies admin sessions (auth + middleware).
- `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` — admin login (hash is bcrypt).
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob; without it the site serves `DEFAULT_CONTENT` read-only.
- `GEMINI_API_KEY` — chatbot LLM tier (absent → chatbot returns a "not configured" message).
- `GITHUB_TOKEN` — optional; lifts GitHub API rate limit from 60 to 5000/hr.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO`, `CONTACT_FROM` — contact form.
- `NEXT_PUBLIC_SITE_URL` — canonical URL for metadata (falls back to `VERCEL_URL`, then localhost).

`next.config.ts` allows remote images from Vercel Blob, Unsplash, aceternity, and `xubohuah.github.io`.

## Conventions

- New site components → `src/components/ui`; admin-only → `src/components/admin`.
- Don't hardcode portfolio data in components — it belongs in the content doc (`defaults.ts` for the seed) so the CMS can edit it.
- Keep `SiteContent` JSON-serializable (string icon names, no class instances).
- Comments in this codebase are dense and intentional; match that density when editing.
