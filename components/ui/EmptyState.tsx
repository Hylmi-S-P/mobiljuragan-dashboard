import Link from "next/link";
import type { ReactNode } from "react";

type EmptyStateProps = {
  heading: string;
  cause: string;
  nextAction: string;
  actionHref?: string;
  actionLabel?: string;
  guidance?: string;
  children?: ReactNode;
};

/* Keadaan kosong wajib menyebut sebab dan satu langkah berikutnya,
   bukan sekadar kalimat "tidak ada data". */
export function EmptyState({
  heading,
  cause,
  nextAction,
  actionHref,
  actionLabel,
  guidance,
  children,
}: EmptyStateProps) {
  return (
    <section className="rounded-md border border-rule bg-surface px-6 py-8">
      <h2 className="text-[28px] font-semibold leading-tight text-ink">{heading}</h2>
      <p className="mt-4 text-lg font-semibold text-ink">{cause}</p>
      <p className="mt-2 max-w-2xl text-[15px] text-ink-soft">{nextAction}</p>

      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-5 inline-flex h-11 items-center rounded-sm border border-rule-strong px-4 text-sm font-medium text-ink hover:bg-canvas"
        >
          {actionLabel}
        </Link>
      ) : null}

      {children}

      {guidance ? <p className="mt-6 text-sm text-ink-soft">{guidance}</p> : null}
    </section>
  );
}
