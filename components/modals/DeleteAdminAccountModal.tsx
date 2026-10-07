"use client";

import { useActionState, useEffect, useId } from "react";
import { useFormStatus } from "react-dom";
import { deleteAdminAction, type ActionState } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { AdminAccount } from "@/lib/types";

type Props = {
  account: AdminAccount;
  onClose: () => void;
};

function ConfirmButton({ formId }: { formId: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" form={formId} variant="danger" disabled={pending}>
      {pending ? "Menghapus..." : "Ya, Hapus Akun"}
    </Button>
  );
}

/**
 * Konfirmasi penghapusan akun staf/admin.
 *
 * Modal menaruh footer di luar <form>, jadi tombol submit di footer ditautkan kembali
 * lewat atribut `form={formId}`. Tanpa itu tombol tidak mengirim apa pun.
 *
 * Kalau backend menolak (mis. akun masih terikat pemesanan atau merupakan admin aktif
 * terakhir), pesan penolakan ditampilkan di dalam modal dan modal tetap terbuka supaya
 * pengguna bisa membaca alasannya, bukan ditutup seolah berhasil.
 */
export function DeleteAdminAccountModal({ account, onClose }: Props) {
  const fieldId = useId();
  const formId = `${fieldId}-delete-admin-form`;
  const [state, formAction] = useActionState<ActionState | null, FormData>(
    deleteAdminAction,
    null
  );

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose]);

  return (
    <Modal
      open
      onClose={onClose}
      title="Hapus Akun Admin?"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose}>
            Batal
          </Button>
          <ConfirmButton formId={formId} />
        </>
      }
    >
      <form id={formId} action={formAction}>
        <input type="hidden" name="id" value={account.id} />
      </form>

      <p className="text-body text-ink">
        Akun <strong>{account.name}</strong> ({account.username}) akan dihapus permanen dari
        database.
      </p>

      {state?.message && !state?.success ? (
        <p
          role="alert"
          className="mt-3 rounded-sm border border-danger/40 bg-danger/10 px-3 py-2 text-meta text-danger"
        >
          {state.message}
        </p>
      ) : null}

      <p className="mt-3 rounded-sm border border-rule bg-canvas px-3 py-2 text-meta text-ink-soft">
        Pertimbangkan menonaktifkan akun lewat menu Edit kalau yang diinginkan hanya mencabut
        aksesnya. Riwayat audit akun ini tetap tersimpan meski akun dihapus.
      </p>
    </Modal>
  );
}
