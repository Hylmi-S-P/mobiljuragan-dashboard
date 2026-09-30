import type { ReactNode } from "react";

export type ChipTone = "available" | "busy" | "service" | "pending" | "neutral" | "danger";

const TONES: Record<ChipTone, string> = {
  available: "border-teal text-teal",
  busy: "border-navy text-navy",
  service: "border-rule-strong text-ink-soft",
  pending: "border-transparent bg-gold text-ink",
  neutral: "border-rule text-ink-soft",
  danger: "border-danger text-danger",
};

/* Status selalu membawa teks, tidak pernah hanya warna, supaya tetap terbaca
   oleh pengguna dengan gangguan penglihatan warna. */
export function StatusChip({ tone, children }: { tone: ChipTone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-2 py-1 text-xs font-medium ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
