"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { Vehicle } from "@/lib/types";

type Props = {
  vehicle: Vehicle;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteVehicleModal({ vehicle, onClose, onConfirm }: Props) {
  return (
    <Modal
      open
      onClose={onClose}
      title="Hapus Armada dari Katalog?"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Ya, Hapus Unit
          </Button>
        </>
      }
    >
      <p className="text-body text-ink">
        Unit armada {vehicle.name} dengan plat {vehicle.plate} akan dihapus dari katalog aplikasi
        pelanggan.
      </p>
      <p className="mt-3 rounded-sm border border-rule bg-canvas px-3 py-2 text-meta text-ink-soft">
        Perhatian: kalau unit sedang dalam perbaikan atau masa sewa aktif, ubah statusnya menjadi
        Servis daripada menghapus datanya.
      </p>
    </Modal>
  );
}
