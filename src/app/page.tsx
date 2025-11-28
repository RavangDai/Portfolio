import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { ProjectsSection } from "@/components/ui/projects-section";
import { AboutSection } from "@/components/ui/about-section";
import { ContactSection } from "@/components/ui/contact-section";

export default function HomePage() {
  return (
    <>
      <HeroGeometric />
      <ProjectsSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
  