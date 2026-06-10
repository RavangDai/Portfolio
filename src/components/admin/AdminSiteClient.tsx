"use client";

import { useState } from "react";
import type { SiteInfo } from "@/lib/content/types";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="brut-kicker">{label}</label>
      {children}
    </div>
  );
}

const INPUT = "brut-input text-sm";

export function AdminSiteClient({ initial }: { initial: SiteInfo }) {
  const [form, setForm] = useState<SiteInfo>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  function flash(text: string, ok: boolean) {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3500);
  }

  function update<K extends keyof SiteInfo>(key: K, value: SiteInfo[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/content/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) flash("Site info saved.", true);
    else { const d = await res.json().catch(() => ({})); flash(d.error ?? "Save failed.", false); }
  }

  async function uploadResume(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", "resume");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);
    if (res.ok) {
      const { url } = await res.json();
      update("resumeUrl", url);
      flash("Resume uploaded. Click Save to persist.", true);
    } else {
      const d = await res.json().catch(() => ({}));
      flash(d.error ?? "Upload failed.", false);
    }
    e.target.value = "";
  }

  return (
    <div className="max-w-2xl space-y-6">
      {msg && (
        <div className={`rounded-[var(--brut-radius)] border-2 border-[var(--ink)] px-4 py-2.5 text-sm font-medium text-[var(--ink)] ${msg.ok ? "bg-[var(--mint)]" : "bg-[var(--blush)]"}`}>
          {msg.text}
        </div>
      )}

      <h1 className="brut-title text-3xl">Site Info</h1>

      <div className="brut-card p-5 space-y-4">
        <h2 className="brut-kicker">Hero</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Status pill text">
            <input className={INPUT} value={form.statusText} onChange={(e) => update("statusText", e.target.value)} placeholder="Available" />
          </Field>
          <Field label="Hero line 1">
            <input className={INPUT} value={form.heroLine1} onChange={(e) => update("heroLine1", e.target.value)} placeholder="Full-Stack Builder" />
          </Field>
          <Field label="Hero line 2">
            <input className={INPUT} value={form.heroLine2} onChange={(e) => update("heroLine2", e.target.value)} placeholder="AI / ML Developer" />
          </Field>
          <Field label="Builder line 1">
            <input className={INPUT} value={form.builderLine1} onChange={(e) => update("builderLine1", e.target.value)} placeholder="10+ shipped projects across full-stack web," />
          </Field>
          <Field label="Builder line 2">
            <input className={INPUT} value={form.builderLine2} onChange={(e) => update("builderLine2", e.target.value)} placeholder="applied AI, and computer vision." />
          </Field>
        </div>
      </div>

      <div className="brut-card p-5 space-y-4">
        <h2 className="brut-kicker">Contact & Socials</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email">
            <input type="email" className={INPUT} value={form.email} onChange={(e) => update("email", e.target.value)} />
          </Field>
          <Field label="GitHub URL">
            <input className={INPUT} value={form.githubUrl} onChange={(e) => update("githubUrl", e.target.value)} placeholder="https://github.com/..." />
          </Field>
          <Field label="LinkedIn URL">
            <input className={INPUT} value={form.linkedinUrl} onChange={(e) => update("linkedinUrl", e.target.value)} placeholder="https://linkedin.com/in/..." />
          </Field>
        </div>
      </div>

      <div className="brut-card p-5 space-y-4">
        <h2 className="brut-kicker">Resume</h2>
        <Field label="Resume URL (current)">
          <input className={INPUT} value={form.resumeUrl} onChange={(e) => update("resumeUrl", e.target.value)} placeholder="/resume.pdf or https://blob.vercel-storage.com/..." />
        </Field>
        {form.resumeUrl && (
          <a href={form.resumeUrl} target="_blank" rel="noreferrer" className="brut-mono inline-flex text-xs font-semibold text-[var(--accent)] underline underline-offset-2 hover:opacity-70">
            Preview current resume ↗
          </a>
        )}
        <div>
          <label className="brut-kicker mb-2 block">Upload new resume (PDF, max 10 MB)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={uploadResume}
            disabled={uploading}
            className="block w-full text-sm text-[var(--ink-2)] file:mr-3 file:rounded-[var(--brut-radius)] file:border-2 file:border-[var(--ink)] file:bg-[var(--paper)] file:px-3 file:py-1.5 file:text-xs file:font-bold file:uppercase file:tracking-wide file:text-[var(--ink)] hover:file:bg-[var(--accent-soft)] disabled:opacity-50 cursor-pointer"
          />
          {uploading && <p className="brut-mono mt-1 text-xs text-[var(--ink-3)]">Uploading…</p>}
        </div>
      </div>

      <button onClick={save} disabled={saving} className="brut-btn">
        {saving ? "Saving…" : "Save all changes"}
      </button>
    </div>
  );
}
