"use client";

import { useId, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ADMIN_ROLE } from "@/lib/labels";
import type { AdminAccount, AdminRole } from "@/lib/types";

type Props = {
  account?: AdminAccount;
  existingUsernames: string[];
  onClose: () => void;
  onSave: (account: AdminAccount) => void;
};

const MIN_PASSWORD_LENGTH = 8;

export function AdminAccountModal({ account, existingUsernames, onClose, onSave }: Props) {
  const fieldId = useId();
  const [name, setName] = useState(account?.name ?? "");
  const [role, setRole] = useState<AdminRole>(account?.role ?? "staf_operasional");
  const [username, setUsername] = useState(account?.username ?? "");
  const [password, setPassword] = useState("");
  const [active, setActive] = useState(account?.active ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSave() {
    const nextErrors: Record<string, string> = {};
    if (name.trim().length === 0) nextErrors.name = "Nama lengkap staf wajib diisi.";

    const normalizedUsername = username.trim().toLowerCase();
    if (normalizedUsername.length < 3) {
      nextErrors.username = "Username minimal 3 karakter.";
    } else if (!/^[a-z0-9._-]+$/.test(normalizedUsername)) {
      nextErrors.username = "Username hanya boleh huruf kecil, angka, titik, garis bawah, dan strip.";
    } else if (existingUsernames.some((item) => item.toLowerCase() === normalizedUsername)) {
      nextErrors.username = "Username ini sudah dipakai akun lain.";
    }

    /* Saat membuat akun sandi wajib diisi; saat mengedit, kosong berarti tidak diganti. */
    if (!account || password.length > 0) {
      if (password.length < MIN_PASSWORD_LENGTH) {
        nextErrors.password = `Sandi minimal ${MIN_PASSWORD_LENGTH} karakter.`;
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave({
      id: account?.id ?? `a-${Date.now()}`,
      name: name.trim(),
      username: normalizedUsername,
      role,
      active,
    });
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={account ? "Edit Akun Admin" : "Buat Akun Admin Baru"}
      description="Pemilik usaha mendaftarkan akun pengelola baru untuk mengakses portal admin MobilJuragan."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button variant="confirm" onClick={handleSave}>
            {account ? "Simpan Perubahan" : "Buat Admin"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor={`${fieldId}-name`} className="block text-[13px] font-medium text-ink">
            Nama lengkap staf atau admin
          </label>
          <input
            id={`${fieldId}-name`}
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${fieldId}-name-error` : undefined}
            className="mt-1 h-11 w-full rounded-sm border border-rule-strong bg-canvas px-3 text-sm text-ink"
            placeholder="Nama sesuai data staf"
          />
          {errors.name ? (
            <p id={`${fieldId}-name-error`} className="mt-1 text-xs text-danger">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${fieldId}-role`} className="block text-[13px] font-medium text-ink">
            Peran dan hak akses
          </label>
          <select
            id={`${fieldId}-role`}
            value={role}
            onChange={(event) => setRole(event.target.value as AdminRole)}
            className="mt-1 h-11 w-full rounded-sm border border-rule-strong bg-canvas px-3 text-sm text-ink"
          >
            {Object.entries(ADMIN_ROLE).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${fieldId}-username`} className="block text-[13px] font-medium text-ink">
              Username
            </label>
            <input
              id={`${fieldId}-username`}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              aria-invalid={Boolean(errors.username)}
              aria-describedby={errors.username ? `${fieldId}-username-error` : undefined}
              className="mt-1 h-11 w-full rounded-sm border border-rule-strong bg-canvas px-3 text-sm text-ink"
              placeholder="nama.staf"
            />
            {errors.username ? (
              <p id={`${fieldId}-username-error`} className="mt-1 text-xs text-danger">
                {errors.username}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor={`${fieldId}-password`} className="block text-[13px] font-medium text-ink">
              Sandi
            </label>
            <input
              id={`${fieldId}-password`}
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? `${fieldId}-password-error` : `${fieldId}-password-hint`}
              className="mt-1 h-11 w-full rounded-sm border border-rule-strong bg-canvas px-3 text-sm text-ink"
            />
            {errors.password ? (
              <p id={`${fieldId}-password-error`} className="mt-1 text-xs text-danger">
                {errors.password}
              </p>
            ) : (
              <p id={`${fieldId}-password-hint`} className="mt-1 text-[11px] text-ink-soft">
                {account
                  ? "Biarkan kosong kalau sandi tidak diganti."
                  : `Minimal ${MIN_PASSWORD_LENGTH} karakter.`}
              </p>
            )}
          </div>
        </div>

        {account ? (
          <fieldset>
            <legend className="text-[13px] font-medium text-ink">Status akun</legend>
            <div className="mt-2 flex gap-2">
              <Button
                variant={active ? "confirm" : "outline"}
                aria-pressed={active}
                onClick={() => setActive(true)}
              >
                Aktif
              </Button>
              <Button
                variant={!active ? "confirm" : "outline"}
                aria-pressed={!active}
                onClick={() => setActive(false)}
              >
                Nonaktif
              </Button>
            </div>
          </fieldset>
        ) : null}

        <div className="rounded-sm border border-rule bg-canvas px-4 py-3">
          <p className="text-[11px] font-semibold uppercase text-ink-soft">Nomor induk staf (NIP)</p>
          <p className="mt-1 text-[13px] text-ink">
            {account ? account.id : "Dibuat sistem saat akun disimpan"}
          </p>
        </div>

        <p className="text-[11px] text-ink-soft">
          Sandi tidak disimpan di prototipe ini. Penyimpanan dan pemeriksaan kredensial dilakukan
          backend saat tersambung.
        </p>
      </div>
    </Modal>
  );
}
