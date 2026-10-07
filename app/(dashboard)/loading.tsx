export default function DashboardLoading() {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="rounded-md border border-rule bg-surface px-5 py-6"
    >
      <h2 className="text-display lg:text-display-lg font-semibold leading-tight text-ink">
        Memuat data dashboard
      </h2>
      <p className="mt-2.5 max-w-2xl text-body text-ink-soft">
        Mengambil data untuk halaman ini. Tampilan akan berganti begitu datanya siap.
      </p>
    </section>
  );
}
