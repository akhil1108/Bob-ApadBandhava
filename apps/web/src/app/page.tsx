// LIFEBridge branded homepage
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-red-600 tracking-tight">
          LIFE<span className="text-gray-900">BRIDGE</span>
        </span>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Hackathon MVP · Demo only
          </div>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-4">
            Every Second Matters.
            <br />
            <span className="text-red-600">Every Life Connects Us.</span>
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
            LIFEBridge connects patients, doctors, hospitals, ambulances, and
            volunteers around a single coordinated care and emergency-response
            platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors text-sm"
            >
              Join LIFEBridge
            </Link>
            <Link
              href="/rescue/report"
              className="border border-red-200 text-red-700 hover:bg-red-50 font-semibold px-8 py-3 rounded-xl transition-colors text-sm"
            >
              Report an Incident
            </Link>
          </div>
        </div>
      </main>

      {/* Three modules */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-16">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="text-2xl mb-3">🏥</div>
            <h3 className="font-semibold text-gray-900 mb-2">LIFEBridge Health</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Patient-controlled longitudinal health records, referrals, and
              consent-based sharing with doctors and specialists.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="text-2xl mb-3">🚨</div>
            <h3 className="font-semibold text-gray-900 mb-2">LIFEBridge Rescue</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              AI-powered incident reporting that coordinates nearby hospitals
              and ambulances in real time via live status updates.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="text-2xl mb-3">🌟</div>
            <h3 className="font-semibold text-gray-900 mb-2">LIFEBridge Heroes</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Verified recognition for community volunteers who safely assist
              during emergencies, with an auditable points ledger.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 px-6 py-4 text-center text-xs text-gray-400">
        In an emergency in India, call{" "}
        <strong className="text-gray-600">112</strong> immediately. LIFEBridge
        is a hackathon prototype — not an emergency service.
      </footer>
    </div>
  );
}
