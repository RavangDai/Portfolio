import { AchievementsSection } from "@/components/ui/achievements-section";
import { PageTransition } from "@/components/ui/page-transition";

export const metadata = {
  title: "Achievements · Bibek Pathak",
  description: "Competition wins, academic honors, and certifications.",
};

export default function AchievementsPage() {
  return (
    <PageTransition>
      <AchievementsSection />
    </PageTransition>
  );
}
