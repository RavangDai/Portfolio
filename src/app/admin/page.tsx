import Link from "next/link";
import { getContent } from "@/lib/storage";

export default async function AdminDashboard() {
  // Read fresh (no 60s cache) so counts and "Last saved" reflect the latest write.
  const content = await getContent({ fresh: true });
  const updatedAt = content.updatedAt
    ? new Date(content.updatedAt).toLocaleString()
    : "Never (using defaults)";

  const stats = [
    { label: "Projects",     value: content.projects.length,     href: "/admin/projects"     },
    { label: "Certificates", value: content.certificates.length, href: "/admin/certificates" },
    { label: "Achievements", value: content.achievements.length, href: "/admin/achievements" },
    { label: "Stats",        value: content.stats.length,        href: "/admin/site"         },
  ];

  return (
    <div className="max-w-3xl">
      <h1 className="brut-title text-3xl mb-1">Dashboard</h1>
      <p className="brut-mono text-xs text-[var(--ink-3)] mb-8">Last saved: {updatedAt}</p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-10">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="brut-card-i flex flex-col gap-1 p-4">
            <span className="brut-h text-3xl">{s.value}</span>
            <span className="brut-kicker">{s.label}</span>
          </Link>
        ))}
      </div>

      <div className="space-y-2">
        <h2 className="brut-kicker mb-4">Quick Actions</h2>
        {[
          { href: "/admin/projects",     label: "Manage Projects"      },
          { href: "/admin/certificates", label: "Manage Certificates"  },
          { href: "/admin/achievements", label: "Manage Achievements"  },
          { href: "/admin/site",         label: "Edit Site Info & Resume" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="brut-card-i flex items-center justify-between px-4 py-3 text-sm font-semibold text-[var(--ink)]"
          >
            {item.label}
            <span className="text-[var(--accent)]">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
