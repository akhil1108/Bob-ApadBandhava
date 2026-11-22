"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import { Badge } from "@/components/ui/Badge";

const incidentTypes = ["Road accident", "Medical emergency", "Fire", "Fall / injury", "Other"];

export function ReportForm() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [showAiPreview, setShowAiPreview] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        // UI-only: route to the seeded demo incident.
        router.push("/rescue/incidents/INC-2026-0001");
      }}
    >
      <Card title="Location">
        <MapPlaceholder points={[{ lat: 12.9177, lng: 77.6238, label: "Silk Board Junction, Bengaluru" }]} height={180} />
        <div className="mt-3 flex gap-2">
          <Button type="button" variant="secondary">
            Use my location
          </Button>
          <input className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Or type a landmark" />
        </div>
      </Card>

      <Card title="What happened?">
        <div className="space-y-3">
          <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" defaultValue="">
            <option value="" disabled>
              Incident type
            </option>
            {incidentTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <textarea
            className="h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Describe what you see. You can type in any supported language."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm">
            People affected
            <input type="number" min={1} defaultValue={1} className="w-20 rounded-lg border border-slate-300 px-2 py-1" />
          </label>
          <Button type="button" variant="secondary" disabled={!description} onClick={() => setShowAiPreview(true)}>
            Extract details with IBM AI
          </Button>
        </div>
      </Card>

      {showAiPreview && (
        <Card title="AI-extracted details" action={<Badge tone="ai">AI-generated · please review</Badge>}>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-slate-500">Incident type</dt>
            <dd>Road traffic collision</dd>
            <dt className="text-slate-500">Reported injuries</dt>
            <dd>1 conscious rider, possible leg injury</dd>
            <dt className="text-slate-500">Confidence</dt>
            <dd>82%</dd>
          </dl>
          <p className="mt-3 text-xs text-slate-500">
            AI output is assistive only. It does not triage, choose a hospital, or dispatch resources.
          </p>
        </Card>
      )}

      <div className="flex justify-end gap-2">
        <Button type="submit" variant="danger">
          Submit report
        </Button>
      </div>
    </form>
  );
}
