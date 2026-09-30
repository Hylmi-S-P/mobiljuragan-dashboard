"use client";

import { useState } from "react";

import { DeleteVehicleModal } from "@/components/modals/DeleteVehicleModal";
import { VehicleFormModal } from "@/components/modals/VehicleFormModal";
import { DataNotice } from "@/components/ui/DataNotice";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/ScreenHeader";
import { StatusChip } from "@/components/ui/StatusChip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import { SAMPLE_DATA_LABEL, VEHICLES } from "@/lib/mockData";
import { VEHICLE_STATUS } from "@/lib/labels";

export function VehicleCatalogTable() {
  const [vehicles, setVehicles] = useState(VEHICLES);
  const [formTarget, setFormTarget] = useState<{ vehicleId: string | null } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const editing = formTarget?.vehicleId
    ? vehicles.find((vehicle) => vehicle.id === formTarget.vehicleId)
    : undefined;
  const deleting = deleteTarget ? vehicles.find((vehicle) => vehicle.id === deleteTarget) : undefined;

  return (
    <>
      <DataNotice label={SAMPLE_DATA_LABEL}>
        Spesifikasi 9 unit mengikuti dokumen master konteks sistem. Unit yang ditambahkan lewat
        modal akan menampilkan penanda sampai kolomnya diisi. Perubahan di halaman ini hanya
        bertahan selama sesi, sampai backend tersambung.
      </DataNotice>

      {notice ? (
        <p className="mt-3 rounded-sm border border-rule bg-surface px-3 py-2 text-xs text-ink">
          {notice}
        </p>
      ) : null}

      <div className="mt-4">
        <Panel>
          <Table caption="Katalog armada resmi MobilJuragan">
            <TableHead>
              <TableRow>
                <TableHeaderCell className="w-[220px]">Kendaraan &amp; Kategori</TableHeaderCell>
                <TableHeaderCell className="w-[256px]">Plat Nomor</TableHeaderCell>
                <TableHeaderCell className="w-[180px]">Transmisi &amp; Kursi</TableHeaderCell>
                <TableHeaderCell className="w-[180px]">Ketersediaan</TableHeaderCell>
                <TableHeaderCell className="w-[300px]">Status &amp; Aksi CMS</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <span className="block font-semibold">{vehicle.name}</span>
                    <span className="mt-1 block text-xs text-ink-soft">
                      {vehicle.category ?? "[kategori belum diisi]"}
                    </span>
                    {vehicle.usage ? (
                      <span className="mt-1 block text-[11px] text-ink-soft">{vehicle.usage}</span>
                    ) : null}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {vehicle.plate} <span className="font-normal text-ink-soft">(Merauke)</span>
                  </TableCell>
                  <TableCell>
                    {vehicle.transmission && vehicle.seats
                      ? `${vehicle.transmission} • ${vehicle.seats} Kursi`
                      : "[belum diisi]"}
                  </TableCell>
                  <TableCell>
                    <StatusChip tone={VEHICLE_STATUS[vehicle.status].tone}>
                      {VEHICLE_STATUS[vehicle.status].label}
                    </StatusChip>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setFormTarget({ vehicleId: vehicle.id })}
                      >
                        Edit / Kelola
                      </Button>
                      <Button variant="ghost" onClick={() => setDeleteTarget(vehicle.id)}>
                        Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-ink">
              Aksi CMS: tambah unit baru, edit spesifikasi unit, atau hapus dari katalog aplikasi
              pelanggan.
            </p>
            <Button variant="confirm" size="md" onClick={() => setFormTarget({ vehicleId: null })}>
              + Tambah Armada Baru
            </Button>
          </div>
        </Panel>
      </div>

      {formTarget ? (
        <VehicleFormModal
          vehicle={editing}
          existingPlates={vehicles
            .filter((vehicle) => vehicle.id !== editing?.id)
            .map((vehicle) => vehicle.plate)}
          onClose={() => setFormTarget(null)}
          onSave={(saved) => {
            setVehicles((current) => {
              const exists = current.some((vehicle) => vehicle.id === saved.id);
              return exists
                ? current.map((vehicle) => (vehicle.id === saved.id ? saved : vehicle))
                : [...current, saved];
            });
            setNotice(
              editing
                ? `Perubahan unit ${saved.name} tersimpan di sesi ini.`
                : `Unit ${saved.name} ditambahkan ke katalog pada sesi ini.`,
            );
            setFormTarget(null);
          }}
        />
      ) : null}

      {deleting ? (
        <DeleteVehicleModal
          vehicle={deleting}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            setVehicles((current) => current.filter((vehicle) => vehicle.id !== deleting.id));
            setNotice(`Unit ${deleting.name} dihapus dari katalog pada sesi ini.`);
            setDeleteTarget(null);
          }}
        />
      ) : null}
    </>
  );
}
