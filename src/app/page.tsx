import { HomeHero } from "@/components/ui/home-hero";

// The scroll ends in the hero's own EXPLORE beat, whose buttons route to
// /projects, /certificates, /achievements, /contact (their own pages).
// The hero is a client-only animated scene (loaded with ssr:false), so the server
// HTML would otherwise contain no readable text. This screen-reader-only block is
// rendered on the server so crawlers always receive a real <h1> + bio carrying the
// name variations that matter for search. It's visually hidden and out of flow, so
// it never affects the hero's position: sticky layout.
export default function HomePage() {
  return (
    <>
      <section className="sr-only">
        <h1>Bibek Pathak · Full-Stack Engineer &amp; AI/ML Developer</h1>
        <p>
          Bibek Pathak, also known as BibekTech and online as RavangDai, is a
          full-stack engineer and AI/ML developer and a Computer Science student at
          Southeastern Louisiana University. He builds with React, Next.js, TypeScript,
          and Python, has shipped 10+ projects, and won 1st place at HackLions 2026.
          This is his portfolio. Explore his projects, certificates, achievements, and
          ways to get in touch.
        </p>
      </section>
      <HomeHero />
    </>
  );
}
