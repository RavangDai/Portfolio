// Serializable content types — the single source of truth for everything the
// admin dashboard can edit. Icons are stored as string names (see icons.ts)
// so the whole document round-trips through JSON / Vercel Blob.

export type ProjectStatus = "Completed" | "In progress";

export interface Project {
  id: string;
  name: string;
  tag: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
  video?: string;
  year: number;
  status: ProjectStatus;
  image: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  year: number;
  category: string;
  summary: string;
  skills: string[];
  image: string;
  url: string;
  icon: string;
  featured?: boolean;
}

export type AchievementCategory = "Academic" | "Certification" | "Competition" | "Project";

export interface Achievement {
  id: string;
  date: string;
  title: string;
  org: string;
  category: AchievementCategory;
  desc: string;
  icon: string;
  highlight?: boolean;
  url?: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface SiteInfo {
  /** Hero status pill, e.g. "Available" */
  statusText: string;
  /** Hero beat 1 sublines */
  heroLine1: string;
  heroLine2: string;
  /** Hero beat 2 (BUILDER) sublines */
  builderLine1: string;
  builderLine2: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  /** Blob URL of the uploaded resume, or a /public path fallback */
  resumeUrl: string;
}

export interface SiteContent {
  projects: Project[];
  certificates: Certificate[];
  achievements: Achievement[];
  stats: Stat[];
  site: SiteInfo;
  updatedAt?: string;
}
