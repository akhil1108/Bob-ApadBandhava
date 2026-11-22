import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function HealthPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role ?? "";
  const userId = (session.user as { id?: string }).id ?? "";

  let content = null;

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

    content = (
      <div className="space-y-6">
        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-3">My Health Profile</h2>
          <dl className="grid sm:grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Blood Group</dt>
              <dd className="font-medium">{profile?.bloodGroup ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Allergies</dt>
              <dd className="font-medium">{profile?.allergies ?? "None recorded"}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Date of Birth</dt>
              <dd className="font-medium">
                {profile?.dob ? new Date(profile.dob).toLocaleDateString("en-IN") : "—"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Consultation timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Consultation Timeline</h2>
          {profile?.consultations.length === 0 ? (
            <p className="text-sm text-gray-400">No consultations yet.</p>
          ) : (
            <div className="space-y-4">
              {profile?.consultations.map(c => (
                <div key={c.id} className="border-l-2 border-red-100 pl-4">
                  <p className="text-xs text-gray-400">
                    {new Date(c.consultedAt).toLocaleDateString("en-IN")}
                  </p>
                  <p className="font-medium text-sm text-gray-800">
                    Dr. {c.doctor.user.name}
                    {c.doctor.specialisation && ` · ${c.doctor.specialisation}`}
                  </p>
                  {c.notes && <p className="text-sm text-gray-600 mt-1">{c.notes}</p>}
                  {c.aiSummary && (
                    <div className="mt-2 bg-blue-50 text-blue-800 text-xs px-3 py-2 rounded-lg">
                      <strong>AI Summary (assistive only):</strong> {c.aiSummary}
                    </div>
                  )}
                  {c.documents.length > 0 && (
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {c.documents.map(d => (
                        <a
                          key={d.id}
                          href={d.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                        >
                          📄 {d.fileName}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Consents */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Record Access Requests</h2>
          {profile?.consents.length === 0 ? (
            <p className="text-sm text-gray-400">No access requests.</p>
          ) : (
            <div className="space-y-3">
              {profile?.consents.map(c => (
                <div key={c.id} className="flex items-center justify-between text-sm border border-gray-100 rounded-xl px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-800">{c.purpose}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    c.status === "APPROVED" ? "bg-green-100 text-green-700" :
                    c.status === "REVOKED"  ? "bg-red-100 text-red-700" :
                                              "bg-yellow-100 text-yellow-700"
                  }`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } else if (role === "DOCTOR") {
    const doctor = await prisma.doctorProfile.findUnique({
      where: { userId },
      include: {
        consultations: {
          include: { patient: { include: { user: true } } },
          orderBy: { consultedAt: "desc" },
          take: 20,
        },
      },
    });

    content = (
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Recent Consultations</h2>
        {doctor?.consultations.length === 0 ? (
          <p className="text-sm text-gray-400">No consultations yet.</p>
        ) : (
          <div className="space-y-3">
            {doctor?.consultations.map(c => (
              <div key={c.id} className="border border-gray-100 rounded-xl px-4 py-3 text-sm">
                <p className="font-medium text-gray-800">{c.patient.user.name}</p>
                <p className="text-xs text-gray-400">
                  {new Date(c.consultedAt).toLocaleDateString("en-IN")}
                </p>
                {c.notes && <p className="text-gray-600 mt-1">{c.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } else {
    content = (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 text-sm text-gray-500">
        Health records are accessible to patients and doctors.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">🏥 LIFEBridge Health</h1>
      {content}
    </div>
  );
}
