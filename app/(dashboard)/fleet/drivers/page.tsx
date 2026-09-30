import { DriverRosterTable } from "@/components/fleet/DriverRosterTable";
import { ScreenHeader } from "@/components/ui/ScreenHeader";

export default function FleetDriversPage() {
  return (
    <>
      <ScreenHeader
        heading="Manajemen Armada • Daftar & Penugasan Supir"
        subheading="Roster supir resmi MobilJuragan Merauke, rute penugasan, dan status kesiapan untuk armada sewa dengan supir."
      />
      <DriverRosterTable />
    </>
  );
}
