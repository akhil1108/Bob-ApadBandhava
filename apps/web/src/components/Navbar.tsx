"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, type UserRole } from "@/lib/nav";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = (session?.user as { role?: UserRole } | undefined)?.role;

  const visibleItems = NAV_ITEMS.filter(
    item => !item.roles || (role && item.roles.includes(role))
  );

  return (
    <nav className="border-b border-gray-100 bg-white px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-lg font-bold text-red-600 tracking-tight">
          LIFE<span className="text-gray-900">BRIDGE</span>
        </Link>
        {session && (
          <div className="hidden sm:flex items-center gap-1">
            {visibleItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  pathname.startsWith(item.href)
                    ? "bg-red-50 text-red-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {session ? (
          <>
            <span className="text-xs text-gray-500 hidden sm:block">
              {session.user?.name} ·{" "}
              <span className="capitalize text-gray-700">{role?.toLowerCase()}</span>
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
