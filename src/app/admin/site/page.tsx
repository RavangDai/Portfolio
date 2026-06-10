import { getContent } from "@/lib/storage";
import { AdminSiteClient } from "@/components/admin/AdminSiteClient";

export default async function AdminSitePage() {
  const { site } = await getContent();
  return <AdminSiteClient initial={site} />;
}
