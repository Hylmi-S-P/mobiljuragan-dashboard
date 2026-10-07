"use client";

import { usePathname } from "next/navigation";

import { logoutAction } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { WORKSPACE_NAME, pageTitleFor } from "@/lib/navigation";

export function Topbar({ onOpenNav }: { onOpenNav: () => void }) {
  const pathname = usePathname();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-rule bg-surface px-5 lg:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <Button variant="outline" onClick={onOpenNav} className="lg:hidden">
          Menu
        </Button>
        {/* Topbar adalah satu-satunya judul halaman sekarang, jadi bobotnya dinaikkan
            ke text-display bold. Sebelumnya text-subtitle semibold, yang setelah judul
            besar dihapus jadi sama persis dengan judul panel dan menghilangkan hierarki. */}
        <h1 className="truncate text-display font-bold text-ink">{pageTitleFor(pathname)}</h1>
        <p className="hidden text-meta text-ink-soft sm:block">{WORKSPACE_NAME}</p>
      </div>

      <form action={logoutAction}>
        <Button type="submit" variant="ghost" size="sm" aria-label="Keluar dari portal admin">
          Keluar
        </Button>
      </form>
    </header>
  );
}
