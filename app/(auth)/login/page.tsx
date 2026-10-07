import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { getAllVehicles } from "@/lib/operations";

export const metadata: Metadata = {
  title: "Masuk Portal | MobilJuragan",
  description:
    "Masuk ke portal operasional dan manajemen armada CV. Mobil Juragan Express Transport Merauke.",
};

// Jumlah dan plat armada diambil dari database supaya informasi di halaman masuk
// ikut berubah saat armada bertambah, bukan angka yang ditulis tetap di komponen.
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const vehicles = await getAllVehicles();
  const plates = vehicles.map((vehicle) => vehicle.plate).join(", ");

  return (
    <main className="flex min-h-dvh items-center justify-center bg-inset px-4 py-8">
      <div className="grid w-full max-w-[1120px] overflow-hidden rounded-lg border border-rule bg-surface lg:min-h-[720px] lg:grid-cols-[480px_minmax(0,1fr)] lg:rounded-[20px]">
        <section className="bg-navy px-6 py-8 lg:px-10 lg:py-11">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex h-[34px] w-[140px] items-center justify-center rounded-md bg-teal text-[15px] font-bold text-white">
              MobilJuragan
            </span>
            <span className="text-micro font-semibold uppercase text-on-navy-muted">
              Portal operasional
            </span>
          </div>

          <h2 className="mt-6 text-[24px] font-bold leading-[1.2] text-white">
            Portal Operasional &amp; Manajemen Armada
          </h2>
          <p className="mt-2 text-meta text-on-navy-muted">
            CV. Mobil Juragan Express Transport • Merauke, Papua Selatan
          </p>

          <div className="mt-3 rounded-md border border-navy-line bg-navy-surface p-3.5 lg:min-h-[260px]">
            <span className="inline-flex items-center rounded-sm bg-teal px-2 py-0.5 text-micro font-bold uppercase text-white">
              Armada Merauke
            </span>
            <p className="mt-2.5 text-body font-semibold text-white">
              Toyota All New Avanza &amp; Hilux 4x4
            </p>
            <p className="mt-1.5 text-meta text-on-navy-muted">
              Pusat Kendali Rental: Unit Lepas Kunci &amp; Driver
            </p>

            <div className="mt-3.5 rounded-md border border-navy-line bg-navy-inset p-3.5">
              <p className="text-meta font-medium text-white">
                {vehicles.length} unit armada riil Merauke terdaftar
              </p>
              <p className="mt-1.5 text-micro text-on-navy-muted">Plat nomor: {plates}</p>
            </div>
          </div>
        </section>

        <section className="px-6 py-8 lg:px-[60px] lg:py-[70px]">
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
