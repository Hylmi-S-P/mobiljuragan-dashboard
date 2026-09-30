const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

function parseIsoDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month: month - 1, day };
}

/* Format tanggal ditulis manual supaya hasil server dan klien selalu identik. */
export function formatDateRange(startIso: string, endIso: string, dayCount: number): string {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  const sameMonth = start.month === end.month && start.year === end.year;
  const range = sameMonth
    ? `${start.day} - ${end.day} ${MONTHS[start.month]}`
    : `${start.day} ${MONTHS[start.month]} - ${end.day} ${MONTHS[end.month]}`;

  return `${range} ${end.year} (${dayCount} Hari)`;
}

export function formatCurrencyInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return "";
  return `Rp ${Number(digits).toLocaleString("id-ID")}`;
}
