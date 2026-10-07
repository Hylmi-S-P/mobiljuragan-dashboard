import type { Metadata } from "next";
import { DriverRosterTable } from "@/components/fleet/DriverRosterTable";
import { getDrivers } from "@/lib/operations";

export const metadata: Metadata = {
  title: "Roster Supir | MobilJuragan",
  description:
    "Roster supir MobilJuragan Merauke beserta kesiapan bertugas dan wilayah rute yang diampu.",
};

export const dynamic = "force-dynamic";

export default async function FleetDriversPage() {
  const drivers = await getDrivers();

  return <DriverRosterTable initialDrivers={drivers} />;
}
