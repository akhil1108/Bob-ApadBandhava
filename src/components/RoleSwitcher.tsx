"use client";

import { useRouter } from "next/navigation";
import type { Role } from "@/lib/types";

// Demo-only role switcher: jumps to each role's landing screen. Real auth comes later.
const roleHome: Record<Role, string> = {
  citizen: "/rescue/report",
  patient: "/health",
  doctor: "/health/records/rec-1",
  hospital: "/ops",
  ambulance: "/ops",
  volunteer: "/heroes",
  admin: "/admin",
};

export function RoleSwitcher() {
  const router = useRouter();
  return (
    <label className="flex items-center gap-2 text-sm text-slate-600">
      <span className="hidden sm:inline">Demo role</span>
      <select
        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
        defaultValue=""
        onChange={(e) => e.target.value && router.push(roleHome[e.target.value as Role])}
      >
        <option value="" disabled>
          Choose…
        </option>
        {Object.keys(roleHome).map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </label>
  );
}
