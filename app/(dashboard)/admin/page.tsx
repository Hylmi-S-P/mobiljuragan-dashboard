import type { Metadata } from "next";
import { AdminAccountsTable } from "@/components/admin/AdminAccountsTable";
import { getAdminAccounts } from "@/lib/api";

export const metadata: Metadata = {
  title: "Manajemen Admin | MobilJuragan",
  description: "Pengelolaan akun pengelola dan hak akses portal operasional MobilJuragan Merauke.",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const accounts = await getAdminAccounts();

  return <AdminAccountsTable initialAccounts={accounts} />;
}
