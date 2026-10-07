import type { ReactNode } from "react";

/* Keterangan asal data. Dipakai di layar mana pun untuk menyatakan dari mana datanya
   dimuat dan apa yang belum diverifikasi, supaya nilai sementara tidak terbaca sebagai
   data sungguhan. */
export function DataNotice({ label, children }: { label: string; children: ReactNode }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-sm border border-rule bg-surface px-3 py-1.5 text-meta text-ink-soft">
      <span className="font-medium text-ink">{label}</span>
      <span>{children}</span>
    </p>
  );
}
