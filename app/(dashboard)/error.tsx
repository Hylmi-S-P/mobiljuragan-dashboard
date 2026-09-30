"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <ErrorState
        cause="Data dashboard tidak berhasil dimuat."
        nextAction="Periksa koneksi lalu coba lagi."
        guidance="Jika masalah berlanjut, hubungi admin sistem."
        onRetry={reset}
      />
      {error.digest ? (
        <p className="mt-3 text-xs text-ink-soft">Kode kejadian untuk laporan: {error.digest}</p>
      ) : null}
    </>
  );
}
