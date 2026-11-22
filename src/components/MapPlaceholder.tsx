import type { GeoPoint } from "@/lib/types";

/**
 * Placeholder for the map/location view. Swap for an OpenStreetMap-based
 * library (e.g. react-leaflet or MapLibre) when moving past the UI design stage.
 */
export function MapPlaceholder({ points, height = 240 }: { points: (GeoPoint & { kind?: string })[]; height?: number }) {
  return (
    <div
      className="relative flex flex-col justify-end overflow-hidden rounded-lg border border-dashed border-slate-300 bg-[repeating-linear-gradient(45deg,#f1f5f9_0,#f1f5f9_10px,#e2e8f0_10px,#e2e8f0_20px)] p-3"
      style={{ height }}
    >
      <span className="absolute left-3 top-3 rounded bg-white/90 px-2 py-0.5 text-xs text-slate-600">Map (placeholder)</span>
      <ul className="space-y-1">
        {points.map((p) => (
          <li key={`${p.lat},${p.lng}`} className="w-fit rounded bg-white/90 px-2 py-0.5 text-xs text-slate-700">
            📍 {p.label}
            {p.kind ? ` · ${p.kind}` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
