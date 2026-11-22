import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

const MODULE_CONFIG = {
  PATIENT:   [{ href: "/health",  title: "Health",  desc: "Records, consultations & consent" }, { href: "/rescue", title: "Rescue", desc: "Report incidents, track responses" }],
  DOCTOR:    [{ href: "/health",  title: "Health",  desc: "Patient consultations & records" }],
  HOSPITAL:  [{ href: "/rescue",  title: "Rescue",  desc: "Emergency requests & ops dashboard" }],
  AMBULANCE: [{ href: "/rescue",  title: "Rescue",  desc: "Dispatch requests & incident board" }],
  VOLUNTEER: [{ href: "/heroes",  title: "Heroes",  desc: "Contributions & recognition points" }, { href: "/rescue", title: "Rescue", desc: "Report & track incidents" }],
  ADMIN:     [{ href: "/health",  title: "Health",  desc: "Records & consent oversight" }, { href: "/rescue", title: "Rescue", desc: "Full ops dashboard" }, { href: "/heroes", title: "Heroes", desc: "Verify contributions & award points" }],
} as Record<string, { href: string; title: string; desc: string }[]>;

const ROLE_COLOR: Record<string, string> = {
  PATIENT: "badge-ack", DOCTOR: "badge-arrived", HOSPITAL: "badge-dispatch",
  AMBULANCE: "badge-reported", VOLUNTEER: "badge-pending", ADMIN: "badge-cancel",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role ?? "";
  const cards = MODULE_CONFIG[role] ?? [];
  const firstName = session.user?.name?.split(" ")[0];

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="t-title" style={{ color: "var(--text-primary)" }}>
            Good day, {firstName}
          </h1>
          <span className={`badge ${ROLE_COLOR[role] ?? "badge-done"}`}>{role}</span>
        </div>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Here&rsquo;s what&rsquo;s available for your role
        </p>
      </div>

      {/* Module cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {cards.map(c => (
          <Link
            key={c.href}
            href={c.href}
            className="surface-raised p-5 group hover:border-[var(--red-500)] transition-colors"
            style={{ display: "block" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2
                className="t-heading transition-colors"
                style={{ color: "var(--text-primary)" }}
              >
                {c.title}
              </h2>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
                style={{ color: "var(--text-muted)" }}>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{c.desc}</p>
          </Link>
        ))}
      </div>

      {/* Emergency reminder */}
      <div
        className="rounded-xl px-4 py-3 text-sm flex items-center gap-3"
        style={{ background: "var(--red-50)", border: "1px solid var(--red-100)", color: "var(--red-700)" }}
        role="note"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M8 5v3M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span>
          In an emergency in India, call{" "}
          <strong>112</strong> immediately — do not wait for LIFEBridge.
        </span>
      </div>
    </div>
  );
}
