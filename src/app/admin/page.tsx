import { getIncident, getVolunteer, ledger, participations } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";

export default function AdminPage() {
  const queue = participations.filter((p) => p.status === "submitted" || p.status === "under-review");

  return (
    <div className="space-y-6">
      <PageHeader title="Admin · Verification" subtitle="Review volunteer contributions before any points are awarded." />

      <Card title={`Verification queue (${queue.length})`}>
        <ul className="divide-y divide-slate-100">
          {queue.map((p) => {
            const incident = getIncident(p.incidentId);
            return (
              <li key={p.id} className="space-y-2 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">
                    {getVolunteer(p.volunteerId)?.name} · {p.incidentId}
                  </p>
                  <StatusBadge status={p.status} />
                </div>
                <p className="text-sm text-slate-600">{p.contribution}</p>
                <p className="text-xs text-slate-500">
                  Incident: {incident?.type} at {incident?.location.label}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="number"
                    placeholder="Points"
                    className="w-24 rounded-lg border border-slate-300 px-2 py-1 text-sm"
                  />
                  <input
                    placeholder="Verification note (required)"
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-1 text-sm"
                  />
                  <Button>Verify & award</Button>
                  <Button variant="secondary">Reject</Button>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card title="Audit log · points ledger">
        <ul className="space-y-1 text-sm">
          {ledger.map((l) => (
            <li key={l.id}>
              {formatDateTime(l.at)} · {getVolunteer(l.volunteerId)?.name} · +{l.points} · {l.reason} · by {l.verifiedBy}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
