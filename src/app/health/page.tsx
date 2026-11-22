import Link from "next/link";
import { consentRequests, patient, records } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { OriginBadge } from "@/components/OriginBadge";

export default function HealthProfilePage() {
  const pending = consentRequests.filter((c) => c.status === "pending").length;
  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <PageHeader
        title={patient.name}
        subtitle={`Age ${patient.age} · Blood group ${patient.bloodGroup} · Synthetic demo patient`}
        action={
          <div className="flex gap-2">
            <Button variant="secondary">Upload report</Button>
            <ButtonLink href="/health/consents">Access requests{pending ? ` (${pending})` : ""}</ButtonLink>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <Card title="Allergies">
            <div className="flex flex-wrap gap-2">
              {patient.allergies.map((a) => (
                <Badge key={a} tone="danger">
                  {a}
                </Badge>
              ))}
            </div>
          </Card>
          <Card title="Conditions">
            <ul className="list-inside list-disc text-sm">
              {patient.conditions.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </Card>
          <Card title="AI summary" action={<Badge tone="ai">AI-generated</Badge>}>
            <p className="text-sm text-slate-700">
              Seasonal wheeze managed with a reliever inhaler since Aug 2026. Referred to pulmonology for spirometry.
              Penicillin allergy on record.
            </p>
            <p className="mt-2 text-xs text-slate-500">Summary of records you can access. Not a diagnosis.</p>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card title="Medical timeline">
            <ul className="divide-y divide-slate-100">
              {sorted.map((r) => (
                <li key={r.id} className="py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link href={`/health/records/${r.id}`} className="font-medium text-brand hover:underline">
                      {r.title}
                    </Link>
                    <div className="flex gap-2">
                      <Badge>{r.kind}</Badge>
                      <OriginBadge origin={r.origin} />
                      {r.verified ? <Badge tone="success">verified</Badge> : <Badge tone="warning">unverified</Badge>}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    {formatDate(r.date)} · {r.author} · {r.facility}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
