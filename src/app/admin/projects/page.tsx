import { getContent } from "@/lib/storage";
import { AdminProjectsClient } from "@/components/admin/AdminProjectsClient";

export default async function AdminProjectsPage() {
  const { projects } = await getContent();
  return <AdminProjectsClient initial={projects} />;
}
