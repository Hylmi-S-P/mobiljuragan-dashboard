import type { Metadata } from "next";

import { ErrorStateDemo } from "@/components/ui/ErrorStateDemo";

export const metadata: Metadata = {
  title: "Contoh Error Boundary | MobilJuragan",
  description:
    "Rujukan tampilan saat halaman gagal dimuat, lengkap dengan tombol coba lagi untuk memuat ulang data.",
};

export default function ErrorBoundaryPage() {
  return <ErrorStateDemo />;
}
