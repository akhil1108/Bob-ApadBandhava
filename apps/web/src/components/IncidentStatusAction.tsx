"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const NEXT_STATUS: Record<string, { label: string; next: string; style: string }> = {
  ACKNOWLEDGED: { label: "Mark Dispatched",  next: "DISPATCHED", style: "color:#5b21b6;borderColor:#ede9fe;background:#f5f3ff" },
  DISPATCHED:   { label: "Mark Arrived",     next: "ARRIVED",    style: "color:#166534;borderColor:#bbf7d0;background:#f0fdf4" },
  ARRIVED:      { label: "Mark Completed",   next: "COMPLETED",  style: "color:#1e40af;borderColor:#bfdbfe;background:#eff6ff" },
};

interface Props {
  incidentId: string;
  status: string;
}

export function IncidentStatusAction({ incidentId, status }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const action = NEXT_STATUS[status];

  if (!action) return null;

  async function advance() {
    setLoading(true);
    await fetch(`/api/rescue/incidents/${incidentId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: action.next }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={advance}
      disabled={loading}
      className="btn btn-sm"
      style={Object.fromEntries(action.style.split(";").filter(Boolean).map(s => {
        const [k, v] = s.split(":");
        return [k.trim().replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()), v.trim()];
      }))}
    >
      {loading
        ? <span className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin" />
        : action.label
      }
    </button>
  );
}
