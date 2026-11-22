import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PatientProfileEditor } from "@/components/PatientProfileEditor";
import { ConsentActions } from "@/components/ConsentActions";
import { AddConsultationForm } from "@/components/AddConsultationForm";

export default async function HealthPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const role   = (session.user as { role?: string }).role ?? "";
  const userId = (session.user as { id?: string }).id ?? "";

  // ── PATIENT view ──────────────────────────────────────────────────────────
  if (role === "PATIENT") {
    const profile = await prisma.patientProfile.findUnique({
      where: { userId },
      include: {
        consultations: {
          include: { doctor: { include: { user: true } }, documents: true },
          orderBy: { consultedAt: "desc" },
        },
        consents: { orderBy: { createdAt: "desc" } },
      },
    });

    return (
      <div>
        <h1 className="t-title mb-6" style={{ color: "var(--text-primary)" }}>Health</h1>

        {/* Profile stats + edit */}
        <section className="surface-raised overflow-hidden mb-6">
          <div
            className="px-5 py-3 flex items-center justify-between gap-4"
            style={{ borderBottom: "1px solid var(--border-soft)", background: "var(--surface-2)" }}
          >
            <h2 className="t-heading" style={{ color: "var(--text-primary)" }}>My Profile</h2>
            <PatientProfileEditor initialData={profile} />
          </div>
          <div
            className="grid sm:grid-cols-3 gap-px"
            style={{ background: "var(--border-soft)" }}
          >
            {[
              { label: "Blood Group",   value: profile?.bloodGroup ?? "—" },
              { label: "Allergies",     value: profile?.allergies  ?? "None on record" },
              { label: "Date of Birth", value: profile?.dob ? new Date(profile.dob).toLocaleDateString("en-IN") : "—" },
            ].map(s => (
              <div key={s.label} className="px-5 py-4" style={{ background: "var(--surface-0)" }}>
                <p className="t-caption mb-1">{s.label}</p>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{s.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Consultation timeline */}
        <section className="surface-raised overflow-hidden mb-6">
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ borderBottom: "1px solid var(--border-soft)", background: "var(--surface-2)" }}
          >
            <h2 className="t-heading" style={{ color: "var(--text-primary)" }}>Consultation Timeline</h2>
            <span className="t-caption">{profile?.consultations.length ?? 0} records</span>
          </div>
          {!profile?.consultations.length ? (
            <div className="empty-state">No consultations yet.</div>
          ) : (
            <ol>
              {profile.consultations.map((c, idx) => (
                <li
                  key={c.id}
                  className="px-5 py-4"
                  style={{ borderBottom: idx < profile.consultations.length - 1 ? "1px solid var(--border-soft)" : "none" }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center pt-1 shrink-0">
                      <div className="w-2 h-2 rounded-full" style={{ background: "var(--red-500)" }} />
                      {idx < profile.consultations.length - 1 && (
                        <div className="w-px flex-1 mt-1" style={{ background: "var(--border-soft)", minHeight: 24 }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          Dr. {c.doctor.user.name}
                          {c.doctor.specialisation && (
                            <span className="font-normal" style={{ color: "var(--text-secondary)" }}> · {c.doctor.specialisation}</span>
                          )}
                        </p>
                        <span className="t-caption">
                          {new Date(c.consultedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      {c.notes && <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{c.notes}</p>}
                      {c.prescription && (
                        <p className="text-sm mt-1 font-mono text-xs px-2 py-1 rounded inline-block" style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}>
                          Rx: {c.prescription}
                        </p>
                      )}
                      {c.aiSummary && (
                        <div className="mt-2 rounded-lg px-3 py-2 text-xs"
                          style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }}>
                          <strong>AI Summary</strong> (assistive only — verify against source records): {c.aiSummary}
                        </div>
                      )}
                      {c.documents.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {c.documents.map(d => (
                            <a key={d.id} href={d.fileUrl} target="_blank" rel="noopener noreferrer"
                              className="btn btn-ghost btn-sm" style={{ gap: 4 }}>
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                <path d="M2 1h5.5L10 3.5V11H2V1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                                <path d="M7 1v3h3" stroke="currentColor" strokeWidth="1.2"/>
                              </svg>
                              {d.fileName}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

        {/* Consent management */}
        <section className="surface-raised overflow-hidden">
          <div className="px-5 py-3" style={{ borderBottom: "1px solid var(--border-soft)", background: "var(--surface-2)" }}>
            <h2 className="t-heading" style={{ color: "var(--text-primary)" }}>Record Access Requests</h2>
            <p className="t-caption mt-0.5">Review and approve or decline access to your health records</p>
          </div>
          {!profile?.consents.length ? (
            <div className="empty-state">No access requests.</div>
          ) : (
            profile.consents.map((c, idx) => (
              <div
                key={c.id}
                className="px-5 py-3 flex items-center justify-between gap-4 flex-wrap"
                style={{ borderBottom: idx < profile.consents.length - 1 ? "1px solid var(--border-soft)" : "none" }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{c.purpose}</p>
                  <p className="t-caption">{new Date(c.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
                <ConsentActions consentId={c.id} currentStatus={c.status} />
              </div>
            ))
          )}
        </section>
      </div>
    );
  }

  // ── DOCTOR view ───────────────────────────────────────────────────────────
  if (role === "DOCTOR") {
    const doctor = await prisma.doctorProfile.findUnique({
      where: { userId },
      include: {
        consultations: {
          include: { patient: { include: { user: true } }, documents: true },
          orderBy: { consultedAt: "desc" },
          take: 20,
        },
      },
    });

    // Patients who have granted APPROVED consent to this doctor
    const approvedConsents = await prisma.consent.findMany({
      where: { requestedBy: userId, status: "APPROVED" },
      include: { patient: { include: { user: true } } },
    });

    const patientsWithConsent = approvedConsents.map(c => ({
      id:   c.patient.id,
      user: c.patient.user,
    }));

    return (
      <div>
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <h1 className="t-title" style={{ color: "var(--text-primary)" }}>Health · Doctor view</h1>
          <AddConsultationForm patients={patientsWithConsent} />
        </div>

        <div className="surface-raised overflow-hidden">
          <div className="px-5 py-3" style={{ borderBottom: "1px solid var(--border-soft)", background: "var(--surface-2)" }}>
            <h2 className="t-heading" style={{ color: "var(--text-primary)" }}>Recent Consultations</h2>
          </div>
          {!doctor?.consultations.length ? (
            <div className="empty-state">No consultations yet. Use the button above to add one once a patient has granted consent.</div>
          ) : (
            doctor.consultations.map((c, idx) => (
              <div
                key={c.id}
                className="px-5 py-4"
                style={{ borderBottom: idx < doctor.consultations.length - 1 ? "1px solid var(--border-soft)" : "none" }}
              >
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{c.patient.user.name}</p>
                <p className="t-caption">{new Date(c.consultedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                {c.notes && <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{c.notes}</p>}
                {c.prescription && (
                  <p className="text-xs mt-1 font-mono px-2 py-1 rounded inline-block"
                    style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}>
                    Rx: {c.prescription}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // ── Fallback ──────────────────────────────────────────────────────────────
  return (
    <div>
      <h1 className="t-title mb-4" style={{ color: "var(--text-primary)" }}>Health</h1>
      <div className="surface p-6 text-sm" style={{ color: "var(--text-muted)" }}>
        Health records are accessible to patients and doctors.
      </div>
    </div>
  );
}
