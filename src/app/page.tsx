
import { ProjectsSection } from "@/components/ui/projects-section";
import { CertificatesSection } from "@/components/ui/certificates-section";
import { BlogSection } from "@/components/ui/Blogsection";
import { ContactSection } from "@/components/ui/contact-section";
import { NewHero }from "@/components/ui/new-hero";
import {Globe} from "@/components/ui/globe";



export default function HomePage() {
  return (
    <>
      <NewHero />
      <ProjectsSection />
      
      <CertificatesSection />
      <ContactSection />
      <BlogSection />
    </>
  );
}
  