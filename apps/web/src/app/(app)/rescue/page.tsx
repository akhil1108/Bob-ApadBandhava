import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function RescuePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role ?? "";
  const userId = (session.user as { id?: string }).id ?? "";

  // For the ops dashboard (hospital/ambulance/admin) fetch recent incidents
  const incidents = await prisma.incident.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      reporter: { select: { name: true } },
      responses: true,
    },
  });

  const statusColors: Record<string, string> = {
    REPORTED:     "bg-yellow-100 text-yellow-700",
    ACKNOWLEDGED: "bg-blue-100 text-blue-700",
    DISPATCHED:   "bg-purple-100 text-purple-700",
    ARRIVED:      "bg-green-100 text-green-700",
    COMPLETED:    "bg-gray-100 text-gray-600",
    CANCELLED:    "bg-red-100 text-red-700",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">🚨 LIFEBridge Rescue</h1>
        <Link
          href="/rescue/report"
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          + Report Incident
        </Link>
      </div>

      {/* Emergency banner */}
      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 mb-6">
        🆘 In an emergency call <strong>112</strong> immediately. Do not wait for LIFEBridge.
      </div>

      {/* Ops dashboard */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">
          {role === "PATIENT" ? "My Reported Incidents" : "Incident Operations Dashboard"}
        </h2>
        <p className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg mb-4 inline-block">
          ⚠️ Simulated demo data — not real dispatches or real hospital capacity
        </p>

        {incidents.length === 0 ? (
          <p className="text-sm text-gray-400">No incidents reported yet.</p>
        ) : (
          <div className="space-y-3">
            {incidents
              .filter(i => role === "PATIENT" ? i.reporterId === userId : true)
              .map(i => {
                const ai = i.aiExtracted as Record<string, string> | null;
                return (
                  <div key={i.id} className="border border-gray-100 rounded-xl px-4 py-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{i.description}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Reported by {i.reporter.name} ·{" "}
                          {new Date(i.createdAt).toLocaleString("en-IN")}
                        </p>
                        {ai && (
                          <div className="mt-2 flex gap-2 flex-wrap">
                            {ai.incident_type && (
                              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{ai.incident_type}</span>
                            )}
                            {ai.severity_indicator && (
                              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                                Severity: {ai.severity_indicator}
                              </span>
                            )}
                            {ai.location_hint && (
                              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                                📍 {ai.location_hint}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${statusColors[i.status]}`}>
                        {i.status}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      {(role === "HOSPITAL" || role === "AMBULANCE" || role === "ADMIN") &&
                        i.status === "REPORTED" && (
                          <form action={`/api/rescue/incidents/${i.id}/acknowledge`} method="POST">
                            <button
                              type="submit"
                              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
                            >
                              Acknowledge (simulated)
                            </button>
                          </form>
                        )}
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
