import type { Metadata } from "next";
import { DriverRosterTable } from "@/components/fleet/DriverRosterTable";
import { PageLead } from "@/components/ui/PageLayout";
import { getDrivers } from "@/lib/operations";

export const metadata: Metadata = {
  title: "Roster Supir | MobilJuragan",
  description:
    "Roster supir MobilJuragan Merauke beserta kesiapan bertugas dan wilayah rute yang diampu.",
};

// Kesiapan supir berubah mengikuti penugasan aktif, jadi data diambil segar tiap request.
export const dynamic = "force-dynamic";

export default async function FleetDriversPage() {
  const drivers = await getDrivers();

  return (
    <>
      <PageLead lead="Roster supir, kesiapan bertugas, dan wilayah rute. Sakelar kesiapan tersambung ke database dan tercatat di riwayat audit." />
      <DriverRosterTable initialDrivers={drivers} />
    </>
  );
}