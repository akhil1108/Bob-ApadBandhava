import { notFound } from "next/navigation";
import { getIncident, getProvider, getVolunteer } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { SimulatedBadge } from "@/components/SimulatedBadge";
import { Timeline } from "@/components/Timeline";
import { MapPlaceholder } from "@/components/MapPlaceholder";

const flow = ["reported", "requested", "acknowledged", "accepted", "dispatched", "arrived", "completed"] as const;

export default async function IncidentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const incident = getIncident(id);
  if (!incident) notFound();

  const currentStep = flow.indexOf(incident.status);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${incident.id} · ${incident.type}`}
        subtitle={`Reported ${formatDateTime(incident.reportedAt)} · ${incident.location.label}`}
        action={<StatusBadge status={incident.status} />}
      />

      {/* Status stepper: requested ≠ acknowledged ≠ accepted ≠ dispatched (Principle #5) */}
      <ol className="flex flex-wrap gap-2">
        {flow.map((s, i) => (
          <li
            key={s}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              i <= currentStep ? "bg-brand text-white" : "bg-slate-200 text-slate-600"
            }`}
          >
            {s}
          </li>
        ))}
      </ol>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Location">
            <MapPlaceholder points={[incident.location]} />
          </Card>

          <Card title="Provider responses" action={<SimulatedBadge label="Simulated providers" />}>
            <ul className="divide-y divide-slate-100">
              {incident.providerResponses.map((r) => {
                const p = getProvider(r.providerId);
                return (
                  <li key={r.providerId} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <p className="font-medium">{p?.name}</p>
                      <p className="text-xs text-slate-500">
                        {p?.kind} · {p?.distanceKm} km · {r.note ?? (r.at ? formatDateTime(r.at) : "awaiting response")}
                      </p>
                    </div>
                    <StatusBadge status={r.state} />
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              Distance does not imply availability. Capacity and acceptance must be confirmed by each provider.
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Report">
            <p className="text-sm text-slate-700">{incident.description}</p>
            <p className="mt-2 text-xs text-slate-500">People affected: {incident.peopleAffected}</p>
          </Card>

          {incident.aiExtraction && (
            <Card title="AI extraction" action={<Badge tone="ai">AI-generated</Badge>}>
              <dl className="space-y-1 text-sm">
                <div>
                  <dt className="inline text-slate-500">Type: </dt>
                  <dd className="inline">{incident.aiExtraction.incidentType}</dd>
                </div>
                <div>
                  <dt className="inline text-slate-500">Injuries: </dt>
                  <dd className="inline">{incident.aiExtraction.reportedInjuries}</dd>
                </div>
                <div>
                  <dt className="inline text-slate-500">Confidence: </dt>
                  <dd className="inline">{Math.round(incident.aiExtraction.confidence * 100)}%</dd>
                </div>
              </dl>
              {!incident.aiExtraction.reviewedByHuman && (
                <p className="mt-2 text-xs text-amber-700">Pending human review</p>
              )}
            </Card>
          )}

          <Card title="Volunteers on scene">
            <ul className="text-sm">
              {incident.volunteerIds.map((v) => (
                <li key={v}>{getVolunteer(v)?.name}</li>
              ))}
            </ul>
          </Card>

          <Card title="Timeline">
            <Timeline events={incident.timeline} />
          </Card>
        </div>
      </div>
    </div>
  );
}
