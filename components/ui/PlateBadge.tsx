/**
 * Lencana plat nomor.
 *
 * Ini motif identitas yang sudah ditetapkan tim: plat nomor kendaraan sebagai
 * penanda visual yang berulang. Bentuknya mengikuti plat sungguhan, yaitu bidang putih dengan
 * bingkai gelap tipis, dan huruf serta angkanya dipisah supaya terbaca seperti plat asli
 * alih-alih kode acak. Datanya tetap apa adanya, tidak ada yang ditambah atau dikarang.
 */
type PlateBadgeProps = {
  plate: string;
  /** Keterangan wilayah, ditampilkan di luar bidang plat sebagai label kecil. */
  region?: string | null;
  size?: "sm" | "md";
  className?: string;
};

/** Memisah "PA1504G" menjadi ["PA", "1504", "G"] supaya terbaca seperti plat sungguhan. */
function pecahPlat(plate: string): string[] {
  const bersih = plate.trim().toUpperCase();
  const cocok = /^([A-Z]{1,2})\s?(\d{1,4})\s?([A-Z]{0,3})$/.exec(bersih);
  if (!cocok) return [bersih];
  return [cocok[1], cocok[2], cocok[3]].filter((bagian) => bagian.length > 0);
}

export function PlateBadge({ plate, region, size = "sm", className = "" }: PlateBadgeProps) {
  const bagian = pecahPlat(plate);
  const ukuran =
    size === "md" ? "gap-[4px] px-2 py-1 text-body" : "gap-[3px] px-1.5 py-[2px] text-meta";

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        className={`inline-flex items-baseline rounded-[4px] border-[1.5px] border-ink/80 bg-surface font-semibold tracking-[0.05em] text-ink tabular-nums ${ukuran}`}
      >
        {bagian.map((potongan) => (
          <span key={potongan}>{potongan}</span>
        ))}
      </span>
      {region ? <span className="text-micro text-ink-soft">{region}</span> : null}
    </span>
  );
}
