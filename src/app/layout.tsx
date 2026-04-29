import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { MainNavbar } from "@/components/ui/main-navbar";
import { Footer } from "@/components/ui/footer";
import { Chatbot } from "@/components/ui/Chatbot";
import { ScrollProgress } from "@/components/ui/scroll-progress";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-lora",
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
    <html lang="en" className={`dark scroll-smooth ${inter.variable} ${lora.variable}`} suppressHydrationWarning>

      <body className="font-sans bg-[#060916] text-white antialiased min-h-screen" suppressHydrationWarning>
        <ScrollProgress />
        <MainNavbar />
        {children}
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}