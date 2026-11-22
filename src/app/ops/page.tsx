import Link from "next/link";
import { incidents, providers } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { SimulatedBadge } from "@/components/SimulatedBadge";
import { MapPlaceholder } from "@/components/MapPlaceholder";

export default function OpsDashboardPage() {
  const active = incidents.filter((i) => i.status !== "completed");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operations dashboard"
        subtitle="For participating hospitals, ambulance operators and coordinators."
        action={<SimulatedBadge label="Demo workflow" />}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Active incidents" value={active.length} />
        <Stat label="Awaiting your response" value={1} />
        <Stat label="Median acknowledgement" value="2m (demo)" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Incidents">
            <ul className="divide-y divide-slate-100">
              {incidents.map((i) => (
                <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <Link href={`/rescue/incidents/${i.id}`} className="font-medium text-brand hover:underline">
                      {i.id}
                    </Link>
                    <p className="text-sm text-slate-700">
                      {i.type} · {i.location.label}
                    </p>
                    <p className="text-xs text-slate-500">{formatDateTime(i.reportedAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={i.status} />
                    {i.status !== "completed" && (
                      <>
                        <Button variant="primary">Acknowledge</Button>
                        <Button variant="secondary">Decline</Button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card title="Map">
          <MapPlaceholder
            height={320}
            points={[
              ...active.map((i) => ({ ...i.location, kind: "incident" })),
              ...providers.map((p) => ({ ...p.location, kind: p.kind })),
            ]}
          />
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
