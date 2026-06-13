import { CertificatesSection } from "@/components/ui/certificates-section";
import { PageTransition } from "@/components/ui/page-transition";
import { getContent } from "@/lib/storage";

export const metadata = {
  title: "Certificates",
  description:
    "Bibek Pathak's professional certifications and verified credentials in software, SQL, and data.",
  alternates: { canonical: "/certificates" },
};

export default async function CertificatesPage() {
  const { certificates } = await getContent();
  return (
    <PageTransition>
      <CertificatesSection certificates={certificates} />
    </PageTransition>
  );
}
