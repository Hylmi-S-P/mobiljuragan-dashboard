"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { NAV_ENTRIES, WORKSPACE_NAME, WORKSPACE_ROLE, isNavGroup } from "@/lib/navigation";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const fleetActive = NAV_ENTRIES.some(
    (entry) => isNavGroup(entry) && entry.items.some((item) => pathname.startsWith(item.href)),
  );

  /* Akordeon mengikuti rute armada; pilihan manual pengguna menang sampai ia mengubahnya lagi. */
  const [fleetOverride, setFleetOverride] = useState<boolean | null>(null);
  const fleetOpen = fleetOverride ?? fleetActive;

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      {open ? (
        <div aria-hidden="true" onClick={onClose} className="fixed inset-0 z-30 bg-ink/50 lg:hidden" />
      ) : null}

      <aside
        aria-label="Navigasi utama"
        className={`fixed inset-y-0 left-0 z-40 flex w-60 shrink-0 flex-col overflow-y-auto bg-navy px-6 py-7 lg:static lg:visible lg:translate-x-0 ${
          open ? "visible translate-x-0" : "invisible -translate-x-full"
        }`}
      >
        <p className="text-base font-semibold leading-snug text-white">{WORKSPACE_NAME}</p>
        <p className="mt-2 text-[13px] text-white/75">{WORKSPACE_ROLE}</p>

        <nav className="mt-8 flex flex-col gap-1">
          {NAV_ENTRIES.map((entry) => {
            if (isNavGroup(entry)) {
              return (
                <div key={entry.label} className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => setFleetOverride(!fleetOpen)}
                    aria-expanded={fleetOpen}
                    className="flex h-11 items-center justify-between rounded-nav px-3 text-sm font-medium text-white hover:bg-navy-hover"
                  >
                    {entry.label}
                    <span aria-hidden="true" className="text-xs">
                      {fleetOpen ? "\u25B4" : "\u25BE"}
                    </span>
                  </button>
                  {fleetOpen ? (
                    <div className="flex flex-col gap-1">
                      {entry.items.map((item) => {
                        const active = pathname.startsWith(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            onClick={onClose}
                            className={`flex h-10 items-center rounded-nav pl-6 pr-3 text-sm font-medium ${
                              active ? "bg-teal text-white" : "text-white/90 hover:bg-navy-hover"
                            }`}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            }

            const active = pathname === entry.href;
            return (
              <Link
                key={entry.href}
                href={entry.href}
                aria-current={active ? "page" : undefined}
                onClick={onClose}
                className={`flex h-11 items-center rounded-nav px-3 text-sm font-medium ${
                  active ? "bg-teal text-white" : "text-white/90 hover:bg-navy-hover"
                }`}
              >
                {entry.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
