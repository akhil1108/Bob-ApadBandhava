"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ReportIncidentPage() {
  const router = useRouter();
  const [form, setForm] = useState({ description: "", latitude: "", longitude: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);

  function getLocation() {
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setForm(f => ({
          ...f,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setGeoLoading(false);
      },
      () => {
        setGeoLoading(false);
        setError("Could not get location. Enter coordinates manually or use Bengaluru demo coords.");
      }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.latitude || !form.longitude) {
      setError("Location is required. Use the button above or enter coordinates.");
      return;
    }
    setError("");
    setLoading(true);
    const res = await fetch("/api/rescue/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: form.description,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to submit incident.");
    } else {
      router.push("/rescue");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <Link href="/rescue" className="text-sm text-gray-500 hover:text-gray-700">← Back to Rescue</Link>
        </div>

        {/* Emergency banner */}
        <div className="bg-red-600 text-white rounded-2xl px-5 py-4 mb-6">
          <p className="font-bold text-lg">🆘 Immediate emergency?</p>
          <p className="text-sm opacity-90 mt-1">
            Call <strong>112</strong> first. Use this form to coordinate with LIFEBridge after.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Report an Incident</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Describe what happened
              </label>
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                placeholder="e.g. Road accident near Silk Board, Bengaluru. 2 people injured, one unconscious."
              />
              <p className="text-xs text-gray-400 mt-1">
                IBM AI will extract structured details. Output is assistive only — not a clinical triage.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <button
                type="button"
                onClick={getLocation}
                disabled={geoLoading}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 mb-3"
              >
                {geoLoading ? "Getting location…" : "📍 Use my current location"}
              </button>
              <p className="text-xs text-gray-400 mb-2">Or enter manually (demo: Bengaluru Silk Board = 12.9176, 77.6237)</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 mt-1"
                    placeholder="12.9176"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 mt-1"
                    placeholder="77.6237"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
            >
              {loading ? "Submitting…" : "Submit incident report"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
