import type { ReactNode } from "react";

export function ScreenHeader({
  heading,
  subheading,
}: {
  heading: string;
  subheading?: string;
}) {
  return (
    <div className="mb-7">
      <h2 className="text-display font-bold text-ink lg:text-display-lg">{heading}</h2>
      {subheading ? (
        <p className="mt-3 max-w-[68ch] text-body text-ink-soft">{subheading}</p>
      ) : null}
    </div>
  );
}

export function Panel({
  title,
  icon,
  action,
  children,
  className = "",
}: {
  title?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-lg border border-rule bg-surface shadow-card ${className}`}>
      {title || action ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-5 py-3.5">
          <div className="flex min-w-0 items-center gap-2.5">
            {icon ? <span className="shrink-0 text-teal">{icon}</span> : null}
            {title ? <h3 className="text-subtitle font-semibold text-ink">{title}</h3> : null}
          </div>
          {action}
        </div>
      ) : null}
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

/* Label data kecil di kartu detail. Huruf kapital dipakai sebagai penanda kolom data,
   dengan jarak antarhuruf tipis supaya terbaca sebagai label, bukan sebagai teriakan. */
export function DataField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-micro font-semibold uppercase text-ink-soft">{label}</p>
      <p className="mt-1.5 truncate text-meta font-medium text-ink tabular-nums">{children}</p>
    </div>
  );
}
