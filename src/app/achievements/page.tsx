import { AchievementsSection } from "@/components/ui/achievements-section";
import { PageTransition } from "@/components/ui/page-transition";
import { getContent } from "@/lib/storage";

export const metadata = {
  title: "Achievements · Bibek Pathak",
  description: "Competition wins, academic honors, and certifications.",
};

export default async function AchievementsPage() {
  const { achievements, stats } = await getContent();
  return (
    <PageTransition>
      <AchievementsSection achievements={achievements} stats={stats} />
    </PageTransition>
  );
}
