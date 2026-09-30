"use client";

import { useId, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { DRIVER_ROUTE } from "@/lib/labels";
import type { Driver, DriverRoute } from "@/lib/types";

type Props = {
  driver?: Driver;
  onClose: () => void;
  onSave: (driver: Driver) => void;
};

export function DriverFormModal({ driver, onClose, onSave }: Props) {
  const fieldId = useId();
  const [label, setLabel] = useState(driver?.label ?? "");
  const [contact, setContact] = useState(driver?.contact ?? "");
  const [route, setRoute] = useState<DriverRoute>(driver?.route ?? "dalam_kota");
  const [licenseNumber, setLicenseNumber] = useState(driver?.licenseNumber ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSave() {
    const nextErrors: Record<string, string> = {};
    if (label.trim().length === 0) nextErrors.label = "Nama lengkap supir wajib diisi.";

    const trimmedContact = contact.trim();
    if (trimmedContact.length > 0) {
      const digits = trimmedContact.replace(/[^\d]/g, "");
      if (digits.length < 8) {
        nextErrors.contact = "Nomor kontak minimal 8 angka, boleh memakai tanda + atau tanda hubung.";
      }
    }

    const trimmedLicense = licenseNumber.trim();
    if (trimmedLicense.length > 0 && trimmedLicense.length < 4) {
      nextErrors.licenseNumber = "Nomor SIM minimal 4 karakter kalau diisi.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave({
      id: driver?.id ?? `d-${Date.now()}`,
      label: label.trim(),
      route,
      contact: trimmedContact.length > 0 ? trimmedContact : null,
      licenseNumber: trimmedLicense.length > 0 ? trimmedLicense : null,
      status: driver?.status ?? "siaga",
    });
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={driver ? "Edit Data Supir" : "Tambah Supir Baru"}
      description="Pendaftaran supir resmi MobilJuragan untuk penugasan armada sewa dengan supir."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button variant="confirm" onClick={handleSave}>
            {driver ? "Simpan Perubahan" : "+ Simpan Supir"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor={`${fieldId}-label`} className="block text-[13px] font-medium text-ink">
            Nama lengkap supir
          </label>
          <input
            id={`${fieldId}-label`}
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            aria-invalid={Boolean(errors.label)}
            aria-describedby={errors.label ? `${fieldId}-label-error` : undefined}
            className="mt-1 h-11 w-full rounded-sm border border-rule-strong bg-canvas px-3 text-sm text-ink"
            placeholder="Nama sesuai KTP"
          />
          {errors.label ? (
            <p id={`${fieldId}-label-error`} className="mt-1 text-xs text-danger">
              {errors.label}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${fieldId}-contact`} className="block text-[13px] font-medium text-ink">
            Nomor kontak WhatsApp
          </label>
          <input
            id={`${fieldId}-contact`}
            inputMode="tel"
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            aria-invalid={Boolean(errors.contact)}
            aria-describedby={errors.contact ? `${fieldId}-contact-error` : `${fieldId}-contact-hint`}
            className="tabular-nums mt-1 h-11 w-full rounded-sm border border-rule-strong bg-canvas px-3 text-sm text-ink"
            placeholder="+62 ..."
          />
          {errors.contact ? (
            <p id={`${fieldId}-contact-error`} className="mt-1 text-xs text-danger">
              {errors.contact}
            </p>
          ) : (
            <p id={`${fieldId}-contact-hint`} className="mt-1 text-[11px] text-ink-soft">
              Diisi manual oleh admin, bukan data contoh dari sistem.
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${fieldId}-route`} className="block text-[13px] font-medium text-ink">
            Rute penugasan operasional
          </label>
          <select
            id={`${fieldId}-route`}
            value={route}
            onChange={(event) => setRoute(event.target.value as DriverRoute)}
            className="mt-1 h-11 w-full rounded-sm border border-rule-strong bg-canvas px-3 text-sm text-ink"
          >
            {Object.entries(DRIVER_ROUTE).map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${fieldId}-license`} className="block text-[13px] font-medium text-ink">
            Nomor SIM (SIM A atau SIM B1)
          </label>
          <input
            id={`${fieldId}-license`}
            value={licenseNumber}
            onChange={(event) => setLicenseNumber(event.target.value)}
            aria-invalid={Boolean(errors.licenseNumber)}
            aria-describedby={errors.licenseNumber ? `${fieldId}-license-error` : `${fieldId}-license-hint`}
            className="tabular-nums mt-1 h-11 w-full rounded-sm border border-rule-strong bg-canvas px-3 text-sm text-ink"
            placeholder="Nomor SIM sesuai dokumen"
          />
          {errors.licenseNumber ? (
            <p id={`${fieldId}-license-error`} className="mt-1 text-xs text-danger">
              {errors.licenseNumber}
            </p>
          ) : (
            <p id={`${fieldId}-license-hint`} className="mt-1 text-[11px] text-ink-soft">
              Boleh dikosongkan dulu; nomor SIM diisi manual dari dokumen fisik supir.
            </p>
          )}
        </div>

        <div className="rounded-sm border border-rule bg-canvas px-4 py-3">
          <p className="text-[11px] font-semibold uppercase text-ink-soft">ID supir</p>
          <p className="mt-1 text-[13px] text-ink">
            {driver ? driver.id : "Dibuat sistem saat data disimpan"}
          </p>
        </div>

        {driver ? null : (
          <p className="text-[11px] text-ink-soft">
            Status awal supir baru adalah Siaga. Ubah lewat sakelar di roster kalau belum bisa
            ditugaskan.
          </p>
        )}
      </div>
    </Modal>
  );
}
