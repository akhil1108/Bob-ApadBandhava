"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ROLES = [
  { value: "PATIENT",   label: "Patient",            desc: "Manage my health records" },
  { value: "DOCTOR",    label: "Doctor",              desc: "View consented patient records" },
  { value: "HOSPITAL",  label: "Hospital Staff",      desc: "Acknowledge emergency requests" },
  { value: "AMBULANCE", label: "Ambulance Operator",  desc: "Receive and confirm dispatches" },
  { value: "VOLUNTEER", label: "Community Volunteer", desc: "Log and track contributions" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.role) { setError("Select a role to continue."); return; }
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Registration failed.");
    } else {
      router.push("/login?registered=1");
    }
  }

  return (
    <div
      className="min-h-screen flex items-start justify-center px-4 py-12"
      style={{ background: "var(--surface-1)" }}
    >
      <div className="w-full max-w-lg">
        <Link
          href="/"
          className="inline-block mb-8 font-bold text-base tracking-tight"
        >
          <span style={{ color: "var(--red-600)" }}>LIFE</span>
          <span style={{ color: "var(--text-primary)" }}>BRIDGE</span>
        </Link>

        <h1 className="t-title mb-1" style={{ color: "var(--text-primary)" }}>Create your account</h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          Choose your role — it determines what you can see and do.
        </p>

        <form onSubmit={handleSubmit} className="surface-raised p-7 space-y-5">
          {error && (
            <div
              className="text-sm px-3 py-2.5 rounded-lg"
              style={{ background: "var(--red-50)", color: "var(--red-700)", border: "1px solid var(--red-100)" }}
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Name + email side by side */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="field-label" htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="field-input"
                placeholder="Akhilesh Math"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="field-input"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="field-input"
              placeholder="At least 8 characters"
            />
          </div>

          {/* Role selector */}
          <div>
            <label className="field-label mb-2 block">I am a&hellip;</label>
            <div className="grid sm:grid-cols-2 gap-2">
              {ROLES.map(r => {
                const selected = form.role === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, role: r.value }))}
                    className="text-left p-3 rounded-lg border transition-all"
                    style={{
                      background: selected ? "var(--red-50)" : "var(--surface-0)",
                      borderColor: selected ? "var(--red-500)" : "var(--border-mid)",
                      boxShadow: selected ? "0 0 0 1px var(--red-500)" : "none",
                    }}
                    aria-pressed={selected}
                  >
                    <p className="text-sm font-semibold" style={{ color: selected ? "var(--red-700)" : "var(--text-primary)" }}>
                      {r.label}
                    </p>
                    <p className="t-caption mt-0.5">{r.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg w-full"
          >
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account…</>
              : "Create account"
            }
          </button>
        </form>

        <p className="text-sm mt-5 text-center" style={{ color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link href="/login" className="font-medium" style={{ color: "var(--red-600)" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
