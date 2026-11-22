"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_ITEMS, type UserRole } from "@/lib/nav";

const ROLE_LABELS: Record<string, string> = {
  PATIENT: "Patient", DOCTOR: "Doctor", HOSPITAL: "Hospital",
  AMBULANCE: "Ambulance", VOLUNTEER: "Volunteer", ADMIN: "Admin",
};

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = (session?.user as { role?: UserRole } | undefined)?.role;
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleItems = NAV_ITEMS.filter(
    item => !item.roles || (role && item.roles.includes(role))
  );

  return (
    <nav
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm"
      style={{ borderBottom: "1px solid var(--border-soft)", boxShadow: "0 1px 0 0 var(--border-soft)" }}
    >
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href={session ? "/dashboard" : "/"}
          className="flex items-center gap-1.5 shrink-0"
          aria-label="LIFEBridge home"
        >
          <span
            className="font-bold tracking-tight text-base"
            style={{ color: "var(--red-600)" }}
          >
            LIFE
          </span>
          <span
            className="font-bold tracking-tight text-base"
            style={{ color: "var(--text-primary)" }}
          >
            BRIDGE
          </span>
        </Link>

        {/* Desktop nav links */}
        {session && (
          <div className="hidden sm:flex items-center gap-0.5 flex-1 ml-6">
            {visibleItems.map(item => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                  style={{
                    color: active ? "var(--red-600)" : "var(--text-secondary)",
                    background: active ? "var(--red-50)" : "transparent",
                  }}
                >
                  {item.label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                      style={{ background: "var(--red-500)" }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto">
          {session ? (
            <>
              <div
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background: "var(--surface-2)" }}
              >
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "var(--red-600)" }}>
                  {session.user?.name?.[0]?.toUpperCase()}
                </span>
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {session.user?.name?.split(" ")[0]}
                </span>
                {role && (
                  <span className="badge badge-cancel" style={{ fontSize: "0.625rem" }}>
                    {ROLE_LABELS[role] ?? role}
                  </span>
                )}
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn btn-ghost btn-sm hidden sm:inline-flex"
              >
                Sign out
              </button>
              {/* Mobile menu toggle */}
              <button
                className="sm:hidden btn btn-ghost btn-sm"
                onClick={() => setMenuOpen(o => !o)}
                aria-label="Menu"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  {menuOpen
                    ? <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    : <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  }
                </svg>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">Sign in</Link>
              <Link href="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && session && (
        <div
          className="sm:hidden border-t px-5 py-3 space-y-1"
          style={{ borderColor: "var(--border-soft)", background: "var(--surface-0)" }}
        >
          {visibleItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium"
              style={{ color: pathname.startsWith(item.href) ? "var(--red-600)" : "var(--text-secondary)" }}
            >
              {item.label}
            </Link>
          ))}
          <div className="divider" />
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-left px-3 py-2 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            Sign out
          </button>
        </div>
      )}
    </nav>
  );
}
