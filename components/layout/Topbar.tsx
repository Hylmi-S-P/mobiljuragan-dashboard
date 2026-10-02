"use client";

import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { WORKSPACE_NAME, pageTitleFor } from "@/lib/navigation";

export function Topbar({ onOpenNav }: { onOpenNav: () => void }) {
  const pathname = usePathname();

  return (
    <header className="flex h-[72px] shrink-0 items-center gap-4 border-b border-rule bg-surface px-6 lg:px-8">
      <Button variant="outline" onClick={onOpenNav} className="lg:hidden">
        Menu
      </Button>
      <h1 className="truncate text-subtitle font-semibold text-ink">{pageTitleFor(pathname)}</h1>
      <p className="hidden text-meta text-ink-soft sm:block">{WORKSPACE_NAME}</p>
    </header>
  );
}
