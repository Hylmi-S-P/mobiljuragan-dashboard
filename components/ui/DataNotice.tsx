import type { ReactNode } from "react";

/* Penanda data contoh. Dipakai di layar mana pun yang masih memakai lib/mockData.ts,
   supaya nilai sementara tidak terbaca sebagai data sungguhan. */
export function DataNotice({ label, children }: { label: string; children: ReactNode }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-sm border border-rule bg-surface px-3 py-2 text-meta text-ink-soft">
      <span className="font-medium text-ink">{label}</span>
      <span>{children}</span>
    </p>
  );
}
