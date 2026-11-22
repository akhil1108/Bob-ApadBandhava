import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const modules = [
  {
    name: "LIFEBridge Health",
    body: "Patient-controlled medical records, referrals and consent-based sharing.",
    href: "/health",
  },
  {
    name: "LIFEBridge Rescue",
    body: "Report incidents and coordinate with participating ambulances and hospitals.",
    href: "/rescue/report",
  },
  {
    name: "LIFEBridge Heroes",
    body: "Verified recognition for community members who safely assist.",
    href: "/heroes",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-slate-900">LIFEBridge</h1>
        <p className="mt-2 text-lg text-slate-600">Every Second Matters. Every Life Connects Us.</p>
        <div className="mt-6 flex justify-center gap-3">
          <ButtonLink href="/rescue/report" variant="danger">
            Report an incident
          </ButtonLink>
          <ButtonLink href="/health" variant="secondary">
            My health records
          </ButtonLink>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {modules.map((m) => (
          <Card key={m.name} title={m.name}>
            <p className="mb-4 text-sm text-slate-600">{m.body}</p>
            <ButtonLink href={m.href} variant="secondary">
              Open
            </ButtonLink>
          </Card>
        ))}
      </div>
    </div>
  );
}
