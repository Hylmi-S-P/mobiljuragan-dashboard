import Link from "next/link";

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
import { BOOKING_STATUS, RENTAL_STATUS_ORDER, VEHICLE_STATUS } from "@/lib/labels";
import { formatDateRange } from "@/lib/format";
import { BOOKINGS, SAMPLE_DATA_LABEL, VEHICLES, vehicleById } from "@/lib/mockData";

export default function OverviewPage() {
  const queue = BOOKINGS.filter((booking) => booking.status === "perlu_konfirmasi_tarif");
  const fleetCounts = RENTAL_STATUS_ORDER.map((status) => ({
    status,
    count: VEHICLES.filter((vehicle) => vehicle.status === status).length,
  }));

  return (
    <>
      <ScreenHeader
        heading="Antrean booking butuh konfirmasi"
        subheading="Satu keputusan utama: booking mana yang perlu ditangani berikutnya."
      />

      <DataNotice label={SAMPLE_DATA_LABEL}>
        Nomor booking, nama pemesan, dan status unit di layar ini berasal dari data contoh, bukan
        data operasional sungguhan.
      </DataNotice>

      <div className="mt-4">
        <Panel title="Booking menunggu konfirmasi">
          {queue.length === 0 ? (
            <div className="rounded-sm border border-rule bg-canvas px-4 py-6">
              <p className="text-sm font-semibold text-ink">
                Belum ada booking yang menunggu konfirmasi.
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                Buka Booking Masuk untuk memeriksa permintaan baru.
              </p>
              <Link
                href="/bookings"
                className="mt-3 inline-flex h-11 items-center rounded-sm border border-rule-strong px-4 text-sm font-medium text-ink hover:bg-surface"
              >
                Buka Booking Masuk
              </Link>
            </div>
          ) : (
            <Table caption="Booking yang menunggu konfirmasi tarif">
              <TableHead>
                <TableRow>
                  <TableHeaderCell className="w-[220px]">Pemesan</TableHeaderCell>
                  <TableHeaderCell className="w-[270px]">Kendaraan</TableHeaderCell>
                  <TableHeaderCell className="w-[180px]">Tanggal</TableHeaderCell>
                  <TableHeaderCell className="w-[180px]">Status</TableHeaderCell>
                  <TableHeaderCell className="w-[286px]">Aksi</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {queue.map((booking) => {
                  const vehicle = vehicleById(booking.vehicleId);
                  const status = BOOKING_STATUS[booking.status];
                  return (
                    <TableRow key={booking.id}>
                      <TableCell className="font-semibold">{booking.customerName}</TableCell>
                      <TableCell>
                        <span className="font-semibold">{vehicle?.name}</span>
                        <span className="ml-1 text-ink-soft">({vehicle?.plate})</span>
                      </TableCell>
                      <TableCell>
                        {formatDateRange(booking.startDate, booking.endDate, booking.dayCount)}
                      </TableCell>
                      <TableCell>
                        <StatusChip tone={status.tone}>{status.label}</StatusChip>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/bookings/${booking.id}`}
                          className="inline-flex h-11 items-center rounded-sm border border-rule-strong px-3 text-sm font-medium text-ink hover:bg-canvas"
                        >
                          Detail &amp; Verifikasi
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Status armada">
          <ul className="flex flex-wrap gap-2">
            {fleetCounts.map(({ status, count }) => (
              <li key={status} className="flex items-center gap-2">
                <StatusChip tone={VEHICLE_STATUS[status].tone}>{VEHICLE_STATUS[status].label}</StatusChip>
                <span className="tabular-nums text-sm text-ink-soft">{count} unit</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink-soft">
            Status unit diubah dari detail kendaraan di Katalog &amp; CMS.
          </p>
        </Panel>

        <Panel title="Kalender armada">
          <p className="text-sm font-medium text-ink">Jadwal operasional</p>
          <p className="mt-2 text-sm text-ink-soft">Belum ada jadwal armada untuk ditampilkan.</p>
          <Link
            href="/fleet/calendar"
            className="mt-3 inline-flex h-11 items-center rounded-sm border border-rule-strong px-4 text-sm font-medium text-ink hover:bg-canvas"
          >
            Buka Kalender Armada
          </Link>
        </Panel>
      </div>
    </>
  );
}
