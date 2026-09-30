"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { Driver } from "@/lib/types";

type Props = {
  driver: Driver;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteDriverModal({ driver, onClose, onConfirm }: Props) {
  return (
    <Modal
      open
      onClose={onClose}
      title="Hapus Supir?"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Ya, Hapus Supir
          </Button>
        </>
      }
    >
      <p className="text-sm text-ink">
        {driver.label} akan dihapus dari roster supir MobilJuragan.
      </p>
      <p className="mt-3 rounded-sm border border-rule bg-canvas px-3 py-2 text-xs text-ink-soft">
        Periksa statusnya lebih dulu. Kalau supir sedang bertugas, selesaikan atau ubah statusnya
        menjadi Libur daripada menghapus datanya.
      </p>
    </Modal>
  );
}
