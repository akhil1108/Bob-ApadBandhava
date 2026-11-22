import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function HeroesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role ?? "";
  const userId = (session.user as { id?: string }).id ?? "";

  if (role === "VOLUNTEER") {
    const volunteer = await prisma.volunteerProfile.findUnique({
      where: { userId },
      include: {
        heroActions: {
          include: { incident: { select: { description: true, createdAt: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const verified   = volunteer?.heroActions.filter(a => a.verified).length ?? 0;
    const pending    = volunteer?.heroActions.filter(a => !a.verified).length ?? 0;
    const totalPts   = volunteer?.points ?? 0;

    return (
      <div>
        <h1 className="t-title mb-6" style={{ color: "var(--text-primary)" }}>Heroes</h1>

        {/* Stats strip */}
        <div
          className="grid sm:grid-cols-3 gap-px mb-6 overflow-hidden rounded-xl"
          style={{ border: "1px solid var(--border-soft)", background: "var(--border-soft)" }}
        >
          <div className="px-5 py-5" style={{ background: "var(--surface-0)" }}>
            <p className="t-caption mb-1">Recognition Points</p>
            <p className="text-3xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              {totalPts}
            </p>
          </div>
          <div className="px-5 py-5" style={{ background: "var(--surface-0)" }}>
            <p className="t-caption mb-1">Verified contributions</p>
            <p className="text-3xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              {verified}
            </p>
          </div>
          <div className="px-5 py-5" style={{ background: "var(--surface-0)" }}>
            <p className="t-caption mb-1">Pending verification</p>
            <p className="text-3xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              {pending}
            </p>
          </div>
        </div>

        {/* Certification */}
        <div className="surface p-5 mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>First-Aid Certification</p>
            <p className="t-caption">Required for certain verified contributions</p>
          </div>
          <span className={`badge ${volunteer?.certified ? "badge-verified" : "badge-done"}`}>
            {volunteer?.certified ? "Certified" : "Not certified"}
          </span>
        </div>

        {/* Contribution history */}
        <div className="surface-raised overflow-hidden">
          <div
            className="px-5 py-3"
            style={{ borderBottom: "1px solid var(--border-soft)", background: "var(--surface-2)" }}
          >
            <h2 className="t-heading" style={{ color: "var(--text-primary)" }}>Contribution History</h2>
          </div>
          {!volunteer?.heroActions.length ? (
            <div className="empty-state">No recorded contributions yet.</div>
          ) : (
            volunteer.heroActions.map((a, idx) => (
              <div
                key={a.id}
                className="px-5 py-4 flex items-start justify-between gap-4"
                style={{ borderBottom: idx < volunteer.heroActions.length - 1 ? "1px solid var(--border-soft)" : "none" }}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug mb-0.5" style={{ color: "var(--text-primary)" }}>
                    {a.incident.description}
                  </p>
                  <p className="t-caption">{new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  {a.description && (
                    <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{a.description}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={`badge ${a.verified ? "badge-verified" : "badge-pending"}`}>
                    {a.verified ? "Verified" : "Pending"}
                  </span>
                  {a.verified && a.pointsAwarded > 0 && (
                    <span className="text-xs font-semibold" style={{ color: "#92400e" }}>
                      +{a.pointsAwarded} pts
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <p className="mt-5 t-caption px-1">
          Points are awarded only after admin verification. Never act beyond your first-aid training level.
        </p>
      </div>
    );
  }

  if (role === "ADMIN") {
    const pendingActions = await prisma.heroAction.findMany({
      where: { verified: false },
      include: {
        volunteer: { include: { user: { select: { name: true } } } },
        incident: { select: { description: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <h1 className="t-title" style={{ color: "var(--text-primary)" }}>Heroes Admin</h1>
          <span
            className="badge"
            style={{ background: "#fef3c7", color: "#92400e" }}
          >
            {pendingActions.length} pending
          </span>
        </div>

        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-5 text-xs font-medium"
          style={{ background: "#fef3c7", color: "#92400e" }}
        >
          Demo only — verify contributions and award points
        </div>

        <div className="surface-raised overflow-hidden">
          <div
            className="px-5 py-3"
            style={{ borderBottom: "1px solid var(--border-soft)", background: "var(--surface-2)" }}
          >
            <h2 className="t-heading" style={{ color: "var(--text-primary)" }}>Pending Verifications</h2>
          </div>
          {!pendingActions.length ? (
            <div className="empty-state">No pending verifications.</div>
          ) : (
            pendingActions.map((a, idx) => (
              <div
                key={a.id}
                className="px-5 py-4 flex items-start justify-between gap-4"
                style={{ borderBottom: idx < pendingActions.length - 1 ? "1px solid var(--border-soft)" : "none" }}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>
                    {a.volunteer.user.name}
                  </p>
                  <p className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>{a.incident.description}</p>
                  {a.description && (
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>{a.description}</p>
                  )}
                </div>
                <form action={`/api/heroes/actions/${a.id}/verify`} method="POST" className="shrink-0">
                  <button type="submit" className="btn btn-ghost btn-sm" style={{ color: "#166534", borderColor: "#bbf7d0" }}>
                    Verify &amp; +10 pts
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="t-title mb-4" style={{ color: "var(--text-primary)" }}>Heroes</h1>
      <div className="surface p-6 text-sm" style={{ color: "var(--text-muted)" }}>
        The Heroes module is for registered volunteers and administrators.
      </div>
    </div>
  );
}
