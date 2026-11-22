import Link from "next/link";
import { RoleSwitcher } from "./RoleSwitcher";

const links = [
  { href: "/rescue/report", label: "Report" },
  { href: "/ops", label: "Operations" },
  { href: "/health", label: "Health" },
  { href: "/heroes", label: "Heroes" },
  { href: "/admin", label: "Admin" },
];

export function NavBar() {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-lg font-bold text-brand">
          LIFEBridge
        </Link>
        <ul className="flex flex-wrap gap-4 text-sm font-medium text-slate-700">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-brand">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <RoleSwitcher />
      </div>
    </nav>
  );
}
