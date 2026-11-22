import { getVolunteer, ledger, participations } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { SimulatedBadge } from "@/components/SimulatedBadge";

// Demo: viewing as the volunteer "vol-2".
const VOLUNTEER_ID = "vol-2";

export default function HeroesPage() {
  const me = getVolunteer(VOLUNTEER_ID)!;
  const mine = participations.filter((p) => p.volunteerId === VOLUNTEER_ID);
  const myLedger = ledger.filter((l) => l.volunteerId === VOLUNTEER_ID);

  return (
    <div className="space-y-6">
      <PageHeader
        title="LIFEBridge Heroes"
        subtitle={`${me.name} · Points are recognition only, not cash or benefits.`}
        action={<SimulatedBadge label="Demo points" />}
      />

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        Never put yourself at risk or go beyond your training. Call 112 first. Reporting alone does not earn points.
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Profile">
          <p className="text-3xl font-bold text-brand">{me.points}</p>
          <p className="text-xs text-slate-500">verified points</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {me.certifications.map((c) => (
              <Badge key={c} tone="info">
                {c}
              </Badge>
            ))}
          </div>
          <Button variant="secondary" className="mt-4">
            Add certification
          </Button>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card title="My contributions">
            <ul className="divide-y divide-slate-100">
              {mine.map((p) => (
                <li key={p.id} className="flex items-start justify-between gap-3 py-3 text-sm">
                  <div>
                    <p className="font-medium">{p.incidentId}</p>
                    <p className="text-slate-600">{p.contribution}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Points ledger">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2">Date</th>
                  <th>Reason</th>
                  <th>Verified by</th>
                  <th className="text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myLedger.map((l) => (
                  <tr key={l.id}>
                    <td className="py-2">{formatDateTime(l.at)}</td>
                    <td>{l.reason}</td>
                    <td>{l.verifiedBy}</td>
                    <td className="text-right font-medium">+{l.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
}
