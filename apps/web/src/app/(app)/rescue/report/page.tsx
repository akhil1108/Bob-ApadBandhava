"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ReportIncidentPage() {
  const router = useRouter();
  const [form, setForm] = useState({ description: "", latitude: "", longitude: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [locationSet, setLocationSet] = useState(false);

  function getLocation() {
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setForm(f => ({
          ...f,
          latitude:  pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setGeoLoading(false);
        setLocationSet(true);
      },
      () => {
        setGeoLoading(false);
        setError("Could not get location. Enter coordinates manually.");
      }
    );
  }

  function useDemoLocation() {
    setForm(f => ({ ...f, latitude: "12.9176", longitude: "77.6237" }));
    setLocationSet(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.latitude || !form.longitude) {
      setError("Location is required.");
      return;
    }
    setError("");
    setLoading(true);
    const res = await fetch("/api/rescue/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: form.description,
        latitude:  parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to submit.");
    } else {
      setSubmitted(true);
      setTimeout(() => router.push("/rescue"), 1800);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto pt-16 text-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: "var(--status-arrived)", color: "var(--status-arrived-fg)" }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path d="M4 11l5 5 9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="t-title mb-2" style={{ color: "var(--text-primary)" }}>Incident reported</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          IBM AI is extracting structured details. Redirecting to dashboard…
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Back */}
      <Link
        href="/rescue"
        className="inline-flex items-center gap-1.5 text-sm mb-6"
        style={{ color: "var(--text-muted)" }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Rescue
      </Link>

      {/* 112 alert */}
      <div
        className="rounded-xl px-4 py-4 mb-6"
        style={{ background: "var(--red-600)", color: "#fff" }}
        role="alert"
      >
        <p className="font-semibold mb-0.5">Immediate emergency?</p>
        <p className="text-sm opacity-90">
          Call <strong>112</strong> first. Use this form after to coordinate with LIFEBridge.
        </p>
      </div>

      <div className="surface-raised p-7">
        <h1 className="t-title mb-6" style={{ color: "var(--text-primary)" }}>Report an incident</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div
              className="text-sm px-3 py-2.5 rounded-lg"
              style={{ background: "var(--red-50)", color: "var(--red-700)", border: "1px solid var(--red-100)" }}
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Description */}
          <div>
            <label className="field-label" htmlFor="description">
              What happened?
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="field-input"
              style={{ resize: "none", lineHeight: 1.6 }}
              placeholder="e.g. Road accident near Silk Board flyover. 2 people injured, one unconscious. Heavy bleeding."
            />
            <p className="t-caption mt-1.5">
              IBM watsonx AI will extract structured details — assistive only, not a clinical assessment.
            </p>
          </div>

          {/* Location */}
          <div>
            <label className="field-label mb-2 block">Location</label>

            {/* Location action bar */}
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                type="button"
                onClick={getLocation}
                disabled={geoLoading}
                className="btn btn-ghost btn-sm"
              >
                {geoLoading
                  ? <><span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" /> Getting location…</>
                  : <>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                      <circle cx="6.5" cy="6.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M6.5 1v2M6.5 10v2M1 6.5h2M10 6.5h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                    Use my location
                  </>
                }
              </button>
              <button
                type="button"
                onClick={useDemoLocation}
                className="btn btn-ghost btn-sm"
              >
                Use Silk Board demo
              </button>
            </div>

            {/* Coordinate inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="t-caption block mb-1" htmlFor="lat">Latitude</label>
                <input
                  id="lat"
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={e => { setForm(f => ({ ...f, latitude: e.target.value })); setLocationSet(!!e.target.value); }}
                  className="field-input"
                  placeholder="12.9176"
                />
              </div>
              <div>
                <label className="t-caption block mb-1" htmlFor="lng">Longitude</label>
                <input
                  id="lng"
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={e => { setForm(f => ({ ...f, longitude: e.target.value })); setLocationSet(!!e.target.value); }}
                  className="field-input"
                  placeholder="77.6237"
                />
              </div>
            </div>

            {locationSet && (
              <p className="t-caption mt-1.5 flex items-center gap-1" style={{ color: "var(--status-arrived-fg)" }}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                  <path d="M1.5 5.5l3 3 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Location set
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !form.description || !form.latitude}
            className="btn btn-primary btn-lg w-full"
          >
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</>
              : "Submit incident report"
            }
          </button>
        </form>
      </div>
    </div>
  );
}
