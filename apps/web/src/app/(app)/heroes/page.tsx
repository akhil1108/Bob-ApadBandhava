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

    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">🌟 LIFEBridge Heroes</h1>

        {/* Points banner */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 mb-6">
          <p className="text-sm text-yellow-700 font-medium mb-1">Total Recognition Points</p>
          <p className="text-4xl font-bold text-yellow-600">{volunteer?.points ?? 0}</p>
          <p className="text-xs text-yellow-600 mt-1">
            Points are awarded after admin verification of your contributions.
          </p>
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-2">First-Aid Certification</h2>
          {volunteer?.certified ? (
            <span className="text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full font-medium">
              ✓ Certified
            </span>
          ) : (
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Not yet certified
            </span>
          )}
        </div>

        {/* Contribution history */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Contribution History</h2>
          {volunteer?.heroActions.length === 0 ? (
            <p className="text-sm text-gray-400">No recorded contributions yet.</p>
          ) : (
            <div className="space-y-3">
              {volunteer?.heroActions.map(a => (
                <div key={a.id} className="border border-gray-100 rounded-xl px-4 py-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 truncate">{a.incident.description}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(a.createdAt).toLocaleDateString("en-IN")}
                      </p>
                      {a.description && (
                        <p className="text-gray-600 mt-1">{a.description}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        a.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {a.verified ? "Verified" : "Pending verification"}
                      </span>
                      {a.verified && a.pointsAwarded > 0 && (
                        <span className="text-xs text-yellow-600 font-semibold">
                          +{a.pointsAwarded} pts
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">🌟 Heroes Admin Panel</h1>
        <p className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg mb-4 inline-block">
          ⚠️ Demo only — verify contributions and award points
        </p>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Pending Verifications</h2>
          {pendingActions.length === 0 ? (
            <p className="text-sm text-gray-400">No pending verifications.</p>
          ) : (
            <div className="space-y-3">
              {pendingActions.map(a => (
                <div key={a.id} className="border border-gray-100 rounded-xl px-4 py-3 text-sm flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-800">{a.volunteer.user.name}</p>
                    <p className="text-xs text-gray-500">{a.incident.description}</p>
                    {a.description && <p className="text-gray-600 mt-1">{a.description}</p>}
                  </div>
                  <form action={`/api/heroes/actions/${a.id}/verify`} method="POST">
                    <button
                      type="submit"
                      className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
                    >
                      Verify &amp; Award 10 pts
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">🌟 LIFEBridge Heroes</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 text-sm text-gray-500">
        The Heroes module is for registered volunteers and administrators.
      </div>
    </div>
  );
}
