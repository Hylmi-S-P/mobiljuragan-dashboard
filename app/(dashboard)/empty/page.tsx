import type { Metadata } from "next";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLead } from "@/components/ui/PageLayout";

export const metadata: Metadata = {
  title: "Contoh Keadaan Kosong | MobilJuragan",
  description:
    "Rujukan tampilan saat belum ada data, dipakai konsisten di antrean pemesanan, kalender armada, dan customer care.",
};

export default function EmptyStatePage() {
  return (
    <>
      <PageLead lead="Halaman rujukan untuk keadaan belum ada data. Pola yang sama dipakai di antrean booking, kalender armada, dan percakapan customer care." />
      <EmptyState
        heading="Belum ada pesanan"
        cause="Belum ada permintaan booking yang masuk."
        nextAction="Booking baru akan muncul di antrean ini setelah pelanggan mengirim order."
        actionHref="/bookings"
        actionLabel="Buka daftar pesanan"
        guidance="Tidak ada metrik atau aktivitas tambahan sampai data nyata tersedia."
      />
    </>
  );
}
