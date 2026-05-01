import type { Metadata } from "next";
import { Raleway } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Bibek · Portfolio",
  description: "Designing with data. Building premium web experiences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark scroll-smooth ${raleway.variable}`} suppressHydrationWarning>
      <body className="font-sans bg-[#080808] text-white antialiased min-h-screen" suppressHydrationWarning>
        <ScrollProgress />
        <MainNavbar />
        {children}
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
