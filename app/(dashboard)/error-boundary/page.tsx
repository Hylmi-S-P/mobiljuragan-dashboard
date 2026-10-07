"use client";

import { useRouter } from "next/navigation";

import { ErrorState } from "@/components/ui/ErrorState";

export default function ErrorBoundaryPage() {
  const router = useRouter();

  return (
    <ErrorState
      cause="Data dashboard tidak berhasil dimuat."
      nextAction="Periksa koneksi lalu coba lagi."
      guidance="Jika masalah berlanjut, hubungi admin sistem."
      onRetry={() => router.refresh()}
    />
  );
}
