# 🌐 Bibek Pathak — Portfolio

**Live:** https://www.bibek.tech/

A premium personal portfolio built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Framer Motion** — featuring a self-built **AI chatbot**, a **password-protected admin CMS**, and a cohesive **light "neon brutalism"** design system.

---

## 🎨 Design System — Light Neon Brutalism

The entire site (hero, every page, all chrome, and the admin panel) runs on one disciplined design language:

- **Paper** background (`#faf8f2`) with a faint ink grid
- **Hard 2px ink borders** (`#0a0a0a`) and **hard offset shadows** (`Npx Npx 0 0`, never blurred)
- A single dominant **cobalt** accent (`#2E5BFF`) plus a few desaturated pastel fills
- **Sora** display headings + **Inter** body, mono labels/figures

Tokens and utilities live in `globals.css`, scoped under `.theme-brut` (`.brut-card`, `.brut-btn`, `.brut-input`, `.brut-chip`, `.brut-stat`, `.brut-bg`, `.brut-kicker`, `.brut-h`, …). The legacy glassmorphism layer (liquid-glass panels, refraction filters, `LiquidButton`) has been fully removed.

The homepage hero stays on a dark cosmos / blueprint fly-through; route-aware chrome reads `src/lib/theme.ts` (`BRUT_ROUTES`) to stay in sync.

---

## ✨ Features

- **AI Chatbot (`Bibek.AI`)** — streaming assistant that answers questions about projects, stack, and hireability. Blends a local knowledge base + live GitHub data (`GITHUB_TOKEN`) with a **Gemini** fallback (`GEMINI_API_KEY`), with optional voice (TTS) and follow-up chips.
- **Admin CMS** — `/admin` panel to manage Projects, Certificates, Achievements, Stats, and Site Info (hero copy, socials, résumé) with no redeploys. JWT-cookie auth (`jose` + `bcryptjs`), middleware route protection, and login rate-limiting.
- **Content storage** — content persists to **Vercel Blob** (`portfolio/content.json`), validated with **Zod**; falls back to `DEFAULT_CONTENT` when unconfigured. Résumé/PDF uploads go to Blob too.
- **Pages** — Projects, Certificates, Achievements, and Contact, each a brutalist bento/grid layout.
- **Contact form** — `/api/contact` backend with success/error states.

---

## 🚀 Tech Stack

| Category | Technologies |
|---------|--------------|
| **Framework** | Next.js 16 · React 19 · TypeScript |
| **Styling** | Tailwind CSS · custom `.theme-brut` design tokens |
| **Motion** | Framer Motion · GSAP · Three.js / COBE (hero) |
| **AI** | Vercel AI SDK · Google Gemini · GitHub API |
| **Auth** | jose (JWT) · bcryptjs · Next.js middleware |
| **Storage** | Vercel Blob · Zod validation |
| **Email** | Resend / Nodemailer |
| **Deploy** | Vercel |

---

## 📁 Project Structure

```bash
src/
 ├── app/
 │   ├── page.tsx                 # Homepage (cosmos hero)
 │   ├── layout.tsx               # Root layout + global chrome
 │   ├── projects/ certificates/ achievements/ contact/
 │   ├── admin/                   # Protected CMS (own brutalist chrome)
 │   │   ├── layout.tsx  page.tsx (dashboard)
 │   │   ├── login/  projects/  certificates/  achievements/  site/
 │   └── api/
 │       ├── chat/                # AI chatbot (streaming)
 │       ├── contact/             # Contact form
 │       ├── auth/login·logout/   # Admin session
 │       └── admin/content/[section]·upload/   # CMS write endpoints
 │
 ├── components/
 │   ├── admin/                   # Admin client editors
 │   └── ui/                      # Navbar, footer, chatbot, sections, hero
 │
 ├── lib/
 │   ├── theme.ts                 # BRUT_ROUTES + route-aware helpers
 │   ├── auth.ts  rate-limit.ts   # JWT + login throttling
 │   ├── storage.ts               # Vercel Blob content read/write
 │   └── content/                 # types · schema (zod) · defaults · icons
 │
 └── middleware.ts                # Guards /admin routes
```

---

## 🔑 Environment Variables

Create `.env.local`:

```bash
# Admin auth
JWT_SECRET=                 # random secret for signing admin sessions
ADMIN_EMAIL=                # admin login email
ADMIN_PASSWORD_HASH=        # bcrypt hash of the admin password

# Content storage
BLOB_READ_WRITE_TOKEN=      # Vercel Blob token (CMS persistence + uploads)

# Chatbot
GEMINI_API_KEY=             # Google Gemini (AI fallback)
GITHUB_TOKEN=               # GitHub API (live repo data)

# Misc
NEXT_PUBLIC_SITE_URL=       # canonical site URL for metadata
```

Without `BLOB_READ_WRITE_TOKEN` the site renders default content; without the AI keys the chatbot degrades gracefully.

---

## 🛠 Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # eslint
```

Admin panel: visit `/admin/login`.
