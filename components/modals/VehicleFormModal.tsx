"use client";

import { useId, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  BOOKING_MODE_LABEL,
  VEHICLE_CATEGORY_OPTIONS,
  VEHICLE_SEAT_OPTIONS,
  VEHICLE_TRANSMISSION_OPTIONS,
} from "@/lib/labels";
import type { BookingMode, Vehicle, VehicleStatus } from "@/lib/types";

type Props = {
  vehicle?: Vehicle;
  existingPlates: string[];
  onClose: () => void;
  onSave: (vehicle: Vehicle) => void;
};

const STATUS_OPTIONS: { value: VehicleStatus; label: string }[] = [
  { value: "tersedia", label: "Tersedia" },
  { value: "servis", label: "Servis" },
  { value: "tidak_tersedia", label: "Tidak Tersedia" },
];

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export function VehicleFormModal({ vehicle, existingPlates, onClose, onSave }: Props) {
  const fieldId = useId();
  const [name, setName] = useState(vehicle?.name ?? "");
  const [plate, setPlate] = useState(vehicle?.plate ?? "");
  const [category, setCategory] = useState(vehicle?.category ?? VEHICLE_CATEGORY_OPTIONS[0]);
  const [transmission, setTransmission] = useState(
    vehicle?.transmission ?? VEHICLE_TRANSMISSION_OPTIONS[0],
  );
  const [seats, setSeats] = useState(vehicle?.seats ?? VEHICLE_SEAT_OPTIONS[2]);
  const [usage, setUsage] = useState(vehicle?.usage ?? "");
  const [status, setStatus] = useState<VehicleStatus>(vehicle?.status ?? "tersedia");
  const [modes, setModes] = useState<BookingMode[]>(
    vehicle?.allowedModes ?? ["lepas_kunci", "dengan_supir"],
  );
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function toggleMode(mode: BookingMode) {
    setModes((current) =>
      current.includes(mode) ? current.filter((item) => item !== mode) : [...current, mode],
    );
  }

  function handlePhoto(file: File | undefined) {
    if (!file) {
      setPhotoName(null);
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setErrors((current) => ({ ...current, photo: "Ukuran berkas melebihi 5 MB." }));
      setPhotoName(null);
      return;
    }
    setErrors((current) => {
      if (!current.photo) return current;
      const next = { ...current };
      delete next.photo;
      return next;
    });
    setPhotoName(file.name);
  }

  function handleSave() {
    const nextErrors: Record<string, string> = {};
    if (name.trim().length === 0) nextErrors.name = "Nama model kendaraan wajib diisi.";
    const normalizedPlate = plate.trim().toUpperCase();
    if (normalizedPlate.length === 0) nextErrors.plate = "Nomor plat wajib diisi.";
    else if (existingPlates.some((item) => item.toUpperCase() === normalizedPlate)) {
      nextErrors.plate = "Plat ini sudah dipakai unit lain di katalog.";
    }
    if (modes.length === 0) nextErrors.modes = "Pilih minimal satu moda rental yang diizinkan.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave({
      id: vehicle?.id ?? `v-${Date.now()}`,
      name: name.trim().toUpperCase(),
      plate: normalizedPlate,
      status,
      category,
      transmission,
      seats,
      usage: usage.trim().length > 0 ? usage.trim() : null,
      allowedModes: modes,
    });
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={vehicle ? "Edit Spesifikasi Armada" : "Tambah Armada Baru"}
      description="Lengkapi spesifikasi unit untuk ditampilkan pada katalog pelanggan aplikasi MobilJuragan."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button variant="confirm" onClick={handleSave}>
            Simpan ke Katalog
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor={`${fieldId}-name`} className="block text-[13px] font-medium text-ink">
            Nama lengkap model kendaraan
          </label>
          <input
            id={`${fieldId}-name`}
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${fieldId}-name-error` : undefined}
            className="mt-1 h-11 w-full rounded-sm border border-rule-strong bg-canvas px-3 text-sm text-ink"
            placeholder="Contoh: AVANZA G PUTIH"
          />
          {errors.name ? (
            <p id={`${fieldId}-name-error`} className="mt-1 text-xs text-danger">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${fieldId}-plate`} className="block text-[13px] font-medium text-ink">
            Nomor plat kendaraan (Merauke)
          </label>
          <input
            id={`${fieldId}-plate`}
            value={plate}
            onChange={(event) => setPlate(event.target.value)}
            aria-invalid={Boolean(errors.plate)}
            aria-describedby={errors.plate ? `${fieldId}-plate-error` : undefined}
            className="tabular-nums mt-1 h-11 w-full rounded-sm border border-rule-strong bg-canvas px-3 text-sm text-ink"
            placeholder="Contoh: PS1692B"
          />
          {errors.plate ? (
            <p id={`${fieldId}-plate-error`} className="mt-1 text-xs text-danger">
              {errors.plate}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor={`${fieldId}-category`} className="block text-[13px] font-medium text-ink">
              Kategori armada
            </label>
            <select
              id={`${fieldId}-category`}
              value={category ?? ""}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-1 h-11 w-full rounded-sm border border-rule-strong bg-canvas px-3 text-sm text-ink"
            >
              {VEHICLE_CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor={`${fieldId}-transmission`}
              className="block text-[13px] font-medium text-ink"
            >
              Tipe transmisi
            </label>
            <select
              id={`${fieldId}-transmission`}
              value={transmission ?? ""}
              onChange={(event) => setTransmission(event.target.value)}
              className="mt-1 h-11 w-full rounded-sm border border-rule-strong bg-canvas px-3 text-sm text-ink"
            >
              {VEHICLE_TRANSMISSION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={`${fieldId}-seats`} className="block text-[13px] font-medium text-ink">
              Kapasitas kursi
            </label>
            <select
              id={`${fieldId}-seats`}
              value={seats ?? VEHICLE_SEAT_OPTIONS[2]}
              onChange={(event) => setSeats(Number(event.target.value))}
              className="mt-1 h-11 w-full rounded-sm border border-rule-strong bg-canvas px-3 text-sm text-ink"
            >
              {VEHICLE_SEAT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option} Kursi (Penumpang)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor={`${fieldId}-usage`} className="block text-[13px] font-medium text-ink">
            Karakteristik penggunaan
          </label>
          <input
            id={`${fieldId}-usage`}
            value={usage}
            onChange={(event) => setUsage(event.target.value)}
            className="mt-1 h-11 w-full rounded-sm border border-rule-strong bg-canvas px-3 text-sm text-ink"
            placeholder="Contoh: keluarga, efisien BBM, mobilitas dalam kota"
          />
        </div>

        <fieldset>
          <legend className="text-[13px] font-medium text-ink">Status operasional armada</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={status === option.value ? "confirm" : "outline"}
                aria-pressed={status === option.value}
                onClick={() => setStatus(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-ink-soft">
            Status Disewa diisi otomatis dari booking aktif, jadi tidak bisa dipilih manual di sini.
          </p>
        </fieldset>

        <fieldset>
          <legend className="text-[13px] font-medium text-ink">
            Pilihan moda rental yang diizinkan
          </legend>
          <div className="mt-2 flex flex-wrap gap-4">
            {(["lepas_kunci", "dengan_supir"] as BookingMode[]).map((mode) => (
              <label key={mode} className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={modes.includes(mode)}
                  onChange={() => toggleMode(mode)}
                  className="h-5 w-5 rounded-sm border border-rule-strong accent-teal"
                />
                {mode === "dengan_supir"
                  ? `${BOOKING_MODE_LABEL[mode]} (Operasional 10 Jam/Hari)`
                  : BOOKING_MODE_LABEL[mode]}
              </label>
            ))}
          </div>
          {errors.modes ? <p className="mt-1 text-xs text-danger">{errors.modes}</p> : null}
        </fieldset>

        <div>
          <label htmlFor={`${fieldId}-photo`} className="block text-[13px] font-medium text-ink">
            Foto unit armada (tampak depan atau samping)
          </label>
          <input
            id={`${fieldId}-photo`}
            type="file"
            accept="image/png,image/jpeg"
            onChange={(event) => handlePhoto(event.target.files?.[0])}
            className="mt-1 w-full rounded-sm border border-rule-strong bg-canvas px-3 py-2 text-xs text-ink file:mr-3 file:h-8 file:rounded-sm file:border-0 file:bg-navy file:px-3 file:text-xs file:font-medium file:text-white"
          />
          {errors.photo ? <p className="mt-1 text-xs text-danger">{errors.photo}</p> : null}
          <p className="mt-1 text-[11px] text-ink-soft">
            {photoName
              ? `Berkas dipilih: ${photoName}. Belum diunggah, menunggu backend penyimpanan.`
              : "PNG atau JPG, maksimal 5 MB. Foto tampil di katalog aplikasi pelanggan setelah backend tersambung."}
          </p>
        </div>
      </div>
    </Modal>
  );
}
