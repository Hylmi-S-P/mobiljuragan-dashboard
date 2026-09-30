import type { ReactNode } from "react";

export function ScreenHeader({
  heading,
  subheading,
}: {
  heading: string;
  subheading?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-[28px] font-semibold leading-tight text-ink">{heading}</h2>
      {subheading ? (
        <p className="mt-2 max-w-3xl text-base text-ink-soft">{subheading}</p>
      ) : null}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-md border border-rule bg-surface ${className}`}>
      {title || action ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-5 py-4">
          {title ? <h3 className="text-lg font-semibold text-ink">{title}</h3> : <span />}
          {action}
        </div>
      ) : null}
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

/* Label data kecil di kartu detail. Huruf kapital dipakai sebagai penanda kolom data,
   tanpa jarak antarhuruf lebar, sesuai aturan tipografi berkas token. */
export function DataField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase text-ink-soft">{label}</p>
      <p className="mt-1 truncate text-[13px] font-medium text-ink">{children}</p>
    </div>
  );
}
