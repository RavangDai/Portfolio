import { getContent } from "@/lib/storage";
import { AdminAchievementsClient } from "@/components/admin/AdminAchievementsClient";

export default async function AdminAchievementsPage() {
  const { achievements, stats } = await getContent();
  return <AdminAchievementsClient initial={achievements} initialStats={stats} />;
}
