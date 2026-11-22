import { notFound } from "next/navigation";
import { getRecord } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { OriginBadge } from "@/components/OriginBadge";

export default async function RecordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = getRecord(id);
  if (!record) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title={record.title}
        subtitle={`${formatDate(record.date)} · ${record.facility}`}
        action={<Button variant="secondary">Add consultation note</Button>}
      />

      <Card title="Provenance">
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-slate-500">Author</dt>
          <dd>{record.author}</dd>
          <dt className="text-slate-500">Type</dt>
          <dd>
            <Badge>{record.kind}</Badge>
          </dd>
          <dt className="text-slate-500">Origin</dt>
          <dd>
            <OriginBadge origin={record.origin} />
          </dd>
          <dt className="text-slate-500">Verification</dt>
          <dd>{record.verified ? <Badge tone="success">verified</Badge> : <Badge tone="warning">unverified</Badge>}</dd>
        </dl>
      </Card>

      <Card title="Content">
        <p className="text-sm text-slate-700">{record.summary}</p>
        <div className="mt-4 flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-400">
          Document preview (placeholder)
        </div>
      </Card>
    </div>
  );
}
