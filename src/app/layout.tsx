import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MainNavbar } from "@/components/ui/main-navbar";
import { Footer } from "@/components/ui/footer";
import { Chatbot } from "@/components/ui/Chatbot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="en" className={`dark scroll-smooth ${inter.variable}`} suppressHydrationWarning>

      <body className="font-sans bg-[#050509] text-white antialiased min-h-screen" suppressHydrationWarning>
        <MainNavbar />
        {children}
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}