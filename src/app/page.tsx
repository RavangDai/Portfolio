import { HomeHero } from "@/components/ui/home-hero";

// Home is the cosmos hero only. The scroll ends in the hero's own EXPLORE beat, whose
// buttons route to /projects, /certificates, /achievements, /contact (their own pages).
// Hero is rendered without any transform wrapper so its position: sticky keeps working.
export default function HomePage() {
  return <HomeHero />;
}
