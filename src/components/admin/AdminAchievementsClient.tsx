"use client";

import { useState } from "react";
import type { Achievement, Stat } from "@/lib/content/types";
import { ICON_NAMES } from "@/lib/content/icons";

const ACHIEVEMENT_CATEGORIES = ["Academic", "Certification", "Competition", "Project"] as const;

const EMPTY_ACH: Omit<Achievement, "id"> = {
  date: "", title: "", org: "", category: "Project",
  desc: "", icon: "Award", highlight: false, url: "",
};

const EMPTY_STAT: Stat = { value: "", label: "" };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="brut-kicker">{label}</label>
      {children}
    </div>
  );
}

const INPUT = "brut-input text-sm";
const TEXTAREA = `${INPUT} resize-none`;
const BTN_SM = "brut-mono rounded-[var(--brut-radius)] border-2 border-[var(--ink)] bg-[var(--paper)] px-3 py-1 text-[0.78rem] font-bold uppercase tracking-wide hover:bg-[var(--accent-soft)] transition-colors disabled:opacity-50";
const BTN_DEL = "brut-mono rounded-[var(--brut-radius)] border-2 border-[var(--ink)] bg-[var(--blush)] px-3 py-1 text-[0.78rem] font-bold uppercase tracking-wide hover:bg-[var(--accent)] hover:text-white transition-colors disabled:opacity-50";

export function AdminAchievementsClient({ initial, initialStats }: { initial: Achievement[]; initialStats: Stat[] }) {
  const [achievements, setAchievements] = useState<Achievement[]>(initial);
  const [stats, setStats] = useState<Stat[]>(initialStats);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [form, setForm] = useState<Omit<Achievement, "id">>(EMPTY_ACH);
  const [id, setId] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingStats, setSavingStats] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  function flash(text: string, ok: boolean) {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3500);
  }

  function startAdd() { setEditing(null); setId(""); setForm(EMPTY_ACH); }
  function startEdit(a: Achievement) {
    setEditing(a); setId(a.id);
    const { id: _, ...rest } = a;
    setForm(rest);
  }
  function cancel() { setEditing(null); setId(""); setForm(EMPTY_ACH); }
  function update<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    if (!id.trim()) return flash("ID is required", false);
    setSaving(true);
    const ach: Achievement = { id: id.trim(), ...form };
    if (!ach.url) delete ach.url;
    const updated = editing
      ? achievements.map((a) => (a.id === editing.id ? ach : a))
      : [...achievements, ach];
    const res = await fetch("/api/admin/content/achievements", {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated),
    });
    setSaving(false);
    if (res.ok) { setAchievements(updated); cancel(); flash(editing ? "Updated." : "Added.", true); }
    else { const d = await res.json().catch(() => ({})); flash(d.error ?? "Save failed.", false); }
  }

  async function remove(a: Achievement) {
    if (!confirm(`Delete "${a.title}"?`)) return;
    setDeleting(a.id);
    const updated = achievements.filter((x) => x.id !== a.id);
    const res = await fetch("/api/admin/content/achievements", {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated),
    });
    setDeleting(null);
    if (res.ok) { setAchievements(updated); flash("Deleted.", true); }
    else flash("Delete failed.", false);
  }

  async function saveStats() {
    setSavingStats(true);
    const res = await fetch("/api/admin/content/stats", {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(stats),
    });
    setSavingStats(false);
    if (res.ok) flash("Stats saved.", true);
    else flash("Stats save failed.", false);
  }

  const isOpen = editing !== null || id !== "" || form.title !== "";

  return (
    <div className="max-w-4xl space-y-8">
      {msg && (
        <div className={`rounded-[var(--brut-radius)] border-2 border-[var(--ink)] px-4 py-2.5 text-sm font-medium text-[var(--ink)] ${msg.ok ? "bg-[var(--mint)]" : "bg-[var(--blush)]"}`}>
          {msg.text}
        </div>
      )}

      {/* Stats editor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="brut-h text-xl">Stats</h2>
          <div className="flex gap-2">
            <button onClick={() => setStats((s) => [...s, { ...EMPTY_STAT }])} className={BTN_SM}>
              + Add stat
            </button>
            <button onClick={saveStats} disabled={savingStats} className="brut-btn !px-3 !py-1.5 !text-[0.78rem]">
              {savingStats ? "Saving…" : "Save stats"}
            </button>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="brut-card p-3 space-y-2">
              <input className={INPUT} value={s.value} onChange={(e) => setStats((st) => st.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} placeholder="10+" />
              <input className={INPUT} value={s.label} onChange={(e) => setStats((st) => st.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} placeholder="Projects Shipped" />
              <button onClick={() => setStats((st) => st.filter((_, j) => j !== i))} className="brut-mono text-[0.78rem] font-bold uppercase tracking-wide text-[var(--accent)] hover:underline">Remove</button>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-t-2 border-[var(--ink)] opacity-15" />

      {/* Achievements */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="brut-title text-3xl">Achievements</h1>
        {!isOpen && (
          <button onClick={startAdd} className="brut-btn">+ Add Achievement</button>
        )}
      </div>

      {isOpen && (
        <div className="brut-card p-5 space-y-4">
          <h2 className="brut-h text-base">{editing ? "Edit Achievement" : "New Achievement"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="ID (slug)">
              <input className={INPUT} value={id} onChange={(e) => setId(e.target.value.toLowerCase().replace(/\s+/g, "-"))} disabled={!!editing} placeholder="hackathon-win" />
            </Field>
            <Field label="Title">
              <input className={INPUT} value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="1st Place — HackLions" />
            </Field>
            <Field label="Date (e.g. Apr 2026)">
              <input className={INPUT} value={form.date} onChange={(e) => update("date", e.target.value)} placeholder="Apr 2026" />
            </Field>
            <Field label="Organisation">
              <input className={INPUT} value={form.org} onChange={(e) => update("org", e.target.value)} placeholder="SELU" />
            </Field>
            <Field label="Category">
              <select className={INPUT} value={form.category} onChange={(e) => update("category", e.target.value as Achievement["category"])}>
                {ACHIEVEMENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Icon">
              <select className={INPUT} value={form.icon} onChange={(e) => update("icon", e.target.value)}>
                {ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </Field>
            <Field label="URL (optional)">
              <input className={INPUT} value={form.url ?? ""} onChange={(e) => update("url", e.target.value)} placeholder="https://devpost.com/..." />
            </Field>
            <Field label="Highlight">
              <label className="flex items-center gap-2 cursor-pointer py-2">
                <input type="checkbox" checked={form.highlight ?? false} onChange={(e) => update("highlight", e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
                <span className="text-sm font-medium text-[var(--ink-2)]">Highlight (cobalt background)</span>
              </label>
            </Field>
          </div>
          <Field label="Description">
            <textarea className={TEXTAREA} rows={3} value={form.desc} onChange={(e) => update("desc", e.target.value)} placeholder="What you did and why it matters." />
          </Field>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="brut-btn">
              {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={cancel} className="brut-btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2.5">
        {achievements.map((a) => (
          <div key={a.id} className="brut-card flex items-center justify-between gap-4 px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-[var(--ink)] truncate">{a.title}</p>
              <p className="brut-mono text-xs text-[var(--ink-3)] truncate">{a.org} · {a.date} · {a.category}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => startEdit(a)} className={BTN_SM}>Edit</button>
              <button onClick={() => remove(a)} disabled={deleting === a.id} className={BTN_DEL}>
                {deleting === a.id ? "…" : "Delete"}
              </button>
            </div>
          </div>
        ))}
        {achievements.length === 0 && <p className="brut-mono text-sm text-[var(--ink-3)] py-4">No achievements yet.</p>}
      </div>
    </div>
  );
}
