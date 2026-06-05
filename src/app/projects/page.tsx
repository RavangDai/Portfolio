import { ProjectsSection } from "@/components/ui/projects-section";

export const metadata = {
  title: "Projects · Bibek Pathak",
  description: "10+ builds across React, Next.js, Python, and applied AI.",
};

export default function ProjectsPage() {
  // No PageTransition wrapper: the gallery relies on sticky/fixed pinning, which
  // a transform ancestor (PageTransition) would break.
  return <ProjectsSection />;
}
