import type { DataOrigin } from "@/lib/types";
import { Badge, type BadgeTone } from "./ui/Badge";

const tone: Record<DataOrigin, BadgeTone> = {
  "patient-reported": "neutral",
  "provider-authored": "success",
  "system-generated": "info",
  "ai-generated": "ai",
};

/** Distinguishes where a piece of data came from (Development Principle #3). */
export function OriginBadge({ origin }: { origin: DataOrigin }) {
  return <Badge tone={tone[origin]}>{origin.replace("-", " ")}</Badge>;
}
