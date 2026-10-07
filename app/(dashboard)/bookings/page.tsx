import type { Metadata } from "next";
import { BookingsTable } from "@/components/bookings/BookingsTable";
import { DataNotice } from "@/components/ui/DataNotice";
import { PageLead } from "@/components/ui/PageLayout";
import { getAllVehicles, getBookings } from "@/lib/operations";

export const metadata: Metadata = {
  title: "Pesanan Masuk | MobilJuragan",
  description:
    "Antrean pesanan sewa yang masuk dari aplikasi pelanggan MobilJuragan Merauke, siap diverifikasi tim operasional.",
};

// Antrean pesanan berubah setiap ada pemesanan baru, jadi data diambil segar tiap request.
export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const [bookings, vehicles] = await Promise.all([getBookings(), getAllVehicles()]);

  return (
    <>
      <PageLead lead="Pesanan yang masuk dari aplikasi pelanggan. Cek kesiapan unit, tentukan tarif final, dan alokasikan supir." />

      <DataNotice label="Antrean pesanan">
        Pesanan baru masuk dengan tarif belum ditentukan. Nomor kontak pelanggan ditampilkan apa
        adanya dari data pemesanan supaya tim bisa menghubungi pemesan.
      </DataNotice>

      <div className="mt-3">
        <BookingsTable initialBookings={bookings} vehicles={vehicles} />
      </div>
    </>
  );
}
