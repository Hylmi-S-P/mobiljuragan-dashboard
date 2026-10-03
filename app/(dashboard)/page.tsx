import Link from "next/link";

import { DataNotice } from "@/components/ui/DataNotice";
import { PlateBadge } from "@/components/ui/PlateBadge";
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
import { IconArrowRight, IconCalendar, IconCar, IconInbox } from "@/components/ui/icons";
import { BOOKING_STATUS } from "@/lib/labels";
import { formatDateRange } from "@/lib/format";
import { BOOKINGS, SAMPLE_DATA_LABEL, VEHICLES, vehicleById } from "@/lib/mockData";

export default function OverviewPage() {
  const queue = BOOKINGS.filter((booking) => booking.status === "perlu_konfirmasi_tarif");
  const unitTersedia = VEHICLES.filter((vehicle) => vehicle.status === "tersedia");

  return (
    <>
      <ScreenHeader
        heading="Antrean pesanan butuh konfirmasi"
        subheading="Periksa tarif dan jadwal unit sebelum mengonfirmasi."
      />

      <DataNotice label={SAMPLE_DATA_LABEL}>
        Nomor booking, nama pemesan, dan status unit di layar ini berasal dari data contoh, bukan
        data operasional sungguhan.
      </DataNotice>

      <div className="mt-4">
        <Panel
          title="Pesanan menunggu konfirmasi"
          icon={<IconInbox />}
          action={
            queue.length > 0 ? (
              <span className="text-meta tabular-nums text-ink-soft">
                {queue.length} dari {BOOKINGS.length} pesanan
              </span>
            ) : null
          }
        >
          {queue.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-md border border-rule bg-canvas px-5 py-7">
              <span className="text-ink-soft">
                <IconInbox className="h-6 w-6" />
              </span>
              <div>
                <p className="text-body font-semibold text-ink">
                  Belum ada pesanan yang menunggu konfirmasi.
                </p>
                <p className="mt-1 text-meta text-ink-soft">
                  Buka daftar pesanan untuk memeriksa permintaan baru.
                </p>
              </div>
            </div>
          ) : (
            <Table caption="Booking yang menunggu konfirmasi tarif">
              <TableHead>
                <TableRow>
                  <TableHeaderCell className="w-[210px]">Pemesan</TableHeaderCell>
                  <TableHeaderCell className="w-[300px]">Kendaraan</TableHeaderCell>
                  <TableHeaderCell className="w-[180px]">Tanggal</TableHeaderCell>
                  <TableHeaderCell className="w-[180px]">Status</TableHeaderCell>
                  <TableHeaderCell className="w-[266px]">Aksi</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {queue.map((booking) => {
                  const vehicle = vehicleById(booking.vehicleId);
                  const status = BOOKING_STATUS[booking.status];
                  return (
                    <TableRow key={booking.id}>
                      <TableCell className="text-left">
                        <span className="block text-body font-semibold text-ink">
                          {booking.customerName}
                        </span>
                        <span className="mt-0.5 block text-micro text-ink-soft">
                          {booking.code}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="block text-body font-medium text-ink">{vehicle?.name}</span>
                        {vehicle ? (
                          <PlateBadge plate={vehicle.plate} className="mt-1" />
                        ) : null}
                      </TableCell>
                      <TableCell className="text-body tabular-nums">
                        {formatDateRange(booking.startDate, booking.endDate, booking.dayCount)}
                      </TableCell>
                      <TableCell>
                        <StatusChip tone={status.tone}>{status.label}</StatusChip>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/bookings/${booking.id}`}
                          className="inline-flex h-11 items-center gap-2 rounded-sm border border-rule-strong px-3.5 text-body font-medium text-ink hover:bg-canvas"
                        >
                          Detail &amp; Verifikasi
                          <IconArrowRight className="h-4 w-4" />
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

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-2">
        <Panel title="Status armada" icon={<IconCar />}>
          <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {unitTersedia.map((vehicle) => (
              <li key={vehicle.id} className="flex items-center gap-2.5 text-body text-ink">
                <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-teal" />
                {vehicle.name}
              </li>
            ))}
          </ul>

          <p className="mt-4 border-t border-row-line pt-3 text-meta text-ink-soft">
            Status unit diubah dari detail kendaraan di Katalog.
          </p>
        </Panel>

        <Panel title="Kalender armada" icon={<IconCalendar />}>
          <div className="flex flex-col items-start gap-3 rounded-md border border-rule bg-canvas px-5 py-7">
            <span className="text-ink-soft">
              <IconCalendar className="h-6 w-6" />
            </span>
            <div>
              <p className="text-body font-semibold text-ink">Jadwal operasional</p>
              <p className="mt-1 text-meta text-ink-soft">
                Belum ada jadwal armada untuk ditampilkan.
              </p>
            </div>
            <Link
              href="/fleet/calendar"
              className="inline-flex h-11 items-center gap-2 rounded-sm border border-rule-strong px-4 text-body font-medium text-ink hover:bg-surface"
            >
              Buka Kalender Armada
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Panel>
      </div>
    </>
  );
}
