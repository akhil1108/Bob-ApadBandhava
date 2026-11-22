import type { Metadata } from "next";
import type { ReactNode } from "react";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "LIFEBridge",
  description: "Every Second Matters. Every Life Connects Us.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <EmergencyBanner />
        <NavBar />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-6xl px-4 pb-8 text-xs text-slate-500">
          Hackathon prototype. All data, providers, dispatches and rewards shown are synthetic and simulated.
        </footer>
      </body>
    </html>
  );
}
