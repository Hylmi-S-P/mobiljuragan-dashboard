"use client";

import { Button } from "@/components/ui/Button";

type ErrorStateProps = {
  heading?: string;
  cause: string;
  nextAction: string;
  guidance?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

/* Keadaan galat menyebut apa yang gagal dan langkah berikutnya, lalu memberi
   satu tombol yang benar-benar mencoba ulang. */
export function ErrorState({
  heading = "Gagal memuat data",
  cause,
  nextAction,
  guidance,
  onRetry,
  retryLabel = "Coba lagi",
}: ErrorStateProps) {
  return (
    <section
      role="alert"
      className="rounded-md border border-danger/40 bg-surface px-6 py-8"
    >
      <h2 className="text-[28px] font-semibold leading-tight text-ink">{heading}</h2>
      <p className="mt-4 text-lg font-semibold text-ink">{cause}</p>
      <p className="mt-2 max-w-2xl text-[15px] text-ink-soft">{nextAction}</p>

      {onRetry ? (
        <Button variant="outline" size="md" className="mt-5" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}

      {guidance ? <p className="mt-6 text-sm text-ink-soft">{guidance}</p> : null}
    </section>
  );
}
