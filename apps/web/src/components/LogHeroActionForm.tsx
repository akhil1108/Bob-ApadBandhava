"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Incident {
  id: string;
  description: string;
  status: string;
}

interface Props {
  incidents: Incident[];
}

export function LogHeroActionForm({ incidents }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ incidentId: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const activeIncidents = incidents.filter(i =>
    !["COMPLETED", "CANCELLED"].includes(i.status)
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.incidentId) { setError("Select an incident."); return; }
    setError("");
    setLoading(true);
    const res = await fetch("/api/heroes/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to log contribution.");
    } else {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setOpen(false);
        setForm({ incidentId: "", description: "" });
        router.refresh();
      }, 1500);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn btn-primary btn-sm">
        + Log contribution
      </button>
    );
  }

  if (success) {
    return (
      <div
        className="rounded-xl px-4 py-3 text-sm flex items-center gap-2"
        style={{ background: "var(--status-arrived)", color: "var(--status-arrived-fg)" }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Contribution logged — pending admin verification
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "var(--surface-1)", border: "1px solid var(--border-soft)" }}
    >
      <h3 className="t-label mb-1" style={{ color: "var(--text-secondary)" }}>Log a contribution</h3>
      <p className="t-caption mb-4">Your contribution will be reviewed and verified by an admin before points are awarded.</p>
      {error && (
        <div className="text-sm mb-3 px-3 py-2 rounded-lg"
          style={{ background: "var(--red-50)", color: "var(--red-700)" }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="field-label" htmlFor="incident">Incident</label>
          <select
            id="incident"
            required
            value={form.incidentId}
            onChange={e => setForm(f => ({ ...f, incidentId: e.target.value }))}
            className="field-input"
          >
            <option value="">Select incident…</option>
            {activeIncidents.map(i => (
              <option key={i.id} value={i.id}>
                {i.description.slice(0, 80)}{i.description.length > 80 ? "…" : ""}
              </option>
            ))}
          </select>
          {activeIncidents.length === 0 && (
            <p className="t-caption mt-1">No active incidents available.</p>
          )}
        </div>
        <div>
          <label className="field-label" htmlFor="desc">What did you do?</label>
          <textarea
            id="desc"
            rows={3}
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="field-input"
            style={{ resize: "none" }}
            placeholder="Describe your safe assistance within your first-aid training…"
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={loading || activeIncidents.length === 0} className="btn btn-primary btn-sm">
            {loading
              ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</>
              : "Submit for verification"
            }
          </button>
          <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost btn-sm">Cancel</button>
        </div>
      </form>
    </div>
  );
}
