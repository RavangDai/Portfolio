import { ProjectsSection } from "@/components/ui/projects-section";
import { PageTransition } from "@/components/ui/page-transition";

export const metadata = {
  title: "Projects · Bibek Pathak",
  description: "10+ builds across React, Next.js, Python, and applied AI.",
};

export default function ProjectsPage() {
  return (
    <PageTransition>
      <ProjectsSection />
    </PageTransition>
  );
}
