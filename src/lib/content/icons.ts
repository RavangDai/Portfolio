import {
  Award,
  BarChart3,
  BookOpen,
  Brain,
  Code2,
  Database,
  GraduationCap,
  Medal,
  Rocket,
  Star,
  Table2,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";

// Registry of icons the admin can pick for certificates / achievements.
// Content stores the string key; components resolve it here.
export const ICONS = {
  Award,
  BarChart3,
  BookOpen,
  Brain,
  Code2,
  Database,
  GraduationCap,
  Medal,
  Rocket,
  Star,
  Table2,
  Trophy,
  Zap,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export const ICON_NAMES = Object.keys(ICONS) as IconName[];

export function getIcon(name: string): LucideIcon {
  return ICONS[name as IconName] ?? Award;
}
