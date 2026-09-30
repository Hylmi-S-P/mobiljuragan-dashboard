import { EmptyState } from "@/components/ui/EmptyState";
import { ScreenHeader } from "@/components/ui/ScreenHeader";

export default function EmptyStatePage() {
  return (
    <>
      <ScreenHeader
        heading="Contoh keadaan kosong"
        subheading="Halaman rujukan untuk keadaan belum ada data. Pola yang sama dipakai di antrean booking, kalender armada, dan percakapan customer care."
      />
      <EmptyState
        heading="Belum ada booking"
        cause="Belum ada permintaan booking yang masuk."
        nextAction="Booking baru akan muncul di antrean ini setelah pelanggan mengirim order."
        actionHref="/bookings"
        actionLabel="Buka Booking Masuk"
        guidance="Tidak ada metrik atau aktivitas tambahan sampai data nyata tersedia."
      />
    </>
  );
}
