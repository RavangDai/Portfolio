import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { MainNavbar } from "@/components/ui/main-navbar";
import { Footer } from "@/components/ui/footer";
import { Chatbot } from "@/components/ui/Chatbot";
import { ScrollProgress } from "@/components/ui/scroll-progress";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-raleway",
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
    <html lang="en" className={`dark scroll-smooth ${raleway.variable}`} suppressHydrationWarning>
      <body className="font-sans bg-[#080808] text-white antialiased min-h-screen" suppressHydrationWarning>
        <MotionConfig reducedMotion="user">
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
