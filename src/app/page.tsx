import { HomeHero } from "@/components/ui/home-hero";
import { ProjectsSection } from "@/components/ui/projects-section";
import { CertificatesSection } from "@/components/ui/certificates-section";
import { AchievementsSection } from "@/components/ui/achievements-section";
import { ContactSection } from "@/components/ui/contact-section";
import { PaperTear } from "@/components/ui/paper-tear";
import { getContent } from "@/lib/storage";

// The site is now a single scrolling page: hero → projects → certificates → achievements →
// contact, each section carrying its own anchor id (#projects, #certificates, #achievements,
// #contact) for the nav/footer. The hero SSRs the visible <h1>; this sr-only paragraph adds the
// keyword-rich bio (name variants) that matters for search without a second visible heading.
export default async function HomePage() {
  const { projects, certificates, achievements, stats, site } = await getContent();
  return (
    <>
      <section className="sr-only">
        <h1>Bibek Pathak · Full-Stack Engineer &amp; AI/ML Developer</h1>
        <p>
          Bibek Pathak, also known as BibekTech and online as RavangDai, is a full-stack engineer and
          AI/ML developer and a Computer Science student at Southeastern Louisiana University. He builds
          with React, Next.js, TypeScript, and Python, has shipped 10+ projects, and won 1st place at
          HackLions 2026. Explore his projects, certificates, achievements, and ways to get in touch.
        </p>
      </section>

      <HomeHero site={site} />
      <PaperTear tape="tan" />
      <ProjectsSection projects={projects} />
      <PaperTear tape="blush" />
      <CertificatesSection certificates={certificates} />
      <PaperTear tape="mint" />
      <AchievementsSection achievements={achievements} stats={stats} />
      <PaperTear tape="tan" />
      <ContactSection />
    </>
  );
}
