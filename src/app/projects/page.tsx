import { ProjectsSection } from "@/components/ui/projects-section";
import { PageTransition } from "@/components/ui/page-transition";
import { getContent } from "@/lib/storage";

export const metadata = {
  title: "Projects",
  description:
    "Projects by Bibek Pathak (BibekTech): 10+ builds across React, Next.js, Python, and applied AI.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const { projects } = await getContent();
  return (
    <PageTransition>
      <ProjectsSection projects={projects} />
    </PageTransition>
  );
}
