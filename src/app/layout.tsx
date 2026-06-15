import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { MainNavbar } from "@/components/ui/main-navbar";
import { Footer } from "@/components/ui/footer";
import { Chatbot } from "@/components/ui/Chatbot";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SiteBackground } from "@/components/ui/site-background";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  KEYWORDS,
  GOOGLE_SITE_VERIFICATION,
  buildJsonLd,
} from "@/lib/seo";

// Body + ALL UI text/labels use Inter (label classes add uppercase + letter-spacing in CSS).
// Exposed as --font-inter; --font-raleway and --font-brut-mono are aliased to it in globals.css
// so every existing reference resolves to Inter with no per-call edits.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

// Big identity titles ONLY (hero BIBEK PATHAK / BUILDER / EXPLORE + major page titles like
// "Built & Shipped") use Fraunces, a warm high-contrast display serif, via --font-brut-display.
// Loaded variable (no fixed weight) so large titles get its dramatic display optical cut.
const displayFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-brut-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Home uses the full default; every other page becomes "<Page> · Bibek Pathak".
  title: {
    default: DEFAULT_TITLE,
    template: "%s · Bibek Pathak",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: "BibekTech",
  keywords: KEYWORDS,
  authors: [{ name: "Bibek Pathak", url: SITE_URL }],
  creator: "Bibek Pathak",
  publisher: "Bibek Pathak",
  category: "technology",
  // Home canonical; section pages override with their own path.
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/brand/badge.png", type: "image/png" }],
    shortcut: "/brand/badge.png",
    apple: "/brand/badge.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  // Populated once you paste the Google Search Console token into env.
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark scroll-smooth ${inter.variable} ${displayFont.variable}`} suppressHydrationWarning>
      <body className="font-sans bg-[#080808] text-white antialiased min-h-screen" suppressHydrationWarning>
        {/* Person + WebSite structured data — helps Google build a name/brand
            knowledge result for "Bibek Pathak / BibekTech / RavangDai". */}
        <script
          type="application/ld+json"
          // Static, code-defined data (no user input). `<` is escaped so a future
          // string edit can never break out of the <script> tag.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildJsonLd()).replace(/</g, "\\u003c"),
          }}
        />

        {/* Site-wide route-aware background — fixed behind all content (z −10) */}
        <SiteBackground />

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
