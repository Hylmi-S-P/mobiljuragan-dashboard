"use client";

import { useRouter } from "next/navigation";

import { ErrorState } from "@/components/ui/ErrorState";
import { ScreenHeader } from "@/components/ui/ScreenHeader";

export default function ErrorBoundaryPage() {
  const router = useRouter();

  return (
    <>
      <ScreenHeader
        heading="Contoh keadaan galat"
        subheading="Tampilan ini juga dipakai oleh batas galat dashboard: kalau sebuah halaman gagal dirender, keadaan ini yang muncul beserta tombol coba lagi."
      />
      <ErrorState
        cause="Data dashboard tidak berhasil dimuat."
        nextAction="Periksa koneksi lalu coba lagi."
        guidance="Jika masalah berlanjut, hubungi admin sistem."
        onRetry={() => router.refresh()}
      />
    </>
  );
}
