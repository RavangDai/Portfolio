"use client";

import { useState } from "react";
import type { Project } from "@/lib/content/types";

const EMPTY: Omit<Project, "id"> = {
  name: "", tag: "", description: "", tech: [], year: new Date().getFullYear(),
  status: "In progress", image: "", github: "", live: "", video: "",
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
const BTN_SM = "brut-mono rounded-[var(--brut-radius)] border-2 border-[var(--ink)] bg-[var(--paper)] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wide hover:bg-[var(--accent-soft)] transition-colors disabled:opacity-50";
const BTN_DEL = "brut-mono rounded-[var(--brut-radius)] border-2 border-[var(--ink)] bg-[var(--blush)] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wide hover:bg-[var(--accent)] hover:text-white transition-colors disabled:opacity-50";

interface Props {
  initial: Project[];
}

export function AdminProjectsClient({ initial }: Props) {
  const [projects, setProjects] = useState<Project[]>(initial);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project, "id">>(EMPTY);
  const [id, setId] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  function flash(text: string, ok: boolean) {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3500);
  }

  function startAdd() {
    setEditing(null);
    setId("");
    setForm(EMPTY);
  }

  function startEdit(p: Project) {
    setEditing(p);
    setId(p.id);
    const { id: _, ...rest } = p;
    setForm(rest);
  }

  function cancel() {
    setEditing(null);
    setId("");
    setForm(EMPTY);
  }

  function updateField<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    if (!id.trim()) return flash("ID is required", false);
    setSaving(true);

    const project: Project = { id: id.trim(), ...form };
    // Clean optional empty strings
    if (!project.github) delete project.github;
    if (!project.live) delete project.live;
    if (!project.video) delete project.video;

    const updated = editing
      ? projects.map((p) => (p.id === editing.id ? project : p))
      : [...projects, project];

    const res = await fetch("/api/admin/content/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    setSaving(false);
    if (res.ok) {
      setProjects(updated);
      cancel();
      flash(editing ? "Project updated." : "Project added.", true);
    } else {
      const data = await res.json().catch(() => ({}));
      flash(data.error ?? "Save failed.", false);
    }
  }

  async function remove(project: Project) {
    if (!confirm(`Delete "${project.name}"?`)) return;
    setDeleting(project.id);
    const updated = projects.filter((p) => p.id !== project.id);
    const res = await fetch("/api/admin/content/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setDeleting(null);
    if (res.ok) {
      setProjects(updated);
      flash("Project deleted.", true);
    } else {
      flash("Delete failed.", false);
    }
  }

  const isOpen = editing !== null || id !== "" || form.name !== "";

  return (
    <div className="max-w-4xl space-y-6">
      {/* Message */}
      {msg && (
        <div className={`rounded-[var(--brut-radius)] border-2 border-[var(--ink)] px-4 py-2.5 text-sm font-medium text-[var(--ink)] ${msg.ok ? "bg-[var(--mint)]" : "bg-[var(--blush)]"}`}>
          {msg.text}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="brut-title text-3xl">Projects</h1>
        {!isOpen && (
          <button onClick={startAdd} className="brut-btn">+ Add Project</button>
        )}
      </div>

      {/* Form */}
      {isOpen && (
        <div className="brut-card p-5 space-y-4">
          <h2 className="brut-h text-base">{editing ? "Edit Project" : "New Project"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="ID (slug, no spaces)">
              <input className={INPUT} value={id} onChange={(e) => setId(e.target.value.toLowerCase().replace(/\s+/g, "-"))} placeholder="my-project" disabled={!!editing} />
            </Field>
            <Field label="Name">
              <input className={INPUT} value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="My Project" />
            </Field>
            <Field label="Tag line">
              <input className={INPUT} value={form.tag} onChange={(e) => updateField("tag", e.target.value)} placeholder="React · Full-stack" />
            </Field>
            <Field label="Year">
              <input type="number" className={INPUT} value={form.year} onChange={(e) => updateField("year", parseInt(e.target.value))} />
            </Field>
            <Field label="Status">
              <select className={INPUT} value={form.status} onChange={(e) => updateField("status", e.target.value as Project["status"])}>
                <option value="Completed">Completed</option>
                <option value="In progress">In progress</option>
              </select>
            </Field>
            <Field label="Image path or URL">
              <input className={INPUT} value={form.image} onChange={(e) => updateField("image", e.target.value)} placeholder="/image.png or https://..." />
            </Field>
            <Field label="GitHub URL (optional)">
              <input className={INPUT} value={form.github ?? ""} onChange={(e) => updateField("github", e.target.value)} placeholder="https://github.com/..." />
            </Field>
            <Field label="Live URL (optional)">
              <input className={INPUT} value={form.live ?? ""} onChange={(e) => updateField("live", e.target.value)} placeholder="https://..." />
            </Field>
            <Field label="Video URL (optional)">
              <input className={INPUT} value={form.video ?? ""} onChange={(e) => updateField("video", e.target.value)} placeholder="https://youtu.be/..." />
            </Field>
            <Field label="Tech stack (comma-separated)">
              <input className={INPUT} value={form.tech.join(", ")} onChange={(e) => updateField("tech", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="React, Node.js, TypeScript" />
            </Field>
          </div>
          <Field label="Description">
            <textarea className={TEXTAREA} rows={3} value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="What it does and why it matters." />
          </Field>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="brut-btn">
              {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={cancel} className="brut-btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-2.5">
        {projects.map((p) => (
          <div key={p.id} className="brut-card flex items-center justify-between gap-4 px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-[var(--ink)] truncate">{p.name}</p>
              <p className="brut-mono text-xs text-[var(--ink-3)] truncate">{p.tag} · {p.year} · {p.status}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => startEdit(p)} className={BTN_SM}>Edit</button>
              <button onClick={() => remove(p)} disabled={deleting === p.id} className={BTN_DEL}>
                {deleting === p.id ? "…" : "Delete"}
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="brut-mono text-sm text-[var(--ink-3)] py-4">No projects yet. Add one above.</p>
        )}
      </div>
    </div>
  );
}
