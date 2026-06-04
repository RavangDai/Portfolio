import { CertificatesSection } from "@/components/ui/certificates-section";
import { PageTransition } from "@/components/ui/page-transition";

export const metadata = {
  title: "Certificates · Bibek Pathak",
  description: "Professional certifications and completed credentials.",
};

export default function CertificatesPage() {
  return (
    <PageTransition>
      <CertificatesSection />
    </PageTransition>
  );
}
