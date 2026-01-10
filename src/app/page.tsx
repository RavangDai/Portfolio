
import { ProjectsSection } from "@/components/ui/projects-section";
import { CertificatesSection } from "@/components/ui/certificates-section";

import { ContactSection } from "@/components/ui/contact-section";
import { NewHero }from "@/components/ui/new-hero";




export default function HomePage() {
  return (
    <>
      <NewHero />
      <ProjectsSection />
      
      <CertificatesSection />
      <ContactSection />
      
    </>
  );
}
  