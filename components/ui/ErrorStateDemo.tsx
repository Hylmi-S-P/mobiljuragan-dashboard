"use client";

import { useRouter } from "next/navigation";

import { ErrorState } from "@/components/ui/ErrorState";

/* Contoh pemakaian ErrorState di dalam sebuah halaman.
   Dipisah sebagai Client Component sendiri supaya halaman yang memakainya tetap
   berupa Server Component, sehingga judul halaman bisa ditentukan lewat metadata. */
export function ErrorStateDemo() {
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
