import { notFound } from "next/navigation";

import { BookingDecisionPanel } from "@/components/bookings/BookingDecisionPanel";
import { DataNotice } from "@/components/ui/DataNotice";
import { DataField, Panel, ScreenHeader } from "@/components/ui/ScreenHeader";
import { StatusChip } from "@/components/ui/StatusChip";
import { formatDateRange } from "@/lib/format";
import { BOOKING_STATUS, DRIVER_STATUS } from "@/lib/labels";
import {
  BOOKINGS,
  PRIVATE_FIELD_PLACEHOLDER,
  SAMPLE_DATA_LABEL,
  bookingById,
  vehicleById,
} from "@/lib/mockData";

export function generateStaticParams() {
  return BOOKINGS.map((booking) => ({ id: booking.id }));
}

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = bookingById(id);
  const vehicle = booking ? vehicleById(booking.vehicleId) : undefined;
  if (!booking || !vehicle) notFound();

  const isDriverService = booking.mode === "dengan_supir";
  const status = BOOKING_STATUS[booking.status];
  const customerLabel = booking.customerContext
    ? `${booking.customerName} (${booking.customerContext})`
    : booking.customerName;

  return (
    <>
      <ScreenHeader
        heading="Detail Pemesanan"
        subheading={`${booking.code} • ${isDriverService ? "Dengan Supir" : "Lepas Kunci"}`}
      />

      <DataNotice label={SAMPLE_DATA_LABEL}>
        Nomor WhatsApp, NIK, dan domisili pemesan belum diverifikasi sehingga ditampilkan sebagai
        placeholder.
      </DataNotice>

      <div className="mt-4 grid gap-6 lg:grid-cols-[688fr_424fr]">
        <div className="min-w-0">
          <Panel
            title="Informasi Pelanggan & Pemesanan"
            action={<StatusChip tone={status.tone}>{status.label}</StatusChip>}
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <DataField label={isDriverService ? "Nama pemesan / PIC" : "Nama lengkap"}>
                {customerLabel}
              </DataField>
              <DataField label="Nomor WhatsApp">{PRIVATE_FIELD_PLACEHOLDER}</DataField>
              <DataField label="Durasi sewa">
                {formatDateRange(booking.startDate, booking.endDate, booking.dayCount)}
              </DataField>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {isDriverService ? (
                <div className="min-w-0">
                  <p className="text-micro font-bold uppercase text-ink-soft">Supir bertugas</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="truncate text-meta font-medium text-ink">
                      {booking.driverName}
                    </span>
                    {booking.driverStatus ? (
                      <StatusChip tone={DRIVER_STATUS[booking.driverStatus].tone}>
                        {DRIVER_STATUS[booking.driverStatus].label}
                      </StatusChip>
                    ) : null}
                  </div>
                </div>
              ) : (
                <DataField label="NIK KTP resmi">{PRIVATE_FIELD_PLACEHOLDER}</DataField>
              )}

              {isDriverService ? (
                <DataField label="Titik jemput & rute">{booking.pickupRoute}</DataField>
              ) : (
                <DataField label="Domisili pelanggan">{PRIVATE_FIELD_PLACEHOLDER}</DataField>
              )}

              <DataField label="Jenis layanan">{booking.serviceType}</DataField>
            </div>
          </Panel>
        </div>

        <div className="min-w-0">
          <BookingDecisionPanel booking={booking} vehicle={vehicle} />
        </div>
      </div>
    </>
  );
}
