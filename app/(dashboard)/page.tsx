import type { Metadata } from "next";
import Link from "next/link";

import { PlateBadge } from "@/components/ui/PlateBadge";
import { Panel } from "@/components/ui/PageLayout";
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
import { getAllVehicles, getBookings } from "@/lib/operations";

export const metadata: Metadata = {
  title: "Ringkasan Operasional | MobilJuragan",
  description:
    "Ringkasan harian tim operasional MobilJuragan: pesanan yang menunggu konfirmasi dan status ketersediaan armada.",
};

// Ringkasan harus mencerminkan keadaan terkini, jadi dirender ulang tiap request.
export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const [bookings, vehicles] = await Promise.all([getBookings(), getAllVehicles()]);

  const queue = bookings.filter((booking) => booking.status === "perlu_konfirmasi_tarif");
  const unitTersedia = vehicles.filter((vehicle) => vehicle.status === "tersedia");
  const vehicleById = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle]));

  return (
    <>
      {/* Judul halaman sengaja tidak dipasang di sini: topbar sudah menampilkan
          "Dashboard" dan item menu sidebar memakai kata yang sama, sehingga judul
          besar ketiga hanya mengulang. Panel di bawah sudah menjelaskan isinya. */}
      <Panel
        title="Pesanan menunggu konfirmasi"
        icon={<IconInbox />}
        action={
          queue.length > 0 ? (
            <span className="text-meta tabular-nums text-ink-soft">
              {queue.length} dari {bookings.length} pesanan
            </span>
          ) : null
        }
      >
        {queue.length === 0 ? (
          <div className="flex flex-col items-start gap-2.5 rounded-md border border-rule bg-canvas px-4 py-5">
            <span className="text-ink-soft">
              <IconInbox className="h-5 w-5" />
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
                <TableHeaderCell className="w-[190px]">Pemesan</TableHeaderCell>
                <TableHeaderCell className="w-[270px]">Kendaraan</TableHeaderCell>
                <TableHeaderCell className="w-[160px]">Tanggal</TableHeaderCell>
                <TableHeaderCell className="w-[190px]">Status</TableHeaderCell>
                <TableHeaderCell className="w-[230px]">Aksi</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {queue.map((booking) => {
                const vehicle = vehicleById.get(booking.vehicleId);
                const status = BOOKING_STATUS[booking.status];
                return (
                  <TableRow key={booking.id}>
                    <TableCell className="text-left">
                      <span className="block text-body font-semibold text-ink">
                        {booking.customerName}
                      </span>
                      <span className="mt-0.5 block text-micro text-ink-soft">{booking.code}</span>
                    </TableCell>
                    <TableCell>
                      <span className="block text-body font-medium text-ink">{vehicle?.name}</span>
                      {vehicle ? <PlateBadge plate={vehicle.plate} className="mt-1" /> : null}
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

      <div className="mt-3 grid items-start gap-3 lg:grid-cols-2">
        <Panel title="Status armada" icon={<IconCar />}>
          {unitTersedia.length === 0 ? (
            <p className="rounded-md border border-rule bg-canvas px-4 py-5 text-meta text-ink-soft">
              Tidak ada unit yang berstatus tersedia saat ini.
            </p>
          ) : (
            <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {unitTersedia.map((vehicle) => (
                <li key={vehicle.id} className="flex items-center gap-2.5 text-body text-ink">
                  <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-teal" />
                  {vehicle.name}
                </li>
              ))}
            </ul>
          )}

          <p className="mt-3 border-t border-row-line pt-2.5 text-meta text-ink-soft">
            Status unit diubah dari detail kendaraan di Katalog.
          </p>
        </Panel>

        <Panel title="Kalender armada" icon={<IconCalendar />}>
          <div className="flex flex-col items-start gap-2.5 rounded-md border border-rule bg-canvas px-4 py-5">
            <span className="text-ink-soft">
              <IconCalendar className="h-5 w-5" />
            </span>
            <div>
              <p className="text-body font-semibold text-ink">Jadwal operasional</p>
              <p className="mt-1 text-meta text-ink-soft">
                Lihat jadwal pemakaian tiap unit pada rentang tanggal yang dipilih.
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
