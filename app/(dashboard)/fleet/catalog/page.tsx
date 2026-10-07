import type { Metadata } from "next";
import { VehicleCatalogTable } from "@/components/fleet/VehicleCatalogTable";
import { PageLead } from "@/components/ui/PageLayout";
import { getAllVehicles } from "@/lib/operations";

export const metadata: Metadata = {
  title: "Katalog Armada | MobilJuragan",
  description:
    "Katalog resmi armada MobilJuragan Merauke beserta spesifikasi, plat nomor, dan ketersediaan unit.",
};

// Daftar armada harus mengikuti kondisi terkini di MariaDB, jadi dirender ulang tiap request.
export const dynamic = "force-dynamic";

export default async function FleetCatalogPage() {
  const vehicles = await getAllVehicles();

  return (
    <>
      <PageLead lead="Armada resmi, detail spesifikasi, dan penambahan unit baru. Tarif per unit dikonfirmasi tim MobilJuragan saat booking masuk." />
      <VehicleCatalogTable initialVehicles={vehicles} />
    </>
  );
}