import type { Metadata } from "next";
import "./globals.css";
import { MainNavbar } from "@/components/ui/main-navbar";

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
    <html lang="en" className="dark scroll-smooth">

      <body className="bg-[#050509] text-white antialiased min-h-screen">
        <MainNavbar />
        {children}
      </body>
    </html>
  );
}