"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  consentId: string;
  currentStatus: string;
}

export function ConsentActions({ consentId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<"APPROVED" | "REVOKED" | null>(null);
  const [done, setDone] = useState(currentStatus);

  async function respond(action: "APPROVED" | "REVOKED") {
    setLoading(action);
    const res = await fetch(`/api/health/consents/${consentId}/respond`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setLoading(null);
    if (res.ok) {
      setDone(action);
      router.refresh();
    }
  }

  if (done !== "PENDING") {
    return (
      <span className={`badge ${done === "APPROVED" ? "badge-arrived" : "badge-cancel"}`}>
        {done}
      </span>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <span className="badge badge-pending">PENDING</span>
      <button
        onClick={() => respond("APPROVED")}
        disabled={loading !== null}
        className="btn btn-sm"
        style={{ color: "#166534", borderColor: "#bbf7d0", background: "#f0fdf4" }}
      >
        {loading === "APPROVED"
          ? <span className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          : "Approve"
        }
      </button>
      <button
        onClick={() => respond("REVOKED")}
        disabled={loading !== null}
        className="btn btn-sm"
        style={{ color: "var(--red-700)", borderColor: "var(--red-100)", background: "var(--red-50)" }}
      >
        {loading === "REVOKED"
          ? <span className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          : "Decline"
        }
      </button>
    </div>
  );
}
