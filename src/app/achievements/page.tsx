import { redirect } from "next/navigation";

// The site is a single scrolling page now; this legacy route funnels into the on-page section.
export default function AchievementsPage() {
  redirect("/#achievements");
}
