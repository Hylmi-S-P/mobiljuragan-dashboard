"use client";

import { useState } from "react";

import { AdminAccountModal } from "@/components/modals/AdminAccountModal";
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
import { ADMIN_ROLE } from "@/lib/labels";
import { ADMIN_ACCOUNTS, SAMPLE_DATA_LABEL } from "@/lib/mockData";

export function AdminAccountsTable() {
  const [accounts, setAccounts] = useState(ADMIN_ACCOUNTS);
  const [formTarget, setFormTarget] = useState<{ accountId: string | null } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const editing = formTarget?.accountId
    ? accounts.find((account) => account.id === formTarget.accountId)
    : undefined;

  return (
    <>
      <DataNotice label={SAMPLE_DATA_LABEL}>
        Dua akun di bawah ini berasal dari layar contoh. Akun yang kamu buat di sini hanya bertahan
        selama sesi dan sandinya tidak disimpan.
      </DataNotice>

      {notice ? (
        <p className="mt-3 rounded-sm border border-rule bg-surface px-3 py-2 text-meta text-ink">
          {notice}
        </p>
      ) : null}

      <div className="mt-4">
        <Panel>
          <Table caption="Akun staf dan hak akses portal admin">
            <TableHead>
              <TableRow>
                <TableHeaderCell className="w-[280px]">Nama</TableHeaderCell>
                <TableHeaderCell className="w-[220px]">Username</TableHeaderCell>
                <TableHeaderCell className="w-[300px]">Role</TableHeaderCell>
                <TableHeaderCell className="w-[150px]">Status Akun</TableHeaderCell>
                <TableHeaderCell className="w-[186px]">Aksi Kelola</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-semibold">{account.name}</TableCell>
                  <TableCell>{account.username}</TableCell>
                  <TableCell>{ADMIN_ROLE[account.role]}</TableCell>
                  <TableCell>
                    <StatusChip tone={account.active ? "available" : "neutral"}>
                      {account.active ? "Aktif" : "Nonaktif"}
                    </StatusChip>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => setFormTarget({ accountId: account.id })}
                    >
                      Edit Admin
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex justify-end">
            <Button variant="confirm" size="md" onClick={() => setFormTarget({ accountId: null })}>
              + Buat Akun Admin Baru
            </Button>
          </div>
        </Panel>
      </div>

      {formTarget ? (
        <AdminAccountModal
          account={editing}
          existingUsernames={accounts
            .filter((account) => account.id !== editing?.id)
            .map((account) => account.username)}
          onClose={() => setFormTarget(null)}
          onSave={(saved) => {
            setAccounts((current) => {
              const exists = current.some((account) => account.id === saved.id);
              return exists
                ? current.map((account) => (account.id === saved.id ? saved : account))
                : [...current, saved];
            });
            setNotice(
              editing
                ? `Akun ${saved.username} diperbarui pada sesi ini.`
                : `Akun ${saved.username} dibuat pada sesi ini.`,
            );
            setFormTarget(null);
          }}
        />
      ) : null}
    </>
  );
}
