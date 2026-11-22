"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Patient {
  id: string;
  user: { name: string };
}

interface Props {
  patients: Patient[];
}

export function AddConsultationForm({ patients }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ patientProfileId: "", notes: "", prescription: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.patientProfileId) { setError("Select a patient."); return; }
    setError("");
    setLoading(true);
    const res = await fetch("/api/health/consultations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (!res.ok) {
      const d = await res.json();
      setError(d.error ?? "Failed to create consultation.");
    } else {
      setOpen(false);
      setForm({ patientProfileId: "", notes: "", prescription: "" });
      router.refresh();
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn btn-primary btn-sm">
        + Add consultation
      </button>
    );
  }

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "var(--surface-1)", border: "1px solid var(--border-soft)" }}
    >
      <h3 className="t-label mb-4" style={{ color: "var(--text-secondary)" }}>New consultation</h3>
      {error && (
        <div className="text-sm mb-3 px-3 py-2 rounded-lg"
          style={{ background: "var(--red-50)", color: "var(--red-700)" }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="field-label" htmlFor="patient">Patient</label>
          <select
            id="patient"
            required
            value={form.patientProfileId}
            onChange={e => setForm(f => ({ ...f, patientProfileId: e.target.value }))}
            className="field-input"
          >
            <option value="">Select patient…</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.user.name}</option>
            ))}
          </select>
          {patients.length === 0 && (
            <p className="t-caption mt-1">No patients have granted you consent yet.</p>
          )}
        </div>
        <div>
          <label className="field-label" htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            rows={3}
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            className="field-input"
            style={{ resize: "none" }}
            placeholder="Clinical notes…"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="prescription">Prescription</label>
          <textarea
            id="prescription"
            rows={2}
            value={form.prescription}
            onChange={e => setForm(f => ({ ...f, prescription: e.target.value }))}
            className="field-input"
            style={{ resize: "none" }}
            placeholder="Medications prescribed…"
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="btn btn-primary btn-sm">
            {loading
              ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
              : "Save consultation"
            }
          </button>
          <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost btn-sm">Cancel</button>
        </div>
      </form>
    </div>
  );
}
