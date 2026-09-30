import { AdminAccountsTable } from "@/components/admin/AdminAccountsTable";
import { ScreenHeader } from "@/components/ui/ScreenHeader";

export default function AdminPage() {
  return (
    <>
      <ScreenHeader
        heading="Manajemen Akun Staf & Hak Akses"
        subheading="Akun pengelola portal admin beserta perannya. Setiap akun memakai kredensial sendiri, tidak dibagikan antar staf."
      />
      <AdminAccountsTable />
    </>
  );
}
