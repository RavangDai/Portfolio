"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push(next);
      router.refresh();
    } else if (res.status === 429) {
      setError(data.error ?? "Too many attempts. Try again in 15 minutes.");
    } else {
      setError(data.error ?? "Invalid credentials.");
      if (typeof data.remaining === "number") setRemaining(data.remaining);
    }
    setLoading(false);
  }

  return (
    <div className="theme-brut brut-bg flex min-h-screen items-center justify-center px-4">
      <div className="brut-card w-full max-w-sm p-7">
        <div className="mb-8 text-center">
          <p className="brut-kicker mb-2">BIBEK.TECH</p>
          <h1 className="brut-title text-2xl">Admin Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="brut-kicker">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="brut-input"
              placeholder="admin@example.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="brut-kicker">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="brut-input"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded-[var(--brut-radius)] border-2 border-[var(--ink)] bg-[var(--blush)] px-3 py-2.5 text-sm font-medium text-[var(--ink)]">
              {error}
              {remaining !== null && remaining > 0 && (
                <span className="ml-1 opacity-70">({remaining} attempt{remaining !== 1 ? "s" : ""} left)</span>
              )}
            </div>
          )}

          <button type="submit" disabled={loading} className="brut-btn w-full">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
