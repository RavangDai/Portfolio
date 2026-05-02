import { ProjectsSection } from "@/components/ui/projects-section";
import { CertificatesSection } from "@/components/ui/certificates-section";
import { ContactSection } from "@/components/ui/contact-section";
import { NewHero } from "@/components/ui/new-hero";
import { PageTransition } from "@/components/ui/page-transition";
import { SectionReveal } from "@/components/ui/section-reveal";
export default function HomePage() {
  return (
    <PageTransition>
      <NewHero />
      <SectionReveal>
        <ProjectsSection />
      </SectionReveal>
      <SectionReveal delay={0.05}>
        <CertificatesSection />
      </SectionReveal>
      <SectionReveal delay={0.05}>
        <ContactSection />
      </SectionReveal>
    </PageTransition>
  );
}
