import { DataNotice } from "@/components/ui/DataNotice";
import { Panel, ScreenHeader } from "@/components/ui/ScreenHeader";
import { StatusChip } from "@/components/ui/StatusChip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import { formatDateRange } from "@/lib/format";
import { RENTAL_STATUS_ORDER, VEHICLE_STATUS } from "@/lib/labels";
import { BOOKINGS, SAMPLE_DATA_LABEL, VEHICLES } from "@/lib/mockData";

export default function FleetCalendarPage() {
  /* Tanggal terblokir hanya untuk booking yang sudah dikonfirmasi, sesuai siklus hidup backend. */
  const confirmed = BOOKINGS.filter((booking) => booking.status === "tarif_terkonfirmasi");

  return (
    <>
      <ScreenHeader
        heading="Manajemen Armada • Kalender Armada"
        subheading="Riwayat ketersediaan unit, jadwal sewa aktif, dan pesanan harian armada."
      />

      <DataNotice label={SAMPLE_DATA_LABEL}>
        Jadwal di tabel ini dihitung dari booking yang sudah dikonfirmasi. Booking yang masih
        menunggu konfirmasi belum mengunci tanggal, jadi barisnya masih kosong.
      </DataNotice>

      <div className="mt-4">
        <Panel title="Status yang digunakan">
          <ul className="flex flex-wrap gap-3">
            {RENTAL_STATUS_ORDER.map((status) => (
              <li key={status}>
                <StatusChip tone={VEHICLE_STATUS[status].tone}>
                  {VEHICLE_STATUS[status].label}
                </StatusChip>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-4">
        <Panel>
          <Table caption="Kalender ketersediaan sembilan unit armada">
            <TableHead>
              <TableRow>
                <TableHeaderCell className="w-[330px]">Kendaraan</TableHeaderCell>
                <TableHeaderCell className="w-[280px]">Tanggal</TableHeaderCell>
                <TableHeaderCell className="w-[300px]">Ketersediaan</TableHeaderCell>
                <TableHeaderCell className="w-[186px]">Status</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {VEHICLES.map((vehicle) => {
                const booking = confirmed.find((item) => item.vehicleId === vehicle.id);
                return (
                  <TableRow key={vehicle.id}>
                    <TableCell className="text-left font-medium">
                      {vehicle.name} <span className="text-ink-soft">· {vehicle.plate}</span>
                    </TableCell>
                    <TableCell className={booking ? "text-ink" : "text-ink-soft"}>
                      {booking
                        ? formatDateRange(booking.startDate, booking.endDate, booking.dayCount)
                        : "Belum ada jadwal"}
                    </TableCell>
                    <TableCell className={booking ? "text-ink" : "text-ink-soft"}>
                      {booking ? `Terblokir untuk ${booking.code}` : "Menunggu pembaruan"}
                    </TableCell>
                    <TableCell>
                      <StatusChip tone={VEHICLE_STATUS[vehicle.status].tone}>
                        {VEHICLE_STATUS[vehicle.status].label}
                      </StatusChip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Panel>
      </div>
    </>
  );
}
