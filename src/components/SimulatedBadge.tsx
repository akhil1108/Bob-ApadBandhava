import { Badge } from "./ui/Badge";

/** Label every simulated integration, provider, dispatch, or reward shown in the demo. */
export function SimulatedBadge({ label = "Simulated" }: { label?: string }) {
  return <Badge tone="warning">{label}</Badge>;
}
