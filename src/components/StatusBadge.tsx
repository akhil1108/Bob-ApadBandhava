import type { IncidentStatus, ProviderResponse, Participation, ConsentRequest } from "@/lib/types";
import { Badge, type BadgeTone } from "./ui/Badge";

const incidentTone: Record<IncidentStatus, BadgeTone> = {
  reported: "neutral",
  requested: "info",
  acknowledged: "info",
  accepted: "success",
  dispatched: "warning",
  arrived: "success",
  completed: "success",
};

const genericTone: Record<string, BadgeTone> = {
  pending: "neutral",
  acknowledged: "info",
  accepted: "success",
  declined: "danger",
  submitted: "neutral",
  "under-review": "info",
  verified: "success",
  rejected: "danger",
  granted: "success",
  denied: "danger",
  revoked: "neutral",
  expired: "neutral",
};

type AnyStatus = IncidentStatus | ProviderResponse["state"] | Participation["status"] | ConsentRequest["status"];

export function StatusBadge({ status }: { status: AnyStatus }) {
  const tone = (incidentTone as Record<string, BadgeTone>)[status] ?? genericTone[status] ?? "neutral";
  return <Badge tone={tone}>{status.replace("-", " ")}</Badge>;
}
