"use client";

import { useState } from "react";

import { ManualSurchargeModal } from "@/components/modals/ManualSurchargeModal";
import { Button } from "@/components/ui/Button";
import { StatusChip } from "@/components/ui/StatusChip";
import { AMOUNT_PLACEHOLDER, TARIFF_PENDING_NOTE } from "@/lib/mockData";
import { BOOKING_STATUS, DRIVER_STATUS } from "@/lib/labels";
import type { Booking, BookingStatus, LineItem, Vehicle } from "@/lib/types";

export function BookingDecisionPanel({ booking, vehicle }: { booking: Booking; vehicle: Vehicle }) {
  const [items, setItems] = useState<LineItem[]>(booking.lineItems);
  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [surchargeOpen, setSurchargeOpen] = useState(false);
  const canDecide = status === "perlu_konfirmasi_tarif" || status === "perlu_alokasi_sopir";
  const statusMeta = BOOKING_STATUS[status];

  function applySurcharge(item: LineItem) {
    setItems((current) => [...current, item]);
    setSurchargeOpen(false);
  }

  return (
    <section className="rounded-md border border-rule bg-surface">
      <div className="border-b border-rule px-5 py-4">
        <h3 className="text-body font-semibold text-ink">Armada &amp; Rincian Pembayaran</h3>
      </div>

      <div className="space-y-4 px-5 py-4">
        <div className="flex items-start gap-4 rounded-sm border border-rule bg-canvas p-3">
          <div className="flex h-16 w-[72px] shrink-0 items-center justify-center rounded-sm border border-rule bg-surface text-micro text-ink-soft">
            [Foto unit]
          </div>
          <div className="min-w-0">
            <p className="text-meta font-semibold text-ink">{vehicle.name}</p>
            <p className="mt-1 text-micro text-ink-soft">Plat {vehicle.plate}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <StatusChip tone={booking.driverStatus ? "available" : "neutral"}>
                {vehicle.status === "tersedia" ? "Unit siap di pool" : "Perlu cek unit"}
              </StatusChip>
              {booking.driverName && booking.driverStatus ? (
                <StatusChip tone={DRIVER_STATUS[booking.driverStatus].tone}>
                  {`Supir ${DRIVER_STATUS[booking.driverStatus].label}`}
                </StatusChip>
              ) : null}
            </div>
          </div>
        </div>

        <div>
          <p className="text-micro font-bold uppercase text-ink-soft">
            Rincian tagihan &amp; penyesuaian biaya
          </p>
          <ul className="mt-3 divide-y divide-rule">
            {items.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-4 py-2">
                <span className="min-w-0">
                  <span className="block text-meta text-ink">{item.label}</span>
                  {item.note ? (
                    <span className="mt-1 block text-micro text-ink-soft">{item.note}</span>
                  ) : null}
                </span>
                <span className="tabular-nums shrink-0 text-meta font-semibold text-ink">
                  {item.amount ?? AMOUNT_PLACEHOLDER}
                </span>
              </li>
            ))}
          </ul>
          {canDecide ? (
            <Button variant="outline" className="mt-3" onClick={() => setSurchargeOpen(true)}>
              + Tambah Surcharge Manual
            </Button>
          ) : null}
        </div>

        <div className="rounded-sm border border-rule bg-canvas px-4 py-3">
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-micro font-bold uppercase text-ink-soft">
              Total tagihan bersih
            </span>
            <span className="text-subtitle font-bold text-ink">{AMOUNT_PLACEHOLDER}</span>
          </div>
          <p className="mt-1 text-micro text-ink-soft">{TARIFF_PENDING_NOTE}</p>
        </div>

        {canDecide ? (
          <div className="space-y-3">
            <Button
              variant="confirm"
              size="md"
              className="w-full"
              onClick={() => setStatus("tarif_terkonfirmasi")}
            >
              {booking.mode === "dengan_supir"
                ? "Konfirmasi Tarif & Alokasi Supir"
                : "Konfirmasi Tarif & Setujui Booking"}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setStatus("ditolak")}>
              Tolak Permintaan Sewa
            </Button>
          </div>
        ) : (
          <div className="rounded-sm border border-rule bg-canvas px-4 py-3">
            <p className="text-meta font-medium text-ink">
              {status === "ditolak"
                ? "Permintaan sewa ditolak. Status tersimpan di perangkat ini saja sampai backend tersambung."
                : "Tarif sudah dikonfirmasi. Perubahan tarif berikutnya lewat penyesuaian biaya baru."}
            </p>
          </div>
        )}

        <p className="text-micro text-ink-soft">
          Status booking sekarang: <StatusChip tone={statusMeta.tone}>{statusMeta.label}</StatusChip>{" "}
          &middot; Status pada siklus backend: {statusMeta.canonical}
        </p>
      </div>

      {surchargeOpen ? (
        <ManualSurchargeModal
          onClose={() => setSurchargeOpen(false)}
          onApply={applySurcharge}
          booking={booking}
        />
      ) : null}
    </section>
  );
}
