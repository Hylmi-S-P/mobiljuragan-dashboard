"use client";

import { useState } from "react";

import { DeleteVehicleModal } from "@/components/modals/DeleteVehicleModal";
import { VehicleFormModal } from "@/components/modals/VehicleFormModal";
import { DataNotice } from "@/components/ui/DataNotice";
import { Button } from "@/components/ui/Button";
import { PlateBadge } from "@/components/ui/PlateBadge";
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
import { IconCar, IconPencil, IconPlus } from "@/components/ui/icons";
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
        <p className="mt-3 rounded-sm border border-rule bg-surface px-3 py-2 text-meta text-ink">
          {notice}
        </p>
      ) : null}

      <div className="mt-4">
        <Panel
          title="Katalog armada resmi"
          icon={<IconCar />}
          action={
            <Button variant="confirm" size="md" onClick={() => setFormTarget({ vehicleId: null })}>
              <IconPlus className="h-4 w-4" />
              Tambah Armada Baru
            </Button>
          }
        >
          <Table caption="Katalog armada resmi MobilJuragan">
            <TableHead>
              <TableRow>
                <TableHeaderCell className="w-[260px]">Kendaraan &amp; Kategori</TableHeaderCell>
                <TableHeaderCell className="w-[185px]">Plat Nomor</TableHeaderCell>
                <TableHeaderCell className="w-[170px]">Transmisi &amp; Kursi</TableHeaderCell>
                <TableHeaderCell className="w-[130px]">Ketersediaan</TableHeaderCell>
                <TableHeaderCell className="w-[220px]">Status &amp; Aksi</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="text-left">
                    <span className="block whitespace-nowrap text-body font-semibold text-ink">
                      {vehicle.name}
                    </span>
                    <span className="mt-1 block truncate text-meta text-ink-soft">
                      {vehicle.category ?? "[kategori belum diisi]"}
                      {vehicle.usage ? ` • ${vehicle.usage}` : ""}
                    </span>
                  </TableCell>
                  <TableCell>
                    <PlateBadge plate={vehicle.plate} region="Merauke" />
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-body tabular-nums">
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
                    <Button
                      variant="outline"
                      onClick={() => setFormTarget({ vehicleId: vehicle.id })}
                    >
                      <IconPencil className="h-4 w-4" />
                      Kelola
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Panel>
      </div>

      {formTarget ? (
        <VehicleFormModal
          vehicle={editing}
          existingPlates={vehicles
            .filter((vehicle) => vehicle.id !== editing?.id)
            .map((vehicle) => vehicle.plate)}
          onClose={() => setFormTarget(null)}
          onRequestDelete={(vehicleId) => {
            setFormTarget(null);
            setDeleteTarget(vehicleId);
          }}
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
