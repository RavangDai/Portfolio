import { z } from "zod";
import { ICON_NAMES } from "./icons";

// Validation for every content write. Strict shapes (unknown keys stripped),
// bounded lengths, and protocol-checked URLs so nothing unsafe can be
// persisted from the admin dashboard.

const shortText = z.string().trim().min(1).max(200);
const longText = z.string().trim().min(1).max(2000);

const httpsUrl = z
  .url()
  .max(2000)
  .refine((value) => /^https?:\/\//i.test(value), "Must be an http(s) URL");

// Images may be a /public path or an uploaded Blob URL.
const imageRef = z
  .string()
  .trim()
  .min(1)
  .max(2000)
  .refine(
    (value) => value.startsWith("/") || /^https:\/\//i.test(value),
    "Must be a /path or an https URL"
  );

const iconName = z.enum(ICON_NAMES);

export const projectSchema = z.object({
  id: z.string().trim().min(1).max(64),
  name: shortText,
  tag: shortText,
  description: longText,
  tech: z.array(z.string().trim().min(1).max(60)).max(20),
  github: httpsUrl.optional(),
  live: httpsUrl.optional(),
  video: httpsUrl.optional(),
  year: z.number().int().min(2000).max(2100),
  status: z.enum(["Completed", "In progress"]),
  image: imageRef,
});

export const certificateSchema = z.object({
  id: z.string().trim().min(1).max(64),
  title: shortText,
  issuer: shortText,
  year: z.number().int().min(2000).max(2100),
  category: shortText,
  summary: longText,
  skills: z.array(z.string().trim().min(1).max(60)).max(12),
  image: imageRef,
  url: httpsUrl,
  icon: iconName,
  featured: z.boolean().optional(),
});

export const achievementSchema = z.object({
  id: z.string().trim().min(1).max(64),
  date: shortText,
  title: shortText,
  org: shortText,
  category: z.enum(["Academic", "Certification", "Competition", "Project"]),
  desc: longText,
  icon: iconName,
  highlight: z.boolean().optional(),
  url: httpsUrl.optional(),
});

export const statSchema = z.object({
  value: z.string().trim().min(1).max(20),
  label: z.string().trim().min(1).max(60),
});

export const siteInfoSchema = z.object({
  statusText: z.string().trim().min(1).max(40),
  heroLine1: shortText,
  heroLine2: shortText,
  builderLine1: shortText,
  builderLine2: shortText,
  email: z.email().max(200),
  githubUrl: httpsUrl,
  linkedinUrl: httpsUrl,
  resumeUrl: imageRef,
});

// Reject collections that contain duplicate ids — they cause React key collisions in
// the admin list and ambiguous edit/delete targeting.
const uniqueIds = <T extends { id: string }>(items: T[]) =>
  new Set(items.map((i) => i.id)).size === items.length;

const projectsArray = z.array(projectSchema).max(50).refine(uniqueIds, "Duplicate id");
const certificatesArray = z.array(certificateSchema).max(50).refine(uniqueIds, "Duplicate id");
const achievementsArray = z.array(achievementSchema).max(50).refine(uniqueIds, "Duplicate id");
const statsArray = z.array(statSchema).max(8);

export const siteContentSchema = z.object({
  projects: projectsArray,
  certificates: certificatesArray,
  achievements: achievementsArray,
  stats: statsArray,
  site: siteInfoSchema,
  updatedAt: z.string().optional(),
});

// Per-section schemas for PUT /api/admin/content/[section]
export const SECTION_SCHEMAS = {
  projects: projectsArray,
  certificates: certificatesArray,
  achievements: achievementsArray,
  stats: statsArray,
  site: siteInfoSchema,
} as const;

export type SectionKey = keyof typeof SECTION_SCHEMAS;

export function isSectionKey(value: string): value is SectionKey {
  return value in SECTION_SCHEMAS;
}
