import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const statusBadge: Record<string, string> = {
  REPORTED: "badge-reported", ACKNOWLEDGED: "badge-ack", DISPATCHED: "badge-dispatch",
  ARRIVED: "badge-arrived", COMPLETED: "badge-done", CANCELLED: "badge-cancel",
};

export default async function RescuePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role ?? "";
  const userId = (session.user as { id?: string }).id ?? "";

  const incidents = await prisma.incident.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
    include: { reporter: { select: { name: true } }, responses: true },
  });

  const visible = role === "PATIENT"
    ? incidents.filter(i => i.reporterId === userId)
    : incidents;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="t-title mb-0.5" style={{ color: "var(--text-primary)" }}>Rescue</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {role === "PATIENT" ? "Your incident reports" : "Operations dashboard"}
          </p>
        </div>
        <Link href="/rescue/report" className="btn btn-primary shrink-0">
          Report incident
        </Link>
      </div>

      {/* 112 banner */}
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3 mb-6 text-sm"
        style={{ background: "var(--red-600)", color: "#fff" }}
        role="alert"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
          <path d="M8 1L1 14h14L8 1Z" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/>
          <path d="M8 6v3.5M8 11.5v.5" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        <span>
          <strong>Emergency?</strong> Call <strong>112</strong> first — do not wait for LIFEBridge.
        </span>
      </div>

      {/* Demo notice */}
      <div
        className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-5 text-xs font-medium"
        style={{ background: "#fef3c7", color: "#92400e" }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M6 1L1 10.5h10L6 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        </svg>
        Simulated demo — not real dispatches or real hospital capacity
      </div>

      {/* Incident list */}
      <div className="surface-raised overflow-hidden">
        {visible.length === 0 ? (
          <div className="empty-state">
            No incidents yet.{" "}
            <Link href="/rescue/report" style={{ color: "var(--red-600)" }}>
              Report the first one.
            </Link>
          </div>
        ) : (
          <div>
            {/* Table header — desktop */}
            <div
              className="hidden sm:grid grid-cols-[1fr_140px_120px_100px] gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider"
              style={{ background: "var(--surface-2)", color: "var(--text-muted)", borderBottom: "1px solid var(--border-soft)" }}
            >
              <span>Incident</span>
              <span>Reported by</span>
              <span>Time</span>
              <span>Status</span>
            </div>

            {visible.map((i, idx) => {
              const ai = i.aiExtracted as Record<string, string> | null;
              return (
                <div
                  key={i.id}
                  className="px-5 py-4"
                  style={{ borderBottom: idx < visible.length - 1 ? "1px solid var(--border-soft)" : "none" }}
                >
                  <div className="sm:grid sm:grid-cols-[1fr_140px_120px_100px] sm:gap-4 sm:items-start">
                    {/* Description + AI chips */}
                    <div className="min-w-0 mb-2 sm:mb-0">
                      <p className="text-sm font-medium mb-1.5 leading-snug" style={{ color: "var(--text-primary)" }}>
                        {i.description}
                      </p>
                      {ai && (
                        <div className="flex flex-wrap gap-1.5">
                          {ai.incident_type && (
                            <span className="badge badge-done">{ai.incident_type.replace(/_/g, " ")}</span>
                          )}
                          {ai.severity_indicator && ai.severity_indicator !== "unknown" && (
                            <span className={`badge ${ai.severity_indicator === "high" ? "badge-cancel" : ai.severity_indicator === "medium" ? "badge-reported" : "badge-done"}`}>
                              {ai.severity_indicator} severity
                            </span>
                          )}
                          {ai.location_hint && ai.location_hint !== "unknown" && (
                            <span className="badge badge-ack">{ai.location_hint}</span>
                          )}
                          {ai.unconscious_reported === "true" && (
                            <span className="badge badge-cancel">unconscious reported</span>
                          )}
                          <span className="badge" style={{ background: "#e0f2fe", color: "#0369a1" }}>
                            IBM AI · assistive only
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Reporter */}
                    <p className="text-sm mb-1 sm:mb-0" style={{ color: "var(--text-secondary)" }}>
                      {i.reporter.name}
                    </p>

                    {/* Time */}
                    <p className="text-xs mb-1 sm:mb-0" style={{ color: "var(--text-muted)" }}>
                      {new Date(i.createdAt).toLocaleString("en-IN", {
                        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>

                    {/* Status + action */}
                    <div className="flex flex-col gap-2 items-start">
                      <span className={`badge ${statusBadge[i.status] ?? "badge-done"}`}>{i.status}</span>
                      {["HOSPITAL", "AMBULANCE", "ADMIN"].includes(role) && i.status === "REPORTED" && (
                        <form action={`/api/rescue/incidents/${i.id}/acknowledge`} method="POST">
                          <button type="submit" className="btn btn-ghost btn-sm" style={{ fontSize: "0.75rem", height: "26px" }}>
                            Acknowledge
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
