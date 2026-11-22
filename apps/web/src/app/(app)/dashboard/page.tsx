import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role ?? "";

  const cards = [
    {
      href: "/health",
      emoji: "🏥",
      title: "Health",
      desc: "View records, consultations, and consents.",
      roles: ["PATIENT", "DOCTOR", "ADMIN"],
    },
    {
      href: "/rescue",
      emoji: "🚨",
      title: "Rescue",
      desc: "Report incidents and monitor live responses.",
      roles: ["PATIENT", "HOSPITAL", "AMBULANCE", "ADMIN"],
    },
    {
      href: "/heroes",
      emoji: "🌟",
      title: "Heroes",
      desc: "Track volunteer contributions and points.",
      roles: ["VOLUNTEER", "ADMIN"],
    },
  ].filter(c => c.roles.includes(role));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Welcome, {session.user?.name}
      </h1>
      <p className="text-sm text-gray-500 mb-8 capitalize">
        Signed in as <strong>{role.toLowerCase()}</strong>
      </p>

      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map(c => (
          <Link
            key={c.href}
            href={c.href}
            className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-red-200 hover:shadow-sm transition-all group"
          >
            <div className="text-3xl mb-3">{c.emoji}</div>
            <h2 className="font-semibold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
              {c.title}
            </h2>
            <p className="text-sm text-gray-500">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
