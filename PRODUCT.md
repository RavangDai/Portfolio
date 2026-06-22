# Product

## Register

brand

## Users

Recruiters, hiring managers, fellow engineers, and collaborators landing on Bibek Pathak's personal site — usually from a job application, a GitHub profile, a LinkedIn link, or a name search ("bibek pathak", "ravangdai"). They arrive to judge credibility fast: is this person a real, capable full-stack / AI-ML engineer worth a reply? Context is a quick scan, often on mobile, often skeptical.

## Product Purpose

A single-person portfolio that proves competence by being well-made, not by claiming it. It showcases projects, certificates, and achievements; lets visitors interrogate Bibek's background through a first-person AI chatbot; and is fully editable at runtime through a private admin CMS (no redeploys). Success = the visitor leaves convinced Bibek can build polished, technically ambitious things — and ideally reaches out.

## Brand Personality

Light neon brutalism: confident, hand-built, technically literate, a little playful. Three words: **crafted, structural, unbluffed**. Warm paper surface, hard ink borders, hard cobalt offset shadows, chunky display type. The voice shows the work rather than narrating it; the design itself is the argument. Not corporate, not minimalist-safe, not a template.

## Anti-references

- Generic SaaS landing templates (hero-metric blocks, identical icon-heading-text card grids, gradient-on-navy).
- "AI made that" portfolio kits — centered hero, three feature cards, fade-on-scroll everything.
- Editorial-magazine cosplay (display-serif + italic + drop caps) on a brief that isn't a magazine.
- Cheap skeuomorphism: glossy glows, drop-shadow soup, bevels for their own sake. Skeuomorphic touches (paper, tape, torn edges) must read as deliberate material, not decoration.

## Design Principles

- **Show, don't tell.** Craft is the credential; the interface's quality stands in for the résumé claim.
- **Material honesty.** Brutalism leads. Skeuomorphic flourishes (torn paper, washi tape, fibre tooth) earn their place by reading like real material under real light, never as gimmick.
- **Restraint with one loud move.** Warm paper + ink is the calm baseline; cobalt and terracotta accents and the occasional bold gesture carry the voice. No cheap glows.
- **Mobile-first, motion-aware.** Every effect degrades gracefully and respects reduced motion; nothing ships that only works on a fast desktop.
- **Identity is already committed.** This is a shipping brand, not greenfield — preserve the established warm-brutalist system; refine within it rather than re-deciding it.

## Accessibility & Inclusion

- Decorative material (the torn-paper seam, fibre texture, tape) is `aria-hidden` and must never carry meaning a screen-reader user would miss.
- Respect `prefers-reduced-motion` for entrance/transition motion; provide a calm fallback.
- Body and UI text must hit WCAG AA contrast against the warm paper surface (ink `#1a1714` on `#f7f1e8` is the baseline pairing).
- The homepage keeps a server-rendered `sr-only` H1 + bio as the primary indexable, screen-reader-first content (the hero itself is `ssr:false`).

> Note: inferred from CLAUDE.md + project memory for an already-shipping site (register is unambiguously a portfolio/brand surface). Tell me if any of this is off and I'll refine it.
