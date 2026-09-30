import { VehicleCatalogTable } from "@/components/fleet/VehicleCatalogTable";
import { ScreenHeader } from "@/components/ui/ScreenHeader";

export default function FleetCatalogPage() {
  return (
    <>
      <ScreenHeader
        heading="Manajemen Armada • Katalog & CMS"
        subheading="Katalog armada resmi, detail spesifikasi, dan penambahan unit baru. Tarif per unit dikonfirmasi tim MobilJuragan saat booking masuk."
      />
      <VehicleCatalogTable />
    </>
  );
}
