import type { TimelineEvent } from "@/lib/types";
import { formatDateTime } from "@/lib/format";
import { SimulatedBadge } from "./SimulatedBadge";

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative ml-2 border-l border-slate-200">
      {events.map((e, i) => (
        <li key={i} className="mb-5 ml-4 last:mb-0">
          <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-white bg-brand" />
          <time className="text-xs text-slate-500">{formatDateTime(e.at)}</time>
          <p className="text-sm text-slate-900">
            <span className="font-medium">{e.actor}:</span> {e.message}
          </p>
          {e.simulated && <SimulatedBadge />}
        </li>
      ))}
    </ol>
  );
}
