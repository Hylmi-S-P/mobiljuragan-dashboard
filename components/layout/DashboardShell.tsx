"use client";

import { useState, type ReactNode } from "react";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function DashboardShell({ children }: { children: ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex min-h-dvh">
      <a
        href="#konten"
        className="sr-only rounded-sm bg-surface px-4 py-2 text-body font-medium text-ink shadow-card focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Lewati ke konten
      </a>
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenNav={() => setNavOpen(true)} />
        <main id="konten" className="flex-1 px-5 py-5 lg:px-7">
          {children}
        </main>
      </div>
    </div>
  );
}
