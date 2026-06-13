// Single source of truth for SEO/identity data — used by metadata, structured
// data (JSON-LD), sitemap, robots, and the web manifest so every signal Google
// reads about "Bibek Pathak / BibekTech / RavangDai" stays consistent.

/**
 * Canonical production origin (no trailing slash).
 * Defaults to the real domain so canonicals never drift to preview deployments.
 * Override with NEXT_PUBLIC_SITE_URL only if the domain changes.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://bibek.tech"
).replace(/\/$/, "");

// Optional Google Search Console verification token (paste into Vercel env when set).
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined;

export const PROFILE = {
  name: "Bibek Pathak",
  // Every way someone might search for / refer to him. Drives <Person> alternateName.
  alternateName: ["Bibek", "BibekTech", "Bibek.Tech", "RavangDai", "Bibek Pathak"],
  firstName: "Bibek",
  lastName: "Pathak",
  jobTitle: "Full-Stack Engineer & AI/ML Developer",
  email: "drbibekg2029@gmail.com",
  university: "Southeastern Louisiana University",
  location: "Hammond, Louisiana, USA",
  github: "https://github.com/RavangDai",
  linkedin: "https://www.linkedin.com/in/bibek-pathak-10398a301/",
  knowsAbout: [
    "Full-Stack Development",
    "Artificial Intelligence",
    "Machine Learning",
    "React",
    "Next.js",
    "TypeScript",
    "Python",
    "FastAPI",
    "Computer Vision",
    "RAG systems",
  ],
} as const;

export const SITE_NAME = "Bibek Pathak — BibekTech";

export const DEFAULT_TITLE =
  "Bibek Pathak — Full-Stack & AI/ML Developer | BibekTech";

export const DEFAULT_DESCRIPTION =
  "Bibek Pathak (BibekTech) — full-stack engineer & AI/ML developer. 10+ projects in React, Next.js & Python, HackLions 2026 winner. Open to internships & engineering roles.";

// Keyword-rich but truthful list (still emitted; harmless if ignored by engines).
export const KEYWORDS = [
  "Bibek",
  "Bibek Pathak",
  "BibekTech",
  "Bibek.Tech",
  "Bibek Tech",
  "RavangDai",
  "Bibek Pathak portfolio",
  "Bibek Pathak developer",
  "Bibek Pathak SELU",
  "Full-Stack Engineer",
  "AI Developer",
  "Machine Learning Developer",
  "React",
  "Next.js",
  "Python",
];

/**
 * Person + WebSite JSON-LD graph. Linked by @id so Google treats the site as
 * belonging to the Person entity — the foundation for a name-search rich result
 * / knowledge panel. Rendered server-side in the root layout (on every page).
 */
export function buildJsonLd() {
  const personId = `${SITE_URL}/#person`;
  const siteId = `${SITE_URL}/#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: PROFILE.name,
        alternateName: PROFILE.alternateName,
        givenName: PROFILE.firstName,
        familyName: PROFILE.lastName,
        url: SITE_URL,
        image: `${SITE_URL}/bibekimage.png`,
        email: `mailto:${PROFILE.email}`,
        jobTitle: PROFILE.jobTitle,
        description: DEFAULT_DESCRIPTION,
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: PROFILE.university,
        },
        homeLocation: {
          "@type": "Place",
          name: PROFILE.location,
        },
        knowsAbout: PROFILE.knowsAbout,
        sameAs: [PROFILE.github, PROFILE.linkedin],
      },
      {
        "@type": "WebSite",
        "@id": siteId,
        url: SITE_URL,
        name: SITE_NAME,
        alternateName: ["BibekTech", "Bibek Pathak Portfolio", "Bibek.Tech"],
        inLanguage: "en-US",
        publisher: { "@id": personId },
        about: { "@id": personId },
      },
    ],
  };
}
