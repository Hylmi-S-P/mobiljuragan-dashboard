import type { Metadata } from "next";

/*
 * Halaman ini Client Component (butuh useRouter), sehingga tidak bisa mengekspor
 * `metadata` sendiri. Judul halaman dipasang lewat layout rute ini.
 */
export const metadata: Metadata = {
  title: "Contoh Error Boundary | MobilJuragan",
  description:
    "Rujukan tampilan saat terjadi kegagalan memuat data, dipakai konsisten di seluruh modul dashboard.",
};

export default function ErrorBoundaryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
