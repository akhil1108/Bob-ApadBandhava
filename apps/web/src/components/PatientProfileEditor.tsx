"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  initialData: {
    bloodGroup: string | null;
    allergies: string | null;
    dob: Date | null;
  } | null;
}

export function PatientProfileEditor({ initialData }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    bloodGroup: initialData?.bloodGroup ?? "",
    allergies:  initialData?.allergies  ?? "",
    dob:        initialData?.dob
      ? new Date(initialData.dob).toISOString().split("T")[0]
      : "",
  });
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");
    const res = await fetch("/api/health/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const d = await res.json();
      setError(d.error ?? "Failed to save.");
    } else {
      setEditing(false);
      router.refresh();
    }
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="btn btn-ghost btn-sm"
        style={{ marginLeft: "auto" }}
      >
        Edit profile
      </button>
    );
  }

  return (
    <div
      className="rounded-xl p-5 mt-4"
      style={{ background: "var(--surface-1)", border: "1px solid var(--border-soft)" }}
    >
      <h3 className="t-label mb-4" style={{ color: "var(--text-secondary)" }}>Edit profile</h3>
      {error && (
        <div className="text-sm mb-3 px-3 py-2 rounded-lg"
          style={{ background: "var(--red-50)", color: "var(--red-700)" }}>
          {error}
        </div>
      )}
      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="field-label" htmlFor="bg">Blood Group</label>
          <select
            id="bg"
            value={form.bloodGroup}
            onChange={e => setForm(f => ({ ...f, bloodGroup: e.target.value }))}
            className="field-input"
          >
            <option value="">Select…</option>
            {["A+","A−","B+","B−","AB+","AB−","O+","O−"].map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="dob">Date of Birth</label>
          <input
            id="dob"
            type="date"
            value={form.dob}
            onChange={e => setForm(f => ({ ...f, dob: e.target.value }))}
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="allergies">Allergies</label>
          <input
            id="allergies"
            type="text"
            value={form.allergies}
            onChange={e => setForm(f => ({ ...f, allergies: e.target.value }))}
            className="field-input"
            placeholder="e.g. Penicillin, latex"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm">
          {saving
            ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
            : "Save"
          }
        </button>
        <button onClick={() => setEditing(false)} className="btn btn-ghost btn-sm">Cancel</button>
      </div>
    </div>
  );
}
