import { Navbar } from "@/components/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--surface-1)" }}>
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-5 py-8">{children}</main>
    </div>
  );
}
