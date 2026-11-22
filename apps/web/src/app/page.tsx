import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--surface-0)" }}>

      {/* Top nav */}
      <header
        className="px-6 h-14 flex items-center justify-between max-w-6xl mx-auto w-full"
        style={{ borderBottom: "1px solid var(--border-soft)" }}
      >
        <span className="font-bold tracking-tight text-base">
          <span style={{ color: "var(--red-600)" }}>LIFE</span>
          <span style={{ color: "var(--text-primary)" }}>BRIDGE</span>
        </span>
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn btn-ghost btn-sm">Sign in</Link>
          <Link href="/register" className="btn btn-primary btn-sm">Get started</Link>
        </div>
      </header>

      {/* Hero — split layout */}
      <section className="flex-1 max-w-6xl mx-auto w-full px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          {/* Demo pill */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-8"
            style={{ background: "var(--red-50)", color: "var(--red-700)", border: "1px solid var(--red-100)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--red-500)" }} />
            Hackathon MVP · Simulated demo
          </div>

          <h1 className="t-display mb-5" style={{ color: "var(--text-primary)", maxWidth: 480 }}>
            Every second<br />
            <span style={{ color: "var(--red-600)" }}>matters.</span>
          </h1>

          <p className="text-base mb-8 leading-relaxed" style={{ color: "var(--text-secondary)", maxWidth: 420 }}>
            LIFEBridge connects patients, doctors, hospitals, ambulances,
            and community volunteers into one coordinated emergency&#8209;response
            and care platform.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/register" className="btn btn-primary btn-lg">Join LIFEBridge</Link>
            <Link
              href="/rescue/report"
              className="btn btn-ghost btn-lg"
              style={{ color: "var(--red-600)", borderColor: "var(--red-100)" }}
            >
              Report an incident
            </Link>
          </div>

          <p className="mt-8 text-xs" style={{ color: "var(--text-muted)" }}>
            Emergency in India? Call{" "}
            <strong style={{ color: "var(--text-secondary)" }}>112</strong>{" "}
            immediately — do not wait for LIFEBridge.
          </p>
        </div>

        {/* Visual panel */}
        <div
          className="hidden lg:grid grid-cols-2 gap-3"
          aria-hidden="true"
        >
          {[
            { label: "Incident reported", sub: "Silk Board, Bengaluru", status: "REPORTED",   badge: "badge-reported" },
            { label: "Hospital notified", sub: "Manipal — 1.2 km",     status: "ACKNOWLEDGED",badge: "badge-ack" },
            { label: "Ambulance dispatched", sub: "ETA 4 min",          status: "DISPATCHED",  badge: "badge-dispatch" },
            { label: "Records shared",    sub: "Consent: active",        status: "ARRIVED",    badge: "badge-arrived" },
          ].map(c => (
            <div key={c.label} className="surface-raised p-4">
              <span className={`badge ${c.badge} mb-3`}>{c.status}</span>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{c.label}</p>
              <p className="t-caption mt-0.5">{c.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Three modules strip */}
      <section style={{ borderTop: "1px solid var(--border-soft)", background: "var(--surface-1)" }}>
        <div className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M10 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM4 16c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ),
              title: "LIFEBridge Health",
              desc: "Patient-controlled longitudinal records with consent-based sharing across doctors and specialists.",
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ),
              title: "LIFEBridge Rescue",
              desc: "AI-structured incident reporting that coordinates nearby hospitals and ambulances in real time.",
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M10 2l2.09 4.26L17 7.27l-3.5 3.41.83 4.82L10 13.3l-4.33 2.2.83-4.82L3 7.27l4.91-.71L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              ),
              title: "LIFEBridge Heroes",
              desc: "Verified recognition and an auditable points ledger for community volunteers who safely assist.",
            },
          ].map(m => (
            <div key={m.title} className="surface p-5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                style={{ background: "var(--red-50)", color: "var(--red-600)" }}
              >
                {m.icon}
              </div>
              <h3 className="t-heading mb-2" style={{ color: "var(--text-primary)" }}>{m.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer
        className="px-6 py-5 text-center t-caption max-w-6xl mx-auto w-full"
        style={{ borderTop: "1px solid var(--border-soft)" }}
      >
        LIFEBridge is a hackathon prototype — not an emergency service, medical device, or clinical system.
      </footer>
    </div>
  );
}
