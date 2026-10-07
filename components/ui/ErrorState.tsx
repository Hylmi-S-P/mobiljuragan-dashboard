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
      className="rounded-md border border-danger/40 bg-surface px-5 py-6"
    >
      <h2 className="text-display lg:text-display-lg font-semibold leading-tight text-ink">{heading}</h2>
      <p className="mt-3 text-subtitle font-semibold text-ink">{cause}</p>
      <p className="mt-1.5 max-w-2xl text-body text-ink-soft">{nextAction}</p>

      {onRetry ? (
        <Button variant="outline" size="md" className="mt-4" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}

      {guidance ? <p className="mt-5 text-body text-ink-soft">{guidance}</p> : null}
    </section>
  );
}
