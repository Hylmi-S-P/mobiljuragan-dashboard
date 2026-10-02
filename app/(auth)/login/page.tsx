import { LoginForm } from "@/components/auth/LoginForm";
import { VEHICLES } from "@/lib/mockData";

export default function LoginPage() {
  const plates = VEHICLES.map((vehicle) => vehicle.plate).join(", ");

  return (
    <main className="flex min-h-dvh items-center justify-center bg-canvas px-4 py-10">
      <div className="grid w-full max-w-[1120px] overflow-hidden rounded-lg border border-rule bg-surface lg:grid-cols-[480px_minmax(0,1fr)]">
        <section className="bg-navy px-10 py-11">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-md bg-teal px-3 py-2 text-body font-bold text-white">
              MobilJuragan
            </span>
            <span className="text-micro font-semibold uppercase text-on-navy-muted">
              Portal operasional
            </span>
          </div>

          <h2 className="mt-6 text-2xl font-bold leading-snug text-white">
            Portal Operasional &amp; Manajemen Armada
          </h2>
          <p className="mt-4 text-meta text-on-navy-muted">
            CV. Mobil Juragan Express Transport, Merauke, Papua Selatan
          </p>

          <div className="mt-8 rounded-md border border-navy-line bg-navy-surface p-4">
            <span className="inline-flex items-center rounded-sm bg-teal px-2 py-1 text-micro font-bold uppercase text-white">
              Armada Merauke
            </span>
            <p className="mt-3 text-body font-semibold text-white">
              Unit lepas kunci dan unit dengan supir
            </p>
            <p className="mt-2 text-meta text-on-navy-muted">
              Pusat kendali sewa: unit lepas kunci dan unit dengan supir.
            </p>

            <div className="mt-4 rounded-md border border-navy-line bg-navy-inset p-4">
              <p className="text-meta font-medium text-white">
                {VEHICLES.length} unit armada riil Merauke terdaftar
              </p>
              <p className="mt-2 text-micro text-on-navy-muted">Plat nomor: {plates}</p>
            </div>
          </div>
        </section>

        <section className="px-10 py-11">
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
