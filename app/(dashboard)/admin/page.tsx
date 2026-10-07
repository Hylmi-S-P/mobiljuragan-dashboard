import type { Metadata } from "next";
import { AdminAccountsTable } from "@/components/admin/AdminAccountsTable";
import { PageLead } from "@/components/ui/PageLayout";
import { getAdminAccounts } from "@/lib/api";

export const metadata: Metadata = {
  title: "Manajemen Admin | MobilJuragan",
  description: "Pengelolaan akun pengelola dan hak akses portal operasional MobilJuragan Merauke.",
};

// Render strategi: SSR (Server-Side Rendering) dinamis agar data akun selalu mutakhir
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const accounts = await getAdminAccounts();

  return (
    <>
      <PageLead lead="Akun pengelola portal admin beserta perannya. Data dimuat dari backend Express dan tersimpan di database MariaDB." />
      <AdminAccountsTable initialAccounts={accounts} />
    </>
  );
}
