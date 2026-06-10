import { getContent } from "@/lib/storage";
import { AdminCertificatesClient } from "@/components/admin/AdminCertificatesClient";

export default async function AdminCertificatesPage() {
  const { certificates } = await getContent();
  return <AdminCertificatesClient initial={certificates} />;
}
