import { BookingsTable } from "@/components/bookings/BookingsTable";
import { DataNotice } from "@/components/ui/DataNotice";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { SAMPLE_DATA_LABEL } from "@/lib/mockData";

export default function BookingsPage() {
  return (
    <>
      <ScreenHeader
        heading="Booking Masuk (Antrean Pelanggan)"
        subheading="Reservasi yang masuk dari aplikasi pelanggan. Cek kesiapan unit, tentukan tarif final, dan alokasikan supir."
      />

      <DataNotice label={SAMPLE_DATA_LABEL}>
        Nama pemesan, nomor booking, dan tanggal pada antrean ini adalah data contoh.
      </DataNotice>

      <div className="mt-4">
        <BookingsTable />
      </div>
    </>
  );
}
