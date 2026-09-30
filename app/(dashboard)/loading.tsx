export default function DashboardLoading() {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="rounded-md border border-rule bg-surface px-6 py-8"
    >
      <h2 className="text-[28px] font-semibold leading-tight text-ink">Memuat data dashboard</h2>
      <p className="mt-3 max-w-2xl text-[15px] text-ink-soft">
        Mengambil data untuk halaman ini. Tampilan akan berganti begitu datanya siap.
      </p>
    </section>
  );
}
