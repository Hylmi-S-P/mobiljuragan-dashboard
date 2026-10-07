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
    <main className="flex min-h-dvh items-center justify-center bg-inset px-4 py-6">
      <div className="grid w-full max-w-[1008px] overflow-hidden rounded-lg border border-rule bg-surface lg:min-h-[648px] lg:grid-cols-[432px_minmax(0,1fr)] lg:rounded-[18px]">
        <section className="bg-navy px-6 py-8 lg:px-9 lg:py-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex h-[31px] w-[126px] items-center justify-center rounded-md bg-teal text-[13.5px] font-bold text-white">
              MobilJuragan
            </span>
            <span className="text-micro font-semibold uppercase text-on-navy-muted">
              Portal operasional
            </span>
          </div>

          <h2 className="mt-5 text-[21.5px] font-bold leading-[1.2] text-white">
            Portal Operasional &amp; Manajemen Armada
          </h2>
          <p className="mt-2 text-[11.5px] leading-[1.45] text-on-navy-muted">
            CV. Mobil Juragan Express Transport • Merauke, Papua Selatan
          </p>

          <div className="mt-3 rounded-md border border-navy-line bg-navy-surface p-3 lg:min-h-[234px]">
            <span className="inline-flex items-center rounded-sm bg-teal px-2 py-0.5 text-micro font-bold uppercase text-white">
              Armada Merauke
            </span>
            <p className="mt-2 text-[13px] font-semibold text-white">
              Toyota All New Avanza &amp; Hilux 4x4
            </p>
            <p className="mt-1 text-[11.5px] leading-[1.45] text-on-navy-muted">
              Pusat Kendali Rental: Unit Lepas Kunci &amp; Driver
            </p>

            <div className="mt-3 rounded-md border border-navy-line bg-navy-inset p-3">
              <p className="text-[11.5px] font-medium text-white">
                {vehicles.length} unit armada riil Merauke terdaftar
              </p>
              <p className="mt-1 text-micro text-on-navy-muted">Plat nomor: {plates}</p>
            </div>
          </div>
        </section>

        <section className="px-6 py-8 lg:px-[54px] lg:py-[63px]">
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
