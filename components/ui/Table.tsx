import type { ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";

/* Tabel lebar minimal 720px dan bergulir di dalam kontainernya sendiri,
   supaya halaman tidak pernah meluber horizontal di layar sempit. */
export function Table({ children, caption }: { children: ReactNode; caption: string }) {
  return (
    <div className="overflow-x-auto rounded-md border border-rule bg-surface">
      <table className="w-full min-w-[720px] border-collapse text-body">
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return <thead className="bg-canvas text-left text-meta font-medium text-ink-soft">{children}</thead>;
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-rule">{children}</tbody>;
}

export function TableRow({ children }: { children: ReactNode }) {
  return <tr className="align-middle">{children}</tr>;
}

export function TableHeaderCell({
  children,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement> & { children: ReactNode }) {
  return (
    <th scope="col" className="border-b border-rule px-4 py-3 font-medium" {...props}>
      {children}
    </th>
  );
}

export function TableCell({
  children,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & { children: ReactNode }) {
  return (
    <td className="px-4 py-3 text-ink" {...props}>
      {children}
    </td>
  );
}
