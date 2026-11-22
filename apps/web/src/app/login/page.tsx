"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const registered = params.get("registered");

  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email:    form.email,
      password: form.password,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="w-full max-w-sm">
      <Link href="/" className="inline-block mb-8 font-bold text-base tracking-tight">
        <span style={{ color: "var(--red-600)" }}>LIFE</span>
        <span style={{ color: "var(--text-primary)" }}>BRIDGE</span>
      </Link>

      <h1 className="t-title mb-1" style={{ color: "var(--text-primary)" }}>Sign in</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        Enter your credentials to continue
      </p>

      {registered && (
        <div
          className="text-sm px-3 py-2.5 rounded-lg mb-5 flex items-center gap-2"
          style={{ background: "var(--status-arrived)", color: "var(--status-arrived-fg)", border: "1px solid #bbf7d0" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Account created — sign in to continue
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div
            className="text-sm px-3 py-2.5 rounded-lg"
            style={{ background: "var(--red-50)", color: "var(--red-700)", border: "1px solid var(--red-100)" }}
            role="alert"
          >
            {error}
          </div>
        )}

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

        <div>
          <label className="field-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            className="field-input"
            placeholder="••••••••"
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full mt-2">
          {loading
            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</>
            : "Sign in"
          }
        </button>
      </form>

      <p className="text-sm mt-6 text-center" style={{ color: "var(--text-muted)" }}>
        No account?{" "}
        <Link href="/register" className="font-medium" style={{ color: "var(--red-600)" }}>
          Register here
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2" style={{ background: "var(--surface-1)" }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between p-12" style={{ background: "var(--red-600)" }}>
        <span className="text-white font-bold text-lg tracking-tight">
          LIFE<span className="opacity-80">BRIDGE</span>
        </span>
        <blockquote className="text-white">
          <p className="text-2xl font-semibold leading-snug mb-4">
            &ldquo;Every second matters.<br />Every life connects us.&rdquo;
          </p>
          <footer className="text-sm opacity-70">
            Emergency coordination · Health records · Community heroes
          </footer>
        </blockquote>
        <p className="text-xs text-white/50">Hackathon prototype · Not an emergency service</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-col items-center justify-center px-6 py-16">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
