"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Certificate } from "@/lib/content/types";
import { ICON_NAMES } from "@/lib/content/icons";
import { handleUnauthorized } from "@/lib/admin-client";

const EMPTY: Omit<Certificate, "id"> = {
  title: "", issuer: "", year: new Date().getFullYear(), category: "",
  summary: "", skills: [], image: "", url: "https://", icon: "Award", featured: false,
};

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

export function AdminCertificatesClient({ initial }: { initial: Certificate[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [certs, setCerts] = useState<Certificate[]>(initial);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [form, setForm] = useState<Omit<Certificate, "id">>(EMPTY);
  const [id, setId] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  function flash(text: string, ok: boolean) {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3500);
  }

  function startAdd() { setEditing(null); setId(""); setForm(EMPTY); setOpen(true); }
  function startEdit(c: Certificate) {
    setEditing(c); setId(c.id);
    const { id: _, ...rest } = c;
    setForm(rest);
    setOpen(true);
  }
  function cancel() { setEditing(null); setId(""); setForm(EMPTY); setOpen(false); }

  function update<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    const newId = id.trim();
    if (!newId) return flash("ID is required", false);
    if (!editing && certs.some((c) => c.id === newId))
      return flash(`ID "${newId}" already exists.`, false);
    setSaving(true);
    const cert: Certificate = { id: newId, ...form };
    const updated = editing
      ? certs.map((c) => (c.id === editing.id ? cert : c))
      : [...certs, cert];
    const res = await fetch("/api/admin/content/certificates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setSaving(false);
    if (handleUnauthorized(res, router, pathname, flash)) return;
    if (res.ok) { setCerts(updated); cancel(); flash(editing ? "Updated." : "Added.", true); }
    else { const d = await res.json().catch(() => ({})); flash(d.error ?? "Save failed.", false); }
  }

  async function remove(c: Certificate) {
    setDeleting(c.id);
    const updated = certs.filter((x) => x.id !== c.id);
    const res = await fetch("/api/admin/content/certificates", {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated),
    });
    setDeleting(null);
    setConfirmingId(null);
    if (handleUnauthorized(res, router, pathname, flash)) return;
    if (res.ok) { setCerts(updated); flash("Deleted.", true); }
    else flash("Delete failed.", false);
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div role="status" aria-live="polite">
        {msg && (
          <div className={`rounded-[var(--brut-radius)] border-2 border-[var(--ink)] px-4 py-2.5 text-sm font-medium text-[var(--ink)] ${msg.ok ? "bg-[var(--mint)]" : "bg-[var(--blush)]"}`}>
            {msg.text}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        <h1 className="brut-title text-3xl">Certificates</h1>
        {!open && (
          <button onClick={startAdd} className="brut-btn">+ Add Certificate</button>
        )}
      </div>

      {open && (
        <div className="brut-card p-5 space-y-4">
          <h2 className="brut-h text-base">{editing ? "Edit Certificate" : "New Certificate"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="ID (slug)">
              <input className={INPUT} value={id} onChange={(e) => setId(e.target.value.toLowerCase().replace(/\s+/g, "-"))} disabled={!!editing} placeholder="cert-slug" />
            </Field>
            <Field label="Title">
              <input className={INPUT} value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="SQL Advanced Certificate" />
            </Field>
            <Field label="Issuer">
              <input className={INPUT} value={form.issuer} onChange={(e) => update("issuer", e.target.value)} placeholder="HackerRank" />
            </Field>
            <Field label="Year">
              <input type="number" className={INPUT} value={form.year} onChange={(e) => { const n = parseInt(e.target.value, 10); update("year", Number.isNaN(n) ? form.year : n); }} />
            </Field>
            <Field label="Category">
              <input className={INPUT} value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="Data / Backend" />
            </Field>
            <Field label="Icon">
              <select className={INPUT} value={form.icon} onChange={(e) => update("icon", e.target.value)}>
                {ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </Field>
            <Field label="Image path or URL">
              <input className={INPUT} value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="/certificates/image.png" />
            </Field>
            <Field label="Credential URL">
              <input className={INPUT} value={form.url} onChange={(e) => update("url", e.target.value)} placeholder="https://..." />
            </Field>
            <Field label="Skills (comma-separated)">
              <input className={INPUT} value={form.skills.join(", ")} onChange={(e) => update("skills", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="SQL, Indexing, Joins" />
            </Field>
            <Field label="Featured">
              <label className="flex items-center gap-2 cursor-pointer py-2">
                <input type="checkbox" checked={form.featured ?? false} onChange={(e) => update("featured", e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
                <span className="text-sm font-medium text-[var(--ink-2)]">Mark as featured</span>
              </label>
            </Field>
          </div>
          <Field label="Summary">
            <textarea className={TEXTAREA} rows={2} value={form.summary} onChange={(e) => update("summary", e.target.value)} placeholder="One sentence describing what this certifies." />
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
        {certs.map((c) => (
          <div key={c.id} className="brut-card flex items-center justify-between gap-4 px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-[var(--ink)] truncate">{c.title}</p>
              <p className="brut-mono text-xs text-[var(--ink-3)] truncate">{c.issuer} · {c.year}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              {confirmingId === c.id ? (
                <>
                  <button onClick={() => remove(c)} disabled={deleting === c.id} className={BTN_DEL}>
                    {deleting === c.id ? "…" : "Confirm"}
                  </button>
                  <button onClick={() => setConfirmingId(null)} className={BTN_SM}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(c)} className={BTN_SM}>Edit</button>
                  <button onClick={() => setConfirmingId(c.id)} className={BTN_DEL}>Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
        {certs.length === 0 && <p className="brut-mono text-sm text-[var(--ink-3)] py-4">No certificates yet.</p>}
      </div>
    </div>
  );
}
