"use client";

import { useState } from "react";

import { DeleteDriverModal } from "@/components/modals/DeleteDriverModal";
import { DriverFormModal } from "@/components/modals/DriverFormModal";
import { Button } from "@/components/ui/Button";
import { DataNotice } from "@/components/ui/DataNotice";
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
import { Toggle } from "@/components/ui/Toggle";
import { IconPencil, IconPlus } from "@/components/ui/icons";
import { DRIVER_ROUTE, DRIVER_STATUS } from "@/lib/labels";
import { DRIVERS, SAMPLE_DATA_LABEL } from "@/lib/mockData";

export function DriverRosterTable() {
  const [drivers, setDrivers] = useState(DRIVERS);
  const [formTarget, setFormTarget] = useState<{ driverId: string | null } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const editing = formTarget?.driverId
    ? drivers.find((driver) => driver.id === formTarget.driverId)
    : undefined;
  const deleting = deleteTarget ? drivers.find((driver) => driver.id === deleteTarget) : undefined;

  function setReadiness(driverId: string, ready: boolean) {
    setDrivers((current) =>
      current.map((driver) =>
        driver.id === driverId ? { ...driver, status: ready ? "siaga" : "libur" } : driver,
      ),
    );
  }

  return (
    <>
      <DataNotice label={SAMPLE_DATA_LABEL}>
        Nama supir mengikuti layar contoh; nomor kontak dikosongkan karena datanya belum
        diverifikasi. Perubahan di halaman ini hanya bertahan selama sesi.
      </DataNotice>

      {notice ? (
        <p className="mt-3 rounded-sm border border-rule bg-surface px-3 py-2 text-meta text-ink">
          {notice}
        </p>
      ) : null}

      <div className="mt-4">
        <Panel
          action={
            <Button variant="confirm" size="md" onClick={() => setFormTarget({ driverId: null })}>
              <IconPlus className="h-4 w-4" />
              Tambah Supir Baru
            </Button>
          }
        >
          <Table caption="Roster supir resmi MobilJuragan Merauke">
            <TableHead>
              <TableRow>
                <TableHeaderCell className="w-[260px]">Nama Supir</TableHeaderCell>
                <TableHeaderCell className="w-[200px]">Rute</TableHeaderCell>
                <TableHeaderCell className="w-[330px]">Status Kesiapan</TableHeaderCell>
                <TableHeaderCell className="w-[306px]">Aksi Operasional</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drivers.map((driver) => {
                const onDuty = driver.status === "sedang_tugas";
                return (
                  <TableRow key={driver.id}>
                    <TableCell className="text-left">
                      <span className="block font-semibold">{driver.label}</span>
                      <span className="mt-1 block text-meta text-ink-soft">
                        {driver.contact ?? "[kontak belum diverifikasi]"} •{" "}
                        {driver.licenseNumber ? `SIM ${driver.licenseNumber}` : "[SIM belum diisi]"}
                      </span>
                    </TableCell>
                    <TableCell>{DRIVER_ROUTE[driver.route]}</TableCell>
                    <TableCell>
                      {onDuty ? (
                        <StatusChip tone={DRIVER_STATUS.sedang_tugas.tone}>
                          {DRIVER_STATUS.sedang_tugas.label}
                        </StatusChip>
                      ) : (
                        <Toggle
                          checked={driver.status === "siaga"}
                          onChange={(next) => setReadiness(driver.id, next)}
                          labelOn={DRIVER_STATUS.siaga.label}
                          labelOff={DRIVER_STATUS.libur.label}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        onClick={() => setFormTarget({ driverId: driver.id })}
                      >
                        <IconPencil className="h-4 w-4" />
                        Kelola
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Panel>
      </div>

      {formTarget ? (
        <DriverFormModal
          driver={editing}
          onClose={() => setFormTarget(null)}
          onRequestDelete={(driverId) => {
            setFormTarget(null);
            setDeleteTarget(driverId);
          }}
          onSave={(saved) => {
            setDrivers((current) => {
              const exists = current.some((driver) => driver.id === saved.id);
              return exists
                ? current.map((driver) => (driver.id === saved.id ? saved : driver))
                : [...current, saved];
            });
            setNotice(
              editing
                ? `Data ${saved.label} diperbarui pada sesi ini.`
                : `${saved.label} ditambahkan ke roster dengan status awal Siaga.`,
            );
            setFormTarget(null);
          }}
        />
      ) : null}

      {deleting ? (
        <DeleteDriverModal
          driver={deleting}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            setDrivers((current) => current.filter((driver) => driver.id !== deleting.id));
            setNotice(`${deleting.label} dihapus dari roster pada sesi ini.`);
            setDeleteTarget(null);
          }}
        />
      ) : null}
    </>
  );
}
