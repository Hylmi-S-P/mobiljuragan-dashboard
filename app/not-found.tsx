import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-4 py-12 text-center">
      <div className="max-w-md rounded-lg border border-rule bg-surface p-8 shadow-xs">
        <span className="inline-block rounded-md bg-teal px-3 py-1 text-meta font-bold text-white">
          404 Not Found
        </span>
        <h1 className="mt-4 text-display font-bold text-ink">Halaman Tidak Ditemukan</h1>
        <p className="mt-2 text-body text-ink-soft">
          Halaman atau data yang Anda cari tidak tersedia di sistem portal operasional MobilJuragan.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-sm bg-teal px-4 text-body font-medium text-white transition-colors hover:bg-teal/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
