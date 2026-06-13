import { AchievementsSection } from "@/components/ui/achievements-section";
import { PageTransition } from "@/components/ui/page-transition";
import { getContent } from "@/lib/storage";

export const metadata = {
  title: "Achievements",
  description:
    "Bibek Pathak's achievements: competition wins (HackLions 2026), academic honors, and certifications.",
  alternates: { canonical: "/achievements" },
};

export default async function AchievementsPage() {
  const { achievements, stats } = await getContent();
  return (
    <PageTransition>
      <AchievementsSection achievements={achievements} stats={stats} />
    </PageTransition>
  );
}
