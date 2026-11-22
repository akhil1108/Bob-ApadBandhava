import { consentRequests, getRecord } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";

export default function ConsentsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Access requests & consent"
        subtitle="See who wants to view your records, for what purpose, and for how long."
      />

      {consentRequests.map((c) => (
        <Card key={c.id} title={c.requester} action={<StatusBadge status={c.status} />}>
          <p className="text-sm text-slate-700">
            <span className="text-slate-500">Purpose:</span> {c.purpose}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Requested {formatDateTime(c.requestedAt)}
            {c.expiresAt && ` · Access expires ${formatDateTime(c.expiresAt)}`}
          </p>

          <fieldset className="mt-4 space-y-2">
            <legend className="mb-1 text-sm font-medium">Records requested</legend>
            {c.recordIds.map((rid) => (
              <label key={rid} className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked disabled={c.status !== "pending"} />
                {getRecord(rid)?.title}
              </label>
            ))}
          </fieldset>

          <div className="mt-4 flex gap-2">
            {c.status === "pending" && (
              <>
                <Button>Allow selected</Button>
                <Button variant="secondary">Deny</Button>
              </>
            )}
            {c.status === "granted" && <Button variant="secondary">Revoke access</Button>}
          </div>
        </Card>
      ))}
    </div>
  );
}
