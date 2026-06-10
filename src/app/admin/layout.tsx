import type { ReactNode } from "react";
import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";

const NAV = [
  { href: "/admin",              label: "Dashboard"     },
  { href: "/admin/projects",     label: "Projects"      },
  { href: "/admin/certificates", label: "Certificates"  },
  { href: "/admin/achievements", label: "Achievements"  },
  { href: "/admin/site",         label: "Site Info"     },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="theme-brut brut-bg min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b-2 border-[var(--ink)] bg-[var(--paper)] px-4 sm:px-6">
        <span className="brut-kicker">BIBEK.TECH / ADMIN</span>
        <LogoutButton />
      </header>

      <div className="flex">
        {/* Sidebar — hidden on mobile, shown ≥ lg */}
        <nav className="hidden lg:flex lg:w-52 lg:flex-col lg:border-r-2 lg:border-[var(--ink)] lg:bg-[var(--paper)] min-h-[calc(100vh-3.5rem)] p-4 gap-1.5 shrink-0">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="brut-mono rounded-[var(--brut-radius)] border-2 border-transparent px-3 py-2 text-sm font-semibold text-[var(--ink-2)] hover:border-[var(--ink)] hover:bg-[var(--accent-soft)] hover:text-[var(--ink)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile nav strip */}
        <div className="lg:hidden w-full border-b-2 border-[var(--ink)] bg-[var(--paper)] px-4 py-2 flex gap-2 overflow-x-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="brut-mono shrink-0 rounded-[var(--brut-radius)] border-2 border-[var(--ink)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)] bg-[var(--paper)] hover:bg-[var(--accent-soft)] transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
