import type { Metadata } from "next";
import { Raleway, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { MainNavbar } from "@/components/ui/main-navbar";
import { Footer } from "@/components/ui/footer";
import { Chatbot } from "@/components/ui/Chatbot";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SiteBackground } from "@/components/ui/site-background";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-raleway",
  display: "swap",
});

// Brutalist pages (projects / certificates / achievements / contact) use these.
// Space Grotesk for heavy display headings, JetBrains Mono for kicker labels,
// data tags and tabular figures. The hero/home keeps Raleway untouched.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-brut-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-brut-mono",
  display: "swap",
});

// Canonical site URL: set NEXT_PUBLIC_SITE_URL to your real domain in production.
// Falls back to the Vercel deployment URL, then localhost for dev.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const title = "Bibek Pathak · Full-Stack Engineer & AI/ML Developer";
const description =
  "Full-Stack Engineer and AI/ML developer. 10+ projects across React, Next.js, Python, and AI. Available for internships and engineering roles.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "Bibek Pathak",
    "Full-Stack Engineer",
    "AI Developer",
    "Machine Learning",
    "React",
    "Next.js",
    "Python",
    "Portfolio",
  ],
  authors: [{ name: "Bibek Pathak" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Bibek Pathak",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark scroll-smooth ${raleway.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="font-sans bg-[#080808] text-white antialiased min-h-screen" suppressHydrationWarning>
        {/* Site-wide animated Spline gradient — fixed behind all content (z −10) */}
        <SiteBackground />

        {/* Shared liquid-glass refraction filter — referenced by .liquid-glass / .glass-card
            via backdrop-filter:url(#liquid-distort). Mounted once for the whole app. */}
        <svg
          aria-hidden
          width="0"
          height="0"
          style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
        >
          <defs>
            <filter
              id="liquid-distort"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.012 0.012"
                numOctaves={2}
                seed={7}
                result="noise"
              />
              <feGaussianBlur in="noise" stdDeviation={2} result="blurred" />
              <feDisplacementMap
                in="SourceGraphic"
                in2="blurred"
                scale={26}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>

            {/* Stronger, living-wobble lens — used for the nav's liquid bending on hover/active */}
            <filter
              id="liquid-lens"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.008 0.013"
                numOctaves={2}
                seed={4}
                result="lensNoise"
              >
                <animate
                  attributeName="baseFrequency"
                  dur="13s"
                  values="0.008 0.013;0.013 0.018;0.008 0.013"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feGaussianBlur in="lensNoise" stdDeviation={1.4} result="lensBlur" />
              <feDisplacementMap
                in="SourceGraphic"
                in2="lensBlur"
                scale={44}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>

        <MotionConfig reducedMotion="never">
          <ScrollProgress />
          <MainNavbar />
          {children}
          <Footer />
          <Chatbot />
        </MotionConfig>
      </body>
    </html>
  );
}
