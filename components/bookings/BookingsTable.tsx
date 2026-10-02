"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { PlateBadge } from "@/components/ui/PlateBadge";
import { Panel } from "@/components/ui/ScreenHeader";
import { StatusChip } from "@/components/ui/StatusChip";
import { IconArrowRight } from "@/components/ui/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import { formatDateRange } from "@/lib/format";
import { BOOKING_MODE_LABEL, BOOKING_STATUS } from "@/lib/labels";
import { BOOKINGS, vehicleById } from "@/lib/mockData";
import type { BookingStatus } from "@/lib/types";

/* Label aksi mengikuti nama status pada siklus hidup backend. */
const ACTION_LABEL: Record<BookingStatus, string> = {
  perlu_konfirmasi_tarif: "Detail & Verifikasi",
  perlu_alokasi_sopir: "Detail & Verifikasi",
  tarif_terkonfirmasi: "Cek Status Pesanan",
  ditolak: "Lihat Alasan Penolakan",
};

export function BookingsTable() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"semua" | BookingStatus>("semua");

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return BOOKINGS.filter((booking) => {
      if (status !== "semua" && booking.status !== status) return false;
      if (keyword.length === 0) return true;
      const vehicle = vehicleById(booking.vehicleId);
      return [
        booking.customerName,
        booking.customerContext ?? "",
        booking.code,
        vehicle?.name ?? "",
        vehicle?.plate ?? "",
      ].some((field) => field.toLowerCase().includes(keyword));
    });
  }, [query, status]);

  function resetFilters() {
    setQuery("");
    setStatus("semua");
  }

  return (
    <Panel>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor="booking-search" className="block text-meta font-medium text-ink">
            Cari pemesan, kode booking, atau plat
          </label>
          <input
            id="booking-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Contoh: Maria, BK-MRK, PA8593GZ"
            className="mt-1 h-11 w-full rounded-sm border border-rule-strong bg-canvas px-3 text-body text-ink"
          />
        </div>
        <div className="sm:w-64">
          <label htmlFor="booking-status" className="block text-meta font-medium text-ink">
            Status pesanan
          </label>
          <select
            id="booking-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as "semua" | BookingStatus)}
            className="mt-1 h-11 w-full rounded-sm border border-rule-strong bg-canvas px-3 text-body text-ink"
          >
            <option value="semua">Semua status</option>
            {Object.entries(BOOKING_STATUS).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-sm border border-rule bg-canvas px-4 py-6">
          <p className="text-body font-semibold text-ink">
            Tidak ada pesanan yang cocok dengan filter itu.
          </p>
          <p className="mt-1 text-body text-ink-soft">
            Kosongkan kata kunci atau pilih semua status untuk melihat seluruh antrean.
          </p>
          <Button variant="outline" className="mt-3" onClick={resetFilters}>
            Bersihkan filter
          </Button>
        </div>
      ) : (
        <Table caption="Antrean pesanan pelanggan">
          <TableHead>
            <TableRow>
              <TableHeaderCell className="w-[220px]">Pemesan</TableHeaderCell>
              <TableHeaderCell className="w-[256px]">Kendaraan</TableHeaderCell>
              <TableHeaderCell className="w-[180px]">Tanggal</TableHeaderCell>
              <TableHeaderCell className="w-[180px]">Status</TableHeaderCell>
              <TableHeaderCell className="w-[300px]">Aksi</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((booking) => {
              const vehicle = vehicleById(booking.vehicleId);
              const statusMeta = BOOKING_STATUS[booking.status];
              return (
                <TableRow key={booking.id}>
                  <TableCell>
                    <span className="block text-body font-semibold text-ink">
                      {booking.customerName}
                    </span>
                    <span className="mt-0.5 block text-micro text-ink-soft">
                      {booking.code} &bull; {BOOKING_MODE_LABEL[booking.mode]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="block text-body font-medium text-ink">{vehicle?.name}</span>
                    {vehicle ? <PlateBadge plate={vehicle.plate} className="mt-1" /> : null}
                  </TableCell>
                  <TableCell className="text-body tabular-nums">
                    {formatDateRange(booking.startDate, booking.endDate, booking.dayCount)}
                  </TableCell>
                  <TableCell>
                    <StatusChip tone={statusMeta.tone}>{statusMeta.label}</StatusChip>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/bookings/${booking.id}`}
                      className="inline-flex h-11 items-center gap-2 rounded-sm border border-rule-strong px-3.5 text-body font-medium text-ink hover:bg-canvas"
                    >
                      {ACTION_LABEL[booking.status]}
                      <IconArrowRight className="h-4 w-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <div className="mt-4 space-y-2">
        <p className="text-meta text-ink-soft">
          Staf memverifikasi KTP dan SIM A asli secara fisik saat serah terima unit di pool.
        </p>
        <p className="text-body font-medium text-ink">
          Aksi operasional: buka detail pemesanan, tentukan tarif final dan surcharge, alokasikan
          supir resmi, atau tolak reservasi.
        </p>
      </div>
    </Panel>
  );
}
